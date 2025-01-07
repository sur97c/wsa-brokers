// app/components/loading/Spinner.tsx

import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div
      className={`inline-block ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="loading"
    >
      <div className="h-full w-full rounded-full border-4 border-[#1A237E]/20 border-t-[#1A237E] animate-spin" />
    </div>
  )
}
