import Link from "next/link";
import { useEffect, useRef } from "react";


const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// ─── Steps Data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01/",
    title: "BROWSE THROUGH RIDES",
    body: "Browse upcoming rides in your area. Filter by distance, pace, and ride type to find your perfect match.",
    img: "/proto-1.png",
  },
  {
    num: "02/",
    title: "JOIN IN ONE TAP",
    body: "See who's going, check their pace and level, then join with a single tap. No group chats, no back-and-forth.",
    img: "/proto-2.png",
  },
  {
    num: "03/",
    title: "RIDE & CONNECT",
    body: "Meet at the start, ride together, and finish at a café. The social part is already built in.",
    img: "/proto-3.png",
  },
  {
    num: "04/",
    title: "BUILD YOUR CREW",
    body: "Follow riders you click with. They'll see your future rides and you'll see theirs — your crew builds itself.",
    img: "/proto-4.png",
  },
];


export default function StepsScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stepNumRef = useRef<HTMLDivElement>(null);
  const stepTitleRef = useRef<HTMLDivElement>(null);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const activeStep = useRef(-1);
  const imgElRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const animateIn = () => {
      const targets = [
        stepNumRef.current,
        stepTitleRef.current,
        stepBodyRef.current,
        imgRef.current,
      ];
      targets.forEach((el, i) => {
        if (!el) return;
        el.style.transition = "none";
        el.style.opacity = "0";
        el.style.transform = "translateY(40px)";
        void (el as HTMLElement).offsetHeight;
        el.style.transition = `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    };

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const totalScroll = wrapper.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalScroll);
      const stepIndex = Math.min(
        STEPS.length - 1,
        Math.floor(progress * STEPS.length),
      );

      if (stepIndex !== activeStep.current) {
        activeStep.current = stepIndex;
        const step = STEPS[stepIndex];

        if (stepNumRef.current) stepNumRef.current.textContent = step.num;
        if (stepTitleRef.current) stepTitleRef.current.textContent = step.title;
        if (stepBodyRef.current) stepBodyRef.current.textContent = step.body;

        STEPS.forEach((_, i) => {
          const dot = document.getElementById(`step-dot-${i}`);
          if (dot) {
            dot.style.background = i === stepIndex ? "#5B7FFF" : "#E5E9F0";
            dot.style.width = i === stepIndex ? "40px" : "24px";
          }
        });

        animateIn();
        if (imgElRef.current) imgElRef.current.src = step.img;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${STEPS.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen bg-white overflow-hidden flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full px-8 lg:px-16">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mb-8 italic text-[#6B7A90]"
            style={{ fontFamily: SF }}
          >
            Steps to Spin
          </p>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1 min-w-0">
              <div
                ref={stepNumRef}
                className="text-5xl lg:text-7xl font-black text-[#1A2B4A] mb-2"
                style={{ fontFamily: SF, opacity: 0 }}
              >
                {STEPS[0].num}
              </div>
              <div
                ref={stepTitleRef}
                className="text-2xl lg:text-4xl font-black italic uppercase text-[#1A2B4A] mb-8 leading-tight"
                style={{ fontFamily: SF, opacity: 0 }}
              >
                {STEPS[0].title}
              </div>
              <div
                ref={stepBodyRef}
                className="text-[#6B7A90] text-base lg:text-lg leading-relaxed max-w-md"
                style={{ fontFamily: SF, opacity: 0 }}
              >
                {STEPS[0].body}
              </div>

              <div className="flex gap-2 mt-12">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    id={`step-dot-${i}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: "24px", background: "#E5E9F0" }}
                  />
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center">
              <div ref={imgRef} style={{ opacity: 0 }}>
                <div
                  className="relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                  style={{
                    width: "280px",
                    height: "560px",
                    background: "#5B7FFF",
                    padding: "12px",
                  }}
                >
                  <img
                    ref={imgElRef}
                    src="/proto-1.png"
                    alt="App screen"
                    className="w-full h-full object-cover rounded-[2rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}