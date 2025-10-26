"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-primary/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Prioritize Your Mental Health?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Join thousands of people building a healthier, happier life together. Start your journey today.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
            Join Harmony Now <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
