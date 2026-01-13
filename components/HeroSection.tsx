'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 w-screen h-screen bg-gradient-to-br from-black via-dark-grey to-black" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight"
        >
          Create. Build. Illuminate.
        </motion.h1>
        
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Transform your vision into extraordinary experiences
        </motion.p>

        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/brief"
            className="px-8 py-4 bg-creative-purple text-white rounded-lg font-semibold text-lg hover:bg-creative-purple/90 transition-colors shadow-lg shadow-black/50"
          >
            Start Your Brief
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
