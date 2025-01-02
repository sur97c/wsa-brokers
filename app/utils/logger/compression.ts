// app/utils/logger/compression.ts

import { deflate, inflate } from 'pako'

export class LogCompressor {
  static compress(data: unknown): Uint8Array {
    const jsonString = JSON.stringify(data)
    return deflate(jsonString)
  }

  static decompress(compressed: Uint8Array): unknown {
    const decompressed = inflate(compressed)
    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(decompressed))
  }
}
