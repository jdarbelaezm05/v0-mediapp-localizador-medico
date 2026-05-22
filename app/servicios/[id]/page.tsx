'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useAppStore } from '@/store/app-store'
import { Navbar, MobileNav } from '@/components/layout'
import { ImageGallery, StarRating, RatingForm, CommentList } from '@/components/service'
import { LoginModal } from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TIPO_COLORS, TIPO_LABELS } from '@/types'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Heart, 
  Navigation,
  MessageSquare
} from 'lucide-react'

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [key, setKey] = useState(0)

  const { 
    getServiceById, 
    getServiceImages, 
    getServiceComments, 
    getServiceAverageRating,
    isAuthenticated,
    isFavorite,
    addFavorite,
    removeFavorite
  } = useAppStore()

  const service = getServiceById(id)
  
  if (!service) {
    notFound()
  }

  const images = getServiceImages(id)
  const comments = getServiceComments(id)
  const averageRating = getServiceAverageRating(id)
  const favorite = isFavorite(id)

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    if (favorite) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  const handleGetRoute = () => {
    window.open(
      `https://maps.google.com/?q=${service.latitud},${service.longitud}`,
      '_blank'
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button */}
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al mapa
            </Link>
          </Button>

          {/* Image Gallery */}
          <ImageGallery images={images} serviceName={service.nombre} />

          {/* Service Info */}
          <div className="mt-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-balance">{service.nombre}</h1>
                  <Badge 
                    style={{ 
                      backgroundColor: TIPO_COLORS[service.tipo] + '20', 
                      color: TIPO_COLORS[service.tipo] 
                    }}
                  >
                    {TIPO_LABELS[service.tipo]}
                  </Badge>
                </div>
                
                {averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} showValue />
                    <span className="text-sm text-muted-foreground">
                      ({comments.length} {comments.length === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={favorite ? 'default' : 'outline'}
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorite ? 'fill-current' : ''}`} />
                  {favorite ? 'Guardado' : 'Guardar favorito'}
                </Button>
                <Button variant="secondary" onClick={handleGetRoute}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Obtener ruta
                </Button>
              </div>
            </div>

            {/* Details Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Dirección</p>
                    <p className="text-sm text-muted-foreground">{service.direccion}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <a 
                      href={`tel:${service.telefono}`} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {service.telefono}
                    </a>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Horario</p>
                    <p className="text-sm text-muted-foreground">{service.horario}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">{service.descripcion}</p>
            </div>

            <Separator />

            {/* Rating Form */}
            <RatingForm 
              serviceId={id} 
              onSuccess={() => setKey(prev => prev + 1)} 
            />

            {/* Comments Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">
                  Reseñas ({comments.length})
                </h2>
              </div>
              <CommentList key={key} comments={comments} />
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        title="Inicia sesión para guardar"
        description="Necesitas una cuenta para guardar favoritos"
      />
    </div>
  )
}
