# Mindland Design System

A premium, AI-first educational platform design system inspired by Stripe, Vercel, Linear, and Framer.

This system defines how every UI component should look, behave, and feel.

---

# 1. DESIGN PRINCIPLES

## Core Philosophy
- Simplicity over complexity
- Space is design (whitespace is a feature)
- Motion should be subtle and meaningful
- Everything must feel calm, intelligent, and premium
- No clutter, no noise, no unnecessary decoration

## Emotional Goals
- Trust (for teachers)
- Curiosity (for students)
- Creativity (for learning AI & coding)
- Future-oriented feeling

---

# 2. VISUAL STYLE

## Overall Aesthetic
- Modern SaaS (Stripe / Linear style)
- Soft futuristic education UI
- AI-inspired gradients and glow
- Clean and spacious layout

---

# 3. COLOR SYSTEM

## Primary Palette
- Primary: #6C5CE7 (Purple)
- Secondary: #3B82F6 (Blue)
- Accent: #00FFB2 (Neon Green)

## Backgrounds
- Light: #FFFFFF
- Soft Gray: #F7F8FA
- Dark Section: #0B0F19

## Gradients
- Hero Gradient: linear-gradient(135deg, #6C5CE7, #3B82F6)
- Accent Glow: rgba(108, 92, 231, 0.3)

## Rules
- Never use random colors
- Always use these tokens

---

# 4. TYPOGRAPHY SYSTEM

## Font
- Primary: Inter
- Headings alternative: Space Grotesk

## Type Scale

- H1: 56px / 64px line-height
- H2: 40px / 48px
- H3: 28px / 36px
- Body: 16px / 26px
- Small: 14px / 20px

## Rules
- Headings must be bold and short
- Body text must be max-width 650px
- Avoid long paragraphs

---

# 5. SPACING SYSTEM

Base: 8px grid system

## Spacing scale:
- 4px
- 8px
- 16px
- 24px
- 32px
- 48px
- 64px
- 96px

## Rules:
- Never use arbitrary spacing
- Always follow 8px system

---

# 6. BORDER RADIUS

- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px

Rule:
- SaaS cards: 16px
- Buttons: 12px

---

# 7. SHADOW SYSTEM

## Soft Shadows only

- Small: subtle elevation
- Medium: card hover
- Large: modal depth

NO harsh shadows allowed.

---

# 8. COMPONENT STANDARDS

## Buttons

Types:
- Primary (gradient)
- Secondary (outline)
- Ghost

Rules:
- Always 44px height minimum
- Smooth hover scale (1.02)
- Framer Motion hover animation

---

## Cards

- White or soft gray background
- 16px radius
- subtle border: rgba(0,0,0,0.06)
- hover lift effect

---

## Inputs

- clean minimal border
- focus state: purple glow
- 12px radius

---

# 9. LAYOUT RULES

## Grid
- max width: 1200px
- centered layout
- 12 column grid for desktop

## Sections
- Large vertical spacing (96px between sections)
- Each section must breathe

---

# 10. ANIMATION SYSTEM (FRAMER MOTION)

## Rules
- All animations must be subtle
- No aggressive movement
- Motion = meaning, not decoration

## Patterns

### Page Load
- fade in + slight upward motion

### Scroll Reveal
- opacity: 0 → 1
- y: 20 → 0
- duration: 0.6s

### Stagger
- children delay: 0.1–0.2s

### Hover
- scale: 1.02
- transition: spring

---

# 11. INTERACTION DESIGN

## Micro-interactions:
- Buttons respond instantly
- Cards lift slightly
- Inputs glow on focus
- Smooth transitions everywhere

---

# 12. MOBILE RULES

- Mobile-first always
- Stack all grids vertically
- Reduce font size slightly
- Remove heavy animations on mobile

---

# 13. AVOID THESE

❌ Generic Tailwind UI
❌ Too many colors
❌ Heavy shadows
❌ Over-animation
❌ Dense layouts
❌ Comic-style design

---

# 14. AI PRODUCT PERSONALITY (IMPORTANT)

Mindland UI must feel:

- Intelligent
- Friendly
- Creative
- Calm
- Premium
- Future-oriented

NOT:
- childish UI
- gaming UI
- cluttered dashboards

---

# 15. DESIGN LANGUAGE SUMMARY

Think:

Stripe + Vercel + Duolingo + Notion + Canva Education

but:
- more futuristic
- more AI-oriented
- more educational

---

# PERFORMANCE RULES

- Prefer Server Components
- Avoid unnecessary "use client"
- Client Components must be isolated
- Use dynamic imports for heavy UI
- Animations should not force entire sections to become client-rendered
- Keep hydration minimal

END OF DESIGN SYSTEM