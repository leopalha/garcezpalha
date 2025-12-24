'use client'

import * as React from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils/cn'

export interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: React.ReactNode
  showLoadingState?: boolean
  containerClassName?: string
}

const OptimizedImage = React.forwardRef<HTMLDivElement, OptimizedImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      fill,
      className,
      containerClassName,
      fallback,
      showLoadingState = true,
      priority = false,
      placeholder = 'blur',
      blurDataURL,
      sizes,
      quality = 85,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    // Generate a default blur placeholder if not provided
    const defaultBlurDataURL =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4='

    // Reset loading state when src changes
    React.useEffect(() => {
      setIsLoading(true)
      setHasError(false)
    }, [src])

    // Default responsive sizes if not provided
    const defaultSizes = fill
      ? '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw'
      : undefined

    if (hasError && fallback) {
      return <>{fallback}</>
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', fill && 'h-full w-full', containerClassName)}
      >
        {showLoadingState && isLoading && !priority && (
          <div className="absolute inset-0 z-10 animate-pulse bg-muted" />
        )}
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            'transition-opacity duration-300',
            isLoading && !priority ? 'opacity-0' : 'opacity-100',
            className
          )}
          priority={priority}
          placeholder={blurDataURL || !fill ? placeholder : 'empty'}
          blurDataURL={blurDataURL || (placeholder === 'blur' && !fill ? defaultBlurDataURL : undefined)}
          sizes={sizes || defaultSizes}
          quality={quality}
          loading={priority ? undefined : 'lazy'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setHasError(true)
          }}
          {...props}
        />
      </div>
    )
  }
)
OptimizedImage.displayName = 'OptimizedImage'

export { OptimizedImage }
