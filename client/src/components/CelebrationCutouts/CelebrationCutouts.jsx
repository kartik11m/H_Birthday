import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/* ── colour palettes ────────────────────────────────────── */
const BALLOON_COLORS = [
  "#FF6B8A", "#FF85A1", "#FFA3B8", "#E87CB0", "#D4649A",
  "#C86EB0", "#9B4FA0", "#FFD700", "#FF9E40", "#7AC048",
  "#64B5F6", "#BA68C8", "#FF80AB", "#F48FB1",
];
const CONFETTI_COLORS = [
  "#FF6B8A", "#FFD700", "#64B5F6", "#7AC048", "#FF9E40",
  "#BA68C8", "#FF85A1", "#E87CB0", "#F48FB1", "#C86EB0",
];

/* ── helpers ────────────────────────────────────────────── */
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ── pre-generate particles (stable across renders) ─────── */
const BALLOONS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  color: pick(BALLOON_COLORS),
  left: `${rand(2, 96)}%`,
  size: rand(26, 48),
  delay: rand(0, 12),
  duration: rand(10, 20),
  sway: rand(-35, 35),
}));

const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  color: pick(CONFETTI_COLORS),
  left: `${rand(0, 100)}%`,
  size: rand(5, 11),
  delay: rand(0, 8),
  duration: rand(6, 14),
  shape: Math.random() > 0.5 ? "circle" : "rect",
  rotation: rand(0, 360),
}));

const SPARKLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${rand(5, 95)}%`,
  top: `${rand(5, 95)}%`,
  size: rand(0.6, 1.3),
  dur: rand(2, 5),
  del: rand(0, 3),
}));

/* ── cutouts: positioned at corners of the main photo ───── */
const CUTOUTS = [
  // top-left corner
  { src: "/H3.png", corner: "top-left",   rotate: -10 },
  // top-right corner
  { src: "/H1.png", corner: "top-right",  rotate: 8   },
  // bottom-left corner
  { src: "/H2.png", corner: "bottom-left", rotate: 6   },
  // bottom-right corner
  { src: "/H4.png", corner: "bottom-right", rotate: -7  },
];

/* ── corner → CSS position mapping ──────────────────────── */
function cornerStyle(corner) {
  switch (corner) {
    case "top-left":
      return { top: "-18%", left: "-22%" };
    case "top-right":
      return { top: "-15%", right: "-22%" };
    case "bottom-left":
      return { bottom: "-14%", left: "-20%" };
    case "bottom-right":
      return { bottom: "-10%", right: "-20%" };
    default:
      return {};
  }
}

function cornerOrigin(corner) {
  switch (corner) {
    case "top-left":     return "bottom right";
    case "top-right":    return "bottom left";
    case "bottom-left":  return "top right";
    case "bottom-right": return "top left";
    default:             return "center";
  }
}

export default function CelebrationCutouts() {
  const secRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── main image entrance ─── */
      gsap.fromTo(
        ".celeb-main-img",
        { opacity: 0, scale: 0.85, y: 40 },
        {
          opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.3)",
          scrollTrigger: { trigger: ".celeb-main-img", start: "top 88%" },
        }
      );

      /* ── cutout pop-in from their corner ─── */
      gsap.utils.toArray(".celeb-cutout").forEach((el, i) => {
        const corner = el.dataset.corner;
        const isLeft = corner.includes("left");
        const isTop  = corner.includes("top");

        gsap.fromTo(
          el,
          {
            opacity: 0,
            scale: 0.3,
            x: isLeft ? -60 : 60,
            y: isTop ? -40 : 40,
          },
          {
            opacity: 1, scale: 1, x: 0, y: 0,
            duration: 0.85,
            ease: "back.out(1.5)",
            delay: 0.15 + i * 0.12,
            scrollTrigger: { trigger: ".celeb-main-img", start: "top 88%" },
          }
        );
      });

      /* ── title entrance ─── */
      gsap.fromTo(
        ".celeb-title",
        { opacity: 0, y: 25 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".celeb-title", start: "top 90%" },
        }
      );

      /* ── subtitle entrance ─── */
      gsap.fromTo(
        ".celeb-sub",
        { opacity: 0, y: 18 },
        {
          opacity: 0.85, y: 0, duration: 0.7, ease: "power2.out", delay: 0.15,
          scrollTrigger: { trigger: ".celeb-sub", start: "top 95%" },
        }
      );
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "70px 16px 80px",
        background: "linear-gradient(180deg, #FEF5F8 0%, #FFF0F5 30%, #FDE8F0 60%, #F9D6E8 100%)",
      }}
    >
      {/* ── balloons ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {BALLOONS.map(b => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: b.left,
              bottom: `${-(b.size + 40)}px`,
              animation: `celeb-balloon-rise ${b.duration}s ease-in ${b.delay}s infinite`,
            }}
          >
            <svg width={b.size} height={b.size * 1.35} viewBox="0 0 40 54" fill="none">
              <defs>
                <radialGradient id={`cb${b.id}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor={b.color} />
                </radialGradient>
              </defs>
              <ellipse cx="20" cy="19" rx="17" ry="19" fill={`url(#cb${b.id})`} />
              <polygon points="15,36 20,42 25,36" fill={b.color} opacity="0.8" />
              <path d={`M20,42 Q${20 + b.sway * 0.15},48 20,54`} stroke={b.color} strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── confetti ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        {CONFETTI.map(c => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: c.left,
              top: `${-(c.size + 10)}px`,
              width: c.shape === "circle" ? c.size : c.size * 0.6,
              height: c.size,
              background: c.color,
              borderRadius: c.shape === "circle" ? "50%" : "2px",
              opacity: 0.65,
              transform: `rotate(${c.rotation}deg)`,
              animation: `celeb-confetti-fall ${c.duration}s linear ${c.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── sparkles ─────────────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        {SPARKLES.map(s => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: s.left,
              top: s.top,
              fontSize: `${s.size}rem`,
              opacity: 0.3,
              animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* ── title ──────────────────────────────────────────── */}
      <h2
        className="celeb-title"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.3rem, 4.5vw, 2.2rem)",
          fontWeight: 700,
          color: "#3D1A30",
          textAlign: "center",
          marginBottom: 40,
          position: "relative",
          zIndex: 10,
          opacity: 0,
        }}
      >
        <span style={{ display: "inline-block", animation: "sway 3s ease-in-out infinite" }}>🎉</span>
        {" "}Happy Birthday Harshuuuu{" "}
        <span style={{ display: "inline-block", animation: "sway 3s ease-in-out 0.5s infinite" }}>🎊</span>
      </h2>

      {/* ── photo + cutouts wrapper ────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 5 }}>
        <div
          className="celeb-main-img"
          style={{
            position: "relative",
            width: "clamp(270px, 52vw, 460px)",
            opacity: 0,
          }}
        >
          {/* glow frame */}
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: 22,
              background: "linear-gradient(135deg, rgba(232,124,176,0.25), rgba(200,110,176,0.15), rgba(255,215,0,0.15))",
              filter: "blur(3px)",
              zIndex: -1,
            }}
          />

          {/* main photo */}
          <img
            src="/HappyH.jpeg"
            alt="Happy Birthday Collage"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 18,
              border: "4px solid rgba(255,255,255,0.9)",
              boxShadow: "0 12px 48px rgba(212,100,154,0.3), 0 4px 16px rgba(0,0,0,0.1)",
              display: "block",
            }}
          />

          {/* flower corner accents */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos, i) => {
            const isTop = pos.includes("top");
            const isLeft = pos.includes("left");
            return (
              <span
                key={pos}
                style={{
                  position: "absolute",
                  top: isTop ? -14 : undefined,
                  bottom: !isTop ? -14 : undefined,
                  left: isLeft ? -14 : undefined,
                  right: !isLeft ? -14 : undefined,
                  fontSize: "1.4rem",
                  animation: `twinkle ${2 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                  zIndex: 30,
                }}
              >
                {["🌷", "🌸", "🪷", "🌺"][i]}
              </span>
            );
          })}

          {/* ── cutout photos anchored to corners ──────────── */}
          {CUTOUTS.map((c, i) => (
            <div
              key={i}
              className="celeb-cutout"
              data-corner={c.corner}
              style={{
                position: "absolute",
                ...cornerStyle(c.corner),
                zIndex: 20,
                transform: `rotate(${c.rotate}deg)`,
                transformOrigin: cornerOrigin(c.corner),
                filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.2))",
                opacity: 0,
              }}
            >
              <img
                src={c.src}
                alt={`Cutout ${i + 1}`}
                className="celeb-cutout-img"
                style={{
                  display: "block",
                  height: "auto",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── subtitle ──────────────────────────────────────── */}
      <p
        className="celeb-sub"
        style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "clamp(1rem, 3vw, 1.4rem)",
          color: "#9B6080",
          textAlign: "center",
          marginTop: 45,
          position: "relative",
          zIndex: 10,
          opacity: 0,
          letterSpacing: ".04em",
        }}
      >
        Kuch khoobsurat yaadein💖
      </p>

      {/* ── keyframes + responsive ────────────────────────── */}
      <style>{`
        @keyframes celeb-balloon-rise {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          5%   { opacity: 0.85; }
          50%  { transform: translateY(-55vh) translateX(20px) rotate(8deg); opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-115vh) translateX(-15px) rotate(-5deg); opacity: 0; }
        }
        @keyframes celeb-confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          8%   { opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }

        /* ── cutout sizing ─── */
        .celeb-cutout-img {
          width: clamp(80px, 16vw, 160px);
        }

        /* ── tablet ─── */
        @media (max-width: 768px) {
          .celeb-cutout-img {
            width: clamp(65px, 20vw, 120px);
          }
        }

        /* ── mobile ─── */
        @media (max-width: 520px) {
          .celeb-cutout-img {
            width: clamp(52px, 22vw, 90px);
          }
          .celeb-cutout {
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.18)) !important;
          }
        }

        /* ── small mobile ─── */
        @media (max-width: 380px) {
          .celeb-cutout-img {
            width: clamp(44px, 24vw, 70px);
          }
        }
      `}</style>
    </section>
  );
}
