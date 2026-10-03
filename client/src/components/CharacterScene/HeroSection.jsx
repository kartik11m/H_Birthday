import { useEffect, useRef } from "react";
import gsap from "gsap";
import { birthdayData } from "../../data/birthday";

const FLOATS = ["🌷","🌸","🪷","🌺"];

function Bouquet() {
  return (
    <svg
      aria-label="Bouquet of tulips and lotus"
      role="img"
      viewBox="0 0 100 110"
      style={{position:"absolute",width:82,height:90,left:17,top:-4,pointerEvents:"none"}}
    >
      <g fill="none" stroke="#38734A" strokeWidth="3" strokeLinecap="round">
        <path d="M53 99C47 72 30 47 23 25"/>
        <path d="M54 99C53 69 51 44 51 19"/>
        <path d="M55 99C60 72 73 49 78 29"/>
      </g>
      <g fill="#55A66A" stroke="#38734A" strokeWidth="1.5">
        <path d="M44 78C28 70 25 61 27 56C39 59 47 67 49 78Z"/>
        <path d="M59 84C72 73 82 72 86 75C79 86 69 91 57 90Z"/>
        <path d="M45 69C34 58 33 50 36 46C46 53 50 60 51 71Z"/>
      </g>
      <g stroke="#8B3D60" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M13 28C8 19 12 10 20 8C22 1 31 2 34 10C42 7 48 14 44 23L30 34Z" fill="#F27FA4"/>
        <path d="M40 22C35 12 40 5 48 5C52 -1 61 2 62 10C70 8 76 16 71 24L56 34Z" fill="#F5A2C0"/>
        <path d="M66 32C62 23 67 16 74 17C79 10 87 14 87 22C95 21 99 29 93 37L79 44Z" fill="#E9789A"/>
      </g>
      <g fill="#FFE4A3" stroke="#C57A5B" strokeWidth="1">
        <circle cx="29" cy="23" r="3.2"/>
        <circle cx="56" cy="22" r="3.2"/>
        <circle cx="80" cy="34" r="3.2"/>
      </g>
      <path d="M46 91L55 88L62 94L55 102Z" fill="#E9789A" stroke="#A94F76" strokeWidth="1.5"/>
    </svg>
  );
}

export default function HeroSection() {
  const scaleR=useRef(null),bounceR=useRef(null),leanR=useRef(null);
  const spdR=useRef(null),fmsgR=useRef(null),bdmsgR=useRef(null),giftR=useRef(null);
  const secRef=useRef(null);

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.set(scaleR.current,{scale:.055,opacity:0,transformOrigin:"center bottom"});
      gsap.set(leanR.current,{rotation:-12,transformOrigin:"center bottom"});
      gsap.set(spdR.current,{opacity:0});
      gsap.set([fmsgR.current,bdmsgR.current,giftR.current],{opacity:0,y:16});

      const bnc=gsap.timeline({repeat:-1,paused:true})
        .to(bounceR.current,{y:-10,duration:.16,ease:"power1.out"})
        .to(bounceR.current,{y:0,duration:.16,ease:"bounce.out"});

      const tl=gsap.timeline({defaults:{ease:"power2.out"},delay:.5});
      tl.to(scaleR.current,{opacity:1,duration:.4})
        .to(spdR.current,{opacity:.85,duration:.5},"-.2")
        .call(()=>bnc.play())
        .to(scaleR.current,{scale:1,duration:4.8,ease:"power1.inOut"})
        .to(leanR.current,{rotation:-6,duration:3.8,ease:"none"},"-=4.8")
        .to(spdR.current,{opacity:0,duration:1.2},"-=1.3")
        .to(leanR.current,{rotation:0,duration:.5})
        .call(()=>{bnc.pause();gsap.to(bounceR.current,{y:0,duration:.3});})
        .to(scaleR.current,{y:-20,duration:.22,ease:"power2.out"})
        .to(scaleR.current,{y:0,duration:.42,ease:"bounce.out"})
        .fromTo(fmsgR.current,{opacity:0,y:16},{opacity:1,y:0,duration:.8},"+=.5")
        .fromTo(bdmsgR.current,{opacity:0,y:16},{opacity:1,y:0,duration:.9},"+=.5")
        .fromTo(giftR.current,{opacity:0,scale:.75},{opacity:1,scale:1,duration:.55,ease:"back.out(1.7)"},"+=.3")
        .to(scaleR.current,{y:-8,duration:2.2,ease:"sine.inOut",yoyo:true,repeat:-1},"+=.2");
    },secRef);
    return ()=>ctx.revert();
  },[]);

  const clouds=[
    {w:155,h:44,top:"7%",left:"4%",blobs:[{w:78,h:78,t:-40,l:13},{w:58,h:58,t:-30,l:62}]},
    {w:135,h:38,top:"5%",right:"5%",blobs:[{w:66,h:66,t:-33,l:12},{w:50,h:50,t:-25,l:56}]},
    {w:105,h:32,top:"17%",left:"19%",blobs:[{w:52,h:52,t:-26,l:10}]},
    {w:118,h:34,top:"13%",right:"21%",blobs:[{w:58,h:58,t:-29,l:12},{w:44,h:44,t:-22,l:54}]},
  ];

  return (
    <section ref={secRef} style={{position:"relative",minHeight:"100vh",overflow:"hidden",
      background:"radial-gradient(ellipse at 50% 28%,#FFF5F9,#F9E8F2 45%,#F0D4E8 100%)"}}>
      <div style={{position:"absolute",inset:0,opacity:.45,
        background:"linear-gradient(to bottom,#C8B0DC 0%,#E0B8D0 20%,#F4C8DC 48%,#FFD9A0 78%,#FFB870 100%)"}}/>
      {clouds.map((c,i)=>(
        <div key={i} style={{position:"absolute",background:"rgba(255,255,255,.88)",borderRadius:50,width:c.w,height:c.h,top:c.top,left:c.left,right:c.right}}>
          {c.blobs.map((b,j)=><span key={j} style={{position:"absolute",width:b.w,height:b.h,borderRadius:"50%",background:"rgba(255,255,255,.88)",top:b.t,left:b.l}}/>)}
        </div>
      ))}
      {FLOATS.map((e,i)=>(
        <div key={i} style={{position:"absolute",fontSize:"1.8rem",opacity:.25,pointerEvents:"none",
          top:[`20%`,`15%`,`40%`,`25%`][i],left:[`6%`,null,`2%`,null][i],right:[null,`8%`,null,`4%`][i],
          animation:`float ${10+i*2}s ease-in-out ${i*.5}s infinite`}}>{e}</div>
      ))}
      <div ref={spdR} style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:3}}>
        {[{t:"36%",l:"2%",w:"40%",d:"left"},{t:"41%",l:"0",w:"48%",d:"left"},{t:"46%",l:"4%",w:"34%",d:"left"},
          {t:"38%",r:"2%",w:"40%",d:"right"},{t:"43%",r:"0",w:"45%",d:"right"},{t:"49%",r:"5%",w:"30%",d:"right"}].map((s,i)=>(
          <div key={i} style={{position:"absolute",height:2.5,borderRadius:2,top:s.t,left:s.l,right:s.r,width:s.w,
            background:`linear-gradient(to ${s.d},rgba(255,200,220,.7),transparent)`}}/>
        ))}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:78,zIndex:2,
        background:"linear-gradient(to bottom,#7AC048,#4A8020)",borderRadius:"52% 52% 0 0/22px 22px 0 0"}}>
        {["4%","10%","48%"].map((p,i)=><span key={i} style={{position:"absolute",bottom:"100%",fontSize:"1.4rem",opacity:.65,left:p}}>🌷</span>)}
        {["6%","13%"].map((p,i)=><span key={i} style={{position:"absolute",bottom:"100%",fontSize:"1.3rem",opacity:.65,right:p}}>🌸</span>)}
      </div>
      {/* Character scene */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"flex-end",justifyContent:"center",paddingBottom:74,zIndex:10}}>
        <div style={{position:"relative"}}>
          {/* scaleR: 0.055 → 1 gives the "running from afar" perspective */}
          <div ref={scaleR} style={{transformOrigin:"center bottom"}}>
            <div ref={bounceR} style={{display:"flex",alignItems:"flex-end"}}>
              <div ref={leanR} style={{transformOrigin:"center bottom"}}>
                {/*
                  ✅ character.png lives in client/public/character.png
                  To swap: replace that file with any PNG that has a transparent background.
                */}
                <div style={{position:"relative"}}>
                  <img src="/character.png" alt="Character" draggable={false}
                    style={{width:260,height:"auto",display:"block",userSelect:"none",
                      filter:"drop-shadow(0 14px 28px rgba(80,40,120,.4))"}}/>
                  <Bouquet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Text + CTA */}
      <div style={{position:"absolute",top:"50%",left:0,right:0,transform:"translateY(-50%)",textAlign:"center",zIndex:20,padding:"0 20px"}}>
        <p ref={fmsgR} style={{fontFamily:"'Caveat',cursive",fontSize:"clamp(1.1rem,4vw,1.55rem)",color:"#5C1A40",
          textShadow:"0 2px 10px rgba(255,255,255,.85)",letterSpacing:".05em",marginBottom:5}}>
          {birthdayData.flowerMessage}
        </p>
        <h2 ref={bdmsgR} style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(1.4rem,5vw,2.5rem)",
          fontWeight:700,color:"#3D1A30",textShadow:"0 3px 14px rgba(255,255,255,.85)",lineHeight:1.3}}>
          {birthdayData.birthdayGreeting} <em style={{color:"#C44F8A",fontStyle:"italic"}}>{birthdayData.nickname}</em>!
        </h2>
        <button ref={giftR}
          onClick={()=>document.getElementById("cake-blowing")?.scrollIntoView({behavior:"smooth"})}
          style={{marginTop:18,padding:"13px 36px",background:"linear-gradient(130deg,#E87CB0,#C44F8A)",
            color:"#fff",border:"none",borderRadius:50,fontFamily:"'Poppins',sans-serif",
            fontSize:".92rem",fontWeight:500,cursor:"pointer",
            boxShadow:"0 8px 30px rgba(212,100,154,.55)",letterSpacing:".03em"}}>
          Open your surprise 🎁
        </button>
      </div>
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:400,height:140,pointerEvents:"none",zIndex:1,
        background:"radial-gradient(ellipse at 50% 100%,rgba(232,124,176,.4),transparent 70%)"}}/>
    </section>
  );
}