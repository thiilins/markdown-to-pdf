'use client'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import React from 'react'

export const WindowFooter = () => {
  const { config, code } = useCodeSnapshot()
  // Footer aparece se showFooter estiver ativo OU se languagePosition for 'footer' OU se houver texto customizado
  const showLanguageInFooter = config.languagePosition === 'footer'
  const hasCustomText = config.footerCustomText.trim().length > 0
  const hasFooterOptions = config.footerOptions.length > 0

  if (!config.showFooter && !showLanguageInFooter && !hasCustomText) return null

  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const lineCount = code.split('\n').length
  const charCount = code.length

  // Coleta todos os itens do footer
  const footerItems: string[] = []

  // Adiciona linguagem se estiver configurada para footer (sempre aparece quando languagePosition === 'footer')
  if (showLanguageInFooter) {
    footerItems.push(languageDisplay)
  }

  // Processa opções do footer (só se showFooter estiver ativo)
  if (config.showFooter) {
    config.footerOptions.forEach((option: string) => {
      switch (option) {
        case 'linguagem':
          // Só adiciona se não estiver já adicionada por languagePosition
          if (!showLanguageInFooter) {
            footerItems.push(languageDisplay)
          }
          break
        case 'linhas':
          footerItems.push(`${lineCount} ${lineCount === 1 ? 'linha' : 'linhas'}`)
          break
        case 'caracteres':
          footerItems.push(`${charCount.toLocaleString()} caracteres`)
          break
        case 'texto':
          // Adiciona texto customizado se houver
          if (config.footerCustomText.trim()) {
            footerItems.push(config.footerCustomText)
          }
          break
        default:
          // Permite texto livre
          if (option.trim()) {
            footerItems.push(option)
          }
      }
    })

    // Adiciona texto customizado se não estiver nas opções
    if (config.footerCustomText.trim() && !config.footerOptions.includes('texto')) {
      footerItems.push(config.footerCustomText)
    }
  } else {
    // Se showFooter estiver desativado mas houver texto customizado, adiciona
    if (hasCustomText) {
      footerItems.push(config.footerCustomText)
    }
  }

  if (footerItems.length === 0) return null

  const positionClasses: Record<string, string> = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  const borderRadius = config.borderRadius - 4

  return (
    <div
      className={cn(
        'e items-center border-t border-white/10 bg-[#0d0d0d]/50 px-4 py-2',
        'flex items-center gap-3 text-[10px] text-zinc-400',
        positionClasses[config.footerPosition] || positionClasses.right,
      )}
      style={{
        borderBottomLeftRadius: `${borderRadius}px`,
        borderBottomRightRadius: `${borderRadius}px`,
        height: '24px',
      }}>
      {footerItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className='text-zinc-600'>•</span>}
          <span className='tracking-wider uppercase'>{item}</span>
        </React.Fragment>
      ))}
    </div>
  )
}
