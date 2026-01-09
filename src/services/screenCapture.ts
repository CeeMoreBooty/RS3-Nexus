/**
 * Screen capture service for reading game data
 */
class ScreenCaptureService {
  private sources: Array<{ id: string; name: string; thumbnail: string }> = []
  private selectedSourceId: string | null = null

  /**
   * Get available capture sources (windows and screens)
   */
  async getSources(): Promise<Array<{ id: string; name: string; thumbnail: string }>> {
    try {
      if (window.electronAPI) {
        this.sources = await window.electronAPI.getSources()
        return this.sources
      }
      return []
    } catch (error) {
      console.error('Error getting sources:', error)
      return []
    }
  }

  /**
   * Select a capture source
   */
  selectSource(sourceId: string): void {
    this.selectedSourceId = sourceId
  }

  /**
   * Get current selected source
   */
  getSelectedSource(): string | null {
    return this.selectedSourceId
  }

  /**
   * Capture screenshot from selected source
   */
  async captureScreenshot(): Promise<string | null> {
    if (!this.selectedSourceId) {
      console.warn('No source selected for capture')
      return null
    }

    try {
      // Use browser screen capture API
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          // @ts-ignore - chromeMediaSource is Electron-specific
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: this.selectedSourceId,
          }
        }
      })

      // Create video element to capture frame
      const video = document.createElement('video')
      video.srcObject = stream
      video.autoplay = true

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas and capture frame
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        ctx.drawImage(video, 0, 0)
      }

      // Stop stream
      stream.getTracks().forEach(track => track.stop())

      // Return as data URL
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      return null
    }
  }

  /**
   * Capture specific region of screen
   */
  async captureRegion(x: number, y: number, width: number, height: number): Promise<string | null> {
    const screenshot = await this.captureScreenshot()
    
    if (!screenshot) return null

    try {
      // Create image from screenshot
      const img = new Image()
      img.src = screenshot

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Create canvas for cropped region
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
      }

      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error capturing region:', error)
      return null
    }
  }

  /**
   * Find RuneScape window
   */
  async findGameWindow(): Promise<string | null> {
    const sources = await this.getSources()
    
    // Look for RuneScape window
    const gameWindow = sources.find(source => 
      source.name.toLowerCase().includes('runescape') ||
      source.name.toLowerCase().includes('rs3') ||
      source.name.toLowerCase().includes('jagex')
    )

    if (gameWindow) {
      this.selectSource(gameWindow.id)
      return gameWindow.id
    }

    return null
  }

  /**
   * Read text from image (OCR placeholder)
   * In production, this would use an OCR library like Tesseract.js
   */
  async readTextFromImage(imageData: string): Promise<string> {
    try {
      // Placeholder for OCR functionality
      // In production, would use Tesseract.js or similar
      console.log('OCR not implemented - would extract text from image')
      return ''
    } catch (error) {
      console.error('Error reading text from image:', error)
      return ''
    }
  }

  /**
   * Detect colors in region (for detecting game UI elements)
   */
  async detectColors(imageData: string): Promise<Array<{ color: string; percentage: number }>> {
    try {
      const img = new Image()
      img.src = imageData

      await new Promise((resolve) => {
        img.onload = resolve
      })

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')

      if (!ctx) return []

      ctx.drawImage(img, 0, 0)
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageDataObj.data

      // Count colors (simplified - would be more sophisticated in production)
      const colorMap = new Map<string, number>()
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const color = `rgb(${r},${g},${b})`
        colorMap.set(color, (colorMap.get(color) || 0) + 1)
      }

      const totalPixels = canvas.width * canvas.height
      const colors = Array.from(colorMap.entries())
        .map(([color, count]) => ({
          color,
          percentage: (count / totalPixels) * 100
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 10) // Top 10 colors

      return colors
    } catch (error) {
      console.error('Error detecting colors:', error)
      return []
    }
  }

  /**
   * Monitor region for changes
   */
  async monitorRegion(
    x: number,
    y: number,
    width: number,
    height: number,
    callback: (changed: boolean) => void,
    interval: number = 1000
  ): Promise<() => void> {
    let previousImage: string | null = null
    
    const intervalId = setInterval(async () => {
      const currentImage = await this.captureRegion(x, y, width, height)
      
      if (previousImage && currentImage) {
        const changed = previousImage !== currentImage
        callback(changed)
      }
      
      previousImage = currentImage
    }, interval)

    // Return cleanup function
    return () => clearInterval(intervalId)
  }
}

// Export singleton instance
export const screenCapture = new ScreenCaptureService()
export default screenCapture
