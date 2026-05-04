"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function Screenshots() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section
      id="screenshots"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#7FD99A]/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Beautiful Dashboard</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track care history, view analytics, and manage all your plants in one place
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A7C2C]/20 to-[#7FD99A]/20 rounded-2xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-[#4A7C2C]/10 to-[#7FD99A]/10 rounded-2xl border border-[#7FD99A]/30 p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Mock dashboard cards */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: i * 0.3 }}
                  className="bg-card border border-border rounded-lg p-6 space-y-4"
                >
                  <div className="w-12 h-12 bg-[#7FD99A]/20 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="h-2 bg-gradient-to-r from-[#4A7C2C] to-[#7FD99A] rounded w-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
