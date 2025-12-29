# API Utilities

Utilitários centralizados para API routes do Next.js.

## Error Handling

### Uso Básico

```typescript
import { handleAPIError, successResponse, APIErrors } from '@/lib/api'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação manual
    if (!body.name) {
      throw APIErrors.ValidationError('Nome é obrigatório')
    }

    // Lógica da API
    const result = await createUser(body)

    // Resposta de sucesso
    return successResponse({ user: result }, 201)
  } catch (error) {
    return handleAPIError(error, 'POST /api/users')
  }
}
```

### Com HOC (Recomendado)

```typescript
import { withErrorHandler, successResponse, APIErrors } from '@/lib/api'
import { NextRequest } from 'next/server'

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json()

  if (!body.name) {
    throw APIErrors.ValidationError('Nome é obrigatório')
  }

  const result = await createUser(body)
  return successResponse({ user: result }, 201)
}, 'POST /api/users')
```

### Com Zod Validation

```typescript
import { z } from 'zod'
import { withErrorHandler, successResponse } from '@/lib/api'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export const POST = withErrorHandler(async (request) => {
  const body = await request.json()

  // ZodError será automaticamente capturado e formatado
  const validated = schema.parse(body)

  const result = await createUser(validated)
  return successResponse({ user: result }, 201)
})
```

## Tipos de Erro Disponíveis

### APIErrors Factory

```typescript
import { APIErrors } from '@/lib/api'

// 400 Bad Request
throw APIErrors.BadRequest('Parâmetros inválidos', { field: 'value' })

// 401 Unauthorized
throw APIErrors.Unauthorized()

// 403 Forbidden
throw APIErrors.Forbidden('Você não tem permissão')

// 404 Not Found
throw APIErrors.NotFound('Usuário')

// 409 Conflict
throw APIErrors.Conflict('Email já existe')

// 422 Validation Error
throw APIErrors.ValidationError('Dados inválidos', validationErrors)

// 429 Rate Limit
throw APIErrors.RateLimit()

// 500 Internal Server Error
throw APIErrors.Internal('Falha ao processar')

// 503 Service Unavailable
throw APIErrors.ServiceUnavailable('Banco de dados')
```

### Custom APIError

```typescript
import { APIError } from '@/lib/api'

throw new APIError(
  'Mensagem customizada',
  418,  // Status code
  'CUSTOM_CODE',
  { additional: 'data' }
)
```

## Formato de Resposta

### Erro

```json
{
  "error": "Erro de validação",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "path": "name",
      "message": "Required"
    }
  ],
  "timestamp": "2024-12-28T22:15:30.123Z"
}
```

### Sucesso

```json
{
  "user": {
    "id": "123",
    "name": "João Silva"
  }
}
```

## Tratamento Automático

O `handleAPIError` detecta e formata automaticamente:

- **Zod Validation Errors** → 422 com detalhes dos campos
- **PostgreSQL Unique Violations** → 409 Conflict
- **PostgreSQL Foreign Key Violations** → 400 Bad Request
- **Supabase Not Found** → 404
- **JavaScript Errors** → 500 (stack apenas em dev)
- **Unknown Errors** → 500

## Boas Práticas

### ✅ Bom

```typescript
// 1. Use withErrorHandler para auto-catch
export const POST = withErrorHandler(async (request) => {
  // ... lógica
})

// 2. Use APIErrors factory para clareza
throw APIErrors.NotFound('Produto')

// 3. Adicione contexto para logging
return handleAPIError(error, 'POST /api/checkout')

// 4. Use successResponse para consistência
return successResponse({ success: true }, 201)
```

### ❌ Evite

```typescript
// Não use NextResponse.json diretamente para erros
return NextResponse.json({ error: 'Erro' }, { status: 500 })

// Não capture erros silenciosamente
catch (error) {
  console.log(error) // Sem retornar resposta
}

// Não exponha detalhes internos em produção
return NextResponse.json({ error: error.stack })
```

## Exemplos Completos

### CRUD Route

```typescript
import { withErrorHandler, successResponse, APIErrors } from '@/lib/api'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

// CREATE
export const POST = withErrorHandler(async (request) => {
  const body = await request.json()
  const data = createSchema.parse(body)

  const supabase = getSupabaseAdmin()
  const { data: user, error } = await supabase
    .from('users')
    .insert(data)
    .select()
    .single()

  if (error) throw error // Auto-handled

  return successResponse({ user }, 201)
}, 'POST /api/users')

// READ
export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    throw APIErrors.BadRequest('ID é obrigatório')
  }

  const supabase = getSupabaseAdmin()
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') {
    throw APIErrors.NotFound('Usuário')
  }
  if (error) throw error

  return successResponse({ user })
}, 'GET /api/users')
```

## Logging e Monitoramento

Em produção, os erros são automaticamente logados no console. Para integrar com serviços de monitoramento (Sentry, DataDog, etc.):

```typescript
// Modifique handleAPIError em error-handler.ts
console.error('[API Error]', error)

// Adicione integração:
if (process.env.NODE_ENV === 'production') {
  Sentry.captureException(error, { extra: { context } })
}
```
