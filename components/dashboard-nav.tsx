"use client"

import Link from "next/link"
import { LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardNavProps {
  onLogout: () => void
}

export function DashboardNav({ onLogout }: DashboardNavProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            TF
          </div>
          <Link href="/dashboard" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
            TeamFlow
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Button onClick={onLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
