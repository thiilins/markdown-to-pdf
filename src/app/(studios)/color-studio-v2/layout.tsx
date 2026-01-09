import type { Metadata } from 'next'
import { StudioHeader } from './_shared/components/StudioHeader'
import { ColorStudioProvider } from './_shared/contexts/ColorStudioContext'

export const metadata: Metadata = {
  title: 'Color Studio v2 - Professional Color Tools',
  description:
    'Generate beautiful color palettes, check contrast, visualize colors in real designs. Professional color tools for designers and developers.',
}

export default function ColorStudioV2Layout({ children }: { children: React.ReactNode }) {
  return (
    <ColorStudioProvider>
      <div className='my-10 h-screen overflow-auto'>
        <StudioHeader />
        {children}
      </div>
    </ColorStudioProvider>
  )
}
