import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function StarryNight() {
  const secRef = useRef(null);
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      const sec = secRef.current;
      for(let i=0;i<72;i++){
        const s=document.createElement("div");
        const sz=.7+Math.random()*2.6;
        s.style.cssText=`position:absolute;border-radius:50%;background:#fff;width:${sz}px;height:${sz}px;left:${Math.random()*95+2}%;top:${Math.random()*92+2}%;opacity:0;animation:twk-n ${1.6+Math.random()*2.8}s ease-in-out ${Math.random()*2.5}s infinite;`;
        sec.appendChild(s);
        gsap.to(s,{opacity:.35+Math.random()*.65,duration:.1,delay:.4+Math.random()*2});
      }
      gsap.fromTo(".sn-msg",{opacity:0,y:28},{opacity:1,y:0,duration:1.1,ease:"power2.out",
        scrollTrigger:{trigger:".sn-msg",start:"top 88%"}});
    },secRef);
    return ()=>ctx.revert();
  },[]);

  return (
    <section ref={secRef} style={{minHeight:380,position:"relative",background:"#0D0515",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"40px 24px"}}>
      <style>{`@keyframes twk-n{0%,100%{opacity:.1;transform:scale(.8)}50%{opacity:1;transform:scale(1.5)}}`}</style>
      {/* Moon */}
      <div style={{position:"absolute",top:"9%",right:"11%",width:76,height:76,borderRadius:"50%",background:"radial-gradient(circle,#FFFDE8,#FFE890 55%,transparent)",boxShadow:"0 0 38px rgba(255,240,120,.35)"}}/>
      {/* Floating lotus */}
      <div style={{position:"absolute",top:"15%",left:"8%",fontSize:"1.5rem",opacity:.2,animation:"float 10s ease-in-out infinite"}}>🪷</div>
      <div style={{position:"absolute",bottom:"18%",right:"10%",fontSize:"1.4rem",opacity:.2,animation:"float 12s ease-in-out 1s infinite"}}>🌷</div>
      {/* Message */}
      <div className="sn-msg" style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.1)",borderRadius:18,padding:"30px 26px",maxWidth:460,textAlign:"center",position:"relative",zIndex:2,opacity:0}}>
        <p style={{fontFamily:"Playfair Display,serif",fontStyle:"italic",fontSize:"clamp(.92rem,3vw,1.18rem)",color:"rgba(240,210,255,.9)",lineHeight:1.9,marginBottom:16}}>
          "Even on the days when everything feels a little heavy..."
        </p>
        <p style={{fontFamily:"Caveat,cursive",fontSize:"clamp(.92rem,3vw,1.1rem)",color:"rgba(220,180,240,.65)",lineHeight:1.7}}>
          Remember — you are loved, you are enough, and beautiful things are always on their way. 🪷
        </p>
      </div>
    </section>
  );
}
