import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className="relative flex items-center gap-1 cursor-pointer shrink-0 w-fit">
      <Link
        href="/"
        className={`text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-emerald-600 ${className || ""}`}
      >
        Oshudpati
      </Link>
      <span className="absolute top-1.5 left-[37%] text-xs md:w-0.5 md:h-0.75 h-0.5 rotate-70 bg-emerald-600 rounded-full px-1"></span>
      <span className="absolute top-1.5 left-[41%] text-xs md:w-0.5 md:h-0.75 h-0.5 rotate-90 bg-emerald-600 rounded-full px-1"></span>
      <span className="absolute top-1.5 left-[46%] text-xs md:w-0.5 md:h-0.75 h-0.5 rotate-110 bg-emerald-600 rounded-full px-1"></span>
    </div>
  );
};

export default Logo;
