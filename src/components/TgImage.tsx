import { useState } from 'react'
import { imgUrl } from '../api/client'

interface Props {
  fileId: string | null
  alt: string
  className?: string
  placeholder?: string
  objectFit?: 'cover' | 'contain'
}

export default function TgImage({ fileId, alt, className = '', placeholder = '📦', objectFit = 'cover' }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder visible until loaded */}
      <div
        className={`absolute inset-0 flex items-center justify-center text-2xl bg-raised transition-opacity duration-300 ${loaded && !errored ? 'opacity-0' : 'opacity-100'}`}
      >
        {placeholder}
      </div>
      {fileId && !errored && (
        <img
          src={imgUrl(fileId)}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectFit }}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
        />
      )}
    </div>
  )
}
