'use client'

import { useMemo } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  floatDelay: number
  floatDuration: number
  size: number
  opacity: number
}

export default function WaveBackground() {
  // Generate wave particles that sweep from bottom-left upward and to the right
  const waveParticles = useMemo(() => {
    const particles: Particle[] = []
    let id = 0

    // Create multiple wave layers (parallel wavy lines)
    const waveCount = 6
    const particlesPerWave = 50

    for (let waveIndex = 0; waveIndex < waveCount; waveIndex++) {
      const wavePhase = (waveIndex / waveCount) * Math.PI * 2
      const waveAmplitude = 25 + waveIndex * 12
      const baseY = 35 + waveIndex * 10 // Starting Y position (waves start from bottom area)
      const baseX = 0 + waveIndex * 2 // Slight horizontal offset for depth
      
      for (let i = 0; i < particlesPerWave; i++) {
        const progress = i / particlesPerWave
        // Waves start from left side and sweep to the right
        const x = baseX + progress * 100
        // Create sine wave pattern that curves upward
        const waveOffset = Math.sin((progress * 4 + wavePhase) * Math.PI) * waveAmplitude
        // Add upward sweep (waves go higher as they move right)
        const upwardSweep = progress * 60
        const y = baseY - upwardSweep + waveOffset
        
        particles.push({
          id: id++,
          x,
          y,
          delay: Math.random() * 2,
          duration: 2.5 + Math.random() * 1.5,
          floatDelay: Math.random() * 4,
          floatDuration: 5 + Math.random() * 3,
          size: 2.5 + Math.random() * 2.5,
          opacity: 0.5 + Math.random() * 0.5,
        })
      }
    }

    return particles
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-grey to-black" />
      
      {/* Wave Particles */}
      <div className="absolute inset-0">
        {waveParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute particle rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: `rgba(200, 200, 220, ${particle.opacity})`,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 1.5}px rgba(255, 255, 255, ${particle.opacity * 0.8})`,
              animationDelay: `${particle.delay}s, ${particle.floatDelay}s`,
              animationDuration: `${particle.duration}s, ${particle.floatDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_45%,rgba(139,92,246,0.03),transparent_50%)]" />
    </div>
  )

}
