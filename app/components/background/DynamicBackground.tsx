// components/background/DynamicBackground.tsx

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  MediaItem,
  PlaybackMode,
} from '@/components/background/background'

interface DynamicBackgroundProps {
  children: ReactNode
  mediaItems: MediaItem[]
  overlayOpacity?: number
  playbackMode?: PlaybackMode
  interval?: number // Tiempo en ms entre cambios
  startIndex?: number
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  children,
  mediaItems,
  overlayOpacity = 50,
  playbackMode = 'sequential',
  interval = 5000, // 5 segundos por defecto
  startIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  // Función para obtener el siguiente índice
  const getNextIndex = useCallback((): number => {
    if (playbackMode === 'random') {
      // Evita repetir el mismo índice
      let nextIndex: number
      do {
        nextIndex = Math.floor(Math.random() * mediaItems.length)
      } while (nextIndex === currentIndex && mediaItems.length > 1)
      return nextIndex
    }

    return (currentIndex + 1) % mediaItems.length
  }, [currentIndex, mediaItems.length, playbackMode])

  // Maneja la transición al siguiente medio
  const transitionToNext = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(getNextIndex())
      setIsTransitioning(false)
    }, 500) // Duración de la transición
  }, [getNextIndex])

  useEffect(() => {
    if (mediaItems.length <= 1) return

    timeoutRef.current = setInterval(transitionToNext, interval)

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current)
      }
    }
  }, [
    currentIndex,
    interval,
    mediaItems.length,
    playbackMode,
    transitionToNext,
  ])

  const currentMedia = mediaItems[currentIndex]

  const renderMedia = () => {
    if (currentMedia.type === 'video') {
      return (
        <video
          ref={videoRef}
          key={currentMedia.src}
          className="fixed inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0 : 1 }}
          autoPlay
          loop
          muted
          playsInline
          poster={currentMedia.posterImage}
        >
          <source src={currentMedia.src} type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      )
    }

    return (
      <div
        key={currentMedia.src}
        className="fixed inset-0 w-full h-full transition-opacity duration-500"
        style={{
          backgroundImage: `url(${currentMedia.src})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: isTransitioning ? 0 : 1,
        }}
      />
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Media actual */}
      <div className="fixed inset-0 w-full h-full">{renderMedia()}</div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 w-full h-full bg-black/${overlayOpacity}`}
        aria-hidden="true"
      />

      {/* Contenido - Modificado para preservar el contexto 3D */}
      <div className="relative z-10 transform-gpu">
        {/* Añadido transform-gpu */}
        {children}
      </div>
    </div>
  )
}
