interface Window {
  PagedConfig?: {
    auto?: boolean
    before?: () => void
  }
  Paged: {
    Previewer: new (options?: any) => {
      preview(
        content: string | HTMLElement,
        stylesheets: string[] | null,
        renderTo: HTMLElement,
      ): Promise<any>
    }
  }
}

declare module 'pagedjs'
