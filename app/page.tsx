"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/axios";
import { Search, BookOpen, Loader2, BookX, ChevronDown, LayoutGrid } from "lucide-react";
import BookCard from "@/components/BookCard";

// Definisi Tipe Data
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  cover_url: string;
  price?: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  // Ubah dari string menjadi object Category atau null
  category: {
    id: number;
    name: string;
    slug: string;
  } | null; 
  cover_url: string;
  price?: number;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  }, []);

  // 3. Fetch Books
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const catParam = category === "Semua" ? "" : category;
      const response = await api.get(`/books`, {
        params: { search: searchTerm, category: catParam },
      });
      const bookData = response.data.data?.data || response.data.data || [];
      setBooks(bookData);
    } catch (error) {
      console.error("Gagal memuat buku:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => { fetchBooks(); }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Temukan Dunia di <span className="text-blue-500">Tiap Halaman.</span>
        </h1>
      </section>

      {/* Toolbar */}
      <section className="sticky top-0 z-50 bg-white border-b py-3 shadow-sm">
        <div className="container mx-auto px-6 flex items-center gap-6">
          
          {/* DROPDOWN KATEGORI */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 font-bold text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              <LayoutGrid size={20} /> Kategori <ChevronDown size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-[1000px] max-w-[95vw] bg-white shadow-2xl rounded-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-8">
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                      {categories.map((parent) => (
                        <div key={parent.id} className="flex flex-col gap-3">
                          {/* TOMBOL INDUK */}
                          <button
                            onClick={() => { setCategory(parent.slug); setIsDropdownOpen(false); }}
                            className="text-left font-extrabold text-gray-900 hover:text-blue-600 transition-colors border-b border-gray-100 pb-2 flex items-center justify-between group"
                          >
                            {parent.name}
                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-400 group-hover:bg-blue-50">Induk</span>
                          </button>

                          {/* DAFTAR ANAK (LIST) */}
                          <ul className="flex flex-col gap-2">
                            {parent.children && parent.children.map((sub) => (
                              <li key={sub.id}>
                                <button
                                  onClick={() => { setCategory(sub.slug); setIsDropdownOpen(false); }}
                                  className="text-left text-sm text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2"
                                >
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  {sub.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-10">Data kategori tidak tersedia.</p>
                  )}
                </div>
                
                {/* Footer Dropdown */}
                <div className="bg-gray-50 p-4 border-t text-center">
                  <button 
                    onClick={() => { setCategory("Semua"); setIsDropdownOpen(false); }}
                    className="text-sm font-bold text-gray-500 hover:text-blue-600"
                  >
                    Tampilkan Semua Koleksi
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari buku..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Katalog Grid */}
      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {category === "Semua" ? "Koleksi Terbaru" : `Kategori ${category}`}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed rounded-3xl">
             <BookX className="mx-auto text-gray-300 mb-4" size={64} />
             <p className="text-gray-500">Buku tidak ditemukan.</p>
          </div>
        )}
      </main>
    </div>
  );
}