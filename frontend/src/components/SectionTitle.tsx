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
        return <FaBolt className="text-accent text-xl md:text-3xl lg:text-5xl" />;
      case "tools":
        return <FaTools className="text-accent text-xl md:text-3xl lg:text-5xl" />;
      case "tag":
        return <FaTag className="text-accent text-xl md:text-3xl lg:text-5xl" />;
      case "star":
        return <FaStar className="text-accent text-xl md:text-3xl lg:text-5xl" />;
      default:
        return <FaBolt className="text-accent text-xl md:text-3xl lg:text-5xl" />;
    }
  };

  return (
    <div
      className="relative container mx-auto px-6 py-12 overflow-hidden"
      dir={isRTL ? "ltr" : ""}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-soft via-primary-soft to-accent-soft opacity-70 -z-10"></div>

      <div
        className={`flex flex-col ${
          isRTL ? "md:flex-row-reverse" : "md:flex-row"
        } items-center justify-between gap-6`}
      >
        <div className="flex items-center gap-6">
          {getIcon()}
          <div>
            <h2 className="text-xl md:text-4xl font-extrabold text-gray-900 relative inline-block">
              {title}
              <span
                className={`absolute -bottom-3 ${
                  isRTL ? "right-0" : "left-0"
                } w-full h-1 bg-gradient-to-r from-primary to-primary-dark rounded-full transform scale-x-75`}
              ></span>
            </h2>
          </div>
        </div>

        {link && (
          <Link
            to={link}
            className="group flex items-center gap-2 text-sm md:text-[16px] font-bold text-primary hover:text-primary-dark transition transform hover:scale-105"
          >
            {t("home.view_all", { defaultValue: "عرض الكل" })}
            {isRTL ? (
              <FaLongArrowAltLeft className="group-hover:-translate-x-1 transition" />
            ) : (
              <FaLongArrowAltRight className="group-hover:translate-x-1 transition" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
