"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A7C2C] to-[#7FD99A] rounded-lg blur-lg opacity-50" />
            <div className="relative bg-gradient-to-r from-[#4A7C2C] to-[#7FD99A] rounded-lg p-4 shadow-xl flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Ready to start?</p>
                <p className="text-white/80 text-xs">Get started free today</p>
              </div>
              <Button 
                size="sm" 
                className="bg-white text-[#4A7C2C] hover:bg-white/90"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started
              </Button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
