import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { memories } from "../../data/birthday";
gsap.registerPlugin(ScrollTrigger);

const BG = [
  "linear-gradient(135deg,#F9D6E8,#F0A8C8)",
  "linear-gradient(135deg,#E8D0F4,#C8A0DC)",
  "linear-gradient(135deg,#D4EEFF,#B8D4E8)",
  "linear-gradient(135deg,#F4D0E8,#E8A0C0)",
];

export default function TimelineSection() {
  const secRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".te-card").forEach(el => {
        const isLeft = el.closest(".te-l") !== null;
        gsap.fromTo(el,{ opacity:0, x:isLeft?-55:55 },
          { opacity:1, x:0, duration:.85, ease:"power2.out",
            scrollTrigger:{ trigger:el, start:"top 88%" }});
      });
      gsap.fromTo(".tl-hd",{ opacity:0, y:22 },
        { opacity:1, y:0, duration:.7, scrollTrigger:{ trigger:".tl-hd", start:"top 88%" }});
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={secRef} style={{ padding:"60px 16px 40px", background:"#FEF5F8" }}>
      <h2 className="tl-hd" style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.2rem,4vw,2rem)", fontWeight:700, color:"#3D1A30", textAlign:"center", marginBottom:40, opacity:0 }}>
        Our Little Timeline 🌷
      </h2>
      <div style={{ position:"relative", maxWidth:700, margin:"0 auto" }}>
        <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"linear-gradient(to bottom,transparent,#D4649A 6%,#D4649A 94%,transparent)", transform:"translateX(-50%)" }}/>
        {memories.map((m,i) => (
          <div key={m.id} className={`te te-${m.side==="left"?"l":"r"}`}
            style={{ display:"grid", gridTemplateColumns:"1fr 56px 1fr", alignItems:"start", marginBottom:28 }}>
            <div style={{ padding:"0 6px" }}>
              {m.side==="left" && <Card m={m} bg={BG[i%BG.length]}/>}
            </div>
            <div style={{ display:"flex", justifyContent:"center", paddingTop:20 }}>
              <div style={{ width:15, height:15, background:"#D4649A", borderRadius:"50%", border:"3px solid #FEF5F8", outline:"2.5px solid #D4649A", flexShrink:0 }}/>
            </div>
            <div style={{ padding:"0 6px" }}>
              {m.side==="right" && <Card m={m} bg={BG[i%BG.length]}/>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ m, bg }) {
  return (
    <div className="te-card" style={{ background:"#fff", borderRadius:14, padding:15, boxShadow:"0 3px 18px rgba(0,0,0,.07)", border:"1.5px solid rgba(212,100,154,.25)" }}>
      <div style={{ borderRadius:9, width:"100%", aspectRatio:"4/3", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2rem", marginBottom:11 }}>
        {m.image ? <img src={m.image} alt={m.title} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:9 }} onError={e=>{ e.target.style.display="none"; e.target.parentNode.textContent=m.emoji; }}/> : m.emoji}
      </div>
      <span style={{ display:"inline-block", background:"#FDF0F8", color:"#9B6080", fontSize:".68rem", fontWeight:500, padding:"3px 10px", borderRadius:20, border:"1px solid rgba(212,100,154,.4)", marginBottom:7, letterSpacing:".08em" }}>{m.date}</span>
      <h3 style={{ fontFamily:"Playfair Display,serif", fontSize:".95rem", fontWeight:600, color:"#3D1A30", marginBottom:5 }}>{m.title}</h3>
      <p style={{ fontSize:".74rem", color:"#9B6080", lineHeight:1.6 }}>{m.description}</p>
    </div>
  );
}
