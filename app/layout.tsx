import type { Metadata } from "next";
import "./globals.css";
import { LoadingScreen } from "./loading-screen";
import { PageTransition } from "./page-transition";

export const metadata: Metadata = {
  title: "HEMORA — Lereng Senja Ciwidey & Sriti Palu",
  description:
    "A calm, image-led hospitality homepage for HEMORA's two-property ecosystem in Ciwidey and Palu.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <LoadingScreen className="page-load-transition" />
        <PageTransition />
      </body>
    </html>
  );
}
