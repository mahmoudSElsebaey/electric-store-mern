import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBolt, FaFire } from "react-icons/fa";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getNextOfferEnd(): Date {
  // Ends every day at 23:59:59 local time (resets daily for urgency)
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  // If already past today, push to tomorrow
  if (end.getTime() <= Date.now()) {
    end.setDate(end.getDate() + 1);
  }
  return end;
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function SpecialOffersBanner() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const target = useMemo(() => getNextOfferEnd(), []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const tick = () => {
      const next = calcTimeLeft(target);
      setTimeLeft(next);
      // Brief pulse every second on the seconds box
      setPulse(true);
      setTimeout(() => setPulse(false), 180);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    {
      value: timeLeft.days,
      label: t("home_sections.special_offers.days", { defaultValue: "يوم" }),
    },
    {
      value: timeLeft.hours,
      label: t("home_sections.special_offers.hours", { defaultValue: "ساعة" }),
    },
    {
      value: timeLeft.minutes,
      label: t("home_sections.special_offers.minutes", { defaultValue: "دقيقة" }),
    },
    {
      value: timeLeft.seconds,
      label: t("home_sections.special_offers.seconds", { defaultValue: "ثانية" }),
      isSeconds: true,
    },
  ];

  return (
    <section
      className="relative my-16 md:my-24 overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-slate-900" />

      {/* Floating orbs / glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -start-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 -end-16 w-56 h-56 bg-primary-light/30 rounded-full blur-3xl animate-float-medium" />
        <div className="absolute -bottom-16 start-1/3 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl animate-float-fast" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Shimmer line across top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent animate-shimmer" />

      <div className="relative z-10 px-6 sm:px-10 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-start text-white">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-accent px-4 py-1.5 rounded-full text-sm font-bold mb-5 animate-badge-pulse">
              <FaFire className="text-orange-400 animate-bounce-soft" />
              {t("home_sections.special_offers.badge", {
                defaultValue: "عرض محدود الوقت",
              })}
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg"
              dangerouslySetInnerHTML={{
                __html: t("home_sections.special_offers.title"),
              }}
            />

            <p className="text-base sm:text-lg md:text-xl text-white/85 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("home_sections.special_offers.subtitle")}
            </p>

            <Link
              to="/store"
              className="group inline-flex items-center gap-3 bg-accent hover:bg-accent-dark text-primary-dark font-extrabold px-8 py-4 rounded-2xl text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.45)] shadow-xl"
            >
              <FaBolt className="group-hover:rotate-12 transition-transform" />
              {t("home_sections.special_offers.btn")}
            </Link>
          </div>

          {/* Countdown */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <p className="text-center text-white/80 font-medium mb-4 text-sm sm:text-base tracking-wide">
              {t("home_sections.special_offers.countdown")}
            </p>

            <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
              {units.map((unit, idx) => (
                <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`relative flex flex-col items-center justify-center w-[68px] h-[78px] sm:w-[80px] sm:h-[90px] md:w-[96px] md:h-[104px] rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-transform duration-200 ${
                      unit.isSeconds && pulse ? "scale-105 border-accent/60" : ""
                    }`}
                  >
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    <span
                      className={`relative text-2xl sm:text-3xl md:text-4xl font-black tabular-nums tracking-tight ${
                        unit.isSeconds ? "text-accent" : "text-white"
                      }`}
                    >
                      {pad(unit.value)}
                    </span>
                    <span className="relative text-[10px] sm:text-xs font-semibold text-white/70 mt-1 uppercase tracking-wider">
                      {unit.label}
                    </span>
                  </div>

                  {idx < units.length - 1 && (
                    <span className="text-accent text-xl sm:text-2xl font-bold opacity-70 hidden sm:block">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Urgency hint */}
            <p className="text-center mt-5 text-accent/90 text-sm font-medium animate-pulse-soft">
              {t("home_sections.special_offers.hurry", {
                defaultValue: "⚡ اسرع قبل ما العرض يخلص!",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />

      {/* Local keyframes (scoped via style tag to avoid global CSS edits) */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.08); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-25px, -15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.97); }
        }
        @keyframes shimmer {
          0% { opacity: 0.3; transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { opacity: 0.3; transform: translateX(100%); }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.35); }
          50% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
        }
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 7s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 4s ease-in-out infinite; }
        .animate-badge-pulse { animation: badge-pulse 2.2s ease-out infinite; }
        .animate-bounce-soft { animation: bounce-soft 1.4s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
