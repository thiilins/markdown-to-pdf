import { CodeFormatterEditor } from '@/app/(tools)/_components/code-formatter-editor'
import { TabsContent } from '@/components/ui/tabs'

export function ExcelMdJsonInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <TabsContent value='json' className='m-0 flex-1 overflow-hidden p-0'>
      <div className='h-full'>
        <CodeFormatterEditor value={value} onChange={onChange} language='json' />
      </div>
    </TabsContent>
  )
}
