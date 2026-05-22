'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Navbar, MobileNav } from '@/components/layout'
import { FilterPanel } from '@/components/map'
import { PanicButton } from '@/components/emergency'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

// Dynamic import for Leaflet to avoid SSR issues
const ServiceMap = dynamic(
  () => import('@/components/map/service-map').then(mod => mod.ServiceMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center">
        <div className="text-muted-foreground">Cargando mapa...</div>
      </div>
    )
  }
)

export default function HomePage() {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Filter Panel */}
        <FilterPanel isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
        
        {/* Map Container */}
        <main className="flex-1 relative">
          {/* Filter Toggle Button - Mobile & Tablet */}
          <Button
            variant="default"
            size="sm"
            className="absolute top-4 left-4 z-10 lg:hidden shadow-lg"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <ServiceMap />
        </main>
      </div>

      <PanicButton />
      <MobileNav />
    </div>
  )
}
