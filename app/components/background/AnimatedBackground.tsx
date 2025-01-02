// components/background/AnimatedBackground.tsx

import React, { ReactNode } from 'react'

interface AnimatedBackgroundProps {
  children: ReactNode
  overlayOpacity?: number // Opcional para controlar la opacidad del overlay
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  overlayOpacity = 50, // Valor por defecto del 50%
}) => {
  return (
    <div className="relative min-h-screen">
      {/* Contenedor del GIF */}
      <div
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/images/background2.gif")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay semitransparente */}
      <div
        className={`fixed inset-0 w-full h-full z-10 bg-black/${overlayOpacity}`}
      />

      {/* Contenido principal */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
