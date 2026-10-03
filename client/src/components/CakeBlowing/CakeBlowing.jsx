import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { birthdayData } from "../../data/birthday";

gsap.registerPlugin(ScrollTrigger);

/* ── constants ──────────────────────────────────── */
const CANDLE_COUNT = 5;
const COUNTDOWN_FROM = 3;
const CONFETTI_COLORS = ["#D4649A","#E87CB0","#F4A0C8","#FFD700","#FF6B8A","#9B4FA0","#C8A0DC","#FF9EC0","#7AC048","#FFB870"];
const SPARK_EMOJIS = ["✨","🌟","⭐","💫","🎉","🎊","🌸","🌷","🪷","💖","🎀","👑"];

/* ── helpers ─────────────────────────────────────── */
function rand(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ── phases ──────────────────────────────────────── */
const PHASE = { IDLE: 0, MAKE_WISH: 1, COUNTDOWN: 2, BLOW: 3, BLOWN: 4, CELEBRATE: 5 };

export default function CakeBlowing() {
  const sectionRef = useRef(null);
  const cakeRef = useRef(null);
  const confettiRef = useRef(null);
  const triggered = useRef(false);

  const [phase, setPhase] = useState(PHASE.IDLE);
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [candlesLit, setCandlesLit] = useState(Array(CANDLE_COUNT).fill(true));
  const [wishText, setWishText] = useState("");
  const [showWishInput, setShowWishInput] = useState(false);

  /* ── scroll trigger to start the experience ────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        once: true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          // Animate cake entrance
          gsap.fromTo(cakeRef.current,
            { opacity: 0, y: 80, scale: 0.7 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "back.out(1.8)" }
          );
          setTimeout(() => setPhase(PHASE.MAKE_WISH), 1400);
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* ── make-a-wish → countdown transition ────────── */
  useEffect(() => {
    if (phase === PHASE.MAKE_WISH) {
      setShowWishInput(true);
    }
  }, [phase]);

  const startCountdown = useCallback(() => {
    setShowWishInput(false);
    setPhase(PHASE.COUNTDOWN);
    setCount(COUNTDOWN_FROM);
  }, []);

  /* ── countdown timer ───────────────────────────── */
  useEffect(() => {
    if (phase !== PHASE.COUNTDOWN) return;
    if (count <= 0) {
      setPhase(PHASE.BLOW);
      return;
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  /* ── blow phase: listen for mic or tap ─────────── */
  useEffect(() => {
    if (phase !== PHASE.BLOW) return;

    let cancelled = false;
    let stream = null;

    const blowOut = () => {
      if (cancelled) return;
      cancelled = true;
      // extinguish candles one by one
      const delays = Array.from({ length: CANDLE_COUNT }, (_, i) => i * 180);
      delays.forEach((d, i) => {
        setTimeout(() => {
          setCandlesLit(prev => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }, d);
      });
      // after all candles out → celebrate
      setTimeout(() => {
        setPhase(PHASE.BLOWN);
        setTimeout(() => setPhase(PHASE.CELEBRATE), 600);
      }, CANDLE_COUNT * 180 + 400);
      // cleanup mic
      if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    };

    // try mic-based blow detection
    const tryMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const check = () => {
          if (cancelled) { audioCtx.close(); return; }
          analyser.getByteFrequencyData(data);
          // detect blow = lots of low-freq energy
          const low = data.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
          if (low > 120) { blowOut(); audioCtx.close(); return; }
          requestAnimationFrame(check);
        };
        check();
      } catch {
        // mic denied — fallback to tap only
      }
    };
    tryMic();

    // fallback: click/tap to blow
    const onClick = () => blowOut();
    const sec = sectionRef.current;
    sec?.addEventListener("click", onClick);
    // auto-blow after 8s if nothing happens
    const autoTimer = setTimeout(blowOut, 8000);

    return () => {
      cancelled = true;
      sec?.removeEventListener("click", onClick);
      clearTimeout(autoTimer);
      if (stream) { stream.getTracks().forEach(t => t.stop()); }
    };
  }, [phase]);

  /* ── celebration confetti explosion ────────────── */
  useEffect(() => {
    if (phase !== PHASE.CELEBRATE) return;
    const sec = sectionRef.current;
    const con = confettiRef.current;
    if (!sec || !con) return;

    const w = sec.clientWidth;
    const h = sec.clientHeight;
    const cx = w / 2;
    const cy = h * 0.35;

    // big burst
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        const isEmoji = Math.random() > 0.6;
        if (isEmoji) {
          el.textContent = pick(SPARK_EMOJIS);
          el.style.cssText = `position:absolute;pointer-events:none;z-index:50;font-size:${rand(14, 28)}px;`;
        } else {
          const sz = rand(5, 12);
          const col = pick(CONFETTI_COLORS);
          el.style.cssText = `position:absolute;pointer-events:none;z-index:50;width:${sz}px;height:${sz * (Math.random() > 0.5 ? 0.5 : 1)}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${col};`;
        }
        con.appendChild(el);
        gsap.set(el, { left: cx, top: cy });
        gsap.to(el, {
          x: rand(-300, 300),
          y: rand(-200, 350),
          rotation: rand(-720, 720),
          opacity: 0,
          duration: rand(1.5, 3),
          ease: "power2.out",
          onComplete: () => el.remove(),
        });
      }, i * 25);
    }

    // secondary bursts
    [800, 1400].forEach(delay => {
      setTimeout(() => {
        for (let i = 0; i < 30; i++) {
          setTimeout(() => {
            const el = document.createElement("div");
            el.textContent = pick(SPARK_EMOJIS);
            el.style.cssText = `position:absolute;pointer-events:none;z-index:50;font-size:${rand(12, 22)}px;`;
            con.appendChild(el);
            gsap.set(el, { left: rand(w * 0.2, w * 0.8), top: rand(h * 0.15, h * 0.5) });
            gsap.to(el, {
              y: rand(-120, 200),
              x: rand(-150, 150),
              rotation: rand(-360, 360),
              opacity: 0,
              duration: rand(1.2, 2.5),
              ease: "power2.out",
              onComplete: () => el.remove(),
            });
          }, i * 30);
        }
      }, delay);
    });
  }, [phase]);

  /* ── render ────────────────────────────────────── */
  return (
    <section
      id="cake-blowing"
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "56px 20px 64px",
        background: "linear-gradient(180deg, #FEF5F8 0%, #1A0820 8%, #1A0820 92%, #FEF5F8 100%)",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ambient floating particles */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: rand(2, 5),
            height: rand(2, 5),
            borderRadius: "50%",
            background: `rgba(212,100,154,${rand(0.15, 0.4)})`,
            left: `${rand(0, 100)}%`,
            top: `${rand(0, 100)}%`,
            animation: `float ${rand(4, 9)}s ease-in-out ${rand(0, 4)}s infinite`,
          }} />
        ))}
      </div>

      {/* confetti layer */}
      <div ref={confettiRef} style={{ position: "absolute", inset: 0, zIndex: 45, pointerEvents: "none", overflow: "hidden" }} />

      {/* section title */}
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.15rem, 4vw, 1.8rem)",
        fontWeight: 700,
        color: "#FDF0F8",
        textAlign: "center",
        marginBottom: 36,
        zIndex: 10,
        textShadow: "0 2px 20px rgba(212,100,154,0.5)",
      }}>
        🎂 Chalo chalo aab candle blow karo! (wish ke baad cake par tap karte jao ya phir mic allow karke candle blow karo)🎂
      </h2>

      {/* ═══ THE CAKE ═══ */}
      <div ref={cakeRef} style={{ opacity: 0, position: "relative", zIndex: 10 }}>
        <CakeVisual candlesLit={candlesLit} />
      </div>

      {/* ═══ MAKE A WISH overlay ═══ */}
      {showWishInput && (
        <div style={{
          position: "relative", zIndex: 20, marginTop: 32,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          animation: "fadeSlideUp 0.6s ease-out both",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.1rem, 3.5vw, 1.6rem)",
            color: "#F4A0C8",
            textAlign: "center",
            textShadow: "0 0 20px rgba(212,100,154,0.6)",
          }}>
            ✨ Aankhein band karo aur wish maangoo ✨
          </p>
          <input
            type="text"
            placeholder="Type your wish here (optional)..."
            value={wishText}
            onChange={e => setWishText(e.target.value)}
            style={{
              width: "min(320px, 80vw)",
              padding: "12px 18px",
              borderRadius: 50,
              border: "1.5px solid rgba(212,100,154,0.5)",
              background: "rgba(255,255,255,0.08)",
              color: "#FDF0F8",
              fontFamily: "Poppins, sans-serif",
              fontSize: ".9rem",
              outline: "none",
              textAlign: "center",
              backdropFilter: "blur(8px)",
            }}
            maxLength={100}
          />
          <button
            onClick={startCountdown}
            style={{
              padding: "14px 40px",
              background: "linear-gradient(130deg, #E87CB0, #C44F8A)",
              color: "#fff",
              border: "none",
              borderRadius: 50,
              fontFamily: "Poppins, sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 6px 30px rgba(212,100,154,0.5)",
              animation: "glow-btn 2s ease-in-out infinite",
              letterSpacing: ".04em",
            }}
          >
            Wishhhhhhhh! 🌷
          </button>
        </div>
      )}

      {/* ═══ COUNTDOWN ═══ */}
      {phase === PHASE.COUNTDOWN && count > 0 && (
        <CountdownNumber value={count} />
      )}

      {/* ═══ BLOW prompt ═══ */}
      {phase === PHASE.BLOW && (
        <div style={{
          position: "relative", zIndex: 20, marginTop: 28,
          textAlign: "center",
          animation: "fadeSlideUp 0.4s ease-out both",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.3rem, 4vw, 2rem)",
            color: "#FFD700",
            textShadow: "0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3)",
            marginBottom: 12,
          }}>
            💨 BLOW NOW! 💨
          </p>
          <p style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: ".82rem",
            color: "rgba(240,180,220,0.6)",
          }}>
            Blow into your mic or tap the screen!
          </p>
        </div>
      )}

      {/* ═══ CELEBRATION ═══ */}
      {phase === PHASE.CELEBRATE && (
        <div style={{
          position: "relative", zIndex: 20, marginTop: 32,
          textAlign: "center",
          animation: "celebrationReveal 1s ease-out both",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 6vw, 3rem)",
            fontWeight: 700,
            color: "#FFD700",
            textShadow: "0 0 40px rgba(255,215,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
            marginBottom: 8,
          }}>
            🎉 Happy Birthday! 🎉
          </p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.2rem, 3.5vw, 1.8rem)",
            color: "#F4A0C8",
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {birthdayData.name} 🌷
          </p>
          {wishText && (
            <div style={{
              padding: "16px 24px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              border: "1px solid rgba(212,100,154,0.3)",
              backdropFilter: "blur(10px)",
              maxWidth: 360,
              margin: "0 auto",
              animation: "fadeSlideUp 0.8s ease-out 0.5s both",
            }}>
              <p style={{
                fontFamily: "Caveat, cursive",
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.7)",
                marginBottom: 4,
              }}>Your wish:</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.05rem",
                color: "#FDF0F8",
                fontStyle: "italic",
              }}>
                "{wishText}" ✨
              </p>
            </div>
          )}
          {/* ═══ Birthday Wish Paragraph ═══ */}
          <div style={{
            maxWidth: 420,
            margin: "28px auto 0",
            padding: "26px 24px 28px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(212,100,154,0.1))",
            borderRadius: 20,
            border: "1px solid rgba(212,100,154,0.25)",
            backdropFilter: "blur(12px)",
            position: "relative",
            overflow: "hidden",
            animation: "fadeSlideUp 0.9s ease-out 1.2s both",
          }}>
            {/* decorative corner flowers */}
            <span style={{ position: "absolute", top: 10, left: 12, fontSize: "1rem", opacity: 0.4 }}>🌷</span>
            <span style={{ position: "absolute", top: 10, right: 12, fontSize: "1rem", opacity: 0.4 }}>✨</span>
            <span style={{ position: "absolute", bottom: 10, left: 12, fontSize: "1rem", opacity: 0.4 }}>🪷</span>
            <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: "1rem", opacity: 0.4 }}>🌸</span>

            {/* subtle glow accent */}
            <div style={{
              position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)",
              width: 200, height: 200, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(212,100,154,0.15), transparent 70%)",
              pointerEvents: "none",
            }} />

            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              fontWeight: 600,
              color: "#FFD700",
              marginBottom: 14,
              position: "relative",
              zIndex: 1,
            }}>
              🎂 A Birthday Wish For You 🎂
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(.88rem, 2.5vw, 1rem)",
              color: "#FDF0F8",
              lineHeight: 1.85,
              position: "relative",
              zIndex: 1,
              marginBottom: 16,
            }}>
              Ooye hoye Aaj toh birthday shirthday hai jiiii,
Happy Birthday Harshuuuu , Madammmm, Harshitaaaa , Radha
Cake shake cut karo , family ke saath time spent karo
Enjoyyyyyyyyy
Humesha khush raha karo , tumhari hasi sabse pyaari hai, aur tumhara dil toh ekdum pure gold hai  🫶🏻
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(.88rem, 2.5vw, 1rem)",
              color: "rgba(253,240,248,0.9)",
              lineHeight: 1.85,
              position: "relative",
              zIndex: 1,
              marginBottom: 16,
            }}>
              
Tum kaafi khaas ho mere liyeeee
Bas meri yahi wish hai ki tumhari life ka ye naya saal tumhare liye bohot saari khushiyan, sukoon bhare moments aur bohot saara pyaar laaye.
Tum jitni achhi cheezein deserve karti ho, meri wish hai ki tumhe woh sab mile aur usse bhi zyada mile
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(.88rem, 2.5vw, 1rem)",
              color: "rgba(253,240,248,0.85)",
              lineHeight: 1.85,
              position: "relative",
              zIndex: 1,
              marginBottom: 18,
            }}>
             Aise hi hasti rehna, shine karte rehna, apne dreams ko follow karte rehna aur bas aisi hi amazing rehna.
Tum jaise ho ekdum badhiya ho.
<br />Again Happiest Birthday Harshuuuu 🎂
Dil se wish karta hoon ki tum hamesha khush raho, healthy raho aur tumhari smile hamesha bani rahe
<br />Love You Madammmm
            </p>
            <p style={{
              fontFamily: "Caveat, cursive",
              fontSize: "clamp(1rem, 3vw, 1.25rem)",
              color: "#F4A0C8",
              textAlign: "right",
              position: "relative",
              zIndex: 1,
            }}>
              — With all my love, Kartik 🌷
            </p>
          </div>

          <p style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: ".82rem",
            color: "rgba(240,180,220,0.5)",
            marginTop: 20,
          }}>
            Tumhari saari wish puri hooo 🌟
          </p>
        </div>
      )}

      {/* ═══ CSS animations ═══ */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebrationReveal {
          0%   { opacity: 0; transform: scale(0.3) rotate(-8deg); }
          50%  { opacity: 1; transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes countdownPulse {
          0%   { opacity: 0; transform: scale(2.5); }
          30%  { opacity: 1; transform: scale(1); }
          80%  { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes flickerFlame {
          0%, 100% { transform: scaleX(1) scaleY(1) rotate(0deg); opacity: 1; }
          25%  { transform: scaleX(0.92) scaleY(1.06) rotate(-3deg); opacity: 0.9; }
          50%  { transform: scaleX(1.05) scaleY(0.94) rotate(2deg); opacity: 1; }
          75%  { transform: scaleX(0.95) scaleY(1.04) rotate(-1deg); opacity: 0.95; }
        }
        @keyframes flickerGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.3); }
        }
        @keyframes smokeRise {
          0%   { opacity: 0.6; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(2); }
        }
        @keyframes cakeGlowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(212,100,154,0.15), 0 20px 60px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 60px rgba(212,100,154,0.3), 0 20px 60px rgba(0,0,0,0.3); }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   COUNTDOWN NUMBER — big animated number
   ═══════════════════════════════════════════════════ */
function CountdownNumber({ value }) {
  return (
    <div
      key={value}
      style={{
        position: "relative",
        zIndex: 20,
        marginTop: 28,
        animation: "countdownPulse 0.95s ease-out both",
      }}
    >
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(4rem, 15vw, 8rem)",
        fontWeight: 900,
        color: "transparent",
        background: "linear-gradient(135deg, #FFD700, #FF6B8A, #D4649A)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        textShadow: "none",
        filter: "drop-shadow(0 0 40px rgba(255,215,0,0.5))",
        lineHeight: 1,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CAKE VISUAL — CSS-drawn birthday cake with candles
   ═══════════════════════════════════════════════════ */
function CakeVisual({ candlesLit }) {
  const cakeWidth = "min(320px, 80vw)";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    }}>
      {/* candles row */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(16px, 5vw, 32px)",
        marginBottom: -4,
        position: "relative",
        zIndex: 5,
      }}>
        {candlesLit.map((lit, i) => (
          <Candle key={i} lit={lit} index={i} />
        ))}
      </div>

      {/* cake body */}
      <div style={{
        width: cakeWidth,
        position: "relative",
        animation: "cakeGlowPulse 3s ease-in-out infinite",
        borderRadius: "16px 16px 20px 20px",
        overflow: "hidden",
      }}>
        {/* top tier — frosting */}
        <div style={{
          height: 28,
          background: "linear-gradient(180deg, #FFEEF5, #F8C8DE)",
          borderRadius: "16px 16px 0 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* drip effect */}
          <div style={{ position: "absolute", bottom: -12, left: 0, right: 0, display: "flex", justifyContent: "space-around", padding: "0 8px" }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{
                width: rand(14, 22),
                height: rand(10, 20),
                background: "linear-gradient(180deg, #F8C8DE, #F0A0C0)",
                borderRadius: "0 0 50% 50%",
              }} />
            ))}
          </div>
        </div>

        {/* middle tier */}
        <div style={{
          height: 55,
          background: "linear-gradient(180deg, #E87CB0, #D4649A)",
          position: "relative",
        }}>
          {/* decorative dots */}
          <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, display: "flex", justifyContent: "space-around", padding: "0 12px" }}>
            {Array.from({ length: 11 }, (_, i) => (
              <div key={i} style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i % 2 === 0 ? "#FFD700" : "#FFF",
                opacity: 0.7,
                boxShadow: `0 0 6px ${i % 2 === 0 ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.3)"}`,
              }} />
            ))}
          </div>
        </div>

        {/* bottom tier */}
        <div style={{
          height: 65,
          background: "linear-gradient(180deg, #C44F8A, #9B3070)",
          borderRadius: "0 0 20px 20px",
          position: "relative",
        }}>
          {/* wave decoration */}
          <svg width="100%" height="16" viewBox="0 0 320 16" style={{ position: "absolute", top: 0, left: 0, opacity: 0.3 }} preserveAspectRatio="none">
            <path d="M0 8 Q20 0 40 8 Q60 16 80 8 Q100 0 120 8 Q140 16 160 8 Q180 0 200 8 Q220 16 240 8 Q260 0 280 8 Q300 16 320 8" fill="none" stroke="#FFD700" strokeWidth="2" />
          </svg>
          {/* text */}
          <div style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Caveat, cursive",
            fontSize: "clamp(.9rem, 3vw, 1.2rem)",
            color: "rgba(255,255,255,0.75)",
            letterSpacing: ".06em",
          }}>
            Happy Birthday! 🌷
          </div>
        </div>
      </div>

      {/* cake plate */}
      <div style={{
        width: `calc(${cakeWidth} + 30px)`,
        height: 14,
        background: "linear-gradient(180deg, #F0D0E0, #E0B0C8)",
        borderRadius: "0 0 50% 50% / 0 0 100% 100%",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        marginTop: -2,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CANDLE — individual candle with flame
   ═══════════════════════════════════════════════════ */
function Candle({ lit, index }) {
  const colors = ["#FF9EC0", "#FFB870", "#C8A0DC", "#7AC048", "#FFD700"];
  const stripeColors = ["#E87CB0", "#FF9040", "#9B4FA0", "#5A9030", "#E0B000"];

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    }}>
      {/* flame + glow */}
      {lit ? (
        <div style={{ position: "relative", height: 32, marginBottom: -2 }}>
          {/* glow */}
          <div style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,200,50,0.5), rgba(255,150,50,0.2), transparent 70%)",
            animation: "flickerGlow 0.8s ease-in-out infinite",
            animationDelay: `${index * 0.15}s`,
          }} />
          {/* flame body */}
          <div style={{
            width: 12,
            height: 22,
            background: "linear-gradient(to top, #FF6B00, #FFD700 40%, #FFFBE0 90%)",
            borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
            animation: `flickerFlame ${0.3 + index * 0.05}s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`,
            position: "relative",
            zIndex: 2,
            boxShadow: "0 0 8px rgba(255,150,0,0.6), 0 0 20px rgba(255,200,50,0.3)",
          }} />
        </div>
      ) : (
        /* smoke wisp when blown out */
        <div style={{ position: "relative", height: 32, marginBottom: -2, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 3,
            height: 20,
            background: "linear-gradient(to top, rgba(200,200,200,0.5), transparent)",
            borderRadius: 4,
            animation: "smokeRise 1.5s ease-out forwards",
            animationDelay: `${index * 0.12}s`,
          }} />
        </div>
      )}

      {/* candle stick */}
      <div style={{
        width: 10,
        height: 44,
        background: `linear-gradient(90deg, ${colors[index % 5]}, ${stripeColors[index % 5]} 50%, ${colors[index % 5]})`,
        borderRadius: "3px 3px 1px 1px",
        position: "relative",
        boxShadow: lit ? `0 0 12px ${colors[index % 5]}40` : "none",
        transition: "box-shadow 0.5s ease",
      }}>
        {/* stripes */}
        {[0.2, 0.45, 0.7].map((pos, si) => (
          <div key={si} style={{
            position: "absolute",
            top: `${pos * 100}%`,
            left: 0,
            right: 0,
            height: 3,
            background: "rgba(255,255,255,0.35)",
            borderRadius: 1,
          }} />
        ))}
      </div>
    </div>
  );
}
