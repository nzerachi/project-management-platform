"use client"

import type { Task } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { mockDb } from "@/lib/mock-data"
import { Calendar } from "lucide-react"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const assignee = mockDb.getUserById(task.assigned_to || 0)

  const priorityColors = {
    low: "text-blue-600 bg-blue-50",
    medium: "text-yellow-600 bg-yellow-50",
    high: "text-orange-600 bg-orange-50",
    urgent: "text-red-600 bg-red-50",
  }

  const statusColors = {
    todo: "border-l-gray-400",
    in_progress: "border-l-blue-400",
    in_review: "border-l-yellow-400",
    done: "border-l-green-400",
  }

  return (
    <Card
      className={`p-4 border-l-4 ${statusColors[task.status]} bg-card cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-sm text-foreground line-clamp-2">{task.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
        </div>

        {/* Task Meta */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
          </div>
          {assignee && (
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {assignee.full_name.charAt(0)}
            </div>
          )}
        </div>

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
