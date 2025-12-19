type GistType = 'public' | 'all'
interface GistFile {
  filename: string
  language: string | null
  raw_url: string
  type: string
  size: number
}
interface Gist {
  id: string
  description: string
  public: boolean
  created_at: string
  html_url: string
  owner: {
    login: string
    avatar_url: string
  }
  files: GistFile[]
}

interface SelectedGistFileProps extends Omit<Gist, 'files'> {
  filename: string
  language: string | null
  raw_url: string
  type: string
  size: number
}
interface GistItemProps {
  gist: Gist
  isSelected?: boolean
  onClick: () => void
}
interface FetchGistsParams {
  username?: string
  type?: GistType
}
interface GetAllGistsResponse {
  success: boolean
  error?: string
  data: Gist[]
  rawData?: any
}
interface FileContentDisplayProps {
  filename: string
  content: string
  language: string | null
}
