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
} from "lucide-react";
import Link from "next/link";
import { MobileCartDrawer } from "@/components/shared/cart/MobileCartDrawer";
import Logo from "@/components/shared/Logo";
import Image from "next/image";
import { userService } from "@/services/user.service";

const MobileNavbarHeader = async () => {
  const session = await userService.getSession();
  const isLoggedIn = session?.success && !!session.data?.user;

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
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
    <nav className="lg:hidden sticky top-0 z-50 h-16 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* Mobile Navigation Menu */}
      <div className="flex h-full items-center justify-between gap-4 px-4">
        {/* Left Drawer Trigger */}
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button className="cursor-pointer" variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="h-full max-w-75 bg-background outline-none border-background flex flex-col justify-between rounded-r-xl rounded-l-none overflow-y-auto">
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
                      className="cursor-pointer"
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
              <div className="px-4 py-4 space-y-6">
                <div className="flex flex-col space-y-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Main Menu
                  </p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 text-base font-medium py-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <link.icon className="h-5 w-5 opacity-70" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                <Separator />

                {/* Bottom Content - Wishlist, Order Tracking, Contact */}
                <div className="flex flex-col space-y-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Account & Help
                  </p>
                  {isLoggedIn ? (
                    <Link
                      href="/account"
                      className="flex items-center gap-3 text-base font-medium py-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <CircleQuestionMark className="h-5 w-5 opacity-70" />
                      My Account
                    </Link>
                  ) : (
                    <Link
                      href="/signin"
                      className="flex items-center gap-3 text-base font-medium py-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <User className="h-5 w-5 opacity-70" />
                      Sign In
                    </Link>
                  )}
                  {bottomLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-3 text-base font-medium py-2 text-foreground/80 hover:text-foreground transition-colors"
                    >
                      <link.icon className="h-5 w-5 opacity-70" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer - Social Links & Copyright */}
            <DrawerFooter className="border-t px-4 py-4 bg-muted/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/logo/facebook.svg"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="bg-blue-500 p-0.5"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/logo/linkedin.svg"
                      alt="LinkedIn"
                      width={20}
                      height={20}
                      className="bg-blue-500"
                    />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link
                    href="https://www.x.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/logo/x.svg"
                      alt="X (Twitter)"
                      width={24}
                      height={24}
                      className="bg-white p-0.5 invert"
                    />
                  </Link>
                </Button>
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
