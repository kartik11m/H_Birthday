import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { littleThings } from "../../data/birthday";
gsap.registerPlugin(ScrollTrigger);

/* ─── layout: 3×2 floating positions ──────────────────── */
const POSITIONS = [
  { top: "8%",  left: "15%" },
  { top: "5%",  left: "50%" },
  { top: "10%", left: "82%" },
  { top: "52%", left: "10%" },
  { top: "55%", left: "48%" },
  { top: "50%", left: "85%" },
];

const GLOW_COLORS = [
  "rgba(244,160,200,0.6)",
  "rgba(255,215,0,0.5)",
  "rgba(200,160,220,0.55)",
  "rgba(232,124,176,0.6)",
  "rgba(107,168,114,0.45)",
  "rgba(155,79,160,0.5)",
];

const LANTERN_GRADIENTS = [
  "linear-gradient(160deg, #FDF0F8 0%, #F9D6E8 100%)",
  "linear-gradient(160deg, #FFF8E1 0%, #FFE0B2 100%)",
  "linear-gradient(160deg, #F4E8FC 0%, #E1BEE7 100%)",
  "linear-gradient(160deg, #FCE4EC 0%, #F48FB1 100%)",
  "linear-gradient(160deg, #E8F5E9 0%, #C8E6C9 100%)",
  "linear-gradient(160deg, #F3E5F5 0%, #CE93D8 100%)",
];

/* ─── sparkle burst particles ─────────────────────────── */
function SparkleParticles({ active, color }) {
  if (!active) return null;
  const sparks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360;
    const dist = 40 + Math.random() * 30;
    const x = Math.cos((angle * Math.PI) / 180) * dist;
    const y = Math.sin((angle * Math.PI) / 180) * dist;
    const size = 3 + Math.random() * 4;
    return (
      <motion.div
        key={i}
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={{ x, y, opacity: 0, scale: 0 }}
        transition={{ duration: 0.6 + Math.random() * 0.3, ease: "easeOut" }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          width: size, height: size, borderRadius: "50%",
          background: color || "#FFD700",
          boxShadow: `0 0 6px ${color || "#FFD700"}`,
          pointerEvents: "none",
        }}
      />
    );
  });
  return <>{sparks}</>;
}

/* ─── individual lantern ──────────────────────────────── */
function Lantern({ item, index, isOpen, onToggle }) {
  const glowColor = GLOW_COLORS[index];
  const gradient = LANTERN_GRADIENTS[index];
  const [showSparks, setShowSparks] = useState(false);

  const handleClick = useCallback(() => {
    if (!isOpen) {
      setShowSparks(true);
      setTimeout(() => setShowSparks(false), 800);
    }
    onToggle();
  }, [isOpen, onToggle]);

  return (
    <div
      className="wish-lantern"
      style={{
        position: "absolute",
        ...POSITIONS[index],
        transform: "translate(-50%, -50%)",
        zIndex: isOpen ? 10 : 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={handleClick}
    >
      {/* glow aura */}
      <div style={{
        position: "absolute",
        width: isOpen ? 110 : 70,
        height: isOpen ? 110 : 70,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        transition: "all 0.5s ease",
        animation: "lanternPulse 3s ease-in-out infinite",
        animationDelay: `${index * 0.4}s`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }} />

      {/* lantern body */}
      <motion.div
        whileHover={{ scale: 1.12, y: -4 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen
          ? { scale: 1.08, boxShadow: `0 0 28px ${glowColor}, 0 8px 32px rgba(0,0,0,0.1)` }
          : { scale: 1, boxShadow: `0 4px 16px rgba(0,0,0,0.08)` }
        }
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          position: "relative",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: gradient,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${isOpen ? "#D4649A" : "rgba(212,100,154,0.2)"}`,
          transition: "border-color 0.3s ease",
          animation: `lanternFloat 4s ease-in-out infinite`,
          animationDelay: `${index * 0.6}s`,
        }}
      >
        <span style={{ fontSize: "1.7rem", lineHeight: 1, marginBottom: 2 }}>
          {item.emoji}
        </span>
        <span style={{
          fontSize: "0.55rem",
          fontWeight: 600,
          color: "#5C1A40",
          textAlign: "center",
          lineHeight: 1.2,
          padding: "0 4px",
          letterSpacing: "0.02em",
        }}>
          {item.label}
        </span>

        {/* sparkle burst */}
        <SparkleParticles active={showSparks} color={glowColor} />
      </motion.div>

      {/* revealed message card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.85 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            style={{
              marginTop: 4,
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 14,
              padding: "14px 16px",
              width: "clamp(160px, 42vw, 220px)",
              boxShadow: `0 6px 24px rgba(0,0,0,0.1), 0 0 12px ${glowColor}`,
              border: "1px solid rgba(212,100,154,0.2)",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* little arrow pointing up */}
            <div style={{
              position: "absolute", top: -6, left: "50%",
              transform: "translateX(-50%) rotate(45deg)",
              width: 12, height: 12,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(212,100,154,0.2)",
              borderRight: "none", borderBottom: "none",
            }} />
            <p style={{
              fontFamily: "Caveat, cursive",
              fontSize: "0.95rem",
              color: "#5C1A40",
              lineHeight: 1.5,
              margin: 0,
            }}>
              {item.msg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── main section ────────────────────────────────────── */
export default function LittleThings() {
  const [openIdx, setOpenIdx] = useState(null);
  const [revealed, setRevealed] = useState(new Set());
  const secRef = useRef(null);

  const handleToggle = useCallback((i) => {
    setOpenIdx((prev) => {
      if (prev === i) return null;
      setRevealed((r) => new Set(r).add(i));
      return i;
    });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".lt-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".lt-title", start: "top 88%" } });

      gsap.fromTo(".lt-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".lt-subtitle", start: "top 90%" } });

      gsap.utils.toArray(".wish-lantern").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.3, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7,
            ease: "back.out(1.7)", delay: i * 0.12,
            scrollTrigger: { trigger: el, start: "top 95%" } });
      });

      gsap.fromTo(".lt-progress",
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 0.5,
          scrollTrigger: { trigger: ".lt-progress", start: "top 92%" } });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} style={{
      padding: "50px 16px 60px",
      background: "linear-gradient(180deg, #FEF5F8 0%, #FDF0F8 50%, #FEF5F8 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ambient floating particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: "50%",
            background: i % 2 === 0
              ? "rgba(244,160,200,0.3)"
              : "rgba(255,215,0,0.25)",
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            animation: `ambientFloat ${5 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      {/* heading */}
      <h2 className="lt-title" style={{
        fontFamily: "Playfair Display, serif",
        fontSize: "clamp(1.2rem, 4.5vw, 1.9rem)",
        fontWeight: 700,
        color: "#3D1A30",
        textAlign: "center",
        marginBottom: 6,
        opacity: 0,
        position: "relative",
      }}>
        Little Things I Love About You 🪷
      </h2>

      <p className="lt-subtitle" style={{
        textAlign: "center",
        fontFamily: "Caveat, cursive",
        fontSize: "1rem",
        color: "#9B6080",
        marginBottom: 10,
        opacity: 0,
      }}>
        tap each lantern to reveal a wish ✨
      </p>

      {/* progress indicator */}
      <div className="lt-progress" style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        marginBottom: 16,
        opacity: 0,
      }}>
        {littleThings.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: revealed.has(i) ? "#D4649A" : "rgba(212,100,154,0.2)",
              scale: revealed.has(i) ? [1, 1.4, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: "1px solid rgba(212,100,154,0.3)",
            }}
          />
        ))}
      </div>

      {/* lantern field */}
      <div style={{
        position: "relative",
        maxWidth: 520,
        height: "clamp(380px, 65vw, 480px)",
        margin: "0 auto",
      }}>
        {littleThings.map((item, i) => (
          <Lantern
            key={i}
            item={item}
            index={i}
            isOpen={openIdx === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>

      {/* completion message */}
      <AnimatePresence>
        {revealed.size === littleThings.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            style={{
              textAlign: "center",
              marginTop: 8,
              padding: "16px 20px",
              background: "linear-gradient(130deg, rgba(232,124,176,0.1), rgba(200,160,220,0.1))",
              borderRadius: 16,
              maxWidth: 400,
              margin: "8px auto 0",
              border: "1px solid rgba(212,100,154,0.15)",
            }}
          >
            <span style={{ fontSize: "1.5rem", display: "block", marginBottom: 4 }}>🌷✨🪷</span>
            <p style={{
              fontFamily: "Caveat, cursive",
              fontSize: "1.15rem",
              color: "#5C1A40",
              margin: 0,
              lineHeight: 1.5,
            }}>
              You found them all! Every little thing makes you who you are — and that's beautiful 💕
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* keyframe animations */}
      <style>{`
        @keyframes lanternFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes lanternPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes ambientFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          33% { transform: translateY(-12px) translateX(6px); opacity: 0.6; }
          66% { transform: translateY(5px) translateX(-4px); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
