import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";

export default function MenuPage() {
  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        flex flex-col
        bg-[#FCD451]
        text-black
        font-[Cairo]
      "
    >
      {/* Hero Logo */}
      <header className="flex justify-center pt-8 pb-4 px-4">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center transform-gpu will-change-transform">
          <img
            src="/logo_mazzat.png"
            alt="شعار معجنات ومزات"
            width={224}
            height={224}
            decoding="async"
            // @ts-expect-error fetchpriority is a modern standard HTML attribute
            fetchpriority="high"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105"
          />
        </div>
      </header>

      {/* Menu Content */}
      <div className="flex-1 w-full">
        <Menu />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
