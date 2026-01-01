import React from "react";
import { Send } from "lucide-react"; // Menggunakan Lucide karena sudah terpasang di proyek Anda

export default function Footer() {
  return (
    <footer className="w-full mt-[60px] px-6 py-12 md:px-12 bg-black/80 backdrop-blur-xl border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          
          {/* Kolom 1: Branding */}
          <div className="footer-col">
            <h2 className="text-2xl font-bold mb-4 tracking-tight">TokoBuku Kita</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Memudahkan Anda dalam Membaca
            </p>
          </div>

          {/* Kolom 2: Menu */}
          <div className="footer-col">
            <h3 className="text-[#0084ff] font-semibold mb-5">Menu</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#0084ff] hover:pl-1 transition-all">Home</a></li>
              <li><a href="#" className="hover:text-[#0084ff] hover:pl-1 transition-all">Prediction</a></li>
            </ul>
          </div>

          {/* Kolom 3: Information */}
          <div className="footer-col">
            <h3 className="text-[#0084ff] font-semibold mb-5">Information</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#0084ff] hover:pl-1 transition-all">About</a></li>
              <li><a href="#" className="hover:text-[#0084ff] hover:pl-1 transition-all">Team</a></li>
              <li><a href="#" className="hover:text-[#0084ff] hover:pl-1 transition-all">Contact</a></li>
            </ul>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div className="footer-col">
            <h3 className="text-[#0084ff] font-semibold mb-5">Sosial Media</h3>
            <div className="flex gap-4 text-2xl">
              {/* Jika anda tetap ingin menggunakan Remix Icon, pastikan link CDN ada di layout.tsx */}
              <i className="ri-whatsapp-fill hover:text-[#0084ff] cursor-pointer transition-all"></i>
              <i className="ri-facebook-circle-fill hover:text-[#0084ff] cursor-pointer transition-all"></i>
              <i className="ri-instagram-fill hover:text-[#0084ff] cursor-pointer transition-all"></i>
              <i className="ri-tiktok-fill hover:text-[#0084ff] cursor-pointer transition-all"></i>
            </div>
          </div>
        </div>

        {/* Garis Pemisah */}
        <hr className="border-white/10 my-10" />

        {/* Bottom Text */}
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2025 TokoBuku Kita — All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}