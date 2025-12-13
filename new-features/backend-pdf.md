### ✅ Status do Roadmap

1.  **[NOVO] Backend de PDF (NestJS + Puppeteer):** Adicionado à lista.
    - _Nota sobre cPanel:_ Rodar Node.js no cPanel é super tranquilo hoje em dia (via **Setup
      Node.js App** no painel). A única "pegadinha" lá será garantir que as dependências do Chrome
      (bibliotecas Linux) estejam instaladas para o Puppeteer rodar, mas é totalmente viável.

---

### 🚀 Transformando em Multifunção (Arquitetura de Layout)

Para suportar **múltiplas páginas** (Editor, Templates, Histórico) mantendo a performance,
precisamos sair do layout de "página única" para um **Layout com Navegação Lateral (Sidebar)**.

Você já tem o componente `sidebar.tsx` do shadcn/ui instalado (eu vi nos arquivos), então vamos
usá-lo para criar uma navegação profissional.

#### Passo 1: Criar o componente `AppSidebar`

Crie o arquivo `src/app/_components/app-sidebar.tsx`. Ele será o menu de navegação da sua aplicação.

```tsx
'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { FileText, History, Home, LayoutTemplate, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IoLogoMarkdown } from 'react-icons/io5'

const items = [
  {
    title: 'Editor',
    url: '/',
    icon: Home,
  },
  {
    title: 'Meus Documentos',
    url: '/documents',
    icon: History,
  },
  {
    title: 'Modelos',
    url: '/templates',
    icon: LayoutTemplate,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-1'>
          <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg'>
            <IoLogoMarkdown className='size-5' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>MD Pro</span>
            <span className='truncate text-xs'>v1.0.0</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          cursor
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip='Configurações'>
              <button onClick={() => alert('Configurações globais')}>
                <Settings />
                <span>Configurações</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
```

#### Passo 2: Criar um Layout de Dashboard

Para não "sujar" o `root layout` (que deve ser limpo), vamos criar um "Route Group" para a área
logada/funcional do app.

1.  Crie a pasta `src/app/(main)` (os parênteses significam que isso não afeta a URL).
2.  Mova `src/app/page.tsx` para `src/app/(main)/page.tsx`.
3.  Crie o arquivo `src/app/(main)/layout.tsx`:

<!-- end list -->

```tsx
import { AppSidebar } from '@/app/_components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header fixo do layout com o trigger da sidebar */}
        <header className='bg-background flex h-14 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          {/* Aqui você pode colocar breadcrumbs dinâmicos no futuro */}
          <span className='text-sm font-medium'>Markdown PDF Pro</span>
        </header>

        {/* Área de conteúdo principal (Onde o Editor vai carregar) */}
        <div className='flex flex-1 flex-col overflow-hidden'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

#### Passo 3: Ajustar o `view.tsx` para o novo Layout

Como agora temos um Layout global (`MainLayout`) que já tem Sidebar e Header básico, precisamos
ajustar o seu `view.tsx` para ele **não** renderizar o `AppHeader` antigo duplicado, ou adaptar o
`AppHeader` para ser a barra de ferramentas do editor, e não o header do site.

Minha sugestão Sênior: Transforme o `AppHeader` atual em uma **Toolbar de Ações** específica do
Editor.

No arquivo `src/app/_components/view.tsx`:

- Remova a tag `<header>` que envolvia o `AppHeader` e deixe ele ser apenas uma `div` de controle
  dentro da área do editor.
- Isso faz com que a navegação (Sidebar) fique isolada da ferramenta (Editor).

#### Passo 4: Criar as Novas Páginas (Exemplos)

Agora você pode criar os arquivos para as novas rotas.

**1. Rota de Modelos (`src/app/(main)/templates/page.tsx`):**

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus } from 'lucide-react'

const templates = [
  { title: 'Currículo Moderno', desc: 'Ideal para devs e designers' },
  { title: 'Relatório Técnico', desc: 'Formatação ABNT simplificada' },
  { title: 'Contrato de Serviço', desc: 'Base jurídica padrão' },
]

export default function TemplatesPage() {
  return (
    <div className='space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Modelos</h1>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> Criar Modelo
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {templates.map((t, i) => (
          <Card key={i} className='hover:bg-accent/50 cursor-pointer transition-colors'>
            <CardHeader>
              <FileText className='text-primary mb-2 h-8 w-8' />
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                Usar Modelo
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### Resumo da Nova Estrutura

```
src/app/
├── (main)/              # Grupo de rotas com Sidebar
│   ├── layout.tsx       # <SidebarProvider> ... </SidebarProvider>
│   ├── page.tsx         # O Editor (Home)
│   ├── templates/       # Nova página
│   │   └── page.tsx
│   └── documents/       # Nova página (Futuro histórico)
│       └── page.tsx
├── layout.tsx           # Root html/body
└── globals.css
```
