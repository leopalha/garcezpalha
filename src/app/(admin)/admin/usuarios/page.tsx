'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Search,
  Users,
  UserCheck,
  UserCog,
  Shield,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/components/ui/use-toast'

const roleColors: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  lawyer: 'bg-blue-100 text-blue-800',
  partner: 'bg-purple-100 text-purple-800',
  client: 'bg-green-100 text-green-800',
}

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  lawyer: 'Advogado',
  partner: 'Parceiro',
  client: 'Cliente',
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const { data: users, isLoading, refetch } = trpc.users.list.useQuery()
  const { data: stats } = trpc.users.stats.useQuery()
  const deleteMutation = trpc.users.delete.useMutation()

  const filteredUsers = users?.filter((user) => {
    const profile = Array.isArray(user.profiles) ? user.profiles[0] : user.profiles
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  }) || []

  const handleDeleteClick = (userId: string, email: string) => {
    setUserToDelete({ id: userId, email })
    setDeleteConfirmText('')
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    if (deleteConfirmText !== 'EXCLUIR') {
      toast({
        title: 'Confirmação incorreta',
        description: 'Digite exatamente "EXCLUIR" para confirmar',
        variant: 'destructive',
      })
      return
    }

    try {
      await deleteMutation.mutateAsync({ userId: userToDelete.id })
      toast({
        title: 'Usuário excluído',
        description: `${userToDelete.email} foi removido com sucesso.`,
      })
      refetch()
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message || 'Não foi possível excluir o usuário.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestão de Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie usuários, roles e permissões do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.admins || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Advogados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.lawyers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Parceiros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.partners || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.clients || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Roles</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
            <SelectItem value="lawyer">Advogados</SelectItem>
            <SelectItem value="partner">Parceiros</SelectItem>
            <SelectItem value="client">Clientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Lista de todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || roleFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Nenhum usuário cadastrado no sistema'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user: any) => {
                  const profile = Array.isArray(user.profiles) ? user.profiles[0] : user.profiles
                  return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium truncate">{user.email}</span>
                        </div>
                        <Badge className={roleColors[user.role] || 'bg-gray-100 text-gray-800'}>
                          {roleLabels[user.role] || user.role}
                        </Badge>
                      </div>

                      {profile?.full_name && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <UserCheck className="h-3 w-3" />
                          {profile.full_name}
                        </div>
                      )}

                      {profile?.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3" />
                          {profile.phone}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3" />
                        Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(user.id, user.email)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">⚠️ Excluir Usuário Permanentemente</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Você está prestes a excluir permanentemente o usuário:
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-mono font-semibold">{userToDelete?.email}</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">⚠️ ATENÇÃO: Esta ação é irreversível!</p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Todos os dados do usuário serão excluídos</li>
                  <li>• Processos, documentos e histórico serão perdidos</li>
                  <li>• Esta ação não pode ser desfeita</li>
                </ul>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Digite <span className="font-mono bg-yellow-100 px-1">EXCLUIR</span> para confirmar:
                </label>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Digite EXCLUIR"
                  className="font-mono"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setUserToDelete(null)
              setDeleteConfirmText('')
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteConfirmText !== 'EXCLUIR' || deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir Permanentemente'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
