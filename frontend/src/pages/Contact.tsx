import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white py-32 overflow-hidden" dir="rtl">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
            تواصل معنا
          </h1>
          <p className="text-xl md:text-3xl font-light max-w-4xl mx-auto leading-relaxed">
            فريقنا جاهز للرد على استفساراتك في أي وقت – نحن هنا لمساعدتك!
          </p>
          <div className="mt-12 flex justify-center gap-25 text-2xl">
            <div className="flex items-center gap-3">
              <FaWhatsapp className="w-10 h-10 text-green-400" />
              <span>واتساب مباشر</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="w-10 h-10 text-yellow-400" />
              <span>خط ساخن 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 lg:p-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-8">
                أرسل لنا رسالة
              </h2>
              <form className="space-y-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    اسمك الكريم
                  </label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك"
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    بريدك الإلكتروني
                  </label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    placeholder="0100 123 4567"
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    رسالتك
                  </label>
                  <textarea
                    placeholder="اكتب رسالتك هنا..."
                    rows={7}
                    className="w-full px-6 py-5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 rounded-xl text-2xl font-bold hover:from-blue-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-2xl"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Contact Info + Map Placeholder */}
            <div className="space-y-12">
              {/* معلومات التواصل */}
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h3 className="text-3xl font-bold text-gray-800 mb-10">
                  معلومات التواصل
                </h3>
                <div className="space-y-8 text-lg">
                  <div className="flex items-start gap-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <FaPhoneAlt className="w-8 h-8 text-blue-600" />
                    </div>
                    <div  dir="ltr">
                      <p className="font-bold text-xl">0100 123 4567</p>
                      <p className="text-gray-600">خط ساخن - متاح 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <FaWhatsapp className="w-8 h-8 text-green-600" />
                    </div>
                    <div  dir="ltr">
                      <p className="font-bold text-xl">0100 123 4567</p>
                      <p className="text-gray-600">دعم فوري عبر واتساب</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-red-100 p-4 rounded-full">
                      <FaEnvelope className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">
                        support@electrostore.eg
                      </p>
                      <p className="text-gray-600">البريد الإلكتروني للدعم</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <FaMapMarkerAlt className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">القاهرة - مدينة نصر</p>
                      <p className="text-gray-600">
                        الفرع الرئيسي + 15 فرع آخر في المحافظات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="bg-yellow-100 p-4 rounded-full">
                      <FaClock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-xl">
                        من 9 صباحًا إلى 11 مساءً
                      </p>
                      <p className="text-gray-600">
                        يوميًا - الجمعة من 2 ظهرًا
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-12">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6">
                    تابعنا على
                  </h4>
                  <div className="flex gap-6 text-4xl text-white">
                    <a
                      href="#"
                      className="bg-blue-600 p-4 rounded-full hover:bg-blue-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="#"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full hover:from-purple-700 hover:to-pink-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaInstagram />
                    </a>
                    <a
                      href="#"
                      className="bg-sky-500 p-4 rounded-full hover:bg-sky-600 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaTwitter />
                    </a>
                    <a
                      href="#"
                      className="bg-red-600 p-4 rounded-full hover:bg-red-700 hover:-translate-y-2 transition shadow-lg"
                    >
                      <FaYoutube />
                    </a>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 border-2 border-dashed rounded-3xl w-full h-96 flex items-center justify-center">
                <p className="text-3xl text-gray-500">
                  خريطة الموقع (Google Maps)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
