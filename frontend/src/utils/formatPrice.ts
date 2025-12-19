
// دالة تحول الأرقام الإنجليزية لعربية
const toArabicNumerals = (num: number | string): string => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/[0-9]/g, (digit) => arabicDigits[Number(digit)]);
};

// دالة تنسيق السعر حسب اللغة
export const formatPrice = (price: number, language: string = "ar"): string => {
  const formattedPrice = price.toLocaleString("en-US"); // دايمًا نستخدم الإنجليزي للفواصل

  if (language === "ar") {
    return `${toArabicNumerals(formattedPrice)} ج.م`;
  }

  return `${formattedPrice} EGP`;
};
