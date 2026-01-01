"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  Book,
  Users,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Pencil, // Tambahkan ini
  Plus,   // Tambahkan ini
  Loader2 // Tambahkan ini
} from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [statistic, setStatistic] = useState({
    total_books: 0,
    total_users: 0,
    total_orders: 0,
    category_counts: {
      Novel: 0,
      Sejarah: 0,
      Filosofi: 0,
      Pendidikan: 0,
      Biografi: 0,
    },
    book_activities: [],
  });

  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/statistics");
      // Mengambil data dari response.data.data sesuai struktur Laravel Anda
      if (response.data && response.data.data) {
        setStatistic(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role !== "admin") {
        router.push("/");
      } else {
        setAdminName(user.name);
        fetchDashboardData();
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const chartData = {
    labels: ["Novel", "Sejarah", "Filosofi", "Pendidikan", "Biografi"],
    datasets: [
      {
        data: [
          statistic.category_counts.Novel || 0,
          statistic.category_counts.Sejarah || 0,
          statistic.category_counts.Filosofi || 0,
          statistic.category_counts.Pendidikan || 0,
          statistic.category_counts.Biografi || 0,
        ],
        backgroundColor: [
          "#3B82F6", // Novel
          "#10B981", // Sejarah
          "#F59E0B", // Filosofi
          "#8B5CF6", // Pendidikan
          "#EC4899", // Biografi
        ],
        hoverOffset: 4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Memuat Data Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6 font-sans">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600">
            Selamat datang kembali, <span className="font-bold text-blue-600">{adminName}</span>
          </p>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Jumlah Buku"
            value={statistic.total_books}
            icon={<Book className="text-blue-600" />}
            trend="5%"
            isUp={true}
            color="blue"
          />
          <StatCard
            title="Jumlah User"
            value={statistic.total_users}
            icon={<Users className="text-green-600" />}
            trend="12%"
            isUp={true}
            color="green"
          />
          <StatCard
            title="Jumlah Order"
            value={statistic.total_orders}
            icon={<ShoppingCart className="text-orange-600" />}
            trend="2%"
            isUp={false}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Riwayat Aktivitas Buku */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Riwayat Aktivitas Buku</h3>
              <button onClick={() => router.push('/admin/books')} className="text-sm text-blue-600 hover:underline font-medium">
                Lihat Semua
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Buku</th>
                    <th className="px-6 py-4">Aksi</th>
                    <th className="px-6 py-4 text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statistic.book_activities?.length > 0 ? (
                    statistic.book_activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800 line-clamp-1">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.author}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.type === 'Ditambahkan' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.type === 'Ditambahkan' ? <Plus size={12} className="mr-1"/> : <Pencil size={12} className="mr-1"/>}
                            {activity.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-500 italic">
                          {activity.time}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-gray-400">
                        Belum ada aktivitas buku terbaru.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chart Distribusi */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Distribusi Kategori</h3>
            <div className="aspect-square">
              <Doughnut
                data={chartData}
                options={{
                  cutout: "75%",
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, isUp, color }: any) {
  const bgColors: any = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    orange: "bg-orange-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value?.toLocaleString()}</h3>
        </div>
        <div className={`p-3 ${bgColors[color]} rounded-lg`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`${isUp ? "text-green-500" : "text-red-500"} flex items-center font-medium`}>
          {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {trend}
        </span>
        <span className="text-gray-400 ml-2">vs bulan lalu</span>
      </div>
    </div>
  );
}