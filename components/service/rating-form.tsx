'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from './star-rating'
import { LoginModal } from '@/components/auth'
import { Loader2, Send } from 'lucide-react'

interface RatingFormProps {
  serviceId: string
  onSuccess?: () => void
}

export function RatingForm({ serviceId, onSuccess }: RatingFormProps) {
  const [calificacion, setCalificacion] = useState(0)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [error, setError] = useState('')

  const { user, isAuthenticated, addComment } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (calificacion === 0) {
      setError('Por favor selecciona una calificación')
      return
    }

    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    addComment({
      calificacion,
      texto,
      id_usuario: user!.id_usuario,
      id_servicio: serviceId
    })

    setCalificacion(0)
    setTexto('')
    setLoading(false)
    onSuccess?.()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calificar este servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Tu calificación *</Label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={calificacion}
                  size="lg"
                  interactive
                  onChange={setCalificacion}
                />
                {calificacion > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {calificacion} de 5 estrellas
                  </span>
                )}
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comentario">Comentario (opcional)</Label>
              <Textarea
                id="comentario"
                placeholder="Comparte tu experiencia con este servicio..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Reseña
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        title="Inicia sesión para calificar"
        description="Necesitas una cuenta para dejar tu reseña"
      />
    </>
  )
}
