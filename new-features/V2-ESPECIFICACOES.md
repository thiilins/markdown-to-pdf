# 📄 Especificação do Projeto: Gist Explorer & Converter

## 1. Visão Geral

Uma ferramenta integrada ao ecossistema `markdown-to-pdf` que permite aos usuários conectar suas
contas do GitHub para listar, filtrar, visualizar e importar Gists. O objetivo principal é facilitar
a conversão de documentações e "snippets" de código armazenados no GitHub diretamente para PDF, com
suporte a concatenação de múltiplos arquivos.

## 2. Autenticação e Permissões (Híbrido)

Implementaremos uma estratégia de autenticação via **Auth.js (NextAuth)** com provedor GitHub.

- **Estado Não Autenticado (Visitante):**
- Pode buscar gists de **usuários públicos** digitando o `username`.
- _Limitação:_ Sujeito ao Rate Limit severo do GitHub (60 requisições/hora por IP).
- _UI:_ Exibe alertas incentivando o login para remover limites.
- _Restrição:_ Não vê Gists privados nem Secretos.

- **Estado Autenticado (Logado):**
- Acesso automático à lista "Meus Gists" (sem digitar usuário).
- Acesso a **Gists Privados** e Secretos.
- Rate Limit aumentado para 5.000 requisições/hora.
- Persistência de sessão segura via Cookies (HttpOnly).

## 3. Funcionalidades Detalhadas (Features)

### 3.1. Painel "Explorer" (Interface Principal)

Uma interface dividida (Split View), similar a uma IDE ou ao Explorer do Windows.

- **Sidebar Esquerda (Lista):**
- **Barra de Busca:** Pesquisa em tempo real pelo título ou nome do arquivo.
- **Filtro Inteligente de Tags:** O sistema lerá a descrição do Gist procurando por `#hashtags` e
  criará botões de filtro rápido (ex: `#react`, `#docs`).
- **Lista de Gists:** Cards contendo título, data de criação, visibilidade (público/privado) e lista
  de linguagens usadas.

- **Painel Direito (Preview & Ações):**
- Visualização rápida do conteúdo do Gist selecionado.
- Botões de Ação (detalhados abaixo).

### 3.2. Visualização Inteligente (Wrapping Strategy)

Como o sistema é focado em Markdown, arquivos que não são nativamente Markdown serão tratados
automaticamente:

- **Arquivos `.md`:** Renderizados normalmente.
- **Arquivos de Código (`.js`, `.py`, `.json`, etc.):** O sistema irá envolvê-los automaticamente em
  blocos de código Markdown (```language) para que apareçam formatados e coloridos no PDF final.

### 3.3. Funcionalidade "Merge & Import" (Concatenação)

Para Gists que contêm múltiplos arquivos (ex: uma aula com `readme.md`, `style.css` e `script.js`):

- O usuário terá um botão **"Importar Gist Completo"**.
- O sistema processará todos os arquivos do Gist.
- Criará um único documento Markdown onde cada arquivo é separado por um Título (Header) e uma linha
  horizontal.
- Redireciona o usuário para a rota `/md-to-pdf` com o editor já preenchido com esse conteúdo
  unificado.

### 3.4. Edição Rápida ("Fork to Editor")

Para Gists de arquivo único:

- Botão **"Editar e Converter"**.
- Carrega o conteúdo cru no contexto global do editor e redireciona para a ferramenta de PDF.

---

## 4. Arquitetura de Dados e API

Não faremos chamadas do Front-end direto para o GitHub. Usaremos um **BFF (Backend for Frontend)**
via Next.js API Routes.

### Fluxo de Dados:

1. **Front:** Pede `/api/gists?user=...`
2. **API Route:**

- Verifica se existe sessão (Logado).
- Se SIM: Usa o `access_token` do usuário (vê privados + alto limite).
- Se NÃO: Faz request anônima (vê públicos + baixo limite).
- Formata os dados (limpa o JSON gigante do GitHub para apenas o necessário).

3. **Front:** Recebe lista limpa e exibe.

---

## 5. Estrutura de Arquivos e Alterações

Abaixo, a lista do que será criado e modificado no seu projeto.

### 5.1. Novas Dependências

Precisaremos instalar via npm/pnpm:

- `next-auth@beta` (ou v4 estável, decidiremos na implementação): Para gerenciar login GitHub.

### 5.2. Arquivos Novos

**Configuração de Autenticação:**

- `src/auth.ts` (ou `src/lib/auth.ts`): Configuração central do NextAuth (Providers, Callbacks para
  salvar o Token).
- `src/app/api/auth/[...nextauth]/route.ts`: Rota dinâmica que lida com os redirects de
  login/logout.

**Backend (API Routes):**

- `src/app/api/gists/route.ts`: O Proxy que busca a lista de Gists.
- `src/app/api/gists/content/route.ts`: (Opcional) Proxy para buscar o conteúdo raw se houver
  problemas de CORS no client.

**Frontend (Página Nova):**

- `src/app/(tools)/gist-explorer/page.tsx`: A tela principal da ferramenta.
- `src/app/(tools)/gist-explorer/layout.tsx`: Layout específico (se precisar esconder algo do layout
  global).
- `src/app/(tools)/gist-explorer/_components/gist-sidebar.tsx`: Componente da lista e busca.
- `src/app/(tools)/gist-explorer/_components/gist-preview.tsx`: Componente de visualização.
- `src/app/(tools)/gist-explorer/_components/gist-filters.tsx`: Componente das tags.

**Lógica de Negócio (Libs):**

- `src/lib/gist-utils.ts`:
- Função `wrapGistContent()`: Transforma código em Markdown.
- Função `mergeGistFiles()`: Junta vários arquivos em um só.
- Mapa de extensões para linguagens.

### 5.3. Arquivos Existentes a Alterar

- `src/env.ts`: Adicionar validação para variáveis de ambiente `AUTH_GITHUB_ID` e
  `AUTH_GITHUB_SECRET`.
- `src/shared/layouts/global/header-menu.tsx` (ou similar): Adicionar o **Botão de Login/Avatar do
  Usuário**.
- `src/shared/layouts/global/header.tsx`: Adicionar o link para a nova ferramenta no menu de
  navegação.
- `src/shared/contexts/mdToPdfContext.tsx`: Garantir que ele possua um método `setContent` acessível
  globalmente (já deve ter, apenas verificar) para receber os dados vindos do Gist.

---

## 6. Configuração Necessária (Infraestrutura)

Para funcionar, você precisará:

1. **GitHub OAuth App:**

- Criar um App nas configurações de Developer do GitHub.
- Obter `Client ID` e `Client Secret`.
- Configurar a URL de callback (ex: `http://localhost:3000/api/auth/callback/github`).

2. **Variáveis de Ambiente (.env):**

- `AUTH_SECRET`: Uma chave aleatória para encriptar a sessão.
- `AUTH_GITHUB_ID`: Do passo 1.
- `AUTH_GITHUB_SECRET`: Do passo 1.

---

## Informações Add

### 1. Definição de Nomenclatura e URL

Para seguir o padrão existente (`md-to-pdf`), que é descritivo e em _kebab-case_, o nome ideal para
a pasta e para a URL é:

- **Nome da Pasta:** `gist-explorer`
- **URL Final:** `/gist-explorer`
- **Caminho Físico:** `src/app/(tools)/gist-explorer/`

**Por que esse nome?** Enquanto `md-to-pdf` descreve uma _ação_ (conversão), essa nova ferramenta é
primeiramente um _navegador_ e _gerenciador_ de arquivos remotos. O sufixo `-explorer` deixa claro
que é uma interface de busca e visualização.

---

### 2. Documentação Técnica do Projeto (Roadmap de Desenvolvimento)

Aqui está a especificação completa para o desenvolvimento da feature **GitHub Gist Explorer**.

#### 🎯 Objetivo

Criar uma interface dentro da aplicação que permita buscar, visualizar e importar Gists do GitHub. A
ferramenta deve funcionar de forma híbrida: permitindo buscas públicas (sem login) e acesso
privilegiado a Gists privados/pessoais (com login).

#### 🛠️ Funcionalidades (Features)

1. **Autenticação GitHub (OAuth)**

- Login via GitHub para aumentar limites de API (de 60/h para 5000/h).
- Persistência de sessão segura via Cookies (HttpOnly).
- Avatar e Nome do usuário no Header quando logado.
- _Regra de Negócio:_ Usuários não logados veem aviso sobre rate-limit reduzido.

2. **Explorer (Painel Lateral)**

- **Busca Pública:** Input de texto para buscar gists de qualquer usuário do GitHub.
- **Meus Gists (Apenas Logado):** Listagem automática dos gists do usuário autenticado.
- **Filtros:** Busca local pelo título/descrição dos gists carregados.
- **Status Visual:** Ícones indicando se o Gist é público 🔒 ou secreto 👁️.

3. **Visualizador (Preview Panel)**

- **Renderização Híbrida:**
- Arquivos `.md`: Renderizados como Markdown (visual).
- Arquivos de Código (`.js`, `.py`, `.css`...): Renderizados dentro de blocos de código com syntax
  highlighting.

- **Tabs:** Suporte para navegar entre múltiplos arquivos dentro de um mesmo Gist.

4. **Integração com Conversor (Actions)**

- **Botão "Abrir no Editor":** Envia o conteúdo do arquivo atual para a rota `/md-to-pdf`.
- **Botão "Importar Tudo":** Mescla todos os arquivos do Gist em um único Markdown (com separadores)
  e envia para `/md-to-pdf`.

---

#### 📂 Estrutura de Arquivos e Diretórios

Seguiremos estritamente o padrão da pasta `md-to-pdf`.

**1. Configuração e Ambiente**

- `src/env.ts` (Alteração): Adicionar validação das variáveis `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
  e `AUTH_SECRET`.
- `.env` (Criação/Alteração): Onde as chaves reais ficarão.

**2. Backend (API Routes & Auth)**

- `src/auth.ts` (Novo): Configuração central do NextAuth (v5) para gerenciar o provider do GitHub.
- `src/app/api/auth/[...nextauth]/route.ts` (Novo): Handlers mágicos para login/logout.
- `src/app/api/gists/route.ts` (Novo): Endpoint BFF (Backend-for-Frontend) que:
- Verifica sessão.
- Consulta API do GitHub (com ou sem token).
- Retorna dados sanitizados para o front.

**3. Frontend: A Ferramenta (`src/app/(tools)/gist-explorer/`)**

- `page.tsx` (Novo): O componente raiz da página. Gerencia o layout macro (Split View).
- `layout.tsx` (Novo): Mantém consistência estrutural com outras ferramentas.
- `_components/sidebar.tsx` (Novo): Lista de gists, input de busca e estado de loading.
- `_components/preview.tsx` (Novo): Área de visualização do conteúdo (Markdown ou Código).
- `_components/gist-item.tsx` (Novo): Card individual de cada Gist na lista.
- `_components/actions-bar.tsx` (Novo): Botões de "Editar", "Importar", "Ver no GitHub".

**4. Componentes Compartilhados (Layout Global)**

- `src/shared/layouts/global/header-menu.tsx` (Alteração): Inserir o componente de Avatar/Login do
  usuário.
- `src/components/ui/` (Uso): Reutilizaremos seus componentes existentes (`button`, `input`,
  `scroll-area`, `skeleton`).

**5. Utilitários (`src/lib/`)**

- `src/lib/gist-utils.ts` (Novo):
- Lógica para "envelopar" código em Markdown.
- Lógica para mesclar múltiplos arquivos.
- Mapeamento de extensões de arquivo -> linguagens.

---

#### 📦 Instalação de Dependências

Precisaremos rodar apenas um comando de instalação principal:

```bash
pnpm add next-auth@beta

```

_(Usaremos a versão Beta (v5) pois é a nativa para Next.js 14/15 com App Router, simplificando muito
a gestão de tokens)._

## 7. Próximo Passo

O plano está aprovado? Se sim, a ordem de execução sugerida é:

1. **Instalação e Configuração do Auth.js** (pois todo o backend depende disso).
2. **Criação das API Routes** (para testar se conseguimos listar os Gists).
3. **Desenvolvimento do Frontend** (Telas e Componentes).
