import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const VIDEOS = [
  { src: "/Kspeech.mp4",  label: "Speech 🎤" },
  { src: "/Ksong.mp4",  label: "Gaana #1 🎤" },
  { src: "/K1song.mp4", label: "Gaana #2 🎤" },
];

const CHEER = ["🌷","🌸","🪷","🌺","✨","💐","🌼","🌹"];
const THROW = { tomato:["🍅"], veggie:["🥕","🥒","🍆","🌽","🧅"] };
const CHEER_RX = ["WOOOOOO! 🌷","BEAUTIFUL! 🌸","SO LOVELY! 🪷","AMAZING! ✨"];
const THROW_RX = ["BOOOOO! 😂","THWACK! 💥","GOT HIM! 🍅","DIRECT HIT! 🎯"];

export default function PartyVibes() {
  const secRef=useRef(null), stageRef=useRef(null), vidRef=useRef(null);
  const [mode,setMode]=useState("cheer");
  const [playing,setPlaying]=useState(false);
  const [cheers,setCheers]=useState(0);
  const [throws,setThrows]=useState(0);
  const active=useRef(0);

  const [vidIdx, setVidIdx] = useState(0);
  const [showRukoZara, setShowRukoZara] = useState(false);
  const rukoTimerRef = useRef(null);

  /* ── switch to a specific video index ── */
  const switchVideo = useCallback((nextIdx, withTransition = true) => {
    const clamped = ((nextIdx % VIDEOS.length) + VIDEOS.length) % VIDEOS.length;
    if (clamped === vidIdx && !withTransition) return;

    if (withTransition) {
      // pause current
      if (vidRef.current) vidRef.current.pause();
      setPlaying(false);
      setShowRukoZara(true);

      if (rukoTimerRef.current) clearTimeout(rukoTimerRef.current);
      rukoTimerRef.current = setTimeout(() => {
        setShowRukoZara(false);
        setVidIdx(clamped);
        // auto-play after transition
        setTimeout(() => {
          if (vidRef.current) {
            vidRef.current.currentTime = 0;
            vidRef.current.play().then(() => setPlaying(true)).catch(() => {});
          }
        }, 100);
      }, 1800);
    } else {
      setVidIdx(clamped);
    }
  }, [vidIdx]);

  /* ── when video ends naturally, auto-switch ── */
  const handleVideoEnd = useCallback(() => {
    setPlaying(false);
    const nextIdx = (vidIdx + 1) % VIDEOS.length;
    switchVideo(nextIdx, true);
  }, [vidIdx, switchVideo]);

  /* ── manual nav ── */
  const goPrev = () => switchVideo(vidIdx - 1, true);
  const goNext = () => switchVideo(vidIdx + 1, true);

  /* ── cleanup timer on unmount ── */
  useEffect(() => () => { if (rukoTimerRef.current) clearTimeout(rukoTimerRef.current); }, []);

  /* ── stage interactions ── */
  const getCenter=()=>{
    if(!stageRef.current||!secRef.current) return{x:0,y:0};
    const sr=stageRef.current.getBoundingClientRect();
    const pr=secRef.current.getBoundingClientRect();
    return{x:sr.left-pr.left+sr.width/2,y:sr.top-pr.top+sr.height/2};
  };
  const spawn=(emoji)=>{
    if(active.current>35) return null;
    active.current++;
    const el=document.createElement("div");
    el.style.cssText=`position:absolute;font-size:${20+Math.random()*14}px;pointer-events:none;z-index:40;`;
    el.textContent=emoji;
    secRef.current.appendChild(el);
    return el;
  };
  const doCheer=(emoji)=>{
    const el=spawn(emoji); if(!el) return;
    const aw=secRef.current.clientWidth;
    const sx=40+Math.random()*(aw-80), sy=secRef.current.clientHeight-30;
    gsap.set(el,{left:sx,top:sy});
    gsap.to(el,{y:-(130+Math.random()*160),x:(Math.random()-.5)*200,rotation:(Math.random()-.5)*480,opacity:0,duration:1.7+Math.random()*.5,ease:"power2.out",onComplete:()=>{el.remove();active.current--;}});
    setCheers(p=>p+1);
    if(Math.random()>.55) showReaction(CHEER_RX,"#D4649A");
  };
  const doThrow=(emoji)=>{
    const el=spawn(emoji); if(!el) return;
    const aw=secRef.current.clientWidth,ah=secRef.current.clientHeight;
    const sx=40+Math.random()*(aw-80),sy=ah-30;
    const{x:tx,y:ty}=getCenter();
    const arc=70+Math.random()*90,dur=.65+Math.random()*.22;
    gsap.set(el,{left:sx,top:sy});
    gsap.timeline({onComplete:()=>splatIt(el)})
      .to(el,{x:(tx-sx)/2,y:-arc,rotation:360,duration:dur/2,ease:"power1.out"})
      .to(el,{x:tx-sx,y:ty-sy,rotation:720,duration:dur/2,ease:"power1.in"});
  };
  const splatIt=(el)=>{
    el.textContent="💥"; el.style.fontSize="2.8rem";
    gsap.to(el,{scale:2.8,opacity:0,duration:.32,ease:"power2.out",onComplete:()=>{el.remove();active.current--;}});
    gsap.timeline()
      .to(stageRef.current,{x:-5,y:2,duration:.05}).to(stageRef.current,{x:4,y:-2,duration:.05})
      .to(stageRef.current,{x:-3,y:1,duration:.05}).to(stageRef.current,{x:0,y:0,duration:.05});
    setThrows(p=>p+1);
    showReaction(THROW_RX,"#FF5050");
  };
  const showReaction=(opts,col)=>{
    const el=document.createElement("div");
    el.style.cssText=`position:absolute;font-weight:600;pointer-events:none;z-index:60;font-size:1.1rem;color:${col};left:${12+Math.random()*52}%;top:${18+Math.random()*38}%;font-family:Poppins,sans-serif;`;
    el.textContent=opts[Math.floor(Math.random()*opts.length)];
    secRef.current.appendChild(el);
    gsap.fromTo(el,{opacity:0,scale:.5,y:8},{opacity:1,scale:1,y:0,duration:.28,ease:"back.out(2.2)",
      onComplete:()=>gsap.to(el,{opacity:0,y:-28,duration:.45,delay:.85,onComplete:()=>el.remove()})});
  };
  const fire=()=>{
    if(mode==="cheer") doCheer(CHEER[Math.floor(Math.random()*CHEER.length)]);
    else doThrow(THROW.tomato[0]);
  };
  const multi=(type,n)=>{
    const isThrow=type==="tomato"||type==="veggie";
    const set=THROW[type]||CHEER;
    for(let i=0;i<n;i++) setTimeout(()=>{const e=set[Math.floor(Math.random()*set.length)];isThrow?doThrow(e):doCheer(e);},i*90);
  };
  const togglePlay=()=>{
    if (showRukoZara) return;          // don't toggle while transitioning
    setPlaying(p=>{const next=!p;if(vidRef.current){next?vidRef.current.play():vidRef.current.pause();}return next;});
  };

  /* ── nav button style ── */
  const navBtnStyle = {
    width: 40, height: 40, borderRadius: "50%",
    background: "rgba(212,100,154,.12)", border: "1px solid rgba(212,100,154,.35)",
    color: "#D4649A", cursor: "pointer", fontSize: 18, fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
    transition: "all .2s ease",
    flexShrink: 0,
  };

  return (
    <section ref={secRef} style={{position:"relative",padding:"44px 18px 40px",background:"#FEF5F8",overflow:"hidden"}}>
      <h2 style={{fontFamily:"Playfair Display,serif",fontSize:"clamp(1.15rem,4vw,1.8rem)",fontWeight:700,color:"#3D1A30",textAlign:"center",marginBottom:20}}>
        Party Time by DJ Kartikkkkk! 🌷🎉😅
      </h2>

      {/* Video card */}
      <div style={{background:"#1A0820",borderRadius:16,padding:"16px 16px 12px",marginBottom:14,border:"0.5px solid rgba(212,100,154,.3)"}}>
        <div ref={stageRef} onClick={fire} style={{position:"relative",borderRadius:10,background:"#0D0112",aspectRatio:"16/9",overflow:"hidden",marginBottom:10,cursor:"crosshair"}}>

          <video
            ref={vidRef}
            key={VIDEOS[vidIdx].src}
            src={VIDEOS[vidIdx].src}
            playsInline
            onEnded={handleVideoEnd}
            style={{width:"100%",height:"100%",display:"block"}}
            onError={()=>{}}
          />

          {/* ── "Ruko Zara" transition overlay ── */}
          {showRukoZara && (
            <div style={{
              position:"absolute",inset:0,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,
              background:"rgba(13,1,18,.88)",zIndex:50,
              animation:"fadeInRuko .4s ease",
            }}>
              <div style={{fontSize:"2.4rem",animation:"pulseEmoji 1s ease infinite"}}>✨</div>
              <p style={{
                color:"#F5D0E8",fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(1.1rem,4vw,1.6rem)",fontWeight:600,fontStyle:"italic",
                textAlign:"center",lineHeight:1.4,
              }}>
                Ruko Zara...
              </p>
              <p style={{
                color:"rgba(240,180,220,.5)",fontFamily:"Poppins,sans-serif",
                fontSize:".78rem",
              }}>
                Agla gaana aa raha hai 🎶
              </p>
              <div style={{display:"flex",gap:6}}>
                {[...Array(3)].map((_,i)=>(
                  <div key={i} style={{
                    width:8,height:8,borderRadius:"50%",background:"#D4649A",
                    animation:`dotBounce .6s ease ${i*.15}s infinite alternate`,
                  }}/>
                ))}
              </div>
            </div>
          )}

          {/* ── idle overlay (not playing, not transitioning) ── */}
          {!playing && !showRukoZara && (
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,background:"rgba(13,1,18,.75)"}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:48}}>
                {Array.from({length:14},(_,i)=>(
                  <div key={i} style={{width:5,borderRadius:3,background:"#D4649A",height:6+Math.random()*16,opacity:.3}}/>
                ))}
              </div>
              <p style={{color:"#FDF0F8",fontFamily:"Poppins,sans-serif",fontSize:".9rem",fontWeight:500}}>
                {VIDEOS[vidIdx].label}
              </p>
              <p style={{color:"rgba(240,180,220,.4)",fontFamily:"Poppins,sans-serif",fontSize:".7rem"}}>
                Tap ▶ to play
              </p>
            </div>
          )}
        </div>

        {/* ── Controls row: ◀  ▶/⏸  ▶ ── */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={goPrev} style={navBtnStyle} title="Previous video">
            ‹
          </button>

          <button onClick={togglePlay} style={{width:36,height:36,borderRadius:"50%",background:"rgba(212,100,154,.15)",border:"0.5px solid rgba(212,100,154,.4)",color:"#D4649A",cursor:"pointer",fontSize:15,flexShrink:0}}>
            {playing?"⏸":"▶"}
          </button>

          <span style={{flex:1,fontSize:".82rem",color:"rgba(240,180,220,.6)",fontFamily:"Poppins,sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {VIDEOS[vidIdx].label} ({vidIdx+1}/{VIDEOS.length})
          </span>

          <button onClick={goNext} style={navBtnStyle} title="Next video">
            ›
          </button>
        </div>
      </div>

      {/* Mode selector */}
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <button onClick={()=>setMode("cheer")} style={{flex:1,padding:"10px 8px",borderRadius:11,border:`1.5px solid ${mode==="cheer"?"#D4649A":"rgba(0,0,0,.12)"}`,background:mode==="cheer"?"rgba(212,100,154,.1)":"transparent",color:mode==="cheer"?"#D4649A":"#666",fontFamily:"Poppins,sans-serif",fontSize:".85rem",fontWeight:500,cursor:"pointer"}}>🌷 Cheer Mode</button>
        <button onClick={()=>setMode("throw")} style={{flex:1,padding:"10px 8px",borderRadius:11,border:`1.5px solid ${mode==="throw"?"#FF5050":"rgba(0,0,0,.12)"}`,background:mode==="throw"?"rgba(255,80,80,.1)":"transparent",color:mode==="throw"?"#FF5050":"#666",fontFamily:"Poppins,sans-serif",fontSize:".85rem",fontWeight:500,cursor:"pointer"}}>🍅 Throw Mode</button>
      </div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {[["🌸 Flowers","flowers",4],["🌷 Burst!","confetti",10,"#D4649A"],["🍅 Tomato","tomato",1,"#FF5050"],["🥕 Veggie","veggie",1]].map(([lbl,type,n,col],i)=>(
          <button key={i} onClick={()=>multi(type,n)} style={{flex:1,minWidth:60,padding:"9px 8px",borderRadius:9,border:`0.5px solid ${col||"rgba(0,0,0,.12)"}`,background:"transparent",color:col||"#555",fontFamily:"Poppins,sans-serif",fontSize:".82rem",cursor:"pointer"}}>{lbl}</button>
        ))}
      </div>

      <div style={{display:"flex",gap:20,fontSize:".82rem",color:"#888",fontFamily:"Poppins,sans-serif"}}>
        <span>🌷 <strong style={{color:"#3D1A30"}}>{cheers}</strong> cheers</span>
        <span>🍅 <strong style={{color:"#3D1A30"}}>{throws}</strong> throws</span>
      </div>

      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes fadeInRuko {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseEmoji {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.25) rotate(8deg); }
        }
        @keyframes dotBounce {
          from { transform: translateY(0); opacity: .4; }
          to   { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
