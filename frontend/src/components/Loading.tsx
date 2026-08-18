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
          ? "min-h-[60vh] flex flex-col items-center justify-center bg-surface gap-5 px-4"
          : "flex flex-col items-center justify-center py-16 gap-4 px-4"
      }
    >
      <div className="relative">
        <img
          src="/logo.svg"
          alt="Electrical Store"
          className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md"
        />
        <div className="absolute inset-0 rounded-2xl bg-accent/20 blur-xl -z-10 scale-150" />
      </div>

      <div className="relative w-12 h-12 md:w-14 md:h-14">
        <div className="absolute inset-0 rounded-full border-4 border-primary-soft" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent animate-spin" />
      </div>

      <p className="text-lg md:text-xl font-medium text-muted text-center">
        {message}
      </p>
    </div>
  );
}
