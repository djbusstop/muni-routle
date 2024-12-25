import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import clsx from "clsx";

import worm from "./worm.svg";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muni Routle",
  description: "Test your knowledge of SF Muni routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className={clsx(["w-dvw", "h-dvh", "flex", "flex-col"])}>
          {/* Menu Bar */}
          <header
            className={clsx([
              "flex",
              "justify-between",
              "max-h-10",
              "p-2",
              "items-center",
              "font-bold",
              "gap-1",
              "bg-gray-200",
              "dark:bg-gray-800",
            ])}
          >
            <div className={clsx(["w-5", "h-1"])} />
            <Link href="/">
              <h1
                className={clsx([
                  "flex",
                  "justify-center",
                  "items-center",
                  "font-bold",
                  "gap-1",
                ])}
              >
                <Image priority alt="Muni" src={worm} width={60} />
                ROUTLE
              </h1>
            </Link>
            <Link href="/about">
              <span className={clsx(["dark:hidden"])}>❓</span>
              <span className={clsx(["hidden", "dark:block"])}>❔</span>
            </Link>
          </header>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
