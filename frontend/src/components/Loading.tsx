type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export default function Loading({
  message = "جارٍ التحميل...",
  fullScreen = true,
}: LoadingProps) {
  return (
    <div
      className={
        fullScreen
          ? "min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 gap-5 px-4"
          : "flex flex-col items-center justify-center py-16 gap-4 px-4"
      }
    >
      <div className="relative">
        <img
          src="/logo.svg"
          alt="Electrical Store"
          className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md"
        />
        <div className="absolute inset-0 rounded-2xl bg-amber-400/20 blur-xl -z-10 scale-150" />
      </div>

      <div className="relative w-12 h-12 md:w-14 md:h-14">
        <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-600 border-r-amber-400 animate-spin" />
      </div>

      <p className="text-lg md:text-xl font-medium text-slate-600 text-center">
        {message}
      </p>
    </div>
  );
}
