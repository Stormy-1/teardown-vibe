'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 240

export default function VideoScrubber() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loaded, setLoaded] = useState(false)
    const [progress, setProgress] = useState(0)
    const imagesRef = useRef<HTMLImageElement[]>([])

    useEffect(() => {
        // 1. Preload Images
        let loadedCount = 0
        const images: HTMLImageElement[] = []

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image()
            // Pads numbers: 001, 002... 240
            const paddedIndex = i.toString().padStart(3, '0')
            img.src = `/sequence/ezgif-frame-${paddedIndex}.jpg`

            img.onload = () => {
                loadedCount++
                setProgress(Math.round((loadedCount / FRAME_COUNT) * 100))
                if (loadedCount === FRAME_COUNT) {
                    setLoaded(true)
                }
            }
            // Handle missing images (avoid hanging)
            img.onerror = () => {
                if (i === 1) {
                    console.error(`CRITICAL: Could not load first frame! Check path: ${img.src}`)
                }
                console.warn(`Missing frame: ${paddedIndex}`)
                loadedCount++
                if (loadedCount === FRAME_COUNT) setLoaded(true)
            }
            images.push(img)
        }
        imagesRef.current = images

        return () => {
            // Cleanup if needed
        }
    }, [])

    useEffect(() => {
        if (!loaded || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 2. Render Helper
        const renderFrame = (index: number) => {
            const img = imagesRef.current[index]
            if (!img) return

            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // "Object-Fit: Cover" Logic
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
            const x = (canvas.width / 2) - (img.width / 2) * scale
            const y = (canvas.height / 2) - (img.height / 2) * scale

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
        }

        // 3. GSAP ScrollTrigger
        const scrubObj = { frame: 0 }

        // Initial Render
        renderFrame(0)

        const trigger = ScrollTrigger.create({
            trigger: document.body, // Use body to track overall scroll
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5, // 0.5s lag for smoothness
            onUpdate: (self) => {
                // Map scroll progress (0-1) to frame index (0-119)
                const frameIndex = Math.floor(self.progress * (FRAME_COUNT - 1))
                renderFrame(frameIndex)
            }
        })

        // Resize Handle
        const handleResize = () => renderFrame(Math.floor(trigger.progress * (FRAME_COUNT - 1)))
        window.addEventListener('resize', handleResize)

        return () => {
            trigger.kill()
            window.removeEventListener('resize', handleResize)
        }
    }, [loaded])

    if (!loaded) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-black text-white font-mono z-50">
                LOADING SEQUENCE... {progress}%
            </div>
        )
    }

    return (
        <canvas
            ref={canvasRef}
            className="h-full w-full block object-cover"
        />
    )
}
