/**
 * Input validation utilities for API routes
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" }
  }
  return { valid: true }
}

export function validateTeamName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 255
}

export function validateProjectName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 255
}

export function validateTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 255
}

export function validateCommentContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 5000
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 5000)
}
