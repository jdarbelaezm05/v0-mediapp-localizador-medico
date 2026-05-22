'use client'

import Link from 'next/link'
import { useAppStore } from '@/store/app-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from '@/components/service'
import { TIPO_LABELS } from '@/types'
import { Users, Building2, MessageSquare, Star, ExternalLink } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

const CHART_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280']

export default function AdminReportesPage() {
  const { getStats } = useAppStore()
  const stats = getStats()

  const pieData = stats.serviciosPorTipo.map(item => ({
    name: TIPO_LABELS[item.tipo as keyof typeof TIPO_LABELS] || item.tipo,
    value: item.cantidad
  }))

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">
          Vista general de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servicios</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServicios}</div>
            <p className="text-xs text-muted-foreground">
              Servicios médicos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comentarios</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComentarios}</div>
            <p className="text-xs text-muted-foreground">
              Reseñas de usuarios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart - Services per Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Servicios por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.serviciosPorCategoria}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="categoria" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="cantidad" 
                    fill="#0EA5E9" 
                    radius={[4, 4, 0, 0]}
                    name="Cantidad"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribution by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Rated Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Top 5 Servicios Mejor Calificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topServicios.map((servicio, index) => (
              <div 
                key={servicio.id_servicio}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <div>
                    <Link 
                      href={`/servicios/${servicio.id_servicio}`}
                      className="font-medium hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {servicio.nombre}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {TIPO_LABELS[servicio.tipo]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={servicio.calificacion} size="sm" />
                  <span className="font-medium">{servicio.calificacion.toFixed(1)}</span>
                </div>
              </div>
            ))}
            
            {stats.topServicios.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No hay servicios con calificaciones aún
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
