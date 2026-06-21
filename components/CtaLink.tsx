"use client";

import { sendGAEvent } from "@next/third-parties/google";

export default function CtaLink({
  href,
  origem,
  className,
  children,
}: {
  href: string;
  origem: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => sendGAEvent("event", "cta_click", { origem })}
      className={className}
    >
      {children}
    </a>
  );
}
