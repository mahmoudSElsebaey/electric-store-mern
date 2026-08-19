import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!visible) return null;

  const sideClass = isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6";

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 z-[60] w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-accent/60 hover:border-accent ${sideClass}`}
    >
      <FaArrowUp className="text-lg md:text-xl" />
    </button>
  );
}
