import { forwardRef } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/utils'

type FormFieldProps = {
  label: string
  error?: string
  id: string
  textarea?: boolean
  className?: string
} & (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>)

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, error, id, textarea, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-1.5', className)}>
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            error && 'text-destructive',
          )}
        >
          {label}
        </Label>
        {textarea ? (
          <Textarea
            id={id}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input
            id={id}
            ref={ref as React.Ref<HTMLInputElement>}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p
            id={`${id}-error`}
            className="text-xs text-destructive font-medium animate-slideUp"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormField.displayName = 'FormField'

export default FormField
