"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2,
  ChevronRight
} from "lucide-react";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCartItems(response.data.data || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQty } : item
      ));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal memperbarui jumlah buku",
        confirmButtonColor: "#9ca3af" // gray-400
      });
    }
  };

  const removeItem = async (id: number) => {
    const result = await Swal.fire({
      title: "Hapus Buku?",
      text: "Buku ini akan dikeluarkan dari keranjang belanja Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f2937", // gray-800
      cancelButtonColor: "#d1d5db", // gray-300
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/cart/${id}`);
        setCartItems(cartItems.filter(item => item.id !== id));
        Swal.fire({
          icon: "success",
          title: "Terhapus",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus item.", "error");
      }
    }
  };

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsCheckingOut(true);
      
      // 1. Ambil semua ID dari item yang ada di keranjang
      const cartIds = cartItems.map((item) => item.id);

      // 2. Kirim ke API backend yang sudah kamu buat tadi
      const response = await api.post("/checkout", {
        cart_ids: cartIds,
      });

      if (response.status === 201) {
        // 3. Notifikasi sukses
        await Swal.fire({
          icon: "success",
          title: "Checkout Berhasil!",
          text: "Pesanan Anda telah dibuat. Silakan lakukan pembayaran.",
          confirmButtonColor: "#1f2937",
        });

        // 4. Arahkan langsung ke halaman pesanan (Orders Page)
        router.push("/orders");
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Checkout Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan sistem.",
        confirmButtonColor: "#9ca3af",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (item.book.price * item.quantity);
  }, 0);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="text-gray-400" size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">Keranjang Kosong</h2>
          <p className="text-gray-400 mb-10 font-medium">Sepertinya Anda belum memilih buku impian.</p>
          <Link href="/" className="inline-flex items-center justify-center bg-gray-400 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-500 transition-all active:scale-95">
            Cari Buku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => router.back()} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={24} className="text-gray-400" />
          </button>
          <h1 className="text-3xl tracking-tighter text-gray-800">Keranjang Saya</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* List Item Keranjang */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center">
                {/* Gambar Buku */}
                <div className="w-28 h-40 shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <img 
                    src={item.book.image ? `http://localhost:8000/storage/${item.book.image}` : "/placeholder.jpg"} 
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Detail Buku */}
                <div className="flex-1 w-full flex flex-col justify-between h-40 py-1">
                  <div>
                    <h3 className="text-xl leading-tight mb-1 line-clamp-1 text-gray-800">{item.book.title}</h3>
                    <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">{item.book.author}</p>
                    <p className="text-2xl text-gray-800">
                      Rp{Number(item.book.price).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    {/* Kontrol Kuantitas */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 border-2 border-gray-400">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400"
                      >
                        <Minus size={18} strokeWidth={3} />
                      </button>
                      <span className="px-6 text-lg font-black min-w-[50px] text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="bg-red-50 text-red-400 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan Belanja */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-gray-400 sticky top-28">
              <h3 className="text-2xl font-black mb-8 border-b pb-4 text-gray-800">Ringkasan</h3>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-gray-400 uppercase text-xs tracking-widest">
                  <span>Total ({cartItems.length} Buku)</span>
                  <span className="text-gray-800">Rp{totalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-400 uppercase text-xs tracking-widest">
                  <span>Pengiriman</span>
                  <span className="text-green-600">Gratis Ongkir</span>
                </div>
                <div className="border-t-2 border-dashed border-gray-200 pt-6 flex justify-between items-end">
                  <span className="font-black text-lg text-gray-700">Total Bayar</span>
                  <span className="text-2xl text-gray-800 tracking-tighter">
                    Rp{totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut} // Disable saat sedang proses
                className={`w-full text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl uppercase tracking-widest ${
                  isCheckingOut ? "bg-gray-300 cursor-not-allowed" : "bg-gray-800 hover:bg-black"
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="animate-spin" size={24} /> Memproses...
                  </>
                ) : (
                  <>
                    Checkout <ChevronRight size={24} className="text-white" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}