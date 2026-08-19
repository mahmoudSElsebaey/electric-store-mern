import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  // Sidebar on start side → button on opposite side; offset when admin + RTL
  const finalSide =
    isAdmin && isRTL
      ? "left-6 lg:left-[calc(1.5rem+16rem)]"
      : isRTL
        ? "left-6"
        : "right-6";

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-accent/60 hover:border-accent ${finalSide}`}
    >
      <FaArrowUp className="text-lg md:text-xl" />
    </button>
  );
}
