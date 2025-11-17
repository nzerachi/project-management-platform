"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ArrowLeft, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { DashboardNav } from "@/components/dashboard-nav"
import { CreateTaskDialog } from "@/components/create-task-dialog"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  assigned_to: string | null
}

export default function ProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.projectId as string
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateTask, setShowCreateTask] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    fetchTasks(token)
  }, [router, projectId])

  const fetchTasks = async (token: string) => {
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await res.json()
      setTasks(data || [])
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

  const handleTaskCreated = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await fetchTasks(token)
    }
    setShowCreateTask(false)
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "in_progress":
        return <AlertCircle className="w-5 h-5 text-blue-500" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive/10 text-destructive"
      case "high":
        return "bg-orange-100 text-orange-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-green-100 text-green-700"
    }
  }

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    review: tasks.filter((t) => t.status === "review"),
    done: tasks.filter((t) => t.status === "done"),
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-2">Manage tasks in this project</p>
          </div>
          <Button onClick={() => setShowCreateTask(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
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
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No tasks yet</p>
              <p className="text-sm text-muted-foreground mb-6">Create your first task to get started</p>
              <Button onClick={() => setShowCreateTask(true)}>Create Task</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(groupedTasks).map(([status, statusTasks]) => (
              <div key={status}>
                <h3 className="font-semibold text-foreground mb-3 capitalize">
                  {status.replace("_", " ")} ({statusTasks.length})
                </h3>
                <div className="space-y-2">
                  {statusTasks.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(task.status)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                            {task.priority && (
                              <div className="mt-2">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateTaskDialog
        projectId={projectId}
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  )
}
