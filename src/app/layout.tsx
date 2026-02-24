import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cocycle - Find people to ride with",
  description:
    "Cocycle makes it effortless to discover, plan, and join cycling rides with others. Because cycling is better together.",
  openGraph: {
    title: "Cocycle - Find people to ride with",
    description:
      "Discover, plan, and join cycling rides with others. Because cycling is better together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}