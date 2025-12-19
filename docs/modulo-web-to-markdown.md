# 📋 Desenvolvimento: Módulo Web to Markdown

## 🎯 Conceito

Novo módulo independente focado em **converter sites/blogs para Markdown**, separado de `md-to-pdf`
e `gist-explorer`.

**Nome sugerido**: `web-to-markdown` ou `content-importer` ou `web-scraper`

---

## 📁 Estrutura de Arquivos Necessária

### 1. **Rotas e Layout**

```
src/app/(tools)/web-to-markdown/
├── page.tsx                    # Página principal do módulo
├── layout.tsx                  # Layout com breadcrumbs
└── _components/
    ├── view.tsx                # Componente principal de visualização
    ├── url-input.tsx           # Campo de input para URL
    ├── preview-panel.tsx        # Preview do markdown gerado
    ├── result-actions.tsx       # Botões: Copiar, Exportar, Abrir no MD-to-PDF
    └── loading-state.tsx        # Estado de carregamento
```

### 2. **Backend (Server Actions / Route Handlers)**

```
src/app/actions/
└── scrape-html.ts              # Server Action: fetch + Readability + Turndown

OU

src/app/api/scrape-html/
└── route.ts                    # Route Handler (se preferir)
```

### 3. **Services**

```
src/services/
└── webToMarkdownService.ts     # Service para chamar a Server Action
```

### 4. **Utils/Helpers**

```
src/shared/utils/
├── url-validation.ts           # Validação de URL (reutilizar lógica existente)
└── html-to-markdown.ts         # Utilitários de conversão (se necessário)
```

### 5. **Tipos/Interfaces**

```
src/shared/types/
└── web-to-markdown.ts          # Tipos TypeScript para o módulo
```

### 6. **Constantes**

```
src/shared/constants/
├── modules.ts                  # Adicionar novo módulo na lista
└── breadcrumbs.ts              # Adicionar breadcrumbs do novo módulo
```

---

## 🔧 Funcionalidades a Desenvolver

### **Frontend (UI/UX)**

1. **Tela Principal**
   - Campo de input para URL
   - Botão "Converter"
   - Estado de loading (com feedback visual)
   - Mensagens de erro/sucesso

2. **Preview do Resultado**
   - Exibir markdown gerado em preview
   - Syntax highlighting (reutilizar componente existente)
   - Scroll para conteúdo longo

3. **Ações do Resultado**
   - **Copiar Markdown** → Copia para clipboard
   - **Exportar como .md** → Download do arquivo
   - **Abrir no MD-to-PDF** → Navega para `/md-to-pdf` com conteúdo pré-carregado
   - **Limpar** → Reseta o estado

4. **Validação de URL**
   - Feedback visual (URL válida/inválida)
   - Mensagens de erro claras
   - Bloqueio de IPs privados (SSRF prevention)

5. **Histórico (Opcional)**
   - Lista de URLs convertidas recentemente
   - Persistência no localStorage/IndexedDB

### **Backend (Server-side)**

1. **Server Action `scrapeHtmlToMarkdown`**
   - Recebe URL como parâmetro
   - Valida URL (segurança)
   - Faz `fetch` do HTML
   - Aplica Readability para extrair conteúdo
   - Converte HTML → Markdown com Turndown
   - Retorna `{ success, markdown, title, excerpt, error }`

2. **Validação de Segurança**
   - Bloqueio de IPs privados
   - Bloqueio de localhost
   - Timeout de requisição (10-15s)
   - Validação de tamanho do HTML (limite de 5-10MB)
   - User-Agent apropriado

3. **Tratamento de Erros**
   - Erro de rede
   - Timeout
   - Readability não encontrou conteúdo
   - HTML inválido
   - Site bloqueou acesso

4. **Otimizações**
   - Cache de conversões (opcional)
   - Rate limiting (opcional)

### **Integração com Outros Módulos**

1. **Integração com MD-to-PDF**
   - Passar markdown via URL params ou state
   - Ou usar contexto compartilhado
   - Botão "Abrir no MD-to-PDF" deve pré-carregar o editor

2. **Navegação**
   - Adicionar no menu de módulos (`modules.ts`)
   - Breadcrumbs funcionais
   - Link de volta para home

---

## 🎨 UI/UX Detalhado

### **Layout da Tela**

```
┌─────────────────────────────────────────┐
│  [Breadcrumbs: Home > Web to Markdown]  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Cole a URL do site/blog:        │   │
│  │  [https://example.com/article]   │   │
│  │  [Converter]                     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Loading...] ou                        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Preview do Markdown:            │   │
│  │  ┌───────────────────────────┐   │   │
│  │  │ # Título do Artigo        │   │   │
│  │  │                           │   │   │
│  │  │ Conteúdo convertido...    │   │   │
│  │  └───────────────────────────┘   │   │
│  │                                   │   │
│  │  [Copiar] [Exportar] [Abrir no   │   │
│  │   MD-to-PDF]                      │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### **Estados da Aplicação**

1. **Estado Inicial**
   - Input vazio
   - Botão desabilitado
   - Sem preview

2. **Estado de Loading**
   - Input desabilitado
   - Spinner/loading
   - Mensagem: "Convertendo HTML para Markdown..."

3. **Estado de Sucesso**
   - Preview do markdown
   - Botões de ação habilitados
   - Mensagem de sucesso (toast)

4. **Estado de Erro**
   - Mensagem de erro clara
   - Input habilitado para tentar novamente
   - Sugestões de correção (se aplicável)

---

## 🔐 Segurança

### **Validações Necessárias**

1. **URL Validation**
   - ✅ Apenas HTTP/HTTPS
   - ✅ Bloqueio de IPs diretos
   - ✅ Bloqueio de localhost/127.0.0.1
   - ✅ Bloqueio de IPs privados (192.168.x.x, 10.x.x.x, etc.)
   - ⚠️ Whitelist de domínios? (opcional - mais restritivo)
   - ⚠️ Blacklist de domínios? (opcional - bloquear sites maliciosos)

2. **Rate Limiting** (Opcional)
   - Limitar requisições por IP/usuário
   - Prevenir abuso

3. **Tamanho Máximo**
   - Limitar HTML a 5-10MB
   - Limitar markdown resultante

4. **Timeout**
   - Timeout de 10-15s para fetch
   - Evitar requisições infinitas

---

## 📦 Dependências Necessárias

### **Já Instaladas** ✅

- `next` - Framework
- `react` - UI
- `typescript` - Tipagem

### **A Instalar** 📥

- `turndown` - HTML → Markdown
- `@mozilla/readability` - Extração de conteúdo
- `jsdom` - Parsing HTML server-side
- `@types/turndown` - Tipos TypeScript
- `@types/jsdom` - Tipos TypeScript

---

## 🔄 Fluxo Completo

```
1. Usuário acessa /web-to-markdown
   ↓
2. Usuário cola URL e clica "Converter"
   ↓
3. Frontend valida URL (client-side)
   ↓
4. Frontend chama Server Action
   ↓
5. Server Action:
   - Valida URL (server-side)
   - Faz fetch do HTML
   - Aplica Readability
   - Converte com Turndown
   - Retorna markdown
   ↓
6. Frontend recebe resultado
   ↓
7. Exibe preview do markdown
   ↓
8. Usuário pode:
   - Copiar markdown
   - Exportar como .md
   - Abrir no MD-to-PDF
```

---

## 🎯 Integração com Sistema Existente

### **1. Adicionar ao Menu**

**Arquivo**: `src/shared/constants/modules.ts`

```typescript
// Adicionar novo item no array Modules
{
  label: 'Web to Markdown',
  href: '/web-to-markdown',
  icon: Globe, // ou outro ícone apropriado
  description: 'Converta sites e blogs para Markdown',
}
```

### **2. Breadcrumbs**

**Arquivo**: `src/shared/constants/breadcrumbs.ts`

```typescript
export const webToMarkdownBreadcrumbs: Breadcrumbs[] = [
  homeBreadcrumb,
  {
    label: 'Web to Markdown',
    href: '/web-to-markdown',
    order: 2,
  },
]
```

### **3. Compartilhar Markdown com MD-to-PDF**

**Opções:**

**Opção A: URL Params**

- `/md-to-pdf?content=<base64-encoded-markdown>`
- Decodifica no `md-to-pdf` e carrega no editor

**Opção B: Contexto Compartilhado**

- Criar contexto global para markdown
- Ambos os módulos acessam

**Opção C: LocalStorage**

- Salvar markdown no localStorage
- `md-to-pdf` verifica na inicialização

**Recomendação**: Opção A (URL params) - mais simples e direto

---

## 📊 Estimativa de Esforço

### **Backend**

- Server Action: **2-3 horas**
- Validação de segurança: **1-2 horas**
- Tratamento de erros: **1 hora**
- **Total Backend: ~4-6 horas**

### **Frontend**

- Estrutura do módulo: **1 hora**
- UI principal: **3-4 horas**
- Preview e ações: **2-3 horas**
- Integração com sistema: **1-2 horas**
- **Total Frontend: ~7-10 horas**

### **Testes e Ajustes**

- Testes com sites diversos: **2-3 horas**
- Ajustes de UX: **1-2 horas**
- **Total Testes: ~3-5 horas**

### **Total Geral: ~14-21 horas** (2-3 dias de trabalho)

---

## ✅ Checklist de Implementação

### **Fase 1: Setup**

- [ ] Criar estrutura de pastas
- [ ] Instalar dependências
- [ ] Criar tipos TypeScript
- [ ] Adicionar ao menu de módulos
- [ ] Criar breadcrumbs

### **Fase 2: Backend**

- [ ] Criar Server Action
- [ ] Implementar validação de URL
- [ ] Integrar Readability
- [ ] Integrar Turndown
- [ ] Tratamento de erros
- [ ] Testes com sites diversos

### **Fase 3: Frontend**

- [ ] Criar página principal
- [ ] Criar componente de input
- [ ] Criar componente de preview
- [ ] Criar ações (copiar, exportar, etc.)
- [ ] Estados de loading/erro
- [ ] Integração com MD-to-PDF

### **Fase 4: Polimento**

- [ ] Ajustes de UX
- [ ] Mensagens de erro claras
- [ ] Feedback visual adequado
- [ ] Testes finais
- [ ] Documentação

---

## 🎨 Nome do Módulo

**Sugestões:**

- `web-to-markdown` ✅ (claro e direto)
- `content-importer` (mais genérico)
- `web-scraper` (pode ter conotação negativa)
- `html-converter` (focado na técnica)

**Recomendação**: `web-to-markdown` - mais descritivo e claro para o usuário.
