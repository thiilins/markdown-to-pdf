# SVG Templates para o Visualizer

Esta pasta contém os templates SVG usados pelo **Palette Visualizer** do Color Studio v2.

## 📁 Estrutura

Todos os arquivos `.svg` nesta pasta são automaticamente detectados e carregados pelo sistema.

## 🎨 Padrão de Nomenclatura

Os arquivos devem seguir este padrão para categorização automática:

- `ui-ux-*.svg` → Categoria: **Interface** (UI/UX)
- `branding-*.svg` → Categoria: **Branding**
- `typo-*.svg` → Categoria: **Typo** (Tipografia)
- `pattern-*.svg` → Categoria: **Pattern** (Padrões)
- `illustration-*.svg` → Categoria: **Illustration** (Ilustrações)

**Exemplo:**

- `ui-ux-1.svg` → "UI UX 1" na categoria "Interface"
- `branding-logo.svg` → "Branding Logo" na categoria "Branding"

## 🔧 Padrão Técnico (Coolors.co)

Cada SVG deve conter:

### 1. CSS Variables com Fallbacks

```html
<style>
  #vis_id .st1 {
    fill: #0a9396;
    fill: var(--c1);
  }

  #vis_id .st2 {
    fill: #94d2bd;
    fill: var(--c2, var(--c1));
  }

  #vis_id .st3 {
    fill: #ae2112;
    fill: var(--c3, var(--c2, var(--c1)));
  }

  #vis_id .st6 {
    fill: #bb3e04;
    fill: var(--c6, var(--c4, var(--c2, var(--c1))));
  }
</style>
```

### 2. Classes `.stX` nos Elementos

```html
<path class="st1" d="..." />
<rect class="st2" x="100" y="200" />
<circle class="st3" cx="250" cy="300" r="50" />
```

### 3. ID Único

```html
<svg id="vis_b2" viewBox="0 0 1280 1024">
  <!-- conteúdo -->
</svg>
```

## ⚙️ Como Funciona

1. **Injeção Dinâmica de Cores**: O sistema injeta `--c1`, `--c2`, ..., `--c10` via inline styles
2. **Interatividade Automática**: Todos os elementos com `class="stX"` recebem:
   - ✅ Cursor de precisão (`crosshair`)
   - ✅ Tooltip ao passar o mouse (mostra HEX)
   - ✅ Clique para copiar a cor
3. **Ajuste Automático**: Se você tiver 3 cores, usa `--c1`, `--c2`, `--c3`. Se tiver 10, usa todas.

## 📝 Adicionando Novos Templates

Para adicionar um novo template:

1. **Crie o SVG** seguindo o padrão acima (com CSS Variables e classes `.stX`)
2. **Salve na pasta** `/public/assets/svg/visualizer/`
3. **Use o nome correto** (ex: `ui-ux-3.svg`, `branding-card.svg`)
4. **Atualize a lista** em `svg-loader.tsx` (linha 102):

```typescript
const svgFiles = [
  'ui-ux-1.svg',
  'ui-ux-2.svg',
  'branding-1.svg',
  'branding-2.svg',
  'typo-1.svg',
  'typo-2.svg',
  'pattern-1.svg',
  'illustration.svg',
  'seu-novo-arquivo.svg', // ← Adicione aqui
]
```

5. **Pronto!** O sistema detecta automaticamente a categoria e renderiza.

## 🎯 Benefícios

- ✅ **Sem recompilação**: Adicione SVGs sem mexer no código React
- ✅ **Organização**: Todos os templates em um único lugar
- ✅ **Escalabilidade**: Suporta 2-10 cores automaticamente
- ✅ **Manutenção**: Fácil adicionar, remover ou editar templates
- ✅ **Coolors-compatible**: Mesma estrutura dos SVGs profissionais

## 📚 Referência

- Sistema baseado em: [Coolors.co Visualizer](https://coolors.co/visualizer)
- Loader: `/src/app/(studios)/color-studio-v2/visualizer/_components/svg-loader.tsx`
- View: `/src/app/(studios)/color-studio-v2/visualizer/_components/view.tsx`
