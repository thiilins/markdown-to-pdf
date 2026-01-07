'use client'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { Minus, Square, X } from 'lucide-react'

const MacHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4

  return (
    <div
      className='flex items-center justify-between px-4 py-3 select-none'
      style={{
        borderTopLeftRadius: `${borderRadius - 4}px`,
        borderTopRightRadius: `${borderRadius - 4}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex gap-1.5'>
          <div className='h-3 w-3 rounded-full bg-[#ff5f56] shadow-inner' />
          <div className='h-3 w-3 rounded-full bg-[#ffbd2e] shadow-inner' />
          <div className='h-3 w-3 rounded-full bg-[#27c93f] shadow-inner' />
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-xs text-zinc-400'>
            {config.showHeaderTitle && (
              <span className='font-medium text-zinc-300'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-zinc-500'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export const WindowsHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4
  return (
    <div
      className='flex items-center justify-between border-b border-white/10 bg-[#2d2d30] px-2 py-1.5 select-none'
      style={{
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5 px-2'>
          <div className='h-1 w-1 rounded-full bg-white/40' />
          <div className='h-1 w-1 rounded-full bg-white/40' />
          <div className='h-1 w-1 rounded-full bg-white/40' />
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-[10px] text-white/60'>
            {config.showHeaderTitle && (
              <span className='font-medium text-white/80'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-white/40'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center gap-1'>
        <button
          className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white'
          aria-label='Minimizar'>
          <Minus className='h-3.5 w-3.5' strokeWidth={2.5} />
        </button>
        <button
          className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white'
          aria-label='Maximizar'>
          <Square className='h-3 w-3' strokeWidth={2.5} />
        </button>
        <button
          className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-[#e81123] hover:text-white'
          aria-label='Fechar'>
          <X className='h-3.5 w-3.5' strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export const LinuxHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4
  return (
    <div
      className='flex items-center justify-between border-b border-white/10 bg-[#383c4a] px-3 py-2 select-none'
      style={{
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex gap-1.5'>
          <div className='h-2.5 w-2.5 rounded-sm bg-[#ed333b]' />
          <div className='h-2.5 w-2.5 rounded-sm bg-[#f39c12]' />
          <div className='h-2.5 w-2.5 rounded-sm bg-[#52b788]' />
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-[10px] text-white/70'>
            {config.showHeaderTitle && (
              <span className='font-medium text-white/90'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-white/50'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center gap-1'>
        <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-white/10'>
          <Minus className='h-3 w-3' strokeWidth={2.5} />
        </button>
        <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-white/10'>
          <Square className='h-2.5 w-2.5' strokeWidth={2.5} />
        </button>
        <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-[#ed333b]'>
          <X className='h-3 w-3' strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export const ChromeHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4
  return (
    <div
      className='flex items-center justify-between border-b border-white/5 bg-[#323232] px-3 py-2 select-none'
      style={{
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <div className='h-2 w-2 rounded-full bg-[#ea4335]' />
          <div className='h-2 w-2 rounded-full bg-[#fbbc04]' />
          <div className='h-2 w-2 rounded-full bg-[#34a853]' />
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-[10px] text-white/60'>
            {config.showHeaderTitle && (
              <span className='font-medium text-white/80'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-white/40'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center gap-1'>
        <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-white/10'>
          <Minus className='h-3.5 w-3.5' strokeWidth={2} />
        </button>
        <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-white/10'>
          <Square className='h-3 w-3' strokeWidth={2} />
        </button>
        <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-[#ea4335]'>
          <X className='h-3.5 w-3.5' strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export const VscodeHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4
  return (
    <div
      className='flex items-center justify-between border-b border-white/5 bg-[#1e1e1e] px-3 py-2 select-none'
      style={{
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <div className='h-2 w-2 rounded-full bg-[#ff5f56]' />
          <div className='h-2 w-2 rounded-full bg-[#ffbd2e]' />
          <div className='h-2 w-2 rounded-full bg-[#27c93f]' />
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-[10px] text-white/60'>
            {config.showHeaderTitle && (
              <span className='font-medium text-white/80'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-white/40'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center gap-1'>
        <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-white/10'>
          <Minus className='h-3 w-3' strokeWidth={2} />
        </button>
        <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-white/10'>
          <Square className='h-2.5 w-2.5' strokeWidth={2} />
        </button>
        <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-[#ff5f56]'>
          <X className='h-3 w-3' strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export const RetroTerminalHeader = () => {
  const { config } = useCodeSnapshot()
  const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
  const showLanguageInHeader = config.languagePosition === 'header'
  const hasContent = config.showHeaderTitle || showLanguageInHeader
  const borderRadius = config.borderRadius - 4

  return (
    <div
      className='flex items-center justify-between border-b border-[#00ff41]/20 bg-[#0a0a0a] px-3 py-2 font-mono select-none'
      style={{
        borderTopLeftRadius: `${borderRadius}px`,
        borderTopRightRadius: `${borderRadius}px`,
      }}>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <span className='text-xs font-bold text-[#00ff41]'>$</span>
          <span className='animate-pulse text-[8px] text-[#00ff41]/60'>▊</span>
        </div>
        {hasContent && (
          <div className='flex items-center gap-2 text-[10px] text-[#00ff41]/80'>
            {config.showHeaderTitle && (
              <span className='font-medium text-[#00ff41]'>{config.headerTitle || 'code.ts'}</span>
            )}
            {config.showHeaderTitle && showLanguageInHeader && (
              <span className='text-[#00ff41]/40'>•</span>
            )}
            {showLanguageInHeader && (
              <span className='tracking-wider text-[#00ff41]/70 uppercase'>{languageDisplay}</span>
            )}
          </div>
        )}
      </div>
      <div className='flex items-center gap-1 font-mono text-[10px] text-[#00ff41]/40'>
        <span className='text-[#00ff41]/30'>[RETRO]</span>
      </div>
    </div>
  )
}

export const WindowHeader = () => {
  const { config } = useCodeSnapshot()
  const options = {
    mac: <MacHeader />,
    windows: <WindowsHeader />,
    linux: <LinuxHeader />,
    chrome: <ChromeHeader />,
    vscode: <VscodeHeader />,
    retro: <RetroTerminalHeader />,
  }

  if (config.windowTheme !== 'none') {
    return options[config.windowTheme]
  }
}
