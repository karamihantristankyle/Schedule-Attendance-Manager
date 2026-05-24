import { create } from 'zustand'
import type { LoginResponse, User } from '../../shared/types'

interface AuthState {
  token: string | null
  user: User | null
  setSession: (payload: LoginResponse) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setSession: ({ token, user }) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}))
