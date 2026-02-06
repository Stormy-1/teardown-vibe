'use client'

import Scene from '@/components/canvas/Scene'
import VideoScrubber from '@/components/dom/VideoScrubber'
import StartButton from '@/components/dom/StartButton'
import SmoothScroll from '@/components/dom/SmoothScroll'
import Hotspots from '@/components/dom/Hotspots'
import { useStore } from '@/store/useStore'

export default function Home() {
  const mode = useStore((state) => state.mode)

  return (
    <SmoothScroll>
      <main className={`w-screen relative bg-black ${mode === 'VIDEO' ? 'scroll-container' : 'h-screen overflow-hidden'}`}>

        {/* Grain Overlay */}
        <div className="grain" />

        {/* 3D Scene Layer - Z-Index 10 */}
        <div
          className="fixed inset-0 z-10 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: mode === '3D' ? 1 : 0, pointerEvents: mode === '3D' ? 'auto' : 'none' }}
        >
          <Scene />
          <StartButton />
        </div>

        {/* Video Scrubber Layer - Z-Index 0 */}
        <div
          className="fixed inset-0 z-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: mode === 'VIDEO' ? 1 : 0 }}
        >
          <VideoScrubber />
          {mode === 'VIDEO' && <Hotspots />}
        </div>

      </main>
    </SmoothScroll>
  )
}
