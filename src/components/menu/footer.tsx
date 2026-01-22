import {
  FaLaptopCode,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaPhoneAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#aa0a12] text-white rounded-t-3xl font-[Almarai] font-bold">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 text-sm">

        {/* Info */}
        <div className="space-y-3 text-center md:text-right">

          {/* Location */}
          <div className="flex items-center gap-2 justify-center md:justify-end text-md md:text-lg font-[Cairo] text-black">
            <FaMapMarkerAlt className="text-[#FCD451]" />
            غزة - شارع الجلاء - شرق عمارة الزهارنة
          </div>

          {/* Contact Numbers */}
          <div className="flex flex-col gap-1 items-center md:items-end">
            <a
              href="tel:+970597230040"
              className="flex items-center gap-2 font-[Cairo] text-md md:text-lg text-black"
            >
              <FaPhoneAlt className="text-[#FCD451]" />
              0597230040
            </a>

            <a
              href="tel:+970567230041"
              className="flex items-center gap-2 font-[Cairo] text-md md:text-lg text-black"
            >
              <FaPhoneAlt className="text-[#FCD451]" />
              0567230041
            </a>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-4 justify-center md:justify-start">
          {[
            { href: "https://wa.me/+970597230040", icon: <FaWhatsapp /> },
            { href: "https://www.instagram.com/mazzat.ps?igsh=MTBmejVhM3hoamlxdA==", icon: <FaInstagram /> },
            { href: "https://www.facebook.com/share/181dADhxmo/", icon: <FaFacebookF /> },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                p-0.5
                rounded-full
                bg-linear-to-br from-[#FCD451] via-[#D2000E] to-[#FCD451]
                transition-all duration-300
                hover:scale-105
              "
            >
              <span className="
                flex items-center justify-center
                w-9 h-9 md:w-10 md:h-10
                rounded-full
                bg-white
                text-[#D2000E]
                text-base md:text-lg
                transition-all duration-300
                group-hover:bg-[#FCD451]
                group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]
              ">
                {item.icon}
              </span>
            </a>
          ))}
        </div>

        {/* Signature */}
        <div className="flex items-center gap-2 opacity-80 justify-center md:justify-end">
          <a
            href="https://engmohammedaljojo.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <FaLaptopCode className="text-[#FCD451] text-xl md:text-2xl" />
            <span className="font-[Almarai] font-bold tracking-wide text-sm md:text-md text-black">
              Eng. Mohammed Eljoujo
            </span>
          </a>
        </div>

      </div>
    </footer>
  );
}
