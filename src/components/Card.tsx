import React from 'react'
import { cn } from '../lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
}

function Card({ children, className }: CardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl p-4 md:p-5 mb-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
