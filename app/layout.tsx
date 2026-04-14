import type { Metadata } from "next";
import { Noticia_Text, Poppins, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import type { Viewport } from "next";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const noticaText = Noticia_Text({
  variable: "--font-notica",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.fr"),

  title: {
    default: "Lokko",
    template: "%s · Lokko",
  },

  description:
    "Plateforme locale de mise en relation autour de l’alimentaire : producteurs, artisans et particuliers près de chez vous.",

  applicationName: "Lokko",

  generator: "Next.js",

  keywords: [
    "alimentaire local",
    "producteurs locaux",
    "circuit court",
    "produits locaux",
    "Lokko",
    "agriculture locale",
  ],

  authors: [{ name: "Lokko", url: "https://your-domain.fr" }],

  creator: "Lokko",
  publisher: "Lokko",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://your-domain.fr",
    languages: {
      fr: "https://your-domain.fr",
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://your-domain.fr",
    siteName: "Lokko",
    title: "Lokko",
    description:
      "Trouvez et contactez des acteurs de l’alimentaire local près de chez vous.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lokko",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Lokko",
    description:
      "Plateforme locale pour connecter producteurs, artisans et particuliers.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [{ url: "/favicon.ico" }],
  },

  manifest: "/site.webmanifest", // this points to your favico.io manifest
};

export const viewport: Viewport = {
  themeColor: "black",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body
        className={`${noticaText.variable} ${poppins.variable} scrollbar scrollbar-none`}
      >
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
