import * as THREE from "three";


export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: React.MutableRefObject<THREE.Group<THREE.Object3DEventMap>>,
  rotationState: number,
  fromSelector: string,
  toSelector: string,
  animationProps: {
    transform: string;
    duration: number;
    [key: string]: any;
  }
) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    fromSelector,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );

  timeline.to(
    toSelector,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<"
  );
};
