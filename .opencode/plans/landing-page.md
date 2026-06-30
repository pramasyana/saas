# Landing Page Implementation Plan

## Stack
- Laravel 13 + Inertia.js 3 + React 19 + TypeScript + Tailwind CSS v4
- Framer Motion (needs `npm install framer-motion`)
- Font: Instrument Sans (Bunny CDN, already configured)

---

## Files to Create / Modify

### 1. Theme — `resources/css/app.css`
Add brand tokens to existing `@theme` block and animation keyframes.

```
--color-primary: #6D28D9
--color-primary-light: #A78BFA
--color-primary-dark: #5B21B6
--color-success: #22C55E
--color-danger: #EF4444
--color-warning: #F59E0B
--color-border: #ECECEC
```

Add `@keyframes float`, `float-delayed`, `pulse-glow`.

### 2. Types — `resources/js/types/landing.ts`
Shared types: NavLink, PricingPlan, BusinessType, Feature, TimelineStep.

### 3. UI Components — `resources/js/components/`

| File | Component | Description |
|------|-----------|-------------|
| `Button.tsx` | Button | Variants: primary/secondary/outline. Sizes: sm/md/lg. Framer hover lift + glow. |
| `Badge.tsx` | Badge | Small colored pill (new, popular, beta) |
| `Card.tsx` | Card | White bg, rounded-2xl, shadow-sm, hover:shadow-lg, hover:scale-[1.02] |
| `Section.tsx` | Section | Padding wrapper, optional heading + subheading, optional id |
| `FadeIn.tsx` | FadeIn | motion.div whileInView fade-up 40px, once, configurable delay |
| `FeatureCard.tsx` | FeatureCard | Icon + title + description, hover scale |
| `PricingCard.tsx` | PricingCard | Name, price toggle, feature list, CTA, popular badge |
| `Timeline.tsx` | Timeline | Horizontal 5-step, vertical on mobile, staggered fade-in |
| `IconBox.tsx` | IconBox | Colored container for icons |
| `StatCard.tsx` | StatCard | Large number + label |
| `Navbar.tsx` | Navbar | Sticky, transparent→white on scroll, mobile hamburger, CTA button |
| `Footer.tsx` | Footer | Logo, links, social, copyright |
| `DashboardMockup.tsx` | DashboardMockup | SVG dashboard: sidebar, cards, chart, table, floating phone |

### 4. Sections — `resources/js/pages/landing/`

| File | Section | Key Content |
|------|---------|-------------|
| `HeroSection.tsx` | Hero | LHS: headline with gradient "Grow Smarter", 2 CTAs, 4 pills. RHS: DashboardMockup |
| `ProblemSection.tsx` | Problem | 5 red bullets, red result card |
| `SolutionSection.tsx` | Solution | Purple icon, 6 features, purple highlight |
| `BenefitsSection.tsx` | Benefits | Green checklist, green highlight |
| `TargetAudienceSection.tsx` | Target | 8 business type cards |
| `HowItWorksSection.tsx` | How It Works | 5-step timeline |
| `PricingSection.tsx` | Pricing | 4 plans, monthly/yearly toggle |
| `FeaturesSection.tsx` | Features | 16 features grid |
| `MarketSection.tsx` | Market | $7.5B+, 16% CAGR, world map |
| `WhyNowSection.tsx` | Why Now | Bullet list |
| `DifferentiationSection.tsx` | Differentiation | Comparison card |
| `GoalSection.tsx` | Goal | Purple gradient card |
| `CtaFooter.tsx` | CTA Footer | Large CTA + 2 buttons |
| `FaqSection.tsx` | FAQ | Accordion |

### 5. Page — `resources/js/pages/welcome.tsx`
Replace with landing page assembly: Navbar → 14 sections → Footer.

### 6. Route — `routes/web.php`
No change needed (already points to `welcome`).

---

## Animations
- Hero: Framer FadeIn stagger
- Dashboard: CSS float keyframes (continuous)
- Cards: FadeIn on scroll, hover scale
- Buttons: Hover lift + glow
- Navbar: Transparent→white on scroll
- Timeline: Staggered slide-up
- Pricing: Hover lift, popular card pulse glow

## Colors
- `#6D28D9` Primary
- `#A78BFA` Primary light
- `#22C55E` Success
- `#EF4444` Danger
- `#F59E0B` Warning
- `#FFFFFF` Card/Background
- `#ECECEC` Border

## Execution Order
1. app.css — tokens + keyframes
2. types/landing.ts — shared types
3. FadeIn.tsx — animation wrapper
4. Button, Badge, Card, Section, IconBox — primitives
5. DashboardMockup.tsx — SVG component
6. Navbar, Footer — persistent chrome
7. FeatureCard, PricingCard, StatCard, Timeline — composites
8. All 14 section components
9. welcome.tsx — final assembly
