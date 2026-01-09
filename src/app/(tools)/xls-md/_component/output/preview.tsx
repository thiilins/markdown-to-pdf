import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { getMarkdownComponents } from '@/shared/utils/markdown-components'
import { CheckCircle2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export const ExcelPreview = ({ result }: { result: ConversionResult | null }) => {
  return (
    <TabsContent value='preview' className='m-0 flex-1 overflow-hidden p-0'>
      <div className='h-full overflow-y-auto'>
        <div className='p-6'>
          <Card className='overflow-hidden'>
            <CardContent className='p-6'>
              <div className='prose prose-slate dark:prose-invert max-w-none'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={getMarkdownComponents()}>
                  {result?.markdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Info sobre headers */}
          <div className='bg-muted/30 mt-4 rounded-lg border p-4'>
            <div className='flex items-start gap-3'>
              <CheckCircle2 className='h-5 w-5 shrink-0 text-green-500' />
              <div className='flex-1 space-y-2'>
                <p className='text-sm font-medium'>Colunas detectadas</p>
                <div className='flex flex-wrap gap-2'>
                  {result?.headers.map((header, idx) => (
                    <Badge key={idx} variant='secondary' className='font-mono text-xs'>
                      {header}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
