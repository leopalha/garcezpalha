/**
 * Blog Post Utilities
 * Functions to read and process MDX blog posts
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { BlogPost, BlogPostMetadata } from './types'

const postsDirectory = path.join(process.cwd(), 'content/blog')

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  const slugs: string[] = []

  function traverseDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      return
    }

    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        traverseDirectory(fullPath)
      } else if (item.endsWith('.mdx')) {
        // Extract slug from filename
        const slug = item.replace(/\.mdx$/, '')
        slugs.push(slug)
      }
    }
  }

  traverseDirectory(postsDirectory)
  return slugs
}

/**
 * Helper function to find a file by slug
 */
function findFileBySlug(dir: string, slug: string, foundPath: { value: string | null }): void {
  if (!fs.existsSync(dir) || foundPath.value) {
    return
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    if (foundPath.value) break

    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      findFileBySlug(fullPath, slug, foundPath)
    } else if (item === `${slug}.mdx`) {
      foundPath.value = fullPath
    }
  }
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Find the file
    const foundPath = { value: null as string | null }
    findFileBySlug(postsDirectory, slug, foundPath)
    const filePath = foundPath.value

    if (!filePath) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // Calculate reading time
    const stats = readingTime(content)

    return {
      slug,
      title: data.title,
      description: data.description,
      author: data.author,
      authorRole: data.authorRole,
      authorImage: data.authorImage,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      category: data.category,
      tags: data.tags || [],
      image: data.image,
      readingTime: stats.text,
      featured: data.featured || false,
      seoKeywords: data.seoKeywords || [],
      content,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

/**
 * Get all blog posts
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const slugs = getAllPostSlugs()
  const posts: BlogPostMetadata[] = []

  for (const slug of slugs) {
    const post = await getPostBySlug(slug)
    if (post) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...metadata } = post
      posts.push(metadata)
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  })
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.category === category)
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.tags.includes(tag))
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.featured).slice(0, limit)
}

/**
 * Get related posts (same category, exclude current post)
 */
export async function getRelatedPosts(
  slug: string,
  category: string,
  limit: number = 3
): Promise<BlogPostMetadata[]> {
  const categoryPosts = await getPostsByCategory(category)
  return categoryPosts.filter(post => post.slug !== slug).slice(0, limit)
}

/**
 * Search posts by keyword
 */
export async function searchPosts(keyword: string): Promise<BlogPostMetadata[]> {
  const allPosts = await getAllPosts()
  const lowerKeyword = keyword.toLowerCase()

  return allPosts.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerKeyword) ||
      post.description.toLowerCase().includes(lowerKeyword) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
      post.category.toLowerCase().includes(lowerKeyword)
    )
  })
}
