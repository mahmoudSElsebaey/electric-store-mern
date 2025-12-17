import { Link } from "react-router-dom";

export default function SpecialOffersBanner() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden my-16" dir="rtl">
      {/* Background Image – غير الرابط بصورة من Cloudinary أو public */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="عروض خاصة"
          className="w-full h-full object-cover bg-fixed top-0"
        />
        <div className="absolute inset-0 bg-linear-to-l from-black/70 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative container max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            عروض خاصة <span className="text-yellow-400">تصل إلى 50%</span>
          </h2>
          <p className="text-2xl md:text-3xl mb-8">
            على ثلاجات، غسالات، تكييفات، وأجهزة مطبخ مختارة – عرض محدود الوقت!
          </p>
          <Link
            to="/store?discount=true" // أو /offers لو عملت page خاصة
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-5 px-12 rounded-2xl text-2xl transition transform hover:scale-110 shadow-2xl"
          >
            تسوق العروض الآن 🔥
          </Link>
        </div>
      </div>

      {/* Optional: Countdown Timer لو عايز */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-8 py-4 rounded-2xl shadow-2xl">
        <p className="text-2xl font-bold text-gray-800 text-center">العرض ينتهي بعد:</p>
        <div className="flex gap-4 justify-center mt-2 text-3xl font-bold">
          <span>02</span>:<span>15</span>:<span>47</span>:<span>12</span>
        </div>
      </div>
    </section>
  );
}