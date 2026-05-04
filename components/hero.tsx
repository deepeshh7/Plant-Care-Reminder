"use client"

import { motion, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A7C2C]/10 via-transparent to-[#7FD99A]/10 pointer-events-none" />

      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        className="absolute top-20 right-10 w-72 h-72 bg-[#7FD99A]/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-20 left-10 w-72 h-72 bg-[#4A7C2C]/20 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left content */}
          <div className="space-y-8">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Never Let Your Plants Down Again
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed">
              Smart reminders, AI-powered care tips, and growth tracking all in one beautiful app. Keep your plants
              thriving with personalized care schedules.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-[#4A7C2C] hover:bg-[#2D5016] text-white text-base h-12"
                onClick={() => window.location.href = '/signup'}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#4A7C2C] text-[#4A7C2C] hover:bg-[#4A7C2C]/10 text-base h-12 bg-transparent"
              >
                <Play size={18} className="mr-2" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] border-2 border-background"
                  />
                ))}
              </div>
              <span>Join 50,000+ plant lovers</span>
            </motion.div>
          </div>

          {/* Right side - Animated illustration */}
          <motion.div variants={itemVariants} className="relative h-96 md:h-full">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="relative w-full h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A7C2C]/20 to-[#7FD99A]/20 rounded-2xl blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-[#4A7C2C]/10 to-[#7FD99A]/10 rounded-2xl border border-[#7FD99A]/30 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="text-6xl"
                >
                  🌿
                </motion.div>
              </div>
            </motion.div>

            {/* Floating notification cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7FD99A]/20 rounded-lg flex items-center justify-center">💧</div>
                <div>
                  <p className="text-sm font-semibold">Time to water</p>
                  <p className="text-xs text-muted-foreground">Your Monstera needs water</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              className="absolute top-10 -right-4 bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4A7C2C]/20 rounded-lg flex items-center justify-center">☀️</div>
                <div>
                  <p className="text-sm font-semibold">Perfect weather</p>
                  <p className="text-xs text-muted-foreground">Great day for outdoor plants</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
