'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  ALargeSmall,
  Binary,
  Check,
  Copy,
  Hash,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Type,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  calculatePasswordStrength,
  generatePassword,
  type PasswordOptions,
} from '../../_components/password-gen-utils'

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
}

export default function PasswordGeneratorPro() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS)
  const [password, setPassword] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' })

  const generateNewPassword = useCallback(() => {
    try {
      const newPassword = generatePassword(options)
      setPassword(newPassword)
      setStrength(calculatePasswordStrength(newPassword))
      setIsCopied(false)
    } catch (error) {
      // Falha silenciosa
    }
  }, [options])

  useEffect(() => {
    if (!password) generateNewPassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopy = useCallback(async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setIsCopied(true)
      toast.success('Senha copiada!', { position: 'top-center' })
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [password])

  const toggleOption = (key: keyof PasswordOptions) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [key]: !prev[key] }
      try {
        const p = generatePassword(newOptions)
        setPassword(p)
        setStrength(calculatePasswordStrength(p))
      } catch {}
      return newOptions
    })
  }

  const handleLengthChange = (value: number[]) => {
    setOptions((prev) => {
      const newOptions = { ...prev, length: value[0] }
      try {
        const p = generatePassword(newOptions)
        setPassword(p)
        setStrength(calculatePasswordStrength(p))
      } catch {}
      return newOptions
    })
  }

  // Define a cor baseada no score (0 a 5)
  const getStrengthColor = (score: number) => {
    if (score >= 5) return 'bg-emerald-500 text-emerald-600 shadow-emerald-500/20 ring-emerald-500'
    if (score >= 4) return 'bg-green-500 text-green-600 shadow-green-500/20 ring-green-500'
    if (score >= 3) return 'bg-yellow-500 text-yellow-600 shadow-yellow-500/20 ring-yellow-500'
    return 'bg-red-500 text-red-600 shadow-red-500/20 ring-red-500'
  }

  const strengthColorClass = getStrengthColor(strength.score)

  // Ajuste fino do tamanho da fonte
  const getPasswordFontSize = (len: number) => {
    if (len <= 14) return 'text-4xl sm:text-5xl'
    if (len <= 20) return 'text-3xl sm:text-4xl'
    if (len <= 28) return 'text-2xl sm:text-3xl'
    if (len <= 36) return 'text-xl sm:text-2xl'
    return 'text-lg sm:text-xl break-all'
  }

  return (
    <div className='from-muted/20 to-muted/50 flex min-h-[calc(100vh-4rem)] w-full items-center justify-center bg-linear-to-b p-4 sm:p-8'>
      <div className='relative z-10 w-full max-w-lg space-y-6'>
        {/* Cabeçalho Minimalista */}
        <div className='flex items-center justify-between px-2'>
          <h1 className='text-4xl font-bold tracking-tight text-violet-900'>Gerador de Senha</h1>
          <div
            className={cn(
              'bg-background/50 flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-sm transition-colors duration-500',
              strengthColorClass.replace('bg-', 'text-').replace('ring-', 'border-').split(' ')[1],
            )}>
            {strength.score >= 4 ? (
              <ShieldCheck className='h-3.5 w-3.5' />
            ) : (
              <ShieldAlert className='h-3.5 w-3.5' />
            )}
            {strength.label || 'Analisando'}
          </div>
        </div>

        <div className='bg-background/80 overflow-hidden rounded-4xl border shadow-2xl ring-1 ring-white/20 backdrop-blur-xl dark:ring-white/5'>
          <div className='from-muted/30 relative bg-linear-to-b to-transparent px-8 pt-10 pb-8 text-center'>
            <div
              className={cn(
                'text-foreground cursor-pointer font-mono font-bold tracking-wider transition-all duration-300 select-all',
                getPasswordFontSize(password.length),
              )}
              onClick={handleCopy}>
              {password}
            </div>

            {/* Barra de Força Segmentada */}
            <div className='mx-auto mt-8 flex h-1.5 max-w-[200px] gap-1.5'>
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={cn(
                    'flex-1 rounded-full transition-all duration-500',
                    strength.score >= step
                      ? strengthColorClass.split(' ')[0] // Pega apenas a classe bg-color
                      : 'bg-muted-foreground/20',
                  )}
                />
              ))}
            </div>

            {/* Botão de Copiar Flutuante (Absolute) */}
            <div className='absolute top-4 right-4'>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleCopy}
                className={cn(
                  'hover:bg-background/80 rounded-xl transition-all duration-300 hover:shadow-sm',
                  isCopied && 'bg-green-50 text-green-600',
                )}>
                <div className='relative h-5 w-5'>
                  <Copy
                    className={cn(
                      'absolute inset-0 transition-all duration-300',
                      isCopied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                    )}
                  />
                  <Check
                    className={cn(
                      'absolute inset-0 transition-all duration-300',
                      isCopied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                    )}
                  />
                </div>
              </Button>
            </div>
          </div>

          <div className='space-y-8 p-6'>
            {/* Slider */}
            <div className='space-y-4 px-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-muted-foreground text-sm font-semibold tracking-wider uppercase'>
                  Comprimento
                </Label>
                <span className='min-w-[3ch] text-right font-mono text-xl font-bold'>
                  {options.length}
                </span>
              </div>
              <Slider
                value={[options.length]}
                onValueChange={handleLengthChange}
                min={6}
                max={50}
                step={1}
                className='cursor-pointer'
              />
            </div>

            {/* Grid de Opções (Tiles) */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
              <TileToggle
                active={options.includeUppercase}
                onClick={() => toggleOption('includeUppercase')}
                icon={<Type className='h-5 w-5' />}
                label='ABC'
                description='Maiúsculas'
              />
              <TileToggle
                active={options.includeLowercase}
                onClick={() => toggleOption('includeLowercase')}
                icon={<ALargeSmall className='h-5 w-5' />}
                label='abc'
                description='Minúsculas'
              />
              <TileToggle
                active={options.includeNumbers}
                onClick={() => toggleOption('includeNumbers')}
                icon={<Hash className='h-5 w-5' />}
                label='123'
                description='Números'
              />
              <TileToggle
                active={options.includeSymbols}
                onClick={() => toggleOption('includeSymbols')}
                icon={<Binary className='h-5 w-5' />}
                label='#$%'
                description='especiais'
              />
            </div>

            {/* Opções Avançadas */}
            <div className='bg-muted/30 space-y-3 rounded-xl p-4'>
              <div className='mb-2 flex items-center gap-2'>
                <ShieldQuestion className='text-muted-foreground h-4 w-4' />
                <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                  Refinamentos
                </span>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <AdvancedCheckbox
                  id='similar'
                  checked={options.excludeSimilar}
                  onChange={() => toggleOption('excludeSimilar')}
                  label='Sem similares'
                  desc='ex: i, l, 1, o, 0'
                />
                <AdvancedCheckbox
                  id='ambiguous'
                  checked={options.excludeAmbiguous}
                  onChange={() => toggleOption('excludeAmbiguous')}
                  label='Sem símbolos'
                  desc='ex: { } [ ] / \'
                />
              </div>
            </div>

            {/* Botão de Ação */}
            <Button
              size='lg'
              onClick={generateNewPassword}
              className='shadow-primary/20 hover:shadow-primary/30 h-14 w-full rounded-xl text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5'>
              <RefreshCw className='animate-in spin-in-180 mr-2 h-5 w-5 duration-700' />
              Gerar Nova Senha
            </Button>
          </div>
        </div>
      </div>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />
    </div>
  )
}

function TileToggle({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  description: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'border-primary flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 p-3 transition-all duration-200',
        active
          ? 'bg-primary border-primary text-white shadow-sm'
          : 'bg-muted/50 text-muted-foreground hover:bg-muted border-primary',
      )}>
      {icon}
      <span className='font-mono text-xs font-bold'>{label}</span>
      <p
        className={cn(
          'text-muted-foreground mt-0.5 text-[9px] leading-tight',
          active ? 'text-white' : 'text-primary',
        )}>
        {description}
      </p>
    </button>
  )
}

function AdvancedCheckbox({ id, checked, onChange, label, desc }: any) {
  return (
    <div className='bg-primary/20 border-primary flex items-start gap-3 rounded-lg border p-2.5 transition-colors'>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className='mt-0.5 cursor-pointer'
      />
      <div>
        <Label htmlFor={id} className='cursor-pointer text-sm font-medium'>
          {label}
        </Label>
        <p className='text-muted-foreground mt-0.5 text-[10px] leading-tight'>{desc}</p>
      </div>
    </div>
  )
}
