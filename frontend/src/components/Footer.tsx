// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-linear-to-r from-gray-900 via-black to-gray-900 text-white py-16 mt-auto" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* العمود الأول - عن المتجر */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-yellow-400 text-4xl">⚡</span>
              متجر الأجهزة الكهربائية
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              وجهتك الأولى لشراء أحدث الأجهزة المنزلية الكهربائية في مصر. 
              نضمن لك الجودة العالمية، الأسعار المنافسة، والخدمة الممتازة.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="bg-blue-600 p-3 rounded-full">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <span className="text-lg font-medium">تواصل معنا عبر واتساب</span>
            </div>
          </div>

          {/* الروابط السريعة */}
          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              روابط سريعة
              <span className="absolute -bottom-2 right-0 w-[50%] h-[3px] bg-yellow-400 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition flex items-center gap-2">
                  <span>🏠</span> الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-yellow-400 transition flex items-center gap-2">
                  <span>🛒</span> جميع المنتجات
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition flex items-center gap-2">
                  <span>ℹ️</span> من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition flex items-center gap-2">
                  <span>📞</span> تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              تواصل معنا
              <span className="absolute -bottom-2 right-0 w-[50%] h-[3px] bg-yellow-400 rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-gray-300">
              <li className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <FaPhoneAlt className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">0100 123 4567</p>
                  <p className="text-sm">خط ساخن 24/7</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <FaEnvelope className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">support@electrostore.eg</p>
                  <p className="text-sm">الدعم الفني</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <FaMapMarkerAlt className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">القاهرة - مدينة نصر</p>
                  <p className="text-sm">15 فرع في جميع المحافظات</p>
                </div>
              </li>
            </ul>
          </div>

          {/* تابعنا على السوشيال */}
          <div>
            <h4 className="text-2xl font-bold mb-8 relative inline-block">
              تابعنا
              <span className="absolute -bottom-2 right-0 w-[60%] h-[3px] bg-yellow-400 rounded-full"></span>
            </h4>
            <p className="text-gray-300 mb-6">
              انضم إلى مجتمعنا واكتشف أحدث العروض والنصائح اليومية
            </p>
            <div className="flex gap-5 text-3xl">
              <a 
                href="#" 
                className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="w-14 h-14 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 hover:-translate-y-2 transition-all duration-300 shadow-lg"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* السطر السفلي */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
            <p>&copy; 2025 متجر الأجهزة الكهربائية - جميع الحقوق محفوظة</p>
            <div className="flex gap-8 text-sm">
              <Link to="/privacy" className="hover:text-yellow-400 transition">سياسة الخصوصية</Link>
              <Link to="/terms" className="hover:text-yellow-400 transition">الشروط والأحكام</Link>
              <Link to="/returns" className="hover:text-yellow-400 transition">سياسة الإرجاع</Link>
            </div>
            <p className="text-sm">تم التطوير بحب ⚡ من محمود السباعي</p>
          </div>
        </div>
      </div>
    </footer>
  );
}