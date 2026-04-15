# Reusable Animation Components

This folder contains reusable GSAP-based animation components used throughout the Trident website.

## Components

### 1. **AnimatedLetter**
Animates individual letters with a color transition effect: gray → red → black.

```tsx
import { AnimatedLetter } from '@/app/components/animations';

<AnimatedLetter delay={100} inView={true}>
  A
</AnimatedLetter>
```

**Props:**
- `children`: string - The letter to animate
- `delay`: number (optional) - Delay before animation starts in ms
- `inView`: boolean (optional) - Triggers animation when true

---

### 2. **AnimatedWord**
Animates entire words by splitting them into individual letters.

```tsx
import { AnimatedWord } from '@/app/components/animations';

<AnimatedWord delay={200} inView={true}>
  Hello
</AnimatedWord>
```

**Props:**
- `children`: string - The word to animate
- `delay`: number (optional) - Base delay, each letter adds 80ms
- `inView`: boolean (optional) - Triggers animation when true

---

### 3. **SplitReveal**
GSAP SplitText-based line-masked reveal with optional color sweep animation.

```tsx
import { SplitReveal } from '@/app/components/animations';

<SplitReveal 
  text="Your text here" 
  active={inView} 
  animateColors={true}
  className="text-lg"
/>
```

**Props:**
- `text`: string - The text to animate
- `active`: boolean - Triggers reveal when true, hides when false
- `className`: string (optional) - Additional CSS classes
- `animateColors`: boolean (optional) - Enables color sweep (gray → red → black)

**Animation Details:**
- Lines slide up from below (yPercent: 110 → 0)
- Duration: 1.5s with 0.1s stagger
- Color sweep (if enabled): starts 0.3s after reveal
- Smooth easing: 'power4.out' for reveal, 'power2.inOut' for hide

---

### 4. **SplitLineReveal**
Advanced GSAP SplitText component with multiple split modes and scroll trigger support.

```tsx
import { SplitLineReveal } from '@/app/components/animations';

<SplitLineReveal 
  mode="lines"
  delay={0.3}
  triggerOnScroll={true}
  className="text-lg"
>
  Your text content here
</SplitLineReveal>
```

**Props:**
- `children`: string - The text content to animate
- `mode`: 'lines' | 'words' | 'chars' (optional) - Split mode (default: 'lines')
- `className`: string (optional) - Additional CSS classes
- `delay`: number (optional) - Delay before animation starts in seconds (default: 0)
- `triggerOnScroll`: boolean (optional) - Enable scroll-triggered animation (default: false)
- `scrollElement`: string | HTMLElement (optional) - Custom scroll container
- `as`: keyof HTMLElementTagNameMap (optional) - HTML tag for wrapper (default: 'div')
- `config`: object (optional) - Custom duration/stagger per mode

**Default Configurations:**
- **Lines**: duration: 0.8s, stagger: 0.08s
- **Words**: duration: 0.6s, stagger: 0.06s
- **Chars**: duration: 0.4s, stagger: 0.008s

**Custom Config Example:**
```tsx
<SplitLineReveal 
  mode="words"
  config={{
    words: { duration: 1.0, stagger: 0.1 }
  }}
>
  Custom timing for words
</SplitLineReveal>
```

---

### 5. **ScrollRevealText**
Scroll-based text color sweep animation (gray → red → black) similar to KeyPoints component.

```tsx
import { ScrollRevealText } from '@/app/components/animations';

function MyComponent() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={cardRef}>
      <ScrollRevealText
        text="Your text content here"
        containerRef={cardRef}
        className="text-xl text-gray-400"
      />
    </div>
  );
}
```

**Props:**
- `text`: string - The text content to animate
- `containerRef`: RefObject<HTMLDivElement | null> - Reference to the container element for scroll tracking
- `className`: string (optional) - Additional CSS classes

**Animation Details:**
- Text starts in light gray (#d0d0d0)
- As you scroll, a red sweep (#dc2626) moves across the text
- After the red sweep passes, text turns black (#1a1a1a)
- Smooth color transitions with 0.15s duration
- Progress based on scroll position within viewport

---

## Usage Examples

### Team Member Names
```tsx
<h3>
  <AnimatedWord delay={200} inView={inView}>
    {member.firstname}
  </AnimatedWord>{" "}
  <AnimatedWord delay={400} inView={inView}>
    {member.lastname}
  </AnimatedWord>
</h3>
```

### Team Member Bio (Option 1 - SplitReveal with color sweep)
```tsx
<SplitReveal 
  text={member.bio} 
  active={inView} 
  animateColors={true}
/>
```

### Team Member Bio (Option 2 - SplitLineReveal with scroll trigger)
```tsx
<SplitLineReveal
  mode="lines"
  delay={0.3}
  triggerOnScroll={false}
  className="text-gray-600"
>
  {member.bio}
</SplitLineReveal>
```

### Team Member Bio (Option 3 - ScrollRevealText with scroll-based sweep)
```tsx
function TeamCard({ member }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={cardRef}>
      <ScrollRevealText
        text={member.bio}
        containerRef={cardRef}
        className="text-xl leading-[1.4]"
      />
    </div>
  );
}
```

### Section Headers
```tsx
<h2>
  <AnimatedWord delay={200} inView={inView}>Meet</AnimatedWord>{" "}
  <AnimatedWord delay={400} inView={inView}>The</AnimatedWord>{" "}
  <AnimatedWord delay={600} inView={inView}>Team</AnimatedWord>
</h2>
```

---

## Components Using These Animations

- `Benefits.tsx` - Uses SplitReveal for benefit descriptions
- `Team/TeamCard.tsx` - Uses AnimatedWord for names, SplitReveal for bios
- `Team/TeamHeader.tsx` - Uses AnimatedWord for section title
- `BrandsLine.tsx` - Uses AnimatedWord for brand statement

---

## Technical Notes

- All components use GSAP and SplitText plugin
- SplitReveal uses line masking for smooth reveals
- Color transitions use CSS transitions for performance
- Components are optimized for React 18+ with proper cleanup
- All animations respect the `inView` prop for scroll-triggered effects
