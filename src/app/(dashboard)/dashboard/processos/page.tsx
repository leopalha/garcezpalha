import { ProcessCard } from '@/components/dashboard/process-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function ProcessosPage() {
  const supabase = await createClient()

  // Fetch all processes from Supabase
  const { data: processData, error } = await supabase
    .from('process_alerts')
    .select('*')
    .order('created_at', { ascending: false })

  const processes = (processData || []).map((p: any) => ({
    id: p.id,
    number: p.process_number,
    title: p.description || 'Processo sem descrição',
    status: p.status as 'active' | 'pending' | 'completed',
    nextDeadline: p.deadline_date ? new Date(p.deadline_date).toLocaleDateString('pt-BR') : undefined,
    lastUpdate: new Date(p.created_at).toLocaleDateString('pt-BR'),
    court: p.tribunal || 'Não informado',
  }))

  return (
    <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou título do processo..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Em Andamento</SelectItem>
              <SelectItem value="pending">Aguardando</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Mais Filtros
          </Button>
        </div>

        {/* Process List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processes.map((process) => (
            <ProcessCard key={process.id} {...process} />
          ))}
        </div>

        {/* Empty State if no processes */}
        {processes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">Nenhum processo encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros de busca
            </p>
          </div>
        )}
    </div>
  )
}
