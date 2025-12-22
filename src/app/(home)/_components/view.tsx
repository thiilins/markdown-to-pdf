'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Modules_Front } from '@/shared/constants/modules'
import Link from 'next/link'

export const HomeViewComponent = () => {
  const hasModules = Modules_Front.some(
    (category) => category.submenu && category.submenu.length > 0,
  )
  return (
    <div className='from-background via-background to-muted/20 flex min-h-screen flex-col items-center justify-center bg-linear-to-br p-4 md:p-8'>
      <div className='w-full max-w-6xl space-y-12'>
        {/* Header de Boas-vindas */}
        <div className='space-y-2 text-center'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            Bem-vindo ao{' '}
            <span className='from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent'>
              MD Tools Pro
            </span>
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl'>
            Escolha uma ferramenta para começar.
          </p>
        </div>

        {/* Categorias e Módulos */}
        {hasModules ? (
          <div className='space-y-10'>
            {Modules_Front.map((category) => {
              if (!category.submenu || category.submenu.length === 0) return null

              const CategoryIcon = category.icon

              return (
                <div key={category.label} className='space-y-4'>
                  {/* Cabeçalho da Categoria */}
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                      <CategoryIcon className='h-5 w-5' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-semibold'>{category.label}</h2>
                      {category.description && (
                        <p className='text-muted-foreground text-sm'>{category.description}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Grid de Módulos da Categoria */}
                  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {category.submenu.map((module) => {
                      const ModuleIcon = module.icon
                      return (
                        <Link key={module.href} href={module.href} className='group'>
                          <Card className='hover:shadow-primary/10 border-border/50 hover:border-primary/50 h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-lg'>
                            <CardHeader className='space-y-4'>
                              <div className='bg-primary/10 text-primary group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-colors'>
                                <ModuleIcon className='h-6 w-6' />
                              </div>
                              <div className='space-y-1'>
                                <CardTitle className='group-hover:text-primary text-xl transition-colors'>
                                  {module.label}
                                </CardTitle>
                                <CardDescription className='text-base'>
                                  {module.description}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className='text-muted-foreground group-hover:text-primary flex items-center text-sm transition-colors'>
                                <span>Começar</span>
                                <svg
                                  className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 5l7 7-7 7'
                                  />
                                </svg>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className='border-dashed'>
            <CardHeader>
              <CardTitle className='text-center'>Nenhum módulo disponível</CardTitle>
              <CardDescription className='text-center'>
                Adicione módulos em <code className='text-xs'>constants.ts</code>
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
