import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    let raf;
    const animate = (time) => { lenis.raf(time); raf = requestAnimationFrame(animate); };
    raf = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return lenisRef;
}
