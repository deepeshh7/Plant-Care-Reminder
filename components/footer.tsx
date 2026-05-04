"use client"

import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: ["Features", "Pricing", "Security", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  }

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4A7C2C] to-[#7FD99A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌱</span>
              </div>
              <span className="font-bold text-lg">PlantCare</span>
            </div>
            <p className="text-muted-foreground text-sm">Smart plant care reminders for everyone.</p>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© {currentYear} PlantCare. All rights reserved.</p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-lg bg-muted hover:bg-[#4A7C2C]/20 flex items-center justify-center transition-colors"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
