'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star, ThumbsUp, AlertCircle } from 'lucide-react'

const NPS_SCORES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function NPSPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.conversationId as string

  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if already submitted
  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const response = await fetch(`/api/nps/check?conversationId=${conversationId}`)
        const data = await response.json()
        if (data.submitted) {
          setSubmitted(true)
        }
      } catch (err) {
        console.error('Error checking NPS submission:', err)
      }
    }

    if (conversationId) {
      checkSubmission()
    }
  }, [conversationId])

  const handleSubmit = async () => {
    if (selectedScore === null) {
      setError('Por favor, selecione uma nota')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/nps/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          score: selectedScore,
          feedback: feedback.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar feedback')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting NPS:', err)
      setError('Erro ao enviar feedback. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'bg-red-100 hover:bg-red-200 text-red-900 border-red-300'
    if (score <= 8) return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300'
    return 'bg-green-100 hover:bg-green-200 text-green-900 border-green-300'
  }

  const getSelectedScoreColor = (score: number) => {
    if (score <= 6) return 'bg-red-600 hover:bg-red-700 text-white border-red-600'
    if (score <= 8) return 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600'
    return 'bg-green-600 hover:bg-green-700 text-white border-green-600'
  }

  const getScoreLabel = (score: number | null) => {
    if (score === null) return ''
    if (score <= 6) return 'Detrator - Precisa melhorar'
    if (score <= 8) return 'Neutro - Satisfatório'
    return 'Promotor - Excelente!'
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <ThumbsUp className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-900">Obrigado pelo seu feedback!</CardTitle>
            <CardDescription>
              Sua opinião é muito importante para continuarmos melhorando nossos serviços.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
              Voltar ao site
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#c9a227] rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Como você avalia nosso serviço?
          </CardTitle>
          <CardDescription>
            Sua opinião é fundamental para melhorarmos continuamente nossos serviços jurídicos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NPS Score Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Pouco provável</span>
              <span className="text-sm text-gray-600">Muito provável</span>
            </div>
            <p className="text-sm text-gray-700 mb-4 text-center font-medium">
              Em uma escala de 0 a 10, qual a probabilidade de você recomendar nossos serviços?
            </p>
            <div className="grid grid-cols-11 gap-2">
              {NPS_SCORES.map((score) => (
                <Button
                  key={score}
                  variant="outline"
                  className={`h-12 font-bold transition-all ${
                    selectedScore === score
                      ? getSelectedScoreColor(score)
                      : getScoreColor(score)
                  }`}
                  onClick={() => {
                    setSelectedScore(score)
                    setError(null)
                  }}
                >
                  {score}
                </Button>
              ))}
            </div>
            {selectedScore !== null && (
              <p className="text-center mt-3 font-medium text-gray-700">
                {getScoreLabel(selectedScore)}
              </p>
            )}
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentários adicionais (opcional)
            </label>
            <Textarea
              placeholder="Conte-nos mais sobre sua experiência..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedScore === null}
            className="w-full bg-[#c9a227] hover:bg-[#b8911f] text-white"
            size="lg"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Garcez Palha - Consultoria Jurídica & Pericial
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
