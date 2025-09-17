"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Mock authentication check - replace with actual auth logic
    const token = localStorage.getItem("auth-token")
    const role = localStorage.getItem("user-role")

    if (!token) {
      router.push("/login")
      return
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push("/unauthorized")
      return
    }

    setIsAuthenticated(true)
    setUserRole(role)
  }, [router, allowedRoles])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
