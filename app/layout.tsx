import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Sesuaikan path folder Navbar Anda

// Konfigurasi Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TokoBuku Kita",
  description: "Solusi cerdas mencari buku favorit",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased bg-gray-50 text-slate-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}