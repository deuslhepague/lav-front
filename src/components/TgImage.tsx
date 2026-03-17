/**
 * TgImage — componente que resolve o file_id em URL do Telegram
 * e exibe a imagem. O download vai direto do Telegram para o browser.
 */
import { useState, useEffect } from 'react'
import { imgUrl } from '../api/client'

interface Props {
  fileId: string
  alt?: string
  className?: string
  placeholder?: string
}

export default function TgImage({ fileId, alt = '', className = '', placeholder = '👗' }: Props) {
  const [src, setSrc] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!fileId) return
    setLoaded(false)
    setSrc('')
    imgUrl(fileId).then(url => {
      if (url) setSrc(url)
    })
  }, [fileId])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder enquanto carrega */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl bg-s1">
          {src ? (
            <div className="absolute inset-0 shimmer" />
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
      )}
      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setSrc('')}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  )
}
