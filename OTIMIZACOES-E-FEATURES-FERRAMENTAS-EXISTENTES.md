# 🚀 Otimizações e Features para Ferramentas Existentes

Este documento consolida todas as melhorias, otimizações e novas features propostas para as
ferramentas que já fazem parte do ecossistema Markdown to PDF Pro.

---

## 📋 Índice

1. [Fundação Técnica e Performance](#1-fundação-técnica-e-performance)
2. [Experiência de Edição (UX)](#2-experiência-de-edição-ux)
3. [Automação e Inteligência de Documentos](#3-automação-e-inteligência-de-documentos)
4. [Markdown Editor & PDF Pro](#4-markdown-editor--pdf-pro)
5. [Web Extractor (Web to Markdown)](#5-web-extractor-web-to-markdown)
6. [Code Snapshot (Code to Image)](#6-code-snapshot-code-to-image)
7. [Formatadores (JSON, SQL, JS, CSS)](#7-formatadores-json-sql-js-css)
8. [JWT Decoder](#8-jwt-decoder)

---

## 1. Fundação Técnica e Performance

### A. Pipeline de Renderização com React 19

**Priorização com useTransition:**

- Em documentos massivos, a atualização do preview causa lag no editor
- Marcar a atualização do preview como "baixa prioridade"
- **Resultado:** O Monaco Editor permanece a 60fps, enquanto o preview é processado em background

**Isolamento via Shadow DOM ou Iframe:**

- **Problema:** O CSS do Tailwind 4 da aplicação conflita com os estilos que o usuário quer no PDF
- **Solução:** Encapsular o preview num Shadow DOM. Isso isola completamente os estilos, permitindo
  que o usuário use qualquer CSS customizado sem "quebrar" a interface da aplicação

### B. Resiliência de Assets

**Conversão Base64 no Cliente:**

- Antes de disparar a Server Action para o Puppeteer, um script varre o HTML e converte todas as
  `<img>` para Data URIs
- **Porquê:** Evita erros de timeout na API de PDF quando o servidor não consegue aceder a imagens
  externas lentas

**Virtualização do Preview:**

- Implementar _windowing_ para renderizar apenas as páginas visíveis
- Carregar 100 páginas no DOM simultaneamente destrói a performance do browser

---

## 2. Experiência de Edição (UX)

### A. Scroll Sync (Sincronização de Precisão)

- **A Solução:** Calcular a percentagem de scroll do Monaco (scrollTop / scrollHeight) e aplicar
  proporcionalmente ao container de preview
- **Desafio:** Lidar com elementos de alturas diferentes (uma linha de código pode gerar 3 linhas de
  preview)
- **Scroll Sync Bidirecional:** Click no preview posiciona o editor automaticamente

### B. Mobile UX: Sistema de Abas

- **Adaptação:** Em dispositivos móveis, os ResizablePanels são removidos
- **Implementação:** Usar um sistema de abas fixas no fundo: **[Escrever] | [Visualizar]**
- Garante que 50% dos utilizadores (mobile) consigam usar a ferramenta
- **Melhorias Touch:** Gestos, áreas maiores para interação touch-friendly

### C. Command Palette (Ctrl + K)

- Implementação via `cmdk` para acesso rápido a:
  - Inserção de tabelas, snippets de código e quebras de página
  - Troca de temas e configurações de página (A4, Letter)
  - Busca de documentos salvos no IndexedDB
  - Navegação rápida entre headers

---

## 3. Automação e Inteligência de Documentos

### A. Smart Variables (YAML Frontmatter)

- **O que é:** Permitir metadados no topo do arquivo:

  ```yaml
  ---
  titulo: Relatório Técnico
  autor: Engenharia
  data: 2024-03-20
  ---
  ```

- **Funcionalidade:** O sistema faz um _string replace_ automático dessas variáveis no corpo do
  texto e nos Cabeçalhos/Rodapés
- **Variáveis Dinâmicas:** Suporte a `{{data_hoje}}`, `{{nome_cliente}}`, etc.

### B. Diagramas e Matemática

**Mermaid.js:**

- Integração para renderizar fluxogramas e gráficos
- No PDF, o SVG deve ser convertido em PNG de alta resolução para evitar distorções
- **Live Preview:** Editor específico para diagramas Mermaid com preview isolado
- **Suporte a Diagramas de Sequência e Fluxo**

**LaTeX (KaTeX):**

- Suporte total a fórmulas matemáticas, essencial para o nicho académico e científico
- Integração via `remark-math` + `rehype-katex`

### C. Navegação Nativa (PDF Bookmarks)

- **Diferencial:** Converter os H1, H2 e H3 em marcadores nativos do PDF
- Permite que o utilizador navegue pelo documento através da barra lateral do leitor de PDF (Adobe,
  Chrome)

---

## 4. Markdown Editor & PDF Pro

### Sumário (TOC) Automático e Interativo

- Gerar automaticamente um índice baseado nos headers (#, ##)
- Índice clicável tanto no preview quanto no PDF final (bookmarks nativos)
- Atualização automática conforme o documento é editado

### Smart Selection & Navigation

- **Comandos para expandir seleção por blocos:** parágrafo, lista, bloco de código
- **Navegação rápida entre headers:** Similar ao comportamento de IDEs profissionais
- **JSONPath Tracking:** Exibir em tempo real o caminho da chave onde o cursor está posicionado

### Validação de Links em Tempo Real

- Verificador que analisa links internos (âncoras para outros headers) e externos
- Destacar visualmente links quebrados antes da exportação
- Validação automática de integridade

### Injeção de Variáveis (Templates Dinâmicos)

- Suporte total a YAML Frontmatter para definir variáveis (ex: `{{data}}`, `{{cliente}}`)
- Variáveis substituídas no corpo do texto e nos cabeçalhos/rodapés do PDF
- UI visual no settings modal para gerenciar variáveis

### Versionamento Local (Snapshot)

- Utilizar o `IndexedDB` para criar "checkpoints" manuais do documento
- Comparar a versão atual com um snapshot anterior usando diff-checker
- Histórico de versões com preview de mudanças

### Multi-column Layout via CSS

- Opção nas configurações de página para renderizar o PDF em duas colunas
- Ideal para artigos académicos ou newsletters técnicos

### Editor de Cabeçalho/Rodapé Profissional

- Interface visual para configurar cabeçalhos e rodapés
- Suporte a variáveis dinâmicas nos cabeçalhos/rodapés
- Preview em tempo real

---

## 5. Web Extractor (Web to Markdown)

### Extração Seletiva de DOM

- Permitir que o usuário visualize a estrutura do site e selecione manualmente apenas os
  nós/elementos que deseja converter
- Evita ruídos como menus e anúncios
- **Selector Picker Visual:** Permitir que o utilizador forneça um seletor CSS específico (ex:
  `.main-content` ou `#article-body`)

### Renderização de Sites Dinâmicos

- **Deep Scrape:** Opção que utiliza um navegador (browser-based) para carregar conteúdos gerados
  por JavaScript (React, Vue, Angular) antes da conversão
- **Detecção de SPA:** Avisar quando o site detectado for um SPA que pode não funcionar com `fetch`
  simples

### Relatório de Integridade (Soft-Failure)

- Em vez de apenas falhar, a ferramenta deve marcar páginas que retornaram em branco ou com erros de
  bloqueio
- Permitir tentar novamente com diferentes parâmetros de extração
- **Modo "Reader" de Backup:** Fallback automático que tenta extrair apenas o texto puro usando
  `node-html-markdown` antes de desistir

### Agregador de URLs

- Possibilidade de inserir uma lista de URLs e gerar um único arquivo Markdown combinado
- Mantém a hierarquia de headers para cada página extraída
- **Multi-Source Merging:** Extrair conteúdo de 3-4 URLs e combiná-las automaticamente em um único
  documento estruturado

### Conversão de Tabelas HTML para Markdown GFM

- Melhorar o parser para garantir que tabelas complexas do site original sejam convertidas fielmente
  para a sintaxe do GitHub Flavored Markdown

### Cache de Scraping

- Usar `unstable_cache` do Next.js ou Redis para armazenar o conteúdo extraído de URLs por 24h
- Economiza recursos e torna o carregamento instantâneo para URLs repetidas

---

## 6. Code Snapshot (Code to Image)

### Presets de Redes Sociais com Preview Real

- Botões com dimensões exatas para LinkedIn, Twitter e Instagram
- Ajuste automático de padding para garantir que o código esteja sempre centralizado
- Preview real antes de exportar

### Destaque de Mudanças (Code Diff)

- Permitir marcar linhas como "adicionadas" ou "removidas" dentro do snapshot
- Explicar mudanças de código visualmente
- **Modo "Diff" no Snapshot:** Colar um diff de código e a ferramenta formata automaticamente as
  linhas verdes (adições) e vermelhas (remoções)

### Interactive Code Annotations

- Possibilidade de adicionar setas ou notas explicativas flutuantes sobre partes específicas do
  código antes de exportar a imagem
- **Line Highlighting Contextual:** Clicar num número de linha para destacá-la e adicionar um
  pequeno "popover" de comentário

### Modo "Live Edit" no Preview

- Permitir pequenas edições de texto diretamente no painel de preview do snapshot para ajustes
  rápidos de última hora

### Presets de Mockup de Janela

- Adicionar molduras que simulam o aspeto do macOS (botões de semáforo), Windows ou um terminal
  "Retro"
- Mantém o design limpo e minimalista

---

## 7. Formatadores (JSON, SQL, JS, CSS)

### JSON Fixer Inteligente

- Função que corrige automaticamente erros comuns em JSONs colados:
  - Aspas simples → aspas duplas
  - Vírgulas sobrando
  - Falta de aspas em chaves
  - Literais em caixa alta

### Visualização de Imagens em Tree View

- Ao passar o mouse sobre uma URL de imagem dentro de um JSON formatado, exibir um pequeno preview
  da imagem

### Smart JSONPath Tracking

- Exibir em tempo real o caminho (JSONPath) da chave onde o cursor está posicionado
- Facilita a navegação em arquivos gigantes
- **Extração de Caminho (Copy JSON Path):** Ao clicar numa chave do JSON, permitir copiar o caminho
  exato (ex: `data.users[0].profile.name`)

### Conversão Cruzada Entre Formatos

- Botão de um clique para converter instantaneamente entre JSON, XML, YAML e CSV
- Preserva a estrutura de dados

### JSON Tree Graph

- Para além da visualização em texto, oferecer uma visualização em grafo/árvore
- O utilizador pode colapsar nós visualmente e ver a hierarquia de objetos complexos

### SQL Linter Integrado

- Para além de formatar o SQL com o `sql-formatter`, adicionar uma verificação básica de sintaxe
- Destaca erros comuns (como parênteses não fechados ou vírgulas em excesso)

---

## 8. JWT Decoder

### Simulador de Modificação

- Permitir que o utilizador edite o payload do JWT e veja como o token seria gerado
- Mesmo sem a assinatura ser válida, é útil para depurar estruturas de dados

### Reconhecimento de Claims Padrão

- Adicionar explicações automáticas (tooltips) para as claims padrão do JWT:
  - `exp` (data de expiração formatada)
  - `iat` (data de criação)
  - `sub` (subject)
- Formatação automática de datas e valores

---

## 📊 Priorização Sugerida

### Fase 1: Estabilização (Quick Wins)

- ✅ useTransition e Scroll Sync
- ✅ Sistema de abas para Mobile
- ✅ Suporte a Mermaid.js e KaTeX

### Fase 2: Valor Agregado (Professional Growth)

- YAML Frontmatter e Variáveis Dinâmicas
- Editor de Cabeçalho/Rodapé profissional
- Bookmarks nativos no PDF
- TOC Automático

### Fase 3: Power User Features

- Versionamento Local
- Validação de Links
- Multi-column Layout
- Code Diff no Snapshot

---

## 🔧 Bibliotecas Necessárias

### Já Instaladas ✅

- `@mozilla/readability` - Extração de conteúdo web
- `turndown` - HTML para Markdown
- `node-html-markdown` - Fallback de extração
- `sql-formatter` - Formatação SQL
- `prettier` - Formatação de código
- `framer-motion` - Animações
- `lucide-react` - Ícones

### A Instalar 📥

- `cmdk` - Command Palette (já no package.json)
- `remark-math` + `rehype-katex` - Suporte LaTeX
- `mermaid` - Diagramas
- `gray-matter` - Parser YAML Frontmatter
- `papaparse` - Parse CSV (se implementar tabelas)
- `ajv` - Validação JSON Schema (se implementar)

---

## 📝 Notas de Implementação

- Todas as melhorias aproveitam bibliotecas já presentes no `package.json`
- Mantém o bundle leve e a performance alta
- Foco em funcionalidades de "Power User" que resolvem problemas de workflow
- Integração com sistema existente de persistência no IndexedDB
