// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth' // Importa do arquivo que criamos acima

export const { GET, POST } = handlers
