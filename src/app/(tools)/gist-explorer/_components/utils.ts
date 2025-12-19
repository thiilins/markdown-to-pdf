'use client'
import { downloadMarkdownFile, mergeGistFiles, searchText, triggerDownload } from '@/shared/utils'
import { toast } from 'sonner'

export const handleDownloadPackageMD = (
  selectedGist?: Gist | null,
  fileContents?: Record<string, string> | null,
) => {
  if (!selectedGist || !fileContents) {
    toast.error('Gist ou conteúdo não encontrado.')
    return
  }
  const mergedMarkdown = mergeGistFiles(selectedGist.files, fileContents)
  const filename = `${selectedGist.description?.slice(0, 20) || 'gist-completo'}.md`
  downloadMarkdownFile(mergedMarkdown, filename)
  toast.success('Pacote Markdown gerado!')
  return
}

export const handleDownloadOriginal = (
  fileContents?: Record<string, string> | null,
  selectedFile?: SelectedGistFileProps | null,
) => {
  if (!fileContents || !selectedFile) {
    toast.error('Conteúdo ou arquivo não encontrado.')
    return
  }
  const currentContent = fileContents[selectedFile?.filename || '']
  if (!currentContent) return toast.error('Conteúdo não carregado.')
  triggerDownload(currentContent, selectedFile?.filename || '', 'text/plain')
  toast.success(`Download iniciado: ${selectedFile?.filename || ''}`)
}

export const filterGistBySearch = (
  gists: Gist[],
  searchValue: string,
  searchType: { description: boolean },
  selectedTags: string[],
  selectedLanguages: string[],
) => {
  return gists.filter((gist) => {
    const descriptionMatch = searchText(gist.description, searchValue)
    const filesMatch = gist.files.some((file) => searchText(file.filename, searchValue))
    const textMatch = !searchType.description ? filesMatch : descriptionMatch || filesMatch
    // 2. Filtro de Tags (#)
    let tagsMatch = true
    if (selectedTags.length > 0) {
      const gistTags = (gist.description?.match(/#[\w-]+/g) || []).map((t) => t.toLowerCase())
      tagsMatch = selectedTags.every((tag) => gistTags.includes(tag))
    }
    // 3. Filtro de Linguagens
    let langMatch = true
    if (selectedLanguages.length > 0) {
      langMatch = gist.files.some(
        (file) => file.language && selectedLanguages.includes(file.language),
      )
    }

    return textMatch && tagsMatch && langMatch
  })
}
