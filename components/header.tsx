"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export default function Header({ isDark, setIsDark }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const navItems = ["Features", "How It Works", "Pricing", "About"]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🌱</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">PlantCare</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="text-sm font-medium hover:text-[#4A7C2C] transition-colors"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Button 
            className="hidden sm:inline-flex bg-[#4A7C2C] hover:bg-[#2D5016] text-white"
            onClick={() => window.location.href = '/signin'}
          >
            Sign In
          </Button>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-card border-b border-border"
        >
          <nav className="flex flex-col gap-4 p-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm font-medium hover:text-[#4A7C2C] transition-colors"
              >
                {item}
              </a>
            ))}
            <Button 
              className="w-full bg-[#4A7C2C] hover:bg-[#2D5016] text-white"
              onClick={() => window.location.href = '/signin'}
            >
              Sign In
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
