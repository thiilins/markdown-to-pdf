'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { GistService } from '@/services/gistService'
import { useSession } from 'next-auth/react'
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
import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_MARKDOWN, DEFAULT_MARKDOWN_ITEM } from '../constants'
import { downloadMarkdownFile, triggerDownload, wrapContentInMarkdown } from '../utils'
import { slugify } from '../utils/slugfy'

interface MarkdownItem {
  id: string
  content: string
  name: string
}

interface GistMetadata {
  gistId: string
  owner: string
  description: string
  isPublic: boolean
  originalFilename: string
}

interface MarkdownContextType {
  list: MarkdownItem[]
  contentRef: RefObject<HTMLDivElement | null>
  onAddMarkdownList: (list: MarkdownItem[]) => void
  onAddMarkdown: (content?: string, name?: string) => void
  onDeleteMarkdown: () => void
  onUpdateMarkdown: (content?: string, name?: string) => Promise<void> | void
  onUpdateMarkdownById: (id: string, content?: string, name?: string) => Promise<void> | void
  onSelectMarkdown: (id: string) => void
  markdown: MarkdownItem | null
  onResetMarkdown: () => void
  openEditMeta: boolean
  setOpenEditMeta: (open: boolean) => void
  openCreateMeta: boolean
  onDeleteMarkdownById: (id: string) => void
  setOpenCreateMeta: (open: boolean) => void
  openDeleteDocument: boolean
  setOpenDeleteDocument: (open: boolean) => void
  onDownloadPackageMD: (all?: boolean) => void
  onDownloadOriginal: () => void
  openDownloadDocument: boolean
  setOpenDownloadDocument: (open: boolean) => void
  // Gist functionality
  gistMetadataMap: Record<string, GistMetadata>
  currentGistId: string | null
  isGistMode: boolean
  canSaveGist: boolean
  openGistSaveModal: boolean
  setOpenGistSaveModal: (open: boolean) => void
  onLoadGistFromExplorer: (gist: Gist, fileContents: Record<string, string>) => Promise<void>
  onSaveAsGist: () => void
  onUpdateGist: () => void
  onClearGistMode: () => void
  handleSaveGist: (
    description: string,
    isPublic: boolean,
    files: Record<string, string>,
  ) => Promise<void>
  handleUpdateGist: (
    gistId: string,
    description: string,
    isPublic: boolean,
    files: Record<string, string>,
  ) => Promise<void>
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined)

export function MarkdownProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession()
  const [list, setList] = usePersistedStateInDB<MarkdownItem[]>(
    'markdown-list',
    DEFAULT_MARKDOWN_ITEM,
  )
  const [markdown, setMarkdown] = usePersistedStateInDB<MarkdownItem>(
    'markdown',
    DEFAULT_MARKDOWN_ITEM[0],
  )
  const [gistMetadataMap, setGistMetadataMap] = usePersistedStateInDB<Record<string, GistMetadata>>(
    'gist-metadata-map',
    {},
  )
  const [currentGistId, setCurrentGistId] = usePersistedStateInDB<string | null>(
    'current-gist-id',
    null,
  )
  const [currentUserLogin, setCurrentUserLogin] = useState<string | null>(null)
  const [openEditMeta, setOpenEditMeta] = useState(false)
  const [openCreateMeta, setOpenCreateMeta] = useState(false)
  const [openDeleteDocument, setOpenDeleteDocument] = useState(false)
  const [openDownloadDocument, setOpenDownloadDocument] = useState(false)
  const [openGistSaveModal, setOpenGistSaveModal] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Busca o username do GitHub quando a sessão está disponível
  useEffect(() => {
    if (session?.accessToken && !currentUserLogin) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          if (data.login) {
            setCurrentUserLogin(data.login)
          }
        })
        .catch(() => {
          // Silenciosamente falha se não conseguir buscar
        })
    }
  }, [session?.accessToken, currentUserLogin])

  // Calcula isGistMode e canSaveGist
  const isGistMode = useMemo(() => {
    return currentGistId !== null && Object.keys(gistMetadataMap).length > 0
  }, [currentGistId, gistMetadataMap])

  const canSaveGist = useMemo(() => {
    if (!isGistMode || !currentGistId) return false
    if (sessionStatus !== 'authenticated') return false

    // Verifica se o usuário é dono de pelo menos um arquivo do gist
    const gistMetadata = Object.values(gistMetadataMap).find(
      (meta) => meta.gistId === currentGistId,
    )
    if (!gistMetadata) return false

    return !!(
      currentUserLogin &&
      gistMetadata.owner &&
      currentUserLogin.toLowerCase() === gistMetadata.owner.toLowerCase()
    )
  }, [isGistMode, currentGistId, gistMetadataMap, sessionStatus, currentUserLogin])
  const onAddMarkdown = useCallback(
    (content?: string, name?: string) => {
      const newContent = content || DEFAULT_MARKDOWN
      const newName = name || 'Documento ' + (list.length + 1).toString()
      const newItem = { id: uuidv4(), content: newContent, name: newName }
      setList([...list, newItem])
      setMarkdown(newItem)
    },
    [setList, list, setMarkdown],
  )

  const onSelectMarkdown = useCallback(
    (id: string) => {
      setMarkdown(list.find((m) => m.id === id) || DEFAULT_MARKDOWN_ITEM[0])
    },
    [setMarkdown, list],
  )

  const onUpdateMarkdown = useCallback(
    async (content?: string, name?: string) => {
      const newData = {
        ...markdown,
        ...(content ? { content } : {}),
        ...(name ? { name: slugify(name) } : {}),
      }
      await setList(list.map((m) => (m.id === markdown.id ? newData : m)))
      await setMarkdown(newData)
    },
    [setList, list, setMarkdown, markdown],
  )

  const onUpdateMarkdownById = useCallback(
    async (id: string, content?: string, name?: string) => {
      const listUpdated = list.map((m) =>
        m.id === id
          ? { ...m, ...(content ? { content } : {}), ...(name ? { name: slugify(name) } : {}) }
          : m,
      )
      await setList(listUpdated)
      await setMarkdown(
        id === markdown.id
          ? { ...markdown, ...(content ? { content } : {}), ...(name ? { name } : {}) }
          : markdown,
      )
    },
    [setList, list, setMarkdown, markdown],
  )

  const onResetMarkdown = useCallback(async () => {
    await setMarkdown(DEFAULT_MARKDOWN_ITEM[0])
    await setList(DEFAULT_MARKDOWN_ITEM)
    // Limpa todos os estados de gist
    await setGistMetadataMap({})
    await setCurrentGistId(null)
  }, [setMarkdown, setList, setGistMetadataMap, setCurrentGistId])
  const onDeleteMarkdownById = useCallback(
    async (id: string) => {
      const needReset = markdown?.id === id && list.length === 1
      const cleanList = list.filter((markdown) => markdown.id !== id)
      const selected = markdown.id === id ? cleanList[0] : markdown
      await setList(
        needReset ? DEFAULT_MARKDOWN_ITEM : list.filter((markdown) => markdown.id !== id),
      )
      await setMarkdown(needReset ? DEFAULT_MARKDOWN_ITEM[0] : selected)
    },
    [setList, list, setMarkdown, markdown],
  )
  const onDownloadPackageMD = useCallback(
    (all: boolean = false) => {
      if ((!all && !markdown) || (all && !list?.length)) {
        toast.error(all ? 'Lista de Markdowns não encontrada.' : 'Arquivo Markdown não encontrado.')
        return
      }
      let content = ''
      if (all) {
        content = list
          ?.map((file) => {
            const content = file.content
            if (!content) return ''
            const separator = `\n\n---\n### 📄 ${file.name}\n---\n\n`
            const wrapped = wrapContentInMarkdown(file.name, content)
            return separator + wrapped
          })
          .join('')
      } else {
        content = markdown?.content || ''
      }
      const filename = `${markdown?.name?.slice(0, 20) || 'markdown-completo'}.md`
      downloadMarkdownFile(content, filename)
      toast.success('Pacote Markdown gerado!')
      return
    },
    [markdown, list],
  )

  const onDownloadOriginal = useCallback(() => {
    if (!markdown?.content) {
      toast.error('Conteúdo ou arquivo não encontrado.')
      return
    }
    const currentContent = markdown?.content
    if (!currentContent) return toast.error('Conteúdo não carregado.')
    triggerDownload(currentContent, markdown?.name || '', 'text/plain')
    toast.success(`Download iniciado: ${markdown?.name || ''}`)
  }, [markdown?.content, markdown?.name])

  const onDeleteMarkdown = useCallback(async () => {
    if (!markdown.id) return
    // Remove metadados de gist se existirem
    if (gistMetadataMap[markdown.id]) {
      const newMap = { ...gistMetadataMap }
      delete newMap[markdown.id]
      await setGistMetadataMap(newMap)
      // Se não há mais arquivos do gist, limpa currentGistId
      const remainingGistFiles = Object.values(newMap).filter(
        (meta) => meta.gistId === currentGistId,
      )
      if (remainingGistFiles.length === 0) {
        await setCurrentGistId(null)
      }
    }
    await onDeleteMarkdownById(markdown.id)
  }, [
    onDeleteMarkdownById,
    markdown?.id,
    gistMetadataMap,
    setGistMetadataMap,
    currentGistId,
    setCurrentGistId,
  ])

  // Funções de Gist
  const onLoadGistFromExplorer = useCallback(
    async (gist: Gist, fileContents: Record<string, string>) => {
      try {
        // Converte arquivos do gist em MarkdownItem[]
        const markdownItems: MarkdownItem[] = gist.files.map((file) => {
          const content = fileContents[file.filename] || ''
          return {
            id: uuidv4(),
            content: content,
            name: file.filename,
          }
        })

        // Cria mapa de metadados
        const metadataMap: Record<string, GistMetadata> = {}
        markdownItems.forEach((item) => {
          metadataMap[item.id] = {
            gistId: gist.id,
            owner: gist.owner?.login || '',
            description: gist.description || '',
            isPublic: gist.public ?? true,
            originalFilename: item.name,
          }
        })

        // Adiciona na lista e salva metadados
        await setList(markdownItems)
        await setGistMetadataMap(metadataMap)
        await setCurrentGistId(gist.id)
        await setMarkdown(markdownItems[0] || DEFAULT_MARKDOWN_ITEM[0])

        toast.success(`Gist "${gist.description || gist.id}" carregado no editor!`)
      } catch (error) {
        console.error('Erro ao carregar gist:', error)
        toast.error('Erro ao carregar gist no editor')
      }
    },
    [setList, setGistMetadataMap, setCurrentGistId, setMarkdown],
  )

  const onSaveAsGist = useCallback(() => {
    if (sessionStatus !== 'authenticated') {
      toast.error('Faça login para salvar gists')
      return
    }
    setOpenGistSaveModal(true)
  }, [sessionStatus])

  const onUpdateGist = useCallback(() => {
    if (!isGistMode || !currentGistId) {
      toast.error('Nenhum gist carregado para atualizar')
      return
    }
    // Permite abrir o modal mesmo se não for dono (vai criar novo gist)
    // O modal vai decidir se cria novo ou atualiza baseado na ownership
    setOpenGistSaveModal(true)
  }, [isGistMode, currentGistId])

  const onClearGistMode = useCallback(async () => {
    await setGistMetadataMap({})
    await setCurrentGistId(null)
    toast.info('Modo gist desativado')
  }, [setGistMetadataMap, setCurrentGistId])

  // Função para salvar gist (criar novo)
  const handleSaveGist = useCallback(
    async (description: string, isPublic: boolean, files: Record<string, string>) => {
      try {
        const response = await GistService.create(description, files, isPublic)
        if (!response.success) {
          throw new Error(response.error || 'Erro ao criar gist')
        }
        toast.success('Gist criado com sucesso!')
        setOpenGistSaveModal(false)
        // Não entra em modo gist após criar (usuário pode continuar editando localmente)
      } catch (error) {
        console.error('Erro ao salvar gist:', error)
        throw error
      }
    },
    [],
  )

  // Função para atualizar gist existente
  const handleUpdateGist = useCallback(
    async (
      gistId: string,
      description: string,
      isPublic: boolean,
      files: Record<string, string>,
    ) => {
      try {
        const response = await GistService.update(gistId, description, isPublic, files)
        if (!response.success) {
          throw new Error(response.error || 'Erro ao atualizar gist')
        }
        toast.success('Gist atualizado com sucesso!')
        setOpenGistSaveModal(false)
        // Atualiza metadados se necessário
        if (response.data) {
          const updatedGist = response.data
          const newMetadataMap = { ...gistMetadataMap }
          Object.keys(newMetadataMap).forEach((itemId) => {
            if (newMetadataMap[itemId].gistId === gistId) {
              newMetadataMap[itemId] = {
                ...newMetadataMap[itemId],
                description: updatedGist.description || '',
                isPublic: updatedGist.public ?? true,
              }
            }
          })
          await setGistMetadataMap(newMetadataMap)
        }
      } catch (error) {
        console.error('Erro ao atualizar gist:', error)
        throw error
      }
    },
    [gistMetadataMap, setGistMetadataMap],
  )
  const contextValue = useMemo(
    () => ({
      list,
      onAddMarkdownList: setList,
      onAddMarkdown,
      contentRef,
      onDeleteMarkdown,
      onUpdateMarkdown,
      onUpdateMarkdownById,
      onSelectMarkdown,
      markdown,
      onResetMarkdown,
      openEditMeta,
      setOpenEditMeta,
      openCreateMeta,
      setOpenCreateMeta,
      onDeleteMarkdownById,
      openDeleteDocument,
      setOpenDeleteDocument,
      onDownloadPackageMD,
      onDownloadOriginal,
      openDownloadDocument,
      setOpenDownloadDocument,
      // Gist functionality
      gistMetadataMap,
      currentGistId,
      isGistMode,
      canSaveGist,
      openGistSaveModal,
      setOpenGistSaveModal,
      onLoadGistFromExplorer,
      onSaveAsGist,
      onUpdateGist,
      onClearGistMode,
      handleSaveGist,
      handleUpdateGist,
    }),
    [
      list,
      setList,
      onAddMarkdown,
      contentRef,
      onDeleteMarkdown,
      onUpdateMarkdown,
      onUpdateMarkdownById,
      onSelectMarkdown,
      markdown,
      onResetMarkdown,
      openEditMeta,
      setOpenEditMeta,
      openCreateMeta,
      setOpenCreateMeta,
      onDeleteMarkdownById,
      openDeleteDocument,
      setOpenDeleteDocument,
      onDownloadPackageMD,
      onDownloadOriginal,
      openDownloadDocument,
      setOpenDownloadDocument,
      gistMetadataMap,
      currentGistId,
      isGistMode,
      canSaveGist,
      openGistSaveModal,
      setOpenGistSaveModal,
      onLoadGistFromExplorer,
      onSaveAsGist,
      onUpdateGist,
      onClearGistMode,
      handleSaveGist,
      handleUpdateGist,
    ],
  )
  return <MarkdownContext.Provider value={contextValue}>{children}</MarkdownContext.Provider>
}

export function useMarkdown() {
  const context = useContext(MarkdownContext)
  if (context === undefined) {
    throw new Error('<useMarkdown> deve ser usado dentro de um MarkdownProvider')
  }
  return context
}
