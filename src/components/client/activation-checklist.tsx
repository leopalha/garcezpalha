'use client'

import { useState, useEffect } from 'react'
import { Check, X, ChevronDown, ChevronUp, Upload, Calendar, User, MessageSquare, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  link?: string
  linkText?: string
  icon: React.ElementType
}

interface ActivationChecklistProps {
  userId: string
  onComplete?: () => void
  className?: string
}

/**
 * Activation Checklist Component
 * Shows the client what they need to do to fully activate their account
 *
 * Checklist items:
 * 1. Complete profile
 * 2. Upload initial documents
 * 3. Schedule first meeting
 * 4. Read platform guide
 * 5. Send first message to lawyer
 */
export function ActivationChecklist({ userId, onComplete, className }: ActivationChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    loadChecklistStatus()
  }, [userId])

  const loadChecklistStatus = async () => {
    try {
      setIsLoading(true)

      // Fetch user's activation status
      const response = await fetch('/api/client/activation-status')
      if (!response.ok) throw new Error('Failed to fetch activation status')

      const data = await response.json()

      // Build checklist based on actual status
      const items: ChecklistItem[] = [
        {
          id: 'profile',
          title: 'Complete seu perfil',
          description: 'Adicione telefone, endereço e informações pessoais',
          completed: data.profileComplete || false,
          link: '/cliente/perfil',
          linkText: 'Completar perfil',
          icon: User
        },
        {
          id: 'documents',
          title: 'Envie documentos iniciais',
          description: 'RG, CPF e comprovante de residência',
          completed: data.documentsUploaded || false,
          link: '/cliente/documentos',
          linkText: 'Enviar documentos',
          icon: Upload
        },
        {
          id: 'meeting',
          title: 'Agende sua primeira conversa',
          description: 'Fale com seu advogado para alinhar expectativas',
          completed: data.meetingScheduled || false,
          link: '/cliente/casos', // Would link to schedule page
          linkText: 'Agendar reunião',
          icon: Calendar
        },
        {
          id: 'guide',
          title: 'Conheça a plataforma',
          description: 'Veja como acompanhar seu caso e usar as ferramentas',
          completed: data.guideViewed || false,
          link: '/cliente/dashboard?tour=start',
          linkText: 'Iniciar tour',
          icon: FileText
        },
        {
          id: 'message',
          title: 'Envie sua primeira mensagem',
          description: 'Tire dúvidas ou compartilhe informações com seu advogado',
          completed: data.messageSent || false,
          link: '/cliente/mensagens',
          linkText: 'Enviar mensagem',
          icon: MessageSquare
        }
      ]

      setChecklist(items)

      // Check if user dismissed this checklist
      const dismissed = localStorage.getItem(`activation-checklist-dismissed-${userId}`)
      setIsDismissed(dismissed === 'true')

    } catch (error) {
      console.error('Error loading checklist status:', error)
      // Set default checklist on error
      setChecklist([
        {
          id: 'profile',
          title: 'Complete seu perfil',
          description: 'Adicione telefone, endereço e informações pessoais',
          completed: false,
          link: '/cliente/perfil',
          linkText: 'Completar perfil',
          icon: User
        },
        {
          id: 'documents',
          title: 'Envie documentos iniciais',
          description: 'RG, CPF e comprovante de residência',
          completed: false,
          link: '/cliente/documentos',
          linkText: 'Enviar documentos',
          icon: Upload
        },
        {
          id: 'meeting',
          title: 'Agende sua primeira conversa',
          description: 'Fale com seu advogado para alinhar expectativas',
          completed: false,
          link: '/cliente/casos',
          linkText: 'Agendar reunião',
          icon: Calendar
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem(`activation-checklist-dismissed-${userId}`, 'true')
    setIsDismissed(true)
  }

  const completedCount = checklist.filter(item => item.completed).length
  const totalCount = checklist.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const isComplete = completedCount === totalCount

  // Don't show if dismissed or fully complete
  if (isDismissed || isComplete) {
    if (isComplete && onComplete) {
      onComplete()
    }
    return null
  }

  return (
    <Card className={cn('border-primary/20 bg-gradient-to-br from-primary/5 to-transparent', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">Ative sua conta</CardTitle>
              <Badge variant="secondary">
                {completedCount}/{totalCount}
              </Badge>
            </div>
            <CardDescription>
              Complete estas etapas para aproveitar ao máximo a plataforma
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {progress === 100
              ? 'Parabéns! Você completou todas as etapas 🎉'
              : `${Math.round(progress)}% completo`}
          </p>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3 pt-0">
          {isLoading ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Carregando checklist...
            </div>
          ) : (
            checklist.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    item.completed
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                      : 'bg-background border-border hover:bg-accent/50'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 rounded-full p-1 flex-shrink-0',
                      item.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item.completed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          className={cn(
                            'font-medium text-sm',
                            item.completed && 'line-through text-muted-foreground'
                          )}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      {!item.completed && item.link && (
                        <Link href={item.link}>
                          <Button variant="outline" size="sm" className="flex-shrink-0">
                            {item.linkText || 'Ir'}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {progress === 100 && (
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-900">
              <p className="font-medium text-green-900 dark:text-green-100 mb-1">
                Parabéns! Sua conta está totalmente ativada 🎉
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Agora você pode aproveitar todos os recursos da plataforma.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
