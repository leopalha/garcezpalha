import Link from 'next/link'
import { FileText, Calendar, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProcessCardProps {
  id: string
  number?: string | null
  title: string
  status: 'active' | 'pending' | 'completed' | 'archived'
  nextDeadline?: string
  lastUpdate: string
  court: string
}

const statusConfig = {
  active: { label: 'Em Andamento', variant: 'default' as const, color: 'bg-blue-500' },
  pending: { label: 'Aguardando', variant: 'secondary' as const, color: 'bg-yellow-500' },
  completed: { label: 'Concluído', variant: 'default' as const, color: 'bg-green-500' },
  archived: { label: 'Arquivado', variant: 'outline' as const, color: 'bg-gray-500' },
}

export function ProcessCard({
  id,
  number,
  title,
  status,
  nextDeadline,
  lastUpdate,
  court,
}: ProcessCardProps) {
  const config = statusConfig[status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            {number && <p className="text-sm text-muted-foreground">{number}</p>}
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{court}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Atualizado em {lastUpdate}</span>
          </div>
          {nextDeadline && (
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Próximo prazo: {nextDeadline}</span>
            </div>
          )}
        </div>

        <Button asChild className="w-full" variant="outline">
          <Link href={`/dashboard/processos/${id}`}>Ver Detalhes</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
