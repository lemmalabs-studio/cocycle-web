import { useEffect, useRef } from "react";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

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

function wheelTransition(
  container: HTMLDivElement | null,
  newText: string,
  delay: number,
) {
  if (!container) return;
  const current = container.querySelector<HTMLSpanElement>(".wheel-current");
  const next = container.querySelector<HTMLSpanElement>(".wheel-next");
  if (!current || !next) return;

  next.textContent = newText;

  next.style.transition = "none";
  next.style.transform = "translateY(70%) rotateX(-60deg)";
  next.style.opacity = "0";
  void next.offsetHeight;

  current.style.transition = `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.35s ease ${delay}ms`;
  current.style.transform = "translateY(-70%) rotateX(60deg)";
  current.style.opacity = "0";

  next.style.transition = `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 60}ms, opacity 0.4s ease ${delay + 60}ms`;
  next.style.transform = "translateY(0) rotateX(0deg)";
  next.style.opacity = "1";

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

export default function MobileStepsScroll() {
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

    const initialAnimate = () => {
      const step = STEPS[0];

      const numCurrent =
        numRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      const titleCurrent =
        titleRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      const bodyCurrent =
        bodyRef.current?.querySelector<HTMLSpanElement>(".wheel-current");
      if (numCurrent) numCurrent.textContent = step.num;
      if (titleCurrent) titleCurrent.textContent = step.title;
      if (bodyCurrent) bodyCurrent.textContent = step.body;

      [numRef.current, titleRef.current, bodyRef.current].forEach((el, i) => {
        if (!el) return;
        const current = el.querySelector<HTMLSpanElement>(".wheel-current");
        if (!current) return;
        current.style.transition = "none";
        current.style.transform = "translateY(30px) rotateX(-30deg)";
        current.style.opacity = "0";
        void current.offsetHeight;
        current.style.transition = `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, opacity 0.5s ease ${i * 80}ms`;
        current.style.transform = "translateY(0) rotateX(0deg)";
        current.style.opacity = "1";
      });

      if (cardRef.current) {
        cardRef.current.style.transition = "none";
        cardRef.current.style.transform = "translateY(100%)";
        cardRef.current.style.opacity = "0";
        void cardRef.current.offsetHeight;
        cardRef.current.style.transition =
          "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 100ms, opacity 0.5s ease 100ms";
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

        STEPS.forEach((_, i) => {
          const dot = document.getElementById(`mobile-step-dot-${i}`);
          if (dot) {
            dot.style.background = i === stepIndex ? "#5B7FFF" : "#E5E9F0";
            dot.style.width = i === stepIndex ? "32px" : "20px";
          }
        });

        if (isFirstLoad) {
          initialAnimate();
          return;
        }

        wheelTransition(numRef.current, step.num, 0);
        wheelTransition(titleRef.current, step.title, 60);
        wheelTransition(bodyRef.current, step.body, 120);

        if (cardRef.current && imgElRef.current) {
          const card = cardRef.current;
          const img = imgElRef.current;

          card.style.transition =
            "transform 0.3s cubic-bezier(0.55, 0, 1, 0.45), opacity 0.2s ease";
          card.style.transform = "translateY(20%) scale(0.95)";
          card.style.opacity = "0";

          setTimeout(() => {
            img.src = step.img;
            card.style.transition = "none";
            card.style.transform = "translateY(80%)";
            card.style.opacity = "0";
            void card.offsetHeight;
            card.style.transition =
              "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease";
            card.style.transform = "translateY(0) scale(1)";
            card.style.opacity = "1";
          }, 300);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wheelContainerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    perspective: "600px",
  };

  const wheelNextStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    opacity: 0,
    transform: "translateY(70%) rotateX(-60deg)",
  };

  return (
    <section
      ref={wrapperRef}
      style={{ height: `${STEPS.length * 150}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen bg-white overflow-hidden flex flex-col">
        {/* Label */}
        <div className="px-5 pt-14 pb-2">
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase italic text-[#6B7A90]"
            style={{ fontFamily: SF }}
          >
            Steps to Spin
          </p>
        </div>

        {/* Text section */}
        <div className="px-5 flex-shrink-0">
          <div
            ref={numRef}
            className="text-4xl font-black text-[#1A2B4A] mb-1"
            style={{ ...wheelContainerStyle, fontFamily: SF }}
          >
            <span className="wheel-current block">{STEPS[0].num}</span>
            <span className="wheel-next block" style={wheelNextStyle} />
          </div>

          <div
            ref={titleRef}
            className="text-xl font-black italic uppercase text-[#1A2B4A] mb-3 leading-tight"
            style={{ ...wheelContainerStyle, fontFamily: SF }}
          >
            <span className="wheel-current block">{STEPS[0].title}</span>
            <span className="wheel-next block" style={wheelNextStyle} />
          </div>

          <div
            ref={bodyRef}
            className="text-[#6B7A90] text-sm leading-relaxed"
            style={{
              ...wheelContainerStyle,
              fontFamily: SF,
              minHeight: "60px",
            }}
          >
            <span className="wheel-current block">{STEPS[0].body}</span>
            <span className="wheel-next block" style={wheelNextStyle} />
          </div>

          {/* Dots */}
          <div className="flex gap-1.5 mt-5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                id={`mobile-step-dot-${i}`}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: "20px", background: "#E5E9F0" }}
              />
            ))}
          </div>
        </div>

        {/* Phone card — centered below text */}
        <div className="flex-1 flex items-center justify-center overflow-hidden px-5 pb-6">
          <div ref={cardRef} style={{ opacity: 0 }}>
            <div
              className="relative"
              style={{
                width: "200px",
                height: "408px",
              }}
            >
              {/* Outer shell */}
              <div
                className="absolute inset-0 rounded-[2.2rem]"
                style={{
                  background:
                    "linear-gradient(145deg, #2A2A2E 0%, #1C1C1E 50%, #2A2A2E 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.08) inset, " +
                    "0 20px 50px rgba(0,0,0,0.25), " +
                    "0 6px 16px rgba(0,0,0,0.15)",
                }}
              />

              {/* Side buttons — left */}
              <div
                className="absolute"
                style={{
                  left: "-1.5px",
                  top: "72px",
                  width: "2.5px",
                  height: "14px",
                  background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                  borderRadius: "2px 0 0 2px",
                  boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="absolute"
                style={{
                  left: "-1.5px",
                  top: "100px",
                  width: "2.5px",
                  height: "24px",
                  background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                  borderRadius: "2px 0 0 2px",
                  boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                }}
              />
              <div
                className="absolute"
                style={{
                  left: "-1.5px",
                  top: "130px",
                  width: "2.5px",
                  height: "24px",
                  background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                  borderRadius: "2px 0 0 2px",
                  boxShadow: "-1px 0 2px rgba(0,0,0,0.3)",
                }}
              />

              {/* Side button — right */}
              <div
                className="absolute"
                style={{
                  right: "-1.5px",
                  top: "112px",
                  width: "2.5px",
                  height: "30px",
                  background: "linear-gradient(180deg, #3A3A3C, #2C2C2E)",
                  borderRadius: "0 2px 2px 0",
                  boxShadow: "1px 0 2px rgba(0,0,0,0.3)",
                }}
              />

              {/* Inner bezel */}
              <div
                className="absolute rounded-[1.85rem] overflow-hidden"
                style={{
                  top: "6px",
                  left: "6px",
                  right: "6px",
                  bottom: "6px",
                  background: "#000",
                }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-[1.6rem]">
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
                      top: "7px",
                      width: "64px",
                      height: "18px",
                      background: "#000",
                      borderRadius: "14px",
                    }}
                  />

                  {/* Home indicator */}
                  <div
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2"
                    style={{
                      width: "72px",
                      height: "3px",
                      background: "rgba(255,255,255,0.25)",
                      borderRadius: "2px",
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
