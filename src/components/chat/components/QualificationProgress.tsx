/**
 * Qualification Progress Component
 * Exibe barra de progresso e badges para qualificação de leads
 */

'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import type { QualificationData } from '@/types/chat'
import { formatQualificationScore } from '@/lib/chat'

interface QualificationProgressProps {
  data: QualificationData
  className?: string
}

export function QualificationProgress({ data, className }: QualificationProgressProps) {
  const {
    score,
    questionsAnswered,
    totalQuestions,
    flags,
    isQualified,
  } = data

  const progressPercentage = totalQuestions > 0
    ? (questionsAnswered / totalQuestions) * 100
    : 0

  const scoreFormatted = formatQualificationScore(score)

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>
            Perguntas: {questionsAnswered}/{totalQuestions}
          </span>
          <span>Progresso: {Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {/* Qualification Badge */}
        {isQualified && (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Qualificado
          </Badge>
        )}

        {/* Score Badge */}
        <Badge variant="outline" className={scoreFormatted.color}>
          Score: {scoreFormatted.value}
        </Badge>

        {/* Flags Count */}
        {flags.length > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            {flags.length} {flags.length === 1 ? 'Flag' : 'Flags'}
          </Badge>
        )}
      </div>

      {/* Flags List (se houver) */}
      {flags.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <ul className="list-disc list-inside space-y-0.5">
            {flags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
