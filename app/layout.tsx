import type { Metadata } from "next";
import { Google_Sans, Tangerine } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans({
  variable: "--font-sans-google",
  weight: ['400'],
  subsets: ["latin"],
})

const tagerineSans = Tangerine({
  variable: "--font-sans-tangerine",
  weight: ['400'],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Stumps & Stories",
  description: "The OG Newsletter for Cricket by Sarvan Kumar",
    openGraph: {
    title: "Stumps & Stories",
    description: "Automated Cricket Newsletter",
    url: "https://stumps-and-stories.vercel.app/",
    siteName: "Stumps & Stories",
    images: [
      {
        url: "https://stumps-and-stories.vercel.app//og.png",
        width: 1200,
        height: 630,
        alt: "Stumps & Stories - Automated Cricket Newsletter",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stumps & Stories",
    description: "Automated Cricket Newsletter",
    images: ["https://stumps-and-stories.vercel.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${googleSans.variable} ${tagerineSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
