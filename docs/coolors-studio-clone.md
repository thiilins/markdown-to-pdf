# 🎨 Design Studio - Especificação Técnica & UX

> **Objetivo Geral:** Criar uma suíte de design coesa, onde a paleta do usuário persiste entre as
> diferentes ferramentas via Estado Global (Context API) ou URL Query Params.

## 1. Palette Generator (O Carro Chefe)

**Referência:** `coolors.co/generate`

### 👁️ Análise Visual (UI)

- **Layout:** Tela cheia (viewport height `100vh`).
- **Grid:** 5 colunas verticais (Desktop) ou barras horizontais (Mobile). Cada coluna ocupa 20% da
  largura.
- **Informações por Coluna:**
- **Centro:** Nome da cor (ex: "Space Cadet") e código HEX em tamanho grande.
- **Hover Actions:** Ao passar o mouse na coluna, aparecem ícones flutuantes:
- 🔒 **Lock:** Travar a cor (ícone de cadeado).
- ❌ **Remove:** Excluir coluna.
- 🧱 **Grid/Drag:** Ícone para arrastar e reordenar.
- ☀️ **Shades:** Abre uma paleta de tons daquela cor.

- **Toolbar Flutuante:** Uma barra horizontal acima das cores contendo: "Generate" (botão
  principal), "Export", "Save", "Undo/Redo".

### ⚙️ Lógica de Implementação (Como Copiar)

1. **Geração (A "Spacebar"):** Adicionar um `EventListener` global para a tecla `Space`. Quando
   pressionada, iterar sobre o array de cores. Se `isLocked === false`, gerar nova cor usando
   `chroma.random()`.
2. **Estado na URL:** Sincronizar o array de cores com a URL.

- _Exemplo:_ `/design/generate?colors=ff0000-00ff00-0000ff`
- Isso permite que o "Undo" seja apenas um `router.back()` do Next.js.

3. **Drag and Drop:** Usar a biblioteca `dnd-kit` ou `framer-motion` (que você já tem) para permitir
   arrastar as colunas.
4. **Algoritmo de Harmonia:** O Coolors não gera cores 100% aleatórias. Ele garante um mínimo de
   contraste.

- _Dica:_ Ao gerar, verifique se `chroma.contrast(novaCor, corVizinha) > 1.5` para evitar cores
  muito parecidas lado a lado.

---

## 2. Image Picker (Extrator de Cores)

**Referência:** `coolors.co/image-picker`

### 👁️ Análise Visual (UI)

- **Layout Split:**
- **Esquerda (70%):** A imagem carregada.
- **Direita (30%):** Sidebar com a paleta extraída.

- **Interação Chave (A "Lupa"):** Quando o mouse passa sobre a imagem, um círculo de zoom (Lupa)
  aparece mostrando o pixel exato e o HEX da cor sob o cursor.
- **Barra de Paleta:** Abaixo da imagem, uma barra horizontal mostra as cores já selecionadas.

### ⚙️ Lógica de Implementação

1. **Extração Automática:** Ao fazer upload, usar `colorthief.getPalette(image, 5)` (você já tem no
   `package.json`) para gerar a paleta inicial.
2. **A Lupa (Canvas):**

- Criar um `<canvas>` invisível com a imagem desenhada.
- No evento `onMouseMove`, pegar as coordenadas X/Y e usar `ctx.getImageData(x, y, 1, 1)` para pegar
  a cor do pixel.
- Renderizar um componente `div` absoluto seguindo o mouse com essa cor de fundo.

3. **Pixelização (Opcional):** O Coolors tem um slider que "pixeliza" a imagem para facilitar a
   escolha de cores médias. Isso pode ser feito via CSS `image-rendering: pixelated` reduzindo a
   resolução do canvas temporariamente.

---

## 3. Palette Visualizer (Preview Real)

**Referência:** `coolors.co/visualizer`

### 👁️ Análise Visual (UI)

- **Layout:**
- **Esquerda:** Lista de "Projetos de Exemplo" (Website, Dashboard, Poster, App Mobile, Logo).
- **Centro:** O SVG do projeto escolhido renderizado grande.
- **Direita/Baixo:** As cores da paleta atual.

- **Funcionalidade:** Ao clicar em uma cor da paleta e depois em uma área do desenho, a cor é
  aplicada. Ou um botão "Shuffle" que aplica as cores aleatoriamente no desenho.

### ⚙️ Lógica de Implementação

1. **SVGs Inteligentes:** Esta é a parte mais importante. Você não pode usar imagens PNG. Precisa
   usar **Inline SVGs** no React.
2. **Mapeamento de Cores:**

- O SVG deve ter seus `fill` e `stroke` atrelados a variáveis ou classes.
- _Estratégia:_ Criar componentes como `<DashboardTemplate colors={currentPalette} />`.
- Dentro do SVG: `<rect fill={colors[0]} />`, `<path stroke={colors[1]} />`.

3. **Shuffle:** Um botão que rotaciona o array de cores passado para o componente SVG.

---

## 4. Tailwind Colors (Catálogo)

**Referência:** `coolors.co/tailwind`

### 👁️ Análise Visual (UI)

- **Layout:** Uma grade densa ("Wall of Colors").
- **Linhas:** As cores base (Slate, Gray, Zinc, Red, Orange...).
- **Colunas:** Os pesos (50, 100, 200... 900, 950).
- **Interação:** Clique em qualquer quadrado copia a classe (ex: `bg-red-500`) ou o HEX.

### ⚙️ Lógica de Implementação

1. **Dados Estáticos:** Copiar o objeto de cores padrão do Tailwind v4.
2. **Click-to-Copy:** Usar seu hook `use-clipboard` existente.
3. **Feature Extra (Seu Diferencial):** Permitir que o usuário cole **SUA** cor (ex: `#3b82f6`) e
   você mostre qual é a cor do Tailwind mais próxima (usando `chroma.distance()`). Isso ajuda devs a
   acharem o equivalente Tailwind de um design do Figma.

---

## 5. Contrast Checker (Acessibilidade)

**Referência:** `coolors.co/contrast-checker`

### 👁️ Análise Visual (UI)

- **Layout:** Tela dividida ao meio verticalmente (ou horizontal no mobile).
- Metade A: Cor do Texto.
- Metade B: Cor do Fundo.

- **Centro:** Uma "pílula" flutuante mostrando o Score (ex: 8.43) e a classificação (Very Good,
  Poor).
- **Preview:** Texto de exemplo ("The quick brown fox...") renderizado em vários tamanhos nas duas
  metades.

### ⚙️ Lógica de Implementação

1. **Cálculo:** Usar `chroma.contrast(cor1, cor2)` para o score WCAG simples.
2. **APCA (Seu Diferencial):** Você tem `apca-w3` instalado. Adicione uma aba "Advanced Mode" que
   mostra o score Lc (que é o futuro da web), algo que o Coolors básico não enfatiza tanto.
3. **Sugestão Automática:** Se o contraste for ruim, adicione um botão "Fix" que escurece o fundo ou
   clareia o texto em loop até atingir o score 4.5 (AA).

---

## 6. Color Picker (Conversor & Info)

**Referência:** `coolors.co/color-picker`

### 👁️ Análise Visual (UI)

- **Layout:**
- Topo: Seletor de cor gigante.
- Meio: Sliders para manipular HSB, RGB, CMYK.
- Baixo: Harmonias (Complementar, Análoga, etc.) mostradas como "mini paletas".

- **Detalhes:** Mostra o nome da cor (ex: "Deep Sky Blue").

### ⚙️ Lógica de Implementação

1. **Conversão:** O `chroma-js` faz tudo isso: `chroma(color).css('hsl')`, `chroma(color).cmyk()`.
2. **Nomes:** Usar a biblioteca `ntc` (Name That Color) que vi no seu `package.json` para dar o nome
   humano.
3. **Harmonias:**

- Complementar: `chroma(color).set('hsl.h', '+180')`
- Análoga: `chroma(color).set('hsl.h', '+30')` e `-30`.

4. **SEO Programático:** Criar rotas dinâmicas `/design/color/[hex]`. Se o usuário acessar
   `/design/color/ff0000`, a página monta essas informações no servidor (SSR).

---

# 📝 Prompt para Copilot/Cursor (Para gerar o Código)

Aqui está um prompt estruturado para você colar no seu editor e começar a construir a base (O
Palette Generator):

```markdown
Role: Senior Frontend Developer Tech Stack: Next.js 16, TailwindCSS v4, Shadcn UI, Chroma.js, Lucide
React. Context: We are building 'Design Studio', a clone/improvement of Coolors.co.

Task: Create the 'Palette Generator' main component.

Requirements:

1.  **Visual Layout:**
    - Create a full-viewport component (`h-[calc(100vh-64px)]`).
    - Divide it into 5 vertical columns (`divs`) using Flexbox.
    - Each column should have a background color from the state.
    - On mobile, switch to horizontal rows.

2.  **State Management:**
    - State: `palette` (array of objects: `{ id, hex, locked: boolean }`).
    - Initialize with 5 random colors using `chroma.random()`.

3.  **Core Functionality:**
    - **Spacebar Event:** Add a `useEffect` listening for 'keydown'. If 'Space' is pressed, update
      all colors in the state where `locked` is false.
    - **Lock Toggle:** Each column needs a button to toggle the `locked` state.
    - **URL Sync:** When the palette updates, update the URL query param `?colors=hex-hex-hex`
      (shallow routing). Conversely, on mount, read the URL to set initial state.

4.  **Column UI Details:**
    - Center the HEX code text in each column.
    - Text color logic: Use `chroma.contrast(bgColor, 'white')` to decide if text should be white or
      black for readability.
    - Add a visible Toolbar on hover (Lock, Remove, DragHandle).

5.  **Components:**
    - Use `sonner` for toast notifications (e.g., "Color copied!").
    - Use `lucide-react` for icons.

Please generate the `PaletteGenerator` component and the necessary hooks.
```

# 🎨 Design Studio - Especificação Funcional e Arquitetura

> **Objetivo:** Desacoplar o atual `Color Studio` em sub-ferramentas independentes sob a rota
> `/design`, replicando e superando a UX do Coolors.co. **Stack:** Next.js (App Router), TailwindCSS
> v4, Framer Motion (animações), Chroma.js/Colorthief (Lógica).

## 1. Arquitetura de Rotas (SEO Friendly)

Ao invés de uma única página, vamos dividir para capturar tráfego de busca específico:

```text
/design-studio                  -> Landing Page (Hub)
├── /generate                   -> (O Generator principal - "Press Space")
├── /image-picker               -> (Extração de cores de fotos)
├── /visualizer                 -> (Preview em mockups reais)
├── /contrast-checker           -> (Ferramenta de Acessibilidade)
├── /tailwind-colors            -> (Escalas e Configuração Tailwind)
├── /color-converter            -> (Picker detalhado e conversão)
└── /color/[hex]                -> (Página dinâmica de info da cor - ex: /color/0066ff)

```

---

## 2. Detalhamento das Ferramentas

### A. Palette Generator Pro (`/generate`)

_A "Jóia da Coroa". Tem que ser rápido, fluido e viciante._

- **A "Coolors Way" (Referência):**
- Tela cheia, 5 barras verticais.
- **Barra de Espaço:** Gera novas cores aleatórias (exceto as travadas).
- **Hover:** Mostra opções (Lock, Remove, Drag, Edit Hex, Shades).
- **URL:** A URL muda instantaneamente (`/generate/ff0000-00ff00...`).

- **A "MD Pro Way" (Sua Versão Melhorada):**
- **Layout:** Manter as 5 colunas verticais (mobile vira horizontal).
- **Algoritmos de Harmonia:** Adicionar um dropdown discreto ("Auto", "Monocromático", "Tríade") que
  influencia a geração aleatória (o Coolors esconde isso, nós podemos facilitar).
- **Histórico Visual:** Uma barra lateral (collapsible) que mostra as últimas 50 gerações com "Undo"
  (Ctrl+Z) real.
- **Feature Killer:** Botão **"Export to Shadcn/Tailwind"** direto na barra. O Coolors exporta CSS
  genérico, você exporta o objeto de configuração do seu stack.

### B. Image Picker & Extractor (`/image-picker`)

_Extração inteligente de atmosferas._

- **A "Coolors Way":**
- Upload de imagem.
- O usuário move um "cursor" (lupa) pela imagem para pegar o pixel exato.
- Slider para "pixelar" a imagem (reduzir a complexidade).

- **A "MD Pro Way":**
- **Interação:** Implementar a "Lupa" (Zoom de 5x no hover) usando Canvas para precisão cirúrgica.
- **Auto-Palette:** Ao subir a imagem, usar o `colorthief` para gerar automaticamente 4 paletas
  sugeridas: (Dominante, Vibrante, Muted, Dark).
- **Collage Mode:** Feature para gerar uma imagem nova contendo a foto original + a barra de cores
  embaixo (perfeito para posts de design no Instagram/Pinterest).

### C. Palette Visualizer (`/visualizer`)

_Ver as cores em ação antes de usar._

- **A "Coolors Way":**
- Aplica a paleta atual em SVGs pré-definidos (ex: um poster, uma UI de app).
- Permite "embaralhar" as cores dentro do mesmo design.

- **A "MD Pro Way":**
- **Smart SVGs:** Criar 5 templates SVG de alta qualidade (Dashboard Admin, Landing Page SaaS,
  Mobile App, E-commerce, Logo).
- **Mapeamento:** Usar variáveis CSS (`--primary`, `--bg`, `--accent`) dentro dos SVGs. O React
  apenas atualiza as variáveis no style do container.
- **Diferencial:** Permitir que o usuário faça upload de **seu próprio SVG** (se ele tiver IDs
  específicos) para testar.

### D. Tailwind & Scale Architect (`/tailwind-colors`)

_Ferramenta técnica para Devs._

- **A "Coolors Way":**
- Mostra a tabela padrão do Tailwind.

- **A "MD Pro Way":**
- **Scale Generator:** O usuário coloca 1 cor central (ex: Brand Blue). A ferramenta usa
  interpolação **OKLCH** (visualmente uniforme) para gerar a escala 50-950 perfeita.
- **Config Export:** Gera o código `tailwind.config.ts` ou variáveis CSS (`@theme`) para a v4.
- **Preview de Componentes:** Mostra botões, badges e cards usando a escala gerada na hora (usando
  seus componentes Shadcn existentes).

### E. Contrast & Accessibility Lab (`/contrast-checker`)

_Segurança e Compliance._

- **A "Coolors Way":**
- Texto sobre fundo. Nota (Score) grande.

- **A "MD Pro Way":**
- **Dual Check:** Mostrar WCAG 2.1 (AA/AAA) e APCA (Lc) lado a lado.
- **Real-world Test:** Não apenas "Texto Grande" e "Pequeno". Mostrar exemplos reais: "Botão",
  "Input Placeholder", "Alert Box".
- **Sugestão Inteligente:** Se o contraste falhar, adicionar um botão "Fix it" que ajusta levemente
  o brilho da cor de fundo/texto até passar no teste.

### F. Color Picker & Converter (`/color-converter` e `/color/[hex]`)

_A ferramenta de SEO._

- **A "Coolors Way":**
- Mostra variações, conversões (CMYK, HSL, RGB), harmonias.

- **A "MD Pro Way":**
- **Name that Color:** Usar a lib `ntc` para dar nomes humanos (ex: "Deep Sky Blue").
- **Conversão de Código:** Aba "Code Snippets" que gera:
- CSS: `color: #...`
- Flutter: `Color(0xFF...)`
- Swift: `UIColor(...)`
- Android XML

- **Página Dinâmica:** Se o usuário digitar `/design/color/FF0000`, o Next.js renderiza essa página
  "on the fly". Isso é excelente para SEO programático.

---

## 3. Diretrizes de UX/UI (O "Polish")

Para ficar com a "cara" do Coolors, mas melhor:

1. **Toolbar Flutuante:** Mover as ações (Export, Save, View) para uma barra flutuante no topo ou
   base, deixando a cor ocupar 90% da tela.
2. **Toast Notifications:** Usar o `sonner` para tudo ("Cor copiada", "Link gerado").
3. **URL State:** O estado da paleta DEVE ficar na URL (`?colors=c1c1c1-ffffff...`). Isso permite
   compartilhamento instantâneo sem banco de dados.
4. **Mobile First:** No celular, as colunas devem empilhar verticalmente. O botão "Generate" deve
   ficar na zona do polegar (bottom floating action button).

## 4. Prompt para o Copilot/Cursor

Aqui está um prompt pronto para você usar, focando na primeira ferramenta (Generator):

```markdown
User Story: Create the "Palette Generator" module for the new Design Studio.

Context: We are refactoring 'Color Studio' into separate tools. Goal: Replicate the Coolors.co
functionality using Next.js 16, Tailwind v4, and Chroma.js.

Requirements:

1. Route: /design-studio/palette-generator
2. Layout: 5 vertical columns filling the viewport (h-screen minus header).
3. Core Interaction:
   - Pressing 'Spacebar' regenerates unlocked colors.
   - Clicking a 'Lock' icon on a column prevents it from changing.
   - Clicking the HEX code copies to clipboard (use Sonner for toast).
   - Drag and drop columns to reorder (use dnd-kit or framer-motion).
4. Logic:
   - Use 'chroma-js' to generate random colors initially.
   - Store the current palette in the URL query params (e.g., ?colors=hex-hex-hex).
   - Sync URL changes without reloading the page.
5. UI Components:
   - Use Shadcn UI for dropdowns (Export, Settings).
   - Use Lucide React for icons (Lock, Unlock, Copy, Drag).
   - Ensure the colors contrast with the text (dark text on light colors, white on dark).

Let's start by creating the main layout component and the state management logic for the colors.
```
