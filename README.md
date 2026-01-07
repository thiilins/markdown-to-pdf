# 🛠️ MD Tools Pro - Suite Completa de Ferramentas para Desenvolvedores

Uma plataforma web moderna e completa com **19+ ferramentas** essenciais para desenvolvedores,
incluindo formatadores, conversores, editores de código e utilitários de segurança. Focada em
produtividade, com interface intuitiva e recursos avançados.

![Next.js](https://img.shields.io/badge/Next.js-16.0.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)
![19+ Tools](https://img.shields.io/badge/Tools-19+-green?style=flat-square)

## ✨ Categorias de Ferramentas

### 📝 Markdown & Documentação (5 ferramentas)

- **MD Editor** - Editor Markdown com visualização em tempo real
- **MD to PDF** - Converta documentos Markdown para PDF profissional com configurações avançadas
- **MD to HTML** - Transforme Markdown em HTML puro e limpo
- **Web Extractor** - Extraia artigos de sites e converta para Markdown
- **Code Snapshot** - Crie imagens estéticas de trechos de código com syntax highlighting

### 🎨 Formatadores de Código (5 ferramentas)

- **JSON Formatter** - Valide, visualize e formate objetos JSON com tree view
- **SQL Formatter** - Beautifier para consultas SQL complexas
- **HTML Formatter** - Indente e organize código HTML
- **CSS Formatter** - Organize e padronize folhas de estilo
- **JavaScript Formatter** - Formate e verifique sintaxe JavaScript/TypeScript

### 🔄 Conversores & Utilitários (6 ferramentas)

- **JSON to TypeScript** - Gere interfaces TypeScript automaticamente a partir de JSON
- **Diff Checker** - Compare textos linha a linha e encontre diferenças
- **Base64 Converter** - Codifique e decodifique Base64 (texto e arquivos)
- **HTML to Text** - Extraia texto puro removendo tags HTML
- **Data Extractor** - Busque Emails, CPFs, URLs e outros padrões em textos
- **Gist Explorer** - Busque, visualize e gerencie Gists do GitHub

### 🔐 Segurança & Acesso (2 ferramentas)

- **Password Generator** - Crie senhas fortes e aleatórias com configurações personalizadas
- **JWT Decoder** - Decodifique e inspecione tokens JWT para debugging

## 🌟 Destaques Técnicos

### 🎨 Editor Monaco Avançado

Várias ferramentas utilizam o poderoso **Monaco Editor** (o mesmo do VS Code):

- Syntax highlighting para múltiplas linguagens
- IntelliSense e autocompletar
- Temas personalizáveis (claro, escuro, automático)
- Configurações avançadas (tamanho da fonte, numeração de linhas, minimap)
- Formatação automática com Prettier

### 📐 Markdown to PDF - Recurso Premium

Nossa ferramenta principal com recursos profissionais:

- **Preview em tempo real** realista do documento final
- **Configuração de página**:
  - Tamanhos: A4, A3, Letter, Legal, Tabloid
  - Orientação (retrato/paisagem)
  - Margens com presets (mínima, estreita, normal, larga)
  - Unidade de medida global (mm/cm/px)
- **Tipografia avançada**:
  - Fontes personalizáveis (títulos, corpo, código, citações)
  - Tamanhos configuráveis para H1, H2, H3
  - Altura da linha ajustável
- **26+ Temas de cores** (Classic, Modern, Dark, Minimalist, etc.)
- **Exportação profissional**:
  - Imprimir via navegador
  - Geração de PDF via Server Action (seguro)
  - Múltiplas páginas com quebras respeitadas
- **Barra de ferramentas completa** com formatação rápida

### 🎯 Formatadores Inteligentes

Todos os formatadores incluem:

- **Validação em tempo real** com mensagens de erro claras
- **Minificação e beautify** com um clique
- **Tree view** para JSON (visualização hierárquica)
- **Syntax highlighting** específico para cada linguagem
- **Copiar resultado** com feedback visual
- **Temas claro/escuro** sincronizados

### 🔒 Segurança e Privacidade

- **Server Actions** (Next.js 16+) para operações sensíveis
- **Credenciais nunca expostas** no frontend
- **Processamento local** sempre que possível
- **Sem armazenamento em nuvem** - seus dados ficam no navegador
- **IndexedDB** para persistência local segura

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

5. **Acesse a aplicação**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📖 Como Usar

### Navegação

A página inicial apresenta todas as ferramentas organizadas por categoria. Clique em qualquer
ferramenta para começar a usar.

### Ferramentas de Formatação

1. Cole ou digite seu código no editor
2. Clique em "Formatar" ou "Beautify"
3. Copie o resultado formatado
4. Para minificar, use o botão "Minify"

### Markdown to PDF

1. Escreva seu Markdown no editor à esquerda
2. Configure o documento no painel de configurações (⚙️):
   - Tamanho da página e margens
   - Fontes e tipografia
   - Tema de cores
3. Visualize o preview em tempo real
4. Exporte como PDF ou imprima

### Conversores

1. Cole o conteúdo de origem
2. A conversão acontece automaticamente
3. Copie ou baixe o resultado

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
- **[Framer Motion](https://www.framer.com/motion/)** - Animações

### Editor e Markdown

- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - Editor de código
- **[react-markdown](https://github.com/remarkjs/react-markdown)** - Renderização Markdown
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** - Suporte GitHub Flavored Markdown
- **[rehype-raw](https://github.com/rehypejs/rehype-raw)** - Suporte HTML no Markdown
- **[Prettier](https://prettier.io/)** - Formatação automática de código

### PDF e Impressão

- **[html2canvas-pro](https://github.com/yorickshan/html2canvas-pro)** - Captura de tela
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDF no cliente
- **[react-to-print](https://github.com/gregnb/react-to-print)** - Impressão do navegador
- **Server Actions (Next.js 16+)** - Geração segura de PDF via API externa

### Outras

- **[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)** - Painéis
  redimensionáveis
- **[zod](https://zod.dev/)** - Validação de esquemas
- **[@mozilla/readability](https://github.com/mozilla/readability)** - Extração de conteúdo web
- **[jsdom](https://github.com/jsdom/jsdom)** - Manipulação DOM no servidor

## 📁 Estrutura do Projeto

```text
md-tools-pro/
├── src/
│   ├── app/
│   │   ├── (home)/              # Landing page
│   │   ├── (tools)/             # Todas as 19 ferramentas
│   │   │   ├── md-to-pdf/       # Ferramenta principal
│   │   │   ├── json-formatter/
│   │   │   ├── sql-formatter/
│   │   │   ├── diff-checker/
│   │   │   └── ...              # Outras ferramentas
│   │   ├── actions/             # Server Actions
│   │   │   ├── pdf.ts           # Geração de PDF
│   │   │   └── scrapper-html-v2.ts
│   │   └── api/                 # API Routes
│   ├── components/
│   │   ├── custom-ui/           # Componentes customizados
│   │   ├── layout-components/   # Componentes de layout
│   │   ├── markdown-editor/     # Editor Monaco
│   │   ├── settings-modal/      # Modais de configuração
│   │   └── ui/                  # Componentes shadcn/ui
│   ├── hooks/                   # React Hooks customizados
│   │   ├── use-persisted-in-db.tsx
│   │   └── use-persisted-state.ts
│   ├── lib/                     # Utilitários
│   ├── services/                # Serviços externos
│   │   ├── gistService.ts
│   │   ├── pdfService.ts
│   │   └── importUrlService.ts
│   ├── shared/
│   │   ├── @types/              # Tipos globais
│   │   ├── constants/           # Constantes (lista de ferramentas)
│   │   ├── contexts/            # React Contexts
│   │   ├── layouts/             # Layouts compartilhados
│   │   ├── styles/              # Estilos globais
│   │   └── utils/               # Utilitários compartilhados
│   └── env.ts                   # Configuração de ambiente
├── public/                      # Arquivos estáticos
├── docs/                        # Documentação
│   ├── features-novas-v2.md
│   ├── roadmap-features.md
│   └── documentacao.md          # Documentação comercial
└── package.json
```

## 🔐 Segurança

A aplicação implementa práticas de segurança para proteger credenciais:

- **Server Actions**: Operações sensíveis executadas no servidor
- **Variáveis de Servidor**: Credenciais nunca expostas no cliente
- **Token no Header**: Autenticação via header `x-api-key`
- **Validação no Servidor**: Todas as chamadas à API validadas
- **IndexedDB**: Dados do usuário armazenados localmente, nunca na nuvem

> **⚠️ Importante**: Nunca adicione o prefixo `NEXT_PUBLIC_` às variáveis que contêm credenciais ou
> URLs sensíveis.

## 🐛 Solução de Problemas

### Ferramentas não carregam

- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Reinicie o servidor de desenvolvimento
- Verifique o console do navegador para erros

### PDF não gera corretamente

- Verifique se `PDF_GENERATE_URL` e `PDF_GENERATE_TOKEN` estão configuradas
- Certifique-se de que as variáveis **não** têm o prefixo `NEXT_PUBLIC_`
- Reinicie o servidor após alterar variáveis de ambiente
- Verifique se a API externa está acessível

### Formatador apresenta erro

- Verifique se o código de entrada é válido
- Alguns formatadores têm limites de tamanho
- Tente minificar antes de formatar códigos muito grandes

### Monaco Editor não aparece

- Aguarde o carregamento completo da página
- Verifique sua conexão com a internet (CDN do Monaco)
- Limpe o cache do navegador

## 🎨 Design System

A aplicação utiliza um design system moderno e consistente:

- **Cards com gradientes** para cada categoria
- **Animações suaves** com Framer Motion
- **Ícones contextuais** para melhor identificação
- **Layout responsivo** adaptável a todos os dispositivos
- **Temas claro/escuro** com suporte automático
- **Feedback visual** em todas as ações

## 📝 Variáveis de Ambiente

### Variáveis Públicas (Frontend)

```bash
NEXT_PUBLIC_API_URL='https://api.exemplo.com'
```

### Variáveis de Servidor (Backend)

```bash
PDF_GENERATE_URL='https://api-pdf.exemplo.com/gerar-pdf'
PDF_GENERATE_TOKEN='seu-token-secreto-aqui'
```

## 🗺️ Roadmap

### Em Desenvolvimento

- ✅ Suite com 19+ ferramentas funcionais
- ✅ Editor Monaco integrado
- ✅ Sistema de temas
- 🚧 Suporte a Mermaid.js para diagramas
- 🚧 Suporte a LaTeX/KaTeX para equações
- 🚧 Header/footer com imagens/logos

### Planejado

- 📋 Templates prontos para Markdown
- 📋 Histórico de documentos
- 📋 Exportação em batch
- 📋 Plugins customizados
- 📋 API pública

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Documentação Adicional

- [Documentação Comercial Completa](./docs/documentacao.md) - Guia detalhado de todas as ferramentas
- [Roadmap de Features](./docs/roadmap-features.md) - Planejamento futuro
- [Análise de Features](./docs/features-novas-v2.md) - Análise técnica

## 📝 Licença

Este projeto é privado. Todos os direitos reservados.

## 🙏 Agradecimentos

- [shadcn](https://ui.shadcn.com/) pelos componentes UI
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) pelo editor de código
- [Vercel](https://vercel.com/) pela plataforma Next.js
- Todos os mantenedores das bibliotecas open source utilizadas

---

Desenvolvido com ❤️ usando Next.js 16 e React 19
