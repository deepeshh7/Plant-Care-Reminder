"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Calendar, Leaf, Cloud, Camera, Smartphone, Users } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Smart Care Schedules",
    description: "Automated reminders for watering, fertilizing, pruning, and repotting tailored to each plant.",
  },
  {
    icon: Leaf,
    title: "Plant Identification",
    description: "AI-powered image recognition to identify plants and get instant care recommendations.",
  },
  {
    icon: Cloud,
    title: "Weather-Based Adjustments",
    description: "Smart schedules adapt to local weather conditions for optimal plant health.",
  },
  {
    icon: Camera,
    title: "Growth Photo Journaling",
    description: "Track your plants' progress with timestamped photos and growth analytics.",
  },
  {
    icon: Smartphone,
    title: "Multi-Device Sync",
    description: "Access your plant care data seamlessly across all your devices in real-time.",
  },
  {
    icon: Users,
    title: "Community Sharing",
    description: "Share your plant collection and learn from other plant enthusiasts worldwide.",
  },
]

export default function Features() {
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
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section
      id="features"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#4A7C2C]/5 to-transparent"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Powerful Features for Plant Parents</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to keep your plants healthy and thriving
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-[#7FD99A]/50 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow"
                >
                  <Icon size={24} className="text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
