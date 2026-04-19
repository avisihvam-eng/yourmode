import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Mode",
  description: "Are you building or consuming?",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col items-center bg-bg">
        <main className="w-full max-w-[390px] px-4 py-6 flex-1">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
