'use client'

import { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { Navbar, MobileNav } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Users, Building2, MessageSquare, BarChart3, ArrowLeft, Shield } from 'lucide-react'

const sidebarLinks = [
  { href: '/admin/servicios', label: 'Servicios', icon: Building2 },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/comentarios', label: 'Comentarios', icon: MessageSquare },
  { href: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAppStore()
  const pathname = usePathname()
  const router = useRouter()

  const isAdmin = user?.rol === 'admin'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (!isAdmin) {
      router.push('/')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-64 border-r bg-card flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Panel Admin</span>
            </div>
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al mapa
              </Link>
            </Button>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-8 overflow-auto">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
