"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FinalSection from "@/components/landing/FinalSection";
import HorizontalScroll from "@/components/landing/HorizontalScroll";
import StepsScroll from "@/components/landing/StepsScroll";
import MobileHorizontalScroll from "@/components/landing/MobileHorizontalScroll";
import MobileStepsScroll from "@/components/landing/MobileStepScroll";
import MobileFinalSection from "@/components/landing/MobileFinalSection";
import { WaitlistProvider, useWaitlist } from "@/contexts/WaitlistContext";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <WaitlistProvider isMobile={isMobile}>
      <HomeContent isMobile={isMobile} />
    </WaitlistProvider>
  );
}

function HomeContent({ isMobile }: { isMobile: boolean | null }) {
  const { openWaitlist } = useWaitlist();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobile = isMobile === true;

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
        <div
          className={`mx-auto flex items-center justify-between ${
            mobile ? "px-4 py-3" : "max-w-6xl px-6 py-4"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo-Clear.png"
            alt="Spin"
            className={mobile ? "h-7 w-auto" : "h-9 w-auto"}
          />
          <button
            onClick={openWaitlist}
            className={`bg-[#5B7FFF] text-white font-semibold rounded-full hover:bg-[#4A6EEE] transition-colors cursor-pointer ${
              mobile ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
            }`}
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/heropic2.png"
          alt="Cyclists riding together"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" />

        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full text-center ${
            mobile ? "px-5" : "px-6"
          }`}
        >
          <h1
            className={`font-bold text-white leading-tight drop-shadow-md ${
              mobile ? "text-3xl mb-3" : "text-4xl md:text-6xl lg:text-7xl mb-4"
            }`}
            style={{ fontFamily: SF }}
          >
            Riding is better together
          </h1>
          <p
            className={`text-white/90 drop-shadow max-w-xl ${
              mobile ? "text-base mb-6" : "text-lg md:text-xl mb-8"
            }`}
            style={{ fontFamily: SF }}
          >
            Spin makes it effortless to discover, plan, and join cycling rides
            with others.
          </p>
          <button
            onClick={openWaitlist}
            className={`bg-[#5B7FFF] text-white font-semibold rounded-full shadow-lg hover:bg-[#4A6EEE] transition-colors cursor-pointer ${
              mobile ? "px-6 py-3 text-sm" : "px-8 py-3.5 text-base"
            }`}
            style={{ fontFamily: SF }}
          >
            Join the waitlist
          </button>
        </div>
      </section>

      {/* ── About Spin ── */}
      <section
        className={`bg-white ${
          mobile ? "py-14 px-5" : "py-20 lg:py-28 px-6 lg:px-16"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <p
            className={`font-bold tracking-[0.2em] text-[#1A2B4A] uppercase italic ${
              mobile ? "text-[10px] mb-4" : "text-xs mb-6"
            }`}
            style={{ fontFamily: SF }}
          >
            About Spin
          </p>

          <h2
            ref={headingRef}
            className={`font-black uppercase leading-tight tracking-tight text-[#1A2B4A] max-w-5xl ${
              mobile
                ? "text-2xl mb-10"
                : "text-3xl md:text-5xl lg:text-6xl mb-16"
            }`}
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

          <div
            className={
              mobile
                ? "flex flex-col gap-6"
                : "flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
            }
          >
            <div
              className={mobile ? "w-full" : "w-full lg:w-1/2 flex-shrink-0"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/p1.png"
                alt="Two cyclists on a winding road"
                className={`w-full object-cover rounded-sm ${
                  mobile ? "h-[240px]" : "h-[380px] lg:h-[420px]"
                }`}
              />
            </div>
            <div
              className={
                mobile
                  ? "w-full"
                  : "w-full lg:w-1/2 flex items-end h-full lg:h-[420px]"
              }
            >
              <p
                className={`text-[#4A5568] leading-relaxed ${
                  mobile
                    ? "text-sm text-left"
                    : "text-base lg:text-lg text-justify"
                }`}
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

      {/* ── Cycling Made Social ── */}
      {isMobile === null ? null : mobile ? (
        <MobileHorizontalScroll />
      ) : (
        <HorizontalScroll />
      )}

      {/* ── Steps to Spin ── */}
      {isMobile === null ? null : mobile ? (
        <MobileStepsScroll />
      ) : (
        <StepsScroll />
      )}

      {/* ── Final Section ── */}
      {isMobile === null ? null : mobile ? (
        <MobileFinalSection />
      ) : (
        <FinalSection />
      )}

      {/* ── Footer ── */}
      <footer
        className={`bg-[#7A9AFF] text-white mt-10 ${
          mobile ? "py-8 px-5" : "py-12 px-6"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className={`flex items-center gap-6 ${
              mobile ? "flex-col" : "flex-col md:flex-row justify-between"
            }`}
          >
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Logo-Clear.png"
                alt="Spin"
                className={mobile ? "h-7 w-auto" : "h-9 w-auto"}
              />
              <span
                className={`font-bold ${mobile ? "text-lg" : "text-xl"}`}
                style={{ fontFamily: SF }}
              >
                Spin
              </span>
            </div>

            <div className="flex-col gap-6">
              <div className="flex gap-6 text-white/60 text-sm">
                <Link
                  href="https://www.instagram.com/hey.spin/"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </Link>
              </div>
              <div className="flex gap-6 text-white/60 text-sm">
                <Link
                  href="/spin_privacy_policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Privacy and Policy
                </Link>
              </div>
              <div className="flex gap-6 text-white/60 text-sm">
                <Link
                  href="/spin_terms_and_conditions.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </Link>
              </div>
            </div>
          </div>
          <div
            className={`border-t border-white/10 text-center text-white/40 ${
              mobile ? "mt-6 pt-6 text-xs" : "mt-8 pt-8 text-sm"
            }`}
          >
            © {new Date().getFullYear()} Spin. Made for cyclists who&apos;d
            rather not ride alone.
          </div>
        </div>
      </footer>
    </main>
  );
}
