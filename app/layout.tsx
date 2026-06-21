import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import WhatsappFlutuante from "@/components/WhatsappFlutuante";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simples Assim — Soluções inteligentes em seguros",
  description:
    "Cotamos nas melhores seguradoras do Brasil. Atendimento humano, sem burocracia.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={nunito.variable}>
      <body className="antialiased">
        {children}
        <WhatsappFlutuante />
      </body>
      <GoogleAnalytics gaId="G-ZH7GRD0KQS" />
    </html>
  );
}
