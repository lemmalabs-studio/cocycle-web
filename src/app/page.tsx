"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import FinalSection from "@/components/landing/FinalSection";
import HorizontalScroll from "@/components/landing/HorizontalScroll";
import StepsScroll from "@/components/landing/StepsScroll";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const spans = Array.from(
      el.querySelectorAll<HTMLSpanElement>(".reveal-word"),
    );
    const total = spans.length;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = 1 - rect.top / windowH;
      const clamped = Math.max(0, Math.min(1, progress));

      spans.forEach((span, i) => {
        const wordProgress = clamped * total - i;
        const opacity = Math.max(0.15, Math.min(1, wordProgress));
        span.style.opacity = String(opacity);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navbar: show after scrolling 90% of hero
  useEffect(() => {
    const hero = heroRef.current;
    const nav = navRef.current;
    if (!hero || !nav) return;

    const onScroll = () => {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const threshold = heroBottom * 0.9;
      const show = window.scrollY >= threshold;

      nav.style.opacity = show ? "1" : "0";
      nav.style.pointerEvents = show ? "auto" : "none";
      nav.style.transform = show ? "translateY(0)" : "translateY(-8px)";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* ── Sticky Navbar (appears after 90% hero scroll) ── */}
      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          opacity: 0,
          pointerEvents: "none",
          transform: "translateY(-8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo-Clear.png" alt="Spin" className="h-9 w-auto" />
          <a
            href="#download"
            className="bg-[#5B7FFF] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#4A6EEE] transition-colors text-sm"
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/heropic.png"
          alt="Cyclists riding together"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-md"
            style={{ fontFamily: SF }}
          >
            Riding is better together
          </h1>
          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-xl drop-shadow"
            style={{ fontFamily: SF }}
          >
            Spin makes it effortless to discover, plan, and join cycling rides
            with others.
          </p>
          <button
            disabled
            className="bg-[#5B7FFF] text-white font-semibold px-8 py-3.5 rounded-full text-base cursor-default opacity-90 shadow-lg"
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </button>
        </div>
      </section>

      {/* ── About Spin ── */}
      <section className="bg-white py-20 lg:py-28 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <p
            className="text-xs font-bold tracking-[0.2em] text-[#1A2B4A] uppercase mb-6 italic"
            style={{ fontFamily: SF }}
          >
            About Spin
          </p>

          <h2
            ref={headingRef}
            className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight text-[#1A2B4A] mb-16 max-w-5xl"
            style={{ fontFamily: SF }}
          >
            {[
              "NO",
              "MORE",
              "RIDING",
              "ALONE",
              "BY",
              "ACCIDENT.",
              "WE",
              "ARE",
              "BUILDING",
              "AN",
              "OPEN",
              "ROAD",
              "FOR",
              "EVERYONE.",
            ].map((word, i) => (
              <span
                key={i}
                className="reveal-word inline-block mr-[0.3em]"
                style={{ opacity: 0.15 }}
              >
                {word}
              </span>
            ))}
          </h2>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="w-full lg:w-1/2 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/p1.png"
                alt="Two cyclists on a winding road"
                className="w-full h-[380px] lg:h-[420px] object-cover rounded-sm"
              />
            </div>
            <div className="w-full lg:w-1/2 flex items-end h-full lg:h-[420px]">
              <p
                className="text-[#4A5568] text-base lg:text-lg leading-relaxed text-justify"
                style={{ fontFamily: SF }}
              >
                Group rides shouldn&apos;t be locked behind private chats or
                intimidating club schedules. Spin is a dedicated platform built
                for real lives and real schedules, prioritising ride discovery
                as the primary experience. We encourage safer, more social
                cycling by ensuring every rider knows exactly what to expect
                before they ever clip in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cycling Made Social — Horizontal Scroll ── */}
      <HorizontalScroll />

      {/* ── Steps to Spin ── */}
      <StepsScroll />

      {/* ── Positioning ── */}
      <FinalSection />

      {/* ── Footer ── */}
      <footer className="bg-[#7A9AFF] text-white py-12 px-6 mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/Logo-Clear.png" alt="Spin" className="h-9 w-auto" />
              <span className="text-xl font-bold" style={{ fontFamily: SF }}>
                Spin
              </span>
            </div>
            <div className="flex gap-6 text-white/60 text-sm">
              <Link
                href="https://www.instagram.com/hey.spin/"
                className="hover:text-white transition-colors"
              >
                Instagram
              </Link>
              {/* <Link href="#" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link> */}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} Spin. Made for cyclists who&apos;d
            rather not ride alone.
          </div>
        </div>
      </footer>
    </main>
  );
}
