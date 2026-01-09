### 1. Markdown Editor & PDF Pro

- **Injeção de Variáveis (Templates Dinâmicos):** Suporte total a YAML Frontmatter para definir
  variáveis (ex: `{{data}}`, `{{cliente}}`) que são substituídas no corpo do texto e nos
  cabeçalhos/rodapés do PDF.

### 6. Markdown Editor & PDF Pro

- **Versionamento Local (Snapshot):** Utilizar o `IndexedDB` (já usado no projeto) para criar
  "checkpoints" manuais do documento. O utilizador poderia comparar a versão atual com um snapshot
  anterior usando o seu `diff-checker`.
- **Multi-column Layout via CSS:** Adicionar uma opção nas configurações de página para renderizar o
  PDF em duas colunas, ideal para artigos académicos ou newsletters técnicos.
