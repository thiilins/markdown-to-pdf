Sim, é perfeitamente possível. O que você está descrevendo é tecnicamente um fluxo de
**Readability + Scraper**. Ferramentas que "removem paywalls" geralmente funcionam extraindo o
conteúdo principal antes que o script de bloqueio seja executado ou buscando a versão do artigo que
os sites deixam aberta para indexadores (como o Googlebot).

Para implementar isso no seu projeto, você precisará de duas bibliotecas principais:

1. **`@mozilla/readability`**: Extrai o título e o corpo do texto, removendo menus, anúncios e
   overlays de paywall.
2. **`turndown`**: Converte o HTML limpo resultante em Markdown.

Como você já tem o **Puppeteer** no `package.json`, você pode usá-lo para carregar o site simulando
um robô de busca, o que ignora muitos paywalls simples.

Aqui está o plano e o código completo para essa nova funcionalidade:

### 1. Preparação

Você precisará adicionar estas dependências (ou similares):

```bash
npm install turndown @mozilla/readability jsdom
npm install --save-dev @types/turndown @types/mozilla-readability @types/jsdom

```

### 2. Implementação da Server Action

Crie um novo arquivo em `src/app/actions/scraper.ts`. Esta função fará o "trabalho sujo" no servidor
para evitar problemas de CORS e usar o Puppeteer.

```typescript
'use server'

import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import puppeteer from 'puppeteer'
import TurndownService from 'turndown'

/**
 * Server Action para extrair conteúdo de uma URL e converter para Markdown
 * Tenta contornar paywalls básicos usando User-Agent de bot e Readability
 */
export async function scrapeUrlToMarkdown(url: string) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Simula o Googlebot para tentar contornar paywalls simples
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    )

    // Navega até a URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Obtém o HTML completo da página
    const html = await page.content()
    await browser.close()

    // Usa JSDOM e Readability para extrair apenas o conteúdo relevante (sem anúncios/menus)
    const dom = new JSDOM(html, { url })
    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article) {
      throw new Error('Não foi possível extrair o conteúdo deste site.')
    }

    // Configura o Turndown para converter HTML em Markdown de forma limpa
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })

    // Remove elementos indesejados que o Readability possa ter deixado
    const markdown = turndownService.turndown(article.content)

    // Retorna o título e o conteúdo em Markdown
    return {
      success: true,
      title: article.title,
      markdown: `# ${article.title}\n\n${markdown}`,
      excerpt: article.excerpt,
    }
  } catch (error) {
    console.error('Erro no Scraper:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha ao processar a URL',
    }
  }
}
```

### 3. Integração no Frontend

Você pode criar um componente simples para capturar a URL. No seu `mdToPdfContext.tsx`, você
adicionaria uma função para atualizar o markdown com o resultado do scraper.

**Exemplo de uso no componente de View:**

```tsx
'use client'

import { scrapeUrlToMarkdown } from '@/app/actions/scraper'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Globe } from 'lucide-react'

export const ImportFromUrlComponent = () => {
  const { setMarkdown } = useMDToPdf()
  const [url, setUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    if (!url) return toast.error('Insira uma URL válida')

    setIsImporting(true)
    try {
      const result = await scrapeUrlToMarkdown(url)

      if (result.success && result.markdown) {
        await setMarkdown(result.markdown)
        toast.success('Conteúdo importado com sucesso!')
        setUrl('')
      } else {
        toast.error(result.error || 'Erro ao importar')
      }
    } catch (error) {
      toast.error('Erro inesperado na importação')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className='bg-muted/30 flex items-center gap-2 border-b p-4'>
      <Globe className='text-muted-foreground h-4 w-4' />
      <Input
        placeholder='Cole a URL de um blog ou notícia (ex: Medium, Dev.to...)'
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className='flex-1'
      />
      <Button onClick={handleImport} disabled={isImporting}>
        {isImporting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Importando...
          </>
        ) : (
          'Importar via URL'
        )}
      </Button>
    </div>
  )
}
```

### Por que isso funciona como um "Remove Paywall"?

1. **User-Agent Bot**: Muitos sites de notícias permitem que o Google leia o artigo completo para
   que ele apareça nas buscas, mas bloqueiam usuários comuns. Ao simular o Googlebot no Puppeteer,
   você frequentemente recebe o texto completo.
2. **Readability Engine**: O motor da Mozilla foca nas tags `<article>` e `p`. Frequentemente, o
   texto do paywall está no HTML mas escondido por uma camada visual (CSS). O Readability ignora o
   CSS e pega apenas os dados brutos.
3. **No JavaScript no Scraping**: Como você extrai o conteúdo e converte para Markdown, os scripts
   que geram o "bloqueio" de paywall no navegador do usuário final nunca chegam a ser executados.

Essa feature combina perfeitamente com o seu projeto, pois permite que o usuário transforme qualquer
artigo da web em um documento PDF limpo e bem formatado rapidamente.
