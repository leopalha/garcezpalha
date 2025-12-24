import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog/get-posts'
import { BLOG_CATEGORIES } from '@/lib/blog/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog | Garcez Palha - Advocacia e Perícia',
  description: 'Insights, guias e novidades sobre direito, perícia e tecnologia jurídica. Artigos escritos por especialistas com 364 anos de tradição.',
  openGraph: {
    title: 'Blog Garcez Palha',
    description: 'Conteúdo especializado sobre direito, perícia e tecnologia jurídica',
    type: 'website',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-muted-foreground">
            Insights, guias e novidades sobre direito, perícia e tecnologia jurídica
          </p>
        </div>

        {/* Filtros por Categoria */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="default" size="sm">
              Todos
            </Button>
            {BLOG_CATEGORIES.map((category) => (
              <Button key={category} variant="outline" size="sm">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Artigos */}
        {posts.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-16">
            <p className="text-muted-foreground text-lg mb-6">
              Nossos primeiros artigos estão sendo publicados em breve!
            </p>
            <p className="text-muted-foreground">
              Enquanto isso, conheça nossos serviços ou entre em contato.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Button asChild>
                <Link href="/">Ver Serviços</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Post (primeiro post) */}
            {posts[0] && (
              <div className="max-w-6xl mx-auto mb-12">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto">
                      <Image
                        src={posts[0].image.url}
                        alt={posts[0].image.alt}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-secondary">
                        Destaque
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col">
                      <Badge variant="secondary" className="w-fit mb-4">
                        {posts[0].category}
                      </Badge>

                      <h2 className="font-display text-3xl font-bold mb-4">
                        {posts[0].title}
                      </h2>

                      <p className="text-muted-foreground mb-6 flex-grow line-clamp-3">
                        {posts[0].description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={posts[0].authorImage}
                            alt={posts[0].author}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span>{posts[0].author}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(posts[0].datePublished), "d 'de' MMM", {
                              locale: ptBR,
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {posts[0].readingTime}
                          </span>
                        </div>
                      </div>

                      <Button asChild className="w-full md:w-auto">
                        <Link href={`/blog/${posts[0].slug}`} className="gap-2">
                          Ler artigo completo
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Grid de Artigos */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(1).map((post) => (
                <Card
                  key={post.slug}
                  className="flex flex-col hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image.url}
                      alt={post.image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}
                      </span>
                    </div>

                    <CardTitle className="font-heading text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>

                    <CardDescription className="line-clamp-3">
                      {post.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{post.author}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.datePublished), 'd MMM', { locale: ptBR })}
                      </span>
                    </div>

                    <Button variant="ghost" className="w-full gap-2" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Ler mais
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Newsletter */}
        <div className="max-w-2xl mx-auto mt-16 text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8">
          <h3 className="font-display text-3xl font-bold mb-4">
            Receba nossos artigos por email
          </h3>
          <p className="text-muted-foreground mb-6">
            Cadastre-se para receber semanalmente conteúdo exclusivo sobre direito e perícia.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button>Inscrever</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Sem spam. Cancele quando quiser.</p>
        </div>
      </div>
    </div>
  )
}
