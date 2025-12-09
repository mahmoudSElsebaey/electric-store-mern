 
export default function About() {
  return (
    <>
 
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-10">من نحن</h1>
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <p className="text-2xl text-gray-700 leading-relaxed mb-8">
              نحن <span className="text-blue-600 font-bold">متجر الأدوات الكهربائية</span>، 
              الوجهة الأولى لكل مهندس وفني وهاوي في مصر والوطن العربي.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              منذ 2025 ونحن نقدم أفضل الأدوات الكهربائية من أشهر الماركات العالمية 
              (Wera, Knipex, Bosch, Makita, Stanley وغيرها) بأسعار منافسة وجودة مضمونة 100%.
            </p>
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-2xl font-bold">توصيل مجاني</h3>
                <p>للطلبات أكثر من 1000 جنيه</p>
              </div>
              <div className="bg-green-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold">ضمان أصلي</h3>
                <p>على جميع المنتجات</p>
              </div>
              <div className="bg-purple-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">🛠️</div>
                <h3 className="text-2xl font-bold">دعم فني 24/7</h3>
                <p>فريق متخصص جاهز لمساعدتك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
}