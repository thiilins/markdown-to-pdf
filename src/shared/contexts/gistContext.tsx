'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { GistService } from '@/services/gistService'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { mountGistSelectedfile } from '../utils'
import { searchText } from '../utils/search-text'

interface GistContextType {
  gists: Gist[]
  setGists: (gists: Gist[]) => void
  onGetGists: ({ username, type }: FetchGistsParams) => Promise<void>
  error: string | null | undefined
  loading: boolean
  onSearch: ({ username, type }: FetchGistsParams) => Promise<void>
  onSelectGist: (gist: Gist) => void
  selectedGist: Gist | null
  selectedGistId: string | null
  typeMyGists: GistType
  setTypeMyGists: (type: GistType) => void
  typeAllGists: GistType
  setTypeAllGists: (type: GistType) => void
  searchUser: string
  setSearchUser: (searchUser: string) => void
  selectedFile: SelectedGistFileProps | null
  handleLoadFileContent: (file: GistFile) => Promise<void>
  handleSelectFile: (filename: string) => void
  loadingFiles: Record<string, boolean>
  fileContents: Record<string, string>
  filteredGists: Gist[]
  searchValue: string
  searchType: { description: boolean }
  OnChangeSearchType: (checked: boolean) => void
  setSearchValue: (value: string) => void
  // Novas propriedades para Tags
  allTags: string[]
  selectedTags: string[]
  fileOptions: { value: string; label: string; language: string | null }[]
  toggleTag: (tag: string) => void
  allLanguages: string[]
  selectedLanguages: string[]
  toggleLanguage: (lang: string) => void
}

const GistContext = createContext<GistContextType | undefined>(undefined)

export function GistProvider({ children }: { children: ReactNode }) {
  const [gists, setGists] = usePersistedStateInDB<Gist[]>('gists', [])
  const [error, setError] = useState<string | null | undefined>(null)
  const [loading, setLoading] = useState(false)
  const [typeMyGists, setTypeMyGists] = useState<GistType>('all')
  const [typeAllGists, setTypeAllGists] = useState<GistType>('public')
  const [searchUser, setSearchUser] = useState('')
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null)

  // GIST PREVIEW
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({})
  const [selectedFile, setSelectedFile] = useState<SelectedGistFileProps | null>(null)

  // Search & Filters
  const [searchValue, setSearchValue] = useState('')
  const [searchType, setSearchType] = useState<{ description: boolean }>({ description: true })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  const OnChangeSearchType = (checked: boolean) => {
    setSearchType({ ...searchType, description: checked })
  }

  // Lógica de Extração de Tags (Feature 3.1)
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    gists.forEach((gist) => {
      // Procura por palavras começando com # na descrição
      const matches = gist.description?.match(/#[\w-]+/g)
      if (matches) {
        matches.forEach((tag) => tags.add(tag.toLowerCase()))
      }
    })
    return Array.from(tags).sort()
  }, [gists])

  const allLanguages = useMemo(() => {
    const langs = new Set<string>()
    gists.forEach((gist) => {
      gist.files.forEach((file) => {
        if (file.language) langs.add(file.language)
      })
    })
    return Array.from(langs).sort()
  }, [gists])

  const toggleLanguage = useCallback((lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    )
  }, [])

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const filteredGists = useMemo(() => {
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
  }, [gists, searchValue, searchType, selectedTags, selectedLanguages])
  const onGetGists = useCallback(
    async ({ username, type }: FetchGistsParams) => {
      setLoading(true)
      setError(null)
      setSelectedGist(null)

      try {
        const response = await GistService.getAll({ username, type })
        const data = response.data
        if (response.success) {
          setGists(data)
          if (data.length > 0) {
            toast.success(`${data.length} Gist(s) encontrado(s)`, { duration: 2000 })
          } else {
            toast.info('Nenhum Gist encontrado.', { duration: 2000 })
          }
        } else {
          setError(response.error)
          setGists([])
          toast.error(response.error || 'Erro inesperado.', { duration: 4000 })
        }
      } finally {
        setLoading(false)
      }
    },
    [setGists],
  )

  const onSearch = useCallback(
    async ({ username, type }: FetchGistsParams) => {
      if (!username?.trim()) {
        toast.error('Digite um nome de usuário válido')
        return
      }
      await onGetGists({ username, type })
    },
    [onGetGists],
  )

  const handleLoadFileContent = useCallback(
    async (file: GistFile) => {
      if (fileContents[file.filename] || loadingFiles[file.filename]) return
      setLoadingFiles((prev) => ({ ...prev, [file.filename]: true }))
      try {
        const response = await GistService.getGistContent(file.raw_url)
        if (response.success) {
          setFileContents((prev) => ({ ...prev, [file.filename]: response.data }))
        } else {
          setFileContents((prev) => ({ ...prev, [file.filename]: '' }))
          toast.error(response.error || 'Falha ao carregar arquivo', { duration: 4000 })
        }
      } finally {
        setLoadingFiles((prev) => ({ ...prev, [file.filename]: false }))
      }
    },
    [fileContents, loadingFiles, setFileContents, setLoadingFiles],
  )

  const onSelectGist = useCallback(
    (gist: Gist) => {
      const firstFile = gist.files[0]
      setSelectedGist(gist)
      if (firstFile) {
        const selectedFile = mountGistSelectedfile(gist, firstFile.filename)
        setSelectedFile(selectedFile)
        handleLoadFileContent(firstFile)
      }
    },
    [handleLoadFileContent],
  )

  const selectedGistId = useMemo(() => selectedGist?.id || null, [selectedGist])

  const handleSelectFile = useCallback(
    (filename: string) => {
      const file = selectedGist?.files.find((f: GistFile) => f.filename === filename)
      if (file) {
        const selectedFile = mountGistSelectedfile(selectedGist!, filename)
        setSelectedFile(selectedFile)
        handleLoadFileContent(file)
      }
    },
    [handleLoadFileContent, selectedGist],
  )

  useEffect(() => {
    if (!selectedGist) {
      setFileContents({})
      setSelectedFile(null)
    }
  }, [selectedGist])

  const fileOptions = useMemo(() => {
    const options = (selectedGist?.files ?? []).map((file) => {
      return {
        value: file.filename,
        label: file.filename,
        language: file.language,
      }
    })
    return options
  }, [selectedGist?.files])
  const value = {
    gists,
    setGists,
    onGetGists,
    error,
    loading,
    selectedGist,
    onSearch,
    onSelectGist,
    selectedGistId,
    typeMyGists,
    setTypeMyGists,
    typeAllGists,
    setTypeAllGists,
    searchUser,
    setSearchUser,
    selectedFile,
    handleLoadFileContent,
    handleSelectFile,
    loadingFiles,
    fileContents,
    filteredGists,
    searchValue,
    searchType,
    OnChangeSearchType,
    setSearchValue,
    allTags,
    fileOptions,
    selectedTags,
    toggleTag,
    allLanguages,
    selectedLanguages,
    toggleLanguage,
  }
  return <GistContext.Provider value={value}>{children}</GistContext.Provider>
}

export function useGist() {
  const context = useContext(GistContext)
  if (context === undefined) {
    throw new Error('useGist must be used within a GistProvider')
  }
  return context
}
