'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios';
import { ChevronLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useParams(); // Mengambil ID dari URL
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. Ambil data buku lama saat halaman dibuka
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        const book = response.data.data || response.data;
        
        setFormData({
          title: book.title,
          author: book.author,
          price: book.price.toString(),
          category: book.category,
          description: book.description,
        });

        if (book.image) {
          setPreview(`http://localhost:8000/storage/${book.image}`);
        }
      } catch (error) {
        alert("Gagal mengambil detail buku");
        router.push('/admin/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [id, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('_method', 'PUT'); 
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await api.post(`/admin/books/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // 3. GANTI ALERT SAAT BERHASIL UPDATE
      Swal.fire({
        title: 'Perubahan Disimpan!',
        text: 'Data buku telah berhasil diperbarui.',
        icon: 'success',
        confirmButtonColor: '#2563eb', // Biru
      }).then(() => {
        // Redirect hanya setelah user menekan tombol OK
        router.push('/admin/books');
      });

    } catch (error: any) {
      console.error("Update error:", error);
      const errorMessage = error.response?.data?.message || "Gagal memperbarui buku.";

      // 4. GANTI ALERT SAAT GAGAL UPDATE
      Swal.fire({
        title: 'Gagal Menyimpan!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#ef4444', // Merah
      });
      
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/books" className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors">
          <ChevronLeft size={20} />
          <span className="font-medium">Batal dan Kembali</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 text-gray-800 font-bold text-xl">
            Edit Data Buku
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Buku</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Penulis</label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <select 
                  required
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Pilih Kategori</option>
                  <option value="Novel">Novel</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Filosofi">Filosofi</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Biografi">Biografi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
                <input 
                  type="number" required 
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ganti Cover (Opsional)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-white transition-all overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-contain p-2" />
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
              <textarea 
                required rows={4}
                className="w-full px-4 py-3 border border-gray-300 bg-gray-50 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" disabled={updating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:bg-blue-300"
            >
              {updating ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              {updating ? 'Memperbarui...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}