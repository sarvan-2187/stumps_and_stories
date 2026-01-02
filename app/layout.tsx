import type { Metadata } from "next";
import { Oldenburg } from "next/font/google";
import "./globals.css";

const oldenburgSans = Oldenburg({
  variable: "--font-oldenburg-sans",
  weight:['400'],
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
        className={`${oldenburgSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
