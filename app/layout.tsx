import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
