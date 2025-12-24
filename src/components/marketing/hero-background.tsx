'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

export interface HeroBackgroundProps {
  src: string
  alt: string
  blurDataURL?: string
  overlayClassName?: string
  priority?: boolean
  className?: string
  children?: React.ReactNode
}

const HeroBackground = React.forwardRef<HTMLDivElement, HeroBackgroundProps>(
  ({ src, alt, blurDataURL, overlayClassName, priority = true, className, children }, ref) => {
    const [isLoading, setIsLoading] = React.useState(true)

    // Default blur placeholder for hero images
    const defaultBlurDataURL =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4='

    return (
      <div
        ref={ref}
        className={cn('relative min-h-[50vh] w-full overflow-hidden', className)}
      >
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          {isLoading && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            placeholder="blur"
            blurDataURL={blurDataURL || defaultBlurDataURL}
            sizes="100vw"
            quality={90}
            className={cn(
              'object-cover object-center transition-all duration-700',
              isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'
            )}
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Optional Overlay */}
        <div
          className={cn(
            'absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background/80',
            overlayClassName
          )}
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
HeroBackground.displayName = 'HeroBackground'

export { HeroBackground }
