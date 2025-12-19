### 🚀 Roadmap de Evolução: Markdown PDF Pro (Versão Final)

#### **Fase 1: Limpeza Técnica e Estabilização do Core**

- **Remoção de Redundâncias:** Eliminar o arquivo `pdf-utils.ts` e desinstalar as bibliotecas
  `jspdf` e `html2canvas-pro` do `package.json`, deixando a geração de PDF exclusivamente via API
  para reduzir o bundle do cliente.
- **Otimização do IndexedDB:** \* Ajustar o hook `usePersistedStateInDB` para remover o `setTimeout`
  de 4 segundos, garantindo que o estado `loaded` seja ativado imediatamente após o carregamento dos
  dados.
- Tornar a expiração (`expirationTime`) opcional no `index-database-manager.ts` para que documentos
  de usuário não expirem automaticamente às 9h da manhã.

- **Infraestrutura do Editor:** Implementar _Web Workers_ e _Lazy Loading_ para o Monaco Editor para
  manter o FCP (First Contentful Paint) baixo.

#### **Fase 2: UX Avançada do Editor e Mobile**

- **Scroll Sync (Sincronização de Rolagem):** Implementar lógica de sincronização por porcentagem
  entre o editor Monaco e o Preview (especificamente na ferramenta `md-to-pdf`).
- **Adaptação Mobile Pro:** Substituir o layout atual por um sistema de **Abas (Tabs)** no mobile
  para alternar entre "Editar" e "Visualizar", eliminando a necessidade de redimensionamento em
  telas pequenas.
- **Status Bar de Feedback:** Criar um rodapé fixo no editor exibindo contagem de
  palavras/caracteres, status de salvamento local e status da conexão com a API de PDF/GitHub.

#### **Fase 3: Integração Inteligente com GitHub Gists**

- **Estratégia de "Wrapping" Automático:** No `gist-explorer`, arquivos de código (JS, Python, etc.)
  devem ser automaticamente envolvidos em blocos Markdown (```lang) ao serem importados para o
  editor.
- **Performance e Segurança:**
- Implementar cache no servidor (BFF) para listagens do GitHub para mitigar o _Rate Limit_.
- Adicionar sanitização rigorosa de HTML no conteúdo vindo de Gists para prevenir ataques XSS no
  preview.

- **Resolução de Imagens:** Garantir que o backend (Puppeteer) processe corretamente os links de
  imagens externas, já que o sistema não suportará upload direto de arquivos.

#### **Fase 4: Qualidade de Saída (PDF Pro) e Resiliência**

- **Gestão de Tipografia:** Garantir que o HTML enviado para a API inclua tags `@import` do Google
  Fonts para que o PDF final reflita as fontes escolhidas sem usar fallbacks genéricos.
- **Sumário Automático (TOC):** Gerar índice clicável no PDF baseado nos cabeçalhos (`#`, `##`) do
  documento.
- **Resiliência de Rede:** Adicionar sistema de _retries_ exponenciais na Server Action de PDF para
  lidar com erros transitórios ou serviços indisponíveis (status 503).
- **Transição para API Stream (Futuro):** Planejar a mudança da Server Action para uma _Route
  Handler_ convencional para permitir o download via stream de arquivos grandes, evitando o gargalo
  do Base64.

#### **Fase 5: Funcionalidades Enterprise (A longo prazo)**

- **Suporte a Diagramas:** Integrar Mermaid.js para renderizar fluxogramas diretamente no preview e
  no PDF.
- **Validação de Payload:** Implementar verificação de tamanho de conteúdo no cliente antes de
  disparar a geração de PDF para evitar timeouts de servidor.

---

**Nota sobre Manutenção:** A centralização dos tipos dispersos em `type.d.ts` e `global.d.ts` será
realizada manualmente conforme sua preferência para garantir a sustentabilidade do código a longo
prazo.
