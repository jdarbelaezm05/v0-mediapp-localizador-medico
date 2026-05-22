'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { Map, Search, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const { isAuthenticated } = useAppStore()
  const pathname = usePathname()

  const tabs = [
    { href: '/', icon: Map, label: 'Mapa' },
    { href: '/?search=true', icon: Search, label: 'Buscar' },
    { href: isAuthenticated ? '/dashboard/favoritos' : '/auth/login', icon: Heart, label: 'Favoritos' },
    { href: isAuthenticated ? '/dashboard/perfil' : '/auth/login', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href === '/' && pathname === '/') ||
            (tab.href.startsWith('/dashboard') && pathname.startsWith('/dashboard'))
          
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
