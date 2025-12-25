'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Service, SERVICES, formatCurrency } from '@/types/checkout'
import { cn } from '@/lib/utils'

interface ServiceSelectorProps {
  selectedServiceId: string | null
  onSelectService: (service: Service) => void
}

export function ServiceSelector({ selectedServiceId, onSelectService }: ServiceSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Escolha o Serviço</h2>
        <p className="text-muted-foreground mt-1">
          Selecione o serviço jurídico que melhor atende sua necessidade
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const isSelected = selectedServiceId === service.id
          const isHovered = hoveredId === service.id

          return (
            <Card
              key={service.id}
              className={cn(
                'relative cursor-pointer transition-all duration-200',
                'hover:shadow-lg hover:scale-[1.02]',
                isSelected && 'ring-2 ring-gold-500 shadow-lg'
              )}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectService(service)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="flex items-center justify-center w-8 h-8 bg-gold-500 rounded-full text-white shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge variant={service.category === 'bancario' || service.category === 'imobiliario' ? 'default' : 'secondary'}>
                    {service.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm mt-2">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-navy-900">
                      {formatCurrency(service.price)}
                    </span>
                    {service.category === 'automacao' && (
                      <span className="text-sm text-muted-foreground">/mês</span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 text-sm">
                    {service.features.slice(0, isHovered ? service.features.length : 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Estimated Delivery */}
                  {service.estimatedDelivery && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Prazo:</span> {service.estimatedDelivery}
                      </p>
                    </div>
                  )}

                  {/* Select Button */}
                  <Button
                    className={cn(
                      'w-full',
                      isSelected && 'bg-gold-500 hover:bg-gold-600'
                    )}
                    variant={isSelected ? 'default' : 'outline'}
                  >
                    {isSelected ? 'Selecionado' : 'Selecionar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Filter - Future Enhancement */}
      {/* <div className="flex gap-2 flex-wrap">
        <Badge variant="outline" className="cursor-pointer">
          Todos
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Consultoria
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Perícia
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Avaliação
        </Badge>
        <Badge variant="outline" className="cursor-pointer">
          Secretaria
        </Badge>
      </div> */}
    </div>
  )
}
