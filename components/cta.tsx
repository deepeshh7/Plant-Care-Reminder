"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function CTA() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to signup page with email pre-filled
    window.location.href = `/signup?email=${encodeURIComponent(email)}`
  }

  return (
    <section id="cta" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A7C2C]/20 to-[#7FD99A]/20 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-br from-[#4A7C2C]/10 to-[#7FD99A]/10 rounded-2xl border border-[#7FD99A]/30 p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">Start Your Plant Care Journey Today</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of plant parents who are growing healthier, happier plants with PlantCare.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="bg-[#4A7C2C] hover:bg-[#2D5016] text-white">
                Get Started
              </Button>
            </form>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] border-2 border-background"
                  />
                ))}
              </div>
              <span>Loved by 50,000+ users</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
