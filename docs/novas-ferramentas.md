### 2. Arquiteto de Banco de Dados (SQL DDL to ER Diagram)

Uma ferramenta visual onde o usuário cola scripts SQL `CREATE TABLE` e visualiza o diagrama de
Entidade-Relacionamento (ERD).

- **O que faz:** Converte o código SQL bruto em sintaxe Mermaid.js (que está no seu roadmap) para
  renderizar o diagrama.
- **Valor Agregado:** Auxilia no planejamento de banco de dados e na criação de documentação técnica
  visual sem precisar de ferramentas pesadas como MySQL Workbench.
- **Bibliotecas Sugeridas:**
- `sql-ddl-to-json-schema`: Converte o SQL para um formato JSON estruturado, facilitando o
  mapeamento para diagramas.
- `mermaid`: Para a renderização visual (aproveitando a integração que você já planejou).

### 3. GitHub Repository Documenter (Repo to Single MD/PDF)

Uma ferramenta de "resumo de projeto" que consome a API do GitHub.

- **O que faz:** O usuário insere a URL de um repositório público. A ferramenta busca o `README.md`,
  a árvore de arquivos e os principais arquivos de documentação (`docs/`), unindo tudo em um único
  documento estruturado.
- **Valor Agregado:** Útil para criar manuais de integração de bibliotecas ou para que
  desenvolvedores tenham uma versão offline/impressa de um repositório para estudo.
- **Bibliotecas Sugeridas:**
- `octokit`: Cliente oficial para interagir com a API do GitHub.
- `tree-node-cli`: Você pode adaptar a lógica para gerar a visualização da árvore de diretórios em
  texto/markdown.

### 4. SVGR Studio (SVG to React/Next.js Component)

Focada em desenvolvedores frontend que usam o seu stack (Next.js/React).

- **O que faz:** O usuário solta um arquivo SVG e a ferramenta gera o código de um componente React
  funcional, higienizado e tipado em TypeScript.
- **Valor Agregado:** Automatiza uma tarefa repetitiva de frontend, garantindo que o código gerado
  siga as melhores práticas (acessibilidade, remoção de atributos inúteis).
- **Bibliotecas Sugeridas:**
- `@svgr/core`: O motor principal de conversão de SVG para JSX.
- `prettier`: (Você já tem no `package.json`) para formatar o código gerado.

### 7. JSON Schema Studio (Gerador e Validador)

Diferente do `json-to-ts` que você já possui, esta ferramenta foca na estrutura de validação.

- **O que faz:** Gera automaticamente um **JSON Schema** a partir de um JSON de exemplo e permite
  validar outros objetos JSON contra esse esquema.
- **Valor Agregado:** Essencial para devs backend que precisam definir contratos de API ou validar
  configurações complexas.
- **Bibliotecas Sugeridas:**
- `ajv`: O validador de JSON Schema mais rápido para JavaScript.
- `json-schema-generator`: Para a geração automática a partir do input.

### 8. SVG Optimizer & Health Check (SVGO Web)

Focada em performance web e limpeza de código frontend.

- **O que faz:** O usuário sobe um SVG e a ferramenta remove metadados inúteis (do
  Illustrator/Figma), simplifica paths e minifica o código sem perder qualidade visual.
- **Valor Agregado:** Reduz o peso das páginas web. É o "TinyPNG" para vetores.
- **Bibliotecas Sugeridas:**
- `svgo`: O padrão da indústria para otimização de SVGs. Funciona bem no browser via Web Workers
  para não travar a UI.

### 10. .env Architect (Manager & Template Generator)

Gerenciar variáveis de ambiente pode ser perigoso se feito errado.

- **O que faz:** O usuário cola um arquivo `.env` e a ferramenta gera automaticamente um
  `.env.example` (removendo os valores sensíveis mas mantendo as chaves e comentários). Também
  valida se há chaves duplicadas.
- **Valor Agregado:** Segurança e organização de repositórios. Evita que segredos sejam commitados
  por engano.
- **Bibliotecas Sugeridas:**
- `dotenv`: Para o parse correto das regras de escape e quebras de linha.

### 11. Security Header & CSP Auditor

Uma ferramenta de diagnóstico rápido de segurança.

- **O que faz:** O usuário cola as URLs ou os headers de resposta de um site, e a ferramenta analisa
  a presença e configuração de headers como `Content-Security-Policy`, `HSTS`, `X-Frame-Options`,
  etc.
- **Valor Agregado:** Útil para auditorias rápidas de segurança em aplicações web.
- **Bibliotecas Sugeridas:** \* Lógica customizada baseada nas recomendações da **OWASP**.

---

### Por que essas ferramentas agregam valor ao seu stack atual?

1. **Aproveitam sua UI:** Todas podem usar o seu componente `ToolShell` e os editores Monaco que
   você já configurou.
2. **Baixo Custo de Servidor:** A maioria dessas lógicas (como CSV parse, SVG optimization e Color
   math) pode ser executada 100% no **lado do cliente**, evitando os problemas de timeout que você
   enfrenta no Scraper na Vercel.
3. **Showcase Técnico:** Implementar um otimizador de SVG ou um gerador de JSON Schema demonstra que
   você entende de manipulação de árvores de dados (AST) e buffers, o que é muito bem visto em
   portfólios.

## NOVAS FERRAMENTAS

- 6. Extração de PDFs Usar pdf-parse ou pdfjs-dist Converter PDF → Markdown Esforço: 4-6 horas
- 7. Extração de Vídeos (Transcrição) YouTube: usar API ou youtube-transcript Gerar Markdown com
     timestamps Esforço: 6-8 horas
- 8. Sitemap Crawler Baixar sitemap.xml Extrair todas as URLs Processar em batch Esforço: 4-5 horas
