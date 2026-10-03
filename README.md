# 🌻 Birthday Experience — Frontend

A personal interactive birthday website with animations, memories, shayaris, party vibes, and a Lord Jagannatha Darshan finale.

## ⚡ Quick Start

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## 📁 Customize Your Content

Everything is in **one file**: `client/src/data/birthday.js`

```js
// Change her name
export const birthdayData = {
  name: "Birthday Girl",    // ← her name
  nickname: "Sunshine",     // ← nickname used in final screen
  ...
};

// Add your memories (photos go in client/public/memories/)
export const memories = [
  { date: "January 2026", title: "The Beginning", image: "/memories/1.jpg", ... },
  ...
];

// Replace shayaris with your own
export const shayaris = [
  { text: "Your shayari here...", attr: "— label 🌻" },
  ...
];
```

---

## 🖼️ Add Your Files

| File | Where to drop it | Used in |
|------|-----------------|---------|
| `jagannatha.jpg` | `client/public/` | Darshan finale ✅ Already added |
| `party-video.mp4` | `client/public/` | Party vibes section |
| `party-poster.jpg` | `client/public/` | Video thumbnail |
| `character.png` | `client/public/` | Hero character (optional) |
| `memories/1.jpg` … `4.jpg` | `client/public/memories/` | Timeline section |

---

## 🗂️ Project Structure

```
client/
├── public/
│   ├── jagannatha.jpg        ← Darshan image ✅
│   ├── party-video.mp4       ← Add your video here
│   └── memories/             ← Add memory photos here
├── src/
│   ├── data/
│   │   └── birthday.js       ← 🔑 ALL CONTENT LIVES HERE
│   ├── components/
│   │   ├── LoadingScreen/    ← Phase 1: Sunflower grow animation
│   │   ├── CharacterScene/   ← Phase 2: Character runs toward camera
│   │   ├── Timeline/         ← Phase 3: Memory timeline
│   │   ├── Polaroid/         ← Phase 3: Polaroid hover cards
│   │   ├── LittleThings/     ← Phase 3: Expandable cards
│   │   ├── MessageCarousel/  ← Phase 4: 6-slide message carousel
│   │   ├── BirthdayLetter/   ← Phase 4: Envelope + shayari reveal
│   │   ├── PartyVibes/       ← Phase 4: Video + throw/cheer interaction
│   │   ├── DarshanSection/   ← Phase 5: Temple doors + Jagannatha
│   │   └── FinalScreen/      ← Phase 5: Closing screen
│   ├── hooks/
│   │   └── useLenis.js       ← Smooth scroll
│   ├── App.jsx               ← Connects all sections
│   └── index.css             ← Global styles + animations
└── package.json
```

---

## 🚀 Deploy

```bash
cd client
npm run build
# Upload the dist/ folder to Vercel or Netlify
```

**Vercel (recommended):**
1. Push to GitHub
2. Import repo in Vercel
3. Set root directory to `client`
4. Deploy ✅

---

## 🎨 Change Colors / Fonts

Edit `client/tailwind.config.js` → `theme.extend.colors`

Main palette:
- Cream: `#FDF8F0`
- Sunflower: `#F9C74F`
- Golden: `#F4A020`
- Earth: `#3D2B1F`

---

Made with 💛 by Kartik
