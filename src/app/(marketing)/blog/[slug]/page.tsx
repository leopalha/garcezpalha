'use client'

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog/get-posts'
import { MDXComponents } from '@/components/blog/mdx-components'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for all blog posts

// Generate metadata for SEO

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, 3)

  const publishedDate = new Date(post.datePublished)
  const formattedDate = format(publishedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })

  // JSON-LD structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Garcez Palha',
      logo: {
        '@type': 'ImageObject',
        url: 'https://garcezpalha.com/logo.png',
      },
    },
  }

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="py-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-8">
            <Button variant="ghost" asChild>
              <Link href="/blog" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar para o Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto mb-12">
            {/* Category Badge */}
            <div className="mb-4">
              <Badge variant="secondary" className="text-sm">
                {post.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-sm">{post.authorRole}</p>
                </div>
              </div>

              <Separator orientation="vertical" className="h-10" />

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{post.readingTime}</span>
              </div>

              <Button variant="outline" size="sm" className="gap-2 ml-auto">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="max-w-5xl mx-auto mb-12">
            <Image
              src={post.image.url}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              className="rounded-2xl w-full h-auto"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <MDXRemote
                source={post.content}
                components={MDXComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                      rehypeHighlight,
                    ],
                  },
                }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-heading text-lg font-semibold mb-4">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-start gap-6">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0"
                />
                <div>
                  <h3 className="font-heading text-2xl font-bold mb-2">Sobre o Autor</h3>
                  <p className="text-lg font-semibold text-primary mb-2">{post.author}</p>
                  <p className="text-muted-foreground mb-4">{post.authorRole}</p>
                  <Button asChild>
                    <Link href="/contato">Agendar Consulta</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl text-center">
              <h3 className="font-display text-3xl font-bold mb-4">
                Precisa de Ajuda Jurídica?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Com 364 anos de tradição familiar, estamos prontos para atender você com
                excelência e dedicação.
              </p>
              <Button size="lg" asChild>
                <Link href="/contato">Agendar Consulta Gratuita</Link>
              </Button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-6xl mx-auto mt-16">
              <h2 className="font-display text-3xl font-bold mb-8 text-center">
                Artigos Relacionados
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
                      <Image
                        src={relatedPost.image.url}
                        alt={relatedPost.image.alt}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-6">
                        <Badge variant="secondary" className="mb-3 text-xs">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="font-heading text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.description}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{relatedPost.readingTime}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  )
}
