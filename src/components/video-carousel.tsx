import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type processType =
  | "video-end"
  | "video-reset"
  | "play"
  | "pause"
  | "video-last";

const VideoCarousel = () => {
  const videoRef = useRef<HTMLVideoElement[]>([]);
  const videoSpanRef = useRef<HTMLSpanElement[]>([]);
  const videoDivRef = useRef<HTMLSpanElement[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<
    SyntheticEvent<HTMLVideoElement, Event>[]
  >([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },

      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          isPlaying: true,
          startPlay: true,
        }));
      },
    });
  }, [videoId, isEnd]);

  // for playing the videos
  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current?.[videoId].pause();
      } else if (startPlay) {
        videoRef.current?.[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  // for the progess bar for a particular video
  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;

    if (span[videoId]) {
      const anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress != currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 1200 ? "10vw" : "4vw"
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });

            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime /
            hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handleProcess = (type: processType, i: number) => {
    switch (type) {
      case "video-end":
        setVideo((prev) => ({
          ...prev,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        setVideo((prev) => ({
          ...prev,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((prev) => ({
          ...prev,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
        break;
      case "pause":
        setVideo((prev) => ({
          ...prev,
          isPlaying: !prev.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="pr-10 sm:pr-20">
            <div className="video-carousel_container">
              <div className="w-full h-full overflow-hidden bg-black flex-center rounded-3xl">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  onEnded={() => {
                    return i === 3
                      ? handleProcess("video-last", i)
                      : handleProcess("video-end", i);
                  }}
                  ref={(el) => el && (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prev) => ({ ...prev, isPlaying: true }));
                  }}
                  onLoadedMetadata={(e) =>
                    setLoadedData((prev) => [...prev, e])
                  }
                  className={`${list.id === 2  && 'translate-x-44'} pointer-events-none`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="text-xl font-medium md:text-2xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-10 flex-center">
        <div className="py-5 bg-gray-300 rounded-full flex-center px-7 backdrop-blur">
          {videoRef.current?.map((_, i) => (
            <span
              key={i}
              ref={(el) => el && (videoDivRef.current[i] = el)}
              className="relative w-3 h-3 mx-2 bg-gray-200 rounded-full cursor-pointer"
            >
              <span
                ref={(el) => el && (videoSpanRef.current[i] = el)}
                className="absolute w-full h-full rounded-full"
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "Replay" : !isPlaying ? "Play" : "Pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset", videoId)
                : !isPlaying
                  ? () => handleProcess("play", videoId)
                  : () => handleProcess("pause", videoId)
            }
          />
        </button>
      </div>
    </>
  );
};
export default VideoCarousel;
