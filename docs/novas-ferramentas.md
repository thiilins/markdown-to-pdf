### 1. Documentador de API (OpenAPI/Swagger to Professional PDF)

Esta ferramenta permitiria que desenvolvedores colassem um JSON/YAML de especificação OpenAPI
(Swagger) para gerar um manual de API completo e formatado.

- **O que faz:** Realiza o parse da especificação e gera um documento Markdown estruturado
  (Endpoints, Parâmetros, Schemas de Resposta) que depois é convertido para PDF usando seus temas
  existentes.
- **Valor Agregado:** Resolve a dor de cabeça de formatar documentação técnica para clientes ou
  stakeholders que preferem PDFs a links do Swagger.
- **Bibliotecas Sugeridas:**
- `@apidevtools/swagger-parser`: Para validar e resolver referências (`$ref`) no arquivo OpenAPI.
- `json-schema-to-markdown-table`: Útil para transformar as definições de objetos em tabelas limpas
  no Markdown.

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

### 5. Cron Expression Visualizer & Descriptor

Uma ferramenta utilitária para DevOps e desenvolvedores backend.

- **O que faz:** O usuário digita uma expressão Cron (ex: `0 0 * * *`) e a ferramenta explica em
  linguagem humana o que ela faz e mostra as próximas 5 datas/horas de execução.
- **Valor Agregado:** Evita erros comuns em agendamentos de tarefas no servidor, fornecendo uma
  validação visual imediata.
- **Bibliotecas Sugeridas:**
- `cronstrue`: Para converter a expressão cron em uma frase legível (suporta Português).
- `cron-parser`: Para calcular e listar as próximas datas de execução baseadas no fuso horário.

---

### Resumo Técnico para Implementação

Para manter a consistência com o que você já construiu, todas essas ferramentas podem herdar o
`ToolShell` e utilizar o sistema de persistência no `IndexedDB` que você já implementou para salvar
rascunhos de documentação ou diagramas.

### 6. Gerador de Tabelas Markdown (Excel/CSV para MD)

Escrever tabelas no Markdown manualmente é uma das tarefas mais odiadas pelos devs.

- **O que faz:** Permite colar dados do Excel/Google Sheets ou fazer upload de um arquivo CSV e
  convertê-los instantaneamente em uma tabela Markdown formatada.
- **Valor Agregado:** Agiliza a criação de documentação técnica e relatórios.
- **Bibliotecas Sugeridas:** \* `papaparse`: Para o parse robusto de CSV no cliente.
- `xlsx`: Se quiser suporte direto para arquivos `.xlsx`.
- `turndown`: (Você já tem no `package.json`) pode ser usado para converter HTML colado em MD.

### 7. JSON Schema Studio (Gerador e Validador)

Diferente do `json-to-ts` que você já possui, esta ferramenta foca na estrutura de validação.

- **O que faz:** Gera automaticamente um **JSON Schema** (Draft 7/2020-12) a partir de um JSON de
  exemplo e permite validar outros objetos JSON contra esse esquema.
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

### 9. Palette Studio & WCAG Checker (Design para Devs)

Alinhado com sua preocupação em não parecer "feito por IA", esta ferramenta foca em dados
matemáticos de design.

- **O que faz:** Gera paletas de cores a partir de uma cor base ou imagem, mas o diferencial é o
  **validador de contraste WCAG 2.1** (AA/AAA) integrado.
- **Valor Agregado:** Ajuda devs a criarem interfaces acessíveis. Garante que o texto seja legível
  sobre o fundo.
- **Bibliotecas Sugeridas:**
- `chroma-js`: Para manipulação de cores e cálculos de contraste.
- `color-thief`: Para extrair cores dominantes de imagens.

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
