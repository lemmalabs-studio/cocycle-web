import { useWaitlist } from "@/contexts/WaitlistContext";
import { useEffect, useRef } from "react";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const ITEMS: (
  | { type: "card"; title: string; body: string }
  | { type: "image"; src: string; alt: string }
)[] = [
  {
    type: "card",
    title: "Discover rides near you.",
    body: "Browse upcoming rides in your area. Filter by distance, pace, and ride type to find your perfect match.",
  },
  { type: "image", src: "/p2.png", alt: "Two cyclists on a winding road" },
  {
    type: "card",
    title: "Matched by level.",
    body: "See pace ranges upfront so you know what to expect. No more getting dropped or waiting around.",
  },
  { type: "image", src: "/p4.png", alt: "Cyclists in the countryside" },
  {
    type: "card",
    title: "Notify your friends.",
    body: "Let your network know you're heading out. Friends see your rides and can jump in with one tap.",
  },
  { type: "image", src: "/p3.png", alt: "Group cycling on a sunny day" },
];

export default function HorizontalScroll() {
  const { openWaitlist } = useWaitlist();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const totalScroll = wrapper.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScroll);
      const maxX = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(-${progress * maxX}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="features"
      ref={wrapperRef}
      style={{ height: `${ITEMS.length * 55}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white flex flex-col">
        <div className="pt-16 pb-6 text-center px-6 flex-shrink-0">
          <h2
            className="text-3xl md:text-5xl font-bold text-[#1A2B4A] mb-2"
            style={{ fontFamily: SF }}
          >
            Cycling Made Social.
          </h2>
          <p
            className="text-[#6B7A90] text-base md:text-lg"
            style={{ fontFamily: SF }}
          >
            Plan rides, find companions, and enjoy the journey together.
          </p>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-5"
            style={{
              width: "max-content",
              willChange: "transform",
              paddingLeft: "calc(30vw - 160px)", // centres the first card (half card width = ~160px)
            }}
          >
            {ITEMS.map((item, i) =>
              item.type === "card" ? (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 md:w-80 rounded-3xl p-8 flex flex-col justify-center gap-3"
                  style={{ background: "#5B7FFF", height: "400px" }}
                >
                  <h3
                    className="text-white text-3xl font-semibold mb-3 leading-snug"
                    style={{ fontFamily: SF }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-white/80 text-sm leading-relaxed"
                    style={{ fontFamily: SF }}
                  >
                    {item.body}
                  </p>
                </div>
              ) : (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-3xl overflow-hidden"
                  style={{ width: "300px", height: "H" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ),
            )}
            <div className="flex-shrink-0 w-16" />
          </div>
        </div>

        <div className="flex justify-center pb-5 flex-shrink-0">
          <button
            onClick={openWaitlist}
            className="bg-[#5B7FFF] text-white font-semibold px-10 py-3.5 rounded-full text-base shadow-lg cursor-pointer"
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </button>
        </div>
      </div>
    </section>
  );
}
