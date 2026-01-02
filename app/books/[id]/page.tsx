"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Heart,
  Share2,
  Truck,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Info
} from "lucide-react";
import Swal from "sweetalert2";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${id}`);
      setBook(response.data.data || response.data);
    } catch (error) {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      // Mengirim array 'items' sesuai kebutuhan CartController.php
      await api.post("/cart", {
        items: [
          {
            book_id: book.id,
            quantity: 1,
          }
        ]
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Buku masuk keranjang",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        Swal.fire("Harus Login", "Silakan login terlebih dahulu", "info")
          .then(() => router.push("/login"));
      } else if (error.response?.status === 403) {
        Swal.fire("Akses Ditolak", "Admin tidak diperbolehkan belanja", "warning");
      } else {
        Swal.fire("Gagal", "Terjadi gangguan pada server", "error");
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      await api.post("/cart", {
        items: [{ book_id: book.id, quantity: 1 }]
      });
      router.push("/cart");
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (id) fetchBookDetail();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (!book) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar Minimalis */}
      <nav className="h-[60px] border-b flex items-center px-6 bg-white sticky top-0 z-40">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">Kembali</span>
        </button>
      </nav>

      {/* Main Content - Lebar dinaikkan ke 6xl dan Gap diperlebar ke 12 */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-20 p-6 md:py-12">
        
        {}
        <div className="w-full md:w-[33%] shrink-0">
          <div className="md:sticky md:top-24">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200">
              <img
                src={book.image ? `http://localhost:8000/storage/${book.image}` : "/placeholder.jpg"}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Sisi Kanan: Detail - Font dinaikkan skalanya */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">{book.category}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-2 leading-tight">
              {book.title}
            </h1>
            <p className="text-gray-500 text-base italic">Penulis: <span className="text-gray-900 font-semibold not-italic">{book.author}</span></p>
          </div>

          <div className="mb-4 p-3 rounded-2xl ">
            <h2 className="text-3xl text-gray-900">
              Harga : Rp{Number(book.price).toLocaleString("id-ID")}
            </h2>
          </div>

          {/* Tombol Aksi - Lebih proporsional */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              onClick={handleBuyNow}
              className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              Beli Sekarang
            </button>
            <button 
              onClick={addToCart}
              className="flex-1 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl text-sm hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> + Keranjang
            </button>
          </div>

          {/* Deskripsi */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">Deskripsi Buku</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm md:text-[15px] whitespace-pre-line text-justify">
              {book.description}
            </p>
          </div>

          {/* Spesifikasi - Lebih elegan */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100 mt-auto">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Judul</p>
              <p className="text-gray-800">{book.title}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Author</p>
              <p className="text-gray-800">{book.author}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Kategori Buku</p>
              <p className="text-gray-800">{book.category}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Tahun Terbit</p>
              <p className="text-gray-800">{book.published_year}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Halaman</p>
              <p className="text-gray-800">{book.pages}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Bahasa</p>
              <p className="text-gray-800">{book.language}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}