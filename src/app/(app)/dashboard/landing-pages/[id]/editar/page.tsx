'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Eye,
  Save,
  Undo,
  Redo,
  Settings,
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Video,
  FileText,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type SectionType = 'hero' | 'benefits' | 'testimonials' | 'cta' | 'form' | 'vsl' | 'text' | 'image'

interface Section {
  id: string
  type: SectionType
  title?: string
  subtitle?: string
  content?: string
  imageUrl?: string
  videoUrl?: string
  buttonText?: string
  buttonUrl?: string
  items?: string[]
  backgroundColor?: string
  textColor?: string
  order: number
}

interface LandingPageData {
  id: string
  title: string
  slug: string
  metaTitle: string
  metaDescription: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  sections: Section[]
}

const sectionTypeConfig: Record<SectionType, { label: string; icon: any; description: string }> = {
  hero: { label: 'Hero', icon: Layout, description: 'Seção principal com título e CTA' },
  vsl: { label: 'VSL', icon: Video, description: 'Video Sales Letter' },
  benefits: { label: 'Benefícios', icon: FileText, description: 'Lista de benefícios' },
  testimonials: { label: 'Depoimentos', icon: Type, description: 'Provas sociais' },
  form: { label: 'Formulário', icon: FileText, description: 'Formulário de captura' },
  cta: { label: 'Call-to-Action', icon: Layout, description: 'Botão de ação' },
  text: { label: 'Texto', icon: Type, description: 'Bloco de texto' },
  image: { label: 'Imagem', icon: ImageIcon, description: 'Imagem' },
}

const mockData: LandingPageData = {
  id: '1',
  title: 'Resolva seu Problema de Usucapião',
  slug: 'usucapiao',
  metaTitle: 'Usucapião Extraordinária - Silva Advogados',
  metaDescription: 'Resolva seu problema de usucapião em 60 dias com nossa assessoria especializada',
  primaryColor: '#0066CC',
  secondaryColor: '#003366',
  fontFamily: 'Inter',
  sections: [
    {
      id: '1',
      type: 'hero',
      title: 'Regularize Seu Imóvel com Usucapião',
      subtitle: 'Conquiste a propriedade do imóvel que você ocupa há anos de forma legal e segura',
      buttonText: 'Falar com Especialista',
      buttonUrl: '#contato',
      backgroundColor: '#0066CC',
      textColor: '#FFFFFF',
      order: 0,
    },
    {
      id: '2',
      type: 'benefits',
      title: 'Por que escolher nosso serviço?',
      items: [
        'Processo completo em até 60 dias',
        'Equipe especializada em direito imobiliário',
        'Acompanhamento em todas as etapas',
        'Documentação completa incluída',
      ],
      order: 1,
    },
    {
      id: '3',
      type: 'form',
      title: 'Solicite uma Consulta Gratuita',
      subtitle: 'Preencha o formulário e entraremos em contato',
      order: 2,
    },
  ],
}

export default function LandingPageEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [landingPage, setLandingPage] = useState<LandingPageData>(mockData)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const addSection = (type: SectionType) => {
    const newSection: Section = {
      id: Math.random().toString(36).substring(7),
      type,
      title: `Nova seção ${sectionTypeConfig[type].label}`,
      order: landingPage.sections.length,
    }

    setLandingPage({
      ...landingPage,
      sections: [...landingPage.sections, newSection],
    })
    setSelectedSection(newSection.id)
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setLandingPage({
      ...landingPage,
      sections: landingPage.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    })
  }

  const deleteSection = (sectionId: string) => {
    setLandingPage({
      ...landingPage,
      sections: landingPage.sections.filter((section) => section.id !== sectionId),
    })
    setSelectedSection(null)
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sections = [...landingPage.sections]
    const index = sections.findIndex((s) => s.id === sectionId)
    if (index === -1) return

    if (direction === 'up' && index > 0) {
      ;[sections[index], sections[index - 1]] = [sections[index - 1], sections[index]]
    } else if (direction === 'down' && index < sections.length - 1) {
      ;[sections[index], sections[index + 1]] = [sections[index + 1], sections[index]]
    }

    sections.forEach((section, i) => {
      section.order = i
    })

    setLandingPage({ ...landingPage, sections })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Call API to save landing page
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('Landing page salva com sucesso!')
    } catch (error) {
      alert('Erro ao salvar landing page')
    } finally {
      setSaving(false)
    }
  }

  const selectedSectionData = landingPage.sections.find((s) => s.id === selectedSection)

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="border-b bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            ← Voltar
          </Button>
          <div>
            <h1 className="text-xl font-bold">{landingPage.title}</h1>
            <p className="text-sm text-muted-foreground">/{landingPage.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab('preview')}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section List */}
        <div className="w-64 border-r bg-muted/30 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Seções</h3>
            <div className="space-y-2">
              {landingPage.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer hover:bg-background transition-colors',
                    selectedSection === section.id ? 'bg-background shadow-sm' : 'bg-card'
                  )}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {sectionTypeConfig[section.type].label}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium truncate">{section.title || 'Sem título'}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveSection(section.id, 'up')
                      }}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveSection(section.id, 'down')
                      }}
                      disabled={index === landingPage.sections.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 ml-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSection(section.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Adicionar Seção</p>
              <div className="space-y-1">
                {Object.entries(sectionTypeConfig).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addSection(type as SectionType)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-y-auto bg-muted/10">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full">
            <TabsContent value="edit" className="mt-0 h-full">
              <div className="max-w-4xl mx-auto p-6">
                {selectedSectionData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Editando: {sectionTypeConfig[selectedSectionData.type].label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Título</Label>
                        <Input
                          value={selectedSectionData.title || ''}
                          onChange={(e) =>
                            updateSection(selectedSectionData.id, { title: e.target.value })
                          }
                          placeholder="Título da seção"
                        />
                      </div>

                      {selectedSectionData.type !== 'image' && (
                        <div>
                          <Label>Subtítulo</Label>
                          <Input
                            value={selectedSectionData.subtitle || ''}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, { subtitle: e.target.value })
                            }
                            placeholder="Subtítulo (opcional)"
                          />
                        </div>
                      )}

                      {(selectedSectionData.type === 'text' ||
                        selectedSectionData.type === 'testimonials') && (
                        <div>
                          <Label>Conteúdo</Label>
                          <Textarea
                            value={selectedSectionData.content || ''}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, { content: e.target.value })
                            }
                            rows={6}
                            placeholder="Conteúdo da seção"
                          />
                        </div>
                      )}

                      {selectedSectionData.type === 'benefits' && (
                        <div>
                          <Label>Benefícios (um por linha)</Label>
                          <Textarea
                            value={selectedSectionData.items?.join('\n') || ''}
                            onChange={(e) => {
                              const items = e.target.value
                                .split('\n')
                                .map((item) => item.trim())
                                .filter((item) => item.length > 0)
                              updateSection(selectedSectionData.id, { items })
                            }}
                            rows={6}
                            placeholder="Digite um benefício por linha"
                          />
                        </div>
                      )}

                      {selectedSectionData.type === 'vsl' && (
                        <div>
                          <Label>URL do Vídeo (YouTube ou Vimeo)</Label>
                          <Input
                            value={selectedSectionData.videoUrl || ''}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, { videoUrl: e.target.value })
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                      )}

                      {selectedSectionData.type === 'image' && (
                        <div>
                          <Label>URL da Imagem</Label>
                          <Input
                            value={selectedSectionData.imageUrl || ''}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, { imageUrl: e.target.value })
                            }
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {(selectedSectionData.type === 'hero' || selectedSectionData.type === 'cta') && (
                        <>
                          <div>
                            <Label>Texto do Botão</Label>
                            <Input
                              value={selectedSectionData.buttonText || ''}
                              onChange={(e) =>
                                updateSection(selectedSectionData.id, { buttonText: e.target.value })
                              }
                              placeholder="Ex: Falar com Especialista"
                            />
                          </div>
                          <div>
                            <Label>Link do Botão</Label>
                            <Input
                              value={selectedSectionData.buttonUrl || ''}
                              onChange={(e) =>
                                updateSection(selectedSectionData.id, { buttonUrl: e.target.value })
                              }
                              placeholder="#contato ou URL completa"
                            />
                          </div>
                        </>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cor de Fundo</Label>
                          <Input
                            type="color"
                            value={selectedSectionData.backgroundColor || '#FFFFFF'}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, {
                                backgroundColor: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Cor do Texto</Label>
                          <Input
                            type="color"
                            value={selectedSectionData.textColor || '#000000'}
                            onChange={(e) =>
                              updateSection(selectedSectionData.id, { textColor: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Selecione uma seção para editar ou adicione uma nova
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0 h-full">
              <div className="bg-white h-full overflow-y-auto">
                {landingPage.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => (
                    <div
                      key={section.id}
                      style={{
                        backgroundColor: section.backgroundColor || '#FFFFFF',
                        color: section.textColor || '#000000',
                      }}
                      className="py-12 px-6"
                    >
                      <div className="max-w-4xl mx-auto">
                        {section.type === 'hero' && (
                          <div className="text-center space-y-4">
                            <h1 className="text-5xl font-bold">{section.title}</h1>
                            <p className="text-xl">{section.subtitle}</p>
                            {section.buttonText && (
                              <Button size="lg" className="mt-6">
                                {section.buttonText}
                              </Button>
                            )}
                          </div>
                        )}

                        {section.type === 'benefits' && (
                          <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-center">{section.title}</h2>
                            <ul className="grid md:grid-cols-2 gap-4">
                              {section.items?.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-500 text-xl">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {section.type === 'form' && (
                          <div className="max-w-md mx-auto space-y-4">
                            <h2 className="text-3xl font-bold text-center">{section.title}</h2>
                            <p className="text-center">{section.subtitle}</p>
                            <div className="space-y-3 bg-white p-6 rounded-lg shadow-lg">
                              <Input placeholder="Nome completo" />
                              <Input type="email" placeholder="Email" />
                              <Input type="tel" placeholder="Telefone" />
                              <Button className="w-full">Enviar</Button>
                            </div>
                          </div>
                        )}

                        {section.type === 'vsl' && section.videoUrl && (
                          <div className="aspect-video max-w-3xl mx-auto">
                            <iframe
                              src={section.videoUrl}
                              className="w-full h-full rounded-lg"
                              allowFullScreen
                            />
                          </div>
                        )}

                        {section.type === 'text' && (
                          <div className="prose max-w-none">
                            <h2>{section.title}</h2>
                            <p>{section.content}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-72 border-l bg-muted/30 overflow-y-auto">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações da Página
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Título da Página</Label>
                  <Input
                    value={landingPage.title}
                    onChange={(e) => setLandingPage({ ...landingPage, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Slug (URL)</Label>
                  <Input
                    value={landingPage.slug}
                    onChange={(e) => setLandingPage({ ...landingPage, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Meta Título (SEO)</Label>
                  <Input
                    value={landingPage.metaTitle}
                    onChange={(e) => setLandingPage({ ...landingPage, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Meta Descrição (SEO)</Label>
                  <Textarea
                    value={landingPage.metaDescription}
                    onChange={(e) =>
                      setLandingPage({ ...landingPage, metaDescription: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Estilo
              </h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Cor Primária</Label>
                  <Input
                    type="color"
                    value={landingPage.primaryColor}
                    onChange={(e) =>
                      setLandingPage({ ...landingPage, primaryColor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Cor Secundária</Label>
                  <Input
                    type="color"
                    value={landingPage.secondaryColor}
                    onChange={(e) =>
                      setLandingPage({ ...landingPage, secondaryColor: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Fonte</Label>
                  <Select
                    value={landingPage.fontFamily}
                    onValueChange={(value) =>
                      setLandingPage({ ...landingPage, fontFamily: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
