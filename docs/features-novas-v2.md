# **🚀 Master Roadmap: Markdown to PDF Pro (Versão Expandida & SaaS Ready)**

Este documento detalha a evolução técnica e estratégica da plataforma, consolidando análises de
performance, UX avançada e arquitetura de negócios.

## **1\. Fundação Técnica e Performance (Estabilidade Enterprise)**

_O objetivo é garantir que a aplicação não "engasgue" com documentos de centenas de páginas._

### **A. Pipeline de Renderização com React 19**

- **Priorização com useTransition:** Em documentos massivos, a atualização do preview causa lag no
  editor. Marcaremos a atualização do preview como "baixa prioridade".
  - **Resultado:** O Monaco Editor permanece a 60fps, enquanto o preview é processado em background.
- **Isolamento via Shadow DOM ou Iframe:**
  - **Problema:** O CSS do Tailwind 4 da aplicação conflita com os estilos que o usuário quer no
    PDF.
  - **Solução:** Encapsular o preview num Shadow DOM. Isso isola completamente os estilos,
    permitindo que o usuário use qualquer CSS customizado sem "quebrar" a interface da aplicação.

### **B. Resiliência de Assets**

- **Conversão Base64 no Cliente:** Antes de disparar a Server Action para o Puppeteer, um script
  varre o HTML e converte todas as \<img\> para Data URIs.
  - **Porquê:** Evita erros de timeout na API de PDF quando o servidor não consegue aceder a imagens
    externas lentas.
- **Virtualização do Preview:** Implementar _windowing_ para renderizar apenas as páginas visíveis.
  Carregar 100 páginas no DOM simultaneamente destrói a performance do browser.

## **2\. Experiência de Edição (UX de Elite)**

_Recursos que transformam a percepção do produto de "utilitário" para "ferramenta de trabalho"._

### **A. Scroll Sync (Sincronização de Precisão)**

- **A Solução:** Calcular a percentagem de scroll do Monaco (scrollTop / scrollHeight) e aplicar
  proporcionalmente ao container de preview.
- **Desafio:** Lidar com elementos de alturas diferentes (uma linha de código pode gerar 3 linhas de
  preview).

### **B. Mobile UX: Sistema de Abas**

- **Adaptação:** Em dispositivos móveis, os ResizablePanels são removidos.
- **Implementação:** Usar um sistema de abas fixas no fundo: **\[Escrever\] | \[Visualizar\]**.
  Garante que 50% dos utilizadores (mobile) consigam usar a ferramenta.

### **C. Command Palette (Ctrl \+ K)**

- Implementação via cmdk para acesso rápido a:
  - Inserção de tabelas, snippets de código e quebras de página.
  - Troca de temas e configurações de página (A4, Letter).
  - Busca de documentos salvos no IndexedDB.

## **3\. Automação e Inteligência de Documentos**

_Foco no mercado técnico e acadêmico._

### **A. Smart Variables (YAML Frontmatter)**

- **O que é:** Permitir metadados no topo do arquivo. \--- titulo: Relatório Técnico autor:
  Engenharia data: 2024-03-20 \---

- **Funcionalidade:** O sistema faz um _string replace_ automático dessas variáveis no corpo do
  texto e nos Cabeçalhos/Rodapés.

### **B. Diagramas e Matemática**

- **Mermaid.js:** Integração para renderizar fluxogramas e gráficos. No PDF, o SVG deve ser
  convertido em PNG de alta resolução para evitar distorções.
- **LaTeX (KaTeX):** Suporte total a fórmulas matemáticas, essencial para o nicho académico e
  científico.

### **C. Navegação Nativa (PDF Bookmarks)**

- **Diferencial:** Converter os H1, H2 e H3 em marcadores nativos do PDF. Isso permite que o
  utilizador navegue pelo documento através da barra lateral do leitor de PDF (Adobe, Chrome).

## **4\. Estratégia SaaS e Expansão de Negócio**

_Como transformar o editor numa fonte de receita recorrente._

### **A. Arquitetura de Projetos (Cloud Sync)**

- **Persistência:** Migrar do IndexedDB puro para um modelo híbrido com backend
  (PostgreSQL/Supabase).
- **Sistema de Pastas:** Organização hierárquica de documentos, permitindo múltiplos projetos por
  utilizador.
- **PWA (Modo Offline):** O utilizador deve poder escrever no avião; a sincronização ocorre quando
  volta a ter rede.

### **B. Módulos de Especialidade (Templates)**

- **Resume Builder:** Interface simplificada para criação de currículos com exportação ATS-friendly.
- **Web-to-Markdown (Premium):** Um extractor que limpa o lixo visual de qualquer URL (blogs,
  documentações) e gera um Markdown limpo pronto para virar PDF.
- **Relatórios Dinâmicos:** Templates que aceitam injeção de dados externos (JSON) para gerar
  relatórios automatizados.

### **C. Modelo de Receita (Tiering)**

- **Freemium:** Exportação local básica.
- **Pro ($):** Geração via Server Action (alta fidelidade), templates profissionais, Mermaid.js, IA
  e armazenamento em nuvem.
- **Enterprise ($$$):** API para geração de PDFs em massa, Custom Branding (sem logo da app) e
  fontes corporativas exclusivas.

## **📈 Execution Plan (Cronograma de Prioridades)**

1. **Fase 1: Estabilização (Quick Wins)**
   - Implementar useTransition e Scroll Sync.
   - Adicionar o sistema de abas para Mobile.
   - Suporte a Mermaid.js e KaTeX.
2. **Fase 2: Valor Agregado (Professional Growth)**
   - YAML Frontmatter e Variáveis Dinâmicas.
   - Editor de Cabeçalho/Rodapé profissional.
   - Bookmarks nativos no PDF.
3. **Fase 3: SaaS & Cloud (Infraestrutura)**
   - Implementação de autenticação e banco de dados na nuvem.
   - Sistema de pastas e gerenciamento de projetos.
   - Modo offline (PWA).
4. **Fase 4: Ecossistema (Expansion)**
   - Assistente de Escrita com IA.
   - API pública para terceiros.
   - Marketplace de Templates.
