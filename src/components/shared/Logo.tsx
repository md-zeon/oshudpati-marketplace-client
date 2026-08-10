import Link from "next/link";
import { cn } from "@/lib/utils";

const COLOR_MAP = {
  blue: "text-trust-600",
  brand: "text-brand-700",
} as const;

type LogoProps = {
  className?: string;
  color?: keyof typeof COLOR_MAP;
};

const Logo = ({ className, color = "brand" }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label="Oshudpati — Home"
      className={cn(
        "shrink-0 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl",
        COLOR_MAP[color] ?? COLOR_MAP.brand,
        "hover:opacity-80 transition-opacity",
        className,
      )}
    >
      Oshudpati
    </Link>
  );
};

export default Logo;
