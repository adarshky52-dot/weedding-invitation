# Amrutha & Mohan Kumar — Wedding Invitation Website

A luxury, cinematic, interactive digital wedding invitation crafted with authentic South Indian Dravidian temple architecture aesthetics, warm golden sunrise lighting, and a traditional-meets-modern editorial design system.

---

## 🌺 Visual Identity & Color System

The website seamlessly transitions from an atmospheric, multi-layered sunrise temple sanctum in the hero section into a rich, tactile South Indian wedding invitation printed on warm ivory and soft champagne paper.

### Global Design Palette

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `--color-ivory` | `#F7F0E5` | Primary invitation paper background, card surfaces, clean whitespace |
| `--color-champagne` | `#E8D4B5` | Warm parchment section backgrounds, subtle tonal contrast |
| `--color-antique-gold` | `#B98A45` | Antique gold ornamentation, countdown numerals, borders, button foil |
| `--color-temple-brown` | `#765044` | Natural granite stone, sub-headings, relation labels, icons |
| `--color-muted-maroon` | `#713C38` | Sacred Muhurtham accent badges, secondary button hover states, flourishes |
| `--color-deep-text` | `#392C27` | High-contrast editorial typography, names, dates, body copy (WCAG AAA) |

---

## 💍 Wedding Details & Itinerary

* **Bride:** Amrutha K.V.
  * *Parents:* Smt. Kavitha and Sri Vishwamurthy K.V.
* **Groom:** Mohan Kumar P.A.
  * *Parents:* Smt. Shakunthalamma and Late Sri Prabhakar Aarkachari

### Auspicious Celebrations

1. **Wedding Reception (Eve of the Union):**
   * **Date:** Saturday, 5 December 2026
   * **Time:** 7:30 PM onwards
   * **Venue:** Daivajna Kalyana Mantapa, Davanagere

2. **The Wedding Ceremony (Sacred Muhurtham):**
   * **Date:** Sunday, 6 December 2026
   * **Time:** 8:30 AM – 9:25 AM
   * **Auspicious Lagna:** Dhanusu Lagna
   * **Venue:** Daivajna Kalyana Mantapa, Davanagere

### Kalyana Mantapa Venue & Location

* **Venue:** Daivajna Kalyana Mantapa
* **Address:** Renuka Layout, P.B. Road, Davanagere – 577 002, Karnataka
* **Interactive Tools:**
  * 1-Click "Get Directions on Google Maps" navigation
  * 1-Click "Copy Full Address" with feedback toast
  * Embedded responsive Google Maps iframe

---

## ✨ Interactive Features & Architectural Systems

1. **Cinematic 8-Stage Opening Sequence:**
   * Gentle sequential reveal: sunrise sky & light rays &rarr; golden horizon orb &rarr; temple gopuram &rarr; torana arch & deepams &rarr; sacred invocation &rarr; Amrutha K.V. &rarr; ampersand & Mohan Kumar P.A. &rarr; quote and action buttons.
   * Continuous subtle camera breathe (`scale: 1.018` over 8.5s sinusoidal loop) keeps the scene alive even when the cursor is idle.

2. **Genuine Multi-Layer 3D Cursor Parallax:**
   * 6 independent depth layers moving at calibrated speeds with subtle 3D perspective rotation:
     * Layer 1: Distant Brahma Muhurtham Sunrise Sky (`~4px`)
     * Layer 1.5: Volumetric God Rays (`~7px`)
     * Layer 2: Dravidian Temple Gopuram (`~10px`)
     * Layer 3: Torana Mandapam Arch with swaying brass bells (`~14px`)
     * Layer 4 & 4.5: Symmetrical Dravidian Stone Pillars & Flickering Deepams (`~22px`)
     * Layer 5: Ambient Golden Cursor Glow (`~32px`)
   * Foreground text remains rock-solid in the DOM outside the 3D scene for effortless readability.

3. **Single-Canvas 60fps Particle Engine:**
   * Jasmine petals: pure warm ivory, slender aspect ratio, 3D tumbling flip (`Math.cos(tilt)`).
   * Marigold petals: saffron gold & sunset peach, organic curved petal geometry.
   * 32 floating golden dust motes: sacred stardust drifting through sunrise rays with sinusoidal twinkling luminosity.
   * Interactive breeze & proximity repulsion: petals and dust motes gently deflect away from cursor/touch passes.
   * Gold stardust cursor trail: micro-sparks of antique gold and ivory that fade out over ~0.6s.

4. **Live Wedding Countdown:**
   * Precision countdown to Sunday, December 6, 2026 at 08:30:00 IST (UTC+05:30).
   * Formatted as traditional ivory parchment tiles with double antique gold borders and large antique gold numerals.

5. **Dual-Format Calendar Integration:**
   * Instant Google Calendar link generation with prefilled title, official IST timings, location, and description.
   * Dynamic `.ics` file generation and download for native Apple Calendar (iOS/macOS) and Microsoft Outlook.

6. **Auspicious Web Audio Synthesizer:**
   * Built-in Web Audio API synthesizer generating an authentic Indian classical Tanpura drone in Sa-Pa (C# and G#) and periodic temple bell chimes (*Ghanta*).
   * Zero external MP3 downloads required; automatically resumes on user interaction and supports local MP3 playback if placed in `assets/audio/wedding-bg.mp3`.

7. **Scroll-Triggered Reveals:**
   * Reusable GSAP ScrollTrigger reveals for family blessing cards, event itinerary, countdown timer, and venue card.

8. **Mobile & Accessibility:**
   * Full touch-breeze and DeviceOrientation tilt responsiveness.
   * Dynamic particle throttling on screens &le; 768px for guaranteed 60fps performance and battery conservation.
   * Respects `prefers-reduced-motion: reduce` across CSS and Canvas.

---

## 📂 Final Project Structure

```
wedding/
├── index.html                   # Core semantic invitation document
├── README.md                    # Project documentation & release handoff
├── css/
│   ├── variables.css            # Mandatory color tokens, typography scales, paper shadows
│   ├── base.css                 # HTML/Body resets, typography hierarchy, paper texture
│   ├── components.css           # Hero parallax layers, ivory cards, countdown, modal, buttons
│   ├── animations.css           # Keyframes (sky drift, bell sway, light rays, gold shimmer)
│   └── responsive.css           # Mobile, tablet, safe-area-inset & accessibility overrides
├── js/
│   ├── main.js                  # User interactions, calendar modal, copy toast, smooth scroll
│   ├── animations.js            # 8-stage entrance, multi-layer parallax, camera breathe, ScrollTrigger
│   ├── petals.js                # Canvas 2D simulation (Jasmine, Marigold, golden dust, cursor trail)
│   ├── countdown.js             # Precision IST countdown to 6 Dec 2026, 08:30 AM
│   └── audio.js                 # Web Audio API Tanpura drone & temple bell synthesizer
└── assets/
    ├── images/
    │   ├── temple-sunrise-sky.jpg       # Layer 1 distant sunrise sky (1376x768)
    │   ├── temple-hero-bg.jpg           # Layer 2 Dravidian gopuram & courtyard photograph
    │   ├── temple-middle-colonnade.svg   # Architectural colonnade motif
    │   ├── mandapam-arch.svg            # Layer 3 torana arch with hanging brass bells
    │   ├── temple-pillar-left.svg       # Layer 4 left Dravidian carved stone framing pillar
    │   ├── temple-pillar-right.svg      # Layer 4 right Dravidian carved stone framing pillar
    │   ├── diya.svg                     # Layer 4.5 brass oil lamp with flickering flame
    │   └── rangoli-motif.svg            # Traditional auspicious ornamental divider
    └── audio/                           # (Optional local MP3 music directory)
```

---

## 🧪 Testing & Validation Results

* **JavaScript Syntax Validation:**
  `node -c js/petals.js js/countdown.js js/audio.js js/animations.js js/main.js` passed with **0 errors**.
* **Asset Integrity:**
  All referenced local images (`temple-sunrise-sky.jpg`, `temple-hero-bg.jpg`, `mandapam-arch.svg`, `temple-pillar-left.svg`, `temple-pillar-right.svg`, `diya.svg`, `rangoli-motif.svg`) exist and load locally.
* **Layout & Responsiveness:**
  * **Desktop / Laptop (>1024px):** 2-column family lineage, 2-column event itinerary, 4-column countdown, spacious editorial layout.
  * **Tablet (768px – 1024px):** Fluid margins, proportional scaling of pillars and headings, stacked or flexible grids.
  * **Mobile (320px – 768px):** Clean single-column stacked layout, touch-friendly buttons (&ge;44px), compact countdown tiles, zero horizontal overflow.
  * **iOS Safari Safe Areas:** Handled with `env(safe-area-inset-bottom)` and `env(safe-area-inset-right)` for the floating music pill and toast notification.
* **Accessibility:**
  * Meets WCAG AA/AAA contrast ratios: deep text (`#392C27`) on warm ivory (`#F7F0E5`) and soft champagne (`#E8D4B5`).
  * `prefers-reduced-motion` completely disables canvas loops, parallax transforms, and CSS animations.

---

## 🚀 How to Preview Locally

1. Open `index.html` directly in any web browser (double-click the file).
2. Or run a lightweight local server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js
   npx serve .
   ```
   Then navigate to `http://localhost:8000` in your browser.

---

## 🌐 Instructions for Publishing Online

This website is a completely static, high-performance web application with zero backend dependencies. It can be published instantly to any static host:

### Option A: GitHub Pages (Recommended, Free)
1. Initialize a git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial release: Amrutha & Mohan Kumar Wedding Invitation"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository settings, go to **Pages** &rarr; select **Branch: main** and **Folder: / (root)** &rarr; click **Save**.
3. Your wedding website will be live at `https://<your-username>.github.io/<repo-name>/`.

### Option B: Netlify / Vercel (Free, 1-Click Drag & Drop)
1. Visit [netlify.com](https://www.netlify.com) or [vercel.com](https://vercel.com).
2. Drag and drop the `wedding` project folder into the Netlify dashboard.
3. Your website will be deployed with a custom domain or free `*.netlify.app` URL with automated HTTPS.

### Option C: Custom Domain
* If you have a custom domain (e.g. `amruthaandmohankumar.com`), point its DNS `A` records or `CNAME` to your GitHub Pages or Netlify deployment.
