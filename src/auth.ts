import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // Escopos necessários para ler Gists Privados e aumentar o rate-limit
      authorization: {
        params: {
          scope: 'read:user gist',
        },
      },
    }),
  ],
  callbacks: {
    // Transfere o Token do GitHub (account) para o JWT interno
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    // Transfere do JWT para a Sessão (acessível no front/back)
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
})
