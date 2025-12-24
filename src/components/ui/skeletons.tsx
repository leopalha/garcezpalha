import * as React from 'react'
import { cn } from '@/lib/utils/cn'

// Base Skeleton component
const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

// CardSkeleton
export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  hasHeader?: boolean
  hasFooter?: boolean
  lines?: number
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, hasHeader = true, hasFooter = false, lines = 3, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    >
      {hasHeader && (
        <div className="flex flex-col space-y-1.5 p-6">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      <div className="p-6 pt-0 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-4', i === lines - 1 ? 'w-4/5' : 'w-full')}
          />
        ))}
      </div>
      {hasFooter && (
        <div className="flex items-center p-6 pt-0">
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  )
)
CardSkeleton.displayName = 'CardSkeleton'

// TableSkeleton
export interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
  hasHeader?: boolean
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ className, rows = 5, columns = 4, hasHeader = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('w-full overflow-hidden rounded-lg border', className)}
      {...props}
    >
      <div className="w-full">
        {hasHeader && (
          <div className="flex border-b bg-muted/50 p-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="flex-1 px-2">
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex p-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1 px-2">
                  <Skeleton
                    className={cn(
                      'h-4',
                      colIndex === 0 ? 'w-full' : colIndex === columns - 1 ? 'w-1/2' : 'w-3/4'
                    )}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
)
TableSkeleton.displayName = 'TableSkeleton'

// DashboardSkeleton
export interface DashboardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics?: number
  showChart?: boolean
}

const DashboardSkeleton = React.forwardRef<HTMLDivElement, DashboardSkeletonProps>(
  ({ className, metrics = 4, showChart = true, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)} {...props}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: metrics }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      {/* Chart Area */}
      {showChart && (
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
    </div>
  )
)
DashboardSkeleton.displayName = 'DashboardSkeleton'

// FormSkeleton
export interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: number
  hasSubmitButton?: boolean
}

const FormSkeleton = React.forwardRef<HTMLDivElement, FormSkeletonProps>(
  ({ className, fields = 4, hasSubmitButton = true, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-6', className)} {...props}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      {hasSubmitButton && (
        <div className="pt-2">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      )}
    </div>
  )
)
FormSkeleton.displayName = 'FormSkeleton'

// ProfileSkeleton
export interface ProfileSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showBio?: boolean
  showStats?: boolean
}

const ProfileSkeleton = React.forwardRef<HTMLDivElement, ProfileSkeletonProps>(
  ({ className, showBio = true, showStats = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}
      {...props}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="flex-1 space-y-3">
          {/* Name */}
          <Skeleton className="h-6 w-48" />
          {/* Email/Username */}
          <Skeleton className="h-4 w-36" />
          {/* Role/Title */}
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      {showBio && (
        <div className="mt-6 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}
      {showStats && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="mx-auto h-6 w-16" />
              <Skeleton className="mx-auto mt-1 h-3 w-12" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
)
ProfileSkeleton.displayName = 'ProfileSkeleton'

// ListSkeleton
export interface ListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number
  hasAvatar?: boolean
  hasAction?: boolean
}

const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  ({ className, items = 5, hasAvatar = false, hasAction = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('divide-y rounded-lg border bg-card', className)}
      {...props}
    >
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center p-4">
          {hasAvatar && <Skeleton className="mr-4 h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          {hasAction && <Skeleton className="ml-4 h-8 w-20 rounded-md" />}
        </div>
      ))}
    </div>
  )
)
ListSkeleton.displayName = 'ListSkeleton'

export {
  Skeleton,
  CardSkeleton,
  TableSkeleton,
  DashboardSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  ListSkeleton,
}
