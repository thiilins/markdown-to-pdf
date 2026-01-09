'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Check, Code2, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface CodeExporterProps {
  expression: string
  description: string
  isValid: boolean
}

type CodeLanguage = 'nodejs' | 'python' | 'docker' | 'kubernetes' | 'systemd'

// ... (Manter constantes CODE_TEMPLATES e LANGUAGE_LABELS iguais) ...
// Estou abreviando para focar no JSX visual, mantenha a lógica original
const CODE_TEMPLATES: Record<CodeLanguage, (expr: string, desc: string) => string> = {
  nodejs: (expr, desc) =>
    `// ${desc}\nimport cron from 'node-cron';\n\ncron.schedule('${expr}', () => {\n  console.log('Task running...');\n});`,
  python: (expr, desc) =>
    `# ${desc}\nfrom crontab import CronTab\n\ncron = CronTab(user=True)\njob = cron.new(command='python script.py')\njob.setall('${expr}')\ncron.write()`,
  docker: (expr, desc) =>
    `# ${desc}\n# docker-compose.yml\ncommand: sh -c "echo '${expr} /script.sh' > /etc/crontabs/root && crond -f"`,
  kubernetes: (expr, desc) =>
    `# ${desc}\nschedule: "${expr}"\nkind: CronJob\nmetadata:\n  name: my-job`,
  systemd: (expr, desc) =>
    `# ${desc}\nOnCalendar=*-*-* ${expr}\n# Note: Convert cron format if needed`,
}

const LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  nodejs: 'Node.js',
  python: 'Python',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  systemd: 'Systemd',
}

export function CodeExporter({ expression, description, isValid }: CodeExporterProps) {
  const [language, setLanguage] = useState<CodeLanguage>('nodejs')
  const [copied, setCopied] = useState(false)

  if (!isValid) {
    return (
      <div className='flex h-full items-center justify-center p-4 text-center'>
        <div className='flex flex-col items-center gap-3 opacity-50'>
          <Code2 className='text-muted-foreground h-10 w-10' />
          <p className='text-muted-foreground text-sm'>
            Digite uma expressão válida para exportar código
          </p>
        </div>
      </div>
    )
  }

  const code = CODE_TEMPLATES[language](expression, description)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Snippet copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className='flex h-full flex-col gap-6 p-6'>
      <div className='border-border/50 bg-muted/20 relative space-y-2 rounded-xl border p-4 shadow-sm backdrop-blur-sm'>
        <div className='mb-2 flex items-center gap-2'>
          <Terminal className='text-primary h-4 w-4' />
          <Label className='text-sm font-semibold'>Selecione o Ambiente</Label>
        </div>

        <div className='flex gap-2'>
          <Select value={language} onValueChange={(v) => setLanguage(v as CodeLanguage)}>
            <SelectTrigger className='bg-background/50 flex-1 border-white/10'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleCopy}
            variant='outline'
            size='icon'
            className='bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 shrink-0 border-white/10 transition-all'>
            {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      <div className='flex min-h-0 flex-1 flex-col'>
        {/* Janela de Código Estilizada (Fake IDE) */}
        <div className='flex flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0F1117] shadow-xl'>
          {/* Barra de Título */}
          <div className='flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2'>
            <div className='flex gap-1.5'>
              <div className='h-2.5 w-2.5 rounded-full border border-red-500/30 bg-red-500/20' />
              <div className='h-2.5 w-2.5 rounded-full border border-yellow-500/30 bg-yellow-500/20' />
              <div className='h-2.5 w-2.5 rounded-full border border-green-500/30 bg-green-500/20' />
            </div>
            <span className='text-muted-foreground font-mono text-[10px] opacity-60'>
              snippet.{language === 'nodejs' ? 'ts' : 'txt'}
            </span>
          </div>

          <ScrollArea className='flex-1'>
            <pre className='p-4 font-mono text-xs leading-relaxed'>
              <code className='selection:bg-primary/30 text-slate-300 selection:text-white'>
                {code}
              </code>
            </pre>
          </ScrollArea>
        </div>
      </div>

      <div className='flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400/90'>
        <div className='mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500' />
        <p>Revise caminhos e permissões antes de executar em produção.</p>
      </div>
    </div>
  )
}
