"use client"

import { use } from "react"
import { mockDb } from "@/lib/mock-data"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskCard } from "@/components/task-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const projectId = Number.parseInt(id)

  const project = mockDb.getProjectById(projectId)
  const tasks = mockDb.getTasksByProjectId(projectId)

  if (!project) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    in_review: tasks.filter((t) => t.status === "in_review"),
    done: tasks.filter((t) => t.status === "done"),
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${project.status === "active" ? "bg-green-500" : project.status === "completed" ? "bg-blue-500" : "bg-gray-500"}`}
            />
            <span className="text-sm font-medium capitalize text-muted-foreground">{project.status}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="text-muted-foreground">Start: {new Date(project.start_date).toLocaleDateString()}</span>
            <span className="text-muted-foreground">End: {new Date(project.end_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {(["todo", "in_progress", "in_review", "done"] as const).map((status) => (
              <div key={status}>
                <div className="mb-4">
                  <h3 className="font-semibold text-foreground capitalize">{status.replace("_", " ")}</h3>
                  <p className="text-xs text-muted-foreground">{tasksByStatus[status].length} tasks</p>
                </div>
                <div className="space-y-3">
                  {tasksByStatus[status].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
