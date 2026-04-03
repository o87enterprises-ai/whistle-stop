import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import BarberPole3D from './BarberPole3D'
import { Environment, OrbitControls } from '@react-three/drei'

function Header() {
  const navigate = useNavigate()

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-b from-whistle-black/90 to-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 relative">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, -5, -5]} intensity={0.3} />
              <BarberPole3D scale={0.8} />
              <Environment preset="city" />
            </Canvas>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-wider text-whistle-white group-hover:text-whistle-crimson transition-colors">
              THE WHISTLE STOP
            </h1>
            <p className="text-xs text-gray-500 tracking-widest">MODERN COMPANION FOR CLASSIC CRAFTSMANSHIP</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-medium text-gray-400 hover:text-whistle-white transition-colors"
          >
            HOME
          </button>
          <button className="text-sm font-medium text-gray-400 hover:text-whistle-white transition-colors">
            OUR STORY
          </button>
          <button className="text-sm font-medium text-gray-400 hover:text-whistle-white transition-colors">
            SIGNATURE STYLES
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="text-sm font-medium text-gray-400 hover:text-whistle-white transition-colors"
          >
            LIVE AVAILABILITY
          </button>
          <button className="text-sm font-medium text-gray-400 hover:text-whistle-white transition-colors">
            CONTACT
          </button>
        </nav>
      </div>
    </motion.header>
  )
}

export default Header
