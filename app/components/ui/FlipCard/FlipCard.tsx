import React, { useEffect, useRef, useCallback, useState } from 'react'
import debounce from 'lodash/debounce'
import styles from './FlipCard.module.scss'

export type BackContentType = 'recovery' | 'verification'

export interface FlipCardProps {
  frontContent: React.ReactNode
  backContent: React.ReactNode
  isFlipped: boolean
  extraWidth?: number
  mobileFullWidth?: boolean
}

export const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  isFlipped,
  extraWidth = 0,
  mobileFullWidth = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const previousWidthRef = useRef<number>(0)
  const [flipCardWidth, setFlipCardWidth] = useState<string>('auto')

  const getAdjustedWidth = (margin: number = 32) => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth - margin
  }

  const measureContent = useCallback(() => {
    if (frontRef.current && backRef.current && cardRef.current) {
      let finalWidth: number

      const contentWidth = Math.max(
        frontRef.current.scrollWidth,
        backRef.current.scrollWidth
      )

      if (window.innerWidth < 640) {
        if (mobileFullWidth) {
          finalWidth = getAdjustedWidth(32)
        } else {
          finalWidth = Math.min(contentWidth, getAdjustedWidth(32))
        }
      } else if (window.innerWidth < 768) {
        if (mobileFullWidth) {
          finalWidth = getAdjustedWidth(48)
        } else {
          finalWidth = Math.min(480, contentWidth)
        }
      } else if (window.innerWidth < 1024) {
        finalWidth = Math.min(contentWidth, 600)
      } else {
        finalWidth = Math.min(contentWidth, 500)
      }

      if (Math.abs(previousWidthRef.current - finalWidth) > 1) {
        previousWidthRef.current = finalWidth
        setFlipCardWidth(`${finalWidth + extraWidth}px`)
      }
    }
  }, [extraWidth, mobileFullWidth])

  useEffect(() => {
    const debouncedMeasure = debounce(measureContent, 150)

    measureContent()

    const resizeObserver = new ResizeObserver((entries) => {
      const hasSignificantChange = entries.some((entry) => {
        const { width: newWidth } = entry.contentRect
        return Math.abs(newWidth - previousWidthRef.current) > 1
      })

      if (hasSignificantChange) {
        debouncedMeasure()
      }
    })

    if (frontRef.current) resizeObserver.observe(frontRef.current)
    if (backRef.current) resizeObserver.observe(backRef.current)

    return () => {
      resizeObserver.disconnect()
      debouncedMeasure.cancel()
    }
  }, [measureContent])

  return (
    <div
      className={`${styles['flip-card']} ${mobileFullWidth ? 'w-full' : ''}`}
      style={{ '--flip-card-width': flipCardWidth } as React.CSSProperties}
      ref={cardRef}
    >
      <div
        className={`${styles['flip-card-inner']} ${isFlipped ? styles['rotate-y-180'] : ''}`}
      >
        <div className={styles['flip-card-front']} ref={frontRef}>
          {frontContent}
        </div>
        <div className={styles['flip-card-back']} ref={backRef}>
          {backContent}
        </div>
      </div>
    </div>
  )
}
