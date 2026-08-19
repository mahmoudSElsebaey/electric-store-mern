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

  const icons = {
    bolt: FaBolt,
    tools: FaTools,
    tag: FaTag,
    star: FaStar,
  };
  const Icon = icons[icon || "bolt"] || FaBolt;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary shadow-sm">
            <Icon className="text-lg sm:text-2xl" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-ink tracking-tight">
              {title}
            </h2>
            <div className="mt-2 h-1 w-16 sm:w-24 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>

        {link && (
          <Link
            to={link}
            className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary-soft"
          >
            {t("common.view_all")}
            {isRTL ? (
              <FaLongArrowAltLeft className="transition group-hover:-translate-x-0.5" />
            ) : (
              <FaLongArrowAltRight className="transition group-hover:translate-x-0.5" />
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
