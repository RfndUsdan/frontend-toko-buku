"use client";

import { useEffect, useState } from "react";
import { User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Definisi tipe data user (sesuaikan dengan data Anda)
interface UserData {
  name: string;
  email: string;
  role?: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Ambil data user dari localStorage
    // (Karena di Navbar Anda menyimpannya di sana)
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Simulasi sedikit delay agar loading terasa natural (opsional)
        setTimeout(() => {
            setUser(parsedUser);
            setLoading(false);
        }, 500)
      } catch (error) {
        console.error("Gagal membaca data user", error);
        localStorage.removeItem("user"); // Bersihkan data korup
        router.push("/login");
      }
    } else {
      // Jika tidak ada data user, lempar ke halaman login
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
         <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
         <p className="text-gray-500 text-sm">Memuat profil...</p>
      </div>
    );
  }

  if (!user) return null; // Jangan tampilkan apa-apa jika redirect sedang berjalan

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center p-4">
      {/* Container Kartu Profil */}
      <div className="bg-white w-full max-w-lg shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        
        {/* Header Hiasan (Opsional, agar lebih cantik) */}
        <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="p-8 flex items-center gap-6 relative -mt-12">
          {/* BAGIAN KIRI: Ikon User */}
          <div className="mt-8 shrink-0">
            {/* Lingkaran background untuk ikon */}
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg ring-4 ring-blue-50 flex items-center justify-center">
              <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center">
                 <User className="h-12 w-12 text-blue-600" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* BAGIAN KANAN: Informasi Nama & Email */}
          <div className="flex flex-col pt-10">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {user.name}
            </h1>
            <p className="text-gray-500 font-medium mt-1 flex items-center gap-1">
              {user.email}
            </p>
            {/* Menampilkan Role (Opsional) */}
            {user.role && (
                <span className="mt-2 inline-flex self-start items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 capitalize">
                  {user.role}
                </span>
            )}
          </div>
        </div>

        {/* Footer Kartu (Opsional) */}
        <div className="bg-gray-50 px-8 py-4 border-t text-sm text-gray-500">
            Akun Pengguna TokoBuku Kita
        </div>

      </div>
    </div>
  );
}