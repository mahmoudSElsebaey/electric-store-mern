import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

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

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-lg hover:from-teal-500 hover:to-teal-700 hover:scale-110 transition-all duration-300 flex items-center justify-center border-2 border-amber-400/50 hover:border-amber-400"
    >
      <FaArrowUp className="text-lg md:text-xl" />
    </button>
  );
}
