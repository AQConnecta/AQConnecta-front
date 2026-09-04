import { Loader2 } from 'lucide-react'
import { cn } from '../lib/utils'

type LoadingStateProps = {
  message?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ message, className, fullScreen }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen ? 'min-h-screen' : 'py-16',
        className,
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-6 space-y-4 animate-pulse"
        >
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="h-4 bg-muted rounded w-1/3" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted rounded-full w-16" />
            <div className="h-6 bg-muted rounded-full w-20" />
            <div className="h-6 bg-muted rounded-full w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ButtonLoading({ children, isLoading, ...props }: { children: React.ReactNode, isLoading: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button disabled={isLoading} {...props}>
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Aguarde...
        </span>
      ) : children}
    </button>
  )
}
