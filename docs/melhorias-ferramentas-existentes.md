### 1. Markdown Editor & PDF Pro

O objetivo aqui é transformar o editor em uma ferramenta de "authoring" profissional.

- **Sumário (TOC) Auomático e Interativo:** Gerar automaticamente um índice baseado nos headers (#,
  ##) que seja clicável tanto no preview quanto no PDF final (bookmarks nativos).
- **Smart Selection & Navigation:** Implementar comandos para expandir a seleção por blocos
  (parágrafo, lista, bloco de código) e navegação rápida entre headers, similar ao comportamento de
  IDEs profissionais.
- **Validação de Links em Tempo Real:** Um verificador que analisa links internos (âncoras para
  outros headers) e externos, destacando visualmente links quebrados antes da exportação.
- **Injeção de Variáveis (Templates Dinâmicos):** Suporte total a YAML Frontmatter para definir
  variáveis (ex: `{{data}}`, `{{cliente}}`) que são substituídas no corpo do texto e nos
  cabeçalhos/rodapés do PDF.

### 2. Web Extractor (Web to Markdown) [finalizado]

Otimizar a qualidade da extração para que o resultado seja "pronto para uso".

- **Relatório de Integridade (Soft-Failure):** Em vez de apenas falhar, a ferramenta deve marcar
  páginas que retornaram em branco ou com erros de bloqueio, permitindo tentar novamente com
  diferentes parâmetros de extração.
- **Agregador de URLs:** Possibilidade de inserir uma lista de URLs e gerar um único arquivo
  Markdown combinado, mantendo a hierarquia de headers para cada página extraída.
- **Histórico** - Manter um historico de urls extraidas pelo usuario (salvando no indexeddb e
  exibindo uma lista ao seleciona o input de url, com opcao de autocomplete ou nova url)

### 6. Markdown Editor & PDF Pro

- **Versionamento Local (Snapshot):** Utilizar o `IndexedDB` (já usado no projeto) para criar
  "checkpoints" manuais do documento. O utilizador poderia comparar a versão atual com um snapshot
  anterior usando o seu `diff-checker`.
- **Multi-column Layout via CSS:** Adicionar uma opção nas configurações de página para renderizar o
  PDF em duas colunas, ideal para artigos académicos ou newsletters técnicos.
- **Suporte a Diagramas de Sequência e Fluxo (Mermaid.js):** Como já está no seu roadmap, a feature
  pode ser expandida com um "Live Preview" específico para os diagramas, permitindo editar o código
  Mermaid e ver o gráfico atualizar-se isoladamente.

Essas adições aproveitam bibliotecas que já estão no seu `package.json`, como `framer-motion` para
as transições e `lucide-react` para os novos ícones, mantendo o bundle leve e a performance alta.
