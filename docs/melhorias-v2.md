Excelente progresso na v2! Com a memoização, o streaming de PDF e o sistema de retry implementados,
a fundação técnica do **md-to-pdf-pro** está muito mais sólida.

Como você solicitou ignorar os itens pendentes da análise anterior e focar no que **mais** pode ser
melhorado e otimizado antes das novas funcionalidades, aqui está uma nova camada de melhorias
técnicas e de arquitetura:

---

### 1. Otimização do Pipeline de Renderização (UX/Performance)

- **Priorização de Escrita com `useTransition` (React 19):** Atualmente, o estado `markdown` é
  compartilhado. Em documentos muito grandes, a atualização do preview pode causar um leve _delay_
  no input do editor.
- _Melhoria:_ Utilizar o `useTransition` para marcar a atualização do preview como não urgente. Isso
  garante que o Monaco Editor responda instantaneamente, enquanto o Preview "corre atrás" sem travar
  a interface.

- **Processamento de Imagens e Assets no Cliente:** Chamadas ao Puppeteer costumam falhar ou demorar
  se o HTML contiver imagens externas pesadas que o servidor precisa baixar.
- _Melhoria:_ Implementar uma lógica de pré-processamento no cliente que converte URLs de imagens
  para **Data URIs (Base64)** antes de enviar o HTML para a API. Isso torna o payload do PDF
  independente de conexões externas no lado do servidor.

- **Virtualização do Preview para Documentos Longos:** Renderizar um HTML de 50 páginas de uma vez
  pode sobrecarregar o DOM.
- _Melhoria:_ Se o documento for detectado como "longo", aplicar técnicas de _windowing_ (como
  `react-window` ou similar no preview) para renderizar apenas as páginas que estão próximas da área
  de visão.

### 2. Robustez e Persistência (Arquitetura)

- **Sistema de "Dirty State" e Autosave:** Embora você use IndexedDB, o usuário não sabe se o dado
  foi realmente persistido ou se há um conflito.
- _Melhoria:_ Adicionar um indicador de status (ex: "Salvando...", "Alterações salvas localmente") e
  uma lógica de _debounce_ na escrita do IndexedDB para evitar operações excessivas de E/S.

- **PWA e Suporte Offline Completo:** Como o editor e a configuração já funcionam via persistência
  local.
- _Melhoria:_ Adicionar um `manifest.json` e um Service Worker básico. Isso permite que o usuário
  abra o **md-to-pdf-pro** em um avião, por exemplo, escreva seu documento e só precise de internet
  no momento final de gerar o PDF via API.

- **Abstração de Mensageria (Toast Service):** O uso de `sonner` está espalhado.
- _Melhoria:_ Centralizar a lógica de notificações em um `useNotify` ou similar, permitindo trocar a
  biblioteca de UI no futuro sem tocar em toda a lógica de negócio do projeto.

### 3. Qualidade do Código e Segurança (DX)

- **Sanitização de HTML no Cliente:** Mesmo que o backend sanitize, o preview injeta HTML bruto
  (`rehype-raw`).
- _Melhoria:_ Fortalecer a configuração do `rehype-sanitize` no frontend para garantir que nenhum
  script malicioso seja executado durante a edição de Markdowns vindos de fontes externas (como
  Gists de terceiros).

- **Injeção Dinâmica de CSS (Scoped Styles):** Atualmente, o `PrintStyle` parece injetar estilos
  globais.
- _Melhoria:_ Encapsular o preview em um **Shadow DOM** ou usar um `iframe` para o painel de
  visualização. Isso isola completamente o CSS do seu app (Tailwind 4) do CSS que o usuário quer no
  documento PDF, evitando conflitos de estilo.

- **Normalização de Tipografia (Font-Loading):** Você carrega fontes do Google Fonts dinamicamente.
- _Melhoria:_ Implementar um sistema de _fallback_ para fontes de sistema enquanto o Google Fonts
  não carrega, evitando o efeito de "pulo" de texto (Layout Shift) no preview.

### 4. Otimização de Build (Foco em Produção)

- **Treeshaking de Iconografia:** Você usa `lucide-react` e `react-icons`.
- _Melhoria:_ Garantir que a configuração do Next.js está otimizada para remover ícones não
  utilizados do bundle final, já que essas bibliotecas podem ser grandes se não forem importadas
  corretamente.

- **Compressão de Payload:**
- _Melhoria:_ Ativar a compressão Gzip/Brotli para o transporte do JSON de configuração e do
  Markdown, especialmente relevante se você decidir implementar o histórico de versões.

---

### Novo Roadmap Técnico Sugerido (Pós-V2)

1. **Estabilidade de Input:** Implementar `useTransition` para isolar a performance do Editor vs
   Preview.
2. **Isolamento de Estilo:** Migrar o Preview para um Shadow DOM ou Iframe para evitar vazamento de
   CSS.
3. **Resiliência de PDF:** Implementar a conversão de imagens para Base64 no cliente.
4. **UX de Persistência:** Adicionar indicadores de Autosave e Modo Offline (PWA).

**Deseja que eu detalhe a implementação técnica de algum desses pontos específicos (como o
isolamento de estilos ou a otimização com React Transitions)?**
