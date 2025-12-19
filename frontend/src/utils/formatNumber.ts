 
// تحويل الأرقام الإنجليزية لعربية (٠١٢٣٤٥٦٧٨٩)
const toArabicNumerals = (num: number | string): string => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num).replace(/[0-9]/g, (digit) => arabicDigits[Number(digit)]);
};

// تنسيق الرقم حسب اللغة
export const formatNumber = (num: number, language: string = "ar"): string => {
  const formatted = num.toLocaleString("en-US"); // الفواصل صحيحة (1,234)
  return language === "ar" ? toArabicNumerals(formatted) : formatted;
};