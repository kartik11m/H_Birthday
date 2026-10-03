import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { birthdayData } from "../../data/birthday";

const COLORS = ["#E87CB0","#F4A0C8","#C8A0DC","#B8D4E8","#F0C0D0","#D4B8E8","#F9D6E8"];

function makeParticles(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 7,
    color: COLORS[i % COLORS.length],
    left: `${4 + Math.random() * 90}%`,
    top: `${4 + Math.random() * 88}%`,
    dur: `${2 + Math.random() * 3}s`,
    delay: `${Math.random() * 2}s`,
  }));
}

// Lotus petal angles
const OUTER_ANGLES = [0,45,90,135,180,225,270,315];
const INNER_ANGLES = [22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
const CENTER_DOTS  = [[70,92],[76,87],[64,87],[76,97],[64,97],[70,82],[70,102],[80,92],[60,92],[82,83],[58,83],[82,101],[58,101],[75,77],[65,77],[75,107],[65,107]];

export default function LoadingScreen({ onEnter }) {
  const containerRef = useRef(null);
  const stemRef      = useRef(null);
  const outerRef     = useRef(null);
  const innerRef     = useRef(null);
  const centerRef    = useRef(null);
  const seedRef      = useRef(null);
  const msg1Ref      = useRef(null);
  const msg2Ref      = useRef(null);
  const btnRef       = useRef(null);
  const flowerRef    = useRef(null);
  const pRefs        = useRef([]);
  const particles    = useMemo(() => makeParticles(30), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(stemRef.current,  { scaleY:0, svgOrigin:"70 256", opacity:0 });
      gsap.set(outerRef.current, { scale:0, rotation:-20, svgOrigin:"70 95", opacity:0 });
      gsap.set(innerRef.current, { scale:0, rotation:20,  svgOrigin:"70 95", opacity:0 });
      gsap.set(centerRef.current,{ scale:0, svgOrigin:"70 95", opacity:0 });
      gsap.set(seedRef.current,  { y:-200, opacity:0 });
      gsap.set([msg1Ref.current, msg2Ref.current, btnRef.current], { opacity:0 });

      const tl = gsap.timeline({ defaults:{ ease:"power2.out" } });
      tl
        .to(pRefs.current,  { opacity:1, duration:.07, stagger:{ amount:1.4, from:"random" } }, .1)
        .to(seedRef.current,{ y:0, opacity:1, duration:.7, ease:"bounce.out" }, .9)
        .to(seedRef.current,{ scale:.3, opacity:0, duration:.25, ease:"power2.in" }, "+=.5")
        .to(stemRef.current, { scaleY:1, opacity:1, duration:1.1, ease:"power1.inOut" }, "-.05")
        .to(outerRef.current,{ scale:1, rotation:0, opacity:1, duration:.9, ease:"back.out(1.2)" }, "-.18")
        .to(innerRef.current,{ scale:1, rotation:0, opacity:1, duration:.75, ease:"back.out(1.4)" }, "-.3")
        .to(centerRef.current,{ scale:1, opacity:1, duration:.45, ease:"back.out(2.2)" }, "-.28")
        .fromTo(msg1Ref.current,{ opacity:0,y:20 },{ opacity:1,y:0, duration:.9 }, "+=.35")
        .fromTo(msg2Ref.current,{ opacity:0 },{ opacity:1, duration:.6 }, "+=1.0")
        .fromTo(btnRef.current, { opacity:0,scale:.78,y:12 },
          { opacity:1,scale:1,y:0, duration:.55, ease:"back.out(1.7)",
            onComplete(){ document.getElementById("ls-btn")?.style && (document.getElementById("ls-btn").style.animation="glow-btn-lotus 2.8s ease-in-out infinite"); }
          }, "-.15")
        .fromTo(flowerRef.current,{ rotation:-2,transformOrigin:"50% 100%" },
          { rotation:2, duration:3.8, ease:"sine.inOut", yoyo:true, repeat:-1 }, "+=.4");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleEnter = () =>
    gsap.to(containerRef.current,{ opacity:0,scale:1.04,duration:.82,ease:"power2.inOut",onComplete:onEnter });

  return (
    <div ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background:"linear-gradient(150deg,#FEF5F8,#FDF0F8)" }}>
      <style>{`@keyframes glow-btn-lotus{0%,100%{box-shadow:0 8px 28px rgba(212,100,154,.45)}50%{box-shadow:0 8px 44px rgba(212,100,154,.8)}}`}</style>

      {/* Particles */}
      {particles.map((p,i) => (
        <div key={p.id} ref={el=>{ pRefs.current[i]=el; }}
          className="absolute rounded-full pointer-events-none"
          style={{ width:p.size+"px",height:p.size+"px",backgroundColor:p.color,
            left:p.left,top:p.top,opacity:0,
            boxShadow:`0 0 ${p.size*2.5}px ${p.color}BB`,
            animation:`twinkle ${p.dur} ${p.delay} ease-in-out infinite` }}/>
      ))}

      {/* Corner decorations */}
      {[["🌷","top:18px;left:18px"],["✨","top:18px;right:18px"],["🪷","bottom:20px;left:20px"],["🌸","bottom:20px;right:20px"]].map(([e,s],i)=>(
        <div key={i} className="absolute text-xl pointer-events-none"
          style={{ opacity:.38, animation:`float ${4.5+i*.6}s ease-in-out ${i*.3}s infinite`, ...Object.fromEntries(s.split(";").map(p=>{ const[k,v]=p.trim().split(":"); return[k.replace(/-./,m=>m[1].toUpperCase()),v]; })) }}>{e}</div>
      ))}

      {/* Flower area */}
      <div ref={flowerRef} className="flex flex-col items-center">
        <div className="relative flex items-end justify-center" style={{ height:270, width:160 }}>
          <div ref={seedRef} className="absolute text-2xl z-10" style={{ top:18 }}>🌱</div>

          {/* ── LOTUS SVG ── */}
          <svg viewBox="0 0 140 256" width="140" height="256" overflow="visible">
            {/* Stem + leaves */}
            <g ref={stemRef}>
              <path d="M70 256 C67 216 64 173 70 108" stroke="#5A8A62" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <path d="M70 190 C50 173 32 162 40 143 C49 124 70 152 70 172" fill="#5A8A62" opacity=".85"/>
              <path d="M70 162 C90 145 108 135 100 116 C92 97 70 124 70 144" fill="#5A8A62" opacity=".85"/>
            </g>

            {/* Outer petals (white-pink) — rotate around (70,95) */}
            <g ref={outerRef}>
              {OUTER_ANGLES.map((a,i) => (
                <ellipse key={i} cx="70" cy="62" rx="12" ry="28"
                  fill={i%2===0 ? "rgba(255,245,249,.95)" : "#F9C2D8"}
                  transform={`rotate(${a},70,95)`}/>
              ))}
            </g>

            {/* Inner petals (deep pink) — rotate around (70,95) offset 22.5° */}
            <g ref={innerRef}>
              {INNER_ANGLES.map((a,i) => (
                <ellipse key={i} cx="70" cy="70" rx="9" ry="20"
                  fill={i%2===0 ? "#E87CB0" : "#D4649A"}
                  transform={`rotate(${a},70,95)`}/>
              ))}
            </g>

            {/* Centre disc (golden stamens) */}
            <g ref={centerRef}>
              <circle cx="70" cy="95" r="24" fill="#FFD700" opacity=".9"/>
              <circle cx="70" cy="95" r="20" fill="#FFA040"/>
              <circle cx="70" cy="95" r="14" fill="#E87800"/>
              <circle cx="70" cy="95" r="4"  fill="#C85000"/>
              {CENTER_DOTS.map(([x,y],i) => (
                <circle key={i} cx={x} cy={y+(95-92)} r={i<9?2.5:2} fill={i<9?"#FFD080":"#E8A020"} opacity=".9"/>
              ))}
            </g>
          </svg>
        </div>

        {/* Text + Button */}
        <div className="flex flex-col items-center gap-4 mt-6 px-6 text-center max-w-sm">
          <p ref={msg1Ref} style={{ fontFamily:"'Playfair Display',serif",fontStyle:"italic",
            fontSize:"clamp(.9rem,3.5vw,1.12rem)",color:"#7A3060",lineHeight:1.8 }}>
            "{birthdayData.openingLine}"
          </p>
          <p ref={msg2Ref} style={{ fontFamily:"'Poppins',sans-serif",fontSize:".88rem",
            color:"#9B6080",letterSpacing:".1em" }}>
            {birthdayData.readyLine}
          </p>
          <button id="ls-btn" ref={btnRef} onClick={handleEnter}
            className="px-9 py-3 rounded-full text-white font-medium"
            style={{ background:"linear-gradient(130deg,#E87CB0,#C44F8A)",
              boxShadow:"0 8px 28px rgba(212,100,154,.45)",
              border:"none",cursor:"pointer",fontFamily:"'Poppins',sans-serif",letterSpacing:".03em" }}>
            {birthdayData.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
