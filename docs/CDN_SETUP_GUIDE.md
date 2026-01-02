# CDN Setup Guide - D7-011

## Overview

This guide covers setting up a Content Delivery Network (CDN) for static assets to improve performance and reduce server load.

## Recommended CDN Providers

### 1. Vercel CDN (Built-in)

If deploying on Vercel, CDN is automatically enabled for all static assets.

**Automatic Features:**
- Global edge network (270+ locations)
- Automatic asset optimization
- Image optimization via Next.js Image component
- Automatic caching headers
- No configuration required

**To verify:**
```bash
# Check response headers for cache status
curl -I https://your-app.vercel.app/_next/static/...
# Look for: x-vercel-cache: HIT
```

### 2. CloudFlare CDN

**Setup:**

1. Create CloudFlare account at https://dash.cloudflare.com
2. Add your domain
3. Update DNS nameservers
4. Configure caching rules

**CloudFlare Configuration:**

```javascript
// cloudflare-config.js
module.exports = {
  // Cache Rules
  cacheRules: [
    {
      pattern: '/_next/static/*',
      cacheTtl: 31536000, // 1 year
      browserTtl: 31536000,
    },
    {
      pattern: '/public/*',
      cacheTtl: 86400, // 24 hours
      browserTtl: 86400,
    },
    {
      pattern: '/api/*',
      cacheTtl: 0, // No cache for API routes
      browserTtl: 0,
    },
  ],

  // Page Rules
  pageRules: [
    {
      url: '*/_next/static/*',
      settings: {
        cacheLevel: 'cache_everything',
        edgeCacheTtl: 31536000,
      },
    },
  ],

  // Security
  security: {
    level: 'medium',
    challengePassage: 900,
    browserIntegrityCheck: true,
  },

  // Performance
  performance: {
    minify: {
      html: true,
      css: true,
      js: true,
    },
    brotli: true,
    http2: true,
    http3: true,
  },
}
```

**Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_CDN_URL=https://cdn.yourdomain.com
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-api-token
```

### 3. AWS CloudFront

**Setup Steps:**

1. Create S3 bucket for static assets
2. Create CloudFront distribution
3. Configure origins and behaviors
4. Update Next.js config

**CloudFront Configuration:**

```javascript
// aws-cloudfront-config.json
{
  "DistributionConfig": {
    "CallerReference": "garcez-palha-cdn",
    "Comment": "CDN for Garcez Palha static assets",
    "Enabled": true,
    "Origins": {
      "Items": [
        {
          "Id": "S3-static-assets",
          "DomainName": "garcez-palha-assets.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": "origin-access-identity/cloudfront/..."
          }
        }
      ]
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-static-assets",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": ["GET", "HEAD"],
      "CachedMethods": ["GET", "HEAD"],
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      },
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000,
      "Compress": true
    },
    "PriceClass": "PriceClass_100",
    "ViewerCertificate": {
      "CloudFrontDefaultCertificate": false,
      "ACMCertificateArn": "arn:aws:acm:...",
      "SSLSupportMethod": "sni-only",
      "MinimumProtocolVersion": "TLSv1.2_2021"
    }
  }
}
```

## Next.js Configuration

Update `next.config.js` to use CDN:

```javascript
// next.config.js
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL

module.exports = {
  assetPrefix: CDN_URL || '',

  // Image optimization
  images: {
    domains: ['cdn.yourdomain.com'],
    loader: CDN_URL ? 'custom' : 'default',
    path: CDN_URL ? `${CDN_URL}/_next/image` : '/_next/image',
  },

  // Headers for static assets
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },
}
```

## Asset Upload Script

Create script to upload static assets to CDN:

```javascript
// scripts/upload-to-cdn.js
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET

async function uploadFile(filePath) {
  const fileContent = fs.readFileSync(filePath)
  const key = filePath.replace('.next/', '')

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: getContentType(filePath),
    CacheControl: getCacheControl(filePath),
  }

  try {
    await s3.upload(params).promise()
    console.log(`✓ Uploaded: ${key}`)
  } catch (error) {
    console.error(`✗ Failed: ${key}`, error.message)
  }
}

function getContentType(filePath) {
  const ext = path.extname(filePath)
  const types = {
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  }
  return types[ext] || 'application/octet-stream'
}

function getCacheControl(filePath) {
  if (filePath.includes('/_next/static/')) {
    return 'public, max-age=31536000, immutable'
  }
  return 'public, max-age=86400'
}

async function main() {
  const files = glob.sync('.next/static/**/*', { nodir: true })

  console.log(`📦 Uploading ${files.length} files to CDN...`)

  for (const file of files) {
    await uploadFile(file)
  }

  console.log('✅ Upload complete!')
}

main()
```

## Monitoring CDN Performance

```typescript
// src/lib/monitoring/cdn-stats.ts
import { createLogger } from '@/lib/logger'

const logger = createLogger('cdn-stats')

export interface CDNStats {
  requests: number
  bandwidth: number
  cacheHitRate: number
  avgResponseTime: number
}

export async function getCDNStats(): Promise<CDNStats> {
  // For CloudFlare
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return getCloudflareStats()
  }

  // For AWS CloudFront
  if (process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) {
    return getCloudfrontStats()
  }

  return {
    requests: 0,
    bandwidth: 0,
    cacheHitRate: 0,
    avgResponseTime: 0,
  }
}

async function getCloudflareStats(): Promise<CDNStats> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    }
  )

  const data = await response.json()

  return {
    requests: data.result.totals.requests.all,
    bandwidth: data.result.totals.bandwidth.all,
    cacheHitRate: data.result.totals.requests.cached / data.result.totals.requests.all,
    avgResponseTime: data.result.totals.pageviews.all,
  }
}

async function getCloudfrontStats(): Promise<CDNStats> {
  // Implement CloudFront stats using AWS SDK
  logger.info('[CDN Stats] CloudFront stats not implemented yet')
  return {
    requests: 0,
    bandwidth: 0,
    cacheHitRate: 0,
    avgResponseTime: 0,
  }
}
```

## Cache Invalidation

```typescript
// src/lib/cdn/invalidate.ts
export async function invalidateCDNCache(paths: string[]): Promise<void> {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    await invalidateCloudflareCache(paths)
  }

  if (process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) {
    await invalidateCloudfrontCache(paths)
  }
}

async function invalidateCloudflareCache(paths: string[]): Promise<void> {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: paths,
    }),
  })
}

async function invalidateCloudfrontCache(paths: string[]): Promise<void> {
  // Implement using AWS SDK
  const AWS = require('aws-sdk')
  const cloudfront = new AWS.CloudFront()

  await cloudfront.createInvalidation({
    DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: paths.length,
        Items: paths,
      },
    },
  }).promise()
}
```

## Testing CDN

```bash
# Test cache headers
curl -I https://your-domain.com/_next/static/chunks/main.js

# Expected headers:
# Cache-Control: public, max-age=31536000, immutable
# X-Cache: HIT (CloudFlare) or X-Cache: Hit from cloudfront (AWS)
# Age: 3600 (time in cache)

# Test image optimization
curl -I https://your-domain.com/_next/image?url=/logo.png&w=640&q=75

# Test different regions
curl -I https://your-domain.com/logo.png --resolve your-domain.com:443:104.18.0.0
```

## Performance Metrics

Expected improvements with CDN:

- **Static Asset Load Time**: 50-80% reduction
- **TTFB (Time to First Byte)**: 40-60% reduction
- **Bandwidth Costs**: 30-50% reduction
- **Global Latency**: <100ms from any region

## Cost Estimates

### Vercel CDN
- Free tier: 100 GB bandwidth
- Pro: $20/month (1 TB bandwidth)
- Enterprise: Custom pricing

### CloudFlare
- Free tier: Unlimited bandwidth
- Pro: $20/month (advanced features)
- Business: $200/month (priority support)

### AWS CloudFront
- Pay-as-you-go
- ~$0.085/GB for first 10 TB
- ~$0.020/GB after 5 PB
- Free tier: 1 TB/month for 12 months

## Deployment Checklist

- [ ] Choose CDN provider
- [ ] Configure DNS
- [ ] Update Next.js config with assetPrefix
- [ ] Set up asset upload pipeline
- [ ] Configure cache headers
- [ ] Enable compression (Brotli/Gzip)
- [ ] Set up SSL certificate
- [ ] Configure cache invalidation
- [ ] Test from multiple regions
- [ ] Monitor cache hit rates
- [ ] Set up alerts for cache misses

## Next Steps

1. **Choose your CDN provider** based on:
   - Budget
   - Expected traffic
   - Required features
   - Deployment platform

2. **Update environment variables** in `.env.production`

3. **Test in staging** before production deployment

4. **Monitor performance** using built-in analytics

For questions or issues, refer to provider documentation:
- Vercel: https://vercel.com/docs/edge-network/overview
- CloudFlare: https://developers.cloudflare.com/cache/
- AWS CloudFront: https://docs.aws.amazon.com/cloudfront/
