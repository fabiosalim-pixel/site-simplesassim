"use client";

import { sendGAEvent } from "@next/third-parties/google";

export default function WhatsappLink({
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
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sendGAEvent("event", "whatsapp_click", { origem })}
      className={className}
    >
      {children}
    </a>
  );
}
