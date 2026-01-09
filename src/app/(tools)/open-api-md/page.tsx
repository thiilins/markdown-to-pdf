import type { Metadata } from 'next'
import { OpenApiPdfViewComponent } from './_components/view'

export const metadata: Metadata = {
  title: 'OpenAPI to PDF - Documentador de API | SuperTOOLS',
  description:
    'Converta especificações OpenAPI/Swagger em documentação profissional em PDF. Valida, resolve referências e gera manuais de API completos e formatados.',
  keywords: [
    'openapi',
    'swagger',
    'api documentation',
    'pdf generator',
    'api docs',
    'swagger parser',
    'openapi validator',
    'api manual',
    'rest api',
    'documentação api',
  ],
}

export default function OpenApiPdfPage() {
  return <OpenApiPdfViewComponent />
}
