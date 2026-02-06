import { create } from 'zustand'

type Mode = '3D' | 'VIDEO'

interface CameraTarget {
    position: { x: number; y: number; z: number }
    target: { x: number; y: number; z: number }
    fov?: number
}

interface State {
    mode: Mode
    isTransitioning: boolean
    targetState: CameraTarget | null
    setMode: (mode: Mode) => void
    setIsTransitioning: (isTransitioning: boolean) => void
    triggerHandshake: (target: CameraTarget) => void
}

export const useStore = create<State>((set) => ({
    mode: '3D',
    isTransitioning: false,
    targetState: null,
    setMode: (mode) => set({ mode }),
    setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
    triggerHandshake: (target) => set({ isTransitioning: true, targetState: target }),
}))
