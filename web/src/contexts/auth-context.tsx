"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, authenticateUser } from "@/lib/mock-auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user-data")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("auth-token")
        localStorage.removeItem("user-data")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const authenticatedUser = authenticateUser(email, password, role)

    if (authenticatedUser) {
      setUser(authenticatedUser)
      localStorage.setItem("auth-token", "mock-token-" + Date.now())
      localStorage.setItem("user-role", authenticatedUser.role)
      localStorage.setItem("user-data", JSON.stringify(authenticatedUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    localStorage.removeItem("user-data")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
