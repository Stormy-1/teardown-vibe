'use client'

import { Canvas } from '@react-three/fiber'

export default function Scene() {
  return (
    <Canvas className="h-full w-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
