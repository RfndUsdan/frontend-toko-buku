"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      
      // Ambil token dan user dari response.data.data sesuai struktur API Anda
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${user.name}!`,
        icon: "success",
        confirmButtonColor: "#3eb0db",
      }).then(() => {
        // Redirection berdasarkan role
        if (user.role === "admin") {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/";
        }
      });
    } catch (error: any) {
      console.error("Error Detail:", error.response?.data);
      Swal.fire({
        title: "Login Gagal",
        text: error.response?.data?.message || "Email atau password salah.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row overflow-hidden font-sans">
      
      {/* SISI KIRI: Form Section (Posisi Baru) */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 lg:w-3/5 order-2 md:order-1">
        <div className="w-full max-w-md">
          <h2 className="mb-14 text-5xl font-black text-gray-900 tracking-tighter">Login</h2>

          <form onSubmit={handleLogin} className="space-y-12">
            {/* Email Input */}
            <div className="group relative border-b-2 border-black transition-all focus-within:border-blue-500">
              <label className="block text-[11px] font-black tracking-[0.15em] text-black uppercase group-focus-within:text-blue-500 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full bg-transparent py-3 text-gray-700 outline-none placeholder:text-gray-300 placeholder:font-normal"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="group relative border-b-2 border-black transition-all focus-within:border-blue-500">
              <label className="block text-[11px] font-black tracking-[0.15em] text-gray-700 uppercase group-focus-within:text-blue-500 transition-colors">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-transparent py-3 text-black font-bold outline-none placeholder:text-gray-300 placeholder:font-normal tracking-widest"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#3eb0db] py-5 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-500 active:scale-[0.97] disabled:bg-gray-300 flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Masuk"}
              </button>
              
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <Link href="/register" className="text-gray-400 hover:text-black transition-colors">
                  Buat Akun Baru
                </Link>
                <Link href="#" className="text-[#3eb0db] hover:underline">
                  Lupa Password?
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SISI KANAN: Visual/Welcome Section (Posisi Baru) */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-900 p-8 text-white md:w-1/2 lg:w-2/5 order-1 md:order-2">
        {/* Dekorasi Visual Bulan */}
        <div className="absolute top-10 flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <div className="h-32 w-32 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,0.4)]"></div>
        </div>

        <div className="relative z-10 mt-40 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">TokoBuku Kita</h1>
          <p className="max-w-xs text-sm leading-relaxed text-blue-50 font-medium italic">
            "Satu-satunya cara untuk melakukan pekerjaan besar adalah dengan mencintai apa yang Anda baca."
          </p>
        </div>
      </div>

    </div>
  );
}