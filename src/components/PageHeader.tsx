import { LucideIcon } from 'lucide-react'

type PageHeaderProps = {
  icon?: LucideIcon
  title: string
  description?: string
  actions?: React.ReactNode
}

function PageHeader({ icon: Icon, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground break-words">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5 break-words">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export default PageHeader
