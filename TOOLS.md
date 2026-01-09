# 🛠️ MD to PDF Pro - Documentação Completa de Ferramentas

> **Versão:** 0.16.0
> **Última Atualização:** Janeiro 2026
> **Total de Ferramentas:** 17

---

## 📑 Índice

### 📝 Markdown & Documentação
1. [MD Editor](#1-md-editor)
2. [MD to PDF](#2-md-to-pdf)
3. [MD to HTML](#3-md-to-html)
4. [Web Extractor](#4-web-extractor)
5. [OpenAPI to MD](#5-openapi-to-md)
6. [Code Snapshot](#6-code-snapshot)

### 🎨 Formatadores de Código
7. [JSON Formatter](#7-json-formatter)
8. [SQL Formatter](#8-sql-formatter)
9. [HTML Formatter](#9-html-formatter)
10. [CSS Formatter](#10-css-formatter)
11. [JavaScript Formatter](#11-javascript-formatter)

### 🔄 Conversores & Utilitários
12. [JSON to TypeScript](#12-json-to-typescript)
13. [Diff Checker](#13-diff-checker)
14. [Base64 Converter](#14-base64-converter)
15. [HTML to Text](#15-html-to-text)
16. [Extrator de Dados](#16-extrator-de-dados)
17. [Gist Explorer](#17-gist-explorer)
18. [Cron Tools](#18-cron-tools)
19. [Excel/CSV to Markdown](#19-excelcsv-to-markdown)
20. [Color Studio](#20-color-studio)

### 🔒 Segurança
21. [Gerador de Senhas](#21-gerador-de-senhas)
22. [JWT Debugger](#22-jwt-debugger)

---

## 📝 Markdown & Documentação

### 1. MD Editor

**Rota:** `/md-editor`
**Descrição:** Editor Markdown profissional com preview em tempo real

#### ✨ Funcionalidades Principais

**Editor Monaco:**
- Syntax highlighting para Markdown
- Line numbers configuráveis
- Minimap opcional
- Word wrap
- Font size ajustável
- Scroll sincronizado com preview
- Atalhos de teclado (Ctrl+F para busca, Ctrl+Z/Y para undo/redo)

**Toolbar Completa:**
- **Formatação de Texto:**
  - Bold (`**texto**`)
  - Italic (`*texto*`)
  - Strikethrough (`~~texto~~`)
  - Inline Code (`` `código` ``)

- **Headings:**
  - H1 até H6 (`# Título`)
  - Menu dropdown para seleção rápida

- **Listas:**
  - Lista não ordenada (`- item`)
  - Lista ordenada (`1. item`)
  - Checkbox/Task list (`- [ ] tarefa`)

- **Inserções:**
  - Links (`[texto](url)`)
  - Imagens (`![alt](url)`)
  - Blockquotes (`> citação`)
  - Code blocks (` ``` linguagem `)
  - Horizontal rule (`---`)
  - Page break (para PDF)

- **Tabelas:**
  - Gerador visual de tabelas
  - Configuração de linhas e colunas
  - Inserção automática com formatação

- **Callouts/Admonitions:**
  - NOTE (informação)
  - TIP (dica)
  - IMPORTANT (importante)
  - WARNING (aviso)
  - CAUTION (cuidado)

**Funcionalidades Avançadas:**
- **TOC Automático:** Gera índice a partir dos headings
- **Busca e Substituição:** Ctrl+F para find/replace
- **Formatação Automática:** Prettier integrado para limpar código
- **Undo/Redo:** Histórico completo de edições
- **Status Bar:** Contagem de palavras, caracteres e linhas

**Integração com GitHub Gists:**
- Salvar documentos como Gists (públicos ou privados)
- Carregar Gists existentes
- Atualizar Gists salvos
- Sistema de tags para organização
- Metadados customizáveis

**Preview em Tempo Real:**
- Renderização completa de Markdown
- Suporte a GFM (GitHub Flavored Markdown)
- Syntax highlighting em code blocks
- Renderização de tabelas
- Emojis
- Task lists interativas
- Links clicáveis

#### 🎯 Casos de Uso

- Escrever documentação técnica
- Criar READMEs de projetos
- Redigir artigos e posts
- Tomar notas estruturadas
- Preparar documentos para conversão em PDF/HTML

#### ⚙️ Configurações

- **Tema:** Light, Dark ou Auto (segue sistema)
- **Font Size:** Ajustável via configurações
- **Word Wrap:** Ativar/desativar quebra de linha
- **Minimap:** Mostrar/ocultar minimap
- **Line Numbers:** Mostrar/ocultar números de linha

---

### 2. MD to PDF

**Rota:** `/md-to-pdf`
**Descrição:** Converta Markdown em PDFs profissionais com paginação e estilos

#### ✨ Funcionalidades Principais

**Editor Integrado:**
- Mesmo editor Monaco do MD Editor
- Toolbar completa de Markdown
- Scroll sincronizado com preview paginado

**Preview Paginado:**
- Visualização realista de páginas
- Paginação automática inteligente
- Quebras de página respeitadas
- Numeração de páginas
- Contador de páginas total

**Configuração de Página:**
- **Tamanhos Predefinidos:**
  - A4 (210 x 297mm)
  - Letter (8.5 x 11in)
  - Legal (8.5 x 14in)
  - Custom (dimensões personalizadas)

- **Margens Ajustáveis:**
  - Top, Bottom, Left, Right
  - Valores em mm ou polegadas
  - Preview em tempo real

- **Orientação:**
  - Portrait (retrato)
  - Landscape (paisagem)

**Header e Footer Personalizáveis:**
- **Variáveis Dinâmicas:**
  - `{{page}}` - Número da página atual
  - `{{totalPages}}` - Total de páginas
  - `{{title}}` - Título do documento
  - `{{date}}` - Data atual
  - `{{author}}` - Autor
  - Texto customizado

- **Posicionamento:**
  - Left (esquerda)
  - Center (centro)
  - Right (direita)

- **Altura Configurável:**
  - Ajuste de altura do header/footer
  - Espaçamento automático do conteúdo

**Temas de Estilo:**
- **GitHub:** Estilo clássico do GitHub
- **GitLab:** Visual do GitLab
- **VS Code:** Tema escuro do VS Code
- **Academic:** Para documentos acadêmicos
- **Minimal:** Design minimalista
- **Modern:** Estilo moderno e clean
- **Classic:** Tradicional e formal

**Tipografia:**
- Escolha de fonte (Serif, Sans-serif, Monospace)
- Tamanho de fonte ajustável
- Line height configurável
- Espaçamento entre parágrafos

**Funcionalidades Markdown:**
- Suporte completo a GFM
- Syntax highlighting em code blocks (50+ linguagens)
- Tabelas com formatação
- Task lists
- Blockquotes
- Imagens (inline ou referência)
- Links (internos e externos)
- Listas aninhadas
- Horizontal rules
- Emojis

**Recursos Avançados:**
- **TOC Automático:** Índice gerado dos headings
- **Validação de Links:** Verifica links quebrados
- **Sanitização HTML:** Segurança contra XSS
- **Page Breaks:** Controle manual de quebras
- **Scroll Sync:** Editor e preview sincronizados

**Exportação:**
- Download direto como PDF
- Impressão via navegador (Ctrl+P)
- Configurações de impressão preservadas
- Qualidade de exportação otimizada

#### 🎯 Casos de Uso

- Gerar documentação técnica em PDF
- Criar relatórios profissionais
- Produzir ebooks e guias
- Preparar artigos acadêmicos
- Exportar apresentações
- Criar manuais de usuário

#### ⚙️ Configurações Recomendadas

**Para Documentação Técnica:**
- Tema: GitHub ou VS Code
- Tamanho: A4
- Margens: 20mm
- Header: Título do documento (center)
- Footer: Página {{page}}/{{totalPages}} (right)

**Para Relatórios:**
- Tema: Academic ou Modern
- Tamanho: A4 ou Letter
- Margens: 25mm
- Header: Empresa/Logo (left), Data (right)
- Footer: Confidencial (left), Página (right)

**Para Ebooks:**
- Tema: Minimal ou Classic
- Tamanho: Custom (6x9in)
- Margens: 15mm
- Header: Título do capítulo (center)
- Footer: Número da página (center)

---

### 3. MD to HTML

**Rota:** `/md-to-html`
**Descrição:** Converta Markdown em HTML semântico e otimizado

#### ✨ Funcionalidades Principais

**Conversão Markdown → HTML:**
- Parser GFM completo
- HTML semântico (`<article>`, `<section>`, `<header>`)
- Atributos ARIA para acessibilidade
- Classes CSS customizáveis

**Suporte a GFM:**
- Tabelas com `<thead>` e `<tbody>`
- Task lists com checkboxes
- Strikethrough
- Autolinks
- Emojis convertidos para Unicode

**Syntax Highlighting:**
- Code blocks com classes de linguagem
- Suporte a 50+ linguagens
- Integração com Prism.js ou Highlight.js
- Temas de código configuráveis

**Sanitização:**
- Remoção de scripts maliciosos
- Whitelist de tags HTML
- Escape de atributos perigosos
- Proteção contra XSS

**Otimização SEO:**
- Meta tags geradas
- Headings hierárquicos corretos
- Alt text em imagens
- Structured data (Schema.org)
- URLs amigáveis

**Opções de Exportação:**
- HTML puro (sem CSS)
- HTML com CSS inline
- HTML com link para CSS externo
- HTML completo (<!DOCTYPE>, <html>, <head>, <body>)
- Snippet HTML (apenas conteúdo)

**Preview:**
- Visualização em tempo real
- Modo split (Markdown | HTML | Preview)
- Syntax highlighting do HTML gerado
- Cópia rápida do código

#### 🎯 Casos de Uso

- Gerar conteúdo para blogs
- Criar páginas estáticas
- Preparar emails HTML
- Integrar em CMSs
- Exportar documentação para web
- Converter READMEs para sites

#### ⚙️ Configurações

- **Formato de Saída:**
  - HTML5 semântico
  - XHTML
  - HTML4 (compatibilidade)

- **Inclusões:**
  - CSS inline
  - JavaScript inline
  - Meta tags
  - Favicon

---

### 4. Web Extractor

**Rota:** `/web-extractor`
**Descrição:** Extraia conteúdo limpo de qualquer URL

#### ✨ Funcionalidades Principais

**Extração Inteligente:**
- Detecta automaticamente o conteúdo principal
- Remove ads, sidebars, popups
- Preserva formatação essencial
- Extrai imagens relevantes

**Metadados:**
- Título do artigo
- Autor
- Data de publicação
- Descrição/resumo
- Tags/categorias
- Tempo de leitura estimado

**Conversão para Markdown:**
- Headings preservados
- Parágrafos formatados
- Listas convertidas
- Links mantidos
- Imagens com alt text
- Blockquotes
- Code blocks (se detectados)

**Limpeza Avançada:**
- Remoção de scripts
- Remoção de estilos inline
- Limpeza de tracking pixels
- Remoção de iframes
- Sanitização de HTML

**Múltiplas URLs:**
- Processar várias URLs em batch
- Combinar múltiplos artigos
- Exportação em lote

**Formatos de Saída:**
- Markdown
- HTML limpo
- Texto puro
- JSON (com metadados)

#### 🎯 Casos de Uso

- Salvar artigos para leitura offline
- Criar arquivos de pesquisa
- Extrair conteúdo de blogs
- Preparar material para estudo
- Converter posts para Markdown
- Arquivar documentação web

#### ⚙️ Configurações

- **Modo de Extração:**
  - Automático (detecta conteúdo)
  - Manual (seletor CSS)
  - Readability (algoritmo Mozilla)

- **Filtros:**
  - Mínimo de palavras
  - Incluir/excluir imagens
  - Preservar links
  - Incluir metadados

---

### 5. OpenAPI to MD

**Rota:** `/open-api-md`
**Descrição:** Gere documentação Markdown a partir de especificações OpenAPI/Swagger

#### ✨ Funcionalidades Principais

**Suporte a Especificações:**
- OpenAPI 3.0.x
- OpenAPI 3.1.x
- Swagger 2.0
- Validação automática de spec

**Parsing Completo:**
- Resolução de `$ref` (referências)
- Schemas aninhados
- Componentes reutilizáveis
- Security schemes
- Examples e descriptions

**Documentação Gerada:**

**1. Informações Gerais:**
- Título da API
- Versão
- Descrição
- Termos de serviço
- Contato
- Licença
- Servidores disponíveis

**2. Autenticação:**
- Tipos suportados (Bearer, API Key, OAuth2, etc.)
- Localização (header, query, cookie)
- Fluxos OAuth2
- Scopes necessários

**3. Endpoints:**
- Método HTTP (GET, POST, PUT, DELETE, PATCH)
- Path com parâmetros
- Descrição
- Tags/categorias
- Deprecated (se aplicável)

**4. Parâmetros:**
- Query parameters
- Path parameters
- Header parameters
- Cookie parameters
- Tipo, required, default, enum

**5. Request Body:**
- Content-Type suportados
- Schema do body
- Exemplos
- Required fields

**6. Responses:**
- Status codes (200, 400, 404, 500, etc.)
- Descrição de cada código
- Schema da resposta
- Headers da resposta
- Exemplos de sucesso/erro

**7. Schemas:**
- Models/DTOs
- Propriedades e tipos
- Required fields
- Validações (min, max, pattern)
- Enums
- Nested objects
- Arrays

**Formatação Markdown:**
- Tabelas para parâmetros
- Code blocks para exemplos JSON
- Syntax highlighting
- Links internos (âncoras)
- Badges para métodos HTTP
- Emojis para status

**Organização:**
- Por tags (agrupamento lógico)
- Por paths (ordem alfabética)
- TOC automático
- Índice de schemas

**Exemplos de Código:**
- Request examples (curl, JavaScript, Python)
- Response examples (JSON, XML)
- Authentication examples

#### 🎯 Casos de Uso

- Gerar README de APIs
- Criar documentação para desenvolvedores
- Exportar specs para portais
- Preparar material de onboarding
- Documentar microsserviços
- Criar changelogs de API

#### ⚙️ Configurações

- **Formato de Saída:**
  - Markdown puro
  - Markdown com TOC
  - Markdown com badges
  - HTML (via MD to HTML)

- **Inclusões:**
  - Exemplos de código
  - Schemas completos
  - Security details
  - Server information

---

### 6. Code Snapshot

**Rota:** `/code-snapshot`
**Descrição:** Crie imagens profissionais de código para redes sociais e documentação

#### ✨ Funcionalidades Principais

**Editor de Código:**
- Monaco Editor integrado
- Syntax highlighting em tempo real
- 150+ linguagens suportadas
- Line numbers configuráveis
- Word wrap opcional

**Temas de Sintaxe (50+):**
- **Dark Themes:**
  - VS Code Dark+
  - Dracula
  - One Dark
  - Monokai
  - Nord
  - Tokyo Night
  - Solarized Dark
  - Material Theme
  - Atom One Dark
  - Cobalt2

- **Light Themes:**
  - VS Code Light
  - GitHub Light
  - Solarized Light
  - Atom One Light
  - Material Light

**Fontes Monospace (20+):**
- Fira Code (com ligatures)
- JetBrains Mono
- Cascadia Code
- Source Code Pro
- Hack
- Inconsolata
- Monaco
- Consolas
- Ubuntu Mono
- Roboto Mono
- IBM Plex Mono
- SF Mono
- Menlo
- Courier New

**Window Themes:**
- **macOS:** Controles vermelhos/amarelo/verde
- **Windows:** Controles minimize/maximize/close
- **Linux:** Estilo GNOME/KDE
- **Sem janela:** Apenas código

**Backgrounds:**
- **Cores Sólidas:** Picker de cores completo
- **Gradientes (20+ presets):**
  - Linear
  - Radial
  - Mesh (moderno)
  - Customizáveis
- **Imagens:** Upload de background custom
- **Transparente:** Para sobreposição

**Header Customizável:**
- Título do arquivo/snippet
- Tag de linguagem
- Posicionamento (left/center/right)
- Mostrar/ocultar

**Footer Configurável:**
- Até 3 informações simultâneas:
  - Número de linhas
  - Contagem de caracteres
  - Nome da linguagem
  - Texto customizado
- Posicionamento (left/center/right)
- Mostrar/ocultar

**Modo Diff:**
- Comparação lado a lado
- Código original vs modificado
- Highlight de mudanças (verde/vermelho)
- Algoritmo diff inteligente
- Útil para tutoriais de refactoring

**Highlight de Linhas:**
- Selecionar linhas específicas
- Cor do highlight ajustável
- Opacidade configurável (10%-50%)
- Múltiplas seleções

**Anotações Flutuantes:**
- Setas apontando para código
- Notas explicativas
- Posicionamento livre (drag & drop)
- Cores customizáveis
- Texto formatável
- Ideal para tutoriais

**Tamanhos Preset:**
- **Twitter:** 1200x675px
- **Instagram:** 1080x1080px (quadrado)
- **Instagram Story:** 1080x1920px
- **GitHub:** 1280x640px
- **LinkedIn:** 1200x627px
- **Facebook:** 1200x630px
- **Custom:** Dimensões livres

**Configurações Avançadas:**
- **Padding:** Espaçamento interno (0-100px)
- **Border Radius:** Cantos arredondados (0-50px)
- **Shadow:** Intensidade da sombra (0-100%)
- **Scale:** Zoom do código (50%-200%)
- **Font Size:** Tamanho da fonte (10-32px)
- **Font Ligatures:** Ativar/desativar ligaduras
- **Line Height:** Espaçamento entre linhas
- **Alinhamento Vertical:** Top, Center, Bottom

**Importação:**
- **GitHub Gists:** Importar código direto do Gist
- **Arquivos:** Upload de arquivos de código
- **Paste:** Colar código diretamente

**Compartilhamento:**
- **URL com Estado:** Compartilhe configuração completa
- **Parâmetros na URL:** Tema, fonte, tamanho, etc.
- **Restauração Automática:** Abrir link restaura snapshot

**Exportação:**
- **PNG:** Alta qualidade, transparência opcional
- **Clipboard:** Copiar imagem diretamente
- **Download:** Salvar arquivo PNG
- **Resolução:** 1x, 2x, 3x (retina)

**Preview em Tempo Real:**
- Atualização instantânea
- Zoom interativo
- Pan/scroll
- Fullscreen mode

#### 🎯 Casos de Uso

- Posts técnicos em redes sociais
- Tutoriais e documentação
- Apresentações e slides
- Thumbnails de vídeos
- Artigos de blog
- GitHub READMEs
- Portfolio de código
- Material educacional
- Code reviews visuais

#### ⚙️ Configurações Recomendadas

**Para Twitter:**
- Tamanho: Twitter (1200x675)
- Tema: Dracula ou VS Code Dark+
- Fonte: Fira Code
- Window: macOS
- Background: Gradiente sutil
- Padding: 60px

**Para Instagram:**
- Tamanho: Instagram (1080x1080)
- Tema: One Dark ou Nord
- Fonte: JetBrains Mono
- Window: Sem janela
- Background: Cor sólida vibrante
- Padding: 40px
- Font Size: 16-18px

**Para Documentação:**
- Tamanho: GitHub (1280x640)
- Tema: GitHub Light ou VS Code Light
- Fonte: Source Code Pro
- Window: Sem janela ou macOS
- Background: Branco ou cinza claro
- Line Numbers: Ativado
- Padding: 40px

**Para Tutoriais:**
- Modo: Diff (se comparando código)
- Annotations: Ativadas
- Line Highlight: Linhas importantes
- Font Size: 14-16px (legível)
- Window: macOS ou Windows
- Background: Neutro

---

## 🎨 Formatadores de Código

### 7. JSON Formatter

**Rota:** `/json-formatter`
**Descrição:** Valide, formate e converta JSON com ferramentas avançadas

#### ✨ Funcionalidades Principais

**Validação em Tempo Real:**
- Parser JSON robusto
- Detecção de erros de sintaxe
- Mensagens de erro detalhadas
- Linha e coluna do erro
- Sugestões de correção

**Formatação:**
- **Beautify:** Indentação legível (2 ou 4 espaços)
- **Minify:** Compactar JSON (remover espaços)
- **Pretty Print:** Formatação customizada
- **Sort Keys:** Ordenar chaves alfabeticamente

**Tree View Interativa:**
- Visualização hierárquica
- Expandir/colapsar nodes
- Busca por chaves
- Copiar paths (ex: `data.users[0].name`)
- Highlight de tipos (string, number, boolean, null, array, object)

**Estatísticas:**
- Tamanho original (bytes/KB/MB)
- Tamanho formatado
- Redução percentual (minify)
- Número de linhas
- Profundidade máxima
- Contagem de chaves
- Tipos de dados presentes

**Conversão de Formatos:**
- **JSON → XML:** Estrutura preservada
- **JSON → YAML:** Sintaxe YAML limpa
- **JSON → CSV:** Para arrays de objetos
- **JSON → TOML:** Configurações
- **JSON → TOON:** Formato compacto

**Syntax Highlighting:**
- Cores para tipos
- Destaque de chaves
- Valores formatados
- Números, strings, booleans diferenciados

**Busca e Filtro:**
- Buscar por chave
- Buscar por valor
- Filtrar por tipo
- Regex support

**Edição:**
- Editor Monaco integrado
- Auto-complete de chaves
- Validação inline
- Bracket matching
- Multi-cursor

**Ações Rápidas:**
- Copiar JSON formatado
- Copiar JSON minificado
- Download como arquivo .json
- Limpar editor
- Resetar para exemplo

#### 🎯 Casos de Uso

- Debug de respostas de API
- Validar payloads
- Formatar configurações
- Converter entre formatos
- Analisar estruturas complexas
- Preparar dados para documentação
- Otimizar tamanho de JSON

#### ⚙️ Configurações

- **Indentação:** 2 ou 4 espaços, tabs
- **Quote Style:** Aspas simples ou duplas
- **Trailing Commas:** Permitir ou remover
- **Sort Keys:** Alfabético ou original
- **Compact:** Arrays inline ou quebrados

---

### 8. SQL Formatter

**Rota:** `/sql-formatter`
**Descrição:** Formate e organize queries SQL de qualquer dialeto

#### ✨ Funcionalidades Principais

**Suporte a Dialetos:**
- MySQL
- PostgreSQL
- SQL Server (T-SQL)
- Oracle (PL/SQL)
- SQLite
- MariaDB
- DB2
- Standard SQL

**Formatação Inteligente:**
- **Keywords:** UPPERCASE ou lowercase
- **Indentação:** Níveis hierárquicos
- **Alinhamento:** Cláusulas alinhadas
- **Line Breaks:** Quebras lógicas
- **Espaçamento:** Consistente

**Cláusulas Suportadas:**
- SELECT, FROM, WHERE
- JOIN (INNER, LEFT, RIGHT, FULL, CROSS)
- GROUP BY, HAVING
- ORDER BY, LIMIT, OFFSET
- UNION, INTERSECT, EXCEPT
- WITH (CTEs)
- CASE WHEN
- Subqueries
- Window Functions (OVER, PARTITION BY)

**Funções Avançadas:**
- **CTEs (Common Table Expressions):** Formatação hierárquica
- **Window Functions:** RANK(), ROW_NUMBER(), LAG(), LEAD()
- **Aggregate Functions:** SUM(), AVG(), COUNT(), etc.
- **String Functions:** CONCAT(), SUBSTRING(), etc.
- **Date Functions:** DATE_ADD(), DATEDIFF(), etc.

**Opções de Formatação:**
- **Keyword Case:**
  - UPPERCASE
  - lowercase
  - Capitalize

- **Indentation:**
  - 2 spaces
  - 4 spaces
  - Tabs

- **Line Breaks:**
  - Antes de AND/OR
  - Antes de JOIN
  - Antes de FROM
  - Customizável

- **Comma Position:**
  - Trailing (final da linha)
  - Leading (início da linha)

**Validação:**
- Syntax checking básico
- Detecção de keywords inválidos
- Parênteses balanceados
- Aspas fechadas

**Syntax Highlighting:**
- Keywords em destaque
- Strings e números coloridos
- Comentários diferenciados
- Funções destacadas

#### 🎯 Casos de Uso

- Limpar queries copiadas
- Padronizar código SQL em projetos
- Preparar queries para documentação
- Code review de SQL
- Refatorar queries complexas
- Aprender SQL (ver estrutura clara)

#### ⚙️ Configurações Recomendadas

**Para Legibilidade:**
- Keywords: UPPERCASE
- Indentation: 4 spaces
- Line breaks: Antes de AND/OR e JOIN
- Comma: Trailing

**Para Compacto:**
- Keywords: lowercase
- Indentation: 2 spaces
- Line breaks: Mínimo
- Comma: Trailing

---

### 9. HTML Formatter

**Rota:** `/html-formatter`
**Descrição:** Formate, valide e limpe código HTML

#### ✨ Funcionalidades Principais

**Formatação:**
- Indentação automática
- Tags fechadas corretamente
- Atributos alinhados
- Quebras de linha lógicas
- Remoção de espaços extras

**Validação:**
- Tags não fechadas
- Atributos inválidos
- Estrutura HTML5
- Aninhamento incorreto
- Tags obsoletas (deprecated)

**Limpeza:**
- Remover comentários
- Remover estilos inline (opcional)
- Remover scripts inline (opcional)
- Remover atributos vazios
- Remover tags vazias

**Minificação:**
- Remover espaços em branco
- Remover quebras de linha
- Remover comentários
- Otimizar atributos
- Redução de tamanho

**Suporte a Templates:**
- Handlebars (`{{variable}}`)
- EJS (`<%= variable %>`)
- Mustache
- Jinja2
- Preservação de sintaxe

**Preservação:**
- Conteúdo de `<pre>`
- Conteúdo de `<code>`
- Conteúdo de `<script>`
- Conteúdo de `<style>`
- Atributos data-*

**Syntax Highlighting:**
- Tags coloridas
- Atributos destacados
- Valores de atributos
- Comentários
- Doctype

#### 🎯 Casos de Uso

- Limpar HTML copiado
- Organizar templates
- Preparar para produção (minify)
- Corrigir estrutura quebrada
- Code review de HTML
- Converter HTML antigo para HTML5

---

### 10. CSS Formatter

**Rota:** `/css-formatter`
**Descrição:** Organize e otimize folhas de estilo CSS/SCSS

#### ✨ Funcionalidades Principais

**Formatação:**
- Indentação consistente
- Seletores organizados
- Propriedades alinhadas
- Quebras de linha lógicas
- Espaçamento padronizado

**Ordenação de Propriedades:**
- **Alfabética:** A-Z
- **Lógica:** Display → Position → Box Model → Typography → Visual → Misc
- **Customizada:** Ordem definida pelo usuário

**Suporte a Preprocessadores:**
- SCSS (Sass)
- LESS
- Stylus
- PostCSS
- Variáveis CSS (--custom-property)

**Otimização:**
- Remoção de duplicatas
- Merge de seletores iguais
- Shorthand properties (margin, padding, etc.)
- Remoção de propriedades sem efeito
- Vendor prefixes organizados

**Minificação:**
- Remover espaços
- Remover comentários
- Comprimir cores (#ffffff → #fff)
- Remover unidades zero (0px → 0)
- Otimizar valores

**Validação:**
- Propriedades inválidas
- Valores inválidos
- Seletores mal formados
- Parênteses balanceados
- Aspas fechadas

**Syntax Highlighting:**
- Seletores coloridos
- Propriedades destacadas
- Valores formatados
- Comentários diferenciados
- Variáveis em destaque

#### 🎯 Casos de Uso

- Organizar CSS legado
- Padronizar código em projetos
- Otimizar para produção
- Code review de estilos
- Refatorar folhas de estilo
- Preparar CSS para documentação

---

### 11. JavaScript Formatter

**Rota:** `/javascript-formatter`
**Descrição:** Formate JavaScript/TypeScript com Prettier

#### ✨ Funcionalidades Principais

**Formatação Prettier:**
- Indentação automática
- Ponto-e-vírgula consistente
- Aspas simples ou duplas
- Trailing commas
- Arrow functions formatadas
- Template literals organizados

**Suporte a Sintaxe Moderna:**
- ES6+ (let, const, arrow functions)
- ES2020+ (optional chaining, nullish coalescing)
- Async/await
- Destructuring
- Spread operator
- Modules (import/export)

**Suporte a Frameworks:**
- React (JSX)
- Vue (SFC)
- Angular (TypeScript)
- Svelte
- TypeScript puro

**Detecção de Erros:**
- Syntax errors
- Missing semicolons
- Unclosed brackets
- Invalid tokens
- Type errors (TypeScript)

**Opções de Formatação:**
- **Print Width:** 80, 100, 120 caracteres
- **Tab Width:** 2 ou 4 espaços
- **Semicolons:** Adicionar ou remover
- **Quotes:** Single ou double
- **Trailing Commas:** ES5, all, none
- **Bracket Spacing:** { foo } ou {foo}
- **Arrow Parens:** Always ou avoid

**Syntax Highlighting:**
- Keywords coloridos
- Strings e números
- Comentários
- Funções e variáveis
- JSX/TSX tags

#### 🎯 Casos de Uso

- Padronizar código em equipe
- Limpar código copiado
- Preparar para commit
- Code review
- Refatorar código legado
- Aprender boas práticas

---

## 🔄 Conversores & Utilitários

### 12. JSON to TypeScript

**Rota:** `/json-to-ts`
**Descrição:** Gere interfaces TypeScript a partir de JSON

#### ✨ Funcionalidades Principais

**Geração Automática:**
- Interfaces TypeScript
- Types
- Enums (para valores repetidos)
- Union types
- Optional properties (?)
- Readonly properties

**Detecção Inteligente de Tipos:**
- string, number, boolean, null
- Arrays tipados (string[], number[])
- Objetos aninhados
- Union types (string | number)
- Literal types ('success' | 'error')
- Date (detecta ISO strings)
- any (fallback)

**Nomenclatura:**
- **PascalCase:** Para interfaces (UserData, ApiResponse)
- **camelCase:** Para propriedades (firstName, userId)
- **UPPER_SNAKE_CASE:** Para enums (USER_ROLE)
- Customizável

**Opções de Geração:**
- **Interface vs Type:** Escolher sintaxe
- **Optional Properties:** Detectar campos opcionais
- **Readonly:** Marcar propriedades como readonly
- **Index Signatures:** Para objetos dinâmicos
- **Generics:** Para tipos reutilizáveis

**Arrays de Objetos:**
- Detecta estrutura comum
- Gera interface única
- Union types para variações
- Exemplo: `User[]` ao invés de `Array<User>`

**Objetos Aninhados:**
- Interfaces separadas
- Nomenclatura hierárquica
- Referências corretas
- Exemplo: `UserAddress`, `UserMetadata`

**Enums:**
- Detecta valores repetidos
- Gera enums TypeScript
- String enums ou numeric enums
- Exemplo: `enum UserRole { ADMIN = 'admin', USER = 'user' }`

**Comentários JSDoc:**
- Descrições de interfaces
- Tipos de propriedades
- Exemplos de uso
- @deprecated para campos obsoletos

#### 🎯 Casos de Uso

- Tipar respostas de API
- Criar DTOs (Data Transfer Objects)
- Documentar estruturas de dados
- Acelerar desenvolvimento TypeScript
- Migrar JavaScript para TypeScript
- Gerar tipos para testes

#### ⚙️ Exemplo

**Input JSON:**
```json
{
  "id": 1,
  "name": "João",
  "email": "joao@example.com",
  "active": true,
  "roles": ["admin", "user"],
  "metadata": {
    "createdAt": "2024-01-15",
    "lastLogin": "2024-01-20"
  }
}
```

**Output TypeScript:**
```typescript
interface User {
  id: number
  name: string
  email: string
  active: boolean
  roles: string[]
  metadata: UserMetadata
}

interface UserMetadata {
  createdAt: string
  lastLogin: string
}
```

---

### 13. Diff Checker

**Rota:** `/diff-checker`
**Descrição:** Compare textos e encontre diferenças

#### ✨ Funcionalidades Principais

**Modos de Visualização:**
- **Split View:** Lado a lado
- **Unified View:** Diff unificado (estilo Git)
- **Inline View:** Mudanças inline

**Tipos de Diff:**
- **Line-by-line:** Comparação por linha
- **Word-by-word:** Comparação por palavra
- **Character-by-character:** Comparação por caractere

**Highlight de Mudanças:**
- **Adições:** Verde
- **Remoções:** Vermelho
- **Modificações:** Amarelo/laranja
- **Sem mudanças:** Cinza

**Opções de Comparação:**
- **Ignore Whitespace:** Ignorar espaços
- **Ignore Case:** Case-insensitive
- **Ignore Line Endings:** CRLF vs LF
- **Trim Lines:** Remover espaços nas pontas

**Estatísticas:**
- Linhas adicionadas
- Linhas removidas
- Linhas modificadas
- Linhas iguais
- Percentual de similaridade

**Navegação:**
- Ir para próxima diferença
- Ir para diferença anterior
- Expandir/colapsar seções iguais
- Scroll sincronizado

**Formatos Suportados:**
- Texto puro
- Código (syntax highlighting)
- JSON (comparação estrutural)
- XML
- CSV
- Markdown

**Exportação:**
- Download do diff
- Copiar diff formatado
- Gerar patch file
- Exportar como HTML

#### 🎯 Casos de Uso

- Code review
- Comparar versões de documentos
- Verificar mudanças em configurações
- Merge conflicts
- Análise de logs
- Comparar respostas de API
- Validar traduções

---

### 14. Base64 Converter

**Rota:** `/base64`
**Descrição:** Codifique e decodifique Base64

#### ✨ Funcionalidades Principais

**Encoding:**
- Texto → Base64
- Arquivos → Base64
- Imagens → Data URL
- Binários → Base64

**Decoding:**
- Base64 → Texto
- Base64 → Arquivo
- Data URL → Imagem
- Base64 → Binário

**Detecção Automática:**
- Detecta se é Base64 válido
- Identifica tipo de conteúdo
- Sugere operação (encode/decode)

**Preview de Imagens:**
- Visualização de imagens Base64
- Download da imagem
- Informações (dimensões, tamanho, formato)
- Suporte a PNG, JPEG, GIF, SVG, WebP

**Data URLs:**
- Geração de data URLs completos
- `data:image/png;base64,iVBORw0KG...`
- Pronto para uso em HTML/CSS
- Cópia rápida

**Validação:**
- Verifica Base64 válido
- Detecta caracteres inválidos
- Valida padding (=)
- Mensagens de erro claras

**Formatos Suportados:**
- UTF-8 text
- ASCII text
- Imagens (PNG, JPEG, GIF, SVG, WebP)
- PDFs
- Arquivos binários

**Opções:**
- **Line Length:** Quebrar em 64, 76 caracteres ou sem quebra
- **URL Safe:** Usar caracteres URL-safe (-_ ao invés de +/)
- **Padding:** Incluir ou remover padding (=)

#### 🎯 Casos de Uso

- Embedding de imagens em CSS/HTML
- Enviar binários em JSON
- Tokens de autenticação
- Serialização de dados
- Armazenar arquivos em banco de dados
- APIs que requerem Base64

---

### 15. HTML to Text

**Rota:** `/html-to-text`
**Descrição:** Extraia texto puro de HTML

#### ✨ Funcionalidades Principais

**Extração de Texto:**
- Remove todas as tags HTML
- Preserva estrutura de parágrafos
- Mantém quebras de linha lógicas
- Converte listas em texto

**Preservação de Estrutura:**
- Headings → Texto com destaque
- Parágrafos → Separados por linha em branco
- Listas → Bullets ou números
- Blockquotes → Indentação
- Tables → Formatação tabular

**Tratamento de Links:**
- **Texto apenas:** Apenas texto do link
- **URL entre parênteses:** `Texto (url)`
- **Markdown:** `[Texto](url)`
- **Remover:** Ignorar links

**Tratamento de Imagens:**
- **Alt text:** Usar atributo alt
- **Placeholder:** [Imagem]
- **Remover:** Ignorar imagens

**Limpeza:**
- Remove scripts
- Remove styles
- Remove comentários
- Remove elementos invisíveis (display:none)
- Remove tracking pixels

**Opções:**
- **Preserve Line Breaks:** Manter <br>
- **Decode Entities:** &amp; → &, &lt; → <
- **Trim Whitespace:** Remover espaços extras
- **Normalize Spaces:** Múltiplos espaços → um espaço

**Formatos de Saída:**
- Texto puro
- Markdown
- Texto com formatação básica

#### 🎯 Casos de Uso

- Extrair conteúdo de emails HTML
- Gerar previews de texto
- Indexação para busca
- Análise de conteúdo
- Conversão de HTML para Markdown
- Preparar texto para processamento

---

### 16. Extrator de Dados

**Rota:** `/data-extractor`
**Descrição:** Extraia dados estruturados com regex

#### ✨ Funcionalidades Principais

**Padrões Pré-definidos:**
- **Emails:** Validação RFC 5322
- **Telefones:** Formatos BR e internacionais
- **CPFs:** Validação com dígitos verificadores
- **CNPJs:** Validação completa
- **URLs:** HTTP, HTTPS, FTP
- **IPs:** IPv4 e IPv6
- **CEPs:** Formato brasileiro (00000-000)
- **Datas:** Múltiplos formatos (DD/MM/YYYY, ISO, etc.)
- **Cartões de Crédito:** Visa, Mastercard, Amex
- **Placas de Veículo:** Formato Mercosul e antigo

**Regex Customizado:**
- Editor de regex com syntax highlighting
- Testes em tempo real
- Flags (g, i, m, s, u, y)
- Grupos de captura
- Lookahead/Lookbehind
- Named groups

**Validação:**
- CPF: Dígitos verificadores
- CNPJ: Dígitos verificadores
- Email: Sintaxe válida
- URL: Protocolo e domínio
- Cartão: Algoritmo de Luhn

**Resultados:**
- Lista de matches
- Contagem total
- Highlight no texto original
- Posição (linha e coluna)
- Grupos de captura

**Remoção de Duplicatas:**
- Automática ou manual
- Case-sensitive ou insensitive
- Ordenação alfabética

**Estatísticas:**
- Total de matches
- Matches únicos
- Distribuição por tipo
- Percentual de cobertura

**Exportação:**
- **JSON:** Array de matches
- **CSV:** Tabela de resultados
- **TXT:** Lista simples
- **Excel:** Planilha formatada

**Highlight:**
- Matches destacados no texto
- Cores por tipo de dado
- Navegação entre matches
- Copiar match individual

#### 🎯 Casos de Uso

- Extrair contatos de textos
- Validar dados em massa
- Scraping de informações
- Limpeza de dados
- Análise de logs
- Extração de métricas
- Data mining

---

### 17. Gist Explorer

**Rota:** `/gist-explorer`
**Descrição:** Busque e visualize GitHub Gists

#### ✨ Funcionalidades Principais

**Busca:**
- Por usuário do GitHub
- Por linguagem
- Por descrição/conteúdo
- Por tags
- Gists públicos e privados (com auth)

**Autenticação:**
- GitHub OAuth
- Personal Access Token
- Permissões: gist (read/write)

**Visualização:**
- Lista de Gists
- Preview de código
- Syntax highlighting
- Múltiplos arquivos
- Histórico de revisões

**Metadados:**
- Descrição
- Data de criação
- Última atualização
- Número de arquivos
- Linguagens usadas
- Stars
- Forks
- Comentários

**Filtros:**
- Públicos/Privados
- Por linguagem
- Por data
- Starred
- Forked

**Ações:**
- Visualizar código
- Copiar código
- Download de arquivos
- Star/Unstar
- Fork
- Comentar
- Editar (se owner)
- Deletar (se owner)

**Criação de Gists:**
- Múltiplos arquivos
- Descrição e tags
- Público ou privado
- Syntax highlighting automático

**Importação:**
- Importar Gist para MD Editor
- Importar para Code Snapshot
- Download como ZIP

#### 🎯 Casos de Uso

- Buscar snippets de código
- Compartilhar código
- Salvar configurações
- Colaborar em código
- Criar biblioteca pessoal de snippets
- Documentar soluções

---

### 18. Cron Tools

**Rota:** `/cron-tools`
**Descrição:** Valide e visualize expressões cron

#### ✨ Funcionalidades Principais

**Validação:**
- Sintaxe cron Unix
- Sintaxe Quartz
- Sintaxe AWS EventBridge
- Detecção de erros
- Sugestões de correção

**Explicação em Linguagem Natural:**
- Tradução para português
- Descrição clara da frequência
- Exemplos de execução

**Próximas Execuções:**
- Lista das próximas 10-20 execuções
- Data e hora exatas
- Timezone configurável
- Countdown até próxima execução

**Gerador Visual:**
- Interface gráfica para criar cron
- Seleção de minutos, horas, dias, etc.
- Preview em tempo real
- Expressão gerada automaticamente

**Formatos Suportados:**
- **Unix Cron:** 5 campos (min hour day month weekday)
- **Quartz:** 6-7 campos (sec min hour day month weekday year)
- **AWS:** Sintaxe específica do EventBridge

**Campos:**
- **Minutos:** 0-59
- **Horas:** 0-23
- **Dia do Mês:** 1-31
- **Mês:** 1-12 ou JAN-DEC
- **Dia da Semana:** 0-7 ou SUN-SAT
- **Ano:** (Quartz) 1970-2099

**Sintaxe Especial:**
- `*` - Qualquer valor
- `,` - Lista de valores (1,15,30)
- `-` - Range (1-5)
- `/` - Step (*/5 = a cada 5)
- `L` - Último (dia do mês/semana)
- `W` - Dia útil mais próximo
- `#` - N-ésimo dia (2#1 = primeira segunda)

**Exemplos Comuns:**
- A cada minuto: `* * * * *`
- A cada hora: `0 * * * *`
- Diariamente às 9h: `0 9 * * *`
- Toda segunda às 8h: `0 8 * * 1`
- Primeiro dia do mês: `0 0 1 * *`

**Timezone:**
- Seleção de timezone
- Conversão automática
- Horário local vs UTC

**Histórico:**
- Expressões recentes
- Favoritos
- Copiar rapidamente

#### 🎯 Casos de Uso

- Configurar jobs agendados
- Validar cron de CI/CD
- Documentar schedulers
- Aprender sintaxe cron
- Debugar expressões
- Planejar automações

---

### 19. Excel/CSV to Markdown

**Rota:** `/xls-md`
**Descrição:** Converta planilhas em tabelas Markdown

#### ✨ Funcionalidades Principais

**Modos de Entrada:**

**1. Paste CSV:**
- Colar dados CSV diretamente
- Detecção automática de delimitador (`,` `;` `\t`)
- Preview em tempo real
- Validação de estrutura

**2. Paste JSON:**
- Colar array de objetos JSON
- Conversão automática para tabela
- Chaves viram colunas
- Valores viram linhas

**3. Upload de Arquivos:**
- Drag & drop de arquivos
- Suporte a .xlsx, .xls, .csv
- Múltiplos arquivos (processamento em lote)
- Preview antes de converter
- Validação de formato

**Alinhamento de Colunas:**
- **Esquerda:** `:---` (padrão)
- **Centro:** `:---:`
- **Direita:** `---:`
- Configuração individual por coluna
- Preview em tempo real

**Transformações:**

**1. Transposição:**
- Inverter linhas e colunas
- Útil para dados horizontais
- Preserva alinhamento
- Reversível

**2. Ordenação:**
- Por qualquer coluna
- Crescente ou decrescente
- Detecção automática de tipo (número vs texto)
- Ordenação alfabética ou numérica

**3. Filtros:**
- Filtrar por coluna
- Operadores: igual, contém, maior, menor
- Múltiplos filtros simultâneos
- Reset rápido

**Formatação Avançada:**

**1. Escape de Caracteres:**
- Escape automático de `|` (pipe)
- Escape de `\` (backslash)
- Preserva formatação Markdown
- Evita quebra de tabela

**2. Remoção de Colunas Vazias:**
- Detecta colunas sem dados
- Remove automaticamente
- Opção manual
- Melhora legibilidade

**Exportação Multi-Formato:**

**1. Markdown:**
- Sintaxe GFM (GitHub Flavored Markdown)
- Alinhamento configurável
- Formatação limpa

**2. HTML:**
- Tabela HTML completa
- `<thead>` e `<tbody>` separados
- Classes CSS customizáveis
- Atributos de alinhamento

**3. LaTeX:**
- Ambiente `tabular`
- Formatação acadêmica
- Alinhamento (l, c, r)
- Linhas horizontais (`\hline`)
- Pronto para documentos LaTeX

**4. ASCII:**
- Tabela em texto puro
- Bordas com caracteres ASCII
- Alinhamento visual
- Ideal para terminal/logs

**Estatísticas por Coluna:**

**1. Tipo de Dados:**
- String
- Number
- Boolean
- Mixed (tipos mistos)
- Detecção automática

**2. Valores Únicos:**
- Contagem de valores distintos
- Lista de valores únicos
- Útil para validação

**3. Células Vazias:**
- Contagem de células vazias
- Percentual de preenchimento
- Identificação de problemas

**4. Estatísticas Numéricas:**
- Mínimo
- Máximo
- Média
- Soma
- Desvio padrão
- Apenas para colunas numéricas

**Preview:**
- **Tabela Renderizada:** Visualização final
- **Código Markdown:** Fonte editável
- **Estatísticas:** Análise de dados
- Tabs organizadas
- Syntax highlighting

**Interface:**
- Layout responsivo com ToolShell
- Tabs: Entrada, Saída, Opções
- Mobile-friendly
- Drag & drop visual
- Validações em tempo real

#### 🎯 Casos de Uso

- Documentar APIs (tabelas de parâmetros)
- Criar tabelas para READMEs
- Converter planilhas para documentação
- Gerar tabelas para artigos
- Exportar dados para LaTeX
- Criar tabelas ASCII para logs
- Análise rápida de dados

#### ⚙️ Exemplo

**Input CSV:**
```csv
Nome,Idade,Cidade
João,25,São Paulo
Maria,30,Rio de Janeiro
Pedro,28,Belo Horizonte
```

**Output Markdown:**
```markdown
| Nome  | Idade | Cidade           |
|:------|:-----:|:-----------------|
| João  | 25    | São Paulo        |
| Maria | 30    | Rio de Janeiro   |
| Pedro | 28    | Belo Horizonte   |
```

---

### 20. Color Studio

**Rota:** `/color-studio`
**Descrição:** Gerador profissional de paletas de cores com validação WCAG

#### ✨ Funcionalidades Principais

**Geração de Paletas (6 Tipos):**

**1. Monocromática:**
- Variações de uma cor base
- Diferentes níveis de luminosidade
- 5 cores geradas
- Harmonia garantida

**2. Análoga:**
- Cores adjacentes no círculo cromático
- Ângulo de 30° da cor base
- Combinação suave e natural
- 5 cores geradas

**3. Complementar:**
- Cor oposta no círculo cromático
- Alto contraste
- Impacto visual forte
- 5 cores geradas

**4. Tríade:**
- 3 cores equidistantes (120°)
- Balanceamento perfeito
- Vibrante e dinâmica
- 5 cores geradas

**5. Tétrade:**
- 4 cores em retângulo
- Rica e complexa
- Múltiplas combinações
- 5 cores geradas

**6. Tons (Shades):**
- Variações de saturação
- Do claro ao escuro
- Gradiente suave
- 5 cores geradas

**Mood Selector (6 Atmosferas):**

**1. Corporativo:**
- Profissional e confiável
- ↓ Saturação, ↓ Brilho
- Cores sóbrias
- Ideal para negócios

**2. Enérgico:**
- Vibrante e dinâmico
- ↑ Saturação, ↑ Brilho
- Cores intensas
- Ideal para esportes/fitness

**3. Calmo:**
- Sereno e relaxante
- ↓↓ Saturação, ↑ Brilho
- Cores suaves
- Ideal para wellness/saúde

**4. Luxuoso:**
- Elegante e sofisticado
- ↑ Saturação, ↓↓ Brilho
- Cores ricas
- Ideal para premium/luxo

**5. Divertido:**
- Alegre e criativo
- ↑↑ Saturação, ↑ Brilho
- Cores vivas
- Ideal para infantil/entretenimento

**6. Minimalista:**
- Limpo e neutro
- ↓↓ Saturação, neutro
- Cores discretas
- Ideal para design clean

**Validação de Contraste:**

**1. WCAG 2.1 (Padrão Atual):**
- Razão de contraste (1:1 a 21:1)
- **Níveis AA:**
  - Texto normal: 4.5:1
  - Texto grande: 3:1
- **Níveis AAA:**
  - Texto normal: 7:1
  - Texto grande: 4.5:1
- Checklist visual
- Grade: AAA, AA ou Fail

**2. APCA (WCAG 3.0 - Futuro):**
- Algoritmo perceptualmente preciso
- Valor Lc (Lightness contrast)
- **5 Níveis de Qualidade:**
  - Excellent (Lc ≥ 90)
  - Good (Lc ≥ 75)
  - Acceptable (Lc ≥ 60)
  - Poor (Lc ≥ 45)
  - Fail (Lc < 45)
- Recomendações de fonte (tamanho e peso)
- Considera direção do contraste

**3. Interface Dual:**
- Tabs WCAG 2.1 e APCA 3.0
- Comparação lado a lado
- Badge indicando suporte
- Preview visual com texto real

**Simulador de Daltonismo:**
- **Protanopia:** Deficiência de vermelho
- **Deuteranopia:** Deficiência de verde
- **Tritanopia:** Deficiência de azul
- **Achromatopsia:** Visão monocromática
- Preview em tempo real
- Validação de acessibilidade

**Color Mixer:**
- Selecionar 2 cores da paleta
- 3-15 passos intermediários
- Algoritmo LCH (perceptualmente uniforme)
- Preview em faixa e cards
- Copiar cores individuais
- Copiar CSS completo
- Botão reset

**Gerador de Gradientes:**

**1. Tipos (4):**
- **Linear:** Gradiente linear com 8 direções
- **Radial:** Gradiente radial (circle)
- **Cônico:** Gradiente cônico (from angle)
- **Mesh:** Manchas de cor suaves (moderno)

**2. Customização:**
- Edição de cada cor
- Posições ajustáveis (0-100%)
- Adicionar/remover cores
- 6 variações sugeridas
- Preview em tempo real

**3. Interface Adaptativa:**
- Oculta controles irrelevantes
- Direção (exceto Radial e Mesh)
- Posição (exceto Mesh)

**4. Exportação:**
- CSS `background-image`
- Cópia automática
- Botão reset

**Gerador de Tema Shadcn UI:**

**1. Cores Editáveis (34 variáveis):**
- **Light Mode (17):**
  - background, foreground
  - card, card-foreground
  - popover, popover-foreground
  - primary, primary-foreground
  - secondary, secondary-foreground
  - muted, muted-foreground
  - accent, accent-foreground
  - destructive, destructive-foreground
  - border, input, ring

- **Dark Mode (17):**
  - Mesmas variáveis para dark mode

**2. Categorias Organizadas:**
- Cores Principais (6)
- Cores de Ação (8)
- Elementos UI (5)
- Charts (5)
- Sidebar (8)

**3. Edição:**
- Click no quadrado de cor
- Color picker integrado
- Preview em tempo real
- Botão reset para tema automático

**4. Exportação:**
- CSS com variáveis OKLCH
- Pronto para Shadcn UI
- Light e Dark mode
- Copiar código

**Exportação Multi-Formato (8 formatos):**

**1. CSS Variables:**
```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
}
```

**2. SCSS Variables:**
```scss
$primary: #3b82f6;
$secondary: #8b5cf6;
```

**3. Tailwind Config:**
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  }
}
```

**4. JSON:**
```json
{
  "colors": {
    "primary": "#3b82f6"
  }
}
```

**5. Figma Tokens:**
```json
{
  "colors": {
    "primary": {
      "value": "#3b82f6",
      "type": "color",
      "oklch": "oklch(67% 0.17 265)"
    }
  }
}
```

**6. Swift (iOS):**
```swift
extension UIColor {
  static let primary = UIColor(hex: "3b82f6")
}
```

**7. XML (Android):**
```xml
<resources>
  <color name="primary">#3b82f6</color>
</resources>
```

**8. Shadcn Theme:**
- CSS completo com OKLCH
- Light + Dark mode
- 34 variáveis

**Nomes Semânticos Editáveis:**
- Editor dedicado acima do código
- Nomes padrão: primary, secondary, accent, muted, destructive
- Edição inline com inputs
- Botão reset
- Validação automática (kebab-case)
- Preview em tempo real
- Todos os formatos usam os nomes

**Nomes de Cores Automáticos:**
- Biblioteca `ntc` (Name That Color)
- Nomes descritivos reais (Sky Blue, Crimson, etc.)
- Fallback inteligente baseado em HSL
- Exibição visual nos cards

**Formatos de Cor:**
- **HEX:** #3b82f6
- **RGB:** rgb(59, 130, 246)
- **HSL:** hsl(217, 91%, 60%)
- **OKLCH:** oklch(67% 0.17 265) - Perceptualmente uniforme
- Cópia individual de cada formato

**Extração de Cores de Imagens:**
- Upload de imagem
- Algoritmo Color Thief
- Extrai 5 cores dominantes
- Define cor base automaticamente
- Preview da imagem

**Histórico e Favoritos:**

**1. Histórico Local:**
- Até 20 paletas recentes
- Persistência com localStorage
- Remove duplicatas
- Timestamp e metadados

**2. Favoritos:**
- Botão de "coração"
- Nunca removidos ao limpar
- Filtro dedicado
- Sincronização com localStorage

**3. Drawer/Sidebar:**
- Botão "Histórico" com badge
- Sheet lateral responsivo
- Filtros: Todas e Favoritas
- Preview visual (faixa de cores)
- Informações: tipo, cor base, tempo
- Ações: Restaurar, Favoritar, Compartilhar, Remover
- Botão "Limpar Histórico" (preserva favoritos)

**Compartilhamento via URL:**
- Codificação da paleta na URL
- Formato: `?colors=ffffff-000000-ff0000&type=monochromatic&base=3b82f6`
- Atualização automática ao gerar
- Carregamento automático ao abrir link
- Botão "Compartilhar" copia link
- Histórico do navegador preservado

**Interface:**
- Sidebar de configuração (cor base, tipo, mood)
- Output com 7 tabs:
  1. Paleta (cards de cores)
  2. WCAG (contraste 2.1 + 3.0)
  3. Simulador (daltonismo)
  4. Mixer (blend de cores)
  5. Gradientes (4 tipos)
  6. Shadcn (tema completo)
  7. Exportar (8 formatos)
- Responsivo
- Preview em tempo real

#### 🎯 Casos de Uso

- Design de interfaces
- Branding e identidade visual
- Validação de acessibilidade
- Geração de temas
- Documentação de design systems
- Exportação para código
- Criação de gradientes modernos
- Temas para frameworks (Shadcn UI)

#### ⚙️ Estatísticas

- **7 tabs** no output
- **6 tipos** de paleta
- **6 moods** de atmosfera
- **8 formatos** de exportação
- **34 variáveis** Shadcn UI
- **15 passos** Color Mixer
- **4 tipos** de gradientes
- **20 paletas** no histórico
- **WCAG 2.1 + APCA 3.0**

---

## 🔒 Segurança

### 21. Gerador de Senhas

**Rota:** `/password-gen`
**Descrição:** Gere senhas seguras e aleatórias

#### ✨ Funcionalidades Principais

**Configuração:**
- **Comprimento:** 8-128 caracteres
- **Caracteres:**
  - Maiúsculas (A-Z)
  - Minúsculas (a-z)
  - Números (0-9)
  - Especiais (!@#$%^&*()_+-=[]{}|;:,.<>?)
- **Excluir Ambíguos:** 0/O, 1/l/I, etc.

**Tipos de Senha:**
- **Aleatória:** Caracteres totalmente aleatórios
- **Memorável:** Palavras + números + especiais
- **Passphrase:** Múltiplas palavras separadas
- **PIN:** Apenas números (4-8 dígitos)

**Força da Senha:**
- Cálculo de entropia (bits)
- Classificação: Fraca, Média, Forte, Muito Forte
- Tempo estimado para quebrar
- Sugestões de melhoria

**Múltiplas Senhas:**
- Gerar 1-10 senhas simultâneas
- Comparar forças
- Escolher a melhor

**Segurança:**
- Geração totalmente client-side
- Sem envio de dados
- Crypto API do navegador
- Aleatoriedade criptográfica

**Ações:**
- Copiar senha
- Regenerar
- Salvar em arquivo .txt
- Limpar histórico

#### 🎯 Casos de Uso

- Criar senhas para contas
- Gerar tokens
- Criar PINs
- Passphrases para criptografia
- Senhas temporárias

---

### 22. JWT Debugger

**Rota:** `/jwt-decoder`
**Descrição:** Decodifique e valide tokens JWT

#### ✨ Funcionalidades Principais

**Decodificação:**
- Parse de JWT
- Separação de Header, Payload, Signature
- Visualização JSON formatada
- Syntax highlighting

**Header:**
- Algoritmo (HS256, RS256, ES256, etc.)
- Tipo (JWT)
- Key ID (kid)
- Outros campos customizados

**Payload (Claims):**
- **Registered Claims:**
  - iss (Issuer)
  - sub (Subject)
  - aud (Audience)
  - exp (Expiration Time)
  - nbf (Not Before)
  - iat (Issued At)
  - jti (JWT ID)
- **Custom Claims:** Qualquer campo adicional

**Validação:**
- **Estrutura:** 3 partes separadas por `.`
- **Base64:** Encoding válido
- **JSON:** Header e Payload válidos
- **Expiração:** Verifica claim `exp`
- **Not Before:** Verifica claim `nbf`
- **Assinatura:** Com secret ou public key

**Verificação de Assinatura:**
- **HMAC (HS256, HS384, HS512):**
  - Requer secret key
  - Validação simétrica
- **RSA (RS256, RS384, RS512):**
  - Requer public key
  - Validação assimétrica
- **ECDSA (ES256, ES384, ES512):**
  - Requer public key
  - Curvas elípticas

**Informações Temporais:**
- Tempo de expiração (exp)
- Tempo de emissão (iat)
- Válido a partir de (nbf)
- Tempo restante até expirar
- Status: Válido, Expirado, Não válido ainda

**Highlight de Campos:**
- Claims padrão destacados
- Timestamps formatados
- Valores booleanos
- Arrays e objetos aninhados

**Detecção de Problemas:**
- Token expirado
- Assinatura inválida
- Estrutura malformada
- Claims ausentes
- Algoritmo não suportado

**Exemplos:**
- JWTs de exemplo para teste
- Diferentes algoritmos
- Diferentes claims

#### 🎯 Casos de Uso

- Debug de autenticação
- Validar tokens de API
- Inspecionar claims
- Verificar expiração
- Testar assinaturas
- Aprender sobre JWT

---

## 📊 Resumo Geral

### Estatísticas do Projeto

- **Total de Ferramentas:** 22
- **Categorias:** 4
- **Formatadores:** 5
- **Conversores:** 8
- **Documentação:** 6
- **Segurança:** 2
- **Utilitários:** 1

### Tecnologias Principais

- **Editor:** Monaco Editor
- **Markdown:** ReactMarkdown, remark-gfm, rehype-raw
- **Syntax Highlighting:** Prism.js, react-syntax-highlighter
- **UI:** Shadcn UI, Tailwind CSS
- **Formatação:** Prettier, sql-formatter
- **Validação:** Zod, custom validators
- **Cores:** Chroma.js, APCA-W3, Color Thief
- **Conversão:** Custom parsers (XML, YAML, CSV, TOML)

### Diferenciais

✅ **Interface Profissional:** Design moderno e responsivo
✅ **Preview em Tempo Real:** Todas as ferramentas com feedback instantâneo
✅ **Validação Robusta:** Detecção de erros e sugestões
✅ **Múltiplos Formatos:** Conversão entre diversos formatos
✅ **Acessibilidade:** WCAG 2.1 + APCA (WCAG 3.0)
✅ **Client-Side:** Processamento local, sem envio de dados
✅ **Open Source:** Código aberto e extensível
✅ **Sem Cadastro:** Uso imediato sem login
✅ **Gratuito:** Todas as funcionalidades sem custo

---

## 🚀 Roadmap Futuro

### Melhorias Planejadas

- [ ] Simulador de Tipografia (Color Studio)
- [ ] Histórico de conversões (todas as ferramentas)
- [ ] Temas customizáveis globais
- [ ] Atalhos de teclado personalizáveis
- [ ] Exportação em lote
- [ ] Integração com APIs externas
- [ ] Plugins e extensões
- [ ] PWA (Progressive Web App)
- [ ] Modo offline completo
- [ ] Sincronização na nuvem (opcional)

---

## 📝 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja o arquivo CONTRIBUTING.md para mais detalhes.

---

## 📧 Contato

Para dúvidas, sugestões ou reportar bugs, abra uma issue no GitHub.

---

**MD to PDF Pro** - Ferramentas profissionais para desenvolvedores
Versão 0.16.0 - Janeiro 2026
