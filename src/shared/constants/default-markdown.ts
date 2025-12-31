import { v4 as uuidv4 } from 'uuid'
export const DEFAULT_MARKDOWN = `# Título do Documento

Este é um exemplo de **Markdown** sendo convertido para PDF.

## O que funciona?
- [x] Tabelas
- [x] Listas
- [x] Negrito e Itálico
- [x] Código com syntax highlighting
- [x] Citações
- [x] Links e imagens

## Exemplo de Tabela

| Produto | Valor | Estoque |
| :--- | :--- | :---: |
| Café | R$ 5,00 | 100 |
| Leite | R$ 4,00 | 50 |
| Açúcar | R$ 3,50 | 200 |

## Exemplo de Código

\`\`\`javascript
function exemplo() {
  const mensagem = "Olá, mundo!";
  console.log(mensagem);
  return mensagem;
}
\`\`\`

## Citação

> Esta é uma citação importante que aparece destacada no documento.

## Lista Aninhada

1. Primeiro item
   - Subitem A
   - Subitem B
2. Segundo item
   - Subitem C
3. Terceiro item

## Links e Imagens

Você pode adicionar [links](https://example.com) e imagens:

![Alt text](https://placehold.co/400x200?text=Hello+World)

---

**Nota:** Este documento suporta múltiplas páginas automaticamente quando o conteúdo excede o tamanho da página configurada.
`
export const DEFAULT_MARKDOWN_ITEM = [
  {
    id: uuidv4(),
    content: DEFAULT_MARKDOWN,
    name: 'Documento',
  },
]
