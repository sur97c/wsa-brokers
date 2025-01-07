// app/components/background/background.ts

export type MediaType = 'video' | 'image'

export interface MediaItem {
  src: string
  type: MediaType
  posterImage?: string // Para videos
}

export type PlaybackMode = 'sequential' | 'random'
