"use client";

import AuthButtons from "@/components/AuthButtons";

export default function Home() {
  return (
    <div className="w-screen h-screen bg-background text-foreground flex flex-col gap-6 items-center justify-center">
      <h1 className="text-4xl font-bold">Smrt Study</h1>
      <AuthButtons />
    </div>
  );
}
