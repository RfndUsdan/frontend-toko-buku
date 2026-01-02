"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Search, BookOpen, Loader2 } from "lucide-react";
import BookCard from "@/components/BookCard";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");

  const categories = ["Semua", "Novel", "Sejarah", "Filosofi", "Pendidikan", "Biografi"];

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const catParam = category === "Semua" ? "" : category;
      
      const response = await api.get(`/books`, {
        params: {
          search: searchTerm,
          category: catParam 
        }
      });
      
      setBooks(response.data.data.data || response.data.data);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Temukan Dunia di <span className="text-blue-500">Tiap Halaman.</span>
          </h1>
        </div>
      </section>

      {/* Toolbar */}
      <section className="sticky top-0 z-10 bg-white border-b py-4 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari buku atau penulis..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-950 font-medium outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={20} />
            {category === "Semua" ? "Koleksi Terbaru" : `Kategori ${category}`}
          </h2>
        </div>

        {/* LOGIKA TAMPILAN: Hanya satu blok pengecekan */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Memuat koleksi...</p>
          </div>
        ) : books.length > 0 ? (
          /* GRID KECIL: Sudah digabung dan hanya muncul satu kali */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {books.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-24">
            <Search className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800">Buku tidak ditemukan</h3>
            <p className="text-sm text-gray-500 mt-1">Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </main>
    </div>
  );
}