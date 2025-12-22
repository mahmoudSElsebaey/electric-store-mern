// src/components/SectionTitle.tsx
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaTools,
  FaTag,
  FaStar,
  FaLongArrowAltLeft,
  FaLongArrowAltRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

type SectionTitleProps = {
  title: string;
  link?: string;
  icon?: "bolt" | "tools" | "tag" | "star";
};

export default function SectionTitle({ title, link, icon }: SectionTitleProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const getIcon = () => {
    switch (icon) {
      case "bolt":
        return (
          <FaBolt className="text-yellow-400 text-xl md:text-3xl lg:text-5xl" />
        );
      case "tools":
        return (
          <FaTools className="text-yellow-400 text-xl md:text-3xl lg:text-5xl" />
        );
      case "tag":
        return (
          <FaTag className="text-yellow-400 text-xl md:text-3xl lg:text-5xl" />
        );
      case "star":
        return (
          <FaStar className="text-yellow-400 text-xl md:text-3xl lg:text-5xl" />
        );
      default:
        return (
          <FaBolt className="text-yellow-400 text-xl md:text-3xl lg:text-5xl" />
        );
    }
  };

  return (
    <div
      className="relative container mx-auto px-6 py-12 overflow-hidden"
      dir={isRTL ? "ltr" : ""}
    >
      {/* خلفية متدرجة خفيفة */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-50 via-purple-50 to-pink-50 opacity-70 -z-10"></div>

      <div
        className={`flex flex-col ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        } items-center justify-between gap-6`}
      >
        {/* العنوان + الأيقونة */}
        <div className="flex items-center gap-6">
          {getIcon()}

          <div>
            <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 relative inline-block">
              {title}
              {/* خط سفلي متدرج */}
              <span
                className={`absolute -bottom-3 ${
                  isRTL ? "right-0" : "left-0"
                } w-full h-1 bg-linear-to-r from-indigo-600 to-purple-700 rounded-full transform scale-x-75 group-hover:scale-x-100 transition-transform`}
              ></span>
            </h2>
          </div>
        </div>

        {/* زر عرض الكل */}
        {link && (
          <Link
            to={link}
            className="group flex items-center gap-2 text-sm md:text-[16px] font-bold   transition transform hover:scale-105 text-blue-600 hover:text-blue-800"
          >
            {isRTL && <FaLongArrowAltLeft className="group-hover:animate-pulse" />}
            {t("common.view_all", { defaultValue: "عرض الكل" })}
            {!isRTL && <FaLongArrowAltRight  className="group-hover:animate-pulse" />}
            
          </Link>
        )}
      </div>

      {/* موجة سفلية للأناقة */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white to-100 to-transparent"></div>
    </div>
  );
}
