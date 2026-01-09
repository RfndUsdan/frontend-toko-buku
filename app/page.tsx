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

interface Category {
  id: number | string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  
  // 2. Ubah tipe data state menjadi array of objects
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "Semua", slug: "Semua" }
  ]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      // Ambil data dari API (asumsi response.data.data berisi array object category)
      const apiCategories = response.data.data; 

      // 3. Gabungkan object "Semua" dengan data dari API
      setCategories([
        { id: "all", name: "Semua", slug: "Semua" },
        ...apiCategories
      ]);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  }, []);

  // 2. useEffect khusus untuk memuat kategori saat pertama kali halaman dibuka
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 3. fetchBooks tetap mandiri dan fokus pada filter
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const catParam = category === "Semua" ? "" : category;

      const response = await api.get(`/books`, {
        params: {
          search: searchTerm,
          category: catParam,
        },
      });

      const bookData = response.data.data?.data || response.data.data || [];
      setBooks(bookData);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]);

  // 4. Debounce untuk pencarian buku
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
            Temukan Dunia di{" "}
            <span className="text-blue-500">Tiap Halaman.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ribuan koleksi buku tersedia untuk menemani perjalanan literasimu.
          </p>
        </div>
      </section>

      {/* Toolbar */}
        <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b py-4 shadow-sm">
          <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
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

            {/* Dynamic Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.slug)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    category === cat.slug 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div> {/* <--- TAMBAHKAN PENUTUP DIV INI */}
        </section>

      {/* Katalog Grid */}

      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} />
            {category === "Semua" ? "Koleksi Terbaru" : `Kategori ${category}`}
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            {books.length} Buku ditemukan
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-gray-500 animate-pulse font-medium">
              Menyusun rak buku untukmu...
            </p>
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
            <h3 className="text-xl font-bold text-gray-800">
              Ups! Buku tidak ditemukan
            </h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">
              Kami tidak dapat menemukan buku dengan kata kunci "{searchTerm}".
              Coba kategori lain?
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
