import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/components/shared/Logo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const footerLinks = {
  shop: [
    { label: "All Medicines", href: "/shop" },
    { label: "Categories", href: "/shop" },
    { label: "Featured", href: "/shop?isFeatured=true" },
    { label: "Top Rated", href: "/shop?sortBy=popular" },
  ],
  customerService: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Order Tracking", href: "/order-tracking" },
    { label: "Returns & Refunds", href: "/faq" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  account: [
    { label: "My Account", href: "/dashboard" },
    { label: "My Orders", href: "/dashboard/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Profile", href: "/dashboard/profile" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "https://youtube.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path
          fill="currentColor"
          d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
        />
        <polygon fill="white" points="10 8 16 12 10 16" />
      </svg>
    ),
  },
];

const PublicFooter = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand/Social Box */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left md:col-span-2 space-y-4 pb-6 md:pb-0 border-b border-gray-900/60 md:border-none">
            <Logo />
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Bangladesh&apos;s trusted online medicine and healthcare
              marketplace. We make healthcare accessible, authentic, and
              affordable.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-gray-900 hover:bg-emerald-600 flex items-center justify-center transition-all text-gray-400 hover:text-white"
                  aria-label={social.label}
                >
                  {social.icon()}
                </Link>
              ))}
            </div>
          </div>

          {/* Link Controls Matrix */}
          {/* Mobile Viewport */}
          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              {(
                Object.keys(footerLinks) as Array<keyof typeof footerLinks>
              ).map((key) => {
                const label =
                  key === "customerService" ? "Customer Service" : key;
                return (
                  <AccordionItem
                    value={key}
                    key={key}
                    className="border-gray-900/60"
                  >
                    <AccordionTrigger className="text-gray-200 text-xs font-bold uppercase tracking-wider hover:no-underline hover:text-emerald-400 py-3">
                      {label}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-3 pt-1">
                        {footerLinks[key].map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="text-sm text-gray-400 hover:text-emerald-400 transition-colors block py-0.5"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Tablet & Desktop Viewport */}
          {(Object.keys(footerLinks) as Array<keyof typeof footerLinks>).map(
            (key) => {
              const label =
                key === "customerService" ? "Customer Service" : key;
              return (
                <div
                  key={key}
                  className="hidden md:block md:col-span-1 lg:col-span-1"
                >
                  <h3 className="text-gray-200 text-xs font-bold uppercase tracking-wider mb-4">
                    {label}
                  </h3>
                  <ul className="space-y-3">
                    {footerLinks[key].map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm hover:text-emerald-400 transition-colors block text-gray-400"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            },
          )}
        </div>

        {/* Contact Strip */}
        <div className="mt-10 md:mt-12 pt-8 border-t border-gray-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3 bg-gray-900/30 p-3.5 rounded-xl border border-gray-900/60 lg:border-none lg:bg-transparent lg:p-0">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-gray-300 font-medium">Dhaka, Bangladesh</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-900/30 p-3.5 rounded-xl border border-gray-900/60 lg:border-none lg:bg-transparent lg:p-0">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-gray-300 font-medium">+880 1234-567890</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-900/30 p-3.5 rounded-xl border border-gray-900/60 lg:border-none lg:bg-transparent lg:p-0 sm:col-span-2 lg:col-span-1">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-emerald-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-gray-300 font-medium">
              support@oshudpati.com
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 bg-black/20">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} Oshudpati. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-5">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
