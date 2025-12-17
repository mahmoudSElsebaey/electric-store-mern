import { FaAward, FaHeadphones, FaShieldAlt, FaUsers } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { GoZap } from "react-icons/go";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { LuAlarmClockCheck } from "react-icons/lu";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            متجر الأجهزة الكهربائية الرائد في مصر
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            وجهتك الموثوقة لأحدث وأفضل الأجهزة الكهربائية المنزلية من العلامات
            التجارية العالمية
          </p>
          <div className="mt-10 flex justify-center gap-8">
            <div className="flex items-center gap-3 text-lg">
              <GoZap className="w-8 h-8 text-yellow-400" />
              <span>جودة عالمية</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <FaAward className="w-8 h-8 text-yellow-400" />
              <span>ضمان أصلي</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <FaTruckFast className="w-8 h-8 text-yellow-400" />
              <span>توصيل سريع</span>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#f9fafb"
              d="M0,0 C300,100 600,0 1440,80 L1440,120 L0,120 Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
                قصتنا بدأت من شغف بخدمة عملائنا
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                تأسس{" "}
                <span className="font-bold text-blue-600">
                  متجر الأجهزة الكهربائية
                </span>{" "}
                في عام 2025 بهدف واحد: توفير أفضل الأجهزة المنزلية الكهربائية
                لكل بيت مصري بجودة لا تُضاهى وأسعار تنافسية.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                نعمل مع أكبر العلامات التجارية العالمية مثل <strong>LG</strong>,{" "}
                <strong>Samsung</strong>,<strong> Bosch</strong>,{" "}
                <strong>Toshiba</strong>, <strong>Whirlpool</strong> وغيرها،
                لنقدم لكم تشكيلة واسعة من الثلاجات، الغسالات، التكييفات،
                البوتاجازات، والأجهزة الصغيرة.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    +50,000
                  </div>
                  <p className="text-gray-600">عميل سعيد</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    +10,000
                  </div>
                  <p className="text-gray-600">منتج أصلي</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    15
                  </div>
                  <p className="text-gray-600">فرع في مصر</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-600">دعم فني</p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8 shadow-2xl">
                  <img
                    src="/api/placeholder/600/700"
                    alt="متجر الأجهزة الكهربائية"
                    className="w-full rounded-2xl shadow-xl"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-2xl shadow-2xl">
                    <p className="text-3xl font-bold">منذ 2025</p>
                    <p className="text-sm">نبني الثقة يومًا بعد يوم</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-16">
            لماذا تختار متجرنا؟
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition">
                <FaTruckFast className="w-12 h-12 text-blue-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">توصيل مجاني وسريع</h3>
              <p className="text-gray-600 text-lg">
                توصيل مجاني للطلبات فوق 5000 جنيه في نفس اليوم بالقاهرة والجيزة،
                وباقي المحافظات خلال 48 ساعة
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 group-hover:bg-green-600 transition">
                <FaShieldAlt className="w-12 h-12 text-green-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">ضمان أصلي كامل</h3>
              <p className="text-gray-600 text-lg">
                ضمان مصنعي كامل على جميع المنتجات مع إمكانية الاستبدال أو
                الإرجاع خلال 14 يوم
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6 group-hover:bg-purple-600 transition">
                <FaHeadphones className="w-12 h-12 text-purple-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">دعم فني متخصص 24/7</h3>
              <p className="text-gray-600 text-lg">
                فريق دعم فني مدرب على أعلى مستوى جاهز للرد على استفساراتك في أي
                وقت
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6 group-hover:bg-orange-600 transition">
                <HiWrenchScrewdriver className="w-12 h-12 text-orange-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">تركيب وصيانة مجانية</h3>
              <p className="text-gray-600 text-lg">
                خدمة تركيب مجاني للأجهزة الكبيرة وصيانة دورية بأسعار مميزة
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-600 transition">
                <LuAlarmClockCheck className="w-12 h-12 text-indigo-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">تقسيط بدون فوائد</h3>
              <p className="text-gray-600 text-lg">
                خطط تقسيط مريحة تصل إلى 36 شهر بدون فوائد مع أكبر البنوك
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition duration-300">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-pink-100 rounded-full mb-6 group-hover:bg-pink-600 transition">
                <FaUsers className="w-12 h-12 text-pink-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-2xl font-bold mb-4">مجتمع عملاء كبير</h3>
              <p className="text-gray-600 text-lg">
                انضم إلى أكثر من 50 ألف عميل يثقون بنا يوميًا
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-2 border-red-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            جاهز لتجربة تسوق مختلفة؟
          </h2>
          <p className="text-xl mb-10">
            تصفح تشكيلتنا الواسعة الآن واستمتع بأفضل العروض والخدمات
          </p>
          <Link to="/store" className="bg-white text-blue-600 px-12 py-5 rounded-full text-2xl font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-2xl">
            تسوق الآن
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
