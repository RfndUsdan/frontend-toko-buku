'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ChevronLeft, Save, Image as ImageIcon, Loader2, BookOpen, Globe, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',      // Baru
    published_year: '', // Baru
    language: '',       // Baru
    pages: '',          // Baru
    price: '',
    category: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Menambahkan semua field ke FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, (formData as any)[key]);
    });
    
    if (imageFile) data.append('image', imageFile);

    try {
      await api.post('/admin/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Buku baru telah ditambahkan ke koleksi.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      }).then(() => {
        router.push('/admin/books');
      });

    } catch (error: any) {
      Swal.fire({
        title: 'Gagal!',
        text: error.response?.data?.message || "Terjadi kesalahan saat menambah buku.",
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/books" className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium">Kembali ke Daftar Buku</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h1 className="text-2xl font-bold text-gray-800">Tambah Buku Baru</h1>
            <p className="text-sm text-gray-500">Lengkapi data informasi buku secara detail.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Baris 1: Judul Utama */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Buku</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  placeholder="Contoh: Laskar Pelangi"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Baris 2: Penulis & Penerbit */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Penulis</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none"
                  placeholder="Nama Penulis"
                  value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Penerbit</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="text" required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none"
                    placeholder="Nama Penerbit"
                    value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                  />
                </div>
              </div>

              {/* Baris 3: Tahun Terbit & Bahasa */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun Terbit</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="number" required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none"
                    placeholder="2024"
                    value={formData.published_year} onChange={(e) => setFormData({...formData, published_year: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Bahasa
                </label>
                <div className="relative">
                  {/* Ikon Bola Dunia (Warna Hitam) */}
                  <Globe className="absolute left-3 top-3.5 text-gray-400 z-10" size={18} />
                  
                  <select 
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none appearance-none cursor-pointer"
                    value={formData.language} 
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                  >
                    <option value="" disabled className="text-gray-400">Pilih Bahasa</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                  </select>

                  {/* Ikon panah bawah tambahan (opsional) untuk memperjelas ini dropdown */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Baris 4: Halaman & Kategori */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Halaman</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="number" required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none"
                    placeholder="0"
                    value={formData.pages} onChange={(e) => setFormData({...formData, pages: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select 
                  required
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none appearance-none cursor-pointer"
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="Novel">Novel</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Filosofi">Filosofi</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Biografi">Biografi</option>
                  <option value="Teknologi">Teknologi</option>
                </select>
              </div>

              {/* Baris 5: Harga & Cover */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
                <input 
                  type="number" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none"
                  placeholder="0"
                  value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Buku</label>
                <label className="flex flex-col items-center justify-center w-full h-[50px] border border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-white transition-all overflow-hidden">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="text-gray-400" size={18} />
                    <span className="text-xs text-gray-500">{imageFile ? imageFile.name : 'Pilih File Gambar'}</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                {preview && (
                   <div className="mt-2 h-20 w-16 rounded border overflow-hidden">
                     <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                   </div>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Buku</label>
              <textarea 
                required rows={4}
                className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 text-gray-900 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Sinopsis singkat..."
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-300 transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {loading ? 'Menyimpan...' : 'Simpan Koleksi Buku'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}