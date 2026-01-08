'use client'

import { AlertCircle, Info, Lightbulb, ShieldAlert, TriangleAlert } from 'lucide-react'
import { ReactNode } from 'react'

interface AdmonitionProps {
  type: 'note' | 'tip' | 'important' | 'warning' | 'caution'
  children: ReactNode
}

const admonitionConfig = {
  note: {
    icon: Info,
    label: 'Nota',
    colors: {
      border: '#3b82f6',
      bg: '#eff6ff',
      text: '#1e40af',
      iconBg: '#3b82f6',
    },
  },
  tip: {
    icon: Lightbulb,
    label: 'Dica',
    colors: {
      border: '#10b981',
      bg: '#f0fdf4',
      text: '#065f46',
      iconBg: '#10b981',
    },
  },
  important: {
    icon: AlertCircle,
    label: 'Importante',
    colors: {
      border: '#8b5cf6',
      bg: '#f5f3ff',
      text: '#5b21b6',
      iconBg: '#8b5cf6',
    },
  },
  warning: {
    icon: TriangleAlert,
    label: 'Aviso',
    colors: {
      border: '#f59e0b',
      bg: '#fffbeb',
      text: '#92400e',
      iconBg: '#f59e0b',
    },
  },
  caution: {
    icon: ShieldAlert,
    label: 'Cuidado',
    colors: {
      border: '#ef4444',
      bg: '#fef2f2',
      text: '#991b1b',
      iconBg: '#ef4444',
    },
  },
}

export function Admonition({ type, children }: AdmonitionProps) {
  const config = admonitionConfig[type]
  const Icon = config.icon

  return (
    <div
      className='admonition'
      style={{
        borderLeft: `4px solid ${config.colors.border}`,
        backgroundColor: config.colors.bg,
        padding: '1rem',
        margin: '1.5rem 0',
        borderRadius: '0.375rem',
        display: 'flex',
        gap: '0.75rem',
      }}>
      <div
        style={{
          flexShrink: 0,
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon size={20} style={{ color: config.colors.iconBg }} />
      </div>
      <div style={{ flex: 1, color: config.colors.text }}>
        <div
          style={{
            fontWeight: 600,
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
          {config.label}
        </div>
        <div className='admonition-content'>{children}</div>
      </div>
    </div>
  )
}
