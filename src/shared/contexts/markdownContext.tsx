'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import {
  RefObject,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_MARKDOWN, DEFAULT_MARKDOWN_ITEM } from '../constants'
import { slugify } from '../utils/slugfy'
interface MarkdownItem {
  id: string
  content: string
  name: string
}
interface MarkdownContextType {
  list: MarkdownItem[]
  contentRef: RefObject<HTMLDivElement | null>
  onAddMarkdownList: (list: MarkdownItem[]) => void
  onAddMarkdown: (content?: string, name?: string) => void
  onDeleteMarkdown: (id: string) => void
  onUpdateMarkdown: (content?: string, name?: string) => Promise<void> | void
  onUpdateMarkdownById: (id: string, content?: string, name?: string) => Promise<void> | void
  onSelectMarkdown: (id: string) => void
  markdown: MarkdownItem | null
  onResetMarkdown: () => void
  openEditMeta: boolean
  setOpenEditMeta: (open: boolean) => void
  openCreateMeta: boolean
  setOpenCreateMeta: (open: boolean) => void
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined)

export function MarkdownProvider({ children }: { children: ReactNode }) {
  const [list, setList] = usePersistedStateInDB<MarkdownItem[]>(
    'markdown-list',
    DEFAULT_MARKDOWN_ITEM,
  )
  const [markdown, setMarkdown] = usePersistedStateInDB<MarkdownItem>(
    'markdown',
    DEFAULT_MARKDOWN_ITEM[0],
  )
  const [openEditMeta, setOpenEditMeta] = useState(false)
  const [openCreateMeta, setOpenCreateMeta] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
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

  const onDeleteMarkdown = useCallback(
    async (id: string) => {
      const cleanList = list.filter((markdown) => markdown.id !== id)
      const selected = markdown.id === id ? cleanList[0] : markdown
      await setList(list.filter((markdown) => markdown.id !== id))
      await setMarkdown(selected)
    },
    [setList, list, setMarkdown, markdown],
  )
  const onResetMarkdown = useCallback(async () => {
    await setMarkdown(DEFAULT_MARKDOWN_ITEM[0])
    await setList(DEFAULT_MARKDOWN_ITEM)
  }, [setMarkdown, setList])

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
