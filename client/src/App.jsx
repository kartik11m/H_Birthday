import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "./hooks/useLenis";
import LoadingScreen   from "./components/LoadingScreen/LoadingScreen";
import HeroSection     from "./components/CharacterScene/HeroSection";
import CelebrationCutouts from "./components/CelebrationCutouts/CelebrationCutouts";
import TimelineSection from "./components/Timeline/TimelineSection";
import ParallaxCelebration from "./components/ParallaxCelebration/ParallaxCelebration";
import PolaroidSection from "./components/Polaroid/PolaroidSection";
import WishingStars    from "./components/WishingStars/WishingStars";
import MessageCarousel from "./components/MessageCarousel/MessageCarousel";
import BirthdayLetter  from "./components/BirthdayLetter/BirthdayLetter";
import CakeBlowing     from "./components/CakeBlowing/CakeBlowing";
import PartyVibes      from "./components/PartyVibes/PartyVibes";
import StarryNight     from "./components/DarshanSection/StarryNight";
import DarshanSection  from "./components/DarshanSection/DarshanSection";
import FinalScreen     from "./components/FinalScreen/FinalScreen";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loading, setLoading] = useState(true);
  useLenis();

  return (
    <main>
      {loading && <LoadingScreen onEnter={() => setLoading(false)} />}
      {!loading && (
        <div className="birthday-journey">
          <HeroSection />
          <CakeBlowing />
          <WishingStars />
          <CelebrationCutouts />
          {/* <TimelineSection /> */}
          <ParallaxCelebration />
          <PolaroidSection />
          <MessageCarousel />
          <BirthdayLetter />     
          <PartyVibes />
          <StarryNight />
          <DarshanSection />
          <FinalScreen />
        </div>
      )}
    </main>
  );
}
