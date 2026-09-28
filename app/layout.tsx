import type { Metadata } from "next";
import "./globals.css";
import { asset } from "./base-path";
import { LoadingScreen } from "./loading-screen";
import { MotionEffects } from "./motion";
import { PageTransition } from "./page-transition";

export const metadata: Metadata = {
  title: "HEMORA — Lereng Senja Ciwidey & Sriti Palu",
  description:
    "A calm, image-led hospitality homepage for HEMORA's two-property ecosystem in Ciwidey and Palu.",
  icons: {
    icon: asset("/favicon.png"),
    shortcut: asset("/favicon.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout applies to every route. */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@300..900&family=Montserrat:wght@100..300&display=swap" />
      </head>
      <body>
        {children}
        <MotionEffects />
        <LoadingScreen className="page-load-transition" />
        <PageTransition />
      </body>
    </html>
  );
}
