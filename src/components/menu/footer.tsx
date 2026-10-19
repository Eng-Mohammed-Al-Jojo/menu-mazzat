import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaLaptopCode,
  FaArrowUp,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#1a0e0e] text-white font-[Cairo] overflow-hidden mt-16 rounded-t-3xl border-t border-yellow-500/20">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#FCD451]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* Top Section: Brand + Info + Social */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-white/10 text-center md:text-right">

          {/* 1. Brand */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo_mazzat.png"
                alt="مطعم مزّات"
                className="w-12 h-12 object-contain drop-shadow"
              />
              <div className="text-right">
                <h3 className="font-[Almarai] font-extrabold text-xl text-white">مطعم مزّات</h3>
                <p className="text-[#FCD451] text-xs font-semibold">غزة - نكهة ومذاق لا يُنسى</p>
              </div>
            </div>
            <p className="text-stone-400 text-xs max-w-xs leading-relaxed">
              أشهى الوجبات والمأكولات السريعة بأعلى معايير الجودة والنظافة.
            </p>
          </div>

          {/* 2. Contact & Working Hours */}
          <div className="space-y-2.5">
            {/* Location */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-stone-300 text-sm">
              <FaMapMarkerAlt className="text-[#FCD451] text-base flex-shrink-0" />
              <span>غزة - شارع الجلاء - شرق عمارة الزهارنة</span>
            </div>

            {/* Hours */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-stone-300 text-sm">
              <FaClock className="text-[#FCD451] text-base flex-shrink-0" />
              <span>يومياً: 11:00 ص – 11:00 م</span>
            </div>

            {/* Phone Numbers (Correct LTR Direction to prevent number flipping) */}
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-sm pt-1">
              <FaPhoneAlt className="text-[#FCD451] text-base flex-shrink-0" />
              <div className="flex items-center gap-3">
                <a
                  href="tel:+970597230040"
                  className="text-white font-bold hover:text-[#FCD451] transition-colors"
                  dir="ltr"
                >
                  059-7230040
                </a>
                <span className="text-white/30">|</span>
                <a
                  href="tel:+970567230041"
                  className="text-white font-bold hover:text-[#FCD451] transition-colors"
                  dir="ltr"
                >
                  056-7230041
                </a>
              </div>
            </div>
          </div>

          {/* 3. Social Media Buttons */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider font-[Almarai]">
              تابعنا وتواصل معنا
            </span>
            <div className="flex items-center gap-3">
              {[
                {
                  href: "https://wa.me/+970597230040",
                  icon: FaWhatsapp,
                  hoverBg: "hover:bg-[#25D366] hover:border-[#25D366]",
                  label: "واتساب",
                },
                {
                  href: "https://www.instagram.com/mazzat.ps?igsh=MTBmejVhM3hoamlxdA==",
                  icon: FaInstagram,
                  hoverBg: "hover:bg-[#E4405F] hover:border-[#E4405F]",
                  label: "إنستغرام",
                },
                {
                  href: "https://www.facebook.com/share/181dADhxmo/",
                  icon: FaFacebookF,
                  hoverBg: "hover:bg-[#1877F2] hover:border-[#1877F2]",
                  label: "فيسبوك",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 hover:shadow-lg ${s.hoverBg}`}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright + Developer + Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-medium">

          <p>© {new Date().getFullYear()} مطعم مزّات. جميع الحقوق محفوظة.</p>

          <div className="flex items-center gap-2">
            <FaLaptopCode className="text-[#FCD451] text-sm" />
            <span>تصميم وبرمجة:</span>
            <a
              href="https://engmohammedaljojo.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#FCD451] font-bold font-[Almarai] transition-colors"
            >
              Eng. Mohammed Eljoujo
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#FCD451]/50 hover:text-[#FCD451] transition-all cursor-pointer text-xs"
            title="العودة لأعلى الصفحة"
          >
            <span>للأعلى</span>
            <FaArrowUp size={11} />
          </button>

        </div>

      </div>
    </footer>
  );
}
