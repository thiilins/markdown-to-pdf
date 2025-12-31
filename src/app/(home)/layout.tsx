'use client'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='custom-scrollbar from-background via-background to-muted/20 text-foreground flex h-full w-full flex-col overflow-auto bg-linear-to-br font-sans'>
      {children}
    </div>
  )
}
