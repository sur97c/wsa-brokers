// components/background/VideoBackground.tsx

import React, { ReactNode } from 'react'

interface VideoBackgroundProps {
  children: ReactNode
  videoSrc: string
  overlayOpacity?: number
  fallbackImage?: string // Para móviles o cuando el video no carga
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  children,
  videoSrc,
  overlayOpacity = 50,
  fallbackImage,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video de fondo */}
      <video
        className="fixed inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline // Importante para iOS
        poster={fallbackImage} // Imagen mientras carga el video
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Mensaje si el navegador no soporta video */}
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Overlay semitransparente */}
      <div
        className={`fixed inset-0 w-full h-full -z-5 bg-black/${overlayOpacity}`}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
