'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/service'
import { TIPO_COLORS, TIPO_LABELS } from '@/types'
import { Heart, MapPin, ExternalLink, HeartOff } from 'lucide-react'

export default function FavoritosPage() {
  const { getUserFavorites, removeFavorite, getServiceAverageRating, getServiceImages } = useAppStore()
  const favoritos = getUserFavorites()

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mis Favoritos</h1>
        <p className="text-muted-foreground">
          Servicios médicos que has guardado
        </p>
      </div>

      {favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-muted rounded-full mb-4">
            <HeartOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No tienes favoritos</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            Explora el mapa y guarda los servicios médicos que te interesen para acceder a ellos rápidamente.
          </p>
          <Button asChild>
            <Link href="/">Explorar servicios</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoritos.map((servicio) => {
            const rating = getServiceAverageRating(servicio.id_servicio)
            const images = getServiceImages(servicio.id_servicio)
            const mainImage = images.find(img => img.es_principal) || images[0]

            return (
              <Card key={servicio.id_servicio} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  {mainImage ? (
                    <Image
                      src={mainImage.url_imagen}
                      alt={servicio.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 left-2"
                    style={{ 
                      backgroundColor: TIPO_COLORS[servicio.tipo], 
                      color: 'white' 
                    }}
                  >
                    {TIPO_LABELS[servicio.tipo]}
                  </Badge>
                </div>
                
                <CardContent className="pt-4">
                  <h3 className="font-semibold line-clamp-1 mb-1">{servicio.nombre}</h3>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{servicio.direccion}</span>
                  </div>
                  
                  {rating > 0 && (
                    <StarRating rating={rating} size="sm" showValue />
                  )}
                </CardContent>
                
                <CardFooter className="gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/servicios/${servicio.id_servicio}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeFavorite(servicio.id_servicio)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
