"use client"

import type React from "react"

import { useState } from "react"
import { mockDb } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X, LogOut, Settings } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const teams = mockDb.getTeams()
  const users = mockDb.getUsers()
  const currentUser = users[0]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                TF
              </div>
              <span className="font-bold text-sidebar-foreground">TeamFlow</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-6 overflow-auto">
          {/* Teams Section */}
          {sidebarOpen && (
            <div>
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">Teams</h3>
              <div className="space-y-2">
                {teams.map((team) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      {team.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          {sidebarOpen && (
            <div>
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    Projects
                  </Button>
                </Link>
                <Link href="/team">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    Team Members
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          {sidebarOpen && (
            <>
              <div className="px-3 py-2 text-xs">
                <p className="font-semibold text-sidebar-foreground">{currentUser.full_name}</p>
                <p className="text-sidebar-foreground/60 text-xs">{currentUser.email}</p>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
