"use client";

import dynamic from "next/dynamic";

export default function Home() {
  const Quiz = dynamic(() => import("./Quiz"), { ssr: false });

  return <Quiz />;
}
