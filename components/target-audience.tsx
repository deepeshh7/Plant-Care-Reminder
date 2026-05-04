"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Heart, Sprout, Briefcase } from "lucide-react"

const audiences = [
  {
    icon: Heart,
    title: "Plant Enthusiasts",
    description:
      "Advanced gardeners who want to optimize their plant care with data-driven insights and community connection.",
  },
  {
    icon: Sprout,
    title: "Beginner Gardeners",
    description:
      "New plant parents who need guidance, reminders, and confidence to grow their collection successfully.",
  },
  {
    icon: Briefcase,
    title: "Professional Horticulturists",
    description: "Experts managing multiple plants who need efficient tracking and professional-grade analytics.",
  },
]

export default function TargetAudience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="target-audience" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">For Everyone Who Loves Plants</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're just starting or a seasoned gardener, PlantCare is designed for you
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {audiences.map((audience, index) => {
            const Icon = audience.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="p-8 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-[#4A7C2C]/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-14 h-14 bg-gradient-to-br from-[#7FD99A] to-[#4A7C2C] rounded-lg flex items-center justify-center mb-4"
                >
                  <Icon size={28} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{audience.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{audience.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
