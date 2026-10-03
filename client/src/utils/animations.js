import gsap from "gsap";

export const fadeUp = (el, delay = 0) =>
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", delay }
  );

export const revealFromLeft = (el, delay = 0) =>
  gsap.fromTo(el,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.85, ease: "power2.out", delay }
  );

export const revealFromRight = (el, delay = 0) =>
  gsap.fromTo(el,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 0.85, ease: "power2.out", delay }
  );

export const popIn = (el, delay = 0) =>
  gsap.fromTo(el,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.7)", delay }
  );

export const staggerFadeUp = (els, staggerAmt = 0.12, delay = 0) =>
  gsap.fromTo(els,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: staggerAmt, delay }
  );
