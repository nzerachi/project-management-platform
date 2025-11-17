// Mock data store for development - simulates MySQL database
// In production, this would be replaced with actual database calls

export interface User {
  id: number
  email: string
  full_name: string
  avatar_url: string
  role: "admin" | "user"
  status: "active" | "inactive" | "suspended"
  created_at: Date
}

export interface Team {
  id: number
  name: string
  description: string
  owner_id: number
  created_at: Date
}

export interface Project {
  id: number
  name: string
  description: string
  team_id: number
  owner_id: number
  status: "active" | "archived" | "completed"
  start_date: string
  end_date: string
  created_at: Date
}

export interface Task {
  id: number
  project_id: number
  title: string
  description: string
  status: "todo" | "in_progress" | "in_review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to: number | null
  created_by: number
  due_date: string
  created_at: Date
}

export interface Comment {
  id: number
  task_id: number
  user_id: number
  content: string
  created_at: Date
}

// Mock database store
const mockData = {
  users: [
    {
      id: 1,
      email: "admin@example.com",
      full_name: "Admin User",
      avatar_url: "/admin-interface.png",
      role: "admin" as const,
      status: "active" as const,
      created_at: new Date("2024-01-01"),
    },
    {
      id: 2,
      email: "alice@example.com",
      full_name: "Alice Johnson",
      avatar_url: "/alice-in-wonderland.png",
      role: "user" as const,
      status: "active" as const,
      created_at: new Date("2024-01-05"),
    },
    {
      id: 3,
      email: "bob@example.com",
      full_name: "Bob Smith",
      avatar_url: "/bob-portrait.png",
      role: "user" as const,
      status: "active" as const,
      created_at: new Date("2024-01-10"),
    },
    {
      id: 4,
      email: "carol@example.com",
      full_name: "Carol Davis",
      avatar_url: "/festive-carol-scene.png",
      role: "user" as const,
      status: "active" as const,
      created_at: new Date("2024-01-15"),
    },
  ] as User[],

  teams: [
    {
      id: 1,
      name: "Engineering Team",
      description: "Core product development team",
      owner_id: 1,
      created_at: new Date("2024-02-01"),
    },
    {
      id: 2,
      name: "Design Team",
      description: "UX/UI design and prototyping",
      owner_id: 1,
      created_at: new Date("2024-02-05"),
    },
    {
      id: 3,
      name: "Marketing Team",
      description: "Marketing and growth initiatives",
      owner_id: 2,
      created_at: new Date("2024-02-10"),
    },
  ] as Team[],

  projects: [
    {
      id: 1,
      name: "Mobile App MVP",
      description: "Build MVP for mobile platform",
      team_id: 1,
      owner_id: 2,
      status: "active" as const,
      start_date: "2025-01-15",
      end_date: "2025-03-31",
      created_at: new Date("2024-12-20"),
    },
    {
      id: 2,
      name: "Website Redesign",
      description: "Complete redesign of company website",
      team_id: 2,
      owner_id: 4,
      status: "active" as const,
      start_date: "2025-01-20",
      end_date: "2025-02-28",
      created_at: new Date("2024-12-22"),
    },
    {
      id: 3,
      name: "Q1 Marketing Campaign",
      description: "Q1 marketing initiatives and campaigns",
      team_id: 3,
      owner_id: 2,
      status: "active" as const,
      start_date: "2025-01-01",
      end_date: "2025-03-31",
      created_at: new Date("2024-12-15"),
    },
  ] as Project[],

  tasks: [
    {
      id: 1,
      project_id: 1,
      title: "Setup authentication",
      description: "Implement user authentication system",
      status: "in_progress" as const,
      priority: "high" as const,
      assigned_to: 3,
      created_by: 2,
      due_date: "2025-01-25",
      created_at: new Date("2025-01-10"),
    },
    {
      id: 2,
      project_id: 1,
      title: "Create dashboard",
      description: "Build main dashboard component",
      status: "todo" as const,
      priority: "high" as const,
      assigned_to: 2,
      created_by: 2,
      due_date: "2025-01-28",
      created_at: new Date("2025-01-10"),
    },
    {
      id: 3,
      project_id: 1,
      title: "API integration",
      description: "Integrate backend API",
      status: "todo" as const,
      priority: "medium" as const,
      assigned_to: 3,
      created_by: 2,
      due_date: "2025-02-01",
      created_at: new Date("2025-01-12"),
    },
    {
      id: 4,
      project_id: 2,
      title: "Homepage design",
      description: "Design homepage layout",
      status: "in_progress" as const,
      priority: "urgent" as const,
      assigned_to: 4,
      created_by: 4,
      due_date: "2025-02-10",
      created_at: new Date("2025-01-13"),
    },
    {
      id: 5,
      project_id: 2,
      title: "Brand guidelines",
      description: "Create brand style guide",
      status: "done" as const,
      priority: "high" as const,
      assigned_to: 4,
      created_by: 4,
      due_date: "2025-01-20",
      created_at: new Date("2025-01-08"),
    },
    {
      id: 6,
      project_id: 3,
      title: "Social media campaign",
      description: "Plan and execute social media campaign",
      status: "todo" as const,
      priority: "medium" as const,
      assigned_to: 3,
      created_by: 2,
      due_date: "2025-02-05",
      created_at: new Date("2025-01-11"),
    },
    {
      id: 7,
      project_id: 3,
      title: "Email marketing",
      description: "Create email marketing campaign",
      status: "in_review" as const,
      priority: "medium" as const,
      assigned_to: 2,
      created_by: 2,
      due_date: "2025-02-15",
      created_at: new Date("2025-01-14"),
    },
  ] as Task[],

  comments: [
    {
      id: 1,
      task_id: 1,
      user_id: 3,
      content: "Started working on this. Will have a prototype ready by tomorrow.",
      created_at: new Date("2025-01-14"),
    },
    {
      id: 2,
      task_id: 1,
      user_id: 2,
      content: "Looks good, let me know if you need any resources.",
      created_at: new Date("2025-01-15"),
    },
    {
      id: 3,
      task_id: 4,
      user_id: 4,
      content: "Draft homepage design completed. Waiting for feedback.",
      created_at: new Date("2025-01-16"),
    },
  ] as Comment[],
}

// Mock database functions
export const mockDb = {
  getUsers: (): User[] => mockData.users,
  getUserById: (id: number): User | undefined => mockData.users.find((u) => u.id === id),

  getTeams: (): Team[] => mockData.teams,
  getTeamById: (id: number): Team | undefined => mockData.teams.find((t) => t.id === id),
  getTeamsByUserId: (userId: number): Team[] => {
    // Return teams where user is a member
    return mockData.teams.filter((t) => t.owner_id === userId || mockData.users.some((u) => u.id === userId))
  },

  getProjects: (): Project[] => mockData.projects,
  getProjectById: (id: number): Project | undefined => mockData.projects.find((p) => p.id === id),
  getProjectsByTeamId: (teamId: number): Project[] => mockData.projects.filter((p) => p.team_id === teamId),

  getTasks: (): Task[] => mockData.tasks,
  getTaskById: (id: number): Task | undefined => mockData.tasks.find((t) => t.id === id),
  getTasksByProjectId: (projectId: number): Task[] => mockData.tasks.filter((t) => t.project_id === projectId),
  getTasksByUserId: (userId: number): Task[] => mockData.tasks.filter((t) => t.assigned_to === userId),

  getComments: (): Comment[] => mockData.comments,
  getCommentsByTaskId: (taskId: number): Comment[] => mockData.comments.filter((c) => c.task_id === taskId),

  // Mutations
  createTask: (task: Omit<Task, "id" | "created_at">): Task => {
    const newTask: Task = {
      ...task,
      id: Math.max(...mockData.tasks.map((t) => t.id), 0) + 1,
      created_at: new Date(),
    }
    mockData.tasks.push(newTask)
    return newTask
  },

  updateTask: (id: number, updates: Partial<Task>): Task | null => {
    const task = mockData.tasks.find((t) => t.id === id)
    if (!task) return null
    Object.assign(task, updates)
    return task
  },

  createComment: (comment: Omit<Comment, "id" | "created_at">): Comment => {
    const newComment: Comment = {
      ...comment,
      id: Math.max(...mockData.comments.map((c) => c.id), 0) + 1,
      created_at: new Date(),
    }
    mockData.comments.push(newComment)
    return newComment
  },
}
