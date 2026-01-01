"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import Footer from "@/components/Footer";

export default function ManageBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async (search = "") => {
    try {
      setLoading(true);
      // Mengirim parameter search ke API Laravel
      const response = await api.get(`/books?search=${search}`);
      
      // Mengambil array dari struktur pagination Laravel
      const actualArray = response.data.data.data;

      if (Array.isArray(actualArray)) {
        setBooks(actualArray);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    } finally {
      setLoading(false);
    }
  };

  // Menjalankan pencarian saat searchTerm berubah (dengan sedikit delay/debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks(searchTerm);
    }, 500); // Tunggu 500ms setelah user berhenti mengetik

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id: number, title: string) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Buku "${title}" akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Tidak, Batal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/books/${id}`);
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Buku telah berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        // PERBAIKAN: Refresh data tanpa reload halaman
        fetchBooks(searchTerm); 

      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat menghapus data.',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="container mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Kelola Buku</h1>
            <p className="text-gray-600">Daftar inventaris buku toko Anda.</p>
          </div>
          <Link
            href="/admin/books/add"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            <Plus size={20} /> Tambah Buku Baru
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            className="w-full outline-none bg-transparent text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABEL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600 border-b">Gambar</th>
                  <th className="p-4 font-semibold text-gray-600 border-b">Judul & Penulis</th>
                  <th className="p-4 font-semibold text-gray-600 border-b">Harga</th>
                  <th className="p-4 font-semibold text-gray-600 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-500" />
                    </td>
                  </tr>
                ) : books.length > 0 ? (
                  books.map((book) => (
                    <tr key={book.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="h-16 w-12 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
                          {book.image ? (
                            <img
                              src={`http://localhost:8000/storage/${book.image}`}
                              className="h-full w-full object-cover"
                              alt={book.title}
                            />
                          ) : (
                             <div className="flex h-full items-center justify-center text-[10px] text-gray-400">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                      </td>
                      <td className="p-4 font-semibold text-blue-600">
                        Rp {Number(book.price).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/books/edit/${book.id}`}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id, book.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400">
                      Buku tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}