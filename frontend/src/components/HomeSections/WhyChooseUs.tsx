import { useTranslation } from "react-i18next";
import {
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaTags,
  FaBolt,
  FaUndo,
} from "react-icons/fa";

const features = [
  {
    icon: FaShieldAlt,
    titleKey: "home.why.warranty_title",
    descKey: "home.why.warranty_desc",
    titleFallback: { ar: "ضمان أصلي", en: "Genuine Warranty" },
    descFallback: {
      ar: "منتجات أصلية بضمان الوكيل المعتمد",
      en: "Original products with authorized warranty",
    },
  },
  {
    icon: FaTruck,
    titleKey: "home.why.delivery_title",
    descKey: "home.why.delivery_desc",
    titleFallback: { ar: "توصيل سريع", en: "Fast Delivery" },
    descFallback: {
      ar: "شحن لجميع المحافظات خلال 24–72 ساعة",
      en: "Nationwide shipping within 24–72 hours",
    },
  },
  {
    icon: FaHeadset,
    titleKey: "home.why.support_title",
    descKey: "home.why.support_desc",
    titleFallback: { ar: "دعم فني", en: "Expert Support" },
    descFallback: {
      ar: "فريق متخصص لمساعدتك قبل وبعد الشراء",
      en: "Specialists to help before & after purchase",
    },
  },
  {
    icon: FaTags,
    titleKey: "home.why.prices_title",
    descKey: "home.why.prices_desc",
    titleFallback: { ar: "أسعار منافسة", en: "Best Prices" },
    descFallback: {
      ar: "عروض دورية وأسعار مناسبة لكل الميزانيات",
      en: "Regular deals for every budget",
    },
  },
  {
    icon: FaBolt,
    titleKey: "home.why.install_title",
    descKey: "home.why.install_desc",
    titleFallback: { ar: "تركيب محترف", en: "Pro Installation" },
    descFallback: {
      ar: "خدمة تركيب وصيانة للأجهزة الكبرى",
      en: "Installation & service for major appliances",
    },
  },
  {
    icon: FaUndo,
    titleKey: "home.why.return_title",
    descKey: "home.why.return_desc",
    titleFallback: { ar: "إرجاع سهل", en: "Easy Returns" },
    descFallback: {
      ar: "سياسة استبدال وإرجاع واضحة خلال 14 يوم",
      en: "Clear 14-day exchange & return policy",
    },
  },
];

export default function WhyChooseUs() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const lang = (i18n.language === "ar" ? "ar" : "en") as "ar" | "en";

  return (
    <section
      className="py-14 sm:py-20 bg-gradient-to-b from-primary-soft/40 to-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-bold uppercase tracking-wider text-primary mb-2">
            {t("home.why.badge", {
              defaultValue: lang === "ar" ? "لماذا نحن" : "Why us",
            })}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-ink">
            {t("home.why.title", {
              defaultValue:
                lang === "ar"
                  ? "لماذا تختار فولت ستور؟"
                  : "Why choose Volt Store?",
            })}
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.titleKey}
                className="group rounded-2xl bg-white border border-primary/10 p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">
                  {t(f.titleKey, { defaultValue: f.titleFallback[lang] })}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(f.descKey, { defaultValue: f.descFallback[lang] })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
