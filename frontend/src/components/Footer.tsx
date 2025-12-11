// src/components/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-gray-900 to-black text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* العمود الأول - المتجر */}
        <div>
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            ⚡ متجر الأدوات الكهربائية
          </h3>
          <p className="text-gray-400 leading-relaxed">
            أكبر متجر إلكتروني متخصص في الأدوات الكهربائية والمعدات الاحترافية في مصر والوطن العربي</p>
        </div>

        {/* الروابط السريعة */}
        <div>
          <h4 className="text-2xl font-bold mb-6">روابط سريعة</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="hover:text-blue-400 transition">الرئيسية</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition">من نحن</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">تواصل معنا</Link></li>
            <li><Link to="/admin" className="hover:text-blue-400 transition">لوحة الإدارة</Link></li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div>
          <h4 className="text-2xl font-bold mb-6">تواصل معنا</h4>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <span>0100 123 4567</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <span>support@electricaltools.com</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span>القاهرة - مصر الجديدة</span>
            </li>
          </ul>
        </div>

        {/* أيقونات السوشيال */}
        <div>
          <h4 className="text-2xl font-bold mb-6">تابعنا</h4>
          <div className="flex gap-5 text-4xl">
            <a href="#" className="hover:text-blue-400 transition">📘</a>
            <a href="#" className="hover:text-pink-400 transition">📷</a>
            <a href="#" className="hover:text-blue-500 transition">🐦</a>
            <a href="#" className="hover:text-red-500 transition">▶️</a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2025 متجر الأدوات الكهربائية - جميع الحقوق محفوظة</p>
        <p className="mt-2 text-sm">تم التطوير بحب ⚡ من محمد</p>
      </div>
    </footer>
  );
}