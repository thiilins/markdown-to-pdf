'use client'

import {
  filterGistBySearch,
  handleDownloadOriginal,
  handleDownloadPackageMD,
} from '@/app/(tools)/gist-explorer/_components/utils'
import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { useToogleMultiple } from '@/hooks/use-toogle-multiple'
import { GistService } from '@/services/gistService'
import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import { handleDownloadPDFApi } from '../constants/download-pdf-api'
import { mountGistSelectedfile } from '../utils'
import { useConfig } from './configContext'
type GistsAccessType = 'allGists' | 'myGists'
interface GistContextType {
  gists: Gist[]
  setGists: (gists: Gist[]) => Promise<void>
  setGistType: (type: GistsAccessType) => void
  gistType: GistsAccessType
  onGetGists: ({ username, type }: FetchGistsParams) => Promise<void>
  error: string | null | undefined
  onSearch: ({ username, type }: FetchGistsParams) => Promise<void>
  onSelectGist: (gist: Gist) => void
  selectedGist: Gist | null
  selectedGistId: string | null
  types: { myGists: GistType; allGists: GistType }
  handleSetTypes: (type: 'myGists' | 'allGists', value: GistType) => void
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
  handleResetData: () => void
  allTags: string[]
  selectedTags: string[]
  fileOptions: { value: string; label: string; language: string | null }[]
  toggleTag: (tag: string) => void
  allLanguages: string[]
  selectedLanguages: string[]
  toggleLanguage: (lang: string) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  handleDownloadPDF: () => Promise<void>
  onDownloadOriginal: () => void
  onDownloadPackageMD: () => Promise<void> | void
  contentRef: RefObject<HTMLDivElement | null>
}

const GistContext = createContext<GistContextType | undefined>(undefined)

export function GistProvider({ children }: { children: ReactNode }) {
  const { config } = useConfig()
  const contentRef = useRef<HTMLDivElement>(null)
  const [gistAccessType, setGistAccessType] = useState<GistsAccessType>('allGists')
  const [gistsData, setGistsData] = usePersistedStateInDB<{
    allGists: Gist[]
    myGists: Gist[]
  }>('gists', {
    allGists: [],
    myGists: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  // GIST LIST
  const [error, setError] = useState<string | null | undefined>(null)
  const [types, setTypes] = useState<{ myGists: GistType; allGists: GistType }>({
    myGists: 'all',
    allGists: 'public',
  })

  const [searchUser, setSearchUser] = useState('')
  const [selectedGist, setSelectedGist] = useState<Gist | null>(null)

  // GIST PREVIEW
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({})
  const [selectedFile, setSelectedFile] = useState<SelectedGistFileProps | null>(null)

  // GIST SEARCH & FILTERS
  const [searchValue, setSearchValue] = useState('')
  const [searchType, setSearchType] = useState<{ description: boolean }>({ description: true })
  const { selected: selectedTags, toggle: toggleTag } = useToogleMultiple()
  const { selected: selectedLanguages, toggle: toggleLanguage } = useToogleMultiple()
  const OnChangeSearchType = (checked: boolean) => {
    setSearchType({ ...searchType, description: checked })
  }

  const gists = useMemo(() => {
    const gists = gistsData[gistAccessType]
    return gists ?? []
  }, [gistsData, gistAccessType])

  const setGists = useCallback(
    async (gists: Gist[]) => {
      await setGistsData({ ...gistsData, [gistAccessType]: gists })
    },
    [setGistsData, gistsData, gistAccessType],
  )
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    gists.forEach((gist) => {
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

  const onGetGists = useCallback(
    async ({ username, type }: FetchGistsParams) => {
      setIsLoading(true)
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
        setIsLoading(false)
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

  const filteredGists = useMemo(() => {
    return filterGistBySearch(gists, searchValue, searchType, selectedTags, selectedLanguages)
  }, [gists, searchValue, searchType, selectedTags, selectedLanguages])

  const onDownloadOriginal = useCallback(() => {
    return handleDownloadOriginal(fileContents, selectedFile)
  }, [fileContents, selectedFile])

  const onDownloadPackageMD = useCallback(() => {
    return handleDownloadPackageMD(selectedGist, fileContents)
  }, [fileContents, selectedGist])

  const handleDownloadPDF = useCallback(async () => {
    setIsLoading(true)
    const element = document.getElementById('gist-render-area')
    if (!element) {
      toast.error('Área de conteúdo não encontrada.')
      return
    }
    const filename = `${selectedFile?.filename ?? 'gist-document'}.pdf`
    try {
      const htmlContent = element.innerHTML
      await handleDownloadPDFApi(config, htmlContent, filename)
      return
    } finally {
      setIsLoading(false)
    }
  }, [config, selectedFile?.filename])

  const handleResetData = useCallback(async () => {
    await setGistsData({ allGists: [], myGists: [] })
    setError(null)
    setSelectedGist(null)
    setFileContents({})
    setSelectedFile(null)
    setLoadingFiles({})
  }, [setGistsData])

  const handleSetTypes = useCallback(async (type: 'myGists' | 'allGists', value: string) => {
    setTypes((prev) => ({ ...prev, [type]: value }))
  }, [])

  return (
    <GistContext.Provider
      value={{
        gists,
        setGists,
        onGetGists,
        error,
        selectedGist,
        onSearch,
        onSelectGist,
        selectedGistId,
        gistType: gistAccessType,
        setGistType: setGistAccessType,
        types,
        handleSetTypes,
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
        handleResetData,
        onDownloadOriginal,
        onDownloadPackageMD,
        handleDownloadPDF,
        isLoading,
        setIsLoading,
        contentRef,
      }}>
      {children}
    </GistContext.Provider>
  )
}

export function useGist() {
  const context = useContext(GistContext)
  if (context === undefined) {
    throw new Error('useGist must be used within a GistProvider')
  }
  return context
}
