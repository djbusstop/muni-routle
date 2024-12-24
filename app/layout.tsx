import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muni Routle",
  description: "Test your knowledge of Muni lines",
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
