"use client";

import { waitlistApi } from "@/services/api";
import { useEffect, useRef, useState, useCallback } from "react";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// ─── Mapbox Geocoding for global city search ───────────────────────────────────
// Replace with your Mapbox public token (same one used for maps in-app)
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN";

interface CityResult {
  id: string;
  name: string; // e.g. "Brisbane"
  region: string; // e.g. "Queensland, Australia"
  fullName: string; // e.g. "Brisbane, Queensland, Australia"
}

async function searchCities(query: string): Promise<CityResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&limit=6&access_token=${MAPBOX_TOKEN}`,
    );
    if (!res.ok) return [];
    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data.features || []).map((f: any) => {
      const name = f.text || "";
      const region = (f.place_name || "")
        .replace(`${name}, `, "")
        .replace(`${name}`, "")
        .replace(/^,\s*/, "");

      return {
        id: f.id,
        name,
        region,
        fullName: f.place_name || name,
      };
    });
  } catch {
    return [];
  }
}

// ─── Debounce hook ─────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean | null;
}

export default function WaitlistModal({
  isOpen,
  onClose,
  isMobile,
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [cityResults, setCityResults] = useState<CityResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mobile = isMobile === true;
  const debouncedQuery = useDebounce(cityQuery, 300);

  // ── Fetch cities on debounced query ──
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSearching(true);

    searchCities(debouncedQuery).then((results) => {
      if (!cancelled) {
        setCityResults(results);
        setIsSearching(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ── Animate in ──
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";

      backdrop.style.transition = "none";
      backdrop.style.opacity = "0";
      panel.style.transition = "none";
      panel.style.opacity = "0";
      panel.style.transform = "scale(0.96) translateY(12px)";
      void backdrop.offsetHeight;

      backdrop.style.transition = "opacity 0.3s ease";
      backdrop.style.opacity = "1";
      panel.style.transition =
        "opacity 0.35s ease 0.05s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.05s";
      panel.style.opacity = "1";
      panel.style.transform = "scale(1) translateY(0)";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Click outside dropdown ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleClose = useCallback(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (backdrop && panel) {
      backdrop.style.transition = "opacity 0.2s ease";
      backdrop.style.opacity = "0";
      panel.style.transition = "opacity 0.15s ease, transform 0.2s ease";
      panel.style.opacity = "0";
      panel.style.transform = "scale(0.96) translateY(12px)";
    }
    setTimeout(() => {
      onClose();
      setEmail("");
      setCityQuery("");
      setSelectedCity(null);
      setCityResults([]);
      setStatus("idle");
      setErrorMsg("");
    }, 220);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMsg("Enter your email to join.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg("That doesn't look like a valid email.");
      setStatus("error");
      return;
    }
    if (!selectedCity) {
      setErrorMsg("Pick your city so we know where to launch.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await waitlistApi.join(email.trim(), selectedCity.fullName);
      setStatus("success");
      setSuccessMsg(res.message);
      // Optionally surface the already-on-list vs new message:
      // res.message will be "You're already on the list!" or "You're on the list!"
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: 0,
        }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative bg-white shadow-2xl overflow-hidden ${
          mobile
            ? "mx-4 rounded-2xl w-full max-w-sm"
            : "rounded-2xl w-full max-w-[440px]"
        }`}
        style={{ opacity: 0, fontFamily: SF }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #5B7FFF 0%, #FF8A5B 100%)",
          }}
        />

        {/* Close */}
        <button
          onClick={handleClose}
          className={`absolute z-10 flex items-center justify-center rounded-full transition-colors ${
            mobile ? "top-3 right-3 w-7 h-7" : "top-4 right-4 w-8 h-8"
          }`}
          style={{ backgroundColor: "rgba(0,0,0,0.04)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)")
          }
          aria-label="Close"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="#6B7A90"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>

        <div className={mobile ? "px-5 pt-5 pb-6" : "px-8 pt-7 pb-8"}>
          {status === "success" ? (
            /* ── Success ── */
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(91, 127, 255, 0.08)" }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5B7FFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3
                className={`font-bold text-[#1A2B4A] ${
                  mobile ? "text-lg mb-1" : "text-xl mb-1.5"
                }`}
              >
                {successMsg}
              </h3>
              <p
                className={`text-[#6B7A90] leading-relaxed ${
                  mobile ? "text-sm mb-5" : "text-[15px] mb-6"
                }`}
              >
                We&apos;ll let you know when Spin launches in{" "}
                <span className="font-semibold text-[#1A2B4A]">
                  {selectedCity?.name || "your city"}
                </span>
                . Get ready to ride.
              </p>
              <button
                onClick={handleClose}
                className={`bg-[#5B7FFF] text-white font-semibold rounded-xl hover:bg-[#4A6EEE] transition-colors ${
                  mobile ? "px-6 py-2.5 text-sm" : "px-8 py-3 text-[15px]"
                }`}
              >
                Done
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div className={mobile ? "mb-5" : "mb-6"}>
                <h3
                  className={`font-bold text-[#1A2B4A] ${
                    mobile ? "text-lg mb-0.5" : "text-xl mb-1"
                  }`}
                >
                  Join the waitlist
                </h3>
                <p
                  className={`text-[#6B7A90] ${
                    mobile ? "text-sm" : "text-[15px]"
                  }`}
                >
                  Be first to roll when Spin hits your city.
                </p>
              </div>

              {/* Email */}
              <div className={mobile ? "mb-3.5" : "mb-4"}>
                <label className="block text-[11px] font-semibold text-[#1A2B4A] uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMsg("");
                    }
                  }}
                  placeholder="you@example.com"
                  className={`w-full border bg-[#F5F7FA] text-[#1A2B4A] placeholder-[#A0AEC0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7FFF]/40 focus:border-[#5B7FFF] transition-all ${
                    status === "error" && !email.trim()
                      ? "border-red-300"
                      : "border-gray-200"
                  } ${mobile ? "px-3.5 py-2.5 text-sm" : "px-4 py-3 text-[15px]"}`}
                  style={{ fontFamily: SF }}
                />
              </div>

              {/* City */}
              <div className={`relative ${mobile ? "mb-4" : "mb-5"}`}>
                <label className="block text-[11px] font-semibold text-[#1A2B4A] uppercase tracking-wider mb-1.5">
                  City
                </label>
                <div className="relative">
                  <input
                    ref={cityInputRef}
                    type="text"
                    value={selectedCity ? selectedCity.fullName : cityQuery}
                    onChange={(e) => {
                      setCityQuery(e.target.value);
                      setSelectedCity(null);
                      setShowDropdown(true);
                      if (status === "error") {
                        setStatus("idle");
                        setErrorMsg("");
                      }
                    }}
                    onFocus={() => {
                      if (selectedCity) {
                        // Allow re-searching: clear selection on focus
                        setCityQuery(selectedCity.name);
                        setSelectedCity(null);
                      }
                      setShowDropdown(true);
                    }}
                    placeholder="Search any city..."
                    className={`w-full border bg-[#F5F7FA] text-[#1A2B4A] placeholder-[#A0AEC0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5B7FFF]/40 focus:border-[#5B7FFF] transition-all ${
                      status === "error" && !selectedCity
                        ? "border-red-300"
                        : "border-gray-200"
                    } ${mobile ? "px-3.5 py-2.5 text-sm pr-9" : "px-4 py-3 text-[15px] pr-10"}`}
                    style={{ fontFamily: SF }}
                  />
                  {/* Search / spinner icon */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      mobile ? "right-3" : "right-3.5"
                    }`}
                  >
                    {isSearching ? (
                      <svg
                        className="animate-spin h-4 w-4 text-[#A0AEC0]"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          fill="currentColor"
                          className="opacity-75"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="#A0AEC0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      >
                        <circle cx="7" cy="7" r="4.5" />
                        <path d="M10.5 10.5L14 14" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Dropdown */}
                {showDropdown && !selectedCity && cityQuery.length >= 2 && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20"
                    style={{
                      maxHeight: mobile ? "180px" : "220px",
                      overflowY: "auto",
                    }}
                  >
                    {isSearching && cityResults.length === 0 ? (
                      <div
                        className={`flex items-center gap-2 text-[#A0AEC0] ${
                          mobile
                            ? "px-3.5 py-3 text-sm"
                            : "px-4 py-3 text-[15px]"
                        }`}
                      >
                        <svg
                          className="animate-spin h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-25"
                          />
                          <path
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            fill="currentColor"
                            className="opacity-75"
                          />
                        </svg>
                        Searching...
                      </div>
                    ) : cityResults.length > 0 ? (
                      cityResults.map((c) => (
                        <button
                          key={c.id}
                          className={`w-full text-left hover:bg-[#F0F4FF] transition-colors flex items-start gap-2.5 ${
                            mobile ? "px-3.5 py-2.5" : "px-4 py-3"
                          }`}
                          style={{ fontFamily: SF }}
                          onClick={() => {
                            setSelectedCity(c);
                            setCityQuery("");
                            setCityResults([]);
                            setShowDropdown(false);
                            if (status === "error") {
                              setStatus("idle");
                              setErrorMsg("");
                            }
                          }}
                        >
                          {/* Pin icon */}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="#5B7FFF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="flex-shrink-0 mt-0.5"
                          >
                            <path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z" />
                            <circle cx="8" cy="6" r="1.5" />
                          </svg>
                          <div className="min-w-0">
                            <div
                              className={`font-medium text-[#1A2B4A] truncate ${
                                mobile ? "text-sm" : "text-[15px]"
                              }`}
                            >
                              {c.name}
                            </div>
                            <div
                              className={`text-[#A0AEC0] truncate ${
                                mobile ? "text-xs" : "text-xs"
                              }`}
                            >
                              {c.region}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : !isSearching && debouncedQuery.length >= 2 ? (
                      <div
                        className={`text-[#A0AEC0] ${
                          mobile
                            ? "px-3.5 py-3 text-sm"
                            : "px-4 py-3 text-[15px]"
                        }`}
                      >
                        No cities found for &ldquo;{cityQuery}&rdquo;
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Error */}
              {status === "error" && errorMsg && (
                <p
                  className={`text-red-500 -mt-1 mb-3 ${
                    mobile ? "text-xs" : "text-sm"
                  }`}
                >
                  {errorMsg}
                </p>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={status === "loading"}
                className={`w-full bg-[#5B7FFF] text-white font-semibold rounded-xl cursor-pointer hover:bg-[#4A6EEE] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                  mobile ? "py-3 text-sm" : "py-3.5 text-[15px]"
                }`}
                style={{ fontFamily: SF }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2 cursor-pointer">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        fill="currentColor"
                        className="opacity-75"
                      />
                    </svg>
                    Joining...
                  </span>
                ) : (
                  "Join the waitlist"
                )}
              </button>

              {/* Privacy note */}
              <p
                className={`text-center text-[#A0AEC0] mt-3 ${
                  mobile ? "text-[10px]" : "text-xs"
                }`}
              >
                No spam, ever. We&apos;ll only email you about launch.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
