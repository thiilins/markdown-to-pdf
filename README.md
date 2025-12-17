# 📄 Markdown to PDF Pro

Uma aplicação web moderna e completa para converter documentos Markdown em PDFs profissionais com
preview em tempo real, editor avançado e configurações personalizáveis.

![Next.js](https://img.shields.io/badge/Next.js-16.0.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Características

### 🎨 Editor Markdown Avançado

- **Editor Monaco** com syntax highlighting
- **Barra de ferramentas completa** com formatação rápida:
  - Cabeçalhos (H1-H6)
  - Formatação de texto (negrito, itálico, riscado)
  - Links e imagens
  - Listas (ordenadas, não ordenadas, checkboxes)
  - Citações, blocos de código, tabelas
  - Quebra de página
  - Desfazer/Refazer
  - **Formatação automática com Prettier** ✨
- Suporte a temas (claro, escuro, automático)
- Configurações personalizáveis (tamanho da fonte, numeração de linhas, minimap)

### 📊 Preview em Tempo Real

- **Preview realista** do documento final
- Visualização contínua com quebras de página respeitadas na impressão
- Zoom ajustável (70% - 150%)
- Suporte a quebras de página manuais
- Espaçamento fixo entre páginas independente do zoom

### ⚙️ Configurações Avançadas

#### 📐 Configuração de Página

- **Tamanhos padrão**: A4, A3, Letter, Legal, Tabloid
- Orientação (retrato/paisagem)
- **Unidade de medida global** (mm/cm/px) com conversão automática
- Margens personalizáveis com presets:
  - Mínima (5mm) - padrão
  - Estreita (10mm) - **padrão aplicado automaticamente**
  - Normal (20mm)
  - Larga (30mm)
  - Personalizada
- Padding configurável

#### 🎨 Tipografia e Temas

- **Fontes personalizáveis**:
  - Fontes para títulos
  - Fontes para corpo do texto
  - Fontes para código
  - Fontes para citações
- **Tamanhos configuráveis**:
  - Tamanho base
  - Tamanhos de H1, H2, H3
  - Altura da linha
- **Presets de tema**:
  - Classic (clássico)
  - Modern (moderno)
  - Dark (escuro)
  - Minimalist (minimalista)
  - Warm (quente)
  - Cold (frio)
  - Custom (personalizado)
- Cores personalizáveis para:
  - Texto, fundo, títulos
  - Blocos de código
  - Links, citações, bordas
- **Preview visual** das cores selecionadas

#### 💻 Configuração do Editor

- Tema (claro, escuro, automático)
- Tamanho da fonte (10px - 20px)
- Quebra de linha
- Minimap (ativado/desativado)
- Números de linha (on, off, relative, interval)

### 📤 Exportação

- **Imprimir**: Abre o diálogo de impressão do navegador
- **Baixar PDF**: Gera PDF via Server Action (Next.js 16+) com segurança aprimorada
  - Execução no servidor mantém URL e token da API seguros
  - Token enviado via header `x-api-key` (não exposto no frontend)
  - Suporte a timeout e tratamento de erros robusto
- Suporte a múltiplas páginas
- Preserva formatação e cores (suporta cores modernas: oklch, lab)
- Qualidade de impressão otimizada

### 🔧 Funcionalidades Técnicas

- Suporte completo a **GitHub Flavored Markdown (GFM)**
- Renderização de tabelas, listas de tarefas, código com syntax highlighting
- Quebra de linha inteligente em blocos de código
- Suporte a HTML no Markdown (para quebras de página)
- **Formatação automática com Prettier** para Markdown
- **Server Actions** (Next.js 16+) para geração segura de PDF
- Persistência de configurações no `localStorage`
- Interface responsiva e moderna com design system consistente
- **Segurança**: Credenciais de API mantidas no servidor, nunca expostas no frontend

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado), npm ou yarn

### Passos

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd md-to-pdf-pro
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   # ou
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto `frontend/`:

   ```bash
   # Variáveis públicas (acessíveis no frontend)
   NEXT_PUBLIC_API_URL=''

   # Variáveis de servidor (NÃO usar NEXT_PUBLIC_ - mantém seguras no servidor)
   PDF_GENERATE_URL='https://sua-api.com/gerar-pdf'
   PDF_GENERATE_TOKEN='seu-token-secreto'
   ```

   > **⚠️ Importante**: As variáveis `PDF_GENERATE_URL` e `PDF_GENERATE_TOKEN` são variáveis de
   > servidor e **não devem** ter o prefixo `NEXT_PUBLIC_`. Isso garante que elas permaneçam seguras
   > e não sejam expostas no código do cliente.

4. **Execute o servidor de desenvolvimento**

   ```bash
   pnpm dev
   # ou
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação** Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### 1. Escreva seu Markdown

Use o editor à esquerda para escrever ou colar seu conteúdo Markdown. A barra de ferramentas
facilita a formatação sem precisar digitar a sintaxe manualmente.

### 2. Formate seu Documento

Use o botão de formatação (✨) na barra de ferramentas para formatar automaticamente o Markdown
usando Prettier. Isso garante consistência e legibilidade do código.

### 3. Configure o Documento

Clique no ícone de configurações (⚙️) no cabeçalho para acessar o painel lateral de configurações:

- **Página**: Tamanho, orientação, margens (com unidade global), padding
- **Tipografia**: Fontes, tamanhos e altura da linha
- **Editor**: Tema, tamanho da fonte, opções de visualização
- **Tema**: Cores e estilo visual com preview

### 4. Visualize o Preview

O painel direito mostra uma pré-visualização realista do documento. As quebras de página são
respeitadas durante a impressão/exportação.

### 5. Exporte

- **Imprimir**: Clique em "Exportar" → "Imprimir" para abrir o diálogo de impressão
- **Baixar PDF**: Clique em "Exportar" → "Baixar PDF" para gerar o arquivo PDF

### 6. Quebra de Página

Use o botão de quebra de página na barra de ferramentas para forçar uma nova página no documento.

## 🛠️ Tecnologias Utilizadas

### Core

- **[Next.js 16](https://nextjs.org/)** - Framework React com Server Actions
- **[React 19](https://react.dev/)** - Biblioteca UI
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **Server Actions** - Execução de código no servidor com segurança

### UI e Estilização

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes UI
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos acessíveis
- **[Lucide React](https://lucide.dev/)** - Ícones

### Editor e Markdown

- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Editor de código
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Renderização Markdown
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** - Suporte GitHub Flavored Markdown
- **[rehype-raw](https://github.com/rehypejs/rehype-raw)** - Suporte HTML no Markdown
- **[Prettier](https://prettier.io/)** - Formatação automática de código

### PDF e Impressão

- **[html2canvas-pro](https://github.com/yorickshan/html2canvas-pro)** - Captura de tela (suporta
  cores modernas)
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDF no cliente
- **[react-to-print](https://github.com/gregnb/react-to-print)** - Impressão do navegador
- **Server Actions (Next.js 16+)** - Geração segura de PDF via API externa

### Outras

- **[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)** - Painéis
  redimensionáveis
- **[zod](https://zod.dev/)** - Validação de esquemas

## 📁 Estrutura do Projeto

```text
md-to-pdf-pro/
├── src/
│   ├── app/
│   │   ├── (home)/              # Grupo de rotas home
│   │   ├── (tools)/             # Grupo de rotas tools
│   │   ├── actions/             # Server Actions
│   │   │   └── pdf.ts           # Server Action para geração de PDF
│   │   ├── _components/         # Componentes da aplicação
│   │   │   ├── app-header.tsx   # Cabeçalho com controles
│   │   │   ├── markdown-editor.tsx  # Editor Monaco
│   │   │   ├── markdown-toolbar.tsx # Barra de ferramentas
│   │   │   ├── preview-panel.tsx    # Preview do documento
│   │   │   ├── preview-style.tsx    # Estilos do preview
│   │   │   ├── print-style.tsx      # Estilos de impressão
│   │   │   ├── settings/            # Componentes de configuração
│   │   │   │   ├── index.tsx        # Painel lateral (Sheet)
│   │   │   │   ├── page-size.tsx    # Configuração de página
│   │   │   │   ├── typography.tsx   # Configuração de tipografia
│   │   │   │   ├── theme.tsx        # Configuração de tema
│   │   │   │   └── editor.tsx       # Configuração do editor
│   │   │   └── view.tsx             # Componente principal
│   │   ├── globals.css          # Estilos globais
│   │   ├── layout.tsx           # Layout da aplicação
│   │   └── page.tsx             # Página inicial
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   └── custom-ui/           # Componentes customizados
│   ├── hooks/                   # React Hooks customizados
│   │   └── use-config.ts        # Hook de configuração
│   ├── lib/                     # Utilitários e helpers
│   │   ├── pdf-utils.ts         # Utilitários de PDF (cliente)
│   │   └── utils.ts             # Utilitários gerais
│   ├── shared/                  # Código compartilhado
│   │   └── contexts/            # React Contexts
│   │       ├── mdToPdfContext.tsx  # Contexto principal
│   │       └── configContext.tsx    # Contexto de configuração
│   ├── types/                   # Definições de tipos TypeScript
│   │   └── global.d.ts         # Tipos globais
│   └── env.ts                   # Configuração de variáveis de ambiente
├── public/                      # Arquivos estáticos
├── components.json              # Configuração shadcn/ui
├── env.tpl                      # Template de variáveis de ambiente
├── .env.local                   # Variáveis de ambiente (não versionado)
└── package.json
```

## ⚙️ Configurações Disponíveis

### Tamanhos de Página

- A4 (210mm × 297mm)
- A3 (297mm × 420mm)
- Letter (8.5" × 11")
- Legal (8.5" × 14")
- Tabloid (11" × 17")

### Presets de Margem

- **Mínima**: 5mm em todos os lados
- **Estreita**: 10mm em todos os lados (padrão)
- **Normal**: 20mm em todos os lados
- **Larga**: 30mm em todos os lados
- **Personalizada**: Configure individualmente

### Unidades de Medida

- **Milímetros (mm)** - Padrão para documentos
- **Centímetros (cm)** - Alternativa ao mm
- **Pixels (px)** - Para design web

A unidade selecionada é aplicada globalmente a todas as margens e ao padding, com conversão
automática entre unidades.

### Presets de Tema

Cada preset inclui cores pré-configuradas para:

- Texto e fundo
- Títulos
- Blocos de código
- Links
- Citações
- Bordas

## 🎯 Exemplos de Uso

### Markdown Básico

```markdown
# Meu Documento

Este é um parágrafo com **texto em negrito** e _texto em itálico_.

## Lista

- Item 1
- Item 2
- Item 3
```

### Tabela

```markdown
| Coluna 1 | Coluna 2 | Coluna 3 |
| -------- | -------- | -------- |
| Dados    | Dados    | Dados    |
```

### Código

````markdown
```javascript
function exemplo() {
  return 'Olá, mundo!'
}
```
````

### Quebra de Página

```markdown
Conteúdo da primeira página...

<div class="page-break"></div>

Conteúdo da segunda página...
```

## 🔐 Segurança

A aplicação implementa práticas de segurança para proteger credenciais:

- **Server Actions**: A geração de PDF via API externa é feita através de Server Actions do Next.js
  16+
- **Variáveis de Servidor**: `PDF_GENERATE_URL` e `PDF_GENERATE_TOKEN` são variáveis de servidor
  (sem `NEXT_PUBLIC_`)
- **Token no Header**: O token é enviado via header `x-api-key`, nunca exposto no código do cliente
- **Validação no Servidor**: Todas as validações e chamadas à API são feitas no servidor

> **⚠️ Importante**: Nunca adicione o prefixo `NEXT_PUBLIC_` às variáveis que contêm credenciais ou
> URLs sensíveis.

## 🐛 Solução de Problemas

### PDF não está gerando corretamente

- Verifique se o conteúdo não excede muito o tamanho da página
- Tente reduzir o zoom antes de gerar o PDF
- Certifique-se de que as imagens estão carregadas
- Verifique se as variáveis de ambiente `PDF_GENERATE_URL` e `PDF_GENERATE_TOKEN` estão configuradas
  corretamente
- Verifique o console do navegador e os logs do servidor para erros

### Preview não mostra múltiplas páginas

- O preview mostra uma visualização contínua
- As quebras de página são respeitadas na impressão/PDF
- Ajuste as margens se necessário

### Cores não aparecem no PDF

- O `html2canvas-pro` suporta cores modernas (oklch/lab)
- Se ainda houver problemas, verifique o console do navegador

### Formatação Prettier não funciona

- Certifique-se de que o Prettier está instalado (`pnpm install`)
- Verifique o console do navegador para erros
- O Prettier formata apenas Markdown válido

### Erro ao gerar PDF via Server Action

- Verifique se `PDF_GENERATE_URL` está configurada no `.env.local`
- Verifique se `PDF_GENERATE_TOKEN` está configurada corretamente (se necessário)
- Certifique-se de que as variáveis **não** têm o prefixo `NEXT_PUBLIC_`
- Reinicie o servidor de desenvolvimento após alterar variáveis de ambiente
- Verifique se a API externa está acessível e retornando o formato esperado

## 🎨 Design System

A aplicação utiliza um design system moderno e consistente:

- **Cards coloridos** com gradientes para cada seção de configuração
- **Badges informativos** mostrando valores atuais
- **Ícones contextuais** para melhor identificação
- **Layout responsivo** com painéis redimensionáveis
- **Temas claro/escuro** com suporte automático

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Variáveis de Ambiente

### Variáveis Públicas (Frontend)

Variáveis com prefixo `NEXT_PUBLIC_` são expostas no código do cliente:

- `NEXT_PUBLIC_API_URL` - URL da API (se necessário para outras funcionalidades)

### Variáveis de Servidor (Backend)

Variáveis **sem** o prefixo `NEXT_PUBLIC_` permanecem seguras no servidor:

- `PDF_GENERATE_URL` - URL da API de geração de PDF (obrigatória)
- `PDF_GENERATE_TOKEN` - Token de autenticação da API (opcional, enviado via header `x-api-key`)

### Exemplo de `.env.local`

```bash
# Variáveis públicas
NEXT_PUBLIC_API_URL='https://api.exemplo.com'

# Variáveis de servidor (seguras)
PDF_GENERATE_URL='https://api-pdf.exemplo.com/gerar-pdf'
PDF_GENERATE_TOKEN='seu-token-secreto-aqui'
```

## Correções Necessárias

- Renderizacao imediata ao trocar tema/configs
- Correção de Carregamento de Fontes

## 📝 Licença

Este projeto é privado. Todos os direitos reservados.

## 🙏 Agradecimentos

- [shadcn](https://ui.shadcn.com/) pelos componentes UI
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) pelo editor
- [html2canvas-pro](https://github.com/yorickshan/html2canvas-pro) pelo suporte a cores modernas
- [Prettier](https://prettier.io/) pela formatação de código
- Todos os mantenedores das bibliotecas utilizadas

---

Desenvolvido com ❤️ usando Next.js e React
