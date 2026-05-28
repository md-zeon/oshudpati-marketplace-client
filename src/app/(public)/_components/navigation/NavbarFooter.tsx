import { Heart, MapPin } from "lucide-react";
import Link from "next/link";

const NavbarFooter = () => {
  return (
    <nav className="font-medium flex items-center justify-between gap-6 px-4 py-2">
      <div className="flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/medicines">Medicines</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/blog">Blog</Link>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/wishlist"
          className="flex items-center text-xs font-semibold gap-1"
        >
          <Heart className="inline-block text-red-600" size={14} />
          <span>Wishlist</span>
        </Link>

        <div>
          <Link
            href="/faq"
            className="flex items-center text-xs font-semibold gap-1"
          >
            <MapPin className="inline-block text-blue-600" size={14} />
            <span>FAQ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarFooter;
