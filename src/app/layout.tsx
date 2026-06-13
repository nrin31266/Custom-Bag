import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Dancing_Script,
  Geist,
  Geist_Mono,
  Great_Vibes,
  Lobster,
  Pacifico,
  Playfair_Display,
  Sacramento,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  style: ["normal", "italic"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Lenth Custom Bag",
  description: "Website custom túi xách 7 bước",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${dancingScript.variable} ${pacifico.variable} ${lobster.variable} ${sacramento.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#fbf8f5] text-[#28180f]">
        {children}
      </body>
    </html>
  );
}
