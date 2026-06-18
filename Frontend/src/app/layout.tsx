import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Venture Studio",
  description: "AI Venture Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}