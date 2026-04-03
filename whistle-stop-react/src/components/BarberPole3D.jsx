import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

function BarberPole3D({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const stripesRef = useRef()
  
  useFrame((state) => {
    if (stripesRef.current) {
      stripesRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const stripeMaterial = new THREE.MeshPhongMaterial({
    color: '#dc2626',
    shininess: 100,
  })

  const whiteMaterial = new THREE.MeshPhongMaterial({
    color: '#f5f5f5',
    shininess: 100,
  })

  const metalMaterial = new THREE.MeshPhongMaterial({
    color: '#c0c0c0',
    shininess: 200,
    metalness: 0.8,
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Glass cylinder */}
      <Cylinder args={[0.3, 0.3, 2, 32, 1, true]}>
        <meshPhongMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide}
          shininess={200}
        />
      </Cylinder>

      {/* Red stripes */}
      <group ref={stripesRef}>
        {[0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6].map((angle, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 1.8, 32, 1, true, angle, 0.3]} />
            <meshPhongMaterial color="#dc2626" shininess={100} />
          </mesh>
        ))}
      </group>

      {/* White stripes */}
      {[0.3, Math.PI * 0.6, Math.PI, Math.PI * 1.4, Math.PI * 1.8].map((angle, i) => (
        <mesh key={`white-${i}`} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 1.8, 32, 1, true, angle, 0.25]} />
          <meshPhongMaterial color="#f5f5f5" shininess={100} />
        </mesh>
      ))}

      {/* Top cap */}
      <Sphere args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 1, 0]}>
        <meshPhongMaterial color="#c0c0c0" shininess={200} metalness={0.8} />
      </Sphere>

      {/* Bottom cap */}
      <Sphere args={[0.32, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} position={[0, -1, 0]}>
        <meshPhongMaterial color="#c0c0c0" shininess={200} metalness={0.8} />
      </Sphere>

      {/* Top ring */}
      <Torus args={[0.32, 0.03, 16, 32]} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhongMaterial color="#c0c0c0" shininess={200} metalness={0.8} />
      </Torus>

      {/* Bottom ring */}
      <Torus args={[0.32, 0.03, 16, 32]} position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhongMaterial color="#c0c0c0" shininess={200} metalness={0.8} />
      </Torus>
    </group>
  )
}

export default BarberPole3D
