'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Clock,
  AlertCircle,
  Paperclip,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  FileType,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
  attachments?: TaskAttachment[]
}

type TaskAttachment = {
  id: string
  file_name: string
  file_size: number
  file_type: string
  storage_path: string
  uploaded_at: string
  uploaded_by: string
}

type KanbanBoardProps = {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  onRefresh: () => void
}

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-blue-100 text-blue-700 border-blue-300',
  high: 'bg-orange-100 text-orange-700 border-orange-300',
  urgent: 'bg-red-100 text-red-700 border-red-300',
}

const COLUMNS = [
  { id: 'todo', label: 'A Fazer', color: 'bg-gray-50 border-gray-200' },
  { id: 'in_progress', label: 'Em Andamento', color: 'bg-blue-50 border-blue-200' },
  { id: 'blocked', label: 'Bloqueadas', color: 'bg-red-50 border-red-200' },
  { id: 'completed', label: 'Concluídas', color: 'bg-green-50 border-green-200' },
] as const

export function KanbanBoard({ tasks, onUpdateTask, onRefresh }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null)
      return
    }

    await onUpdateTask(draggedTask.id, { status: newStatus as Task['status'] })
    setDraggedTask(null)
  }

  const handleFileUpload = async (taskId: string, files: FileList) => {
    setUploadingFiles((prev) => ({ ...prev, [taskId]: true }))

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append('files', file))
      formData.append('taskId', taskId)

      const response = await fetch('/api/tasks/attachments', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer upload')
      }

      onRefresh()
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload')
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [taskId]: false }))
    }
  }

  const handleDownloadAttachment = async (attachment: TaskAttachment) => {
    try {
      const response = await fetch(`/api/tasks/attachments/${attachment.id}`)
      if (!response.ok) throw new Error('Erro ao baixar arquivo')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.file_name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Erro ao baixar arquivo')
    }
  }

  const handleDeleteAttachment = async (taskId: string, attachmentId: string) => {
    if (!confirm('Deseja realmente excluir este anexo?')) return

    try {
      const response = await fetch(`/api/tasks/attachments/${attachmentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao excluir anexo')

      onRefresh()
      if (selectedTask?.id === taskId) {
        const updatedTask = tasks.find((t) => t.id === taskId)
        if (updatedTask) setSelectedTask(updatedTask)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erro ao excluir anexo')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return ImageIcon
    if (fileType.includes('pdf')) return FileText
    return FileType
  }

  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === 'completed' || status === 'cancelled') return false
    return new Date(dueDate) < new Date()
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id)

          return (
            <div
              key={column.id}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={cn('rounded-t-lg border-2 p-4', column.color)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {columnTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 min-h-[500px] border-2 border-t-0 rounded-b-lg p-2 space-y-2 bg-muted/20">
                {columnTasks.map((task) => {
                  const overdue = isOverdue(task.due_date, task.status)
                  const FileIconComponent = getFileIcon('')

                  return (
                    <Card
                      key={task.id}
                      className="cursor-move hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      onClick={() => setSelectedTask(task)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm line-clamp-2">
                            {task.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={cn('text-xs', PRIORITY_COLORS[task.priority])}
                          >
                            {task.priority === 'urgent'
                              ? 'Urgente'
                              : task.priority === 'high'
                              ? 'Alta'
                              : task.priority === 'medium'
                              ? 'Média'
                              : 'Baixa'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {task.due_date && (
                          <div
                            className={cn(
                              'flex items-center gap-1 text-xs',
                              overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                            )}
                          >
                            {overdue ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {new Date(task.due_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          {task.assigned_user ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {task.assigned_user.full_name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {task.assigned_user.full_name.split(' ')[0]}
                              </span>
                            </div>
                          ) : (
                            <div />
                          )}

                          {task.attachments && task.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Paperclip className="h-3 w-3" />
                              {task.attachments.length}
                            </div>
                          )}
                        </div>

                        {task.case && (
                          <div className="text-xs text-muted-foreground border-t pt-2">
                            Processo: {task.case.case_number}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}

                {columnTasks.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start justify-between gap-4">
                  <span className="flex-1">{selectedTask.title}</span>
                  <Badge className={cn('text-xs', PRIORITY_COLORS[selectedTask.priority])}>
                    {selectedTask.priority === 'urgent'
                      ? 'Urgente'
                      : selectedTask.priority === 'high'
                      ? 'Alta'
                      : selectedTask.priority === 'medium'
                      ? 'Média'
                      : 'Baixa'}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedTask.case && `Processo: ${selectedTask.case.case_number}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {selectedTask.description && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Descrição</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className="font-medium mt-1">
                      {selectedTask.status === 'todo'
                        ? 'A Fazer'
                        : selectedTask.status === 'in_progress'
                        ? 'Em Andamento'
                        : selectedTask.status === 'blocked'
                        ? 'Bloqueada'
                        : 'Concluída'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data Limite:</span>
                    <p className="font-medium mt-1">
                      {selectedTask.due_date
                        ? new Date(selectedTask.due_date).toLocaleDateString('pt-BR')
                        : 'Não definida'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsável:</span>
                    <p className="font-medium mt-1">
                      {selectedTask.assigned_user?.full_name || 'Não atribuída'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Criado por:</span>
                    <p className="font-medium mt-1">
                      {selectedTask.creator?.full_name || 'Desconhecido'}
                    </p>
                  </div>
                </div>

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">Anexos</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={uploadingFiles[selectedTask.id]}
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.multiple = true
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (files) handleFileUpload(selectedTask.id, files)
                        }
                        input.click()
                      }}
                    >
                      {uploadingFiles[selectedTask.id] ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Adicionar Arquivo
                        </>
                      )}
                    </Button>
                  </div>

                  {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTask.attachments.map((attachment) => {
                        const FileIcon = getFileIcon(attachment.file_type)
                        return (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileIcon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">
                                  {attachment.file_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(attachment.file_size)} •{' '}
                                  {new Date(attachment.uploaded_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownloadAttachment(attachment)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteAttachment(selectedTask.id, attachment.id)
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
                      Nenhum anexo. Clique em "Adicionar Arquivo" para fazer upload.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
