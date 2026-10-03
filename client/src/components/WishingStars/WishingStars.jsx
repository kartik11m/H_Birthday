import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { starWishes } from "../../data/birthday";
gsap.registerPlugin(ScrollTrigger);

/* ─── star positions in the night sky (percentage-based) ─ */
const STAR_POSITIONS = [
  { x: 18, y: 22 },
  { x: 50, y: 12 },
  { x: 80, y: 25 },
  { x: 25, y: 62 },
  { x: 55, y: 72 },
  { x: 78, y: 58 },
];

/* ─── constellation line connections (index pairs) ────── */
const CONSTELLATION_LINES = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [1, 4],
];

/* ─── generate static background stars once ──────────── */
function generateBgStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.8 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      brightness: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

/* ─── shooting star component ──────────────────────────── */
function ShootingStars() {
  const [stars, setStars] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      const id = idRef.current++;
      const fromRight = Math.random() > 0.5;
      setStars(prev => [...prev, {
        id,
        startX: fromRight ? 70 + Math.random() * 30 : Math.random() * 30,
        startY: Math.random() * 40,
        angle: fromRight ? 200 + Math.random() * 30 : 150 + Math.random() * 30,
        duration: 0.8 + Math.random() * 0.6,
      }]);
      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== id));
      }, 2000);
    };
    const interval = setInterval(spawn, 3000 + Math.random() * 4000);
    spawn();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {stars.map(s => {
        const rad = (s.angle * Math.PI) / 180;
        const dist = 250;
        return (
          <motion.div
            key={s.id}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: s.duration, ease: "linear" }}
            style={{
              position: "absolute",
              left: `${s.startX}%`,
              top: `${s.startY}%`,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 0 6px 2px rgba(255,255,255,0.8), -20px 0 12px 1px rgba(200,180,255,0.3)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        );
      })}
    </>
  );
}

/* ─── sparkle burst when a star is tapped ─────────────── */
function StarBurst({ x, y }) {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * 360;
      const dist = 30 + Math.random() * 50;
      return {
        i,
        tx: Math.cos((angle * Math.PI) / 180) * dist,
        ty: Math.sin((angle * Math.PI) / 180) * dist,
        size: 2 + Math.random() * 4,
        color: ["#FFD700", "#FFF8DC", "#E8A0FF", "#FFB6C1", "#87CEEB"][i % 5],
        dur: 0.5 + Math.random() * 0.4,
      };
    })
  , []);

  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none", zIndex: 20 }}>
      {particles.map(p => (
        <motion.div
          key={p.i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.tx, y: p.ty, opacity: 0, scale: 0 }}
          transition={{ duration: p.dur, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}
      {/* central flash */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,215,0,0.4), transparent)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

/* ─── constellation SVG lines ─────────────────────────── */
function ConstellationLines({ discovered, containerSize }) {
  if (discovered.size < 2) return null;
  const discoveredArr = [...discovered];

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      <defs>
        <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,215,0,0.7)" />
          <stop offset="50%" stopColor="rgba(200,160,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,215,0,0.7)" />
        </linearGradient>
      </defs>
      {CONSTELLATION_LINES.map(([a, b], i) => {
        if (!discoveredArr.includes(a) || !discoveredArr.includes(b)) return null;
        const ax = (STAR_POSITIONS[a].x / 100) * containerSize.w;
        const ay = (STAR_POSITIONS[a].y / 100) * containerSize.h;
        const bx = (STAR_POSITIONS[b].x / 100) * containerSize.w;
        const by = (STAR_POSITIONS[b].y / 100) * containerSize.h;
        return (
          <motion.line
            key={i}
            x1={ax} y1={ay} x2={bx} y2={by}
            stroke="url(#lineGlow)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}

/* ─── individual wish star ────────────────────────────── */
function WishStar({ wish, index, isOpen, isDiscovered, onTap }) {
  const pos = STAR_POSITIONS[index];
  const [burst, setBurst] = useState(false);

  const handleTap = useCallback(() => {
    if (!isDiscovered) {
      setBurst(true);
      setTimeout(() => setBurst(false), 900);
    }
    onTap();
  }, [isDiscovered, onTap]);

  return (
    <div
      className="wish-star-node"
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isOpen ? 15 : 5,
        cursor: "pointer",
      }}
      onClick={handleTap}
    >
      {/* outer glow ring */}
      <div style={{
        position: "absolute",
        width: isDiscovered ? 90 : 60,
        height: isDiscovered ? 90 : 60,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: isDiscovered
          ? "radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)"
          : "radial-gradient(circle, rgba(200,180,255,0.15) 0%, transparent 70%)",
        animation: "starPulse 3s ease-in-out infinite",
        animationDelay: `${index * 0.5}s`,
        pointerEvents: "none",
        transition: "all 0.6s ease",
      }} />

      {/* the star itself */}
      <motion.div
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        animate={isDiscovered
          ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } }
          : { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } }
        }
        style={{
          position: "relative",
          width: isDiscovered ? 22 : 14,
          height: isDiscovered ? 22 : 14,
          borderRadius: "50%",
          background: isDiscovered
            ? "radial-gradient(circle, #FFF8DC 0%, #FFD700 60%, #DAA520 100%)"
            : "radial-gradient(circle, #fff 0%, #C8B0FF 80%)",
          boxShadow: isDiscovered
            ? "0 0 16px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.3)"
            : "0 0 10px rgba(200,180,255,0.6), 0 0 24px rgba(200,180,255,0.2)",
          transition: "all 0.5s ease",
        }}
      />

      {/* 4-pointed star rays */}
      {!isDiscovered && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}>
          {[0, 45, 90, 135].map(deg => (
            <div key={deg} style={{
              position: "absolute",
              width: 1,
              height: 18,
              background: "linear-gradient(to bottom, transparent, rgba(200,180,255,0.5), transparent)",
              transform: `rotate(${deg}deg)`,
              transformOrigin: "center center",
              top: -9,
              left: 0,
              animation: "rayTwinkle 2.5s ease-in-out infinite",
              animationDelay: `${index * 0.3 + deg * 0.01}s`,
            }} />
          ))}
        </div>
      )}

      {/* label below star */}
      <AnimatePresence>
        {isDiscovered && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: 6,
              whiteSpace: "nowrap",
              fontSize: "0.6rem",
              fontFamily: "Caveat, cursive",
              color: "rgba(255,215,0,0.7)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          >
            {wish.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* burst effect */}
      {burst && <StarBurst x={0} y={0} />}

      {/* revealed wish card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{
              position: "absolute",
              top: "calc(100% + 14px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(13,5,21,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: 14,
              padding: "16px 18px",
              width: "clamp(180px, 50vw, 240px)",
              boxShadow: "0 0 20px rgba(255,215,0,0.1), 0 8px 32px rgba(0,0,0,0.4)",
              textAlign: "center",
              zIndex: 20,
            }}
          >
            {/* arrow pointing up */}
            <div style={{
              position: "absolute",
              top: -6,
              left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 12,
              height: 12,
              background: "rgba(13,5,21,0.85)",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRight: "none",
              borderBottom: "none",
            }} />
            <span style={{ fontSize: "1.4rem", display: "block", marginBottom: 6 }}>
              {wish.emoji}
            </span>
            <p style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "rgba(255,248,220,0.9)",
              lineHeight: 1.6,
              margin: 0,
              marginBottom: 6,
              fontWeight: 500,
            }}>
              {wish.label}
            </p>
            <p style={{
              fontFamily: "Caveat, cursive",
              fontSize: "0.92rem",
              color: "rgba(200,180,255,0.8)",
              lineHeight: 1.5,
              margin: 0,
            }}>
              {wish.msg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── aurora effect on completion ──────────────────────── */
function AuroraEffect({ active }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2,
        background: `
          radial-gradient(ellipse 80% 40% at 30% 20%, rgba(100,200,150,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 70% 35% at 70% 25%, rgba(150,100,220,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 30% at 50% 15%, rgba(100,150,255,0.06) 0%, transparent 60%)
        `,
        animation: "auroraShift 8s ease-in-out infinite",
      }}
    />
  );
}

/* ═════════════════════════════════════════════════════════ */
/*              MAIN COMPONENT: WishingStars               */
/* ═════════════════════════════════════════════════════════ */

export default function WishingStars() {
  const [openIdx, setOpenIdx] = useState(null);
  const [discovered, setDiscovered] = useState(new Set());
  const [containerSize, setContainerSize] = useState({ w: 500, h: 450 });
  const secRef = useRef(null);
  const fieldRef = useRef(null);
  const bgStars = useMemo(() => generateBgStars(120), []);
  const allFound = discovered.size === starWishes.length;

  const handleTap = useCallback((i) => {
    setOpenIdx(prev => {
      if (prev === i) return null;
      setDiscovered(d => new Set(d).add(i));
      return i;
    });
  }, []);

  /* measure container for SVG constellation lines */
  useEffect(() => {
    const measure = () => {
      if (fieldRef.current) {
        const r = fieldRef.current.getBoundingClientRect();
        setContainerSize({ w: r.width, h: r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* GSAP scroll-triggered entrances */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".ws-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".ws-title", start: "top 88%" } });

      gsap.fromTo(".ws-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ".ws-subtitle", start: "top 90%" } });

      gsap.fromTo(".ws-moon",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: ".ws-moon", start: "top 90%" } });

      gsap.utils.toArray(".wish-star-node").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.6,
            ease: "back.out(2)", delay: 0.3 + i * 0.15,
            scrollTrigger: { trigger: secRef.current, start: "top 70%" } });
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0D0515 0%, #120A28 40%, #0A0E1A 70%, #0D0515 100%)",
        overflow: "hidden",
        padding: "50px 16px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ── background twinkling stars ───────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {bgStars.map(s => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#fff",
              opacity: s.brightness * 0.5,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── shooting stars ───────────────────────────── */}
      <ShootingStars />

      {/* ── aurora (on completion) ───────────────────── */}
      <AuroraEffect active={allFound} />

      {/* ── moon ─────────────────────────────────────── */}
      <div className="ws-moon" style={{
        position: "absolute",
        top: "6%",
        right: "8%",
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #FFFDE8, #FFE890 55%, transparent)",
        boxShadow: "0 0 40px rgba(255,240,120,0.25), 0 0 80px rgba(255,240,120,0.1)",
        opacity: 0,
        zIndex: 2,
      }} />

      {/* ── floating decorative emojis ────────────── */}
      <div style={{
        position: "absolute", top: "12%", left: "5%",
        fontSize: "1.3rem", opacity: 0.15,
        animation: "float 10s ease-in-out infinite",
      }}>🪷</div>
      <div style={{
        position: "absolute", bottom: "15%", right: "6%",
        fontSize: "1.2rem", opacity: 0.15,
        animation: "float 12s ease-in-out 1.5s infinite",
      }}>🌷</div>

      {/* ── title ────────────────────────────────────── */}
      <h2 className="ws-title" style={{
        fontFamily: "Playfair Display, serif",
        fontSize: "clamp(1.2rem, 4.5vw, 1.9rem)",
        fontWeight: 700,
        color: "rgba(255,248,220,0.95)",
        textAlign: "center",
        marginBottom: 8,
        opacity: 0,
        position: "relative",
        zIndex: 4,
        textShadow: "0 0 20px rgba(255,215,0,0.15)",
      }}>
        Wish Upon a Star ✨
      </h2>

      <p className="ws-subtitle" style={{
        textAlign: "center",
        fontFamily: "Caveat, cursive",
        fontSize: "1.05rem",
        color: "rgba(200,180,255,0.6)",
        marginBottom: 6,
        opacity: 0,
        position: "relative",
        zIndex: 4,
      }}>
        Madammm stars par click karein
      </p>

      {/* ── progress stars ───────────────────────────── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginBottom: 14,
        position: "relative",
        zIndex: 4,
      }}>
        {starWishes.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: discovered.has(i) ? "#FFD700" : "rgba(200,180,255,0.2)",
              boxShadow: discovered.has(i)
                ? "0 0 8px rgba(255,215,0,0.6)"
                : "0 0 4px rgba(200,180,255,0.1)",
              scale: discovered.has(i) ? [1, 1.5, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              border: "1px solid rgba(200,180,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* ── starfield with wish stars + constellation ── */}
      <div
        ref={fieldRef}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 560,
          height: "clamp(380px, 60vw, 480px)",
          margin: "0 auto",
        }}
      >
        <ConstellationLines discovered={discovered} containerSize={containerSize} />
        {starWishes.map((wish, i) => (
          <WishStar
            key={i}
            wish={wish}
            index={i}
            isOpen={openIdx === i}
            isDiscovered={discovered.has(i)}
            onTap={() => handleTap(i)}
          />
        ))}
      </div>

      {/* ── completion message ────────────────────────── */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, type: "spring", stiffness: 200 }}
            style={{
              textAlign: "center",
              marginTop: 10,
              padding: "20px 24px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,215,0,0.15)",
              borderRadius: 18,
              maxWidth: 420,
              position: "relative",
              zIndex: 4,
              boxShadow: "0 0 30px rgba(255,215,0,0.05)",
            }}
          >
            <span style={{ fontSize: "1.6rem", display: "block", marginBottom: 6 }}>
              🌟✨🪷
            </span>
            <p style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontSize: "clamp(0.85rem, 3vw, 1rem)",
              color: "rgba(255,248,220,0.9)",
              margin: 0,
              marginBottom: 6,
              lineHeight: 1.7,
            }}>
              You found every wish written in the stars
            </p>
            <p style={{
              fontFamily: "Caveat, cursive",
              fontSize: "1.05rem",
              color: "rgba(200,180,255,0.7)",
              margin: 0,
              lineHeight: 1.5,
            }}>
              Each one is true — and always will be 💫
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── keyframe animations ───────────────────────── */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes starPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.25); }
        }
        @keyframes rayTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes auroraShift {
          0%, 100% { opacity: 0.6; filter: hue-rotate(0deg); }
          33% { opacity: 1; filter: hue-rotate(30deg); }
          66% { opacity: 0.8; filter: hue-rotate(-20deg); }
        }
      `}</style>
    </section>
  );
}
