const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'content/blog');

function getAllPostSlugs() {
  const slugs = [];

  function traverseDirectory(dir) {
    if (!fs.existsSync(dir)) {
      console.log('Directory does not exist:', dir);
      return;
    }

    console.log('Traversing directory:', dir);
    const items = fs.readdirSync(dir);
    console.log('Items found:', items);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        console.log('Found subdirectory:', item);
        traverseDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        const slug = item.replace(/\.mdx$/, '');
        console.log('Found MDX file:', item, '-> slug:', slug);
        slugs.push(slug);
      }
    }
  }

  traverseDirectory(postsDirectory);
  return slugs;
}

const slugs = getAllPostSlugs();
console.log('\n=== RESULT ===');
console.log('Total posts found:', slugs.length);
console.log('Slugs:', slugs);
