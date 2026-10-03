import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ── confetti palette ──────────────────────────── */
const CONFETTI_COLORS = [
  "#D4649A", "#E87CB0", "#F4A0C8", "#9B4FA0", "#C8A0DC",
  "#FFD700", "#FF6B8A", "#FF9EC0", "#FFB870", "#7AC048",
];
const POPPER_EMOJIS = ["🎉", "🎊", "✨", "🌸", "🌷", "🪷", "💖", "🎀"];
const SHAPES = ["circle", "rect", "star", "ribbon"];
const STREAMER_COLORS = ["#D4649A", "#FFD700", "#9B4FA0", "#E87CB0"];

function rand(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function ParallaxCelebration() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const confettiRef = useRef(null);
  const popLeftRef = useRef(null);
  const popRightRef = useRef(null);
  const fired = useRef(false);

  /* ── spawn one confetti piece ────────────────── */
  const spawnPiece = useCallback((ox, oy, opts = {}) => {
    const c = confettiRef.current;
    if (!c) return;
    const shape = opts.shape || pick(SHAPES);
    const color = opts.color || pick(CONFETTI_COLORS);
    const sz = opts.size || rand(6, 13);

    const el = document.createElement("div");
    el.style.cssText = "position:absolute;pointer-events:none;z-index:30;";

    if (shape === "circle") {
      Object.assign(el.style, { width: sz + "px", height: sz + "px", borderRadius: "50%", background: color });
    } else if (shape === "rect") {
      Object.assign(el.style, { width: sz * 1.6 + "px", height: sz * 0.55 + "px", borderRadius: "2px", background: color });
    } else if (shape === "star") {
      Object.assign(el.style, { fontSize: sz + 4 + "px", lineHeight: "1", color });
      el.textContent = pick(["✦", "✧", "★", "✨"]);
    } else {
      Object.assign(el.style, {
        width: sz * 0.45 + "px", height: sz * 2.8 + "px",
        borderRadius: sz * 0.22 + "px",
        background: `linear-gradient(to bottom,${pick(STREAMER_COLORS)},transparent)`,
      });
    }
    c.appendChild(el);

    gsap.set(el, { left: ox, top: oy, opacity: 1 });
    gsap.to(el, {
      x: opts.sx ?? rand(-260, 260),
      y: (opts.sy ?? rand(-380, -60)) + rand(180, 480),
      rotation: rand(-720, 720),
      opacity: 0,
      duration: opts.dur ?? rand(1.8, 3.2),
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  }, []);

  /* ── popper cannon burst ─────────────────────── */
  const burst = useCallback((side) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const w = sec.clientWidth;
    const h = sec.clientHeight;
    const ox = side === "left" ? rand(10, w * 0.12) : rand(w * 0.88, w - 10);
    const oy = h * 0.55;
    const n = window.innerWidth < 640 ? 18 : 40;

    for (let i = 0; i < n; i++) {
      setTimeout(() => spawnPiece(ox, oy, {
        sx: side === "left" ? rand(30, 320) : rand(-320, -30),
        sy: rand(-460, -80),
      }), i * 16);
    }
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const em = document.createElement("div");
        em.style.cssText = `position:absolute;pointer-events:none;z-index:35;font-size:${rand(16, 28)}px;`;
        em.textContent = pick(POPPER_EMOJIS);
        confettiRef.current?.appendChild(em);
        gsap.set(em, { left: ox, top: oy });
        gsap.to(em, {
          x: (side === "left" ? 1 : -1) * rand(50, 260),
          y: rand(-320, -40),
          rotation: rand(-360, 360),
          opacity: 0,
          duration: rand(1.4, 2.5),
          ease: "power2.out",
          onComplete: () => em.remove(),
        });
      }, i * 45);
    }
  }, [spawnPiece]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sec = sectionRef.current;
      const img = imgRef.current;

      /* ── parallax: image moves slower than scroll ── */
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 0.5 },
        }
      );

      /* ── popper cannons on enter ─────────────────── */
      ScrollTrigger.create({
        trigger: sec,
        start: "top 55%",
        once: true,
        onEnter: () => {
          if (fired.current) return;
          fired.current = true;
          burst("left");
          setTimeout(() => burst("right"), 180);
          setTimeout(() => burst("left"), 550);
          setTimeout(() => burst("right"), 800);
        },
      });

      /* ── popper cone pop-in ──────────────────────── */
      [popLeftRef, popRightRef].forEach((r, i) => {
        if (!r.current) return;
        gsap.fromTo(r.current,
          { scale: 0, rotation: i === 0 ? -40 : 40 },
          {
            scale: 1, rotation: i === 0 ? -12 : 12, duration: 0.55, ease: "back.out(2.5)",
            scrollTrigger: { trigger: sec, start: "top 70%" },
          }
        );
      });

      /* ── light confetti rain while scrolling ─────── */
      ScrollTrigger.create({
        trigger: sec,
        start: "top 75%",
        end: "bottom 25%",
        onUpdate: (self) => {
          if (self.isActive && Math.random() > 0.95) {
            const w = sec.clientWidth;
            const count = window.innerWidth < 640 ? 1 : 2;
            for (let i = 0; i < count; i++) {
              spawnPiece(rand(0, w), rand(-10, 20), {
                sx: rand(-80, 80), sy: rand(180, 500), dur: rand(2.4, 4),
              });
            }
          }
        },
      });

    }, sectionRef);
    return () => ctx.revert();
  }, [burst, spawnPiece]);

  const headingRef = useRef(null);

  /* heading reveal — registered inside the existing gsap.context isn't possible
     after the main useEffect, so we add a tiny separate one */
  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 88%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#FEF5F8",
      }}
    >
      {/* ═══ section heading ═══ */}
      <h2
        ref={headingRef}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.25rem, 4.5vw, 2.2rem)",
          fontWeight: 700,
          color: "#3D1A30",
          textAlign: "center",
          padding: "48px 20px 28px",
          margin: 0,
          opacity: 0,
          lineHeight: 1.3,
          letterSpacing: "0.01em",
        }}
      >
        Happy Birthday to our Queen 👑
      </h2>
      {/* ═══ responsive image wrapper ═══
          Desktop  → landscape image fits naturally, 56vw height
          Tablet   → slightly taller
          Mobile   → full-width, auto-height so image shows completely */}
      <style>{`
        .plx-img-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        /* Desktop: fixed aspect-ratio parallax window */
        @media (min-width: 769px) {
          .plx-img-wrap {
            height: clamp(420px, 56vw, 780px);
          }
          .plx-img-wrap img {
            position: absolute;
            inset: -12% 0;
            width: 100%;
            height: 124%;
            object-fit: cover;
            object-position: center 25%;
          }
        }
        /* Tablet */
        @media (min-width: 481px) and (max-width: 768px) {
          .plx-img-wrap {
            height: auto;
            min-height: 340px;
          }
          .plx-img-wrap img {
            position: relative;
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
          }
        }
        /* Mobile: show the full image, no cropping */
        @media (max-width: 480px) {
          .plx-img-wrap {
            height: auto;
          }
          .plx-img-wrap img {
            position: relative;
            width: 100%;
            height: auto;
            display: block;
            object-fit: contain;
          }
        }
      `}</style>

      <div className="plx-img-wrap" ref={imgRef}>
        <img
          src="/H.png"
          alt="Happy Birthday – A Day to Remember"
          draggable={false}
        />

        {/* ── very light bottom vignette so it blends into the page ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
          background: "linear-gradient(to bottom, transparent 0%, rgba(254,245,248,0.85) 100%)",
          pointerEvents: "none", zIndex: 4,
        }} />

        {/* ── subtle top vignette ─────────────────────── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "18%",
          background: "linear-gradient(to top, transparent, rgba(254,245,248,0.7))",
          pointerEvents: "none", zIndex: 4,
        }} />
      </div>

      {/* ═══ confetti / particles layer ═══ */}
      <div ref={confettiRef} style={{
        position: "absolute", inset: 0, zIndex: 25, pointerEvents: "none", overflow: "hidden",
      }} />

      {/* ═══ party popper cones ═══ */}
      <div ref={popLeftRef} style={{
        position: "absolute", bottom: "10%", left: "3%", zIndex: 20,
        fontSize: "clamp(2rem, 5vw, 3.8rem)",
        transformOrigin: "bottom right",
        filter: "drop-shadow(0 3px 10px rgba(212,100,154,0.35))",
        transform: "scale(0)",
      }}>🎉</div>
      <div ref={popRightRef} style={{
        position: "absolute", bottom: "10%", right: "3%", zIndex: 20,
        fontSize: "clamp(2rem, 5vw, 3.8rem)",
        transformOrigin: "bottom left",
        filter: "drop-shadow(0 3px 10px rgba(212,100,154,0.35))",
        transform: "scale(0)",
      }}>🎊</div>

      {/* ═══ side ribbon streamers ═══ */}
      {STREAMER_COLORS.map((col, i) => (
        <div key={i} style={{
          position: "absolute", top: 0,
          left: i < 2 ? `${6 + i * 10}%` : "auto",
          right: i >= 2 ? `${6 + (i - 2) * 10}%` : "auto",
          width: 3, height: `${22 + i * 6}%`,
          background: `linear-gradient(to bottom, ${col}, transparent)`,
          zIndex: 6, opacity: 0.35, borderRadius: "0 0 3px 3px",
          animation: `sway ${3 + i * 0.4}s ease-in-out ${i * 0.15}s infinite`,
          transformOrigin: "top center",
        }} />
      ))}

      {/* ═══ floating birthday emojis ═══ */}
      {["🎈", "🎂", "🎁", "🌸", "🎀", "🪷"].map((e, i) => (
        <div key={i} style={{
          position: "absolute",
          fontSize: `clamp(1rem, ${1.6 + i * 0.2}vw, 1.8rem)`,
          opacity: 0.3, zIndex: 8, pointerEvents: "none",
          top: `${8 + (i * 14) % 65}%`,
          left: i % 2 === 0 ? `${2 + i * 1.5}%` : "auto",
          right: i % 2 !== 0 ? `${2 + i * 1.5}%` : "auto",
          animation: `float ${7 + i * 1.2}s ease-in-out ${i * 0.3}s infinite`,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
        }}>{e}</div>
      ))}
    </section>
  );
}
