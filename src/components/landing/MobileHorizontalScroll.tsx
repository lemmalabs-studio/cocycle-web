import { useEffect, useRef } from "react";
import { useWaitlist } from "@/contexts/WaitlistContext";

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

export default function MobileHorizontalScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { openWaitlist } = useWaitlist();

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
      id="features-mobile"
      ref={wrapperRef}
      style={{ height: `${ITEMS.length * 80}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white flex flex-col">
        <div className="pt-12 pb-4 text-center px-5 flex-shrink-0">
          <h2
            className="text-2xl font-bold text-[#1A2B4A] mb-1"
            style={{ fontFamily: SF }}
          >
            Cycling Made Social.
          </h2>
          <p
            className="text-[#6B7A90] text-sm"
            style={{ fontFamily: SF }}
          >
            Plan rides, find companions, and enjoy the journey together.
          </p>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-3"
            style={{
              width: "max-content",
              willChange: "transform",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {ITEMS.map((item, i) =>
              item.type === "card" ? (
                <div
                  key={i}
                  className="flex-shrink-0 rounded-2xl p-6 flex flex-col justify-center gap-2"
                  style={{
                    background: "#5B7FFF",
                    width: "260px",
                    height: "340px",
                  }}
                >
                  <h3
                    className="text-white text-2xl font-semibold mb-2 leading-snug"
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
                  className="flex-shrink-0 rounded-2xl overflow-hidden"
                  style={{ width: "240px", height: "340px" }}
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
            <div className="flex-shrink-0 w-5" />
          </div>
        </div>

        <div className="flex justify-center pb-5 flex-shrink-0">
          <button
            onClick={openWaitlist}
            className="bg-[#5B7FFF] text-white font-semibold px-8 py-3 rounded-full text-sm cursor-pointer shadow-lg hover:bg-[#4A6EEE] transition-colors"
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </button>
        </div>
      </div>
    </section>
  );
}