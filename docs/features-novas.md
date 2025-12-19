Com base na arquitetura atual da v2 do **md-to-pdf-pro**, que já conta com uma base sólida de edição
e exportação, aqui está um roadmap de novas funcionalidades (features) focado em agregar valor
profissional e transformar a ferramenta em um ecossistema completo de documentação:

### 1. Documentação Técnica e Diagramas

- **Integração com Mermaid.js:** Permitir a criação de diagramas de fluxo, sequências e gráficos de
  Gantt diretamente no Markdown. Isso é essencial para usuários que criam documentação técnica.
- **Suporte a LaTeX (KaTeX):** Renderização de fórmulas matemáticas complexas. Ideal para
  estudantes, professores e pesquisadores que precisam gerar PDFs acadêmicos.
- ~~**Destaque de Sintaxe Avançado:** Expandir o `react-syntax-highlighter` para suportar mais
  linguagens e temas de código que combinem com os presets de PDF.~~ ✅ **IMPLEMENTADO** -
  LanguageMap expandido com 80+ linguagens

### 2. Automação e Metadados (Frontmatter)

- **Suporte a YAML Frontmatter:** Permitir definir variáveis no topo do arquivo (ex: `title`,
  `author`, `date`, `version`) que podem ser injetadas automaticamente no corpo do documento ou no
  cabeçalho/rodapé do PDF.
- ~~**Sumário Automático (TOC):** Gerar um índice clicável no início do documento baseado nos
  headers (`h1`, `h2`, `h3`). No PDF, isso deve se transformar em "bookmarks" (marcadores) para
  navegação rápida.~~ ✅ **JÁ IMPLEMENTADO** - Função `handleGenerateTOC` e botão na toolbar
- ~~**Quebras de Página Manuais:** Adicionar uma sintaxe ou botão para inserir `page-break`,
  permitindo que o usuário controle exatamente onde uma página termina e a outra começa.~~ ✅ **JÁ
  IMPLEMENTADO** - Botão `insertPageBreak` na toolbar e suporte CSS completo

### 3. Personalização Profissional

- **Sistema de Templates Dinâmicos:** Além de mudar cores e fontes, oferecer layouts pré-definidos
  (ex: Template de Currículo, Relatório Empresarial, Contrato, E-book).
- **Editor de Cabeçalho e Rodapé:** Uma interface para configurar textos, numeração de páginas (ex:
  "Página 1 de 10") e logos que aparecem em todas as páginas do PDF.
- **Injeção de CSS Customizado:** Permitir que usuários avançados colem seu próprio CSS para
  sobrescrever estilos e ter controle total sobre o design final.

### 4. Gestão de Arquivos e Nuvem

- **Sistema de Pastas/Projetos:** Atualmente você usa IndexedDB para persistência simples. Evoluir
  isso para um sistema de pastas para organizar múltiplos documentos.
- **Exportação Direta para Cloud:** Além do download local, adicionar botões para salvar o PDF
  diretamente no **Google Drive**, **Dropbox** ou criar um novo **GitHub Gist** com o conteúdo
  gerado.
- **Importação de URLs:** Permitir que o usuário cole a URL de um arquivo `.md` bruto (ex: do
  GitHub) e o sistema o carregue automaticamente no editor.

### 5. Colaboração e IA

- **Assistente de Escrita (IA):** Integração com APIs de LLM para ajudar a expandir textos, corrigir
  gramática ou resumir tópicos dentro do próprio editor Markdown.
- **Modo de Revisão:** Sistema de comentários ou "track changes" para quando o documento for
  compartilhado entre usuários (útil se você implementar autenticação via NextAuth para times).

---

### Sugestão de Prioridade (Roadmap)

1. **Curto Prazo (Quick Wins):**

- Suporte a Mermaid.js e KaTeX.
- ~~Quebras de página manuais e Sumário Automático.~~ ✅ **JÁ IMPLEMENTADO**

2. **Médio Prazo (Valor Agregado):**

- Suporte a Frontmatter e Variáveis.
- Templates Profissionais (Currículos/Relatórios).
- Cabeçalho e Rodapé configuráveis.
- Importação de URLs.

3. **Longo Prazo (Ecossistema):**

- Gestão de pastas e projetos.
- Integração direta com Google Drive/Dropbox.
- Assistente de IA para escrita.

Qual dessas vertentes mais se alinha com o seu objetivo para o "Pro"? Se desejar, podemos escolher
uma dessas (como o **Sumário Automático** ou **Mermaid.js**) para detalhar a implementação técnica.
