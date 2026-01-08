# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto
adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.9.0] - 2025-01-08

### 🎨 Features - Componentes Markdown Personalizados

#### ✨ Novos Componentes Visuais

**1. MarkdownImage - Imagens Simplificadas**
- Imagem responsiva com borda e sombra suave
- Caption opcional (figcaption) para texto alternativo
- Tratamento de erro (esconde se falhar)
- Arredondamento e espaçamento adequado
- Visual limpo e profissional

**2. MarkdownListItem - Listas Estilizadas**
- **Listas Ordenadas:** Números em círculos azuis com sombra
- **Listas Não Ordenadas:** Bullets azuis com anel decorativo
- **Task Lists (Checkboxes):**
  - Não marcada: Borda cinza, fundo branco, hover interativo
  - Marcada: Borda e fundo verde esmeralda, ícone de check branco
  - Texto com line-through quando marcado
- Contador CSS automático para listas ordenadas
- Transições suaves (200ms)

**3. MarkdownTable - Tabelas Responsivas**
- Container com scroll horizontal automático
- Header com borda inferior dupla e background cinza claro
- Bordas internas entre linhas (última linha sem borda)
- Células com padding adequado (px-4 py-2)
- Alinhamento automático (esquerda, centro, direita)
- Cores suaves (slate-700 no header, slate-600 no body)
- Sem bordas externas para visual limpo

**4. MarkdownLink - Links Estilizados por Tipo**
- **Links Externos (https://):**
  - Cor: Azul indigo com ícone `ExternalLink`
  - Abre em nova aba com `target="_blank"`
  - Segurança: `rel="noopener noreferrer"`
- **Âncoras Internas (#):**
  - Cor: Roxo violeta com ícone `LinkIcon`
  - Navegação interna suave
- **E-mail (mailto:):**
  - Cor: Verde esmeralda com ícone `Mail`
- **Links Internos/Relativos:**
  - Cor: Slate com hover indigo
- Sublinhado decorativo no hover (2px, offset 4px)
- Ícones com animação (opacidade 50% → 100%)
- Suporte dark mode completo

**5. MarkdownKbd - Atalhos de Teclado**
- Visual de tecla física com efeito 3D
- Borda cinza e background claro
- Sombra inferior para efeito "pressionável"
- Font mono, texto pequeno e semibold
- Suporte dark mode

**6. MarkdownInlineCode - Código Inline**
- Background cinza claro com overlay indigo sutil
- Padding horizontal e vertical adequado
- Font mono, tamanho 0.875em
- Arredondamento suave
- Suporte dark mode

**7. MarkdownHr - Separador Horizontal**
- Linha com gradiente (transparente → cinza → transparente)
- Ícone `Sparkles` no centro em círculo branco
- Espaçamento vertical generoso (my-8)
- Visual elegante e minimalista
- Suporte dark mode

#### 🔧 Melhorias no Sistema

**Integração Completa:**
- Todos os componentes integrados em `markdown-components.tsx`
- Componentes de lista (`MarkdownOrderedList`, `MarkdownUnorderedList`) agora usados corretamente
- Detecção automática de tipo de link (externo, âncora, email, interno)
- Alinhamento de tabelas detectado via `style.textAlign`

**Markdown Padrão Expandido:**
- Adicionados exemplos completos para TODOS os componentes
- Seção "Código Inline" com 4 exemplos práticos
- Seção "Atalhos de Teclado" com 8 atalhos documentados
- Seção "Links Estilizados" com exemplos de todos os tipos
- Seção "Separadores Horizontais" com múltiplos exemplos
- Seção "Resumo de Componentes" com lista de 10 componentes
- Citação adicional (Cory House)
- Guia de "Próximos Passos" expandido com 5 ações

#### 🐛 Bug Fixes

- Corrigido contador CSS em listas ordenadas (agora incrementa corretamente)
- Removido header desnecessário do componente de tabela
- Removida borda externa das tabelas
- Ajustado espaçamento e padding de todos os componentes
- Corrigido alinhamento de ícones em links (baseline)
- Lista de resumo corrigida para usar bullets ao invés de checkboxes soltos

#### 📦 Arquivos Criados

- `src/components/markdown-editor/markdown-image.tsx`
- `src/components/markdown-editor/markdown-lists.tsx`
- `src/components/markdown-editor/markdown-table.tsx`
- `src/components/markdown-editor/markdown-link.tsx`
- `src/components/markdown-editor/markdown-kbd.tsx`
- `src/components/markdown-editor/markdown-inline-code.tsx`
- `src/components/markdown-editor/markdown-hr.tsx`

#### 🎯 Impacto

- **Visual:** Markdown agora tem aparência premium e profissional
- **Consistência:** Todos os elementos seguem o mesmo design system
- **Usabilidade:** Ícones e cores ajudam a identificar tipos de conteúdo
- **Acessibilidade:** Contraste adequado e suporte dark mode
- **Documentação:** Markdown padrão serve como guia completo

---

## [0.8.0] - 2025-01-08

### 🎨 Features - Admonitions (Callouts) e Refatoração Completa

#### ✨ Admonitions (Callouts GitHub-Style)

- **5 Tipos de Callouts Coloridos:**
  - `[!NOTE]` - Nota (azul) com ícone Info
  - `[!TIP]` - Dica (verde) com ícone Lightbulb
  - `[!IMPORTANT]` - Importante (roxo) com ícone AlertCircle
  - `[!WARNING]` - Aviso (laranja) com ícone TriangleAlert
  - `[!CAUTION]` - Cuidado (vermelho) com ícone ShieldAlert

- **Componente Admonition:**
  - Renderização customizada de blockquotes com `[!TYPE]`
  - Design premium com bordas coloridas e ícones
  - Background suave e texto legível
  - Labels em maiúsculas
  - Glassmorphism effect

- **Parser Inteligente:**
  - Detecção automática de blockquotes com marcadores `[!TYPE]`
  - Remoção do marcador do conteúdo
  - Fallback para blockquote normal se não for admonition

#### 🔧 Refatoração Completa - Componente Centralizado

- **`markdown-components.tsx` - Componente Único:**
  - Criado arquivo centralizado com TODAS as melhorias
  - Redução de ~450 linhas de código duplicado
  - Manutenção simplificada (alterar uma vez, aplica em todos)

- **Features Centralizadas:**
  - ✅ Mermaid.js (diagramas interativos)
  - ✅ Admonitions (5 tipos de callouts)
  - ✅ PreComponent (blocos de código estilizados)
  - ✅ IDs automáticos nos headers (para TOC e navegação)
  - ✅ Page breaks estilizados
  - ✅ Tabelas responsivas e estilizadas
  - ✅ Imagens responsivas com bordas e sombras
  - ✅ Parágrafos como div (evita erros de hidratação)
  - ✅ Code inline estilizado

- **Previews Refatorados:**
  - `md-editor` - Agora usa componente centralizado
  - `md-to-pdf` - Agora usa componente centralizado
  - `gist-explorer` - Agora usa componente centralizado
  - Todos com comportamento idêntico e profissional

- **Integração Completa no Gist Explorer:**
  - TOC Interativo (opcional)
  - Link Validator
  - Mermaid.js
  - Admonitions
  - Todas as melhorias do md-editor e md-to-pdf

#### 📝 Markdown Padrão Atualizado

- Adicionados exemplos de todos os 5 tipos de Admonitions
- Exemplos de diagramas Mermaid (fluxograma e sequência)
- Documento mais completo e demonstrativo

### 🔧 Melhorias Técnicas

- **PreComponent Aprimorado:**
  - Detecção de Mermaid para evitar renderização como código
  - Fallback inteligente para blocos não-Mermaid

- **Consistência Total:**
  - Mesmo comportamento em todos os previews
  - Mesmas funcionalidades disponíveis
  - Código limpo e organizado

### 📦 Arquivos Criados

- `src/components/markdown-editor/admonition.tsx`
- `src/shared/utils/admonition-parser.tsx`
- `src/shared/utils/markdown-components.tsx` (componente centralizado)

### 📝 Arquivos Modificados

- `src/app/(tools)/md-editor/_components/preview.tsx` - Usa componente centralizado
- `src/app/(tools)/md-to-pdf/_components/preview.tsx` - Usa componente centralizado
- `src/app/(tools)/gist-explorer/_components/gist-preview/md-preview/index.tsx` - Usa componente centralizado + TOC + Link Validator
- `src/components/markdown-editor/pre-component.tsx` - Detecção de Mermaid
- `src/shared/constants/default-markdown.ts` - Exemplos de Admonitions

### 🐛 Correções

- PreComponent não renderiza mais Mermaid como código
- Gist Explorer agora tem todas as features do md-editor
- Código duplicado eliminado (~450 linhas)

---

## [0.7.0] - 2025-01-08

### 🎨 Features - Suporte a Diagramas Mermaid.js

#### ✨ Renderização de Diagramas Interativos

- **Componente MermaidDiagram:**
  - Renderização client-side de diagramas Mermaid
  - Inicialização única com configuração otimizada
  - Tema padrão com fonte customizável
  - IDs únicos para cada diagrama
  - Estados de loading e erro com feedback visual

- **Tipos de Diagramas Suportados:**
  - **Fluxogramas** (`graph TD`, `graph LR`, etc.)
  - **Diagramas de Sequência** (`sequenceDiagram`)
  - **Gráficos de Gantt** (`gantt`)
  - **Diagramas de Classe** (`classDiagram`)
  - **Diagramas de Estado** (`stateDiagram`)
  - **Diagramas de Entidade-Relacionamento** (`erDiagram`)
  - **Gráficos de Pizza** (`pie`)
  - E todos os outros tipos suportados pelo Mermaid.js

- **Integração com Preview:**
  - Detecção automática de blocos ` ```mermaid `
  - Renderização inline no preview do Markdown
  - Centralização automática dos diagramas
  - Espaçamento consistente com o restante do conteúdo
  - Funciona em `md-editor` e `md-to-pdf`

- **Tratamento de Erros:**
  - Mensagens de erro detalhadas com ícone visual
  - Borda vermelha para destacar problemas
  - Não quebra o preview em caso de erro
  - Console log para debugging

- **Performance:**
  - Lazy rendering (apenas quando necessário)
  - Cache de diagramas renderizados
  - Não bloqueia a renderização do restante do documento

#### 📝 Exemplos no Markdown Padrão

- Adicionado seção "Diagramas Mermaid" no documento padrão
- Exemplo de fluxograma de processo de autenticação
- Exemplo de diagrama de sequência para API REST
- Demonstra sintaxe e possibilidades

### 🔧 Melhorias Técnicas

- **Dependência:** `mermaid@11.12.2` adicionada
- **Componentes Customizados:** Integração com `react-markdown`
- **Type Safety:** Tipagem completa para props e estados
- **Acessibilidade:** Estados de loading e erro acessíveis

### 📦 Arquivos Criados

- `src/components/markdown-editor/mermaid-diagram.tsx`

### 📝 Arquivos Modificados

- `src/app/(tools)/md-editor/_components/preview.tsx` - Integração Mermaid
- `src/app/(tools)/md-to-pdf/_components/preview.tsx` - Integração Mermaid
- `src/shared/constants/default-markdown.ts` - Exemplos de diagramas
- `package.json` - Dependência mermaid

---

## [0.6.0] - 2025-01-08

### 🎉 Features Principais - Markdown Editor & PDF Pro

#### ✨ TOC Interativo (Table of Contents)

- **Toggle Opcional no Toolbar:**
  - Botão com ícone `ListTree` no ActionToolbar
  - Estado persistido em localStorage
  - Indicador visual quando ativo (fundo azul)
  - Configuração `preview.showTOC` e `preview.tocPosition`

- **Painel Flutuante Interativo:**
  - Posicionamento absoluto dentro do preview (esquerda ou direita)
  - Design premium com glassmorphism e backdrop-blur
  - Expansível/retrátil com animações suaves (500ms)
  - Extração automática de headers (`#` até `######`)
  - Indentação visual por nível de header
  - Linha vertical de guia para subníveis
  - Ícone `Hash` para H1, `ChevronRight` rotacionável para demais
  - ScrollArea para listas longas

- **Navegação e Highlight:**
  - Click para scroll suave até o header
  - Detecção automática do header ativo durante scroll
  - Barra lateral colorida (`bg-primary`) no item ativo
  - Animações de fade-in e slide-in
  - Truncate de títulos longos

- **IDs Automáticos nos Headers:**
  - Geração de slugs para todos os headers (H1-H6)
  - Formato: `texto-do-header` (lowercase, sem caracteres especiais)
  - Preparado para bookmarks nativos no PDF (futuro)
  - Implementado em `md-editor` e `md-to-pdf`

#### 🔗 Validação de Links em Tempo Real

- **Extração Inteligente de Links:**
  - Detecta `[texto](url)` - Links Markdown
  - Detecta `![alt](url)` - Imagens
  - Detecta `<url>` - URLs diretas
  - Ignora `mailto:` automaticamente
  - Identifica tipo: `anchor`, `internal`, `external`
  - Captura linha e coluna de cada link

- **Validação via Server Action (Sem CORS):**
  - Server Action em `src/app/actions/validate-links.ts`
  - Validação de segurança (protocolos, hosts bloqueados, IPs privados)
  - User-Agent customizado: `Mozilla/5.0 (LinkValidator/1.0)`
  - Timeout de 5 segundos por link
  - Fallback inteligente: HEAD → GET se necessário
  - Batch validation: até 50 links por vez
  - Concorrência limitada: 5 requests simultâneos
  - Deduplicação de URLs antes de validar

- **Validação Local de Âncoras:**
  - Valida âncoras (`#header`) localmente (rápido)
  - Cache de IDs disponíveis no documento
  - Usa mesma lógica de slugify do TOC

- **Painel de Validação:**
  - Posicionado no canto inferior direito
  - Design glassmorphism consistente com TOC
  - Expansível/retrátil com animações
  - Badge com contador de links quebrados

- **Estatísticas e Relatório:**
  - Grid com 3 cards: Total, Válidos (verde), Quebrados (vermelho)
  - Progress bar durante validação
  - Lista detalhada de links quebrados:
    - Ícones por tipo (âncora, externo)
    - Texto do link + URL
    - Mensagem de erro específica (HTTP 404, Timeout, etc)
    - Linha e coluna do link no markdown
  - ScrollArea para listas longas
  - Mensagem de sucesso quando todos válidos

- **Segurança:**
  - Máximo de 50 links por batch
  - Bloqueio de localhost, 127.0.0.1, 0.0.0.0
  - Bloqueio de IPs privados (10.x, 192.168.x, 172.16-31.x)
  - Apenas protocolos http: e https:
  - Validação de URL antes de fazer request

### 🐛 Correções

- **TOC:**
  - Posicionamento corrigido de `fixed` para `absolute` (dentro do preview)
  - Altura adaptável com `max-h-[calc(100vh-12rem)]`
  - Transição suave sem quebra de layout (300ms)
  - Ícone `ListTree` espelhado quando à esquerda
  - Scroll suave com offset correto para o container

- **Link Validator:**
  - Correção na detecção de links externos (regex melhorada)
  - Fallback GET quando HEAD retorna 405
  - Tratamento de erros de timeout e rede
  - Mapeamento correto de resultados em batch

### 📝 Arquivos Criados

- `src/components/markdown-editor/interactive-toc.tsx` - Componente do TOC
- `src/components/markdown-editor/link-validator-panel.tsx` - Painel de validação
- `src/shared/utils/link-validator.ts` - Lógica de validação client-side
- `src/shared/utils/clear-toc-cache.ts` - Utilitário de limpeza de cache
- `src/app/actions/validate-links.ts` - Server Action para validação

### 🔧 Arquivos Modificados

- `src/shared/@types/global.d.ts` - Adicionado `PreviewConfig`
- `src/shared/constants/default-config.ts` - Config padrão do TOC
- `src/shared/contexts/appContext.tsx` - Funções `toggleTOC` e `updateTOCPosition`
- `src/app/(tools)/_components/action-toolbar.tsx` - Botão de toggle do TOC
- `src/app/(tools)/md-editor/_components/preview.tsx` - Integração TOC + Link Validator
- `src/app/(tools)/md-to-pdf/_components/preview.tsx` - Integração TOC + Link Validator

### 📊 Versão

- **0.5.6 → 0.6.0** (Minor version bump - novas features)

---

## [0.5.6] - 2025-01-08

### 🚀 Adicionado

#### Web Extractor - 4 Features Avançadas

- **Histórico de URLs com IndexedDB:**
  - Armazenamento persistente de até 100 URLs extraídas
  - Autocomplete inteligente no input principal
  - Busca em tempo real por URL, título ou excerpt
  - Indicadores visuais de sucesso/falha
  - Tempo relativo de extração (ex: "2h atrás")
  - Botão para limpar histórico completo

- **Agregador de URLs (Batch Extractor):**
  - Adicionar múltiplas URLs para extração em lote
  - Input com autocomplete do histórico
  - Processamento sequencial com progress bar
  - Combina todos os HTMLs em um único documento
  - Preview integrado no painel principal
  - Separadores visuais entre artigos:
    - Header com gradiente e borda roxa
    - Link da fonte com emoji 🔗
    - Linha tracejada entre conteúdos
  - Botão "Visualizar Resultado" após processamento
  - Cada URL processada é salva no histórico automaticamente

- **Relatório de Integridade (Soft-Failure):**
  - Coleta de métricas durante extração:
    - Imagens encontradas vs recuperadas (com % de recuperação)
    - Links processados
    - Tamanho do conteúdo (em KB)
    - Modo usado (Readability ou Fallback)
  - Warnings não-bloqueantes (ex: "Imagem sem src")
  - Erros críticos reportados separadamente
  - Componente colapsável com badge de contagem
  - Grid de stats com ícones e progress bars
  - Cores por severidade (verde/amarelo/vermelho)

- **Modo Reader de Backup Aprimorado:**
  - Fallback inteligente quando Readability falha
  - Limpeza automática de elementos indesejados:
    - Headers, navs, footers, sidebars, menus
    - Ads, popups, cookies, modals
  - Busca inteligente por main content (`article`, `main`, `.content`)
  - Formatação básica de imagens no fallback
  - Aviso visual quando fallback é usado
  - Remove estilos inline e classes para conteúdo limpo

### 🔧 Melhorado

- **Web Extractor:** Foco em HTML (não Markdown) - conversão é opcional
- **Web Extractor:** Todas as features com soft-failure (não bloqueiam extração)
- **Agregador:** Separadores visuais elegantes com gradiente entre URLs
- **Agregador:** Contagem correta de sucessos durante processamento
- **Agregador:** Botão mostra quantidade de URLs: "Extrair Todas (X)"

### 🐛 Corrigido

- **Agregador:** Corrigido bug onde primeira extração falhava (contagem assíncrona)
- **Agregador:** Input totalmente funcional (removido conflito com Popover)
- **Agregador:** Histórico com dropdown nativo (sem bloqueios)
- **Web Extractor:** Corrigido fluxo de processamento e visualização

## [0.5.5] - 2025-01-07

### 🚀 Adicionado

#### Code Snapshot - Line Highlighting Avançado

- **Destaque de linhas customizável:**
  - Clique nos números de linha para destacar/remover destaque
  - Cor do highlight personalizável (8 cores pré-definidas)
  - Opacidade ajustável (10% a 50%) para facilitar leitura
  - Destaque visual completo na linha (fundo, borda lateral, sombra)
  - Lista de linhas destacadas com opção de limpar todas

#### Code Snapshot - Anotações Melhoradas

- **Escolha de ícones para anotações:**
  - 10 ícones disponíveis: Nota, Info, Alerta, Check, Estrela, Coração, Ideia, Bug, Código, Rápido

- **Drag and drop para reposicionar:**
  - Clique e arraste na anotação para mover livremente
  - Animação suave com Framer Motion
  - Cursor visual indica modo de arraste

- **Visual modernizado do editor de anotações:**
  - Layout inspirado no padrão de modais do projeto
  - Header com ícone e gradiente
  - Organização em grid para ícones e cores
  - Footer com seletor de estilo e ações

### 🔧 Melhorado

- **Anotações:** Remoção do grip visual desnecessário - arraste direto na nota
- **Anotações:** Atualização em tempo real das propriedades (sem necessidade de salvar)
- **Highlight:** Integração com diff mode - highlights só aplicam em linhas unchanged

## [0.5.4] - 2025-01-XX

### 🔧 Melhorado

#### Code Snapshot - Simplificação do Contexto

- **Refatoração do `CodeSnapshotContext`:**
  - Removidas funções de URL sharing do contexto (`getShareableUrl`, `copyShareableUrl`)
  - Lógica de compartilhamento movida para `snapshot-controls.tsx` onde é realmente usada
  - Contexto agora focado apenas no estado essencial (code, config)
  - Mantida compatibilidade total com outras ferramentas que usam `setCode` (ex: gist-explorer)

- **Limpeza de código:**
  - Removido hook `use-url-state.ts` não utilizado
  - Removidos imports não utilizados do contexto
  - Corrigidos imports de `PRESET_SIZES` (agora vem de `snap-code.ts`)
  - Removidos imports de tipos globais desnecessários

### 🐛 Corrigido

- **Code Snapshot:** Corrigido erro de build ao importar `PRESET_SIZES` do contexto
- **Code Snapshot:** Corrigido erro de TypeScript ao importar tipos globais de `.d.ts`

## [0.5.3] - 2025-01-XX

### 🚀 Adicionado

#### Code Snapshot - Compartilhamento via URL

- **Sistema completo de compartilhamento de snapshots via URL:**
  - Serialização/deserialização de estado completo em base64
  - Mapeamento de campos curtos para URLs mais curtas (ex: `bg` → `backgroundColor`)
  - Sincronização automática de estado com URL
  - Botão "Compartilhar" que copia URL para clipboard
  - Suporte a query params curtos e estado serializado completo
  - Baseado na implementação do Carbon.now.sh

#### Code Snapshot - Importação de GitHub Gist

- **Funcionalidade para importar código diretamente de Gists:**
  - Campo de input para URL ou ID do Gist
  - Extração automática do ID da URL do Gist
  - Busca e carregamento do conteúdo via GitHub API
  - Detecção automática de linguagem baseada no arquivo do Gist
  - Botão GitHub no header dos controles para mostrar/ocultar importação
  - Feedback visual com loading e toasts

### 🐛 Corrigido

- **Formatters (HTML/CSS/JavaScript/SQL):** Corrigido erro de minificação na Vercel
  (`Kr is not defined`)
  - Convertidos imports dinâmicos dos plugins do Prettier para imports estáticos
  - Resolvido problema de tree-shaking que causava referências não definidas no build de produção
  - Melhorada compatibilidade com diferentes formas de exportação dos plugins

- **Code Snapshot:** Corrigido erro de importação duplicada do componente `Separator`
- **Code Snapshot:** Corrigido erro de tipo TypeScript ao aplicar estado da URL
- **Code Snapshot:** Ajustado hook `useUrlState` para evitar necessidade de Suspense boundary (usa
  `window.location` diretamente)

### 🔧 Melhorado

- Criado `lib/routing.ts` com funções de serialização baseadas no Carbon.now.sh
- Criado hook `use-url-state.ts` para gerenciar estado na URL
- Integrado sistema de URL state no `CodeSnapshotContext`
- Criado componente `gist-import.tsx` para importação de Gists
- Adicionado Suspense boundary na página do Code Snapshot

## [0.5.2] - 2025-01-XX

### 🚀 Adicionado

#### Code Snapshot - Features Interativas

- **Interactive Code Annotations:**
  - Sistema completo de anotações flutuantes sobre o código
  - Dois tipos de anotações: setas (apontando para linhas) e notas (texto flutuante)
  - Clique no código para adicionar anotações quando o modo estiver ativo
  - Edição inline de anotações com popover
  - Cores customizáveis (padrão: amarelo)
  - Anotações são exportadas junto com a imagem do snapshot

- **Modo "Live Edit" no Preview:**
  - Edição direta do código no painel de preview
  - Textarea editável substitui o SyntaxHighlighter quando ativo
  - Ajustes rápidos de última hora sem precisar voltar ao editor
  - Mantém formatação e estilo do código
  - Sincronização automática com o código principal

### 🔧 Melhorado

- **Code Snapshot Controls:**
  - Adicionados switches para ativar/desativar Live Edit e Annotation Mode
  - Contador de anotações ativas
  - Botão para remover todas as anotações de uma vez

### 🐛 Corrigido

- Correção de tipos TypeScript em vários componentes
- Exportação correta de tipos SnapshotConfig e PresetSize
- Correção de tipos implícitos em callbacks e map functions

## [0.5.1] - 2025-01-XX

### 🚀 Adicionado

#### JSON Formatter - Novos Formatos de Conversão

- **Suporte para TOML (Tom's Obvious Minimal Language):**
  - Conversão JSON ↔ TOML com suporte completo
  - Suporte a tabelas, arrays de tabelas e valores complexos
  - Detecção automática de formato TOML no output panel

- **Suporte para TOON (Token-Oriented Object Notation):**
  - Conversão JSON ↔ TOON otimizada para LLMs
  - Formato compacto com chaves sem aspas quando possível
  - Redução de tokens mantendo legibilidade

#### JSON Tree View - Melhorias de UX

- **Tree View inicia expandida por padrão:**
  - Todos os nós expandidos automaticamente ao carregar JSON
  - Atualização automática quando o JSON muda
  - Usuário ainda pode colapsar/expandir manualmente

### 🔧 Melhorado

- **Conversão de Formatos:**
  - Botões de conversão movidos para o header, ao lado de "Embelezar" e "Minificar"
  - Conversão agora aplicada no output formatado (mais lógico)
  - Melhor detecção automática de formato no output panel
  - Syntax highlighting apropriado para cada formato (XML, YAML, CSV, TOML, TOON)

- **JSON Tree View - Tema Dracula:**
  - Visual completamente redesenhado com tema Dracula
  - Ícones específicos para cada tipo de dado (objetos, arrays, strings, números, booleanos, null)
  - Hierarquia visual com linhas de conexão verticais
  - Cores temáticas para diferentes tipos de dados
  - Hover effects aprimorados com transições suaves
  - Badges de tipo estilizados com cores Dracula

- **Code Snapshot:**
  - Background do editor muda dinamicamente conforme o tema selecionado
  - Consistência visual entre preview e editor

### 🐛 Corrigido

- Erro de validação JSON ao converter para outros formatos (YAML, XML, CSV)
- Validação agora só executa quando o input é JSON válido
- Correção de tipos TypeScript nos plugins do Prettier

## [0.5.0] - 2025-01-XX

### 🚀 Adicionado

#### JSON Formatter - Features Avançadas

**JSON Fixer Inteligente:**

- **Correção automática** de erros comuns em JSONs:
  - Aspas simples → aspas duplas
  - Vírgulas sobrando (antes de `}` ou `]`)
  - Falta de aspas em chaves
  - Literais em caixa alta (`TRUE`, `FALSE`, `NULL`) → `true`, `false`, `null`
- Botão "Corrigir JSON" no toolbar com feedback visual das correções aplicadas

**Visualização de Imagens em Tree View:**

- **Preview de imagens** ao passar o mouse sobre URLs de imagem no Tree View
- Detecção automática de URLs de imagem (jpg, png, gif, webp, svg, bmp, ico)
- Popover com preview da imagem e URL completa
- Interface intuitiva com underline pontilhado indicando URLs clicáveis

**Smart JSONPath Tracking:**

- **Exibição em tempo real** do caminho JSON (JSONPath) da chave onde o cursor está posicionado
- Atualização automática ao mover o cursor ou selecionar texto
- Display no header do editor mostrando o path atual
- Facilita navegação em arquivos JSON grandes

**Conversão Cruzada Entre Formatos:**

- **Conversão instantânea** entre JSON, XML, YAML e CSV
- Menu dropdown no toolbar com opções de conversão
- Preservação da estrutura de dados durante conversão
- Feedback visual com toast notifications
- Suporte para:
  - JSON → XML (com formatação adequada)
  - JSON → YAML (com indentação correta)
  - JSON → CSV (para arrays de objetos ou objetos simples)
  - XML → JSON (parsing básico)
  - CSV → JSON (detecção automática de headers)

### 🔧 Melhorado

- **JsonEditorToolbar:** Adicionados botões para JSON Fixer e conversão de formatos
- **FormatterEditorPanel:** Suporte para callback de JSON Path tracking
- **CodeFormatterEditor:** Integração de eventos de cursor para tracking em tempo real
- **JsonTreeView:** Preview de imagens com Popover component

### 📝 Documentado

- Utilitários de conversão de formatos (`format-converter-utils.ts`)
- Função `fixJson` com detecção e correção de erros comuns
- Sistema de tracking de JSON Path em tempo real

---

## [0.4.0] - 2025-01-XX

### 🚀 Adicionado

#### Code Snapshot - Modo Diff e Line Highlighting

**Modo Diff:**

- **Detecção automática** de diffs no formato git diff
- **Parsing inteligente** de linhas adicionadas (+), removidas (-) e headers
- **Estilos visuais diferenciados:**
  - Linhas adicionadas: fundo verde com borda esquerda verde (`rgba(46, 160, 67)`)
  - Linhas removidas: fundo vermelho com borda esquerda vermelha e opacidade reduzida
    (`rgba(248, 81, 73)`)
  - Headers de diff: fundo cinza com texto em negrito
- **Ativação automática** quando um diff é detectado no código

**Line Highlighting Contextual:**

- **Clique em números de linha** para adicionar comentários explicativos
- **Popover modal** para editar comentários com:
  - Campo de texto para adicionar/editar comentários
  - Botão para remover comentários
  - Atalho `Ctrl+Enter` / `Cmd+Enter` para salvar rapidamente
  - Atalho `Escape` para cancelar
- **Highlights visuais** (borda amarela) para linhas com comentários
- **Persistência** de comentários no estado da configuração
- **Suporte completo** para modo diff + highlights combinados

**Preset Terminal Retro:**

- Novo preset de mockup de janela "Terminal Retro"
- Estilo retro minimalista com:
  - Fundo preto (`#0a0a0a`)
  - Texto verde terminal (`#00ff41`)
  - Prompt `$` com cursor piscante
  - Badge `[RETRO]` no canto direito
  - Fonte monoespaçada

### 🔧 Melhorado

- **Code Snapshot Context:** Adicionados campos `diffMode` e `lineHighlights` ao config
- **Sistema de tipos:** Expandido `WindowThemeType` para incluir `'retro'`
- **Integração:** Modo diff e line highlighting totalmente integrados ao preview

### 📝 Documentado

- Utilitários de diff (`diff-utils.ts`) com funções de detecção e parsing
- Componente de comentários (`line-comment-popover.tsx`) reutilizável

---

## [0.3.0] - 2025-01-XX

### 🚀 Adicionado

#### Formatadores de Dados - Melhorias Avançadas

**JSON Formatter:**

- **Copy JSON Path:** Menu de contexto e atalho de teclado (`Ctrl+Shift+P` / `Cmd+Shift+P`) para
  copiar o caminho JSON exato (ex: `data.users[0].profile.name`)
- **JSON Tree View:** Visualização em árvore do JSON com:
  - Colapso/expansão de nós interativo
  - Cores diferenciadas por tipo de dado (string, number, boolean, object, array, null)
  - Copiar JSON Path diretamente da árvore
  - Interface responsiva e intuitiva
  - Aba "Tree View" no formatador JSON

**SQL Formatter:**

- **SQL Linter Integrado:** Validações avançadas de sintaxe SQL:
  - Detecção de vírgulas duplicadas ou sobrando
  - Validação de vírgula antes de FROM
  - Verificação de JOIN sem cláusula ON
  - Validação de GROUP BY sem funções de agregação
  - Verificação de HAVING sem GROUP BY
  - Validação de ORDER BY sem SELECT
  - Detecção de aspas simples não fechadas
  - Validação de chaves desbalanceadas (para blocos PL/SQL)

### 🔧 Melhorado

- **Code Formatter Editor:** Integração com Monaco Editor para suporte a ações customizadas
- **Validações em Tempo Real:** Feedback imediato de erros e avisos nos formatadores

### 🐛 Corrigido

- **Cheerio Options:** Removidas opções não suportadas (`decodeEntities`, `xmlMode`) - Cheerio já
  decodifica entidades por padrão
- **Variáveis Duplicadas:** Corrigido conflito de nomes de variáveis no SQL Linter
- **Build:** Corrigido problema de import dinâmico no Turbopack

---

## [0.2.0] - 2025-01-XX

### 🚀 Adicionado

#### Otimizações de Performance

- **Migração JSDOM → Cheerio** no Web Extractor
  - Redução de ~10x no tempo de processamento
  - Redução significativa no uso de memória
  - Melhor compatibilidade com ambientes serverless (Vercel)
- **Timeout reduzido** no scraper de 15s para 8.5s
  - Evita timeout na Vercel (limite de 10s no plano Hobby)
  - Melhor tratamento de erros de timeout

#### JWT Decoder - Melhorias

- **Tooltips explicativos** para claims padrão JWT
  - Descrições detalhadas ao passar o mouse sobre claims padrão (exp, iat, sub, iss, aud, etc.)
  - Formatação automática de timestamps Unix para datas legíveis
  - Badge "Padrão" com tooltip explicativo
- **Simulador de Modificação**
  - Nova aba "Simulador" para editar o payload do JWT
  - Geração automática do token a partir do payload editado
  - Útil para depuração de estruturas de dados
  - Avisos claros sobre assinatura inválida

#### Documentação

- **Consolidação de documentação técnica**
  - `OTIMIZACOES-E-FEATURES-FERRAMENTAS-EXISTENTES.md` - Todas as melhorias propostas
  - `NOVAS-FERRAMENTAS.md` - 11 novas ferramentas propostas
  - Documentação organizada e priorizada

### 🔧 Melhorado

- **Web Extractor (scrapper-html-v2.ts)**
  - Processamento inicial com Cheerio (muito mais leve)
  - JSDOM usado apenas quando necessário para Readability
  - Melhor tratamento de erros e validações
- **PDF Generation**
  - Server Action deprecated marcada com aviso
  - Sistema já usa API Route com streaming (otimizado)
  - Documentação sobre uso preferencial

### 📝 Documentado

- Análise técnica detalhada das otimizações
- Roadmap consolidado de features
- Priorização de melhorias e novas ferramentas

### 🔒 Segurança

- Validações de tamanho de token JWT (máximo 64KB)
- Sanitização adequada de inputs
- Tratamento seguro de erros

---

## [0.1.0] - 2024-XX-XX

### 🎉 Lançamento Inicial

- Editor Markdown para PDF profissional
- Web Extractor (HTML para Markdown)
- Formatadores de código (JSON, SQL, HTML, CSS, JavaScript)
- JWT Decoder básico
- Code Snapshot (código para imagem)
- E outras ferramentas utilitárias

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades
