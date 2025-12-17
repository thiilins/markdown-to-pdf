'use server'

import { auth, signIn, signOut } from '@/auth'

export async function handleSignIn() {
  await signIn('github')
}

export async function handleSignOut() {
  await signOut()
}

export const getSession = async () => {
  return await auth()
}
