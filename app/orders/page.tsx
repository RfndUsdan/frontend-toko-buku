"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  ArrowLeft,
  Loader2,
  Package,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/my-orders");
      setOrders(response.data.data || []);
    } catch (error: any) {
      if (error.response?.status === 401) router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    const result = await Swal.fire({
      title: "Batalkan Pesanan?",
      text: "Tindakan ini tidak dapat dibatalkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // merah
      cancelButtonColor: "#9ca3af", // abu-abu
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Kembali",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/orders/${orderId}/cancel`);

        // Update state lokal agar tampilan langsung berubah
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: "cancelled" } : order
          )
        );

        Swal.fire({
          icon: "success",
          title: "Dibatalkan",
          text: "Pesanan Anda telah berhasil dibatalkan.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire(
          "Gagal",
          error.response?.data?.message || "Terjadi kesalahan",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "success":
        return "bg-green-100 text-green-600 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => router.push("/")}
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50"
          >
            <ArrowLeft size={24} className="text-gray-400" />
          </button>
          <h1 className="text-3xl tracking-tighter text-gray-800">
            Pesanan Saya
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center">
            <Package className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold">
              Belum ada riwayat pesanan.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                      ID Pesanan
                    </p>
                    <p className=" text-gray-800">#ORD-{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
                      Tanggal
                    </p>
                    <p className=" text-gray-800">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl border text-xs uppercase tracking-wider ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={
                            item.book.image
                              ? `http://localhost:8000/storage/${item.book.image}`
                              : "/placeholder.jpg"
                          }
                          className="w-full h-full object-cover"
                          alt={item.book.title}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className=" text-gray-800 line-clamp-1">
                          {item.book.title}
                        </h4>
                        <p className="text-sm text-gray-400 font-bold">
                          {item.quantity} x Rp
                          {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-6 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase">
                      Total Bayar
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      Rp{Number(order.total_price).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all border border-red-100"
                        >
                          <XCircle size={18} /> Batal
                        </button>
                        <button className="bg-gray-800 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                          Bayar Sekarang
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
