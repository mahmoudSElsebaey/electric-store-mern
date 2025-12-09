export default function Contact() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold text-center text-gray-800 mb-16">
            تواصل معنا
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-bold mb-8">أرسل لنا رسالة</h2>
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="اسمك"
                  className="w-full p-4 rounded-xl border text-lg"
                />
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full p-4 rounded-xl border text-lg"
                />
                <textarea
                  placeholder="رسالتك"
                  rows={6}
                  className="w-full p-4 rounded-xl border text-lg"
                ></textarea>
                <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition">
                  إرسال الرسالة
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-2xl p-10">
                <h3 className="text-2xl font-bold mb-6">معلومات التواصل</h3>
                <div className="space-y-5 text-lg">
                  <p className="flex items-center gap-4">
                    <span className="text-3xl">📞</span> 0100 123 4567
                  </p>
                  <p className="flex items-center gap-4">
                    <span className="text-3xl">✉️</span>{" "}
                    support@electricaltools.com
                  </p>
                  <p className="flex items-center gap-4">
                    <span className="text-3xl">📍</span> القاهرة - مصر الجديدة
                  </p>
                  <p className="flex items-center gap-4">
                    <span className="text-3xl">🕒</span> من 9 صباحًا إلى 11
                    مساءً
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
