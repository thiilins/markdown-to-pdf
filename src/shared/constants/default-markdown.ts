import { v4 as uuidv4 } from 'uuid'
export const DEFAULT_MARKDOWN = `# 🚀 Bem-vindo ao MD Editor

Este é um ambiente de demonstração para testar todas as funcionalidades do editor. Sinta-se à vontade para editar, formatar e exportar este conteúdo.

## 1. Admonitions (Callouts)
O editor suporta blocos de destaque no estilo GitHub Flavored Markdown:

> [!NOTE]
> **Nota:** Admonitions são ótimos para destacar informações contextuais sem interromper o fluxo de leitura.

> [!TIP]
> **Dica Pro:** Use o atalho \`Ctrl + Space\` (ou o menu de ações) para inserir estes blocos rapidamente.

> [!IMPORTANT]
> **Importante:** Esta funcionalidade requer atenção especial. Certifique-se de revisar todos os detalhes antes de prosseguir.

> [!WARNING]
> **Atenção:** Verifique sempre a visualização final antes de exportar para PDF.

> [!CAUTION]
> **Cuidado:** Esta ação é irreversível. Faça backup dos seus dados antes de continuar.

## 2. Formatação de Texto
Você pode combinar estilos para dar ênfase ao conteúdo:
- **Negrito** para destaque forte.
- *Itálico* para ênfase sutil.
- ~~Texto riscado~~ para itens obsoletos.
- \`Código inline\` para termos técnicos ou variáveis.
- Use <kbd>Ctrl</kbd> + <kbd>C</kbd> para copiar e <kbd>Ctrl</kbd> + <kbd>V</kbd> para colar.

---

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
Use \`>\` para criar blocos de citação elegantes:

> "A simplicidade é o grau máximo de sofisticação."
>
> — *Leonardo da Vinci*

> "O código é como humor. Quando você tem que explicá-lo, é ruim."
>
> — *Cory House*

## 7. Diagramas Mermaid
Crie diagramas interativos diretamente no Markdown:

### Fluxograma de Processo
\`\`\`mermaid
graph TD
    A[Início] --> B{Usuário logado?}
    B -->|Sim| C[Dashboard]
    B -->|Não| D[Página de Login]
    D --> E[Autenticar]
    E --> F{Credenciais válidas?}
    F -->|Sim| C
    F -->|Não| D
    C --> G[Fim]
\`\`\`

### Diagrama de Sequência
\`\`\`mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as API
    participant D as Database

    U->>F: Clica em "Salvar"
    F->>A: POST /api/documents
    A->>D: INSERT INTO documents
    D-->>A: ID do documento
    A-->>F: 201 Created
    F-->>U: "Documento salvo!"
\`\`\`

## 8. Listas Estilizadas

### Lista Não Ordenada
- 🎨 Design moderno e responsivo
- ⚡ Performance otimizada
- 🔒 Segurança em primeiro lugar
- 📱 Suporte mobile nativo
- 🌐 Internacionalização completa

### Lista Ordenada
1. Planeje sua arquitetura
2. Implemente os componentes base
3. Adicione testes unitários
4. Configure CI/CD
5. Deploy em produção

### Lista de Tarefas
- [x] Configurar ambiente de desenvolvimento
- [x] Criar estrutura de pastas
- [x] Implementar componentes principais
- [ ] Escrever documentação
- [ ] Realizar testes de integração

## 9. Imagens Responsivas
As imagens são exibidas com controles interativos:

![Exemplo de Imagem](https://placehold.co/800x400/6366f1/ffffff?text=Imagem+Responsiva&font=roboto)

## 10. Links Estilizados
O editor detecta automaticamente o tipo de link e aplica cores e ícones específicos:

### 🌐 Links Externos
- [Documentação Next.js](https://nextjs.org)
- [GitHub](https://github.com)
- [Google](https://google.com)

### 🔗 Âncoras Internas
- [Ir para Admonitions](#1-admonitions-callouts)
- [Ver Tabelas](#4-tabelas-ricas)
- [Voltar ao Topo](#-bem-vindo-ao-md-editor)

### 📧 E-mail
- [contato@exemplo.com](mailto:contato@exemplo.com)
- [suporte@empresa.com](mailto:suporte@empresa.com)

### Links Quebrados (Para Teste de Validação)
- [Link Morto](https://este-site-nao-existe-123456789.com)
- [Âncora Inválida](#secao-que-nao-existe)

---

## 11. Elementos Especiais

### Código Inline
Use \`const variable = 'value'\` para destacar código no meio do texto.

### Atalhos de Teclado
- Salvar: <kbd>Ctrl</kbd> + <kbd>S</kbd>
- Desfazer: <kbd>Ctrl</kbd> + <kbd>Z</kbd>
- Refazer: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>

---

## 12. Resumo de Componentes Disponíveis

- ✅ **Admonitions** - 5 tipos (Note, Tip, Important, Warning, Caution)
- ✅ **Formatação** - Negrito, itálico, riscado, código inline
- ✅ **Listas** - Ordenadas, não ordenadas, tarefas (checkboxes)
- ✅ **Tabelas** - Com alinhamento e bordas estilizadas
- ✅ **Código** - Syntax highlighting + Mermaid diagrams
- ✅ **Citações** - Blockquotes elegantes
- ✅ **Imagens** - Responsivas com caption
- ✅ **Links** - Externos, internos, e-mail (com ícones)
- ✅ **Kbd** - Atalhos de teclado com visual 3D
- ✅ **Separadores** - Linhas horizontais com gradiente

---

### 🚀 Próximos Passos
1. Tente selecionar texto e usar a **toolbar flutuante**
2. Exporte para **PDF** clicando no ícone na barra superior
3. Use o **TOC interativo** para navegar entre seções
4. Teste a **validação de links** para encontrar URLs quebradas
5. Experimente criar **diagramas Mermaid** personalizados
`
export const DEFAULT_MARKDOWN_ITEM = [
  {
    id: uuidv4(),
    content: DEFAULT_MARKDOWN,
    name: 'Documento',
  },
]
