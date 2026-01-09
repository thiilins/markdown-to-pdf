import { CodeFormatterEditor } from '@/app/(tools)/_components/code-formatter-editor'
import { TabsContent } from '@radix-ui/react-tabs'

export function ExcelMdCsvInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <TabsContent value='csv' className='m-0 flex-1 overflow-hidden p-0'>
      <div className='h-full'>
        <CodeFormatterEditor value={value} onChange={onChange} language='plaintext' />
      </div>
    </TabsContent>
  )
}
