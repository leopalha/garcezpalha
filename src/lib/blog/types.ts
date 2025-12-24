/**
 * Blog Post Types and Interfaces
 */

export interface BlogAuthor {
  name: string
  role: string
  image: string
  bio?: string
}

export interface BlogImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  authorRole: string
  authorImage: string
  datePublished: string
  dateModified: string
  category: string
  tags: string[]
  image: BlogImage
  readingTime: string
  featured?: boolean
  seoKeywords?: string[]
  content: string
}

export interface BlogPostMetadata {
  slug: string
  title: string
  description: string
  author: string
  authorRole: string
  authorImage: string
  datePublished: string
  dateModified: string
  category: string
  tags: string[]
  image: BlogImage
  readingTime: string
  featured?: boolean
  seoKeywords?: string[]
}

export type BlogCategory =
  | 'Direito Imobiliario'
  | 'Direito do Consumidor'
  | 'Direito Trabalhista'
  | 'Direito Civil'
  | 'Direito Criminal'
  | 'Pericia Documental'
  | 'Pericia Medica'
  | 'Avaliacao de Imoveis'
  | 'Tecnologia Juridica'
  | 'Institucional'

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Direito Imobiliario',
  'Direito do Consumidor',
  'Direito Trabalhista',
  'Direito Civil',
  'Direito Criminal',
  'Pericia Documental',
  'Pericia Medica',
  'Avaliacao de Imoveis',
  'Tecnologia Juridica',
  'Institucional',
]

export const CATEGORY_SLUGS: Record<string, BlogCategory> = {
  'direito-imobiliario': 'Direito Imobiliario',
  'direito-consumidor': 'Direito do Consumidor',
  'direito-trabalhista': 'Direito Trabalhista',
  'direito-civil': 'Direito Civil',
  'direito-criminal': 'Direito Criminal',
  'pericia-documental': 'Pericia Documental',
  'pericia-medica': 'Pericia Medica',
  'avaliacao-imoveis': 'Avaliacao de Imoveis',
  'tecnologia-juridica': 'Tecnologia Juridica',
  'institucional': 'Institucional',
}

export const CATEGORY_TO_SLUG: Record<BlogCategory, string> = {
  'Direito Imobiliario': 'direito-imobiliario',
  'Direito do Consumidor': 'direito-consumidor',
  'Direito Trabalhista': 'direito-trabalhista',
  'Direito Civil': 'direito-civil',
  'Direito Criminal': 'direito-criminal',
  'Pericia Documental': 'pericia-documental',
  'Pericia Medica': 'pericia-medica',
  'Avaliacao de Imoveis': 'avaliacao-imoveis',
  'Tecnologia Juridica': 'tecnologia-juridica',
  'Institucional': 'institucional',
}
