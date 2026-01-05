export const homeBreadcrumb: Breadcrumbs = {
  label: 'Home',
  href: '/',
  order: 1,
}
export const mdToPdfBreadcrumbs: Breadcrumbs[] = [
  homeBreadcrumb,
  {
    label: 'MD to PDF',
    href: '/md-to-pdf',
    order: 2,
  },
]

export const webToMarkdownBreadcrumbs: Breadcrumbs[] = [
  homeBreadcrumb,
  {
    label: 'Web Extractor',
    href: '/web-extractor',
    order: 2,
  },
]
