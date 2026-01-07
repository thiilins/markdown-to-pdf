### 1. Markdown Editor & PDF Pro

O objetivo aqui é transformar o editor em uma ferramenta de "authoring" profissional.

- **Sumário (TOC) Automático e Interativo:** Gerar automaticamente um índice baseado nos headers (#,
  ##) que seja clicável tanto no preview quanto no PDF final (bookmarks nativos).
- **Smart Selection & Navigation:** Implementar comandos para expandir a seleção por blocos
  (parágrafo, lista, bloco de código) e navegação rápida entre headers, similar ao comportamento de
  IDEs profissionais.
- **Validação de Links em Tempo Real:** Um verificador que analisa links internos (âncoras para
  outros headers) e externos, destacando visualmente links quebrados antes da exportação.
- **Injeção de Variáveis (Templates Dinâmicos):** Suporte total a YAML Frontmatter para definir
  variáveis (ex: `{{data}}`, `{{cliente}}`) que são substituídas no corpo do texto e nos
  cabeçalhos/rodapés do PDF.

### 2. Web Extractor (Web to Markdown)

Otimizar a qualidade da extração para que o resultado seja "pronto para uso".

- **Extração Seletiva de DOM:** Permitir que o usuário visualize a estrutura do site e selecione
  manualmente apenas os nós/elementos que deseja converter, evitando ruídos como menus e anúncios.
- **Renderização de Sites Dinâmicos:** Adicionar uma opção de "Deep Scrape" que utiliza um navegador
  (browser-based) para carregar conteúdos gerados por JavaScript (React, Vue, Angular) antes da
  conversão.
- **Relatório de Integridade (Soft-Failure):** Em vez de apenas falhar, a ferramenta deve marcar
  páginas que retornaram em branco ou com erros de bloqueio, permitindo tentar novamente com
  diferentes parâmetros de extração.
- **Agregador de URLs:** Possibilidade de inserir uma lista de URLs e gerar um único arquivo
  Markdown combinado, mantendo a hierarquia de headers para cada página extraída.

### 3. Code Snapshot (Code to Image)

Diferenciar-se do "Carbon.now.sh" focando em precisão e contexto.

- ✅ **Presets de Redes Sociais com Preview Real:** Botões com dimensões exatas para LinkedIn, Twitter
  e Instagram, com ajuste automático de padding para garantir que o código esteja sempre
  centralizado. **[IMPLEMENTADO]**
- ✅ **Destaque de Mudanças (Code Diff):** Permitir marcar linhas como "adicionadas" ou "removidas"
  dentro do snapshot para explicar mudanças de código visualmente. **[IMPLEMENTADO]**
- ✅ **Line Highlighting Contextual:** Possibilidade de clicar num número de linha para a destacar e
  adicionar um pequeno "popover" de comentário que será exportado na imagem. **[IMPLEMENTADO]**
- ✅ **Background Dinâmico do Editor:** O tema ao alterar altera não só as cores do editor mas o fundo da janela do editor
  com base no tema escolhido. **[IMPLEMENTADO - v0.5.1]**
- ⏳ **Interactive Code Annotations:** Possibilidade de adicionar setas ou notas explicativas
  flutuantes sobre partes específicas do código antes de exportar a imagem. **[PENDENTE]**
- ⏳ **Modo "Live Edit" no Preview:** Permitir pequenas edições de texto diretamente no painel de
  preview do snapshot para ajustes rápidos de última hora. **[PENDENTE]**

- Verificar quais as funcionalidades e features do https://carbon.now.sh/ podemos aproveitar e
  implementar na nossa ferramenta.

### 4. Formatadores (JSON, SQL, JS, CSS) [FINISHED]

Sair da simples indentação para utilitários de produtividade.

- **JSON Fixer Inteligente:** Uma função que corrige automaticamente erros comuns em JSONs colados,
  como aspas simples, vírgulas sobrando, falta de aspas em chaves ou literais em caixa alta.
- **Visualização de Imagens em Tree View:** Ao passar o mouse sobre uma URL de imagem dentro de um
  JSON formatado, exibir um pequeno preview da imagem.
- **Smart JSONPath Tracking:** Exibir em tempo real o caminho (JSONPath) da chave onde o cursor está
  posicionado, facilitando a navegação em arquivos gigantes.
- **Conversão Cruzada Entre Formatos:** Botão de um clique para converter instantaneamente entre
  JSON, XML, YAML e CSV, preservando a estrutura de dados. Com certeza. Para fechar o ciclo de
  otimização das ferramentas que já fazem parte do seu ecossistema, o foco deve ser em
  **funcionalidades de "Power User"** que resolvem problemas de workflow que ferramentas simples não
  tocam.

### 5. Web Extractor (Aprimoramento de Inteligência de Extração)

- **Selector Picker Visual:** Em vez de extrair a página inteira, permitir que o utilizador forneça
  um seletor CSS específico (ex: `.main-content` ou `#article-body`) para extrair apenas essa parte.
- **Modo "Reader" de Backup:** Caso o scraper principal falhe na Vercel, implementar um fallback
  automático que tenta extrair apenas o texto puro (usando bibliotecas como `node-html-markdown` já
  presentes no seu `package.json`) antes de desistir.
- **Conversão de Tabelas HTML para Markdown GFM:** Melhorar o parser para garantir que tabelas
  complexas do site original sejam convertidas fielmente para a sintaxe do GitHub Flavored Markdown.

### 6. Markdown Editor & PDF Pro

- **Versionamento Local (Snapshot):** Utilizar o `IndexedDB` (já usado no projeto) para criar
  "checkpoints" manuais do documento. O utilizador poderia comparar a versão atual com um snapshot
  anterior usando o seu `diff-checker`.
- **Multi-column Layout via CSS:** Adicionar uma opção nas configurações de página para renderizar o
  PDF em duas colunas, ideal para artigos académicos ou newsletters técnicos.
- **Suporte a Diagramas de Sequência e Fluxo (Mermaid.js):** Como já está no seu roadmap, a feature
  pode ser expandida com um "Live Preview" específico para os diagramas, permitindo editar o código
  Mermaid e ver o gráfico atualizar-se isoladamente.

### 7. Code Snapshot (Code to Image) [FINISHED]

- **Modo "Diff" no Snapshot:** Permitir que o utilizador cole um diff de código e a ferramenta
  formate automaticamente as linhas verdes (adições) e vermelhas (remoções) com o estilo do editor.
- **Line Highlighting Contextual:** Possibilidade de clicar num número de linha para a destacar e
  adicionar um pequeno "popover" de comentário que será exportado na imagem.

- **Presets de Mockup de Janela:** Adicionar molduras que simulam o aspeto do macOS (botões de
  semáforo), Windows ou um terminal "Retro", mantendo o design limpo e minimalista.

### 8. Formatadores de Dados (JSON, SQL, JS) [FINISHED]

- **JSON Tree Graph:** Para além da visualização em texto, oferecer uma visualização em grafo/árvore
  onde o utilizador pode colapsar nós visualmente e ver a hierarquia de objetos complexos.
- **SQL Linter Integrado:** Para além de formatar o SQL com o `sql-formatter`, adicionar uma
  verificação básica de sintaxe que destaca erros comuns (como parênteses não fechados ou vírgulas
  em excesso).
- **Extração de Caminho (Copy JSON Path):** Ao clicar numa chave do JSON, permitir copiar o caminho
  exato (ex: `data.users[0].profile.name`), o que é extremamente útil para desenvolvedores que
  trabalham com integração de APIs.

### 9. JWT Decoder [FINISHED]

- **Simulador de Modificação:** Permitir que o utilizador edite o payload do JWT e veja como o token
  seria gerado (mesmo sem a assinatura ser válida, é útil para depurar estruturas de dados).
- **Reconhecimento de Claims Padrão:** Adicionar explicações automáticas (tooltips) para as claims
  padrão do JWT, como `exp` (data de expiração formatada), `iat` (data de criação) e `sub`.

Essas adições aproveitam bibliotecas que já estão no seu `package.json`, como `framer-motion` para
as transições e `lucide-react` para os novos ícones, mantendo o bundle leve e a performance alta.
