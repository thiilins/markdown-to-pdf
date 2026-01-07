# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto
adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2025-01-XX

### 🚀 Adicionado

#### Otimizações de Performance

- **Migração JSDOM → Cheerio** no Web Extractor
  - Redução de ~10x no tempo de processamento
  - Redução significativa no uso de memória
  - Melhor compatibilidade com ambientes serverless (Vercel)
- **Timeout reduzido** no scraper de 15s para 8.5s
  - Evita timeout na Vercel (limite de 10s no plano Hobby)
  - Melhor tratamento de erros de timeout

#### JWT Decoder - Melhorias

- **Tooltips explicativos** para claims padrão JWT
  - Descrições detalhadas ao passar o mouse sobre claims padrão (exp, iat, sub, iss, aud, etc.)
  - Formatação automática de timestamps Unix para datas legíveis
  - Badge "Padrão" com tooltip explicativo
- **Simulador de Modificação**
  - Nova aba "Simulador" para editar o payload do JWT
  - Geração automática do token a partir do payload editado
  - Útil para depuração de estruturas de dados
  - Avisos claros sobre assinatura inválida

#### Documentação

- **Consolidação de documentação técnica**
  - `OTIMIZACOES-E-FEATURES-FERRAMENTAS-EXISTENTES.md` - Todas as melhorias propostas
  - `NOVAS-FERRAMENTAS.md` - 11 novas ferramentas propostas
  - Documentação organizada e priorizada

### 🔧 Melhorado

- **Web Extractor (scrapper-html-v2.ts)**
  - Processamento inicial com Cheerio (muito mais leve)
  - JSDOM usado apenas quando necessário para Readability
  - Melhor tratamento de erros e validações
- **PDF Generation**
  - Server Action deprecated marcada com aviso
  - Sistema já usa API Route com streaming (otimizado)
  - Documentação sobre uso preferencial

### 📝 Documentado

- Análise técnica detalhada das otimizações
- Roadmap consolidado de features
- Priorização de melhorias e novas ferramentas

### 🔒 Segurança

- Validações de tamanho de token JWT (máximo 64KB)
- Sanitização adequada de inputs
- Tratamento seguro de erros

---

## [0.1.0] - 2024-XX-XX

### 🎉 Lançamento Inicial

- Editor Markdown para PDF profissional
- Web Extractor (HTML para Markdown)
- Formatadores de código (JSON, SQL, HTML, CSS, JavaScript)
- JWT Decoder básico
- Code Snapshot (código para imagem)
- E outras ferramentas utilitárias

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades
