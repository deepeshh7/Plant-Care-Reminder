"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Screenshots from "@/components/screenshots"
import TargetAudience from "@/components/target-audience"
import Statistics from "@/components/statistics"
import CTA from "@/components/cta"
import Footer from "@/components/footer"
import FloatingCTA from "@/components/floating-cta"

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  return (
    <main className="bg-background text-foreground">
      <Header isDark={isDark} setIsDark={setIsDark} />
      <Hero />
      <Features />
      <HowItWorks />
      <Screenshots />
      <TargetAudience />
      <Statistics />
      <CTA />
      <Footer />
      <FloatingCTA />
    </main>
  )
}
