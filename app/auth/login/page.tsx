import { LoginForm } from '@/components/auth'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="p-2 rounded-lg bg-primary">
          <Activity className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-primary">MediApp</span>
      </Link>
      <LoginForm />
    </main>
  )
}
