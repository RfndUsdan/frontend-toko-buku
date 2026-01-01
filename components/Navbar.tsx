"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import api from "@/lib/axios"; // Pastikan path axios sudah benar
import { ShoppingCart } from "lucide-react"; // Import icon keranjang

export default function Navbar() {
  const [user, setUser] = useState<{ role: string; name: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // State untuk jumlah barang di keranjang
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Fungsi untuk mengambil jumlah item di keranjang dari API
  const fetchCartCount = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return; // Jangan panggil API jika belum login

    try {
      const response = await api.get("/cart");
      // Mengambil jumlah baris data di keranjang
      setCartCount(response.data.data?.length || 0);
    } catch (e) {
      console.error("Gagal mengambil jumlah keranjang");
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        fetchCartCount(); // Ambil data keranjang saat pertama kali mount
      } catch (e) {
        console.error("Gagal parse data user");
      }
    }

    // 2. Event Listener untuk update real-time dari halaman lain
    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener("cart-updated", handleCartUpdate);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <span className="text-white font-sans font-bold text-2xl tracking-wide">
                  TokoBuku Kita
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 items-center">
                {user ? (
                  <>
                    {user.role === "admin" ? (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === "/admin/dashboard" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/books"
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === "/admin/books" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          Kelola Buku
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/"
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === "/" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          Home
                        </Link>
                        <Link
                          href="/orders"
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === "/orders" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          Pesanan Saya
                        </Link>
                        
                        {/* LINK KERANJANG DENGAN BADGE */}
                        <Link
                          href="/cart"
                          className={`relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === "/cart" ? "text-white bg-white/20" : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <ShoppingCart size={18} />
                          Keranjang Saya
                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-in zoom-in">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                    <Link href="/register" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Daftar</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section Profile Dropdown */}
          {user && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white/10 hover:ring-white/30 transition-all"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold uppercase shadow-inner">
                    {user.role[0]}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-75">
                    <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700 mb-1">
                      Logged in as <span className="text-white font-semibold">{user.role}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}