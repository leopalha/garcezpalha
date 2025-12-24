'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Server,
  Lock,
  Zap,
  FileText,
  ChevronRight,
  Code,
  Shield,
  Clock
} from 'lucide-react'

interface ApiDoc {
  info: {
    title: string
    version: string
    description: string
  }
  endpoints: Record<string, unknown>
  authentication: {
    type: string
    description: string
    example: string
  }
  rateLimiting: {
    description: string
    defaults: Record<string, string>
  }
  errorResponses: Record<string, { description: string; example: object }>
}

export default function ApiDocsPage() {
  const [docs, setDocs] = useState<ApiDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => {
        setDocs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!docs) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load API documentation</p>
      </div>
    )
  }

  const methodColors: Record<string, string> = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-yellow-500',
    DELETE: 'bg-red-500',
    PATCH: 'bg-purple-500',
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{docs.info.title}</h1>
        <p className="text-muted-foreground text-lg mb-4">{docs.info.description}</p>
        <Badge variant="outline" className="text-sm">
          Version {docs.info.version}
        </Badge>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="ratelimit" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Rate Limiting
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Errors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {Object.entries(docs.endpoints).map(([category, endpoints]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize flex items-center gap-2">
                  <ChevronRight className="h-5 w-5" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeof endpoints === 'object' && endpoints !== null && 'method' in endpoints ? (
                  // Single endpoint
                  <EndpointCard
                    endpoint={endpoints as { method: string; path: string; description: string; auth: boolean }}
                    methodColors={methodColors}
                  />
                ) : (
                  // Multiple endpoints
                  Object.entries(endpoints as Record<string, { method: string; path: string; description: string; auth: boolean }>).map(([name, endpoint]) => (
                    <EndpointCard
                      key={name}
                      endpoint={endpoint}
                      methodColors={methodColors}
                      name={name}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication
              </CardTitle>
              <CardDescription>{docs.authentication.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Type</h4>
                <Badge>{docs.authentication.type}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Example</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>{docs.authentication.example}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratelimit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rate Limiting
              </CardTitle>
              <CardDescription>{docs.rateLimiting.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(docs.rateLimiting.defaults).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium capitalize">{key}</span>
                    <Badge variant="secondary">{value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <div className="space-y-4">
            {Object.entries(docs.errorResponses).map(([code, error]) => (
              <Card key={code}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant={parseInt(code) >= 500 ? 'destructive' : 'secondary'}>
                      {code}
                    </Badge>
                    {error.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>{JSON.stringify(error.example, null, 2)}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EndpointCard({
  endpoint,
  methodColors,
  name
}: {
  endpoint: { method: string; path: string; description: string; auth: boolean; requestBody?: object; responseExample?: object }
  methodColors: Record<string, string>
  name?: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <Badge className={`${methodColors[endpoint.method]} text-white`}>
          {endpoint.method}
        </Badge>
        <code className="font-mono text-sm flex-1">{endpoint.path}</code>
        {endpoint.auth && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Auth
          </Badge>
        )}
        <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>

      <p className="text-sm text-muted-foreground mt-2">{endpoint.description}</p>

      {expanded && (
        <div className="mt-4 space-y-4">
          {endpoint.requestBody && (
            <div>
              <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Request Body
              </h5>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                <code>{JSON.stringify(endpoint.requestBody, null, 2)}</code>
              </pre>
            </div>
          )}
          {endpoint.responseExample && (
            <div>
              <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Response Example
              </h5>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                <code>{JSON.stringify(endpoint.responseExample, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
