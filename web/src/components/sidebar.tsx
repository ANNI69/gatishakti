"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Train,
  BarChart3,
  Package,
  ClipboardList,
  TrendingUp,
  Settings,
  QrCode,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Components/RID", href: "/components", icon: Package },
  { name: "QR Scanner", href: "/scanner", icon: QrCode },
  { name: "Inspection Queue", href: "/inspection", icon: ClipboardList },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Integration Monitor", href: "/integration", icon: Settings },
  { name: "User Management", href: "/users", icon: Users, adminOnly: true },
]

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole = "railway-official" }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const filteredNavigation = navigation.filter((item) => !item.adminOnly || userRole === "admin")

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-sidebar-primary rounded-lg p-2">
              <Train className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">Railway Track</h2>
              <p className="text-xs text-sidebar-foreground/60">Management</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                    isCollapsed && "px-2",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn("flex items-center space-x-3 mb-3", isCollapsed && "justify-center")}>
          <div className="bg-sidebar-primary rounded-full p-2">
            <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {userRole === "admin"
                  ? "Administrator"
                  : userRole === "railway-official"
                    ? "Railway Official"
                    : userRole === "vendor"
                      ? "Vendor"
                      : "Inspector"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">user@railways.gov.in</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isCollapsed ? "px-2" : "justify-start",
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
