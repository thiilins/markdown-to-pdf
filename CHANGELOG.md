# CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e este projeto
adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.10.0] - 2025-01-08

### Adicionado

- **Cron Expression Visualizer:** Nova ferramenta completa para validar, visualizar e entender
  expressões cron em `/cron-tools`.
  - **Validação em Tempo Real:** Parsing automático com debounce de 300ms usando `cron-parser` e
    `cronstrue`.
  - **Descrição em Português:** Conversão de expressões cron para linguagem natural com timezone
    (America/Sao_Paulo).
  - **Timeline de Execuções:** Próximas 10 execuções com data/hora formatada e tempo relativo.
  - **Construtor Visual (Builder):** Interface com 5 dropdowns para construir expressões sem
    conhecer sintaxe.
  - **Conversor de Timezone:** 9 timezones principais com cálculo automático de DST.
  - **Exportador de Código:** Geração de código para Node.js, Python, Docker, Kubernetes e Systemd.
  - **19 Presets Comuns:** Expressões pré-definidas organizadas em grid.
  - **Indicadores Visuais:** Mapeamento dos 5 campos com barras de progresso animadas.
  - **Layout com Tabs:** Abas para Presets/Builder e Timeline/Timezone/Código.
  - **Design Premium:** Animações com Framer Motion e glassmorphism.

## [0.9.1] - 2025-01-08

### Adicionado

- **Página de Changelog:** Nova página dedicada em `/changelog` com design profissional e hierarquia
  visual clara.
- **Componentes de Changelog:** Sistema de componentes personalizados para renderização do
  CHANGELOG.md com categorias coloridas (Adicionado, Modificado, Corrigido, Segurança, Documentado).

### Modificado

- **CHANGELOG.md:** Padronizado para seguir 100% o formato Keep a Changelog 1.1.0, removendo emojis
  duplicados e organizando categorias.
- **Hierarquia Visual:** Implementada hierarquia clara com espaçamentos progressivos (H2: mt-16, H3:
  mt-12, H4: mt-6, Lista: mb-2).
- **Hero Section:** Botões de CTA redesenhados com tamanhos uniformes (240px), sem uppercase, e
  efeitos de hover diferenciados.
- **Botão "Explorar Ferramentas":** Estilo mais sutil (branco → roxo no hover) com ícone animado.
- **Botão "Ver Changelog":** Estilo outline com texto gradiente e rotação do ícone no hover.

### Corrigido

- Duplicação de ícones nos títulos H3 do changelog (detecção automática de emojis).
- Contraste de texto no changelog (slate-300 para listas, slate-400 para parágrafos).
- Alinhamento de bullets e texto em listas do changelog.

## [0.9.0] - 2025-01-08

### Adicionado

- **Componentes Markdown Personalizados:**
  - **Imagens:** Suporte a imagens responsivas com borda, sombra suave, legenda opcional e
    tratamento de erro visual.
  - **Listas:**
    - _Ordenadas:_ Estilização com números em círculos azuis, sombra e contadores automáticos.
    - _Não Ordenadas:_ Bullets personalizados com anel decorativo.
    - _Task Lists:_ Checkboxes interativos com estados e transições suaves.
  - **Tabelas:** Design responsivo com scroll horizontal, cabeçalho estilizado e alinhamento
    inteligente.
  - **Links:** Estilização dinâmica baseada no tipo (Externo, Âncora, E-mail e Interno) com
    animações.
  - **Teclas (Kbd):** Visual de tecla física 3D para representação de atalhos.
  - **Código Inline:** Visual modernizado com fonte mono e destaque sutil.
  - **Separadores (Hr):** Linha horizontal com gradiente e ícone decorativo centralizado.

### Modificado

- **Sistema de Markdown:**
  - Unificação da lógica de renderização para garantir consistência visual em toda a plataforma.
  - Detecção automática de alinhamento de texto em tabelas.
  - Melhoria na estruturação semântica das listas.
- **Documentação:**
  - Expansão do guia padrão com exemplos visuais de todos os novos componentes de estilização.
  - Adição de seção de resumo e guia de "Próximos Passos".

### Corrigido

- Incremento numérico em listas ordenadas aninhadas.
- Renderização de cabeçalhos vazios em tabelas.
- Remoção de bordas externas duplicadas em tabelas para um visual mais limpo.
- Ajustes finos de espaçamento (padding/margin) em todos os elementos de texto.
- Alinhamento vertical de ícones em links externos.
- Renderização correta de marcadores em listas de resumo.

## [0.8.0] - 2025-01-08

### Adicionado

- **Admonitions (Callouts):**
  - Suporte a 5 tipos de alertas: `Nota`, `Dica`, `Importante`, `Aviso` e `Cuidado`.
  - Renderização com design _glassmorphism_ e ícones contextuais.
  - Suporte à sintaxe padrão `[!TYPE]`.

- **Exemplos:** Adicionados casos de uso para Admonitions e diagramas no documento padrão.

### Modificado

- **Renderização Centralizada:**
  - Unificação do motor de renderização, garantindo que o Editor, o Conversor de PDF e o Explorador
    de Gists exibam o conteúdo de forma idêntica.
  - Otimização do carregamento de recursos (Mermaid, Highlighting).

- **Previews:**
  - Atualização do visualizador de Gists para incluir Índice Interativo, Validação de Links e
    suporte a diagramas.

- **Pre-processamento:** Melhoria na detecção de blocos de código para evitar conflitos com
  diagramas.

### Corrigido

- Renderização de diagramas complexos dentro de blocos de pré-visualização.
- Eliminação de inconsistências visuais entre diferentes ferramentas da plataforma.

## [0.7.0] - 2025-01-08

### Adicionado

- **Suporte a Diagramas (Mermaid.js):**
  - Renderização interativa de fluxogramas, diagramas de sequência, Gantt, classes, estado, ER e
    gráficos de pizza.
  - Detecção automática de blocos de código `mermaid`.
  - Tratamento de erros visual amigável quando a sintaxe do diagrama é inválida.
  - Carregamento sob demanda (lazy rendering) para melhor performance.

### Modificado

- Integração nativa de diagramas nas visualizações do Editor e do Gerador de PDF.
- Atualização dos exemplos padrão para incluir diagramas de fluxo e sequência.

## [0.6.0] - 2025-01-08

### Adicionado

- **Índice Interativo (TOC):**
  - Painel de navegação flutuante com design translúcido.
  - Geração automática baseada nos cabeçalhos (H1-H6) com indentação hierárquica.
  - Scroll suave e destaque ativo do item sendo lido.
  - Geração automática de IDs (âncoras) para todos os títulos.

- **Validador de Links:**
  - Verificação em tempo real de integridade de links (Status HTTP).
  - Suporte a verificação de links externos, internos, âncoras e imagens.
  - Painel de estatísticas com contagem de links válidos e quebrados.
  - Proteção contra verificação de IPs locais/privados.

### Corrigido

- Posicionamento do Índice alterado para evitar sobreposição de conteúdo em telas menores.
- Adaptação dinâmica da altura do Índice à janela do navegador.
- Detecção aprimorada de links externos.
- Tratamento de falhas de rede e _timeouts_ durante a validação de URLs.

## [0.5.6] - 2025-01-08

### Adicionado

- **Web Extractor:**
  - **Histórico:** Armazenamento local das últimas URLs processadas com busca rápida.
  - **Modo Batch:** Extração em lote permitindo processar múltiplos artigos sequencialmente.
  - **Relatório de Integridade:** Métricas sobre a qualidade da extração (imagens recuperadas,
    tamanho do conteúdo).
  - **Separadores Visuais:** Novos divisores para organizar múltiplos artigos no mesmo documento.

### Modificado

- **Modo Leitura:**
  - Melhoria na limpeza automática de elementos indesejados (anúncios, popups) quando a extração
    padrão falha.
- **UX:**
  - Foco na extração HTML com conversão para Markdown opcional e sistema de "falha suave" para não
    interromper processos em lote.

### Corrigido

- Contagem incorreta de itens na primeira execução do modo Batch.
- Conflitos de interface nos campos de entrada de URL.
- Fluxo de navegação entre o processamento e a visualização do resultado.

## [0.5.5] - 2025-01-07

### Adicionado

- **Code Snapshot - Destaque de Linhas:**
  - Sistema para destacar linhas específicas com clique.
  - Personalização de cores e opacidade do destaque.

- **Code Snapshot - Anotações:**
  - Inserção de anotações flutuantes ("drag and drop") sobre o código.
  - Biblioteca de ícones e editor visual modernizado.

### Modificado

- **UX de Anotações:** Melhoria na interação de arrastar e soltar e atualização em tempo real.
- **Lógica de Highlights:** Adaptação para respeitar o modo de comparação (diff), permitindo
  destaque apenas em linhas inalteradas.

## [0.5.4] - 2025-01-XX

### Modificado

- **Otimização Interna (Snapshot):**
  - Refatoração do gerenciamento de estado para melhor performance.
  - Centralização da lógica de compartilhamento.

### Corrigido

- Correção de problemas de otimização no build de produção.

## [0.5.3] - 2025-01-XX

### Adicionado

- **Code Snapshot - Compartilhamento:**
  - Geração de URLs para compartilhamento de snippets (estado salvo na URL).
  - Botão de cópia rápida para a área de transferência.

- **Code Snapshot - Importação:**
  - Importação direta de código via URL de Gist (GitHub).
  - Detecção automática da linguagem de programação.

### Corrigido

- Erros de execução nos formatadores (HTML/CSS/JS/SQL) em ambiente de produção (Vercel).
- Problemas de duplicação na renderização de separadores.
- Melhoria na tipagem do estado da URL.

## [0.5.2] - 2025-01-XX

### Adicionado

- **Code Snapshot - Interatividade:**
  - Modo "Live Edit" permitindo edição direta do código na pré-visualização.
  - Controles para ativar/desativar anotações e edição.

### Corrigido

- Definições de tipos e callbacks para maior estabilidade.

## [0.5.1] - 2025-01-XX

### Adicionado

- **JSON Formatter:**
  - Suporte a conversão para **TOML** e **TOON**.

- **JSON Tree View:**
  - Visualização hierárquica expandida por padrão.

### Modificado

- **UX de Conversão:** Reposicionamento de botões para acesso mais intuitivo.
- **Visual:** Redesign da árvore JSON com tema escuro e ícones de tipo de dados.
- **Code Snapshot:** Ajuste dinâmico do fundo do editor conforme o tema.

### Corrigido

- Validação prévia de JSON antes de tentar conversões.

## [0.5.0] - 2025-01-XX

### Adicionado

- **JSON Fixer:** Correção automática de erros comuns (aspas simples, vírgulas extras, chaves sem
  aspas).
- **Preview de Imagens:** Visualização rápida de URLs de imagem dentro do JSON.
- **Rastreamento de Caminho:** Exibição em tempo real do JSONPath baseada na posição do cursor.
- **Conversão Cruzada:** Conversão instantânea entre JSON, XML, YAML e CSV.

### Modificado

- Barra de ferramentas atualizada com novas ações rápidas.

## [0.4.0] - 2025-01-XX

### Adicionado

- **Code Snapshot - Modo Diff:**
  - Suporte visual para diferenças de código (estilo Git diff).
  - Coloração automática para linhas adicionadas (verde) e removidas (vermelho).

- **Comentários Contextuais:**
- Adição de comentários atrelados a números de linha específicos.

- **Novo Tema:** Preset "Terminal Retro" com estética CRT.

## [0.3.0] - 2025-01-XX

### Adicionado

- **JSON Formatter:**
  - Recurso "Copiar JSON Path" no menu de contexto.
  - Nova aba de visualização em árvore (Tree View).

- **SQL Formatter:**
- Validação de sintaxe integrada (Linter) para vírgulas e cláusulas SQL.

### Modificado

- Integração aprimorada com o editor de código para ações personalizadas.
- Feedback visual em tempo real para erros de validação.

### Corrigido

- Conflitos de variáveis no validador SQL.
- Erros de importação dinâmica no sistema de build.

## [0.2.0] - 2025-01-XX

### Adicionado

- **Performance:** Otimização significativa na velocidade do Web Extractor (10x mais rápido).
- **JWT Decoder:**
  - Decodificação com explicações visuais (tooltips) para os campos padrão.
  - Simulador para edição e teste de tokens (assinaturas inválidas).

### Modificado

- **Web Extractor:** Adoção de processamento híbrido para maior precisão e velocidade.
- **Gerador de PDF:** Migração para sistema de streaming para melhor performance em documentos
  grandes.

### Segurança

- Implementação de limites de tamanho para processamento de tokens.
- Sanitização rigorosa de inputs.

## [0.1.0] - 2024-XX-XX

### Adicionado

- Lançamento inicial da plataforma.
- Editor Markdown com exportação para PDF profissional.
- Web Extractor (Conversor de HTML para Markdown).
- Formatadores de código (JSON, SQL, HTML, CSS, JS).
- Decodificador JWT básico.
- Ferramenta de criação de imagens de código (Code Snapshot).
