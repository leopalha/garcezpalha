'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Undo,
  Redo,
  Code,
  Eye,
} from 'lucide-react'
import { useState } from 'react'

interface TemplateEditorProps {
  template: {
    id: string
    name: string
    type: 'email' | 'whatsapp' | 'contract'
    category: string
    description: string
    subject?: string
    content: string
    variables: string[]
  }
  onSave: (template: any) => void
  onPreview: () => void
}

export function TemplateEditor({ template, onSave, onPreview }: TemplateEditorProps) {
  const [name, setName] = useState(template.name)
  const [subject, setSubject] = useState(template.subject || '')
  const [description, setDescription] = useState(template.description)
  const [category, setCategory] = useState(template.category)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #1E3A8A; text-decoration: underline;',
        },
      }),
      Placeholder.configure({
        placeholder: 'Digite o conteúdo do template aqui...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: template.content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  })

  const handleSave = () => {
    if (!editor) return

    const updatedTemplate = {
      ...template,
      name,
      subject,
      description,
      category,
      content: editor.getHTML(),
    }

    onSave(updatedTemplate)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Template</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Email de Boas-vindas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Onboarding"
          />
        </div>

        {template.type === 'email' && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subject">Assunto do Email</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Bem-vindo ao Garcez Palha!"
            />
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva quando este template deve ser usado"
            rows={2}
          />
        </div>
      </div>

      {/* Variables Available */}
      {template.variables.length > 0 && (
        <div className="space-y-2">
          <Label>Variáveis Disponíveis</Label>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((variable) => (
              <Badge key={variable} variant="secondary" className="font-mono text-xs">
                {`{{${variable}}}`}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Clique para copiar e cole no editor abaixo
          </p>
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="border rounded-lg">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-muted' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL:')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={editor.isActive('link') ? 'bg-muted' : ''}
          >
            <Link2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor Content */}
        <div className="border rounded-b-lg bg-white dark:bg-slate-950">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Salvar Template</Button>
        </div>
      </div>
    </div>
  )
}
