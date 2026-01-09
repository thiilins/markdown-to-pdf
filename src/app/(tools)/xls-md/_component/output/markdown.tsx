import { CodeFormatterEditor } from '@/app/(tools)/_components/code-formatter-editor'
import { TabsContent } from '@/components/ui/tabs'
import { FileText } from 'lucide-react'

export const ExcelMdMarkdown = ({ result }: { result: ConversionResult | null }) => {
  return (
    <TabsContent
      value='markdown'
      className='m-0 mt-0 flex-1 overflow-hidden data-[state=inactive]:hidden'>
      <div className='flex h-full flex-col'>
        <div className='flex-1 overflow-hidden'>
          {/* Usando o editor em modo ReadOnly para highlight de sintaxe */}
          <CodeFormatterEditor
            value={result?.markdown || ''}
            language='plaintext'
            onChange={() => {}}
          />
        </div>

        <div className='bg-muted/10 border-t p-4'>
          <div className='flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3'>
            <FileText className='h-5 w-5 shrink-0 text-blue-500' />
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Dica</p>
              <p className='text-muted-foreground text-xs leading-relaxed'>
                Você pode alterar as opções no menu lateral para alternar entre modo "Compacto"
                (menos espaços) ou "Prettified" (alinhado visualmente).
              </p>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
