'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { StarRating } from '@/components/service'
import { Trash2, ExternalLink } from 'lucide-react'

export default function AdminComentariosPage() {
  const { comentarios, usuarios, servicios, deleteComment } = useAppStore()

  const getUsuario = (id: string) => usuarios.find(u => u.id_usuario === id)
  const getServicio = (id: string) => servicios.find(s => s.id_servicio === id)

  const sortedComentarios = [...comentarios].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestión de Comentarios</h1>
        <p className="text-muted-foreground">
          Administra las reseñas de los usuarios
        </p>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead className="hidden md:table-cell">Comentario</TableHead>
              <TableHead className="hidden lg:table-cell">Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComentarios.map((comentario) => {
              const usuario = getUsuario(comentario.id_usuario)
              const servicio = getServicio(comentario.id_servicio)

              return (
                <TableRow key={comentario.id_comentario}>
                  <TableCell>
                    <span className="font-medium">{usuario?.nombre || 'Usuario eliminado'}</span>
                  </TableCell>
                  <TableCell>
                    {servicio ? (
                      <Link 
                        href={`/servicios/${servicio.id_servicio}`}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {servicio.nombre}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Servicio eliminado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StarRating rating={comentario.calificacion} size="sm" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    {comentario.texto ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {comentario.texto}
                      </p>
                    ) : (
                      <span className="text-muted-foreground/50 text-sm">Sin comentario</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {format(new Date(comentario.fecha), "d MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar comentario?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente esta reseña de {usuario?.nombre}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteComment(comentario.id_comentario)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
