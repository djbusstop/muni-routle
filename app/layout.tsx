import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muni Lines Quiz",
  description: "Test your knowledge of Muni Lines",
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
