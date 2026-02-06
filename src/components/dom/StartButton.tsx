'use client'

import { useStore } from '@/store/useStore'

export default function StartButton() {
    const mode = useStore((state) => state.mode)
    const isTransitioning = useStore((state) => state.isTransitioning)
    const triggerHandshake = useStore((state) => state.triggerHandshake)

    if (mode !== '3D' || isTransitioning) return null

    const handleClick = () => {
        // Placeholder coordinates - update these after calibration!
        triggerHandshake({
            position: { x: 0, y: 0, z: 2 },
            target: { x: 0, y: 0, z: 0 },
            fov: 45
        })
    }

    return (
        <div className="absolute top-10 left-10 z-50">
            <button
                onClick={handleClick}
                className="bg-white text-black font-bold text-xl px-8 py-3 tracking-widest hover:bg-gray-200 transition-colors uppercase border-2 border-transparent hover:border-white"
            >
                Start Teardown
            </button>
        </div>
    )
}
