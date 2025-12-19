# 🚀 Master Roadmap: Editor Markdown SaaS (Enterprise Ready)

Este documento especifica a evolução da plataforma de um simples editor de texto para uma suíte
completa de automação de documentos (Document Automation SaaS), atendendo desde desenvolvedores
individuais até grandes corporações.

---

## 1. Experiência de Edição (Core & Usabilidade)

_O alicerce da retenção. Se a edição não for fluida, o usuário não fica._

### A. Scroll Sync (Sincronização de Rolagem)

A marca registrada de editores profissionais. O preview deve acompanhar a leitura do código.

- **Desafio Técnico:** O editor (Monaco) e o Preview (HTML) têm alturas de conteúdo diferentes.
- **Solução:** Calcular a porcentagem de scroll (`scrollTop / scrollHeight`) de um container e
  aplicar ao outro.
- **Dica:** Usar `useRef` para acessar ambos os DOM nodes no `view.tsx`.

### B. Mobile UX: Sistema de Abas

Em telas pequenas, o `ResizablePanel` (split view) é inutilizável.

- **Solução:** Detectar mobile (`useIsMobile`).
- **Implementação:** Substituir a visão lado a lado por **Tabs (Abas)** que alternam estados de
  visibilidade ("Escrever" vs "Visualizar").

### C. Persistência Local (Local History)

Prevenção de perda de dados. "Nunca perca uma linha sequer".

- **Implementação:** Hook `useDocuments` conectado ao `localStorage` ou `IndexedDB`.
- **Estrutura:** Array `{ id, title, content, updatedAt }`.
- **UI:** Drawer lateral "Meus Documentos" para troca rápida de contexto.

### D. Barra de Status (Status Bar)

Feedback visual e polimento de UI.

- **Métricas:** Palavras, caracteres, tempo de leitura.
- **Estado:** Indicadores de "Salvando...", "Salvo", "Offline".
- **Local:** Rodapé fixo do editor.

### E. Drag & Drop de Imagens

Fim da fricção de upload manual.

- **Fluxo:** Arrastar arquivo do desktop -> Editor.
- **Processamento:** Interceptar evento `drop` do Monaco -> Converter para Base64 (imediato) ou
  Upload S3 (background) -> Inserir sintaxe `![alt](url)` no cursor.

---

## 2. Modo "Construtor" (Low-Code Entry)

_Focado em baixar a barreira de entrada para usuários não técnicos._

### A. Sistema de Templates

Resolve o problema da "folha em branco".

- **Funcionalidade:** Galeria de iniciais (Contratos, Currículos, RFPs).
- **Tech:** `src/data/templates.ts` com metadados e conteúdo pré-definido.
- **UI:** Modal com cards visuais ao criar novo documento.

### B. Sidebar de Blocos (Drag-and-Drop)

Montagem visual de documentos complexos.

- **Conceito:** Aba "Componentes" na sidebar. Arrastar "Tabela de Preços" injeta o Markdown da
  tabela.
- **Categorias:** Marketing (Hero, FAQ), Jurídico (Assinatura, Cláusulas), Dev (API Blocks).
- **Lib:** `dnd-kit` para React.

### C. Preview Interativo (Híbrido)

Edição direta no visual (estilo Notion).

- **Conceito:** Permitir edições de texto simples (typos, frases) direto no painel da direita.
- **Tech:** Avaliar `ProseMirror` ou `Tiptap` para sincronização bidirecional futura.

---

## 3. "Documentos Inteligentes" (SaaS Features)

_Onde o produto deixa de ser um editor e vira uma plataforma de automação._

### A. Variáveis Dinâmicas (Smart Contracts)

- **Uso:** `Contrato para {{cliente}} no valor de {{valor}}`.
- **Lógica:** Regex detecta chaves `{{...}}` -> Gera formulário lateral -> User preenche -> Replace
  no render final.
- **Valor:** Geração de documentos em massa.

### B. Importação e Exportação (.md)

Liberdade de dados (Data Portability).

- **Funcionalidade:** Upload de arquivo local e Download do source code.
- **Tech:** API `FileReader` e manipulação de `Blob` no cliente.

### C. Inteligência Artificial (AI Magic Writer)

- **Features:** "Formalizar texto", "Resumir", "Expandir tópicos".
- **Tech:** Vercel AI SDK ou OpenAI API direta.

---

## 4. Motor de PDF Profissional (Backend)

_Necessário para funcionalidades Enterprise que o navegador não suporta._

### A. Cabeçalho e Rodapé Dinâmicos

- **Requisito:** Numeração ("Página 1 de 10") e Logos repetidos.
- **Solução:** **Puppeteer (Headless Chrome)** no backend. Uso de CSS `@page` para controle de
  impressão nativo.

### B. Sumário Automático (TOC)

- **Funcionalidade:** Página de índice com links e números de página corretos.
- **Processo:** Renderizar PDF -> Analisar quebras de página -> Injetar página de TOC no início.

### C. Capa Personalizada (Cover Page)

- **Conceito:** Builder visual isolado para a capa (full bleed image, títulos centralizados).
- **Merge:** O PDF da capa é gerado e concatenado ao PDF do conteúdo.

### D. Segurança e Metadados

- **Features:** Senha no PDF, Metadados (Autor, Keywords para SEO/Arquivamento), Marcas d'água.

---

## 5. Developer Experience (DX)

_Qualidade de código para escalar com segurança._

### A. Centralização de Tipos

- Refatorar interfaces dispersas para `src/types/domain.d.ts`.

### B. Abstração do Monaco

- Encapsular configurações complexas em `useMonacoConfig`. Preparar para temas.

### C. Error Boundaries

- Envolver o `PreviewPanel` em Error Boundary para evitar "Tela Branca da Morte" se o usuário
  digitar HTML inválido.

---

## 6. Colaboração & "Multiplayer"

_O fator Google Docs._

### A. Edição em Tempo Real

- **Tech Stack:** **Y.js** (CRDTs) + WebSockets (Hocuspocus ou Socket.io).
- **MVP:** "Locking" (Bloqueio de edição - apenas um edita por vez) antes do real-time total.

### B. Comentários e Anotações

- Metadados atrelados a blocos de texto ou linhas para revisão assíncrona.

---

## 7. Ecossistema Visual (Riqueza de Conteúdo)

_Indo além do texto puro._

### A. Diagramas como Código (Mermaid.js)

- **Funcionalidade:** Renderizar blocos ` ```mermaid ` como fluxogramas e gráficos de Gantt.
  Essencial para docs técnicos e de gestão.

### B. Gráficos Dinâmicos (Chart.js)

- **Funcionalidade:** Gerar gráficos de barras/pizza a partir de CSV/JSON inline no documento.

---

## 8. Branding e Customização (White Label B2B)

_Para vender para empresas que exigem identidade visual._

### A. Temas CSS Customizáveis

- **Funcionalidade:** Cliente define Cores (Hex), Fontes (Google Fonts) e Espaçamentos.
- **Tech:** Variáveis CSS (`--primary-color`) injetadas no container do Preview e no Puppeteer.

### B. Snippets Globais

- **Conceito:** Text Expander. Digitar `/footer_padrao` expande para um bloco de texto jurídico
  complexo definido nas configurações da empresa.

---

## 9. Fluxo de Trabalho

_Produtividade para Power Users._

### A. Command Palette (`Cmd + K`)

- **Lib:** `cmdk` (React).
- **Ações:** Navegação rápida, exportar, mudar tema, inserir snippet, invocar AI. Sensação de
  ferramenta "Pro".

### B. Versionamento (Time Travel)

- Snapshot automático a cada sessão. Diff visual para restaurar versões antigas.

---

## 10. Acessibilidade (Compliance)

_Requisito para Governo e Grandes Corporações._

### A. PDF Tagging (PDF/UA)

- Garantir que o HTML gerado para o Puppeteer tenha estrutura semântica (ARIA roles, heading levels
  corretos) para compatibilidade com leitores de tela.

---

## 11. Resumo Estratégico de Priorização (Execution Plan)

Como **Product Manager Técnico**, esta é a ordem lógica de desenvolvimento para maximizar valor
percebido, estabilidade e capacidade de venda:

1.  **Mobile UX (Tabs):** _Fundação._ Garante que o app não quebre em 50% dos dispositivos.
2.  **Scroll Sync:** _Wow Factor._ Diferencia imediatamente de um `textarea` comum.
3.  **Templates:** _Onboarding._ Resolve a paralisia inicial do usuário.
4.  **Command Palette:** _Power User._ Implementação rápida (`cmdk`) que eleva a percepção de
    qualidade profissional.
5.  **Variáveis Dinâmicas (Smart Docs):** _SaaS Value._ Funcionalidade de alto valor comercial e
    baixa complexidade técnica (string replace).
6.  **Branding/Temas CSS:** _B2B Sales._ Permite que os primeiros clientes empresariais usem a
    ferramenta "com a cara deles".
7.  **Sidebar de Blocos (Drag & Drop):** _UX._ Melhora a criação de layouts complexos.
8.  **Diagramas (Mermaid):** _Feature._ Baixo esforço (lib pronta) e alto impacto visual.
9.  **Backend Puppeteer:** _Infraestrutura._ Necessário para Cabeçalhos/Rodapés profissionais. É o
    divisor de águas entre "Brinquedo" e "Enterprise".
10. **Colaboração Real-time:** _Complexidade._ Deixar para a fase 2.0 ("Team Plan"), pois exige
    arquitetura de websocket robusta.
11. **AI Writer:** _Marketing._ A cereja do bolo para vender produtividade.
