# Placeholder Images Directory

This directory contains placeholder images used throughout the Garcez Palha application.

## Required Images

The following images are needed for optimal functionality:

### Hero Images
- **hero-placeholder.jpg** (1920x1080 minimum)
  - Main hero section background
  - Should be high quality, relevant to legal services
  - Consider using images of: courthouse, legal documents, professional settings

### General Placeholders
- **avatar-placeholder.png** (400x400)
  - Default user/team member avatar
  - Neutral, professional appearance

- **document-placeholder.png** (800x600)
  - Placeholder for document previews
  - Simple document icon or preview mockup

- **service-placeholder.jpg** (600x400)
  - Default image for service cards
  - Professional, legal-themed imagery

### Logo Variations
- **logo-light.svg** or **logo-light.png**
  - Logo for dark backgrounds

- **logo-dark.svg** or **logo-dark.png**
  - Logo for light backgrounds

## Image Optimization Guidelines

1. **Format Selection**
   - Use WebP for photographs with fallback to JPEG
   - Use PNG for images requiring transparency
   - Use SVG for logos and icons

2. **Compression**
   - Compress images before adding (TinyPNG, ImageOptim)
   - Aim for file sizes under 200KB for non-hero images
   - Hero images should be under 500KB

3. **Responsive Sizes**
   - Provide multiple sizes for key images:
     - Small: 640px wide
     - Medium: 1024px wide
     - Large: 1920px wide

4. **Blur Placeholders**
   - Generate blur data URLs for important images
   - Can use: https://blurha.sh/ or next/image automatic generation

## Usage with OptimizedImage Component

```tsx
import { OptimizedImage } from '@/components/ui/optimized-image'

// Basic usage
<OptimizedImage
  src="/images/placeholders/service-placeholder.jpg"
  alt="Service placeholder"
  width={600}
  height={400}
/>

// With fill container
<OptimizedImage
  src="/images/placeholders/hero-placeholder.jpg"
  alt="Hero background"
  fill
  priority
/>
```

## Usage with HeroBackground Component

```tsx
import { HeroBackground } from '@/components/marketing/hero-background'

<HeroBackground
  src="/images/placeholders/hero-placeholder.jpg"
  alt="Legal services hero"
>
  <div className="container py-20">
    <h1>Your Hero Content</h1>
  </div>
</HeroBackground>
```

## Notes

- All images should be placed directly in this directory
- Use descriptive, kebab-case filenames
- Update this README when adding new required images
- Ensure proper licensing for any stock images used
