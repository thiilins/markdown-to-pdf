Esta é uma evolução fantástica para o projeto. Analisando o seu repositório atual, você já tem a
"fundação" técnica (Next.js 16, Tailwind v4, Monaco Editor, Shadcn UI) para suportar essa expansão
sem precisar reescrever o núcleo.

Você está basicamente migrando de um "Utilitário de Arquivo Único" (MD to PDF) para uma
**"Plataforma de Developer Experience (DX)"**.

Aqui está a minha análise técnica e validação das suas ideias, considerando o que já existe no seu
`package.json` e `TOOLS.md`:

### 1. 🏗️ Arquitetura de "Studios" (Hub & Spoke)

Sua ideia de separar em "Páginas Mães" (Studios) é necessária. Com 22 ferramentas atuais e mais 10
planejadas, um menu lateral simples vai ficar caótico.

**Sugestão de Estrutura de Rotas (Next.js App Router):** Como você já usa Route Groups como
`(tools)`, sugiro organizar assim:

```text
src/app/
├── (home)/              -> Landing Page Principal (O "Canivete Suíço")
├── (studios)/
│   ├── design-studio/   -> Landing do Color/Shadcn/SVG (Estilo Coolors/TweakCN)
│   │   ├── palette/     -> Rota da tool específica
│   │   └── theme/       -> Rota da tool específica
│   ├── data-studio/     -> Landing do SQL/JSON/Excel
│   └── dev-studio/      -> Landing do Repo Doc/Env/Security

```

**Dica de UX:** Implemente uma **Command Palette** global (`Cmd+K`). Você já tem o `cmdk` instalado
nas dependências. Com tantas ferramentas, a busca rápida será mais importante que o menu.

---

### 2. 🎨 Design Studio (Color + Shadcn)

Você quer chegar no nível do _Coolors_ e _TweakCN_.

- **Color Studio (Estilo Coolors):**
- **O que você já tem:** Gerador de paletas, validação WCAG e APCA.
- **O que falta:** A UX de "Tela Cheia" e atalhos rápidos (Barra de Espaço para gerar).
- **Dica Técnica:** O `coolors` funciona muito bem porque é rápido. Mantenha toda a lógica de
  geração de cores no _Client Side_ (use o `chroma-js` e `colorthief` que você já tem). Evite Server
  Actions para gerar cores aleatórias para não ter latência.

- **Shadcn Theme Creator (Estilo TweakCN):**
- **Validação:** Extremamente útil. O `tweakcn` é ótimo, mas falta integração direta com _preview_
  de componentes reais.
- **Sua Vantagem:** Você já tem o Shadcn instalado. Você pode criar uma área de "Playground" onde,
  ao mexer nos sliders de cor, você atualiza as variáveis CSS (`--primary`, `--radius`) no `:root`
  do navegador em tempo real.
- **Stack:** Tailwind v4 (que você já usa) é nativamente baseada em variáveis CSS, o que torna isso
  trivial de implementar.

---

### 3. 🛠️ Análise das Novas Ferramentas Propostas

Aqui está a minha validação técnica item a item:

#### ✅ Aprovadas (Baixo Risco / Alto Valor)

- **2. Arquiteto de Banco de Dados (SQL to ERD):**
- **Veredito:** Excelente.
- **Stack:** Você já tem o `mermaid` instalado. O desafio será o _parser_ do SQL. Regex é frágil
  para SQL complexo.
- **Dica:** Considere usar uma lib leve de parser SQL no front-end para gerar a sintaxe do Mermaid,
  em vez de depender apenas de Regex.

- **4. SVGR Studio (SVG to React) & 8. SVG Optimizer:**
- **Veredito:** "Easy wins". Todo dev frontend precisa.
- **Stack:** O `svgo` roda bem no browser. Para o SVGR (SVG to Component), você pode precisar de um
  bundler leve ou usar a API deles se o pacote for muito pesado para o browser.

- **7. JSON Schema Studio:**
- **Veredito:** Muito útil para Backend.
- **Sinergia:** Complementa o seu `JSON to TS` existente.

- **10. .env Architect:**
- **Veredito:** Simples e útil.
- **Dica:** Adicione um botão de "Sync" que permite colar o `.env` antigo e o novo, e ele mostra
  quais chaves estão faltando (similar ao seu `Diff Checker`).

#### ⚠️ Atenção (Médio/Alto Risco Técnico)

- **3. GitHub Repository Documenter:**
- **O Risco:** Você mencionou problemas de timeout na Vercel com o Scraper. Baixar um repositório
  inteiro, processar a árvore e gerar um PDF/MD único é pesado.
- **Solução:**

1. Usar a API do GitHub para pegar _apenas_ a árvore de arquivos (é leve).
2. Deixar o usuário _selecionar_ quais pastas quer incluir (para evitar baixar `node_modules` ou
   assets gigantes).
3. Fazer o fetch do conteúdo dos arquivos no _Client Side_ (navegador do usuário faz as requisições)
   para não estourar o limite da sua Vercel Function, ou usar `stream` na resposta.

- **11. Security Header Auditor:**
- **O Risco:** CORS. O navegador bloqueia requisições de um site (seu) para outro (do usuário) para
  ler headers.
- **Solução:** Isso **precisa** ser uma Server Action ou Route Handler (Node.js) que faz o `fetch`
  real. Como é apenas uma requisição HEAD/GET, é rápido e não deve dar timeout.

#### 🛑 Deixar para depois (Complexidade Alta)

- **7. Extração de Vídeos (Youtube):**
- Isso exige proxy, lidar com bloqueios do YouTube ou pagar APIs caras. Pode desviar muito o foco do
  projeto agora.

- **8. Sitemap Crawler:**
- Crawlers são notórios por serem lentos e bloqueados por WAFs. Fazer "batch process" na Vercel
  (Hobby) é pedir para ter timeout de 10/60 segundos. Perfeito! Se a gente ignora as limitações da
  Vercel (assumindo que você pode rodar em um VPS, Docker ou simplesmente não se importa com os 10s
  de timeout para certas features), o céu é o limite.

Para tornar o produto "vendável" (ou seja, um SaaS que as pessoas pagariam ou usariam diariamente
para substituir outros pagos), você precisa atacar **dores agudas** que tomam tempo.

Aqui estão ferramentas de alto valor agregado ("High Ticket Tools") organizadas por Studio, para
consolidar sua visão de "Canivete Suíço Definitivo":

### 1. 🚀 SEO & Marketing Studio (Novo)

_Foco: Desenvolvedores Indie e Criadores de Conteúdo que precisam divulgar seus apps._

- **Open Graph (OG) Image Generator:**
- **A Dor:** Criar aquelas imagens de preview para Twitter/LinkedIn/WhatsApp (`og:image`) é chato. O
  Figma é overkill, CSS manual é lento.
- **A Solução:** Um editor visual drag-and-drop (usando `vercel/og` ou canvas) onde o usuário
  escolhe templates, altera textos e ícones, e baixa a imagem PNG otimizada ou gera a URL dinâmica.
- **Diferencial:** Templates prontos para "Lançamento de Produto", "Artigo de Blog", "Snippet de
  Código".

- **App Icon & Favicon Generator:**
- **A Dor:** Gerar os 20 tamanhos diferentes para iOS, Android, PWA e Favicons.
- **A Solução:** O usuário sobe UMA imagem (1024x1024) e você cospe um `.zip` com tudo organizado
  nas pastas corretas e o `manifest.json` pronto.

### 2. ⚡ API & Backend Studio

_Foco: Backend Devs e QA._

- **HTTP Request Client (Mini-Postman):**
- **A Dor:** O Postman ficou pesado, lento e cheio de login.
- **A Solução:** Um cliente HTTP leve e rodando no browser. Salva as requests no LocalStorage.
  Suporta GET, POST, Auth Bearer e visualização de JSON.
- **Vendável:** Privacidade. "Seus dados de API nunca saem do seu navegador".

- **Mock Data Generator (Fake API):**
- **A Dor:** "Preciso de 1000 usuários fake em JSON ou SQL para testar minha tabela".
- **A Solução:** Interface para definir schema (Nome, Email, Data, Avatar) e gerar datasets gigantes
  em JSON, CSV ou SQL `INSERT`.
- **Tech:** Use a lib `faker` (agora `@faker-js/faker`).

### 3. 🐧 SysAdmin & Infra Studio

_Foco: DevOps e Fullcycle Devs._

- **Nginx/Caddy Config Generator:**
- **A Dor:** Ninguém decora a sintaxe de configuração de Proxy Reverso, SSL, Gzip e Cache do Nginx.
- **A Solução:** UI com checkboxes ("Enable HTTPS", "Redirect www to non-www", "Reverse Proxy to
  localhost:3000") que gera o arquivo `nginx.conf` pronto para copiar e colar.

- **Docker Compose Builder:**
- **A Dor:** Montar um `docker-compose.yml` para uma stack comum (Node + Postgres + Redis) do zero
  sempre gera erro de indentação.
- **A Solução:** Arrastar e soltar "Cartões de Serviço" (Postgres, Mongo, Redis, Node), configurar
  portas e volumes visualmente, e baixar o YAML.

### 4. 📄 Document & Media Studio (Evolução do MD to PDF)

_Foco: Escritórios e Administrativo._

- **PDF Toolbox (O "SmallPDF" Killer):**
- **A Dor:** Pagar Adobe ou subir documentos sigilosos em sites duvidosos.
- **Ferramentas:**
- **Merge PDF:** Juntar vários arquivos.
- **Split PDF:** Separar páginas.
- **Sign PDF:** Adicionar uma assinatura visual (desenho ou imagem) sobre o PDF.

- **Tech:** `pdf-lib` roda 100% no cliente. Segurança total.

- **Image Optimizer (Wasm):**
- **A Dor:** Imagens pesadas matam o SEO.
- **A Solução:** Conversor de JPG/PNG para **WebP** e **AVIF** com controle de qualidade, rodando
  via WebAssembly no browser (sem upload para servidor).

### 5. 🧪 Regex & Parsers Studio

_Foco: Hardcore Devs._

- **Regex Tester & Visualizer:**
- **A Dor:** Regex é ilegível.
- **A Solução:** Uma ferramenta estilo _Regex101_ integrada. Você digita o regex e ele explica
  visualmente o que cada parte faz e testa contra um texto em tempo real.

## NOVAS FERRAMENTAS

- 6. Extração de PDFs Usar pdf-parse ou pdfjs-dist Converter PDF → Markdown Esforço: 4-6 horas
- 7. Extração de Vídeos (Transcrição) YouTube: usar API ou youtube-transcript Gerar Markdown com
     timestamps Esforço: 6-8 horas
- 8. Sitemap Crawler Baixar sitemap.xml Extrair todas as URLs Processar em batch Esforço: 4-5 horas
