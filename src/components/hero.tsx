import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { heroVideo, smallHeroVideo } from "../utils";

const Hero = () => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  const handleVideoSrc = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo);
    } else {
      setVideoSrc(heroVideo);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrc);

    return () => window.removeEventListener("resize", handleVideoSrc);
  }, []);
  useGSAP(() => {
    gsap.to("#hero", {
      opacity: 1,
      delay: 2,
    });

    gsap.to("#cta", {
      y: -50 ,
      opacity: 1,
      delay: 2,
    });
  }, []);
  return (
    <section className="relative w-full bg-black nav-height">
      <div className="flex-col w-full h-5/6 flex-center">
        <p id="hero" className="hero-title">
          iPhone 16 Pro
        </p>
        <div className="w-9/12 md:w-10/12">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            playsInline={true}
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div
        id="cta"
        className="flex flex-col items-center translate-y-20 opacity-0"
      >
        <a href="#highlights" className="btn">
          Buy
        </a>
        <p className="text-xl font-normal">From $199/ month or $999</p>
      </div>
    </section>
  );
};
export default Hero;
