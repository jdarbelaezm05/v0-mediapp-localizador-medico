'use client'

import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TIPO_LABELS, type TipoServicio } from '@/types'
import { X, Filter, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

const tipos: TipoServicio[] = ['hospital', 'clinica', 'farmacia', 'laboratorio', 'urgencias', 'eps', 'otro']

export function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const {
    categorias,
    selectedCategories,
    setSelectedCategories,
    selectedTipos,
    setSelectedTipos,
    minCalificacion,
    setMinCalificacion,
    abiertoAhora,
    setAbiertoAhora,
    resetFilters
  } = useAppStore()

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId))
    }
  }

  const handleTipoChange = (tipo: TipoServicio, checked: boolean) => {
    if (checked) {
      setSelectedTipos([...selectedTipos, tipo])
    } else {
      setSelectedTipos(selectedTipos.filter(t => t !== tipo))
    }
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedTipos.length > 0 || minCalificacion > 0 || abiertoAhora

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <aside className={cn(
        "fixed lg:static top-0 left-0 h-full w-80 bg-card border-r z-50 transition-transform duration-300 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="sticky top-0 bg-card z-10 p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Categorías */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categorias.map((categoria) => (
                <div key={categoria.id_categoria} className="flex items-center space-x-2">
                  <Checkbox
                    id={categoria.id_categoria}
                    checked={selectedCategories.includes(categoria.id_categoria)}
                    onCheckedChange={(checked) => handleCategoryChange(categoria.id_categoria, checked as boolean)}
                  />
                  <Label 
                    htmlFor={categoria.id_categoria}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {categoria.nombre}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tipo de servicio */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tipo de Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tipos.map((tipo) => (
                <div key={tipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={tipo}
                    checked={selectedTipos.includes(tipo)}
                    onCheckedChange={(checked) => handleTipoChange(tipo, checked as boolean)}
                  />
                  <Label 
                    htmlFor={tipo}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {TIPO_LABELS[tipo]}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Calificación mínima */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Calificación Mínima</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Slider
                value={[minCalificacion]}
                onValueChange={([value]) => setMinCalificacion(value)}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Cualquiera</span>
                <span className="font-medium text-foreground">
                  {minCalificacion > 0 ? `${minCalificacion}+ estrellas` : 'Sin filtro'}
                </span>
                <span>5 estrellas</span>
              </div>
            </CardContent>
          </Card>

          {/* Abierto ahora */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="abierto-ahora" className="text-sm font-medium cursor-pointer">
                  Abierto ahora
                </Label>
                <Switch
                  id="abierto-ahora"
                  checked={abiertoAhora}
                  onCheckedChange={setAbiertoAhora}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mostrar solo servicios disponibles en este momento
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>
    </>
  )
}
