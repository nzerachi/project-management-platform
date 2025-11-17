"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FolderOpen, Users } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { CreateTeamDialog } from "@/components/create-team-dialog"

interface Team {
  id: string
  name: string
  description: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateTeam, setShowCreateTeam] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    fetchTeams(token)
  }, [router])

  const fetchTeams = async (token: string) => {
    try {
      const res = await fetch("/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch teams")
      }

      const data = await res.json()
      setTeams(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    router.push("/")
  }

  const handleTeamCreated = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await fetchTeams(token)
    }
    setShowCreateTeam(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams</h1>
            <p className="text-muted-foreground mt-2">Manage your teams and projects</p>
          </div>
          <Button onClick={() => setShowCreateTeam(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Team
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No teams yet</p>
              <p className="text-sm text-muted-foreground mb-6">Create your first team to get started</p>
              <Button onClick={() => setShowCreateTeam(true)}>Create Team</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <Link key={team.id} href={`/dashboard/teams/${team.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-2">
                      <FolderOpen className="w-5 h-5 text-primary mt-1" />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="mt-1">{team.description || "No description"}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <CreateTeamDialog open={showCreateTeam} onOpenChange={setShowCreateTeam} onTeamCreated={handleTeamCreated} />
    </div>
  )
}
