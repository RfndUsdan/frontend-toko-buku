import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

export default function BookCard({ book }: any) {
  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Container Gambar lebih ramping */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
        <img
          src={book.image ? `http://localhost:8000/storage/${book.image}` : "/placeholder.jpg"}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay Action lebih kecil */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link 
            href={`/books/${book.id}`}
            className="p-2 bg-white text-gray-900 rounded-full hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
          >
            <Eye size={16} />
          </Link>
          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      {/* Info Buku dengan font lebih kecil */}
      <div className="p-3 flex flex-col flex-grow">
        <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 mb-1">
          {book.category}
        </p>
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1 h-10">
          {book.title}
        </h3>
        <p className="text-[11px] text-gray-500 mb-2">{book.author}</p>
        
        <div className="mt-auto pt-2 border-t border-gray-50">
          <span className="font-bold text-blue-600 text-sm md:text-base">
            Rp {Number(book.price).toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );
}