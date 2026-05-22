'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { Navbar, MobileNav } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart, FileText, User, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

const sidebarLinks = [
  { href: '/dashboard/favoritos', label: 'Mis Favoritos', icon: Heart },
  { href: '/dashboard/mis-resenas', label: 'Mis Reseñas', icon: FileText },
  { href: '/dashboard/perfil', label: 'Mi Perfil', icon: User },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAppStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-64 border-r bg-card flex-col">
          <div className="p-4 border-b">
            <Button variant="ghost" size="sm" asChild>
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
        <main className="flex-1 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
