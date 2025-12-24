const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readingTime = require('reading-time');

const postsDirectory = path.join(process.cwd(), 'content/blog');

function getAllPostSlugs() {
  const slugs = [];

  function traverseDirectory(dir) {
    if (!fs.existsSync(dir)) {
      console.log('Directory does not exist:', dir);
      return;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        const slug = item.replace(/\.mdx$/, '');
        slugs.push(slug);
      }
    }
  }

  traverseDirectory(postsDirectory);
  return slugs;
}

function findFileBySlug(dir, slug, foundPath) {
  if (!fs.existsSync(dir) || foundPath.value) {
    return;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (foundPath.value) break;

    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findFileBySlug(fullPath, slug, foundPath);
    } else if (item === `${slug}.mdx`) {
      foundPath.value = fullPath;
    }
  }
}

async function getPostBySlug(slug) {
  try {
    const foundPath = { value: null };
    findFileBySlug(postsDirectory, slug, foundPath);
    const filePath = foundPath.value;

    if (!filePath) {
      console.log(`❌ File not found for slug: ${slug}`);
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const stats = readingTime(content);

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
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error.message);
    return null;
  }
}

async function getAllPosts() {
  const slugs = getAllPostSlugs();
  console.log(`Found ${slugs.length} post slugs`);

  const posts = [];

  for (const slug of slugs) {
    console.log(`Reading post: ${slug}...`);
    const post = await getPostBySlug(slug);
    if (post) {
      const { content, ...metadata } = post;
      posts.push(metadata);
      console.log(`✅ Success: ${post.title}`);
    }
  }

  console.log(`\nTotal posts processed: ${posts.length}`);

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime();
  });
}

// Run test
getAllPosts().then(posts => {
  console.log('\n=== FINAL RESULTS ===');
  console.log('Total posts:', posts.length);
  console.log('\nPosts:');
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
  });
}).catch(error => {
  console.error('Error:', error);
});
