# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto
adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

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
