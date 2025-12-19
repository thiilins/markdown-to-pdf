interface GeneratePdfParams {
  html: string
  config: AppConfig
}

interface GeneratePdfResponse {
  success: boolean
  error?: string
  blob?: Blob
  filename?: string
}
