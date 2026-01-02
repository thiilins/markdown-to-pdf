### 🗺️ Visão Geral da Arquitetura

Para manter "organizado, limpo e bonito", não podemos apenas jogar links na sidebar.

- **Nova Home de Ferramentas (`/tools`):** Um Dashboard estilo "Grade de Cards" categorizados.
- **Sidebar Dinâmica:** Agrupamento por contexto (Ex: "Conversores", "Formatadores", "Segurança").
- **Padrão de UX:** Layout "Split-Screen" (Esquerda: Entrada / Direita: Saída) para quase todas as
  ferramentas.

---

### 📅 Roadmap & Blueprint de Telas

Separei em **4 Fases** lógicas para você desenvolver em blocos.

#### 🚀 Fase 1: O "Core" e Conversão de Texto (Sua prioridade)

_Foco: Estruturar o layout padrão e entregar o MD > HTML._

**1. Componente Base: `ToolLayout` (Reutilizável)**

- **Objetivo:** Criar um wrapper que padronize Título, Descrição, Área de Input (Editor) e Área de
  Output.
- **Features:** Botões de "Copiar", "Limpar", "Baixar Arquivo" e "Tela Cheia" já embutidos.

**2. Tela: Markdown to HTML (`/tools/md-to-html`)**

- **Input:** Editor Markdown (Monaco ou Textarea rico). _Não é URL, é colar código direto._
- **Processamento:** Reutilizar sua lib de parseamento atual.
- **Output:**
- Aba 1: Preview Visual (Renderizado).
- Aba 2: Código HTML Puro (para copiar).

- **Ação:** Botão "Exportar .html".

**3. Tela: Removedor de Tags (`/tools/html-to-text`)**

- **Input:** HTML sujo.
- **Processamento:** `DOMParser` ou Regex para extrair apenas `textContent`.
- **Output:** Texto plano limpo.

---

#### 🎨 Fase 2: Higienização e Formatação (Beautifiers/Minifiers)

_Foco: Ferramentas de código "Feio" vs "Bonito"._

**4. Tela: Minificadores & Embelezadores (`/tools/code-formatter`)**

- _Sugestão de UX:_ Uma única tela com Tabs ou Select: `HTML` | `CSS` | `JS` | `SQL`.
- **Funcionalidade:**
- **Input:** Código colado.
- **Controles:** Toggle "Minificar" vs "Embelezar (Prettify)".
- **SQL:** Adicionar dropdown de dialeto (PostgreSQL, MySQL, Standard).

- **Libs sugeridas:** `prettier` (versão browser) e `sql-formatter`.

**5. Tela: JSON Studio (`/tools/json-studio`)**

- **Input:** JSON (mesmo que mal formatado).
- **Funcionalidade:**
- Validar (Erro visual se o JSON for inválido).
- Formatar (Pretty print).
- **Feature Extra:** "Converter para Typescript/Interface" (Isso é killer feature).

---

#### 🔍 Fase 3: Extração e Utilitários de Texto

_Foco: Regex e manipulação de Strings._

**6. Tela: Extrator de Dados (`/tools/extractor`)**

- **Input:** Texto gigante ou arquivo de log colado.
- **Filtros:** Checkboxes: [x] Emails, [x] URLs, [x] CPFs (opcional futuro), [x] IPs.
- **Output:** Lista dedup (sem duplicatas) dos itens encontrados.
- **Ação:** "Copiar como CSV" ou "Copiar como Lista".

**7. Tela: Diff Checker (`/tools/diff-checker`)**

- **Layout Diferente:** Três colunas ou Split Vertical.
- Col 1: Texto Original.
- Col 2: Texto Novo.
- Visualização: Highlight verde/vermelho das diferenças.

- **Lib sugerida:** `diff` (npm).

**8. Tela: Case Converter (`/tools/case-converter`)**

- **Input:** Texto ou lista de variáveis.
- **Ações:** Botões rápidos: `UPPER`, `lower`, `CamelCase`, `snake_case`, `kebab-case`.

---

#### 🔐 Fase 4: Encoders e Segurança (Sugestões novas)

_Foco: Ferramentas diárias de Dev Fullstack._

**9. Tela: Base64 Converter (`/tools/base64`)**

- **Tabs:** Texto e Imagem.
- **Texto:** Encode/Decode string.
- **Imagem:** Upload de arquivo -> Gera string `data:image/png;base64...` (útil para CSS/HTML
  inline).

**10. Tela: JWT Debugger (`/tools/jwt-decoder`)**

- **Input:** Token JWT `ey...`.
- **Output:** JSON do Header e Payload coloridos.
- **Aviso:** "Decodificação local. Sua chave privada não é verificada aqui."

**11. Tela: Geradores (`/tools/generators`)**

- **Tabs:**
- **UUID:** Gerar X UUIDs v4.
- **Hash:** Gerar MD5/SHA256 de um texto.
- **Senhas:** Gerador com configs (tamanho, caracteres especiais, números).

---

### 🛠️ Estrutura de Pastas Sugerida

Para manter tudo organizado no seu Next.js App Router:

```text
src/app/(tools)/
├── page.tsx                 <-- Dashboard (Catálogo de ferramentas)
├── layout.tsx               <-- Sidebar com categorias
├── md-to-html/              <-- Fase 1
│   └── page.tsx
├── code-formatter/          <-- Fase 2 (HTML, CSS, JS, SQL)
│   └── page.tsx
├── json-studio/             <-- Fase 2
│   └── page.tsx
├── text-utils/              <-- Fase 3 (Extrator, Case Converter)
│   ├── extractor/
│   ├── diff/
│   └── case/
└── encoders/                <-- Fase 4
    ├── base64/
    ├── jwt/
    └── generators/

```

### ✅ Próximo Passo: Definindo o Padrão

Para começarmos com o pé direito (e "Low Hanging Fruit"), eu sugiro criar primeiro o **Componente de
Layout Padrão** e a ferramenta **Markdown > HTML**.

Você quer que eu gere o código desse **Layout Base** (Input/Output lado a lado) e a implementação da
página **Markdown > HTML** agora?
