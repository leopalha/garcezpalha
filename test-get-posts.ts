import { getAllPosts } from './src/lib/blog/get-posts'

async function testGetAllPosts() {
  console.log('Testing getAllPosts()...\n')

  try {
    const posts = await getAllPosts()

    console.log('✅ Success!')
    console.log('Total posts found:', posts.length)
    console.log('\n=== Posts metadata ===')

    posts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`)
      console.log(`   Slug: ${post.slug}`)
      console.log(`   Category: ${post.category}`)
      console.log(`   Author: ${post.author}`)
      console.log(`   Date: ${post.datePublished}`)
      console.log(`   Reading time: ${post.readingTime}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testGetAllPosts()
