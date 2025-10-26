"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Heart, Users, MessageCircle, BookOpen, Shield } from "lucide-react"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, useMotionValue } from "framer-motion"
import { Card } from "@/components/ui/card"
import { useRef, useState, useEffect } from "react"

const features = [
  {
    icon: Users,
    title: "Supportive Community",
    description: "Connect with thousands of people who understand your journey and share similar experiences.",
  },
  {
    icon: MessageCircle,
    title: "Peer Support Groups",
    description: "Join moderated groups focused on specific mental health topics and challenges.",
  },
  {
    icon: BookOpen,
    title: "Wellness Resources",
    description: "Access curated articles, guides, and expert-backed content for mental wellness.",
  },
  {
    icon: Shield,
    title: "Privacy & Safety",
    description: "Your privacy is paramount. All conversations are encrypted and completely confidential.",
  },
]

export function Hero() {
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Mobile-optimized animation ranges
  const heroStart = isMobile ? 0 : 0
  const heroEnd = isMobile ? 0.7 : 0.5
  const featuresStart = isMobile ? 0.2 : 0.3
  const featuresEnd = isMobile ? 0.9 : 0.8

  // Hero card animations - mobile optimized
  const heroScale = useTransform(scrollYProgress, [heroStart, heroEnd], [1, isMobile ? 0.7 : 0.8])
  const heroOpacity = useTransform(scrollYProgress, [heroStart, heroEnd], [1, 0])
  const heroY = useTransform(scrollYProgress, [heroStart, heroEnd], [0, isMobile ? 60 : 100])
  const heroBorderRadius = useTransform(scrollYProgress, [heroStart, heroEnd], [24, isMobile ? 12 : 16])

  // Features card animations - mobile optimized
  const featuresScale = useTransform(scrollYProgress, [featuresStart, featuresEnd], [isMobile ? 0.6 : 0.7, 1])
  const featuresOpacity = useTransform(scrollYProgress, [featuresStart, featuresEnd], [0, 1])
  const featuresY = useTransform(scrollYProgress, [featuresStart, featuresEnd], [isMobile ? 80 : 100, 0])
  const featuresBorderRadius = useTransform(scrollYProgress, [featuresStart, featuresEnd], [isMobile ? 8 : 12, 24])

  // Smooth spring animations with mobile-optimized settings
  const springConfig = isMobile 
    ? { stiffness: 150, damping: 25 } // Stiffer on mobile for better performance
    : { stiffness: 100, damping: 30 }

  const smoothHeroScale = useSpring(heroScale, springConfig)
  const smoothHeroOpacity = useSpring(heroOpacity, springConfig)
  const smoothHeroY = useSpring(heroY, springConfig)
  const smoothFeaturesScale = useSpring(featuresScale, springConfig)
  const smoothFeaturesOpacity = useSpring(featuresOpacity, springConfig)
  const smoothFeaturesY = useSpring(featuresY, springConfig)

  // 3D interactive image motion values
  const heroRef = useRef<HTMLDivElement | null>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const smoothRotX = useSpring(rotX, { stiffness: 120, damping: 18 })
  const smoothRotY = useSpring(rotY, { stiffness: 120, damping: 18 })

  // Ensure default shadow / extrude / wave CSS variables exist so the shadow
  // and waves are visible before any pointer movement occurs.
  useEffect(() => {
    const el = heroRef.current
    const wrapper = containerRef.current as HTMLElement | null
    if (!el) return
    try {
      el.style.setProperty('--shadow-x', `0px`)
      el.style.setProperty('--shadow-y', `0px`)
  el.style.setProperty('--shadow-blur', `22px`)
  el.style.setProperty('--shadow-opacity', `0.7`)
      el.style.setProperty('--shadow-scale', `1.08`)
  el.style.setProperty('--extrude-blur', `24px`)
  el.style.setProperty('--extrude-opacity', `0.85`)
      el.style.setProperty('--extrude-x', `0px`)
      el.style.setProperty('--extrude-y', `8px`)

      el.style.setProperty('--wave-x', `0px`)
      el.style.setProperty('--wave-y', `0px`)
      // Mirror a few defaults to the container so features/cards outside the
      // hero can use the same CSS vars (box-shadow, card shadow) immediately.
      if (wrapper) {
        wrapper.style.setProperty('--img-shadow', '0 36px 80px rgba(2,6,23,0.46)')
        wrapper.style.setProperty('--card-shadow', '0 18px 48px rgba(2,6,23,0.12)')
      }
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    // nothing to cleanup beyond motion values; keep hook to satisfy linter if needed
    return () => {
      rotX.set(0)
      rotY.set(0)
    }
  }, [])

  // Update CSS variables for shadow responsiveness when rotation values change
  const updateShadowVars = () => {
    const el = heroRef.current
    if (!el) return
    const x = smoothRotY.get() || 0
    const y = smoothRotX.get() || 0
    // shadow moves opposite to light direction -> opposite rotation
    const shadowX = -x * 2.4 // px multiplier
    const shadowY = Math.abs(y) * 1.6 // keep shadow mostly horizontal/vertical offset subtle
    const blur = Math.min(48, 12 + Math.abs(x) * 3 + Math.abs(y) * 2)
  const opacity = Math.min(0.9, 0.5 + (Math.abs(x) + Math.abs(y)) / 40)
    const scale = 1 + Math.min(0.12, (Math.abs(x) + Math.abs(y)) / 60)
    try {
      el.style.setProperty('--shadow-x', `${shadowX}px`)
      el.style.setProperty('--shadow-y', `${shadowY}px`)
      el.style.setProperty('--shadow-blur', `${blur}px`)
      el.style.setProperty('--shadow-opacity', `${opacity}`)
      el.style.setProperty('--shadow-scale', `${scale}`)
      // extruded long shadow properties
      const extrudeBlur = Math.min(32, 12 + (Math.abs(x) + Math.abs(y)) * 2)
  const extrudeOpacity = Math.min(1, 0.6 + (Math.abs(x) + Math.abs(y)) / 30)
      const extrudeX = -x * 18
      const extrudeY = Math.max(6, Math.abs(y) * 12)
      el.style.setProperty('--extrude-blur', `${extrudeBlur}px`)
      el.style.setProperty('--extrude-opacity', `${extrudeOpacity}`)
      el.style.setProperty('--extrude-x', `${extrudeX}px`)
      el.style.setProperty('--extrude-y', `${extrudeY}px`)
    } catch (e) {
      // ignore
    }
  }

  useMotionValueEvent(smoothRotX, 'change', updateShadowVars)
  useMotionValueEvent(smoothRotY, 'change', updateShadowVars)

  return (
    <div ref={containerRef} className="overflow-hidden">
      {/* animated shadow CSS injected locally to keep styling colocated */}
      <style>{`
        @keyframes glowBluePink {
          0% {
            box-shadow: 0 36px 80px rgba(37,99,235,0.46), 0 6px 18px rgba(37,99,235,0.18);
            filter: drop-shadow(0 18px 40px rgba(37,99,235,0.28));
          }
          50% {
            box-shadow: 0 44px 96px rgba(219,39,119,0.52), 0 8px 22px rgba(219,39,119,0.22);
            filter: drop-shadow(0 22px 48px rgba(219,39,119,0.32));
          }
          100% {
            box-shadow: 0 36px 80px rgba(37,99,235,0.46), 0 6px 18px rgba(37,99,235,0.18);
            filter: drop-shadow(0 18px 40px rgba(37,99,235,0.28));
          }
        }

        .animated-glow {
          animation: glowBluePink 6s ease-in-out infinite;
          will-change: box-shadow, filter;
        }

        @media (prefers-reduced-motion: reduce) {
          .animated-glow { animation: none !important; }
        }
      `}</style>
      <section className="relative py-12 md:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                  Your Mental Health Matters
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance">
                  Connect with a supportive community, share your journey, and discover resources for your mental
                  wellness. You are never alone.
                </p>

              <div className="flex items-center gap-6 sm:gap-8 pt-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">50K+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active Members</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">24/7</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Support Available</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Confidential</p>
                </div>
              </div>
              </div>
            </motion.div>
  
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-full flex items-center justify-center mt-8 md:mt-0">
              <div className="absolute inset-0 from-primary/20 to-accent/20 rounded-3xl blur-3xl -z-10 pointer-events-none"></div>

              {/* Replace boxed card with a free 3D interactive image that tilts with pointer/mouse */}
              <div className="w-full max-w-md md:max-w-lg lg:max-w-[520px]">
                <div style={{ perspective: 1400 }} className="w-full">
                  <motion.div
                    className="relative w-full rounded-2xl mx-auto cursor-grab"
                    style={{ transformStyle: 'preserve-3d', rotateX: smoothRotX, rotateY: smoothRotY }}
                    ref={heroRef}
                    onPointerMove={(e) => {
                      const el = heroRef.current
                      if (!el) return
                      const rect = el.getBoundingClientRect()
                      const px = (e.clientX - rect.left) / rect.width // 0..1
                      const py = (e.clientY - rect.top) / rect.height // 0..1
                      const x = (px - 0.5) * 2 // -1..1
                      const y = (py - 0.5) * 2 // -1..1
                      const maxDeg = isMobile ? 6 : 12
                      rotY.set(x * maxDeg)
                      rotX.set(-y * maxDeg)

                      // layered parallax offsets (CSS variables)
                      try {
                        el.style.setProperty('--back-x', `${-x * 8}px`)
                        el.style.setProperty('--back-y', `${y * 6}px`)
                        el.style.setProperty('--mid-x', `${-x * 12}px`)
                        el.style.setProperty('--mid-y', `${y * 9}px`)
                        el.style.setProperty('--front-x', `${-x * 18}px`)
                        el.style.setProperty('--front-y', `${y * 12}px`)
                        el.style.setProperty('--shadow-x', `${-x * 28}px`)
                        el.style.setProperty('--shadow-y', `${y * 24}px`)
                      } catch (err) {
                        // ignore DOM write errors
                      }
                    }}
                    onPointerLeave={() => {
                      rotX.set(0)
                      rotY.set(0)
                      const el = heroRef.current
                      if (el) {
                        el.style.setProperty('--back-x', `0px`)
                        el.style.setProperty('--back-y', `0px`)
                        el.style.setProperty('--mid-x', `0px`)
                        el.style.setProperty('--mid-y', `0px`)
                        el.style.setProperty('--front-x', `0px`)
                        el.style.setProperty('--front-y', `0px`)
                        el.style.setProperty('--shadow-x', `0px`)
                        el.style.setProperty('--shadow-y', `0px`)
                      }
                    }}
                    onPointerDown={() => {
                      // provide slight press feedback
                      rotX.set(rotX.get() * 0.6)
                      rotY.set(rotY.get() * 0.6)
                    }}
                  >
                    {/* We'll wire pointer handlers below via React refs and motion values */}
                    {/* Image layer */}
                    <div
                      id="hero-3d-wrapper"
                      className="relative rounded-2xl overflow-hidden shadow-2xl animated-glow"
                      style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
                    >
                      {/* deep background layer - blurred, slightly desaturated */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/hero.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(6px) contrast(0.9) brightness(0.95)',
                          transform: 'translate3d(var(--back-x,0), var(--back-y,0), -60px) scale(1.06)',
                          zIndex: 10,
                        }}
                      />

                      {/* mid layer for parallax */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: "url('/hero.png')",
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          transform: 'translate3d(var(--mid-x,0), var(--mid-y,0), -12px) scale(1.03)',
                          zIndex: 20,
                          willChange: 'transform',
                        }}
                      />

                      {/* front layer (main) */}
                      <img
                        src="/hero.png"
                        alt="A safe space for your mental health journey"
                        className="relative block w-full h-auto"
                        style={{ transform: 'translate3d(var(--front-x,0), var(--front-y,0), 40px)', willChange: 'transform', boxShadow: 'var(--img-shadow, 0 36px 80px rgba(2,6,23,0.46))' }}
                      />

                      {/* dynamic shadow that moves opposite to pointer to sell depth */}
                      {/* extruded 3D shadow (long soft contact shadow) */}
                      <div
                        aria-hidden
                        className="absolute left-1/2 -translate-x-1/2 w-11/12 h-24 bottom-6 rounded-2xl"
                        style={{
                          background: 'linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.08) 60%, rgba(2,6,23,0))',
                          transform: 'translate3d(var(--extrude-x,0), var(--extrude-y,0), 0) rotateX(80deg) scaleX(1.04)',
                          filter: 'blur(var(--extrude-blur,18px))',
                          opacity: 'var(--extrude-opacity,0.55)',
                          zIndex: 6,
                          pointerEvents: 'none',
                        }}
                      />

                      <div
                        aria-hidden
                        className="absolute left-1/2 transform -translate-x-1/2 w-3/4 h-6 bottom-6 rounded-full"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(2,6,23,0.45), rgba(2,6,23,0.12) 40%, rgba(2,6,23,0))',
                          transform: 'translate3d(var(--shadow-x,0), var(--shadow-y,0), 0) scale(var(--shadow-scale,1.08))',
                          filter: 'blur(var(--shadow-blur,20px))',
                          opacity: 'var(--shadow-opacity,0.45)',
                          zIndex: 5,
                          pointerEvents: 'none',
                        }}
                      />

                      {/* glossy overlay */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-40"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.02) 100%)',
                          mixBlendMode: 'overlay',
                          opacity: 0.45,
                          zIndex: 40,
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-12 md:py-20 lg:py-32 bg-muted/30">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* decorative image placed inside the container so it aligns with the content's left edge */}
          
          <div className="relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Why Choose Harmony?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance px-4">
              We have designed every feature with your mental health and wellbeing in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-6 sm:p-8 bg-card hover:shadow-lg transition-shadow border-border" style={{ boxShadow: 'var(--card-shadow, 0 18px 48px rgba(2,6,23,0.12))' }}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}