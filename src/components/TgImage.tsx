import { useState } from 'react'
import { API_BASE } from '../api/client'

interface Props {
  fileId: string
  alt?: string
  className?: string
  placeholder?: string
}

export default function TgImage({ fileId, alt = '', className = '', placeholder = '👗' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!fileId) {
    return (
      <div className={`relative overflow-hidden bg-s1 flex items-center justify-center ${className}`}>
        <span className="text-2xl">{placeholder}</span>
      </div>
    )
  }

  const src = `${API_BASE}/api/imagem/${encodeURIComponent(fileId)}`

  return (
    <div className={`relative overflow-hidden bg-s1 ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 shimmer" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {placeholder}
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
