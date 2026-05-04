"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

const stats = [
  { label: "Active Users", value: "1M+" },
  { label: "Uptime", value: "99.5%" },
  { label: "Real-time Sync", value: "100%" },
]

export default function Statistics() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [counts, setCounts] = useState([0, 0, 0])

  useEffect(() => {
    if (!inView) return

    const intervals = [
      setInterval(() => setCounts((prev) => [Math.min(prev[0] + 50000, 1000000), prev[1], prev[2]]), 50),
      setInterval(() => setCounts((prev) => [prev[0], Math.min(prev[1] + 0.5, 99.5), prev[2]]), 50),
      setInterval(() => setCounts((prev) => [prev[0], prev[1], Math.min(prev[2] + 5, 100)]), 50),
    ]

    return () => intervals.forEach(clearInterval)
  }, [inView])

  return (
    <section
      id="statistics"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#4A7C2C]/10 via-[#7FD99A]/10 to-[#4A7C2C]/10"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Trusted by Plant Lovers Worldwide</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-xl border border-border bg-card/50"
            >
              <motion.div className="text-4xl md:text-5xl font-bold text-[#4A7C2C] mb-2">{stat.value}</motion.div>
              <p className="text-muted-foreground text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
