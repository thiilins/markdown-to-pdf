# 🎯 Roadmap de Features - Markdown to PDF Pro

> **Priorização focada em valor para o usuário e showcase técnico para portfolio**
>
> Documento criado: 22/12/2025

## 📋 Filosofia do Roadmap

Este roadmap foca em duas dimensões:
1. **Valor Real para Usuários** - Features que resolvem problemas concretos
2. **Showcase Técnico** - Implementações que demonstram expertise avançado

**Não consideramos**: Aspectos comerciais, SaaS, monetização, APIs públicas

### Legenda de Classificação

- **🚀 PRIORIDADE MÁXIMA** - Alto valor + showcase técnico impressionante
- **✅ IMPLEMENTAR** - Valor claro, esforço justificável
- **🤔 AVALIAR** - Boa ideia, mas precisa validação prática
- **❌ SKIP** - Complexidade não justifica o benefício atual

---

## 🎯 Bloco 1: Performance & Estabilidade

> **Objetivo**: Garantir que a aplicação funcione perfeitamente mesmo com documentos grandes (50+ páginas)

### 🚀 1.1 React 19 useTransition para Preview

**Valor para o Usuário:**
- Editor permanece responsivo mesmo digitando em docs grandes
- Sem lag ou travamentos durante edição
- Experiência fluida similar a editores nativos (VS Code)

**Showcase Técnico:**
- Demonstra conhecimento avançado de React 19
- Uso correto de concurrent features
- Performance optimization real-world

**Decisão**: **PRIORIDADE MÁXIMA** 🚀

**Esforço**: Baixo (já tem React 19, mudança cirúrgica no `mdToPdfContext`)

**Implementação**:
- Wrap `setMarkdown` com `startTransition`
- Adicionar indicador de "Atualizando preview..." durante transição
- Zero breaking changes

---

### 🚀 1.2 Scroll Sync Bidirecional

**Valor para o Usuário:**
- Click no preview posiciona o editor automaticamente
- Navegação intuitiva entre markdown e resultado
- Essencial para revisão de documentos longos

**Showcase Técnico:**
- Algoritmo de mapeamento posição → linha de código
- Cálculo preciso considerando elementos de altura variável
- UX polida similar a IDEs profissionais

**Decisão**: **PRIORIDADE MÁXIMA** 🚀

**Esforço**: Médio (já tem base unidirecional, precisa inverter lógica)

**Implementação**:
- Detectar click no preview → calcular % de posição
- Mapear para linha correspondente no Monaco
- Adicionar toggle para ativar/desativar

---

### ✅ 1.3 Conversão Automática de Imagens para Base64

**Valor para o Usuário:**
- PDFs sempre funcionam, mesmo com imagens externas
- Sem dependência de URLs online
- Documentos completamente portáveis

**Showcase Técnico:**
- Parsing HTML + conversão assíncrona
- Tratamento de erros (imagens grandes, timeout)
- Compressão automática quando necessário

**Decisão**: **IMPLEMENTAR** ✅

**Esforço**: Médio (requer tratamento robusto de edge cases)

**Implementação**:
- Scan HTML antes de `generatePDF()`
- Converter `<img src="https://...">` → Data URIs
- Limite de 5MB por imagem, warning se exceder

---

### ❌ 1.4 Shadow DOM/Iframe para Isolamento

**Por que SKIP:**
- Problema inexistente: `PrintStyle` já isola CSS perfeitamente
- Quebraria `react-to-print` (dependência de DOM real)
- Over-engineering sem benefício prático

**Decisão**: **NÃO IMPLEMENTAR** ❌

---

### 🤔 1.5 Virtualização do Preview (Windowing)

**Valor para o Usuário:**
- Preview instantâneo mesmo com 100+ páginas
- Economia de memória do browser

**Showcase Técnico:**
- Implementação de windowing complexo
- Integração com sistema de páginas existente

**Por que AVALIAR:**
- Complexidade muito alta (reescrever preview completo)
- Maioria dos docs tem <20 páginas
- Alternativa simples: renderizar só 30 primeiras + botão "Carregar todas"

**Decisão**: **AVALIAR APÓS USAR A FERRAMENTA POR 1 MÊS** 🤔

**Esforço**: Muito Alto (rewrite completo)

---

## 🎨 Bloco 2: UX Moderna

> **Objetivo**: Tornar a ferramenta tão prazerosa de usar quanto VS Code ou Notion

### 🚀 2.1 Command Palette (Ctrl+K)

**Valor para o Usuário:**
- Produtividade 3x maior (sem sair do teclado)
- Descoberta de features (usuário explora comandos)
- Workflow moderno esperado por devs

**Showcase Técnico:**
- Integração elegante com `cmdk`
- Sistema de comandos extensível
- Busca fuzzy + atalhos de teclado

**Decisão**: **PRIORIDADE MÁXIMA** 🚀

**Esforço**: Médio (biblioteca pronta, precisa integração)

**Funcionalidades**:
- Inserir elementos (tabela, código, imagem, quebra de página)
- Trocar tema rapidamente
- Buscar docs salvos no IndexedDB
- Abrir configurações

---

### ✅ 2.2 Mobile: Melhorar Touch + Opção de Tabs

**Valor para o Usuário:**
- Ferramenta utilizável em tablet/celular
- ResizablePanels touch-friendly

**Showcase Técnico:**
- Responsive design avançado
- Adaptação inteligente de UI (panels vs tabs)

**Decisão**: **IMPLEMENTAR VERSÃO HÍBRIDA** ✅

**Esforço**: Médio

**Implementação**:
- Fase 1: Melhorar touch handling dos panels (gestos, áreas maiores)
- Fase 2: Se >20% usuários mobile, adicionar toggle Panels/Tabs

---

## 🧠 Bloco 3: Features Técnicas Impressionantes

> **Objetivo**: Diferenciar completamente de ferramentas simples + impressionar no portfolio

### 🚀 3.1 Mermaid.js (Diagramas)

**Valor para o Usuário:**
- Fluxogramas, diagramas de sequência, ERDs no PDF
- Ideal para documentação técnica
- Sintaxe simples, resultado profissional

**Showcase Técnico:**
- ⭐ **DIFERENCIAL TÉCNICO MÁXIMO**
- Renderização server-side (SVG → PNG de alta resolução)
- Integração complexa: cliente (preview) + servidor (PDF)
- Demonstra full-stack competence

**Decisão**: **PRIORIDADE MÁXIMA** 🚀

**Esforço**: Alto (mas VALE MUITO A PENA)

**Implementação**:
- Preview: `mermaid` renderiza no cliente
- PDF: Server Action converte SVG → PNG antes do Puppeteer
- Suporte a temas (dark/light)

---

### 🚀 3.2 KaTeX (LaTeX/Matemática)

**Valor para o Usuário:**
- Fórmulas matemáticas profissionais
- Essencial para acadêmicos, cientistas, engenheiros
- Notação universalmente reconhecida

**Showcase Técnico:**
- Integração simples mas impactante
- Plugins do ecossistema Markdown (`remark-math`)
- CSS renderiza nativamente no PDF

**Decisão**: **PRIORIDADE MÁXIMA** 🚀

**Esforço**: Baixo (plugins prontos, 1 dia de trabalho)

**Implementação**:
- `remark-math` + `rehype-katex`
- Carregar CSS do KaTeX
- Funciona automaticamente no PDF

---

### ✅ 3.3 YAML Frontmatter + Variáveis Dinâmicas

**Valor para o Usuário:**
- Metadata profissional (título, autor, data)
- Variáveis substituídas automaticamente no texto e header/footer
- Padrão da indústria (Jekyll, Hugo, Obsidian)

**Showcase Técnico:**
- Parser YAML (`gray-matter`)
- Sistema de template variables
- UI amigável para não-técnicos

**Decisão**: **IMPLEMENTAR** ✅

**Esforço**: Médio

**Implementação**:
- Fase 1: Parser + substituição básica ({{titulo}}, {{autor}})
- Fase 2: UI visual no settings modal
- Fase 3: Integração com header/footer

---

### ✅ 3.4 PDF Bookmarks (Navegação Nativa)

**Valor para o Usuário:**
- Sidebar de navegação no Adobe/Chrome
- PDFs profissionais de verdade
- Essencial para docs longos

**Showcase Técnico:**
- Integração backend (depende da API)
- Mapeamento automático H1-H6 → bookmarks
- Feature invisível mas impactante

**Decisão**: **IMPLEMENTAR SE API SUPORTAR** ✅

**Esforço**: Baixo-Médio (só backend)

---

## 🎨 Bloco 4: Templates & Polimento

> **Objetivo**: Facilitar onboarding + mostrar versatilidade da ferramenta

### ✅ 4.1 Templates de Markdown Pré-prontos

**Valor para o Usuário:**
- Começar rapidamente (currículo, artigo, relatório, tese)
- Aprende markdown vendo exemplos
- Inspiração de estrutura

**Showcase Técnico:**
- Design de templates bem pensados
- Sistema de gallery + preview
- Export/Import de templates customizados

**Decisão**: **IMPLEMENTAR** ✅

**Esforço**: Médio (criação artesanal de 5-7 templates)

**Templates Sugeridos**:
1. Currículo profissional
2. Artigo técnico/blog post
3. Documentação de projeto
4. Relatório executivo
5. Tese/dissertação acadêmica
6. Ata de reunião
7. Proposta de projeto

---

### ✅ 4.2 Export/Import de Projetos (JSON)

**Valor para o Usuário:**
- Backup local de todos documentos
- Compartilhar projeto com colega (arquivo único)
- Migrar entre dispositivos

**Showcase Técnico:**
- Serialização completa do estado
- Versionamento do formato
- Import com validação e migração

**Decisão**: **IMPLEMENTAR** ✅

**Esforço**: Baixo

---

### 🤔 4.3 Sistema de Pastas (IndexedDB)

**Valor para o Usuário:**
- Organização de múltiplos documentos
- Estrutura hierárquica

**Por que AVALIAR:**
- Esforço alto (reestruturar IndexedDB)
- Alternativa simples: tags + busca
- Melhor esperar ter usuários primeiro

**Decisão**: **AVALIAR APÓS TER 10+ DOCS PESSOALMENTE** 🤔

**Esforço**: Alto

---

## ❌ Bloco 5: Features Descartadas

> **Decisão**: Não agregar valor suficiente ou complexidade injustificável para projeto não-comercial

### ❌ Cloud Sync + Backend Completo

**Por que não**:
- Complexidade massiva (auth, DB, API, deploy, custos)
- Não é o foco (Markdown → PDF)
- Alternativa: export/import resolve 90% do caso de uso

---

### ❌ PWA com Service Workers

**Por que não**:
- App já funciona offline (IndexedDB)
- Benefício marginal
- Service workers são complexos de manter

---

### ❌ IA Writing Assistant

**Por que não**:
- Custo operacional (API keys caras)
- Não é projeto comercial
- Escopo muito diferente (assistente vs conversor)

---

### ❌ API Pública para Terceiros

**Por que não**:
- Prematura sem base de usuários
- Manutenção de docs, breaking changes, etc.

---

## 🗺️ Roadmap Final Priorizado

### 🔥 Sprint 1 (Fundação) - ESSENCIAL

**Foco**: Performance rock-solid

1. useTransition no preview
2. Scroll sync bidirecional  
3. Conversão de imagens para base64

**Resultado**: Editor profissional sem lag

---

### 🔥 Sprint 2 (UX Moderna) - ALTO IMPACTO

**Foco**: Produtividade e polish

1. Command Palette (Ctrl+K)
2. Mobile touch improvements
3. Ajustes finos de UI

**Resultado**: Ferramenta prazerosa de usar

---

### 🔥 Sprint 3 (Showcase Técnico) - PORTFOLIO KILLER

**Foco**: Features que impressionam

1. **Mermaid.js** (diagramas) ⭐⭐⭐
2. **KaTeX** (matemática) ⭐⭐
3. **YAML Frontmatter**
4. **PDF Bookmarks** (se API suportar)

**Resultado**: Diferencial técnico claro, portfolio destaque

---

### ✨ Sprint 4 (Polimento Final) - USER DELIGHT

**Foco**: Facilitar uso + showcase de design

1. 5-7 templates profissionais
2. Export/Import de projetos
3. Documentação de features
4. Vídeo demo para portfolio

**Resultado**: Projeto completo e apresentável

---

## 📊 Decisão Final

**Implementar Definitivamente** (12 features):
1. ✅ useTransition
2. ✅ Scroll sync bidirecional
3. ✅ Conversão imagens base64
4. ✅ Command Palette
5. ✅ Mobile touch
6. ✅ Mermaid.js
7. ✅ KaTeX
8. ✅ YAML Frontmatter
9. ✅ PDF Bookmarks
10. ✅ Templates pré-prontos
11. ✅ Export/Import JSON
12. ✅ Documentação + demo

**Avaliar Depois** (2 features):
1. 🤔 Virtualização do preview
2. 🤔 Sistema de pastas

**Não Implementar** (4 features):
1. ❌ Shadow DOM/Iframe
2. ❌ Cloud Sync
3. ❌ PWA
4. ❌ IA Assistant

---

## 🎯 Princípios do Roadmap

1. **Valor Real**: Cada feature resolve problema concreto
2. **Showcase**: Priorizar features que impressionam tecnicamente
3. **Simplicidade**: Evitar complexidade desnecessária
4. **Portfolio**: Foco em demonstrar expertise full-stack
5. **Uso Pessoal**: Fazer algo que VOCÊ usaria diariamente

---

## 💡 Próximos Passos

1. **Começar Sprint 1 amanhã** (performance é base de tudo)
2. **Usar a ferramenta pessoalmente** (dogfooding para validar UX)
3. **Documentar processo** (blog posts para portfolio)
4. **Vídeo demo** após Sprint 4 (LinkedIn, GitHub README)
