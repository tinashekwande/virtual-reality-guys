"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Headset, ShieldCheck, AlertTriangle } from "lucide-react"

export default function AdminSetupPage() {
  const router = useRouter()
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/api/setup")
      .then(r => r.json())
      .then(d => setConfigured(d.configured))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirm) { setError("Passwords do not match"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return }

    setLoading(true)
    const res = await fetch("/api/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push("/admin/login"), 2000)
    } else {
      const d = await res.json()
      setError(d.error ?? "Setup failed")
    }
    setLoading(false)
  }

  if (configured === null) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Checking…</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Headset className="h-10 w-10 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">First-Time Setup</h1>
          <p className="text-muted-foreground mt-1">Virtual Reality Guys — Admin Portal</p>
        </div>

        {configured ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-lg font-semibold">Setup Already Complete</h2>
            <p className="text-muted-foreground text-sm">An admin account already exists. Please sign in instead.</p>
            <Button onClick={() => router.push("/admin/login")} className="w-full">Go to Login</Button>
          </div>
        ) : success ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-4">
            <ShieldCheck className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-lg font-semibold">Account Created!</h2>
            <p className="text-muted-foreground text-sm">Redirecting to login…</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8">
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Create your first admin account. This page will be locked after setup and can never be used again.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="setup-email">Admin Email</Label>
                <Input id="setup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@vrguys.co.za" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setup-password">Password</Label>
                <Input id="setup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="setup-confirm">Confirm Password</Label>
                <Input id="setup-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required />
              </div>
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? "Creating account…" : "Create Admin Account"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
