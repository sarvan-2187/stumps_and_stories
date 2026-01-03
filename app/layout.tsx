import type { Metadata } from "next";
import {  Ubuntu } from "next/font/google";
import "./globals.css";

const ubuntuFont = Ubuntu({
  variable: "--font-sans",
  weight: ['400'],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Stumps & Stories",
  description: "The OG Newsletter for Cricket by Sarvan Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntuFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
