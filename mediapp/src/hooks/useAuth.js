import { useState, useCallback } from 'react'

export default function useAuth() {
  const getToken = () => localStorage.getItem('token')
  const getUser = () => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  }

  const [token, setToken] = useState(getToken)
  const [user, setUser] = useState(getUser)

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = Boolean(token)

  return { token, user, login, logout, isAuthenticated }
}
