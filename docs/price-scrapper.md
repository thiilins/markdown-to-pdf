Sim, a mudança é perfeitamente possível e, para um projeto de nível "Pro", o ideal é criar um **novo
módulo ou uma lógica especializada** em vez de forçar o `Readability` a ler um e-commerce.

O motivo técnico é que o `Readability` foi projetado para encontrar blocos de texto longo (artigos).
Em um site como o Carrefour, ele pode ignorar o preço por ser um elemento curto ou "lixo visual".
Para capturar preços e dados de produtos de forma estável sem usar Puppeteer, a técnica correta é
extrair o **JSON-LD (Dados Estruturados)**.

### Por que usar JSON-LD?

Grandes e-commerces (Carrefour, Amazon, Magalu) inserem um bloco de script do tipo
`application/ld+json` no HTML para que o Google entenda o preço, a moeda e a disponibilidade do
produto. Isso é muito mais estável do que tentar adivinhar a classe CSS do preço, que muda
constantemente.

### Nova Server Action sugerida: `scrape-product.ts`

Abaixo, apresento o código completo para uma nova Action focada em produtos, integrada à sua
estrutura:

```typescript
'use server'

import { isValidWebUrl } from '@/shared/utils/url-validation-web'
import { JSDOM } from 'jsdom'

interface ProductData {
  success: boolean
  name?: string
  price?: string
  currency?: string
  image?: string
  description?: string
  error?: string
  markdown?: string
}

/**
 * Server Action especializada em capturar dados de produtos (E-commerce)
 * Extrai dados via Schema.org (JSON-LD) para máxima estabilidade
 */
export async function scrapeProductToMarkdown(url: string): Promise<ProductData> {
  try {
    const validation = isValidWebUrl(url)
    if (!validation.valid) {
      return { success: false, error: 'URL inválida' }
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return { success: false, error: `Erro ao acessar produto: ${response.status}` }
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const doc = dom.window.document

    // --- ESTRATÉGIA PRO: EXTRAÇÃO DE JSON-LD ---
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]')
    let productInfo: any = null

    scripts.forEach((script) => {
      try {
        const json = JSON.parse(script.textContent || '')
        // O JSON-LD pode ser o objeto direto ou uma lista (@graph)
        const items = Array.isArray(json) ? json : json['@graph'] || [json]

        const found = items.find(
          (item: any) =>
            item['@type'] === 'Product' || item['@type'] === 'http://schema.org/Product',
        )

        if (found) productInfo = found
      } catch (e) {
        /* ignore parse errors */
      }
    })

    if (!productInfo) {
      return { success: false, error: 'Não foi possível encontrar dados estruturados do produto.' }
    }

    // Mapeamento dos campos do Schema.org
    const name = productInfo.name || doc.title
    const description = productInfo.description || ''
    const image = Array.isArray(productInfo.image) ? productInfo.image[0] : productInfo.image

    // O preço geralmente está dentro de 'offers'
    const offers = Array.isArray(productInfo.offers) ? productInfo.offers[0] : productInfo.offers
    const price = offers?.price || offers?.lowPrice || 'Preço não disponível'
    const currency = offers?.priceCurrency || 'BRL'

    // Gera um Markdown elegante no estilo "Ficha de Produto"
    const markdown = `
# ${name}

![Imagem do Produto](${image})

### 💰 Detalhes da Oferta
- **Preço:** ${currency} ${price}
- **Disponibilidade:** ${offers?.availability?.includes('InStock') ? 'Em Estoque ✅' : 'Consultar Disponibilidade'}

### 📝 Descrição
${description}

---
*Fonte: [Acessar site original](${url})*
    `.trim()

    return {
      success: true,
      name,
      price: price.toString(),
      currency,
      image,
      description,
      markdown,
    }
  } catch (error) {
    console.error('Erro no Scraper de Produto:', error)
    return { success: false, error: 'Erro ao processar dados do produto.' }
  }
}
```

### Roadmap de Implementação para Preços:

1. **Detecção de Tipo:** No seu frontend (`web-to-markdown`), você pode verificar se a URL contém
   palavras como `/p` (comum no Carrefour/VTEX) ou se o primeiro scraper falhou em encontrar
   conteúdo longo, e então disparar o `scrapeProductToMarkdown`.
2. **Fallback de API:** Se o preço não estiver no HTML estático (carregado via JS dinâmico), o seu
   servidor (Action) pode monitorar as requisições de rede para encontrar a API interna do Carrefour
   (geralmente uma URL como `carrefour.com.br/api/catalog_system/...`). Como você não usa Puppeteer,
   você precisaria mapear essas URLs manualmente para cada grande loja.
3. **Conversão de Moeda:** No futuro, você pode adaptar o módulo para capturar o valor bruto e
   formatar usando o `Intl.NumberFormat` do JavaScript para exibir o preço bonitinho no PDF.

**Dica "Pro":** O Carrefour e outros sites usam a plataforma VTEX. Quase todos os sites VTEX seguem
exatamente esse padrão de JSON-LD. Ao implementar isso, você ganha suporte automático a centenas de
outras lojas brasileiras.
