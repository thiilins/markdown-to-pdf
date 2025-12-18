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

  // Search
  const [searchValue, setSearchValue] = useState('')
  const [searchType, setSearchType] = useState<{ description: boolean }>({ description: true })

  const OnChangeSearchType = (checked: boolean) => {
    setSearchType({ ...searchType, description: checked })
  }
  const filteredGists = useMemo(() => {
    return gists.filter((gist) => {
      const description = searchText(gist.description, searchValue)
      const files = gist.files.some((file) => searchText(file.filename, searchValue))
      return !searchType.description ? files : description || files
    })
  }, [gists, searchValue, searchType])

  const onGetGists = useCallback(
    async ({ username, type }: FetchGistsParams) => {
      setLoading(true)
      setError(null)
      setSelectedGist(null)

      try {
        const response = await GistService.getAll({ username, type })
        const data = response.data
        console.log('data', data)
        if (response.success) {
          setGists(data)
          if (data.length > 0) {
            toast.success(`${data.length} Gist(s) encontrado(s)`, { duration: 2000 })
          } else {
            toast.info('Nenhum Gist encontrado para os filtros informados.', { duration: 2000 })
          }
        } else {
          setError(response.error)
          setGists([])
          toast.error(response.error || 'Ocorreu um erro inesperado ao buscar Gists.', {
            duration: 4000,
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [setGists, setLoading, setError, setSelectedGist],
  )
  const onSearch = useCallback(
    async ({ username, type }: FetchGistsParams) => {
      if (!username || !username?.trim()) {
        toast.error('Digite um nome de usuário válido')
      }
      await onGetGists({ username, type })
    },
    [onGetGists],
  )

  const handleLoadFileContent = useCallback(
    async (file: GistFile) => {
      if (fileContents[file.filename] || loadingFiles[file.filename]) {
        return
      }

      setLoadingFiles((prev) => ({ ...prev, [file.filename]: true }))

      try {
        const response = await fetch(file.raw_url)
        if (!response.ok) throw new Error('Falha ao carregar arquivo')
        const content = await response.text()
        setFileContents((prev) => ({ ...prev, [file.filename]: content }))
      } catch (error) {
        console.error(`Erro ao carregar ${file.filename}:`, error)
        setFileContents((prev) => ({
          ...prev,
          [file.filename]: `❌ Erro ao carregar o conteúdo do arquivo`,
        }))
      } finally {
        setLoadingFiles((prev) => ({ ...prev, [file.filename]: false }))
      }
    },
    [fileContents, loadingFiles],
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
    [setSelectedGist, handleLoadFileContent],
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
  }
  return <GistContext.Provider value={value}>{children}</GistContext.Provider>
}

export function useGist() {
  const context = useContext(GistContext)
  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider')
  }
  return context
}
