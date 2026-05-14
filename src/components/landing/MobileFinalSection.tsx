import { useEffect, useRef, useCallback } from "react";
import { useWaitlist } from "@/contexts/WaitlistContext";

const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif';

const LETTERS = "TIME TO SPIN".split("");



export default function MobileFinalSection() {
  const { openWaitlist } = useWaitlist();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const onScroll = useCallback(() => {
    const wrapper = wrapperRef.current;
    const imgDiv = imgRef.current;
    const overlay = overlayRef.current;
    if (!wrapper || !imgDiv || !overlay) return;

    const rect = wrapper.getBoundingClientRect();
    const totalScroll = wrapper.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / totalScroll);

    // Image grows from 30% → 100% (start bigger on mobile)
    const scale = 0.3 + progress * 0.7;
    imgDiv.style.width = `${scale * 100}%`;
    imgDiv.style.height = `${scale * 100}%`;

    const radius = Math.max(0, 20 - progress * 50);
    const imgEl = imgDiv.querySelector("img");
    if (imgEl) imgEl.style.borderRadius = `${radius}px`;
    overlay.style.borderRadius = `${radius}px`;

    overlay.style.width = `${scale * 100}%`;
    overlay.style.height = `${scale * 100}%`;

    overlay.style.opacity = String(Math.min(0.45, progress * 0.8));

    const imgRect = imgDiv.getBoundingClientRect();

    letterRefs.current.forEach((span) => {
      if (!span) return;
      const letterRect = span.getBoundingClientRect();

      const insetX = letterRect.width * 0.25;
      const insetY = letterRect.height * 0.25;

      const overImage =
        letterRect.left + insetX >= imgRect.left &&
        letterRect.right - insetX <= imgRect.right &&
        letterRect.top + insetY >= imgRect.top &&
        letterRect.bottom - insetY <= imgRect.bottom;

      span.style.color = overImage ? "#ffffff" : "#000000";
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  return (
    <section ref={wrapperRef} style={{ height: "250vh" }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Expanding image */}
        <div
          ref={imgRef}
          style={{
            position: "absolute",
            width: "30%",
            height: "30%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/last-pic.png"
            alt="Time to Spin"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px",
              display: "block",
            }}
          />
        </div>

        {/* Dark overlay */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            width: "30%",
            height: "30%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.85)",
            borderRadius: "20px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Text */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            pointerEvents: "none",
            padding: "0 12px",
          }}
        >
          <h2
            className="font-black uppercase leading-none select-none"
            style={{
              fontFamily: SF,
              fontSize: "clamp(2.8rem, 13vw, 5rem)",
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            {LETTERS.map((char, i) => (
              <span
                key={i}
                ref={(el) => { letterRefs.current[i] = el; }}
                style={{
                  color: "#000000",
                  transition: "color 0.15s ease",
                  display: "inline-block",
                  ...(char === " " ? { width: "0.25em" } : {}),
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <div style={{ marginTop: "1.5rem", pointerEvents: "auto" }}>
            <button
              onClick={openWaitlist}
              className="bg-[#5B7FFF] text-white font-semibold px-6 py-3 rounded-full text-sm cursor-pointer shadow-lg hover:bg-[#4A6EEE] transition-colors"
              style={{ fontFamily: SF }}
            >
              Join the waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}