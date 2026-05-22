'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/service'
import { TIPO_COLORS, TIPO_LABELS } from '@/types'
import { FileText, ExternalLink, MapPin } from 'lucide-react'

export default function MisResenasPage() {
  const { user, getUserComments } = useAppStore()
  
  if (!user) return null

  const resenas = getUserComments(user.id_usuario)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mis Reseñas</h1>
        <p className="text-muted-foreground">
          Reseñas que has dejado en servicios médicos
        </p>
      </div>

      {resenas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No has dejado reseñas</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Visita los servicios médicos y comparte tu experiencia para ayudar a otros usuarios.
          </p>
          <Button asChild>
            <Link href="/">Explorar servicios</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {resenas.map((resena) => (
            <Card key={resena.id_comentario}>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Link 
                        href={`/servicios/${resena.servicio.id_servicio}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {resena.servicio.nombre}
                      </Link>
                      <Badge 
                        variant="secondary"
                        style={{ 
                          backgroundColor: TIPO_COLORS[resena.servicio.tipo] + '20', 
                          color: TIPO_COLORS[resena.servicio.tipo] 
                        }}
                      >
                        {TIPO_LABELS[resena.servicio.tipo]}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="line-clamp-1">{resena.servicio.direccion}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <StarRating rating={resena.calificacion} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(resena.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                    </div>

                    {resena.texto && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {resena.texto}
                      </p>
                    )}
                  </div>

                  <Button variant="outline" size="sm" asChild className="shrink-0">
                    <Link href={`/servicios/${resena.servicio.id_servicio}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver servicio
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
