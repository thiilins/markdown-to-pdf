import { CodeSnapshotProvider } from '@/shared/contexts/codeSnapshotContext'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function CodeSnapLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToolsLayoutComponent>
      <CodeSnapshotProvider>{children}</CodeSnapshotProvider>
    </ToolsLayoutComponent>
  )
}
