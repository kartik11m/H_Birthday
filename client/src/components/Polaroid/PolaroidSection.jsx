import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const POLS = [
  { img:"/HC.jpeg",  caption:"Wow wow wow",      date:"Speechhh",  rot:-4   },
  { img:"/HC1.jpeg", caption:"Smileeee",  date:"pleaseee",    rot:2    },
  { img:"/HC2.jpeg", caption:"Awwwwww",   date:"Cutieeeee",     rot:-2.5 },
];

export default function PolaroidSection() {
  const secRef = useRef(null);
  const polRefs = useRef([]);
  useEffect(() => {
    const ctx = gsap.context(() => {
      polRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { rotation: POLS[i].rot });
        gsap.fromTo(el, { y:48, opacity:0 }, { y:0, opacity:1, duration:.75, ease:"power2.out",
          scrollTrigger:{ trigger:el, start:"top 90%" }});
        el.addEventListener("mouseenter", () => gsap.to(el, { rotation:0, scale:1.09, y:-14, duration:.3, ease:"power2.out", boxShadow:"0 14px 44px rgba(212,100,154,.28)" }));
        el.addEventListener("mouseleave", () => gsap.to(el, { rotation:POLS[i].rot, scale:1, y:0, duration:.42, ease:"power2.out", boxShadow:"0 5px 22px rgba(0,0,0,.13)" }));
      });
      gsap.fromTo(".pol-hd", { opacity:0, y:22 }, { opacity:1, y:0, duration:.7, scrollTrigger:{ trigger:".pol-hd", start:"top 88%" }});
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} style={{ padding:"52px 20px 40px", background:"linear-gradient(180deg,#FEF5F8,#FDF0F8 60%,#FEF5F8)" }}>
      <h2 className="pol-hd" style={{ fontFamily:"Playfair Display,serif", fontSize:"clamp(1.15rem,4vw,1.85rem)", fontWeight:700, color:"#3D1A30", textAlign:"center", marginBottom:34, opacity:0 }}>
        Bachpan Ki Yaadein 🌸
      </h2>
      <div style={{ display:"flex", justifyContent:"center", gap:22, flexWrap:"wrap", padding:"14px 0" }}>
        {POLS.map((p,i) => (
          <div key={i} ref={el=>polRefs.current[i]=el}
            style={{ background:"#fff", padding:"14px 14px 44px", boxShadow:"0 5px 22px rgba(0,0,0,.13)", cursor:"pointer", maxWidth:172, flexShrink:0, willChange:"transform" }}>
            <img src={p.img} alt={p.caption} style={{ width:144, height:144, display:"block", marginBottom:10 }} />
            <p style={{ fontFamily:"Caveat,cursive", fontSize:"1rem", color:"#5C1A40", textAlign:"center", lineHeight:1.4 }}>{p.caption}</p>
            <p style={{ fontSize:".67rem", color:"#B07090", textAlign:"center", marginTop:4, letterSpacing:".04em" }}>{p.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
