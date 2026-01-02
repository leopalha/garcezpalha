'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorAlert } from '@/components/ui/error-alert'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Ban,
  Plus,
  Filter,
  Search,
  CalendarClock,
  TrendingUp,
  LayoutGrid,
  List,
} from 'lucide-react'
import { KanbanBoard } from '@/components/admin/tasks/kanban-board'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Task = {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'blocked' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
  created_at: string
  assigned_user?: { id: string; full_name: string; email: string }
  creator?: { id: string; full_name: string }
  case?: { id: string; case_number: string; service_type: string }
}

type TaskStats = {
  total: number
  byStatus: {
    todo: number
    in_progress: number
    completed: number
    blocked: number
  }
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  overdue: number
  completionRate: number
}

const STATUS_CONFIG = {
  todo: { label: 'A Fazer', icon: Circle, color: 'text-gray-600', variant: 'secondary' as const },
  in_progress: { label: 'Em Andamento', icon: Clock, color: 'text-blue-600', variant: 'default' as const },
  blocked: { label: 'Bloqueada', icon: Ban, color: 'text-red-600', variant: 'destructive' as const },
  completed: { label: 'Concluída', icon: CheckCircle2, color: 'text-green-600', variant: 'default' as const },
  cancelled: { label: 'Cancelada', icon: AlertCircle, color: 'text-gray-400', variant: 'outline' as const },
}

const PRIORITY_CONFIG = {
  low: { label: 'Baixa', color: 'text-gray-500', variant: 'outline' as const },
  medium: { label: 'Média', color: 'text-blue-600', variant: 'secondary' as const },
  high: { label: 'Alta', color: 'text-orange-600', variant: 'default' as const },
  urgent: { label: 'Urgente', color: 'text-red-600', variant: 'destructive' as const },
}

export default function TarefasAdminPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
  })

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [filterStatus, filterPriority, searchQuery])

  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.set('status', filterStatus)
      if (filterPriority !== 'all') params.set('priority', filterPriority)
      if (searchQuery) params.set('search', searchQuery)
      params.set('limit', '100')

      const response = await fetch(`/api/tasks?${params}`)
      if (!response.ok) throw new Error('Erro ao carregar tarefas')

      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tasks/stats')
      if (!response.ok) return

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return

    setCreating(true)
    setError(null)

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority,
          dueDate: newTask.dueDate || null,
          status: 'todo',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar tarefa')
      }

      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' })
      setCreateDialogOpen(false)
      await fetchTasks()
      await fetchStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')

      await fetchTasks()
      await fetchStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR })
    } catch {
      return '-'
    }
  }

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === 'completed' || status === 'cancelled') return false
    return new Date(dueDate) < new Date()
  }

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Erro ao atualizar tarefa')

      await fetchTasks()
      await fetchStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Tarefas</h1>
          <p className="text-muted-foreground mt-1">
            Organize e acompanhe todas as tarefas do escritório
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
          </div>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Adicione uma nova tarefa para você ou sua equipe
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Ex: Revisar contrato do cliente X"
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Detalhes adicionais sobre a tarefa..."
                  rows={3}
                  disabled={creating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                    disabled={creating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data Limite</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    disabled={creating}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim() || creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Tarefa
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.byStatus.in_progress} em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.byStatus.completed} concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Precisam de atenção
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.byPriority.high + stats.byPriority.urgent}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.byPriority.urgent} urgentes
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tarefas..."
            className="pl-9"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="todo">A Fazer</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="blocked">Bloqueadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Prioridades</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* Error Alert */}
      {error && !createDialogOpen && (
        <ErrorAlert error={error} retry={fetchTasks} />
      )}

      {/* View Switcher - Kanban or Table */}
      {viewMode === 'kanban' ? (
        <KanbanBoard tasks={tasks} onUpdateTask={handleUpdateTask} onRefresh={fetchTasks} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="Nenhuma tarefa encontrada"
          description={
            filterStatus !== 'all' || filterPriority !== 'all' || searchQuery
              ? 'Tente ajustar os filtros'
              : 'Crie sua primeira tarefa para começar'
          }
          action={
            filterStatus === 'all' && filterPriority === 'all' && !searchQuery ? (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Data Limite</TableHead>
                <TableHead>Caso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const statusConfig = STATUS_CONFIG[task.status]
                const priorityConfig = PRIORITY_CONFIG[task.priority]
                const StatusIcon = statusConfig.icon
                const overdue = isOverdue(task.due_date, task.status)

                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityConfig.variant}>
                        {priorityConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.assigned_user?.full_name || (
                        <span className="text-muted-foreground">Não atribuída</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {overdue ? (
                        <span className="text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {formatDate(task.due_date)}
                        </span>
                      ) : (
                        formatDate(task.due_date)
                      )}
                    </TableCell>
                    <TableCell>
                      {task.case?.case_number || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleUpdateStatus(task.id, value)}
                      >
                        <SelectTrigger className="w-[140px] ml-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todo">A Fazer</SelectItem>
                          <SelectItem value="in_progress">Em Andamento</SelectItem>
                          <SelectItem value="blocked">Bloqueada</SelectItem>
                          <SelectItem value="completed">Concluída</SelectItem>
                          <SelectItem value="cancelled">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}

