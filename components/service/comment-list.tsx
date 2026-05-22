'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { StarRating } from './star-rating'
import type { Comentario, Usuario } from '@/types'

interface CommentListProps {
  comments: (Comentario & { usuario: Usuario })[]
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aún no hay reseñas para este servicio.</p>
        <p className="text-sm">¡Sé el primero en dejar tu opinión!</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id_comentario}>
          <CardContent className="pt-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(comment.usuario.nombre)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h4 className="font-medium text-sm">{comment.usuario.nombre}</h4>
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(comment.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                  </time>
                </div>
                
                <StarRating rating={comment.calificacion} size="sm" />
                
                {comment.texto && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {comment.texto}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
