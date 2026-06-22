"use client";

import Image from "next/image";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";

const WHATSAPP_NUMERO = "5561999867005";

function waLink(mensagem: string) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

function trackWhatsapp(origem: string) {
  sendGAEvent("event", "whatsapp_click", { origem });
}

const PRODUTOS_MENU = [
  { nome: "Auto", icone: "🚗", href: "/seguro-auto" },
  {
    nome: "Empresarial",
    icone: "🏢",
    href: waLink("Olá! Quero uma cotação de Seguro Empresarial."),
  },
  { nome: "Residencial", icone: "🏠", href: "/seguro-residencial" },
  { nome: "Viagem", icone: "✈️", href: "/seguro-viagem" },
  {
    nome: "Vida",
    icone: "❤️",
    href: waLink("Olá! Quero uma cotação de Seguro de Vida."),
  },
];

const NAV_LINKS = [
  { nome: "Início", href: "/" },
  { nome: "Sobre", href: "/#sobre" },
  { nome: "Seguros", href: "/#produtos" },
];

function ItemMenuProduto({ p }: { p: (typeof PRODUTOS_MENU)[number] }) {
  const externo = p.href.startsWith("http");
  return (
    <a
      href={p.href}
      target={externo ? "_blank" : undefined}
      rel={externo ? "noopener noreferrer" : undefined}
      onClick={externo ? () => trackWhatsapp(`menu_produto_${p.nome.toLowerCase()}`) : undefined}
      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#333333] hover:bg-[#f6fcfd] hover:text-[#5CBECB] transition-colors"
    >
      <span>{p.icone}</span>
      {p.nome}
    </a>
  );
}

function DropdownCompreAqui() {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer flex items-center gap-1 text-sm font-semibold text-[#333333]/70 hover:text-[#5CBECB] transition-colors [&::-webkit-details-marker]:hidden">
        Compre Aqui
        <span className="text-[10px] mt-0.5">▾</span>
      </summary>
      <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e8f7f8] rounded-xl shadow-lg overflow-hidden z-50">
        {PRODUTOS_MENU.map((p) => (
          <ItemMenuProduto key={p.nome} p={p} />
        ))}
      </div>
    </details>
  );
}

export default function SiteHeader() {
  return (
    <header className="w-full bg-white border-b border-[#e8f7f8] px-6 py-4 relative z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex-shrink-0 block h-9 w-[111px] relative">
          <Image
            src="/logo-horizontal.png"
            alt="Simples Assim"
            fill
            priority
            className="object-contain object-left"
          />
        </Link>

        {/* Menu — desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.nome}
              href={l.href}
              className="text-sm font-semibold text-[#333333]/70 hover:text-[#5CBECB] transition-colors"
            >
              {l.nome}
            </a>
          ))}
          <DropdownCompreAqui />
          <a
            href={waLink("Olá! Quero uma cotação.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsapp("header_desktop")}
            className="text-sm font-semibold text-[#157A3B] hover:text-[#0f5c2c] transition-colors"
          >
            Fale pelo WhatsApp →
          </a>
        </nav>

        {/* Menu — mobile (hambúrguer, clique abre/fecha) */}
        <details className="md:hidden relative">
          <summary className="list-none cursor-pointer text-2xl leading-none text-[#535391] [&::-webkit-details-marker]:hidden">
            ☰
          </summary>
          <div className="absolute right-0 mt-3 w-60 bg-white border border-[#e8f7f8] rounded-xl shadow-lg p-2 z-50">
            {NAV_LINKS.map((l) => (
              <a
                key={l.nome}
                href={l.href}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#333333] hover:bg-[#f6fcfd]"
              >
                {l.nome}
              </a>
            ))}
            <div className="border-t border-[#e8f7f8] my-1" />
            {PRODUTOS_MENU.map((p) => (
              <ItemMenuProduto key={p.nome} p={p} />
            ))}
            <div className="border-t border-[#e8f7f8] my-1" />
            <a
              href={waLink("Olá! Quero uma cotação.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsapp("header_mobile")}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-[#157A3B] hover:bg-[#f6fcfd]"
            >
              Fale pelo WhatsApp →
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}
