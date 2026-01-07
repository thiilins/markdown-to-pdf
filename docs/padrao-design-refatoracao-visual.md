### 1. Filosofia Visual: O Toque Humano

O design "humano" em ferramentas técnicas é aquele que não tenta esconder a complexidade, mas a
organiza de forma elegante.

- **Menos "Brilho", Mais "Estrutura":** Substitua os efeitos de brilho por hierarquia visual clara
  baseada em bordas finas (1px) e contrastes de cinza.
- **Performance Percebida:** Use micro-interações para mostrar que a ferramenta está "trabalhando".
  Se o _Web Extractor_ está processando, detalhe as etapas (ex: "Limpando scripts...", "Formatando
  tabelas...") em vez de um spinner genérico.
- **Tipografia como Interface:** Em ferramentas de texto (Markdown, Código), a fonte _é_ o design.
  Use fontes de sistema de alta qualidade ou fontes técnicas modernas (como **Geist** ou **Inter**).

---

### 2. Padrão de Design (Design System)

Para garantir consistência entre o _Markdown to PDF_ e as novas ferramentas (como o _Documentador de
API_ ou _Arquiteto SQL_), utilize este padrão:

#### **A. Paleta de Cores "Industrial"**

Evite o azul "ChatGPT". Aposte em uma paleta baseada em escalas de cinza sofisticadas (Slate ou Zinc
do Tailwind) com uma única cor de destaque sólida:

- **Fundo (Claro):** `slate-50` / **Fundo (Escuro):** `zinc-950`.
- **Bordas:** `slate-200` (claro) / `zinc-800` (escuro).
- **Destaque (Action):** Uma cor sóbria como Indigo, Esmeralda ou até um Laranja Queimado para
  botões de exportação.

#### **B. O Container Unificado (ToolShell)**

Todas as ferramentas devem herdar o componente `ToolShell`.

- **Layout:** Painel lateral de configurações à esquerda (colapsável), Editor/Input ao centro, e
  Preview/Output à direita.
- **Bordas de Separação:** Use divisores de 1px em vez de sombras para separar as áreas de trabalho.
  Isso dá um aspeto de "placa de circuito" organizada.

#### **C. Tipografia Recomendada**

- **Interface:** `Inter` ou `Geist Sans` (limpas e legíveis).
- **Código/Markdown:** `JetBrains Mono` ou `Fira Code` (para facilitar a leitura de símbolos
  técnicos).

---

### 3. Sugestões de Alteração para Ferramentas Atuais

#### **Markdown to PDF & Editor**

- **Barra de Status Técnica:** No rodapé do editor, adicione um contador de palavras, tempo estimado
  de leitura e o "Health Check" do documento (ex: "Estrutura OK", "3 links quebrados").
- **Modo de Foco (Zen):** Uma opção para esconder todos os painéis e deixar apenas o editor
  centralizado, usando `framer-motion` para uma transição suave.

#### **Web Extractor**

- **Preview "Esquelético":** Enquanto a página é extraída, mostre um _Skeleton Screen_ que imita a
  estrutura do site original, em vez de uma tela vazia.
- **Log de Extração:** Um pequeno console colapsável que mostra exatamente o que o scraper está
  encontrando (Imagens, Tabelas, H1s), reforçando a percepção de ferramenta "pro".

---

### 4. Micro-interações com Framer Motion

O `package.json` já inclui o `framer-motion`. Use-o para detalhes sutis que fazem a interface
parecer "viva":

- **Feedback de Clique:** Botões que "afundam" levemente (scale: 0.98) quando pressionados.
- **Transição de Temas:** Ao trocar entre Light/Dark Mode, use um efeito de "fade" suave ou um
  círculo de expansão que nasce do ícone de sol/lua.
- **Entrada de Dados:** Quando uma nova URL for extraída, o conteúdo no editor deve aparecer com um
  efeito de _stagger_ (um parágrafo após o outro), guiando o olhar do usuário.

---

### 5. Design de "Estados Vazios" (Empty States)

Este é o ponto onde a maioria das ferramentas de IA falha.

- **O que não fazer:** Usar emojis ou ilustrações 3D coloridas.
- **O que fazer:** Use diagramas técnicos em linhas finas (estilo _blueprint_) que explicam como a
  ferramenta funciona. Por exemplo, no _SQL Architect_, mostre um desenho esquemático de tabelas se
  ligando enquanto o usuário não cola o código.

### 6. Aplicando às Novas Ferramentas

Para as novas ferramentas sugeridas (como o _SVGR Studio_ ou _Cron Visualizer_):

1. **Input Direto:** Sempre que possível, permita "Drag and Drop" de arquivos ou colar direto da
   área de transferência (paste detection).
2. **Output Visual Imediato:** O resultado deve ser exibido em tempo real. Se for código, use o seu
   `code-formatter-output` para syntax highlighting imediato.
3. **Botões de Ação Contextuais:** No _Cron Visualizer_, o botão principal não deve ser "Gerar", mas
   "Explicar Expressão", focando no valor que o humano recebe.

---

Para finalizar o seu guia de design com o foco em **"Toque Humano e não-IA"**, precisamos falar
sobre o que realmente diferencia uma ferramenta artesanal de um template gerado: **detalhes
invisíveis**, **UX Writing** e **Acessibilidade**.

Aqui está o complemento estratégico para o seu guia:

---

### 7. UX Writing: O Tom de Voz "Developer to Developer"

A IA tende a ser excessivamente polida ou genérica. O toque humano vem de falar a língua de quem
está no terminal.

- **Mensagens de Erro Acionáveis:** Em vez de "Erro ao processar URL", use algo como: "Não
  conseguimos acessar essa URL. Verifique se o site permite scraping ou se há um firewall bloqueando
  o acesso."
- **Logs de Progresso Reais:** No _Web Extractor_, em vez de uma barra de progresso de 0 a 100%,
  mostre o que está acontecendo: `> Fetching HTML... Done.`, `> Sanitizing DOM... Done.`,
  `> Converting to Markdown...`
- **Tooltips com Contexto Técnico:** Em vez de "Clique para baixar", use "Gera um PDF otimizado para
  impressão (CMYK-ready)". Isso mostra que você pensou no caso de uso final.

### 8. Design de Estados e Transições (A "Alma" da UI)

Ferramentas de IA são estáticas. Ferramentas humanas são fluidas.

- **Transição de Layout (Framer Motion):** Ao abrir o painel de configurações (`SettingsModal`), não
  use um "aparecer" seco. Use uma transição de mola (_spring_) leve que empurre levemente o editor
  para o lado, criando uma sensação física de espaço.
- **Feedback de Hover "Inteligente":** No `MarkdownToolbar`, use um efeito de _highlighter_ que
  segue o mouse suavemente entre os botões, em vez de apenas mudar a cor do fundo instantaneamente.
- **Skeleton Screens Artesanais:** Crie esqueletos que correspondam exatamente à estrutura da sua
  ferramenta (barra lateral, editor, preview), mantendo a hierarquia visual enquanto os dados do
  `IndexedDB` carregam.

### 9. Acessibilidade (O Ápice do Design Humano)

A IA raramente foca em acessibilidade real. Fazer isso é um selo de qualidade profissional.

- **Foco Visível e Customizado:** Use uma borda de foco (`ring`) personalizada e nítida para
  navegação via teclado, garantindo que a ferramenta seja 100% utilizável sem mouse.
- **Suporte a Screen Readers:** Adicione `aria-labels` descritivos em todos os ícones da Lucide,
  especialmente nos botões sem texto do editor.
- **Contraste WCAG:** Utilize o seu `theme-presets.ts` para garantir que todas as combinações de
  cores (mesmo nos temas "Cold" ou "Warm") passem no teste de contraste AA.

### 10. Personalização Orgânica (User Memory)

A ferramenta deve se sentir "sua" com o tempo.

- **Preservação de Contexto:** Se o usuário colapsou o painel de preview, a ferramenta deve lembrar
  disso na próxima sessão (usando o seu `use-persisted-state`).
- **Recentes e Favoritos:** No `ToolShell`, adicione uma pequena seção de "Últimos arquivos
  processados" com nomes amigáveis, facilitando a retomada do trabalho.

  ### 11. Guia de Estilo de Bordas e Espaçamento

Para manter o aspeto "Industrial/Minimalista":

| Elemento           | Regra de Design                      | Efeito                                           |
| ------------------ | ------------------------------------ | ------------------------------------------------ |
| **Bordas**         | 1px sólido (Slate-200 / Zinc-800)    | Aspeto de precisão técnica.                      |
| **Arredondamento** | `rounded-md` (8px) ou `rounded-none` | Evita o aspeto "bolha" de apps mobile genéricos. |
| **Padding**        | Baseado em escala de 4 (p-4, p-8)    | Ritmo visual matemático e limpo.                 |
| **Sombras**        | Apenas uma `shadow-sm` em modais     | Mantém a interface "flat" e focada no conteúdo.  |

---

### Resumo do Padrão "Markdown to PDF Pro"

Para todas as ferramentas atuais e futuras, o padrão deve ser:

1. **Header:** Caminho de navegação (Breadcrumbs) + Ações globais (Exportar/Configurações).
2. **Corpo:** Painéis redimensionáveis (`ResizablePanel`) para dar controle ao usuário.
3. **Rodapé:** Status bar com métricas técnicas (tempo de execução, peso do arquivo, etc.).
