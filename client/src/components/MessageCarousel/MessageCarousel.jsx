import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { messages } from "../../data/birthday";

const BG = [
  "linear-gradient(135deg,#F9D6E8,#F0A8C8)",
  "linear-gradient(135deg,#E8D0F4,#C8A0DC)",
  "linear-gradient(135deg,#D4EEFF,#B8D4E8)",
  "linear-gradient(135deg,#F4D0E8,#E8A0C0)",
  "linear-gradient(135deg,#E0D4F4,#C0B0E0)",
  "linear-gradient(135deg,#F4E0EC,#E8C0D4)",
];

export default function MessageCarousel() {
  const [cur, setCur] = useState(0);
  const innerRef=useRef(null), emRef=useRef(null), catRef=useRef(null), msgRef=useRef(null);
  const timerRef=useRef(null);

  const go = (n) => {
    n = (n + messages.length) % messages.length;
    gsap.to([emRef.current,catRef.current,msgRef.current],{
      opacity:0, y:-8, duration:.2,
      onComplete:()=>{
        setCur(n);
        gsap.fromTo([emRef.current,catRef.current,msgRef.current],
          {opacity:0,y:8},{opacity:1,y:0,duration:.35,stagger:.07,ease:"power2.out"});
        gsap.to(innerRef.current,{background:BG[n],duration:.55});
      }
    });
  };

  useEffect(()=>{
    timerRef.current = setInterval(()=>go(cur+1), 4200);
    return ()=>clearInterval(timerRef.current);
  },[cur]);

  const m = messages[cur];
  return (
    <section style={{padding:"52px 20px 40px",background:"linear-gradient(180deg,#FEF5F8,#FDF0F8)"}}>
      <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(1.15rem,4vw,1.8rem)",fontWeight:700,color:"#3D1A30",textAlign:"center",marginBottom:28}}>
        Messages For You 🌷
      </h2>
      <div ref={innerRef} style={{borderRadius:18,padding:"38px 28px",textAlign:"center",minHeight:230,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:BG[0],transition:"background .6s"}}>
        <span ref={emRef} style={{fontSize:"2.8rem",marginBottom:12,display:"block"}}>{m.emoji}</span>
        <p ref={catRef} style={{fontSize:".7rem",letterSpacing:".24em",textTransform:"uppercase",color:"#7A3060",marginBottom:14,fontWeight:500}}>{m.category}</p>
        <p ref={msgRef} style={{fontFamily:"Playfair Display,serif",fontStyle:"italic",fontSize:"clamp(.88rem,2.8vw,1.1rem)",color:"#3D1A30",lineHeight:1.9,maxWidth:480}}>{m.message}</p>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginTop:20}}>
        <button onClick={()=>go(cur-1)} style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid rgba(212,100,154,.6)",background:"transparent",color:"#9B6080",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {messages.map((_,i)=>(
            <div key={i} onClick={()=>go(i)} style={{width:8,height:8,borderRadius:"50%",background:i===cur?"#D4649A":"#E0B0C8",transform:i===cur?"scale(1.35)":"scale(1)",cursor:"pointer",transition:"all .3s"}}/>
          ))}
        </div>
        <button onClick={()=>go(cur+1)} style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid rgba(212,100,154,.6)",background:"transparent",color:"#9B6080",cursor:"pointer",fontSize:"1.1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
    </section>
  );
}
