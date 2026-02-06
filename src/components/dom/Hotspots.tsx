'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const points = [
    { label: 'BATTERY', percent: 0.35, align: 'left' },
    { label: 'TAPTIC ENGINE', percent: 0.55, align: 'right' },
    { label: 'LOGIC BOARD', percent: 0.85, align: 'left' },
]

export default function Hotspots() {
    const refs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        refs.current.forEach((el, index) => {
            if (!el) return
            const point = points[index]

            // Show when scroll reaches the specific percentage
            gsap.fromTo(el,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: document.body,
                        start: `${point.percent * 100}% top`,
                        toggleActions: 'play reverse play reverse'
                    }
                }
            )
        })
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            {points.map((p, i) => (
                <div
                    key={p.label}
                    ref={(el) => { refs.current[i] = el }}
                    className={`absolute top-1/2 ${p.align === 'left' ? 'left-20' : 'right-20'} bg-black/50 backdrop-blur border border-white/30 px-6 py-4 rounded text-white font-mono opacity-0`}
                >
                    <div className="text-xs text-gray-400 mb-1">COMPONENT_0{i + 1}</div>
                    <div className="text-xl font-bold tracking-widest">{p.label}</div>
                </div>
            ))}
        </div>
    )
}
