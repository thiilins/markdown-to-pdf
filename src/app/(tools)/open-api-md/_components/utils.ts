import SwaggerParser from '@apidevtools/swagger-parser'
import type { OpenAPIV3 } from 'openapi-types'
import { PETSTORE_OPENAPI } from './constants'

export interface ParsedOpenAPI {
  title: string
  version: string
  description?: string
  servers?: Array<{ url: string; description?: string }>
  paths: ParsedPath[]
  schemas: ParsedSchema[]
  securitySchemes?: Record<string, any>
}

export interface ParsedPath {
  path: string
  method: string
  summary?: string
  description?: string
  operationId?: string
  tags?: string[]
  parameters?: ParsedParameter[]
  requestBody?: ParsedRequestBody
  responses: ParsedResponse[]
  security?: any[]
}

export interface ParsedParameter {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  required: boolean
  description?: string
  schema?: any
  example?: any
}

export interface ParsedRequestBody {
  description?: string
  required: boolean
  content: Record<string, { schema?: any; example?: any }>
}

export interface ParsedResponse {
  statusCode: string
  description: string
  content?: Record<string, { schema?: any; example?: any }>
}

export interface ParsedSchema {
  name: string
  type: string
  description?: string
  properties?: Record<string, any>
  required?: string[]
  example?: any
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Valida se o input é um JSON ou YAML válido
 */
export function validateInput(input: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!input.trim()) {
    return { isValid: true, errors: [], warnings: [] }
  }

  try {
    // Tenta parsear como JSON primeiro
    JSON.parse(input)
    return { isValid: true, errors, warnings }
  } catch (jsonError) {
    // Se falhar como JSON, tenta como YAML
    try {
      const yaml = require('js-yaml')
      yaml.load(input)
      return { isValid: true, errors, warnings }
    } catch (yamlError: any) {
      errors.push(`Formato inválido: ${yamlError.message}`)
      return { isValid: false, errors, warnings }
    }
  }
}

/**
 * Faz o parse completo da especificação OpenAPI
 */
export async function parseOpenAPI(input: string): Promise<ParsedOpenAPI> {
  if (!input.trim()) {
    throw new Error('Especificação vazia')
  }

  let spec: any

  try {
    // Tenta parsear como JSON
    spec = JSON.parse(input)
  } catch {
    // Se falhar, tenta como YAML
    const yaml = require('js-yaml')
    spec = yaml.load(input)
  }

  // Valida e resolve referências usando swagger-parser
  const api = (await SwaggerParser.validate(spec)) as OpenAPIV3.Document

  // Extrai informações básicas
  const parsed: ParsedOpenAPI = {
    title: api.info.title,
    version: api.info.version,
    description: api.info.description,
    servers: api.servers?.map((s: OpenAPIV3.ServerObject) => ({
      url: s.url,
      description: s.description,
    })),
    paths: [],
    schemas: [],
    securitySchemes: (api.components as any)?.securitySchemes,
  }

  // Processa paths
  if (api.paths) {
    for (const [pathKey, pathItem] of Object.entries(api.paths)) {
      if (!pathItem) continue

      const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'] as const

      for (const method of methods) {
        const operation = (pathItem as any)[method] as OpenAPIV3.OperationObject | undefined
        if (!operation) continue

        const parsedPath: ParsedPath = {
          path: pathKey,
          method: method.toUpperCase(),
          summary: operation.summary,
          description: operation.description,
          operationId: operation.operationId,
          tags: operation.tags,
          parameters: [],
          responses: [],
          security: operation.security,
        }

        // Processa parâmetros
        if (operation.parameters) {
          parsedPath.parameters = operation.parameters.map((param: any) => ({
            name: param.name,
            in: param.in,
            required: param.required || false,
            description: param.description,
            schema: param.schema,
            example: param.example,
          }))
        }

        // Processa request body
        if (operation.requestBody) {
          const reqBody = operation.requestBody as OpenAPIV3.RequestBodyObject
          parsedPath.requestBody = {
            description: reqBody.description,
            required: reqBody.required || false,
            content: reqBody.content as any,
          }
        }

        // Processa responses
        if (operation.responses) {
          for (const [statusCode, response] of Object.entries(operation.responses)) {
            const resp = response as OpenAPIV3.ResponseObject
            parsedPath.responses.push({
              statusCode,
              description: resp.description,
              content: resp.content as any,
            })
          }
        }

        parsed.paths.push(parsedPath)
      }
    }
  }

  // Processa schemas
  if (api.components?.schemas) {
    for (const [schemaName, schema] of Object.entries(api.components.schemas)) {
      const schemaObj = schema as OpenAPIV3.SchemaObject
      parsed.schemas.push({
        name: schemaName,
        type: schemaObj.type as string,
        description: schemaObj.description,
        properties: schemaObj.properties,
        required: schemaObj.required,
        example: schemaObj.example,
      })
    }
  }

  return parsed
}

/**
 * Converte a especificação parseada para Markdown
 */
export function convertToMarkdown(parsed: ParsedOpenAPI): string {
  let markdown = ''

  // Cabeçalho
  markdown += `# ${parsed.title}\n\n`
  markdown += `**Versão:** ${parsed.version}\n\n`

  if (parsed.description) {
    markdown += `${parsed.description}\n\n`
  }

  markdown += '---\n\n'

  // Servidores
  if (parsed.servers && parsed.servers.length > 0) {
    markdown += '## 🌐 Servidores\n\n'
    for (const server of parsed.servers) {
      markdown += `- **${server.url}**`
      if (server.description) {
        markdown += ` - ${server.description}`
      }
      markdown += '\n'
    }
    markdown += '\n'
  }

  // Autenticação
  if (parsed.securitySchemes && Object.keys(parsed.securitySchemes).length > 0) {
    markdown += '## 🔐 Autenticação\n\n'
    for (const [schemeName, scheme] of Object.entries(parsed.securitySchemes)) {
      markdown += `### ${schemeName}\n\n`
      markdown += `- **Tipo:** ${scheme.type}\n`
      if (scheme.scheme) markdown += `- **Esquema:** ${scheme.scheme}\n`
      if (scheme.bearerFormat) markdown += `- **Formato:** ${scheme.bearerFormat}\n`
      if (scheme.description) markdown += `- **Descrição:** ${scheme.description}\n`
      markdown += '\n'
    }
  }

  // Agrupa endpoints por tag
  const pathsByTag = new Map<string, ParsedPath[]>()
  const untaggedPaths: ParsedPath[] = []

  for (const path of parsed.paths) {
    if (path.tags && path.tags.length > 0) {
      for (const tag of path.tags) {
        if (!pathsByTag.has(tag)) {
          pathsByTag.set(tag, [])
        }
        pathsByTag.get(tag)!.push(path)
      }
    } else {
      untaggedPaths.push(path)
    }
  }

  // Endpoints
  markdown += '## 📡 Endpoints\n\n'

  // Endpoints com tags
  for (const [tag, paths] of pathsByTag) {
    markdown += `### ${tag}\n\n`
    for (const path of paths) {
      markdown += formatEndpoint(path)
    }
  }

  // Endpoints sem tags
  if (untaggedPaths.length > 0) {
    markdown += '### Outros\n\n'
    for (const path of untaggedPaths) {
      markdown += formatEndpoint(path)
    }
  }

  // Schemas
  if (parsed.schemas.length > 0) {
    markdown += '## 📦 Schemas\n\n'
    for (const schema of parsed.schemas) {
      markdown += formatSchema(schema)
    }
  }

  return markdown
}

/**
 * Formata um endpoint individual
 */
function formatEndpoint(path: ParsedPath): string {
  let md = ''

  // Título do endpoint
  md += `#### \`${path.method}\` ${path.path}\n\n`

  if (path.summary) {
    md += `**${path.summary}**\n\n`
  }

  if (path.description) {
    md += `${path.description}\n\n`
  }

  // Parâmetros
  if (path.parameters && path.parameters.length > 0) {
    md += '**Parâmetros:**\n\n'
    md += '| Nome | Tipo | Obrigatório | Descrição |\n'
    md += '|------|------|-------------|------------|\n'
    for (const param of path.parameters) {
      const type = param.schema?.type || 'string'
      const required = param.required ? '✅' : '❌'
      const description = param.description || '-'
      md += `| \`${param.name}\` (${param.in}) | ${type} | ${required} | ${description} |\n`
    }
    md += '\n'
  }

  // Request Body
  if (path.requestBody) {
    md += '**Request Body:**\n\n'
    md += `- **Obrigatório:** ${path.requestBody.required ? 'Sim' : 'Não'}\n`
    if (path.requestBody.description) {
      md += `- **Descrição:** ${path.requestBody.description}\n`
    }
    md += '\n'

    for (const [contentType, content] of Object.entries(path.requestBody.content)) {
      md += `**Content-Type:** \`${contentType}\`\n\n`
      if (content.schema) {
        md += '```json\n'
        md += JSON.stringify(content.example || content.schema, null, 2)
        md += '\n```\n\n'
      }
    }
  }

  // Responses
  if (path.responses.length > 0) {
    md += '**Respostas:**\n\n'
    for (const response of path.responses) {
      md += `- **${response.statusCode}** - ${response.description}\n`
      if (response.content) {
        for (const [contentType, content] of Object.entries(response.content)) {
          if (content.example || content.schema) {
            md += `  \`\`\`json\n`
            md += `  ${JSON.stringify(content.example || content.schema, null, 2)}\n`
            md += `  \`\`\`\n`
          }
        }
      }
    }
    md += '\n'
  }

  md += '---\n\n'
  return md
}

/**
 * Formata um schema individual
 */
function formatSchema(schema: ParsedSchema): string {
  let md = ''

  md += `### ${schema.name}\n\n`

  if (schema.description) {
    md += `${schema.description}\n\n`
  }

  md += `**Tipo:** \`${schema.type}\`\n\n`

  if (schema.properties) {
    md += '**Propriedades:**\n\n'
    md += '| Nome | Tipo | Obrigatório | Descrição |\n'
    md += '|------|------|-------------|------------|\n'

    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const prop = propSchema as any
      const type = prop.type || 'object'
      const required = schema.required?.includes(propName) ? '✅' : '❌'
      const description = prop.description || '-'
      md += `| \`${propName}\` | ${type} | ${required} | ${description} |\n`
    }
    md += '\n'
  }

  if (schema.example) {
    md += '**Exemplo:**\n\n'
    md += '```json\n'
    md += JSON.stringify(schema.example, null, 2)
    md += '\n```\n\n'
  }

  md += '---\n\n'
  return md
}

/**
 * Exemplos de especificações OpenAPI
 */
export const EXAMPLE_SPECS = {
  petstore: PETSTORE_OPENAPI,
  simple: `openapi: 3.0.0
info:
  title: API de Usuários
  version: 1.0.0
  description: API simples para gerenciamento de usuários
paths:
  /users:
    get:
      summary: Listar usuários
      responses:
        '200':
          description: Sucesso
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string`,
}
