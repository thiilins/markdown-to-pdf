# Análise Comparativa: Code Snapshot vs Carbon.now.sh

## 📊 Status Atual vs Carbon.now.sh

### ✅ Features Já Implementadas (Melhor que Carbon)

1. **Presets de Redes Sociais** ✅
   - Carbon: Não tem presets específicos
   - Nossa: LinkedIn, Twitter, Instagram, TikTok, YouTube, Facebook com dimensões exatas

2. **Code Diff Mode** ✅
   - Carbon: Não tem
   - Nossa: Detecção automática de diffs, linhas adicionadas/removidas com cores

3. **Line Highlights com Comentários** ✅
   - Carbon: Não tem
   - Nossa: Clique em linhas para adicionar comentários explicativos

4. **Interactive Code Annotations** ✅
   - Carbon: Não tem
   - Nossa: Setas e notas flutuantes sobre o código

5. **Live Edit Mode** ✅
   - Carbon: Não tem
   - Nossa: Edição direta no preview

6. **Background Dinâmico do Editor** ✅
   - Carbon: Não tem
   - Nossa: Fundo da janela muda conforme o tema

7. **Mockups de Janela** ✅
   - Carbon: Apenas macOS básico
   - Nossa: macOS, Windows, Linux, Chrome, VSCode, Retro Terminal

8. **Footer Customizável** ✅
   - Carbon: Não tem
   - Nossa: Footer com opções (linhas, caracteres, linguagem, texto customizado)

### 🔄 Features do Carbon que Podemos Adicionar

#### 1. **Compartilhamento via URL** ⭐ Alta Prioridade

- **Carbon:** Permite compartilhar snippets via URL com estado codificado
- **Benefício:** Compartilhar configurações e código facilmente
- **Implementação Técnica (baseada no código fonte):**
  - **Arquivo:** `lib/routing.js`
  - **Funções principais:**
    - `serializeState(state)`: Codifica estado completo em base64
      ```javascript
      const stateString = encodeURIComponent(JSON.stringify(state))
      return encodeURIComponent(
        typeof window !== 'undefined'
          ? btoa(stateString)
          : Buffer.from(stateString).toString('base64'),
      )
      ```
    - `deserializeState(serializedState)`: Decodifica estado da URL
    - `updateRouteState(router, state)`: Atualiza URL com query params curtos
  - **Estratégia dupla:**
    1. **Query params curtos** (ex: `?bg=#123&t=monokai&l=javascript`) - para URLs curtas
    2. **Estado completo em base64** (`?state=eyJjb2RlIjoi...`) - quando necessário
  - **Mapeamento de campos curtos:**
    - `bg` → `backgroundColor`
    - `t` → `theme`
    - `wt` → `windowTheme`
    - `l` → `language`
    - `ds` → `dropShadow` (bool)
    - `wc` → `windowControls` (bool)
    - `ln` → `lineNumbers` (bool)
    - `fm` → `fontFamily`
    - `fs` → `fontSize`
    - `pv` → `paddingVertical`
    - `ph` → `paddingHorizontal`
    - E mais...
  - **Limite de URL:** 4KB (mesmo do Carbon)
  - **Biblioteca:** Usa `morphmorph` para mapeamento de tipos (bool, int, intArray, parse, decode,
    encode)

#### 2. **Integração com GitHub Gist** ✅ JÁ TEMOS (Diferente do Carbon)

- **Carbon:** Importa código diretamente de GitHub Gists via URL
  - **Implementação:** Coloca o ID do Gist diretamente na URL
  - **Exemplo:** `carbon.now.sh/3208813b324d82a9ebd197e4b1c3bae8`
  - **Lógica:** Se o parâmetro da URL tem 19+ caracteres e não contém ponto, assume que é ID de
    snippet/Gist
  - **Arquivo:** `pages/[id].js` - usa `getServerSideProps` para buscar snippet/Gist
  - **API:** `api.snippet.get(parameter, { host, filename })`
- **Nossa Implementação:** Integração inversa - Gist Explorer → Code Snapshot
  - Botão "Gerar Snapshot" no Gist Explorer
    (`gist-explorer/_components/gist-preview/header/download-buttons.tsx`)
  - Pega código do Gist e envia para Code Snapshot via `useCodeSnapshot().setCode(code)`
  - Navegação automática para `/code-snapshot` com código pré-carregado
- **Diferença:** Carbon importa Gist → Editor via URL, nós exportamos Gist → Snapshot via botão
- **Melhoria Futura:** Adicionar também importação direta de Gist no Code Snapshot (campo para URL
  ou ID na rota)

#### 3. **Exportação em SVG** ⭐ Média Prioridade

- **Carbon:** Exporta em PNG (`blob`) e SVG usando biblioteca customizada `dom-to-image`
- **Nossa:** Apenas PNG via `html-to-image`
- **Benefício:** SVG é escalável e menor para código simples
- **Implementação Técnica (baseada no código fonte):**
  - **Arquivo:** `lib/dom-to-image.js` (fork customizado de `tsayen/dom-to-image`)
  - **Função principal:** `toSvg(node, options)`
  - **Processo:**
    1. Clona o nó DOM com estilos computados
    2. Embute fontes (`embedFonts`) - busca `@font-face` de todas as stylesheets
    3. Inline de imagens (`inlineImages`) - converte imagens para data URLs
    4. Aplica opções (bgcolor, width, height, style)
    5. Serializa para SVG usando `XMLSerializer`
    6. Cria SVG wrapper com `foreignObject` para HTML
    7. Retorna data URL: `data:image/svg+xml;charset=utf-8,<svg>...</svg>`
  - **Tratamentos especiais:**
    - Remove `&nbsp;` e substitui por `&#160;`
    - Escapa `%23` → `#` e `%0A` → `\n`
    - Escapa `&` não escapados → `&amp;`
    - Remove fontes não utilizadas do SVG final
  - **Componente:** `components/ExportMenu.js` - botões separados para PNG e SVG
  - **Atalho:** `⌘-⇧-s` (Cmd+Shift+S) para export SVG
- **Implementação Sugerida:**
  - Usar `html-to-image` com `type: 'svg'` (mais simples) ou criar função customizada similar
  - Adicionar botão SVG no `ExportMenu` existente
  - Atalho: `Cmd/Ctrl + Shift + S` para export SVG

#### 4. **Atalhos de Teclado** ⭐ Média Prioridade

- **Carbon:** Atalhos para ações comuns usando `useKeyboardListener` de `actionsack`
- **Benefício:** Produtividade aumentada
- **Implementação Técnica:**
  - **Biblioteca:** `actionsack` (pacote npm) - fornece `useKeyboardListener` hook
  - **Uso:** `useKeyboardListener('⌘-⇧-e', preventDefault(handleExport('blob')))`
  - **Sintaxe:** Usa símbolos Unicode (`⌘` = Cmd, `⇧` = Shift, `⌥` = Alt)
  - **Componentes que usam:**
    - `components/ExportMenu.js`: `⌘-⇧-e` (PNG), `⌘-⇧-s` (SVG)
    - `components/Settings.js`: `⌘-/` (abrir), `⇧-⌘-\` (resetar)
    - `components/SnippetToolbar.js`: `⌥-s` (salvar)
    - `components/CopyMenu.js`: `⌘-⇧-c` (copiar)
- **Atalhos do Carbon (documentados em `pages/about.js`):**
  - `⌘ /` (Cmd+/) - Abrir/focar configurações
  - `⇧ ⌘ E` (Shift+Cmd+E) - Exportar PNG
  - `⇧ ⌘ S` (Shift+Cmd+S) - Exportar SVG
  - `⌥ S` (Alt+S) - Salvar snippet
  - `⇧ ⌘ C` (Shift+Cmd+C) - Copiar imagem
  - `⇧ ⌘ \` (Shift+Cmd+\) - Resetar configurações
- **Implementação Sugerida:**
  - Usar biblioteca como `react-hotkeys-hook` ou `use-hotkeys` (alternativas ao `actionsack`)
  - Ou criar hook customizado baseado em `useEffect` + `addEventListener('keydown')`
  - Atalhos sugeridos:
    - `Cmd/Ctrl + /` - Toggle controles
    - `Cmd/Ctrl + Shift + E` - Export PNG
    - `Cmd/Ctrl + Shift + S` - Export SVG
    - `Cmd/Ctrl + Shift + C` - Copy image
    - `Alt + S` - Salvar snapshot

#### 5. **Templates/Snippets Pré-definidos** ⭐ Baixa Prioridade

- **Carbon:** Alguns templates de código exemplo
- **Benefício:** Começar rápido com exemplos
- **Implementação:** Biblioteca de snippets por linguagem

#### 6. **Mais Temas de Syntax Highlighting** ⭐ Baixa Prioridade

- **Carbon:** Tem muitos temas
- **Nossa:** Temos vários, mas podemos adicionar mais
- **Implementação:** Importar mais temas do `react-syntax-highlighter`

#### 7. **Watermark Opcional** ⭐ Baixa Prioridade

- **Carbon:** Tem marca d'água opcional
- **Benefício:** Branding opcional
- **Implementação:** Switch para mostrar/ocultar watermark

### 🎯 Recomendações de Implementação

#### Prioridade Alta (Próxima Sprint)

1. **Compartilhamento via URL**
   - Maior impacto na usabilidade
   - Facilita colaboração
   - Relativamente simples de implementar
   - **Implementação baseada no Carbon:**
     - Criar `lib/routing.ts` com funções `serializeState`/`deserializeState`
     - Usar base64 para estado completo: `btoa(JSON.stringify(state))`
     - Implementar mapeamento de campos curtos (ex: `bg` → `backgroundColor`)
     - Usar biblioteca como `morphmorph` ou criar mapeamento manual
     - Atualizar URL via Next.js router com `router.replace()` e `shallow: true`
   - **URL encoding:** Query params curtos (ex: `bg` para `backgroundColor`, `t` para `theme`)
   - **Limite:** 4KB de URL (mesmo do Carbon)
   - **Arquivos de referência:** `old/carbon-now-sh/lib/routing.js`

2. **Importação Direta de Gist no Code Snapshot** (Complementar)
   - Já temos Gist → Snapshot via Gist Explorer
   - Adicionar campo para URL do Gist diretamente no Code Snapshot
   - Fetch do conteúdo via GitHub API
   - Detecção automática da linguagem

#### Prioridade Média

3. **Exportação em SVG**
   - Melhora qualidade para alguns casos
   - **Implementação baseada no Carbon:**
     - Usar `html-to-image` com `type: 'svg'` (mais simples)
     - Ou criar função customizada similar a `dom-to-image.toSvg()`
     - Processar: clonar DOM → embed fonts → inline images → serializar SVG
     - Tratar caracteres especiais (`&nbsp;`, `&`, `%23`, etc.)
   - **Arquivos de referência:** `old/carbon-now-sh/lib/dom-to-image.js`,
     `old/carbon-now-sh/components/Editor.js` (linhas 135-157)

4. **Atalhos de Teclado**
   - Melhora produtividade
   - **Implementação baseada no Carbon:**
     - Usar `react-hotkeys-hook` ou criar hook customizado
     - Implementar `useKeyboardListener` similar ao Carbon
     - Adicionar atalhos nos componentes principais (ExportMenu, Settings, etc.)
   - **Arquivos de referência:** `old/carbon-now-sh/components/ExportMenu.js`,
     `old/carbon-now-sh/components/Settings.js`

#### Prioridade Baixa

5. **Templates/Snippets**
6. **Mais Temas**
7. **Watermark**

### 📝 Conclusão

Nossa ferramenta já supera o Carbon em várias áreas:

- ✅ Mais opções de personalização
- ✅ Features únicas (diff, annotations, live edit)
- ✅ Presets de redes sociais
- ✅ Mockups de janela variados

**O que falta para superar completamente:**

- Compartilhamento via URL (feature mais importante do Carbon)
- Importação direta de Gist no Code Snapshot (já temos Gist → Snapshot via Explorer)
- Exportação SVG (nice to have)
- Atalhos de teclado (melhora produtividade)

**Recomendação:** Focar em compartilhamento via URL (usando a mesma estratégia do Carbon com
`serializeState`/`deserializeState`) para completar o diferencial competitivo.

**Nota:** Temos integração Gist → Snapshot via Gist Explorer, que é diferente mas igualmente útil. A
importação direta no Snapshot seria um complemento.

## 📚 Referências do Código Fonte do Carbon

Para facilitar a implementação futura, aqui estão os arquivos principais do código fonte do Carbon
que podem ser consultados:

### Compartilhamento via URL

- **`old/carbon-now-sh/lib/routing.js`** - Funções `serializeState`, `deserializeState`,
  `updateRouteState`, mapeamento de campos
- **`old/carbon-now-sh/lib/util.js`** - Funções auxiliares (`escapeHtml`, etc.)

### Exportação SVG

- **`old/carbon-now-sh/lib/dom-to-image.js`** - Biblioteca customizada para conversão DOM → SVG/PNG
- **`old/carbon-now-sh/components/Editor.js`** (linhas 99-166) - Função `getCarbonImage` que chama
  `domtoimage.toSvg()`
- **`old/carbon-now-sh/components/ExportMenu.js`** - Componente de menu de exportação com botões
  PNG/SVG

### Atalhos de Teclado

- **`old/carbon-now-sh/components/ExportMenu.js`** (linhas 30-31) - Uso de `useKeyboardListener`
  para export
- **`old/carbon-now-sh/components/Settings.js`** (linhas 426-427) - Atalhos para abrir/resetar
  configurações
- **`old/carbon-now-sh/components/SnippetToolbar.js`** (linha 56) - Atalho para salvar snippet
- **`old/carbon-now-sh/components/CopyMenu.js`** (linha 73) - Atalho para copiar imagem
- **`old/carbon-now-sh/pages/about.js`** (linhas 124-149) - Documentação dos atalhos

### Importação de Gist

- **`old/carbon-now-sh/pages/[id].js`** - Lógica de detecção de ID de snippet/Gist na URL
- **`old/carbon-now-sh/lib/api.js`** - Função `getSnippet` que busca snippet/Gist via API

### Estrutura Geral

- **`old/carbon-now-sh/components/Editor.js`** - Componente principal do editor
- **`old/carbon-now-sh/components/EditorContainer.js`** - Container que gerencia estado global
- **`old/carbon-now-sh/package.json`** - Dependências (actionsack, morphmorph, etc.)
