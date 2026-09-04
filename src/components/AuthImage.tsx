import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { axios } from '../services/api'
import { cn } from '../lib/utils'

type AuthImageProps = {
  path?: string | null
  alt?: string
  className?: string
}

function AuthImage({ path, alt, className }: AuthImageProps) {
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null
    setError(false)
    setSrc(null)

    if (!path) return

    axios
      .get(path, { responseType: 'blob' })
      .then((res) => {
        if (!active) return
        objectUrl = URL.createObjectURL(res.data)
        setSrc(objectUrl)
      })
      .catch(() => {
        if (active) setError(true)
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [path])

  if (!path || error) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <ImageOff className="w-6 h-6 text-muted-foreground" />
      </div>
    )
  }

  if (!src) {
    return <div className={cn('animate-pulse bg-muted', className)} />
  }

  return <img src={src} alt={alt} className={className} />
}

export default AuthImage
