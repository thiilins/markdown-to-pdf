export const urlIsActive = (pathname: string, href: string) => {
  return pathname === href || pathname?.startsWith(href + '/')
}
export const urlIsActiveWithSubmenu = (pathname: string, submenu: Modules[]) => {
  return submenu.some((module) => urlIsActive(pathname, module.href || ''))
}
