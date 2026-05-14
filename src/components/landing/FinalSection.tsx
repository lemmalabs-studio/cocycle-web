import { useEffect, useRef, useCallback } from "react";
import { useWaitlist } from "@/contexts/WaitlistContext";

const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif';

// Split text into individually-addressable spans
const LETTERS = "TIME TO SPIN".split("");

export default function FinalSection() {
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

    // Image grows from 25% → 100%
    const scale = 0.25 + progress * 0.75;
    imgDiv.style.width = `${scale * 100}%`;
    imgDiv.style.height = `${scale * 100}%`;

    // Border radius 24px → 0px
    const radius = Math.max(0, 24 - progress * 60);
    const imgEl = imgDiv.querySelector("img");
    if (imgEl) imgEl.style.borderRadius = `${radius}px`;
    overlay.style.borderRadius = `${radius}px`;

    // Overlay sizing must match the image container
    overlay.style.width = `${scale * 100}%`;
    overlay.style.height = `${scale * 100}%`;

    // Overlay opacity: 0 → 0.45 (lighter so image stays visible)
    overlay.style.opacity = String(Math.min(0.45, progress * 0.1));

    // --- Per-letter color logic ---
    // Get image bounding rect
    const imgRect = imgDiv.getBoundingClientRect();

    letterRefs.current.forEach((span) => {
      if (!span) return;
      const letterRect = span.getBoundingClientRect();

      // Use a tighter inset (30%) so the letter needs to be well inside
      // the image before flipping — not just barely overlapping
      const insetX = letterRect.width * 0.3;
      const insetY = letterRect.height * 0.3;

      const overImage =
        letterRect.left + insetX >= imgRect.left &&
        letterRect.right - insetX <= imgRect.right &&
        letterRect.top + insetY >= imgRect.top &&
        letterRect.bottom - insetY <= imgRect.bottom;

      // If the letter overlaps the image (which has the dark overlay),
      // make it white. Otherwise keep it black (on white bg).
      span.style.color = overImage ? "#ffffff" : "#000000";
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(onScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen for resize since layout changes affect rects
    window.addEventListener("resize", handleScroll, { passive: true });
    onScroll(); // initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  return (
    <section ref={wrapperRef} style={{ height: "300vh" }} className="relative">
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Expanding image container */}
        <div
          ref={imgRef}
          style={{
            position: "absolute",
            width: "25%",
            height: "25%",
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
              borderRadius: "24px",
              display: "block",
            }}
          />
        </div>

        {/* Dark overlay — matches image size exactly */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            width: "25%",
            height: "25%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.85)",
            borderRadius: "24px",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 5,
          }}
        />

        {/* Text layer — per-letter spans */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <h2
            className="font-black uppercase leading-none select-none"
            style={{
              fontFamily: SF,
              fontSize: "clamp(5rem, 14vw, 13rem)",
              letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}
          >
            {LETTERS.map((char, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                style={{
                  color: "#000000",
                  transition: "color 0.15s ease",
                  display: "inline-block",
                  // Preserve space characters
                  ...(char === " " ? { width: "0.3em" } : {}),
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
          <div style={{ marginTop: "2rem", pointerEvents: "auto" }}>
            <button
              onClick={openWaitlist}
              className="bg-[#5B7FFF] text-white font-semibold px-8 py-3.5 rounded-full text-base cursor-default shadow-lg cursor-pointer"
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
