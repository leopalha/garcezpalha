import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function ErrorAlert({
  error,
  retry,
  title = 'Erro'
}: {
  error: Error | string
  retry?: () => void
  title?: string
}) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{errorMessage}</span>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry}>
            Tentar Novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
