import { v4 as uuidv4 } from 'uuid'
export const DEFAULT_MARKDOWN = `# 🚀 Bem-vindo ao MD Editor

Este é um ambiente de demonstração para testar todas as funcionalidades do editor. Sinta-se à vontade para editar, formatar e exportar este conteúdo.

## 1. Admonitions (Callouts)
O editor suporta blocos de destaque no estilo GitHub Flavored Markdown:

> [!NOTE]
> **Nota:** Admonitions são ótimos para destacar informações contextuais sem interromper o fluxo de leitura.

> [!TIP]
> **Dica Pro:** Use o atalho \`Ctrl + Space\` (ou o menu de ações) para inserir estes blocos rapidamente.

> [!WARNING]
> **Atenção:** Verifique sempre a visualização final antes de exportar para PDF.

## 2. Formatação de Texto
Você pode combinar estilos para dar ênfase ao conteúdo:
- **Negrito** para destaque forte.
- *Itálico* para ênfase sutil.
- ~~Texto riscado~~ para itens obsoletos.
- \`Código inline\` para termos técnicos ou atalhos.

## 3. Gestão de Tarefas
Acompanhe o progresso do seu projeto diretamente no documento:

- [x] 🎨 Configurar tema escuro/claro
- [x] 🔧 Implementar toolbar flutuante
- [x] 📦 Sistema de plugins (Tabelas, Callouts)
- [ ] 🚀 Lançar versão 1.0.0
- [ ] 📝 Escrever documentação técnica

## 4. Tabelas Ricas
Tabelas suportam alinhamento de colunas (Esquerda, Centro, Direita):

| Recurso | Status | Prioridade | Versão |
| :--- | :---: | :---: | ---: |
| Exportação PDF | ✅ Pronto | Alta | v1.0 |
| Sincronização Gist | 🔄 Em Progresso | Média | v1.1 |
| Colaboração Real-time | ⏳ Planejado | Baixa | v2.0 |
| Modo Zen | ✅ Pronto | Alta | v1.0 |

## 5. Blocos de Código
O editor suporta *syntax highlighting* para diversas linguagens.

### Exemplo em TypeScript (React):
\`\`\`tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold">Contador: {count}</h3>
      <div className="flex gap-2 mt-2">
        <Button onClick={() => setCount(c => c - 1)} variant="outline">-</Button>
        <Button onClick={() => setCount(c => c + 1)}>+</Button>
      </div>
    </div>
  )
}
\`\`\`

## 6. Citações e Referências

> "A simplicidade é o grau máximo de sofisticação."
>
> — *Leonardo da Vinci*

---

### Próximos Passos
1. Tente selecionar este texto e usar a toolbar flutuante.
2. Exporte este documento clicando no ícone de **PDF** na barra superior.
3. Importe um arquivo externo via URL para testar o parser.

![Banner](https://placehold.co/800x200/6d28d9/ffffff?text=Markdown+Editor+Pro&font=roboto)
`
export const DEFAULT_MARKDOWN_ITEM = [
  {
    id: uuidv4(),
    content: DEFAULT_MARKDOWN,
    name: 'Documento',
  },
]
