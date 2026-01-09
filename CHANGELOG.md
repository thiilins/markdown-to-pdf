# CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto
adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.18.0] - 2025-01-09

### Adicionado

- **Color Studio v2 - Funcionalidades Avançadas do Generator:**
  - **Nomes Reais das Cores**:
    - Integração com biblioteca `ntc` (Name That Color)
    - Exibe nome descritivo abaixo do HEX (ex: "Peach Fuzz", "Ocean Blue")
    - Atualização automática ao gerar ou trocar cores
  - **Modal de Informações Completo**:
    - Todos os formatos de cor: HEX, RGB, HSL, HSV, CMYK, LAB
    - Botão de copiar para cada formato
    - Psicologia da cor (Soothing, Calming, etc)
    - Significados (Gentleness, Warmth, etc)
    - Aplicações sugeridas (Weddings, Cosmetics, etc)
    - Preview grande da cor
  - **Shades Picker Melhorado**:
    - 21 variações da cor (10 mais claras + base + 10 mais escuras)
    - Modo OKLCH para variações perceptualmente uniformes
    - Overlay fullscreen sobre a coluna
    - Indicador visual da cor atual
    - Hover mostra HEX de cada shade
    - Aplicação instantânea com feedback
  - **Drag & Drop Funcional**:
    - Reordenação de cores com `Framer Motion Reorder`
    - Sincronização automática com URL
    - Indicador visual de arrasto (ícone grip)
    - Funciona em desktop (eixo X) e mobile (eixo Y)
    - Preserva locks durante reordenação
  - **Adicionar/Remover Cores**:
    - Botão "+" entre colunas (hover)
    - Máximo de 10 cores, mínimo de 2
    - Botão de remover no topo de cada coluna
    - Feedback com toasts
  - **Menu de Ações por Cor**:
    - Botão Info (abre modal completo)
    - Botão Shades (abre picker de variações)
    - Botão Lock/Unlock (preserva cor)
    - Botão Copy (copia HEX)
    - Botão Remove (mínimo 2 cores)
    - Botão Drag (reordenar)
  - **UX Melhorada**:
    - Hover effects suaves em todos os botões
    - Animações de entrada/saída (AnimatePresence)
    - Feedback visual para todas as ações
    - Cores adaptativas (texto preto/branco baseado em luminância)
    - Toolbar inferior aparece no hover
    - Floating toolbar sempre visível

- **Color Studio v2 - Novo Estúdio de Cores:**
  - **Arquitetura Hub-and-Spoke**:
    - Home page como hub central (inspirada em Coolors.co)
    - Landing pages específicas para cada ferramenta
    - Navegação intuitiva com mega menu
  - **Home Page Redesenhada**:
    - Layout 50/50 (texto + grid animado de cores)
    - Tipografia gigante e minimalista
    - Grid de cores animado (rotação automática a cada 3s)
    - Seção "Trusted by" com logos de empresas
    - Design extremamente limpo e profissional
  - **Header com Mega Menu**:
    - Logo "Palettes" customizado
    - Mega menu 2 colunas para "Tools"
    - 6 ferramentas com ícones coloridos e descrições
    - Botão "Go Pro" destacado
    - Hover effects suaves e profissionais
  - **Palette Generator (Tela Cheia)**:
    - Layout fullscreen com 5 colunas verticais de cores
    - Geração com Spacebar (igual Coolors.co)
    - Sistema de Lock/Unlock por cor
    - Hover effects com expansão de coluna (flex-[1.2])
    - Animações Framer Motion (fade in sequencial)
    - Copy HEX com feedback visual
    - Sincronização automática com URL
    - Floating toolbar com botão "Generate"
    - Responsivo: colunas verticais (desktop) → linhas horizontais (mobile)
  - **Estrutura Modular**:
    - Rota group `(studios)` para organização
    - Context API para estado global (ColorStudioContext)
    - Utilities compartilhados (color-algorithms.ts)
    - Tipos TypeScript centralizados
    - Padrão SSR: `page.tsx` + `_components/view.tsx`
  - **Rotas Preparadas**:
    - `/color-studio-v2` - Home do estúdio
    - `/color-studio-v2/generate` - Palette Generator (implementado)
    - `/color-studio-v2/image-picker` - Extração de cores de imagens (placeholder)
    - `/color-studio-v2/visualizer` - Preview em designs reais (placeholder)
    - `/color-studio-v2/tailwind-colors` - Escalas de cores Tailwind (placeholder)
    - `/color-studio-v2/contrast-checker` - Verificador de contraste (placeholder)
    - `/color-studio-v2/color-picker` - Informações detalhadas de cores (placeholder)

### Técnico

- **Declarações de Tipos**:
  - Adicionado `src/types/ntc.d.ts` para biblioteca Name That Color
  - Suporte TypeScript completo para `ntc` module
- **Algoritmos de Cores**:
  - Migrados e otimizados de v1 para v2
  - Suporte a múltiplos algoritmos (random, monochromatic, analogous, complementary, triadic,
    tetradic, shades)
  - Integração com chroma.js e OKLCH
- **Performance**:
  - Suspense boundaries para SSR
  - Dynamic imports preparados para lazy loading
  - Animações otimizadas com Framer Motion
- **Responsividade**:
  - Mobile-first approach
  - Breakpoints Tailwind (md: 768px)
  - Layout adaptativo para todas as telas

## [0.17.0] - 2025-01-09

### Adicionado

- **Color Studio - Botão de Compartilhamento na Paleta Atual:**
  - **Botão "Compartilhar" Visível**:
    - Localizado no header da área de output (ao lado do botão Reset)
    - Sempre visível, independente da paleta estar editada ou não
    - Ícone Share2 com feedback visual (Check quando copiado)
    - Toast de confirmação: "Link copiado para a área de transferência!"
  - **Funcionalidade**:
    - Copia URL completa com estado da paleta atual
    - Inclui cores, tipo de paleta e cor base
    - Permite compartilhar paletas customizadas (editadas)
    - Sincronizado com o sistema de URL state existente
  - **UI Melhorada**:
    - Header sempre visível com informações contextuais
    - Badge "Paleta Customizada" quando editada
    - Texto "Paleta gerada automaticamente" quando padrão
    - Layout responsivo com botões de ação agrupados

- **Color Studio - Edição de Cores da Paleta:**
  - **Edição Individual de Cores**:
    - Botão de edição (ícone paleta) em cada ColorCard
    - Input de cor visual (color picker nativo)
    - Input de texto para HEX manual
    - Validação automática de cores válidas
    - Atualização em tempo real da paleta
  - **Indicador de Paleta Customizada**:
    - Badge "Paleta Customizada" quando há edições
    - Mensagem informativa "Você editou esta paleta"
    - Destaque visual com bordas azuis
  - **Botão Reset**:
    - Restaura paleta para o padrão gerado
    - Aparece apenas quando há edições
    - Feedback visual com toast
  - **Reset Automático ao Mudar Cor Base**:
    - Detecta mudança na cor base
    - Reseta automaticamente a paleta editada
    - Toast informativo sobre o reset
  - **Persistência no IndexDB**:
    - Paleta editada salva automaticamente
    - Sobrevive ao fechamento do navegador
    - Hook `usePersistedStateInDB` para gerenciamento
    - Key: `color-studio-edited-palette`

### Alterado

- **Palette Studio - Migração de Persistência:**
  - **Histórico migrado de localStorage para IndexDB**:
    - Melhor performance para grandes volumes de dados
    - Sem limite de 5-10MB do localStorage
    - Operações assíncronas (não bloqueia UI)
    - Compatibilidade com padrão do projeto
  - **Hook `usePaletteHistory` refatorado**:
    - Usa `getData` e `saveData` do IndexDB
    - Todas as operações são assíncronas
    - Flag `isLoaded` para evitar operações antes do carregamento
    - Keys: `@MD_TOOLS_PRO:palette-history` e `@MD_TOOLS_PRO:palette-favorites`
  - **Estrutura de dados mantida**:
    - Interface `PaletteHistoryItem` inalterada
    - Favoritos continuam como `Set<string>`
    - Limite de 20 paletas mantido

### Técnico

- **Componentes Atualizados**:
  - `view.tsx`: Gerenciamento de cores geradas vs editadas, reset automático
  - `output/index.tsx`: Props `onColorEdit`, `onResetPalette`, `isPaletteEdited`
  - `output/color-card.tsx`: Input de edição, validação, UI condicional
  - `hooks/use-palette-history.ts`: Migração completa para IndexDB
- **Novos Estados**:
  - `generatedColors`: Cores geradas pelo algoritmo
  - `editedColors`: Cores customizadas pelo usuário (persistidas)
  - `isPaletteEdited`: Flag para UI condicional
- **Refs**:
  - `previousBaseColor`: Rastreia mudanças na cor base para reset automático

## [0.16.0] - 2025-01-09

### Adicionado

- **Palette Studio - Histórico & Compartilhamento:**
  - **Histórico Local com localStorage**:
    - Armazena automaticamente até 20 paletas recentes
    - Persistência entre sessões do navegador
    - Remove duplicatas (mesma cor base + tipo)
    - Timestamp e metadados para cada paleta
  - **Sistema de Favoritos**:
    - Botão de "coração" para marcar paletas favoritas
    - Favoritos nunca são removidos ao limpar histórico
    - Filtro dedicado para visualizar apenas favoritos
    - Sincronização com localStorage
  - **Drawer/Sidebar de Histórico**:
    - Botão "Histórico" com badge de contagem
    - Sheet lateral responsivo (mobile-friendly)
    - Filtros: "Todas" e "Favoritas"
    - Preview visual de cada paleta (faixa de cores)
    - Informações: tipo, cor base, tempo decorrido
    - Ações rápidas: Restaurar, Favoritar, Compartilhar, Remover
    - Botão "Limpar Histórico" (preserva favoritos)
  - **Compartilhamento via URL (State in URL)**:
    - Codificação da paleta na URL (ex:
      `?colors=ffffff-000000-ff0000&type=monochromatic&base=3b82f6`)
    - Atualização automática da URL ao gerar paleta
    - Carregamento automático da paleta ao abrir link compartilhado
    - Botão "Compartilhar" copia link para clipboard
    - Permite enviar paleta exata para colegas/clientes
    - Histórico do navegador preservado (replaceState)
  - **Hooks Customizados**:
    - `usePaletteHistory`: Gerencia histórico e favoritos
    - `usePaletteURL`: Sincroniza estado com URL
    - Funções: addToHistory, toggleFavorite, removeFromHistory, clearHistory, writeToURL,
      readFromURL, getShareableLink

- **Palette Studio - APCA Contrast Checker (WCAG 3.0):**
  - **Algoritmo APCA (Advanced Perceptual Contrast Algorithm)**:
    - Implementação do futuro padrão WCAG 3.0
    - Cálculo de contraste perceptualmente mais preciso
    - Considera direção do contraste (texto claro em fundo escuro vs inverso)
    - Recomendações específicas de tamanho e peso de fonte
    - 5 níveis de qualidade: Excellent, Good, Acceptable, Poor, Fail
    - Valor Lc (Lightness contrast) com precisão superior ao WCAG 2.1
  - **Interface Dual com Tabs**:
    - Tab WCAG 2.1: Padrão atual com razões de contraste
    - Tab APCA (3.0): Novo algoritmo com recomendações detalhadas
    - Badge indicando suporte a ambos os padrões
    - Comparação lado a lado dos resultados
  - **Recomendações Inteligentes**:
    - Tamanho mínimo de fonte baseado no contraste
    - Peso mínimo de fonte recomendado
    - Descrições contextuais da legibilidade
    - Alertas visuais por nível de qualidade

- **Palette Studio - Mesh Gradients (Gradientes Modernos):**
  - **Tipo Mesh** adicionado ao gerador de gradientes
  - **Efeito de manchas de cor suaves e orgânicas** usando múltiplos radial-gradients sobrepostos
  - **Interface adaptativa**: Oculta controles irrelevantes (direção, posição) quando Mesh está
    selecionado
  - **Variação Mesh** nas sugestões rápidas com preview clicável
  - **Preview em tempo real** do efeito Mesh
  - **CSS automático** para copiar (`background-image`)

### Modificado

- **Palette Studio - Gradientes Customizáveis:**
  - Atualizado de 3 para **4 tipos**: Linear, Radial, Cônico e **Mesh (Moderno)**
  - Interface adaptativa que oculta controles de direção e posição quando não aplicáveis
  - 6 variações sugeridas agora incluem Mesh

### Estatísticas Finais - Palette Studio v0.16.0

- **7 tabs** no output: Paleta, WCAG, Simulador, Mixer, Gradientes, Shadcn, Exportar
- **6 tipos** de paleta: Monocromática, Análoga, Complementar, Tríade, Tétrade, Tons
- **6 moods** de atmosfera com ajustes automáticos
- **8 formatos** de exportação com nomes personalizados
- **34 variáveis** Shadcn UI (todas editáveis)
- **Color Mixer** com até 15 passos intermediários
- **Nomes automáticos** para todas as cores
- **Nomes semânticos** editáveis para export
- **OKLCH** em todos os cards
- **APCA (WCAG 3.0)** + WCAG 2.1 para contraste
- **4 tipos de gradientes** incluindo Mesh moderno
- **Histórico local** com até 20 paletas
- **Sistema de favoritos** persistente
- **Compartilhamento via URL** para colaboração

## [0.15.0] - 2025-01-09

### Adicionado

- **Palette Studio - Histórico & Compartilhamento:**
  - **Histórico Local com localStorage**:
    - Armazena automaticamente até 20 paletas recentes
    - Persistência entre sessões do navegador
    - Remove duplicatas (mesma cor base + tipo)
    - Timestamp e metadados para cada paleta
  - **Sistema de Favoritos**:
    - Botão de "coração" para marcar paletas favoritas
    - Favoritos nunca são removidos ao limpar histórico
    - Filtro dedicado para visualizar apenas favoritos
    - Sincronização com localStorage
  - **Drawer/Sidebar de Histórico**:
    - Botão "Histórico" com badge de contagem
    - Sheet lateral responsivo (mobile-friendly)
    - Filtros: "Todas" e "Favoritas"
    - Preview visual de cada paleta (faixa de cores)
    - Informações: tipo, cor base, tempo decorrido
    - Ações rápidas: Restaurar, Favoritar, Compartilhar, Remover
    - Botão "Limpar Histórico" (preserva favoritos)
  - **Compartilhamento via URL (State in URL)**:
    - Codificação da paleta na URL (ex:
      `?colors=ffffff-000000-ff0000&type=monochromatic&base=3b82f6`)
    - Atualização automática da URL ao gerar paleta
    - Carregamento automático da paleta ao abrir link compartilhado
    - Botão "Compartilhar" copia link para clipboard
    - Permite enviar paleta exata para colegas/clientes
    - Histórico do navegador preservado (replaceState)
  - **Hooks Customizados**:
    - `usePaletteHistory`: Gerencia histórico e favoritos
    - `usePaletteURL`: Sincroniza estado com URL
    - Funções: addToHistory, toggleFavorite, removeFromHistory, clearHistory, writeToURL,
      readFromURL, getShareableLink

- **Palette Studio - APCA Contrast Checker (WCAG 3.0):**
  - **Algoritmo APCA (Advanced Perceptual Contrast Algorithm)**:
    - Implementação do futuro padrão WCAG 3.0
    - Cálculo de contraste perceptualmente mais preciso
    - Considera direção do contraste (texto claro em fundo escuro vs inverso)
    - Recomendações específicas de tamanho e peso de fonte
    - 5 níveis de qualidade: Excellent, Good, Acceptable, Poor, Fail
    - Valor Lc (Lightness contrast) com precisão superior ao WCAG 2.1
  - **Interface Dual com Tabs**:
    - Tab WCAG 2.1: Padrão atual com razões de contraste
    - Tab APCA (3.0): Novo algoritmo com recomendações detalhadas
    - Badge indicando suporte a ambos os padrões
    - Comparação lado a lado dos resultados
  - **Recomendações Inteligentes**:
    - Tamanho mínimo de fonte baseado no contraste
    - Peso mínimo de fonte recomendado
    - Descrições contextuais da legibilidade
    - Alertas visuais por nível de qualidade

- **Palette Studio - Funcionalidades Avançadas:**
  - **Color Mixer (Misturador de Cores):**
    - Seleção de duas cores da paleta (Cor A e Cor B)
    - Controle de passos intermediários (3-15 cores)
    - Algoritmo LCH para blend perceptualmente uniforme
    - Preview visual em faixa e cards individuais
    - Copiar cor individual ou CSS completo
    - Botão de reset para voltar às cores originais
    - Nova tab "Mixer" no output

  - **Mood Selector (Seletor de Atmosfera):**
    - 6 moods disponíveis com ajustes automáticos:
      - **Corporativo**: Profissional, confiável (↓ saturação, ↓ brilho)
      - **Enérgico**: Vibrante, dinâmico (↑ saturação, ↑ brilho)
      - **Calmo**: Sereno, relaxante (↓↓ saturação, ↑ brilho)
      - **Luxuoso**: Elegante, sofisticado (↑ saturação, ↓↓ brilho)
      - **Divertido**: Alegre, criativo (↑↑ saturação, ↑ brilho)
      - **Minimalista**: Limpo, neutro (↓↓ saturação, neutro)
    - Interface visual com ícones e gradientes personalizados
    - Descrição detalhada de cada mood
    - Aplicação automática à paleta gerada
    - Ajustes matemáticos de saturação e luminosidade

  - **Nomes de Cores Automáticos:**
    - Biblioteca `ntc` para gerar nomes descritivos reais
    - Fallback inteligente baseado em HSL
    - Exibição apenas visual (não editável nos cards)

  - **Nomes Semânticos Editáveis no Export:**
    - Editor dedicado acima do preview de código
    - Nomes padrão: primary, secondary, accent, muted, destructive
    - Edição inline com inputs para cada cor
    - Botão reset para voltar aos nomes padrão
    - Validação automática (conversão para kebab-case)
    - Preview em tempo real do código exportado
    - Todos os 8 formatos usam os nomes personalizados

  - **Tema Shadcn UI Totalmente Editável:**
    - 34 cores editáveis (Light + Dark mode)
    - Click no quadrado de cor para editar com color picker
    - Botão reset para voltar ao tema gerado automaticamente
    - Indicador visual quando o tema foi editado
    - Preview em tempo real das alterações
    - Organizado por categorias:
      - Cores Principais (6 variáveis)
      - Cores de Ação (8 variáveis)
      - Elementos UI (5 variáveis)
      - Charts (5 variáveis)
      - Sidebar (8 variáveis)

  - **Gradientes Customizáveis com Mesh:**
    - Edição completa de cada cor do gradiente
    - Posições ajustáveis (0-100%) para gradientes tradicionais
    - Adicionar/remover cores dinamicamente
    - **4 tipos**: Linear, Radial, Cônico e **Mesh (Moderno)**
    - **Mesh Gradients**: Manchas de cor suaves e orgânicas usando múltiplos radial-gradients
      sobrepostos
    - 8 direções diferentes (exceto Mesh)
    - 6 variações sugeridas incluindo Mesh
    - Interface adaptativa: oculta controles irrelevantes por tipo
    - Botão reset
    - Cópia automática do CSS do `background-image`

  - **Exportação Multi-Formato com Nomes Personalizados:**
    - CSS Variables (com nomes semânticos)
    - SCSS Variables (com nomes semânticos)
    - Tailwind Config (com nomes semânticos)
    - JSON (estruturado com nomes semânticos)
    - Figma Tokens (com nomes semânticos e metadados OKLCH)
    - Swift (iOS) (com nomes semânticos)
    - XML (Android) (com nomes semânticos)
    - Shadcn Theme (OKLCH completo)

### Estatísticas Finais - Palette Studio

- **7 tabs** no output: Paleta, WCAG, Simulador, Mixer, Gradientes, Shadcn, Exportar
- **6 tipos** de paleta: Monocromática, Análoga, Complementar, Tríade, Tétrade, Tons
- **6 moods** de atmosfera com ajustes automáticos
- **8 formatos** de exportação com nomes personalizados
- **34 variáveis** Shadcn UI (todas editáveis)
- **Color Mixer** com até 15 passos intermediários
- **Nomes automáticos** para todas as cores
- **Nomes semânticos** editáveis para export
- **OKLCH** em todos os cards
- **APCA (WCAG 3.0)** + WCAG 2.1 para contraste
- **4 tipos de gradientes** incluindo Mesh moderno
- **Histórico local** com até 20 paletas
- **Sistema de favoritos** persistente
- **Compartilhamento via URL** para colaboração

## [0.14.0] - 2025-01-09

### Adicionado

- **Regras do Cursor (.cursorrules):** Documentação completa de padrões de desenvolvimento.
  - Arquitetura e estrutura de pastas modular
  - Convenções de código e nomenclatura
  - Padrões de UI e componentização
  - Boas práticas de performance e acessibilidade
  - Fluxo de desenvolvimento e versionamento
  - Checklist para novas ferramentas

### Modificado

- **Excel/CSV to Markdown - Refatoração Arquitetural Completa:**
  - **Estrutura Modular por Responsabilidade:**
    - `input/`: Componentes de entrada organizados (csv.tsx, json.tsx, upload.tsx)
    - `output/`: Componentes de saída (preview.tsx, markdown.tsx, analytics.tsx)
    - `options/`: Componentes de configuração (format.tsx, align.tsx, transform.tsx)
    - `view/`: Layouts separados (desktop.tsx, mobile.tsx)
  - **Aba de Upload Dedicada:** Terceira aba no input com drag & drop melhorado
    - Área visual dedicada para upload de arquivos
    - Overlay animado com feedback visual robusto
    - Validação de múltiplos arquivos
    - Suporte a .xlsx, .xls e .csv
  - **Estatísticas no Output:** Movidas para terceira aba no painel de saída
    - Layout em grid responsivo (1-3 colunas)
    - Cards individuais por coluna com métricas detalhadas
    - Estado vazio elegante quando não há dados
  - **Menu de Opções Otimizado:** Removida aba de estatísticas, foco em configurações
    - Collapsible sections para melhor organização
    - Formato, Alinhamento e Transformações em seções separadas
  - **Responsividade Mobile Aprimorada:**
    - Layout customizado com 3 tabs (Entrada, Saída, Opções)
    - Sheet lateral para opções no mobile (via headerSlot)
    - Estatísticas funcionando corretamente no mobile
  - **Arquitetura Limpa:**
    - Index.tsx como orquestradores em cada pasta
    - Componentes atômicos e focados
    - Separação clara entre lógica e apresentação
    - Reutilização de código maximizada

### Corrigido

- **Excel/CSV to Markdown:** Estatísticas não aparecendo no mobile
- **Drag & Drop:** Melhorias na detecção de eventos e validações
- **CodeFormatterEditor:** Correção de tipo de linguagem (markdown → plaintext)
- **Gradientes:** Correção de classes Tailwind (bg-gradient-to-r → bg-linear-to-r)

## [0.13.0] - 2025-01-08

### Adicionado

- **Excel/CSV to Markdown - Features Avançadas:** Expansão massiva da ferramenta com 8 novas
  funcionalidades profissionais.
  - **Alinhamento de Colunas:** Controle individual de alinhamento por coluna (esquerda, centro,
    direita) com suporte nativo Markdown (`:---`, `:---:`, `---:`).
  - **Transposição de Tabela:** Botão para inverter linhas e colunas instantaneamente, útil para
    dados organizados horizontalmente.
  - **Ordenação por Coluna:** Ordenação crescente/decrescente por qualquer coluna, com detecção
    automática de tipo (numérico/alfabético).
  - **Formatação Avançada:**
    - Escape automático de caracteres especiais Markdown (`|`, `\`).
    - Remoção automática de colunas vazias.
  - **Exportação Multi-Formato:**
    - **Markdown:** Formato padrão com suporte a alinhamento.
    - **HTML Table:** Tabelas HTML completas com `<thead>` e `<tbody>`.
    - **LaTeX Table:** Tabelas LaTeX prontas para documentos acadêmicos.
    - **ASCII Table:** Tabelas em texto puro com bordas ASCII para documentação.
  - **Estatísticas e Análise de Dados:**
    - Detecção automática de tipo de dados (string, number, boolean, mixed).
    - Contagem de valores únicos e células vazias por coluna.
    - Estatísticas numéricas (mín, máx, média) para colunas numéricas.
    - Interface visual com badges e cards informativos.
  - **Interface com 3 Painéis:**
    - **Painel de Entrada:** Editor Monaco com syntax highlighting para CSV/JSON.
    - **Painel de Saída:** Preview da tabela gerada com syntax highlighting.
    - **Painel de Opções:** Tabs organizadas (Formato, Alinhamento, Transformar, Estatísticas).
  - **Componente TableOptions:** Interface completa para controlar todas as opções avançadas.
  - **Persistência de Opções:** Opções mantidas ao reconverter, permitindo ajustes iterativos.
  - **Feedback Visual:** Toasts informativos para todas as operações (transpor, ordenar, exportar).

### Modificado

- **Excel/CSV to Markdown - Refatoração Completa:**
  - Arquitetura modular com separação de responsabilidades (utils, input, output, options).
  - Arquivo `constants.ts` para exemplos reutilizáveis.
  - Funções auxiliares exportadas para uso externo (`transposeTable`, `sortByColumn`,
    `filterByColumn`, `getAllColumnStats`).
  - Interface `ConversionOptions` para tipagem forte de todas as opções.
  - Interface `ColumnStats` para estatísticas estruturadas.
  - Suporte a `ConversionOptions` em todas as funções de conversão (`csvToMarkdown`,
    `jsonToMarkdown`, `excelToMarkdown`).
  - Layout responsivo com 3 painéis redimensionáveis (35%-40%-25%).

## [0.12.0] - 2025-01-08

### Modificado

- **OpenAPI to PDF:** Melhorias significativas na interface e visualização.
  - **Editor Monaco:** Substituído textarea simples por editor Monaco com syntax highlighting,
    autocomplete e formatação automática.
  - **Preview de Markdown Aprimorado:** Preview de markdown agora usa os mesmos componentes
    customizados do md-editor, com tabelas estilizadas, listas, código inline, links e imagens
    renderizados de forma profissional.
  - **Layout Visual Melhorado:** Cards de endpoints e schemas com melhor espaçamento, cores e
    hierarquia visual.
  - **Componentes Customizados:** Integração completa com `getMarkdownComponents()` para
    renderização consistente e profissional do markdown gerado.
  - **Informações Contextuais:** Adicionado texto informativo sobre suporte OpenAPI 3.0+ e resolução
    automática de referências.

## [0.11.0] - 2025-01-08

### Adicionado

- **OpenAPI to PDF:** Nova ferramenta para converter especificações OpenAPI/Swagger em documentação
  profissional em PDF.
  - **Validação Automática:** Parsing e validação de especificações OpenAPI 3.0 em JSON ou YAML
    usando `@apidevtools/swagger-parser`.
  - **Resolução de Referências:** Resolve automaticamente todas as referências `$ref` na
    especificação.
  - **Geração de Markdown:** Converte a especificação em Markdown estruturado com seções organizadas
    (Servidores, Autenticação, Endpoints, Schemas).
  - **Preview Interativo:** Visualização em tempo real da documentação gerada com syntax
    highlighting.
  - **Agrupamento por Tags:** Endpoints organizados automaticamente por tags para melhor navegação.
  - **Tabelas de Parâmetros:** Parâmetros, request body e responses formatados em tabelas limpas.
  - **Schemas Detalhados:** Documentação completa de todos os schemas com propriedades, tipos e
    exemplos.
  - **Badges de Métodos HTTP:** Identificação visual de métodos (GET, POST, PUT, DELETE, etc.) com
    cores específicas.
  - **Exportação Múltipla:** Download direto em Markdown ou integração com MD to PDF para gerar PDF
    profissional.
  - **2 Exemplos Inclusos:** Pet Store API (completo) e API Simples (YAML minimalista).
  - **Layout com Tabs:** Interface organizada com abas para Editor/Exemplos e Preview/Markdown.
  - **Stats em Tempo Real:** Contadores de endpoints, schemas e versão da API.

### Documentado

- Adicionada documentação completa da ferramenta OpenAPI to PDF no CHANGELOG.
- Incluídos metadados SEO para a página `/open-api-pdf`.

## [0.10.0] - 2025-01-08

### Adicionado

- **Cron Expression Visualizer:** Nova ferramenta completa para validar, visualizar e entender
  expressões cron em `/cron-tools`.
  - **Validação em Tempo Real:** Parsing automático com debounce de 300ms usando `cron-parser` e
    `cronstrue`.
  - **Descrição em Português:** Conversão de expressões cron para linguagem natural com timezone
    (America/Sao_Paulo).
  - **Timeline de Execuções:** Próximas 10 execuções com data/hora formatada e tempo relativo.
  - **Construtor Visual (Builder):** Interface com 5 dropdowns para construir expressões sem
    conhecer sintaxe.
  - **Conversor de Timezone:** 9 timezones principais com cálculo automático de DST.
  - **Exportador de Código:** Geração de código para Node.js, Python, Docker, Kubernetes e Systemd.
  - **19 Presets Comuns:** Expressões pré-definidas organizadas em grid.
  - **Indicadores Visuais:** Mapeamento dos 5 campos com barras de progresso animadas.
  - **Layout com Tabs:** Abas para Presets/Builder e Timeline/Timezone/Código.
  - **Design Premium:** Animações com Framer Motion e glassmorphism.

## [0.9.1] - 2025-01-08

### Adicionado

- **Página de Changelog:** Nova página dedicada em `/changelog` com design profissional e hierarquia
  visual clara.
- **Componentes de Changelog:** Sistema de componentes personalizados para renderização do
  CHANGELOG.md com categorias coloridas (Adicionado, Modificado, Corrigido, Segurança, Documentado).

### Modificado

- **CHANGELOG.md:** Padronizado para seguir 100% o formato Keep a Changelog 1.1.0, removendo emojis
  duplicados e organizando categorias.
- **Hierarquia Visual:** Implementada hierarquia clara com espaçamentos progressivos (H2: mt-16, H3:
  mt-12, H4: mt-6, Lista: mb-2).
- **Hero Section:** Botões de CTA redesenhados com tamanhos uniformes (240px), sem uppercase, e
  efeitos de hover diferenciados.
- **Botão "Explorar Ferramentas":** Estilo mais sutil (branco → roxo no hover) com ícone animado.
- **Botão "Ver Changelog":** Estilo outline com texto gradiente e rotação do ícone no hover.

### Corrigido

- Duplicação de ícones nos títulos H3 do changelog (detecção automática de emojis).
- Contraste de texto no changelog (slate-300 para listas, slate-400 para parágrafos).
- Alinhamento de bullets e texto em listas do changelog.

## [0.9.0] - 2025-01-08

### Adicionado

- **Componentes Markdown Personalizados:**
  - **Imagens:** Suporte a imagens responsivas com borda, sombra suave, legenda opcional e
    tratamento de erro visual.
  - **Listas:**
    - _Ordenadas:_ Estilização com números em círculos azuis, sombra e contadores automáticos.
    - _Não Ordenadas:_ Bullets personalizados com anel decorativo.
    - _Task Lists:_ Checkboxes interativos com estados e transições suaves.
  - **Tabelas:** Design responsivo com scroll horizontal, cabeçalho estilizado e alinhamento
    inteligente.
  - **Links:** Estilização dinâmica baseada no tipo (Externo, Âncora, E-mail e Interno) com
    animações.
  - **Teclas (Kbd):** Visual de tecla física 3D para representação de atalhos.
  - **Código Inline:** Visual modernizado com fonte mono e destaque sutil.
  - **Separadores (Hr):** Linha horizontal com gradiente e ícone decorativo centralizado.

### Modificado

- **Sistema de Markdown:**
  - Unificação da lógica de renderização para garantir consistência visual em toda a plataforma.
  - Detecção automática de alinhamento de texto em tabelas.
  - Melhoria na estruturação semântica das listas.
- **Documentação:**
  - Expansão do guia padrão com exemplos visuais de todos os novos componentes de estilização.
  - Adição de seção de resumo e guia de "Próximos Passos".

### Corrigido

- Incremento numérico em listas ordenadas aninhadas.
- Renderização de cabeçalhos vazios em tabelas.
- Remoção de bordas externas duplicadas em tabelas para um visual mais limpo.
- Ajustes finos de espaçamento (padding/margin) em todos os elementos de texto.
- Alinhamento vertical de ícones em links externos.
- Renderização correta de marcadores em listas de resumo.

## [0.8.0] - 2025-01-08

### Adicionado

- **Admonitions (Callouts):**
  - Suporte a 5 tipos de alertas: `Nota`, `Dica`, `Importante`, `Aviso` e `Cuidado`.
  - Renderização com design _glassmorphism_ e ícones contextuais.
  - Suporte à sintaxe padrão `[!TYPE]`.

- **Exemplos:** Adicionados casos de uso para Admonitions e diagramas no documento padrão.

### Modificado

- **Renderização Centralizada:**
  - Unificação do motor de renderização, garantindo que o Editor, o Conversor de PDF e o Explorador
    de Gists exibam o conteúdo de forma idêntica.
  - Otimização do carregamento de recursos (Mermaid, Highlighting).

- **Previews:**
  - Atualização do visualizador de Gists para incluir Índice Interativo, Validação de Links e
    suporte a diagramas.

- **Pre-processamento:** Melhoria na detecção de blocos de código para evitar conflitos com
  diagramas.

### Corrigido

- Renderização de diagramas complexos dentro de blocos de pré-visualização.
- Eliminação de inconsistências visuais entre diferentes ferramentas da plataforma.

## [0.7.0] - 2025-01-08

### Adicionado

- **Suporte a Diagramas (Mermaid.js):**
  - Renderização interativa de fluxogramas, diagramas de sequência, Gantt, classes, estado, ER e
    gráficos de pizza.
  - Detecção automática de blocos de código `mermaid`.
  - Tratamento de erros visual amigável quando a sintaxe do diagrama é inválida.
  - Carregamento sob demanda (lazy rendering) para melhor performance.

### Modificado

- Integração nativa de diagramas nas visualizações do Editor e do Gerador de PDF.
- Atualização dos exemplos padrão para incluir diagramas de fluxo e sequência.

## [0.6.0] - 2025-01-08

### Adicionado

- **Índice Interativo (TOC):**
  - Painel de navegação flutuante com design translúcido.
  - Geração automática baseada nos cabeçalhos (H1-H6) com indentação hierárquica.
  - Scroll suave e destaque ativo do item sendo lido.
  - Geração automática de IDs (âncoras) para todos os títulos.

- **Validador de Links:**
  - Verificação em tempo real de integridade de links (Status HTTP).
  - Suporte a verificação de links externos, internos, âncoras e imagens.
  - Painel de estatísticas com contagem de links válidos e quebrados.
  - Proteção contra verificação de IPs locais/privados.

### Corrigido

- Posicionamento do Índice alterado para evitar sobreposição de conteúdo em telas menores.
- Adaptação dinâmica da altura do Índice à janela do navegador.
- Detecção aprimorada de links externos.
- Tratamento de falhas de rede e _timeouts_ durante a validação de URLs.

## [0.5.6] - 2025-01-08

### Adicionado

- **Web Extractor:**
  - **Histórico:** Armazenamento local das últimas URLs processadas com busca rápida.
  - **Modo Batch:** Extração em lote permitindo processar múltiplos artigos sequencialmente.
  - **Relatório de Integridade:** Métricas sobre a qualidade da extração (imagens recuperadas,
    tamanho do conteúdo).
  - **Separadores Visuais:** Novos divisores para organizar múltiplos artigos no mesmo documento.

### Modificado

- **Modo Leitura:**
  - Melhoria na limpeza automática de elementos indesejados (anúncios, popups) quando a extração
    padrão falha.
- **UX:**
  - Foco na extração HTML com conversão para Markdown opcional e sistema de "falha suave" para não
    interromper processos em lote.

### Corrigido

- Contagem incorreta de itens na primeira execução do modo Batch.
- Conflitos de interface nos campos de entrada de URL.
- Fluxo de navegação entre o processamento e a visualização do resultado.

## [0.5.5] - 2025-01-07

### Adicionado

- **Code Snapshot - Destaque de Linhas:**
  - Sistema para destacar linhas específicas com clique.
  - Personalização de cores e opacidade do destaque.

- **Code Snapshot - Anotações:**
  - Inserção de anotações flutuantes ("drag and drop") sobre o código.
  - Biblioteca de ícones e editor visual modernizado.

### Modificado

- **UX de Anotações:** Melhoria na interação de arrastar e soltar e atualização em tempo real.
- **Lógica de Highlights:** Adaptação para respeitar o modo de comparação (diff), permitindo
  destaque apenas em linhas inalteradas.

## [0.5.4] - 2025-01-XX

### Modificado

- **Otimização Interna (Snapshot):**
  - Refatoração do gerenciamento de estado para melhor performance.
  - Centralização da lógica de compartilhamento.

### Corrigido

- Correção de problemas de otimização no build de produção.

## [0.5.3] - 2025-01-XX

### Adicionado

- **Code Snapshot - Compartilhamento:**
  - Geração de URLs para compartilhamento de snippets (estado salvo na URL).
  - Botão de cópia rápida para a área de transferência.

- **Code Snapshot - Importação:**
  - Importação direta de código via URL de Gist (GitHub).
  - Detecção automática da linguagem de programação.

### Corrigido

- Erros de execução nos formatadores (HTML/CSS/JS/SQL) em ambiente de produção (Vercel).
- Problemas de duplicação na renderização de separadores.
- Melhoria na tipagem do estado da URL.

## [0.5.2] - 2025-01-XX

### Adicionado

- **Code Snapshot - Interatividade:**
  - Modo "Live Edit" permitindo edição direta do código na pré-visualização.
  - Controles para ativar/desativar anotações e edição.

### Corrigido

- Definições de tipos e callbacks para maior estabilidade.

## [0.5.1] - 2025-01-XX

### Adicionado

- **JSON Formatter:**
  - Suporte a conversão para **TOML** e **TOON**.

- **JSON Tree View:**
  - Visualização hierárquica expandida por padrão.

### Modificado

- **UX de Conversão:** Reposicionamento de botões para acesso mais intuitivo.
- **Visual:** Redesign da árvore JSON com tema escuro e ícones de tipo de dados.
- **Code Snapshot:** Ajuste dinâmico do fundo do editor conforme o tema.

### Corrigido

- Validação prévia de JSON antes de tentar conversões.

## [0.5.0] - 2025-01-XX

### Adicionado

- **JSON Fixer:** Correção automática de erros comuns (aspas simples, vírgulas extras, chaves sem
  aspas).
- **Preview de Imagens:** Visualização rápida de URLs de imagem dentro do JSON.
- **Rastreamento de Caminho:** Exibição em tempo real do JSONPath baseada na posição do cursor.
- **Conversão Cruzada:** Conversão instantânea entre JSON, XML, YAML e CSV.

### Modificado

- Barra de ferramentas atualizada com novas ações rápidas.

## [0.4.0] - 2025-01-XX

### Adicionado

- **Code Snapshot - Modo Diff:**
  - Suporte visual para diferenças de código (estilo Git diff).
  - Coloração automática para linhas adicionadas (verde) e removidas (vermelho).

- **Comentários Contextuais:**
- Adição de comentários atrelados a números de linha específicos.

- **Novo Tema:** Preset "Terminal Retro" com estética CRT.

## [0.3.0] - 2025-01-XX

### Adicionado

- **JSON Formatter:**
  - Recurso "Copiar JSON Path" no menu de contexto.
  - Nova aba de visualização em árvore (Tree View).

- **SQL Formatter:**
- Validação de sintaxe integrada (Linter) para vírgulas e cláusulas SQL.

### Modificado

- Integração aprimorada com o editor de código para ações personalizadas.
- Feedback visual em tempo real para erros de validação.

### Corrigido

- Conflitos de variáveis no validador SQL.
- Erros de importação dinâmica no sistema de build.

## [0.2.0] - 2025-01-XX

### Adicionado

- **Performance:** Otimização significativa na velocidade do Web Extractor (10x mais rápido).
- **JWT Decoder:**
  - Decodificação com explicações visuais (tooltips) para os campos padrão.
  - Simulador para edição e teste de tokens (assinaturas inválidas).

### Modificado

- **Web Extractor:** Adoção de processamento híbrido para maior precisão e velocidade.
- **Gerador de PDF:** Migração para sistema de streaming para melhor performance em documentos
  grandes.

### Segurança

- Implementação de limites de tamanho para processamento de tokens.
- Sanitização rigorosa de inputs.

## [0.1.0] - 2024-XX-XX

### Adicionado

- Lançamento inicial da plataforma.
- Editor Markdown com exportação para PDF profissional.
- Web Extractor (Conversor de HTML para Markdown).
- Formatadores de código (JSON, SQL, HTML, CSS, JS).
- Decodificador JWT básico.
- Ferramenta de criação de imagens de código (Code Snapshot).
