import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SpecialOffersBanner() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <section
      className="relative h-[60vh] md:h-[80vh] overflow-hidden my-16"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt={t("home_sections.special_offers.title")}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            isRTL ? "bg-linear-to-l" : "bg-linear-to-r"
          } from-black/70 to-transparent`}
        />
      </div>

      <div className="relative container max-w-7xl mx-auto px-6 h-full flex items-center">
        <div
          className={`max-w-2xl text-white ${!isRTL && "ml-auto text-right"}`}
        >
          <h2
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            dangerouslySetInnerHTML={{
              __html: t("home_sections.special_offers.title"),
            }}
          />
          <p className="text-2xl md:text-3xl mb-8">
            {t("home_sections.special_offers.subtitle")}
          </p>
          <Link
            to="/store?discount=true"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-5 px-12 rounded-2xl text-2xl transition transform hover:scale-110 shadow-2xl"
          >
            {t("home_sections.special_offers.btn")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-8 py-4 rounded-2xl shadow-2xl">
        <p className="text-2xl font-bold text-gray-800 text-center">
          {t("home_sections.special_offers.countdown")}
        </p>
        <div className="flex gap-4 justify-center mt-2 text-3xl font-bold">
          <span>{t("home_sections.special_offers.placeholder_time")}</span>
        </div>
      </div>
    </section>
  );
}
