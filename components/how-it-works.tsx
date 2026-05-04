"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Plus, Settings, Bell } from "lucide-react"

const steps = [
  {
    icon: Plus,
    title: "Add Your Plants",
    description: "Snap a photo or search our database to add plants to your collection.",
  },
  {
    icon: Settings,
    title: "Set Care Schedules",
    description: "Customize watering, fertilizing, and other care routines for each plant.",
  },
  {
    icon: Bell,
    title: "Get Timely Reminders",
    description: "Receive smart notifications at the perfect time to care for your plants.",
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="how-it-works" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get started in three simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#4A7C2C] via-[#7FD99A] to-[#4A7C2C] opacity-30" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step number circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                {index + 1}
              </motion.div>

              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 mx-auto mb-4 bg-[#7FD99A]/20 rounded-lg flex items-center justify-center"
                >
                  <step.icon size={24} className="text-[#4A7C2C]" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
