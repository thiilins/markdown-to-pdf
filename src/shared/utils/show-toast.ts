import { ExternalToast, toast } from 'sonner'

interface ShowToastProps extends Omit<ExternalToast, 'id' | 'toasterId'> {
  id: string
  message: string
  variant: 'success' | 'error' | 'warning' | 'info' | 'loading'
}

const variants = {
  success: {
    backgroundColor: 'var(--success-bg)',
    color: 'var(--success-text)',
    borderColor: 'var(--success-border)',
  },
  error: {
    backgroundColor: 'var(--destructive)',
    color: 'var(--destructive-foreground)',
  },
  warning: {
    backgroundColor: 'var(--warning-bg)',
    color: 'var(--warning-text)',
    borderColor: 'var(--warning-border)',
  },
  info: {
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    borderColor: 'var(--border)',
  },
  loading: {
    backgroundColor: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
  },
} as const

export const showToast = ({ id, message, variant, style, ...props }: ShowToastProps) => {
  toast[variant](message, {
    id,
    style: { ...variants[variant], ...style },
    ...props,
  })
}
