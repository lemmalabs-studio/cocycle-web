"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import WaitlistModal from "@/components/landing/WaitlistModal";

interface WaitlistContextValue {
  openWaitlist: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  openWaitlist: () => {},
});

export function useWaitlist() {
  return useContext(WaitlistContext);
}

export function WaitlistProvider({
  children,
  isMobile,
}: {
  children: ReactNode;
  isMobile: boolean | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <WaitlistContext.Provider value={{ openWaitlist: () => setIsOpen(true) }}>
      {children}
      <WaitlistModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isMobile={isMobile}
      />
    </WaitlistContext.Provider>
  );
}