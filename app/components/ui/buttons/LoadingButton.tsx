// components/loading-button/LoadingButton.tsx

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface LoadingButtonProps {
  loading: boolean
  faIcon: IconDefinition
  label?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ariaLabel?: string
  className?: string
  type?: 'button' | 'submit'
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  faIcon,
  label,
  onClick,
  ariaLabel,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`bg-primary py-2 px-4 rounded hover:bg-primary-hover w-full md:w-auto ${className}`}
      disabled={loading}
    >
      {label && <span className="mr-2">{label}</span>}
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin />
      ) : (
        <FontAwesomeIcon icon={faIcon} />
      )}
    </button>
  )
}

export default LoadingButton
