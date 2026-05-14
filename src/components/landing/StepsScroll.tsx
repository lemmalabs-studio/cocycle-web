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

// ─── Wheel-picker animation helper ───────────────────────────────────────────
// Each text element has two inner spans: .current and .next
// On step change: .current rotates up and fades out, .next rotates in from below

function wheelTransition(
  container: HTMLDivElement | null,
  newText: string,
  delay: number,
) {
  if (!container) return;
  const current = container.querySelector<HTMLSpanElement>(".wheel-current");
  const next = container.querySelector<HTMLSpanElement>(".wheel-next");
  if (!current || !next) return;

  // Set up the next text
  next.textContent = newText;

  // Reset next to starting position (below, rotated)
  next.style.transition = "none";
  next.style.transform = "translateY(70%) rotateX(-60deg)";
  next.style.opacity = "0";
  void next.offsetHeight; // force reflow

  // Animate current OUT (up + rotate)
  current.style.transition = `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.35s ease ${delay}ms`;
  current.style.transform = "translateY(-70%) rotateX(60deg)";
  current.style.opacity = "0";

  // Animate next IN
  next.style.transition = `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 60}ms, opacity 0.4s ease ${delay + 60}ms`;
  next.style.transform = "translateY(0) rotateX(0deg)";
  next.style.opacity = "1";

  // After animation, swap: next becomes current for the next transition
  setTimeout(() => {
    current.textContent = newText;
    current.style.transition = "none";
    current.style.transform = "translateY(0) rotateX(0deg)";
    current.style.opacity = "1";

    next.style.transition = "none";
    next.style.transform = "translateY(70%) rotateX(-60deg)";
    next.style.opacity = "0";
  }, 600 + delay);
}

export default function StepsScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgElRef = useRef<HTMLImageElement>(null);
  const activeStep = useRef(-1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Initial entrance
    const initialAnimate = () => {
      const step = STEPS[0];

      // Set initial text
      const numCurrent =
        numRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      const titleCurrent =
        titleRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      const bodyCurrent =
        bodyRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      if (numCurrent) numCurrent.textContent = step.num;
      if (titleCurrent) titleCurrent.textContent = step.title;
      if (bodyCurrent) bodyCurrent.textContent = step.body;

      // Fade in text elements
      [numRef.current, titleRef.current, bodyRef.current].forEach((el, i) => {
        if (!el) return;
        const current = el.querySelector<HTMLSpanElement>(".wheel-current");
        if (!current) return;
        current.style.transition = "none";
        current.style.transform = "translateY(40px) rotateX(-30deg)";
        current.style.opacity = "0";
        void current.offsetHeight;
        current.style.transition = `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms, opacity 0.5s ease ${i * 100}ms`;
        current.style.transform = "translateY(0) rotateX(0deg)";
        current.style.opacity = "1";
      });

      // Card slide up
      if (cardRef.current) {
        cardRef.current.style.transition = "none";
        cardRef.current.style.transform = "translateY(120%)";
        cardRef.current.style.opacity = "0";
        void cardRef.current.offsetHeight;
        cardRef.current.style.transition =
          "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 150ms, opacity 0.5s ease 150ms";
        cardRef.current.style.transform = "translateY(0)";
        cardRef.current.style.opacity = "1";
      }

      if (imgElRef.current) imgElRef.current.src = step.img;
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
        const isFirstLoad = activeStep.current === -1;
        activeStep.current = stepIndex;
        const step = STEPS[stepIndex];

        // Update dots
        STEPS.forEach((_, i) => {
          const dot = document.getElementById(`step-dot-${i}`);
          if (dot) {
            dot.style.background = i === stepIndex ? "#5B7FFF" : "#E5E9F0";
            dot.style.width = i === stepIndex ? "40px" : "24px";
          }
        });

        if (isFirstLoad) {
          initialAnimate();
          return;
        }

        // Wheel-picker transitions with staggered delays
        wheelTransition(numRef.current, step.num, 0);
        wheelTransition(titleRef.current, step.title, 80);
        wheelTransition(bodyRef.current, step.body, 160);

        // Card: slide out down, swap image, slide in from below
        if (cardRef.current && imgElRef.current) {
          const card = cardRef.current;
          const img = imgElRef.current;

          // Slide out
          card.style.transition =
            "transform 0.35s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.25s ease";
          card.style.transform = "translateY(30%) scale(0.95)";
          card.style.opacity = "0";

          setTimeout(() => {
            img.src = step.img;

            // Reset below
            card.style.transition = "none";
            card.style.transform = "translateY(100%)";
            card.style.opacity = "0";
            void card.offsetHeight;

            // Slide in
            card.style.transition =
              "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease";
            card.style.transform = "translateY(0) scale(1)";
            card.style.opacity = "1";
          }, 350);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Shared style for the wheel containers
  const wheelContainerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    perspective: "600px",
  };

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${STEPS.length * 150}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen bg-white overflow-hidden flex flex-col justify-center">
        <div className="max-w-6xl mx-auto w-full px-8 lg:px-16">
          <p
            className="text-xs font-bold tracking-[0.2em] uppercase mt-20 italic text-[#6B7A90]"
            style={{ fontFamily: SF }}
          >
            Steps to Spin
          </p>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* ── Left: Text with wheel-picker ── */}
            <div className="flex-1 min-w-0">
              {/* Step number */}
              <div
                ref={numRef}
                className="text-5xl lg:text-7xl font-black text-[#1A2B4A] mb-2"
                style={{ ...wheelContainerStyle, fontFamily: SF }}
              >
                <span className="wheel-current block">{STEPS[0].num}</span>
                <span
                  className="wheel-next block"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    opacity: 0,
                    transform: "translateY(70%) rotateX(-60deg)",
                  }}
                />
              </div>

              {/* Step title */}
              <div
                ref={titleRef}
                className="text-2xl lg:text-4xl font-black italic uppercase text-[#1A2B4A] mb-8 leading-tight"
                style={{ ...wheelContainerStyle, fontFamily: SF }}
              >
                <span className="wheel-current block">{STEPS[0].title}</span>
                <span
                  className="wheel-next block"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    opacity: 0,
                    transform: "translateY(70%) rotateX(-60deg)",
                  }}
                />
              </div>

              {/* Step body */}
              <div
                ref={bodyRef}
                className="text-[#6B7A90] text-base lg:text-lg leading-relaxed max-w-md"
                style={{ ...wheelContainerStyle, fontFamily: SF }}
              >
                <span className="wheel-current block">{STEPS[0].body}</span>
                <span
                  className="wheel-next block"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    opacity: 0,
                    transform: "translateY(70%) rotateX(-60deg)",
                  }}
                />
              </div>

              {/* Dots */}
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

            {/* ── Right: Phone card ── */}
            <div className="flex-shrink-0 flex items-center justify-center overflow-hidden">
              <div ref={cardRef} style={{ opacity: 0 }}>
                <div
                  className="relative"
                  style={{
                    width: "280px",
                    height: "570px",
                  }}
                >
                  {/* Outer shell — titanium-style frame */}
                  <div
                    className="absolute inset-0 rounded-[3rem]"
                    style={{
                      background:
                        "linear-gradient(145deg, #2A2A2E 0%, #1C1C1E 50%, #2A2A2E 100%)",
                        
                    }}
                  />

                  {/* Side buttons — left */}
                  {/* Silent toggle */}
                  <div
                    className="absolute"
                    style={{
                      left: "-2px",
                      top: "100px",
                      width: "3px",
                      height: "18px",
                      background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                      borderRadius: "2px 0 0 2px",
                      boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                    }}
                  />
                  {/* Volume up */}
                  <div
                    className="absolute"
                    style={{
                      left: "-2px",
                      top: "140px",
                      width: "3px",
                      height: "32px",
                      background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                      borderRadius: "2px 0 0 2px",
                      boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                    }}
                  />
                  {/* Volume down */}
                  <div
                    className="absolute"
                    style={{
                      left: "-2px",
                      top: "180px",
                      width: "3px",
                      height: "32px",
                      background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                      borderRadius: "2px 0 0 2px",
                      boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Side button — right (power) */}
                  <div
                    className="absolute"
                    style={{
                      right: "-2px",
                      top: "155px",
                      width: "3px",
                      height: "40px",
                      background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                      borderRadius: "0 2px 2px 0",
                      boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
                    }}
                  />

                  {/* Inner bezel */}
                  <div
                    className="absolute rounded-[2.6rem] overflow-hidden"
                    style={{
                      top: "8px",
                      left: "8px",
                      right: "8px",
                      bottom: "8px",
                      background: "#000",
                    }}
                  >
                    {/* Screen */}
                    <div className="relative w-full h-full overflow-hidden rounded-[2.2rem]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imgElRef}
                        src="/proto-1.png"
                        alt="App screen"
                        className="w-full h-full object-cover"
                      />

                      {/* Dynamic Island */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{
                          top: "10px",
                          width: "90px",
                          height: "25px",
                          background: "#000",
                          borderRadius: "20px",
                        }}
                      />

                      {/* Status bar glass effect */}
                      <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                          height: "44px",
                          background:
                            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)",
                          pointerEvents: "none",
                        }}
                      />

                      {/* Home indicator */}
                      <div
                        className="absolute bottom-2 left-1/2 -translate-x-1/2"
                        style={{
                          width: "100px",
                          height: "4px",
                          background: "rgba(255,255,255,0.25)",
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </div>

                  {/* Screen edge highlight */}
                  <div
                    className="absolute rounded-[2.6rem] pointer-events-none"
                    style={{
                      top: "8px",
                      left: "8px",
                      right: "8px",
                      bottom: "8px",
                      boxShadow: "0 0 0 0.5px rgba(255,255,255,0.1) inset",
                    }}
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
