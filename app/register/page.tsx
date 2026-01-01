"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", // Sesuaikan dengan field 'name' di Laravel
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Memanggil API Register
      await api.post("/register", formData);

      Swal.fire({
        title: "Registrasi Berhasil!",
        text: "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
        icon: "success",
        confirmButtonColor: "#3eb0db",
      }).then(() => {
        router.push("/login"); // Arahkan ke halaman login
      });

    } catch (error: any) {
      console.error("Register Error:", error.response?.data);
      
      // Menangani error validasi dari Laravel
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mendaftar.";
      
      Swal.fire({
        title: "Gagal Daftar",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row overflow-hidden font-sans">
      {/* SISI KIRI: Visual/Welcome Section */}
      <div className="relative flex w-full flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-900 p-8 text-white md:w-1/2 lg:w-2/5">
        {/* Dekorasi Visual Bulan */}
        <div className="absolute top-10 flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
          <div className="h-32 w-32 rounded-full bg-white shadow-[0_0_60px_rgba(255,255,255,0.4)]"></div>
        </div>

        <div className="relative z-10 mt-40 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">Welcome Page</h1>
          <p className="max-w-xs text-sm leading-relaxed text-blue-50 font-medium">
            Bergabunglah dengan komunitas pembaca kami dan temukan ribuan koleksi buku menarik hanya dalam satu platform.
          </p>
        </div>
      </div>

      {/* SISI KANAN: Form Section */}
      <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 lg:w-3/5">
        <div className="w-full max-w-md">
          <h2 className="mb-14 text-5xl font-black text-gray-800 tracking-tighter">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Full Name */}
            <div className="group relative border-b-2 border-gray-200 transition-all focus-within:border-blue-500">
              <label className="block text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase group-focus-within:text-blue-500 transition-colors">
                Full Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-transparent py-3 text-gray-700 outline-none placeholder:text-gray-300 placeholder:font-normal"
                placeholder="Enter Your Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="group relative border-b-2 border-gray-200 transition-all focus-within:border-blue-500">
              <label className="block text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase group-focus-within:text-blue-500 transition-colors">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-transparent py-3 text-gray-700 outline-none placeholder:text-gray-300 placeholder:font-normal"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="group relative border-b-2 border-gray-200 transition-all focus-within:border-blue-500">
              <label className="block text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase group-focus-within:text-blue-500 transition-colors">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full bg-transparent py-3 text-gray-700 outline-none placeholder:text-gray-300 placeholder:font-normal tracking-widest"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* Terms of Service */}
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-5 w-5 rounded border-gray-300 accent-[#3eb0db] cursor-pointer"
              />
              <label htmlFor="terms" className="text-[13px] text-gray-500 font-medium cursor-pointer">
                I agree All the Statements in{" "}
                <Link href="#" className="font-bold text-[#3eb0db] hover:underline">
                  Terms of service
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#3eb0db] py-5 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all hover:bg-blue-500 active:scale-[0.97] disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
              </button>
            </div>
            
            <p className="mt-6 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-[#3eb0db] hover:underline ml-1">
                Login Sekarang
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}