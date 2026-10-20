import { useEffect, useState } from "react";

interface SplashScreenProps {
  isLoading: boolean;
  onFinished?: () => void;
}

export default function SplashScreen({ isLoading, onFinished }: SplashScreenProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // بدء تأثير التلاشي التدريجي
      setFade(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onFinished?.();
      }, 500); // 500ms مدة التلاشي السلس
      return () => clearTimeout(timer);
    }
  }, [isLoading, onFinished]);

  if (!shouldRender) return null;

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-[#FDE68A] via-[#FCD451] to-[#EAB308] select-none transition-opacity duration-500 ease-out will-change-opacity ${fade
        ? "opacity-0 pointer-events-none"
        : "opacity-100"
        }`}
      aria-hidden={fade}
      role="status"
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-white/20 blur-3xl pointer-events-none -top-10 -right-10 animate-pulse" />
      <div className="absolute w-72 h-72 rounded-full bg-yellow-600/10 blur-3xl pointer-events-none -bottom-10 -left-10 animate-pulse" />

      {/* Restaurant Logo with glowing rings */}
      <div className="relative w-52 h-52 md:w-60 md:h-60 mb-8 flex items-center justify-center">
        {/* Animated glowing border ring */}
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400/40 animate-ping pointer-events-none" />
        <div className="absolute -inset-2 rounded-full border-2 border-white/60 opacity-60 animate-pulse pointer-events-none" />

        <img
          src="/logo_mazzat.png"
          alt="شعار معجنات ومزات"
          className="w-full h-full object-contain rounded-full drop-shadow-2xl animate-pulseScale"
        />
      </div>

      {/* Main Title */}
      <div className="text-center px-6">


        <p className="mt-3 text-yellow-950/80 text-base md:text-xl font-[Cairo] font-semibold tracking-wide">
          نحضر لكم أشهى الأصناف بأفضل الأسعار
          <span className="inline-flex mr-1 text-[#D2000E] animate-pulse">...</span>
        </p>
      </div>

      {/* Sleek Minimal Progress Indicator */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-40 h-1.5 bg-yellow-900/15 rounded-full overflow-hidden">
          <div className="w-full h-full bg-linear-to-r from-[#D2000E] to-yellow-600 rounded-full animate-shimmer" />
        </div>
        <span className="text-xs text-yellow-950/60 font-[Cairo]">
          جاري تجهيز القائمة
        </span>
      </div>
    </div>
  );
}
