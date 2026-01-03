"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { Search, BookOpen, Loader2, BookX } from "lucide-react";
import BookCard from "@/components/BookCard";

// Definisi Tipe Data untuk konsistensi
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  cover_url: string;
  price?: number;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");

  const categories = ["Semua", "Novel", "Sejarah", "Filosofi", "Pendidikan", "Biografi"];

  // Menggunakan useCallback agar fungsi tidak dibuat ulang di setiap render
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const catParam = category === "Semua" ? "" : category;
      
      const response = await api.get(`/books`, {
        params: {
          search: searchTerm,
          category: catParam 
        }
      });
      
      // Menyesuaikan dengan struktur pagination Laravel (data.data.data)
      const bookData = response.data.data?.data || response.data.data || [];
      setBooks(bookData);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Temukan Dunia di <span className="text-blue-500">Tiap Halaman.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ribuan koleksi buku tersedia untuk menemani perjalanan literasimu.
          </p>
        </div>
      </section>

      {/* Toolbar (Sticky) */}
      <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b py-4 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari buku atau penulis..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl transition-all outline-none text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                  category === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Katalog Grid */}
      
      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} />
            {category === "Semua" ? "Koleksi Terbaru" : `Kategori ${category}`}
          </h2>
          <span className="text-sm text-gray-500 font-medium">{books.length} Buku ditemukan</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-500 animate-pulse font-medium">Menyusun rak buku untukmu...</p>
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <BookX className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-800">Ups! Buku tidak ditemukan</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Kami tidak dapat menemukan buku dengan kata kunci "{searchTerm}". Coba kategori lain?
            </p>
          </div>
        )}
      </main>
    </div>
  );
}