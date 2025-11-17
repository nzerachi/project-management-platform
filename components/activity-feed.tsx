"use client"

import type { Task } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDb } from "@/lib/mock-data"
import { Activity } from "lucide-react"

interface ActivityFeedProps {
  tasks: Task[]
}

export function ActivityFeed({ tasks }: ActivityFeedProps) {
  const comments = mockDb.getComments()

  // Combine recent activities
  const recentActivities = [
    ...comments.map((c) => ({
      type: "comment" as const,
      timestamp: c.created_at,
      user: mockDb.getUserById(c.user_id),
      task: mockDb.getTaskById(c.task_id),
      content: c.content,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, idx) => (
              <div key={idx} className="flex gap-4 pb-4 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">{activity.user?.full_name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.user?.full_name} commented on{" "}
                    <span className="text-primary font-semibold">{activity.task?.title}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{activity.content}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
