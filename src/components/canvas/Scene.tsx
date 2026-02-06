'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html, useHelper } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'

function Model() {
    // This loads your file. If you didn't rename it, this line crashes.
    const { scene } = useGLTF('/phone.glb')
    return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
}

import gsap from 'gsap'
import { useStore } from '@/store/useStore'

function CalibrationRig({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
    const { camera, gl } = useThree()
    const [data, setData] = useState({
        pos: { x: 0, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 },
        fov: 0
    })

    useEffect(() => {
        const update = () => {
            if (!controlsRef.current) return
            const target = controlsRef.current.target
            setData({
                pos: {
                    x: Number(camera.position.x.toFixed(3)),
                    y: Number(camera.position.y.toFixed(3)),
                    z: Number(camera.position.z.toFixed(3))
                },
                target: {
                    x: Number(target.x.toFixed(3)),
                    y: Number(target.y.toFixed(3)),
                    z: Number(target.z.toFixed(3))
                },
                fov: Number((camera as THREE.PerspectiveCamera).fov)
            })
        }

        // Update loops
        gl.domElement.addEventListener('mouseup', update)
        gl.domElement.addEventListener('wheel', update)
        // Initial update
        update()

        return () => {
            gl.domElement.removeEventListener('mouseup', update)
            gl.domElement.removeEventListener('wheel', update)
        }
    }, [camera, gl, controlsRef])

    const handleLock = () => {
        const exportData = {
            position: data.pos,
            target: data.target,
            fov: data.fov
        }
        console.log('🔒 CAM LOCKED:', JSON.stringify(exportData, null, 2))
        alert('Camera Coordinates Logged to Console!')
    }

    return (
        <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }}>
            <div className="absolute top-4 right-4 bg-black/90 p-4 rounded border border-white/20 font-mono text-xs text-green-400 w-64 pointer-events-auto">
                <p className="mb-2 text-white font-bold border-b border-white/20 pb-1">📸 CALIBRATION RIG</p>
                <div className="space-y-1 mb-4">
                    <p>POS: [{data.pos.x}, {data.pos.y}, {data.pos.z}]</p>
                    <p>TGT: [{data.target.x}, {data.target.y}, {data.target.z}]</p>
                    <p>FOV: {data.fov}</p>
                </div>

                <button
                    onClick={handleLock}
                    className="w-full bg-green-900/50 hover:bg-green-700/50 text-green-400 border border-green-500/50 py-2 rounded transition-colors"
                >
                    🔒 LOCK & LOG
                </button>

                <p className="mt-2 text-gray-500 italic text-[10px]">
                    1. Align view.<br />
                    2. Click LOCK.<br />
                    3. Copy JSON from Console.
                </p>
            </div>
        </Html>
    )
}

function HandshakeManager({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
    const { camera } = useThree()
    const targetState = useStore((state) => state.targetState)
    const setMode = useStore((state) => state.setMode)
    const setIsTransitioning = useStore((state) => state.setIsTransitioning)

    useEffect(() => {
        if (!targetState || !controlsRef.current) return

        const controls = controlsRef.current
        controls.enabled = false // Disable user control

        // Animate Camera Position
        gsap.to(camera.position, {
            x: targetState.position.x,
            y: targetState.position.y,
            z: targetState.position.z,
            duration: 1.5,
            ease: 'power3.inOut',
        })

        // Animate Orbit Controls Target (The pivot point)
        gsap.to(controls.target, {
            x: targetState.target.x,
            y: targetState.target.y,
            z: targetState.target.z,
            duration: 1.5,
            ease: 'power3.inOut',
            onUpdate: () => controls.update(), // Required to apply changes
            onComplete: () => {
                setMode('VIDEO')
                setIsTransitioning(false)
            }
        })

    }, [targetState, camera, controlsRef, setMode, setIsTransitioning])

    return null
}

export default function Scene() {
    const controlsRef = useRef<OrbitControlsImpl>(null)
    const mode = useStore((state) => state.mode)

    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                {/* Lighting */}
                <Environment preset="studio" />
                <ambientLight intensity={0.5} />

                {/* The Phone */}
                <Model />

                {/* Floor Shadows */}
                <ContactShadows position={[0, -1.5, 0]} opacity={0.6} blur={2} />

                {/* Controls & Tools */}
                <OrbitControls ref={controlsRef} makeDefault />

                {mode === '3D' && <CalibrationRig controlsRef={controlsRef} />}
                <HandshakeManager controlsRef={controlsRef} />
            </Canvas>
        </div>
    )
}