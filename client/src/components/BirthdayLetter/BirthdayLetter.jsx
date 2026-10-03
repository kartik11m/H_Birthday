import { useRef, useState } from "react";
import gsap from "gsap";
import { shayaris } from "../../data/birthday";

export default function BirthdayLetter() {
  const [opened, setOpened] = useState(false);
  const envRef=useRef(null), btnRef=useRef(null), paperRef=useRef(null), flapRef=useRef(null);

  const openLetter = () => {
    if (opened) return; setOpened(true);
    gsap.to(flapRef.current,{y:-30,opacity:0,duration:.5,ease:"power2.out"});
    gsap.to(envRef.current,{y:-12,opacity:0,scale:.88,duration:.55,delay:.25,ease:"power2.in"});
    gsap.to(btnRef.current,{opacity:0,duration:.3});
    setTimeout(()=>{
      if(!paperRef.current) return;
      paperRef.current.style.display="block";
      gsap.fromTo(paperRef.current,{opacity:0,y:44},{opacity:1,y:0,duration:.75,ease:"power2.out"});
      gsap.fromTo(".ltr-part",{opacity:0,y:12},{opacity:1,y:0,duration:.6,stagger:.18,delay:.4});
      gsap.fromTo(".shayari",{opacity:0,x:-22},{opacity:1,x:0,duration:.75,stagger:.45,delay:.7,ease:"power2.out"});
    },700);
  };

  return (
    <section style={{padding:"52px 20px 48px",background:"#FEF5F8"}}>
      <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(1.15rem,4vw,1.8rem)",fontWeight:700,color:"#3D1A30",textAlign:"center",marginBottom:30}}>
        Hehe Ek patra likha hai 💌 
        <br />shayari cominggg
      </h2>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
        {!opened && (
          <>
            <div ref={envRef} onClick={openLetter} style={{position:"relative",width:300,height:182,cursor:"pointer"}}>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(155deg,#FDF0F8,#F4C0D8)",border:"1.5px solid rgba(212,100,154,.6)",borderRadius:4,boxShadow:"0 4px 20px rgba(212,100,154,.2)"}}>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:0,borderStyle:"solid",borderWidth:"0 0 96px 150px",borderColor:"transparent transparent rgba(240,160,200,.45) transparent"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:0,borderStyle:"solid",borderWidth:"96px 0 0 150px",borderColor:"transparent transparent transparent rgba(255,210,230,.45)"}}/>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-55%)",fontSize:"2rem",zIndex:4}}>💌</div>
                <p style={{position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)",fontFamily:"Caveat,cursive",fontSize:"1rem",color:"#9B3070",whiteSpace:"nowrap",zIndex:4}}>Tumhare Liye Madam 🌷</p>
              </div>
              <div ref={flapRef} style={{position:"absolute",top:0,left:-1,right:-1,height:0,borderWidth:"92px 152px 0 152px",borderStyle:"solid",borderColor:"#F4A0C8 transparent transparent transparent",zIndex:5}}/>
            </div>
            <button ref={btnRef} onClick={openLetter}
              style={{padding:"12px 32px",background:"linear-gradient(130deg,#E87CB0,#C44F8A)",color:"#fff",border:"none",borderRadius:50,fontFamily:"Poppins,sans-serif",fontSize:".9rem",fontWeight:500,cursor:"pointer",boxShadow:"0 6px 24px rgba(212,100,154,.45)",letterSpacing:".03em"}}>
              Kholo Kholo 💌
            </button>
          </>
        )}
        <div ref={paperRef} style={{display:"none",maxWidth:520,width:"100%",background:"#FFFAFC",borderRadius:16,padding:"28px 26px 32px",boxShadow:"0 6px 32px rgba(212,100,154,.15)",border:"1.5px solid rgba(212,100,154,.3)",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 27px,rgba(212,100,154,.06) 27px,rgba(212,100,154,.06) 28px)",pointerEvents:"none"}}/>
          {[{s:"top:14px;left:15px",e:"🌷"},{s:"top:14px;right:15px",e:"✨"},{s:"bottom:14px;left:15px",e:"🪷"},{s:"bottom:14px;right:15px",e:"🌸"}].map(({s,e},i)=>(
            <div key={i} style={{position:"absolute",fontSize:"1.1rem",opacity:.45,...Object.fromEntries(s.split(";").map(p=>{const[k,v]=p.trim().split(":");return[k.replace(/-./,m=>m[1].toUpperCase()),v];}))}}>{e}</div>
          ))}
          <p className="ltr-part" style={{fontFamily:"Caveat,cursive",fontSize:".9rem",color:"#B07090",textAlign:"right",marginBottom:18,position:"relative",zIndex:1,opacity:0}}>4th October, 2026</p>
          <p className="ltr-part" style={{fontFamily:"Playfair Display,serif",fontSize:"1.15rem",fontWeight:600,color:"#3D1A30",marginBottom:22,position:"relative",zIndex:1,opacity:0}}>Dear Birthday Girl,</p>
          {shayaris.map((s,i)=>(
            <div key={i} className="shayari" style={{fontFamily:"Playfair Display,serif",fontStyle:"italic",fontSize:"clamp(.88rem,2.6vw,1.02rem)",color:"#5C1A40",lineHeight:1.95,marginBottom:20,padding:"12px 14px",borderLeft:"3.5px solid #D4649A",background:"rgba(212,100,154,.06)",borderRadius:"0 8px 8px 0",position:"relative",zIndex:1,opacity:0}}>
              {s.text.split("\n").map((line,j)=><span key={j}>{line}{j<s.text.split("\n").length-1&&<br/>}</span>)}
              <span style={{display:"block",fontSize:".72rem",fontStyle:"normal",color:"#B07090",marginTop:7,fontFamily:"Poppins,sans-serif",letterSpacing:".04em"}}>{s.attr}</span>
            </div>
          ))}
          <p className="ltr-part" style={{fontFamily:"Caveat,cursive",fontSize:"1.2rem",color:"#5C1A40",textAlign:"right",marginTop:26,position:"relative",zIndex:1,opacity:0}}>— Kartik Naya Shayar 🌷</p>
        </div>
      </div>
    </section>
  );
}
