# 🎬 Scroll Video App — Apple-Style

A scroll-driven video experience built with pure React.
No GSAP, no ScrollTrigger, no heavy libraries.

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Replace the video (optional)
# Drop your video into: public/hero-video.mp4

# 3. Run locally
npm start
# Opens at http://localhost:3000
```

## 📦 How It Works

| Technique | Purpose |
|---|---|
| `video.currentTime` seek | Drive frames by scroll position |
| `requestAnimationFrame` | Smooth, non-blocking frame updates |
| `IntersectionObserver` | Only run scroll math when visible |
| Passive scroll listener | Never block the main thread |
| `preload="auto"` | Browser buffers full video up front |
| Sticky positioning | Lock video while user scrolls through |

## 📁 Structure

```
src/
  components/
    ScrollVideoEngine.js  ← Core engine (reusable)
  App.js                  ← Sections, text overlays, layout
  index.js                ← Entry point
public/
  hero-video.mp4          ← Your video goes here
  index.html
```

## ✏️ Customise

**Change text:** Edit the `SECTIONS` array in `App.js`  
**Change scroll length:** Adjust `scrollHeight="550vh"` on `<ScrollVideoEngine>`  
**Change video:** Replace `public/hero-video.mp4`

## 🚀 Production Build

```bash
npm run build
# Outputs to /build — deploy to Vercel / Netlify / any static host
```
