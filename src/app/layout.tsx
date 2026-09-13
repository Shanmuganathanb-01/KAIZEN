import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono, Audiowide } from "next/font/google";
import { AppBootSplash } from "@/components/ui/AppBootSplash";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains",
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "KAIZEN - Life RPG",
  description: "Small steps. Real progress. Complete missions, earn Credits, level up your hacker. Gamify your life with KAIZEN.",
  keywords: ["productivity", "gamification", "RPG", "task manager", "life RPG", "kaizen", "continuous improvement"],
  icons: {
    icon: [
      { url: "/kaizen-mark.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/kaizen-mark.svg",
    apple: "/kaizen-mark.svg",
  },
  openGraph: {
    title: "KAIZEN - Life RPG",
    description: "Small steps. Real progress. Complete missions. Earn credits. Level up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable} ${audiowide.variable}`}>
      <head>
        <link rel="icon" href="/kaizen-mark.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/kaizen-mark.svg" />
      </head>
      <body className="relative z-10">
        <AppBootSplash />
        {children}
      </body>
    </html>
  );
}