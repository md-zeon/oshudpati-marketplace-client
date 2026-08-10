import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  X,
  Home,
  Heart,
  MapPin,
  Phone,
  Pill,
  Package,
  BookOpen,
  CircleQuestionMark,
  Layout,
  User,
  Store,
} from "lucide-react";
import Link from "next/link";
import { MobileCartDrawer } from "@/components/shared/cart/MobileCartDrawer";
import Logo from "@/components/shared/Logo";
import { userService } from "@/services/user.service";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://www.x.com",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

const MobileNavbarHeader = async () => {
  const session = await userService.getSession();
  const isLoggedIn = session?.success && !!session.data?.user;

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop All", href: "/shop", icon: Store },
    { label: "Dashboard", href: "/dashboard", icon: Layout },
    { label: "Categories", href: "/categories", icon: Package },
    { label: "Medicines", href: "/medicine", icon: Pill },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];

  const bottomLinks = [
    { label: "My Wishlist", href: "/wishlist", icon: Heart },
    { label: "Track Order", href: "/order-tracking", icon: MapPin },
    { label: "FAQ", href: "/faq", icon: CircleQuestionMark },
    { label: "Contact Support", href: "/contact", icon: Phone },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b border-border-default bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
      {/* Mobile Navigation Menu */}
      <div className="flex h-full items-center justify-between gap-4 px-4">
        {/* Left Drawer Trigger */}
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button
              className="h-11 w-11 cursor-pointer"
              variant="ghost"
              size="icon"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="flex h-full max-w-80 flex-col justify-between overflow-y-auto rounded-r-xl rounded-l-none border-background bg-background outline-none">
            <div>
              <DrawerHeader className="px-4 py-4">
                <DrawerTitle className="flex items-center justify-between">
                  {/* Logo */}
                  <Logo />
                  {/* Close Button */}
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close menu"
                      className="h-11 w-11 cursor-pointer"
                    >
                      <X size={24} />
                    </Button>
                  </DrawerClose>
                </DrawerTitle>
                <DrawerDescription className="text-sm text-muted-foreground">
                  Explore our menu and find what you need!
                </DrawerDescription>
              </DrawerHeader>

              <Separator />

              {/* Main Navigation */}
              <div className="space-y-6 px-4 py-4">
                <div className="flex flex-col space-y-1">
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Main Menu
                  </p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-700"
                    >
                      <link.icon className="h-5 w-5 text-brand-600" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                <Separator />

                {/* Bottom Content - Wishlist, Order Tracking, Contact */}
                <div className="flex flex-col space-y-1">
                  <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account & Help
                  </p>
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-700"
                    >
                      <User className="h-5 w-5 text-brand-600" />
                      My Account
                    </Link>
                  ) : (
                    <Link
                      href="/signin"
                      className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-700"
                    >
                      <User className="h-5 w-5 text-brand-600" />
                      Sign In
                    </Link>
                  )}
                  {bottomLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-700"
                    >
                      <link.icon className="h-5 w-5 text-brand-600" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer - Social Links & Copyright */}
            <DrawerFooter className="border-t border-border-default bg-muted/30 px-4 py-4">
              <div className="mb-2 flex items-center justify-center gap-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="icon"
                    asChild
                    aria-label={social.label}
                    className="h-11 w-11 rounded-full text-muted-foreground hover:bg-brand-600 hover:text-white"
                  >
                    <Link href={social.href} target="_blank" rel="noreferrer">
                      {social.icon()}
                    </Link>
                  </Button>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                &copy; {currentYear} Oshudpati. All rights reserved.
              </p>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Center Logo */}
        <Logo />

        {/* Right Cart Drawer */}
        <MobileCartDrawer />
      </div>
    </nav>
  );
};

export default MobileNavbarHeader;
