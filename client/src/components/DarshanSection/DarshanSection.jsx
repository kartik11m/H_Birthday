import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function DarshanSection() {
  const secRef    = useRef(null);
  const doorLRef  = useRef(null);
  const doorRRef  = useRef(null);
  const bgRef     = useRef(null);
  const glowRef   = useRef(null);
  const raysRef   = useRef(null);
  const imgRef    = useRef(null);
  const sealRef   = useRef(null);
  const petalInt  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(doorLRef.current, { transformOrigin: "left center" });
      gsap.set(doorRRef.current, { transformOrigin: "right center" });

      // Build rays
      const rw = raysRef.current;
      for (let i = 0; i < 22; i++) {
        const r = document.createElement("div");
        const h = 160 + Math.random() * 130;
        r.style.cssText = `position:absolute;top:50%;left:50%;width:2px;height:${h}px;margin-top:${-h}px;margin-left:-1px;transform-origin:bottom center;transform:rotate(${i * 16.36}deg);background:linear-gradient(to top,rgba(255,195,50,.58),transparent);animation:darshan-ray 2.8s ease-in-out ${i * 0.13}s infinite;`;
        rw.appendChild(r);
      }

      // Scroll-scrubbed door opening
      // Doors stay shut until the section is well in view (top hits 30% of viewport),
      // then open slowly as you scroll through (ending when top reaches -20%).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: secRef.current,
          start: "top 2%",
          end: "top -2%",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
        },
      });
      tl
        .to(bgRef.current,   { opacity: 1, duration: .35 }, 0)
        .to(doorLRef.current, { rotateY: -86, duration: 1 }, 0)
        .to(doorRRef.current, { rotateY:  86, duration: 1 }, 0)
        .to(sealRef.current,  { opacity: 0, scale: .7, duration: .25 }, 0.05)
        .to(raysRef.current,  { opacity: 1, duration: .4 }, 0.35)
        .to(glowRef.current,  { opacity: 1, duration: .35 }, 0.4)
        .fromTo(imgRef.current,
          { opacity: 0, scale: .88 },
          { opacity: 1, scale: 1,  duration: .55, ease: "power2.out" }, 0.5);

      // Petal spawner
      ScrollTrigger.create({
        trigger: secRef.current,
        start: "top 20%",
        onEnter() {
          const em = ["🌸","✨","🌼","🪷","💐","🌺"];
          petalInt.current = setInterval(() => {
            const el = document.createElement("div");
            el.style.cssText = `position:absolute;top:-20px;left:${3+Math.random()*94}%;pointer-events:none;z-index:3;font-size:${10+Math.random()*14}px;`;
            el.textContent = em[Math.floor(Math.random() * em.length)];
            secRef.current?.appendChild(el);
            gsap.to(el, {
              y: 600, x: (Math.random() - .5) * 90,
              rotation: (Math.random() - .5) * 320,
              opacity: 0, duration: 4.5 + Math.random() * 2.5,
              ease: "none", delay: Math.random() * .8,
              onComplete: () => el.remove(),
            });
          }, 800);
        },
        onLeaveBack() { clearInterval(petalInt.current); },
      });
    }, secRef);

    return () => { clearInterval(petalInt.current); ctx.revert(); };
  }, []);

  const DoorPanel = () => (
    <>
      <div style={{ position:"absolute", top:"5%", bottom:"5%", left:"14%", right:"14%",
        border:"1.5px solid rgba(218,165,32,.38)", borderRadius:3,
        background:"rgba(218,165,32,.04)" }}>
        <div style={{ position:"absolute", top:"4%", bottom:"66%", left:"8%", right:"8%",
          border:"1px solid rgba(218,165,32,.25)", borderRadius:2 }}/>
        <div style={{ position:"absolute", top:"37%", bottom:"34%", left:"8%", right:"8%",
          border:"1px solid rgba(218,165,32,.25)", borderRadius:2 }}/>
        <div style={{ position:"absolute", top:"69%", bottom:"4%", left:"8%", right:"8%",
          border:"1px solid rgba(218,165,32,.25)", borderRadius:2 }}/>
      </div>
      <div style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)",
        color:"rgba(218,165,32,.7)", fontSize:"1.1rem" }}>✦</div>
    </>
  );

  return (
    <section ref={secRef} style={{ position:"relative", minHeight:640, overflow:"hidden", background:"#060200" }}>
      <style>{`@keyframes darshan-ray{0%,100%{opacity:.22}50%{opacity:.72}}`}</style>

      {/* Golden radial backdrop */}
      <div ref={bgRef} style={{ position:"absolute", inset:0, opacity:0,
        background:"radial-gradient(ellipse at 50% 52%,#FFD700,#FF8C00 15%,#C03800 38%,#580C00 62%,#060200 100%)" }}/>

      {/* Soft elliptical glow */}
      <div ref={glowRef} style={{ position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)", width:"75%", height:"78%",
        borderRadius:10, opacity:0, zIndex:2, pointerEvents:"none",
        background:"radial-gradient(ellipse at 50% 45%,rgba(255,200,50,.42) 0%,transparent 70%)",
        animation:"darshan-glow 2.6s ease-in-out infinite" }}/>
      <style>{`@keyframes darshan-glow{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.38}50%{transform:translate(-50%,-50%) scale(1.06);opacity:.9}}`}</style>

      {/* Light rays */}
      <div ref={raysRef} style={{ position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)", width:800, height:800,
        opacity:0, zIndex:1, pointerEvents:"none" }}/>

      {/* ── LORD JAGANNATHA IMAGE (70% width × 440px height) ── */}
      <div ref={imgRef} style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        width:"clamp(240px,68%,470px)", height:440,
        zIndex:4, opacity:0, borderRadius:8, overflow:"hidden",
        border:"4px solid rgba(255,215,0,.9)",
        boxShadow:"0 0 55px rgba(255,165,0,.75),0 0 110px rgba(255,165,0,.3),inset 0 0 30px rgba(255,200,60,.2)",
      }}>
        {/* Put jagannatha.jpg in /public/ */}
        <img src="/jagannatha.jpg" alt="Lord Jagannatha Darshan"
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block" }}/>
      </div>

      {/* Temple arch SVG */}
      <svg style={{ position:"absolute", top:0, left:0, right:0, width:"100%", height:80, zIndex:6, pointerEvents:"none" }}
        viewBox="0 0 400 80" preserveAspectRatio="none">
        <path d="M0 80 Q200 0 400 80 L400 0 L0 0 Z" fill="#060200"/>
      </svg>

      {/* Central wax seal (fades as doors open) */}
      <div ref={sealRef} style={{ position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)", zIndex:6, fontSize:"2rem",
        pointerEvents:"none", filter:"drop-shadow(0 0 8px rgba(255,200,0,.8))" }}>🪔</div>

      {/* Ornate temple doors */}
      <div style={{ position:"absolute", inset:0, zIndex:5, perspective:"800px" }}>
        {/* Left door */}
        <div ref={doorLRef} style={{ position:"absolute", top:0, bottom:0, left:0, width:"50%",
          borderRight:"3px solid rgba(218,165,32,.6)",
          background:"linear-gradient(to right,#0A0200,#1C0800 30%,#280E00 70%,#1C0800)",
          boxShadow:"inset -12px 0 28px rgba(0,0,0,.6)" }}>
          <DoorPanel/>
          {/* Hinges */}
          {["14%","50%","82%"].map((t,i) => (
            <div key={i} style={{ position:"absolute", top:t, right:-1, width:18, height:10,
              background:"rgba(218,165,32,.45)", borderRadius:2 }}/>
          ))}
          <div style={{ position:"absolute", top:"50%", right:10, transform:"translateY(-50%)",
            width:14, height:14, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(255,215,0,.95),rgba(180,130,0,.8))",
            boxShadow:"0 0 8px rgba(255,165,0,.5)" }}/>
        </div>

        {/* Right door */}
        <div ref={doorRRef} style={{ position:"absolute", top:0, bottom:0, right:0, width:"50%",
          borderLeft:"3px solid rgba(218,165,32,.6)",
          background:"linear-gradient(to left,#0A0200,#1C0800 30%,#280E00 70%,#1C0800)",
          boxShadow:"inset 12px 0 28px rgba(0,0,0,.6)" }}>
          <DoorPanel/>
          {["14%","50%","82%"].map((t,i) => (
            <div key={i} style={{ position:"absolute", top:t, left:-1, width:18, height:10,
              background:"rgba(218,165,32,.45)", borderRadius:2 }}/>
          ))}
          <div style={{ position:"absolute", top:"50%", left:10, transform:"translateY(-50%)",
            width:14, height:14, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(255,215,0,.95),rgba(180,130,0,.8))",
            boxShadow:"0 0 8px rgba(255,165,0,.5)" }}/>
        </div>
      </div>
    </section>
  );
}
