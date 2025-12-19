export const enableTools: Record<string, EnableTools> = {
  '/': {
    zoom: false,
    printExport: false,
  },
  '/md-to-pdf': {
    zoom: true,
    printExport: true,
  },
}

export const getEnableTools = (pathname: string) => {
  if (!pathname || !enableTools[pathname])
    return {
      zoom: false,
      printExport: false,
      settings: false,
    }
  return enableTools[pathname]
}

export const showToolsHeader = (pathname: string) => {
  const config = getEnableTools(pathname)
  return config.zoom || config.printExport
}
