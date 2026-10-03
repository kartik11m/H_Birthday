import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { birthdayData } from "../../data/birthday";
gsap.registerPlugin(ScrollTrigger);

export default function FinalScreen() {
  const secRef = useRef(null);
  useEffect(()=>{
    const ctx = gsap.context(()=>{
      gsap.utils.toArray(".final-line").forEach((el,i)=>{
        gsap.fromTo(el,{opacity:0,y:22},{opacity:1,y:0,duration:.9,ease:"power2.out",delay:i*.15,
          scrollTrigger:{trigger:el,start:"top 90%"}});
      });
    },secRef);
    return ()=>ctx.revert();
  },[]);

  return (
    <section ref={secRef} style={{padding:"60px 24px 80px",background:"linear-gradient(180deg,#060200,#1A0820 50%,#0D0515)",textAlign:"center",position:"relative",overflow:"hidden",minHeight:360}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,100,154,.1),transparent 70%)",pointerEvents:"none"}}/>
      {["🌷","🪷","🌸","🌺","✨"].map((e,i)=>(
        <div key={i} style={{position:"absolute",fontSize:"1.2rem",opacity:.22,pointerEvents:"none",
          left:`${10+i*18}%`,top:`${15+i*8}%`,animation:`float ${8+i}s ease-in-out ${i*.4}s infinite`}}>{e}</div>
      ))}
      <div style={{fontSize:"2.8rem",marginBottom:20,animation:"float 4s ease-in-out infinite"}}>🪷</div>
      <p className="final-line" style={{fontFamily:"Caveat,cursive",fontSize:"clamp(1rem,3.5vw,1.35rem)",color:"rgba(240,180,220,.65)",marginBottom:10,opacity:0}}>For you 🌷</p>
      <p className="final-line" style={{fontFamily:"Playfair Display,serif",fontStyle:"italic",fontSize:"clamp(.9rem,3vw,1.1rem)",color:"rgba(220,160,200,.72)",lineHeight:1.85,maxWidth:420,margin:"0 auto 28px",opacity:0}}>
        May you always have reasons to smile.
      </p>
      <h2 className="final-line" style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(1.6rem,5vw,2.6rem)",fontWeight:700,color:"#FFD700",lineHeight:1.3,marginBottom:8,opacity:0}}>Happy Birthday,</h2>
      <h2 className="final-line" style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(1.6rem,5vw,2.6rem)",fontWeight:700,fontStyle:"italic",color:"rgba(255,180,220,.9)",marginBottom:36,opacity:0}}>
        {birthdayData.nickname} ❤️
      </h2>
      <button className="final-line" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        style={{padding:"13px 34px",background:"transparent",border:"1.5px solid rgba(212,100,154,.55)",color:"rgba(240,180,220,.75)",borderRadius:50,fontFamily:"Poppins,sans-serif",fontSize:".88rem",cursor:"pointer",letterSpacing:".05em",transition:"all .22s",opacity:0}}
        onMouseEnter={e=>{e.target.style.background="rgba(212,100,154,.14)";e.target.style.color="#FFB6C1";}}
        onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color="rgba(240,180,220,.75)";}}>
        Replay the journey ↻
      </button>
    </section>
  );
}
