"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, Users, Zap, BarChart3 } from "lucide-react"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              TF
            </div>
            <h1 className="text-2xl font-bold text-foreground">TeamFlow</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-8 mb-20">
          <h2 className="text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto">
            The complete platform to collaborate and build
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Securely build, deploy, and scale the best web experiences with your team. Seamless teamwork for modern
            teams.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Explore Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <Zap className="w-6 h-6 text-accent mb-2" />
              <CardTitle className="text-lg">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Optimized performance with real-time updates across your team
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <Users className="w-6 h-6 text-accent mb-2" />
              <CardTitle className="text-lg">Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Seamless workflows and communication tools built-in</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <BarChart3 className="w-6 h-6 text-accent mb-2" />
              <CardTitle className="text-lg">Insights & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed analytics and project tracking dashboards</p>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CheckCircle2 className="w-6 h-6 text-accent mb-2" />
              <CardTitle className="text-lg">Always Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Enterprise-grade security with role-based access control</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-lg border border-border p-12 mb-20">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground mt-2">Faster time to deploy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">300%</div>
              <div className="text-sm text-muted-foreground mt-2">Increase in productivity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">6x</div>
              <div className="text-sm text-muted-foreground mt-2">Faster team collaboration</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground mt-2">Support available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-foreground">Ready to transform your workflow?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams using TeamFlow to collaborate seamlessly
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 TeamFlow. All rights reserved. Built with MySQL and Next.js.</p>
        </div>
      </footer>
    </div>
  )
}
