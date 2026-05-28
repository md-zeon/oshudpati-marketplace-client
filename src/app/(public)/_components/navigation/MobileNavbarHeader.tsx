"use client";

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
  ShoppingCart,
  X,
  Home,
  Heart,
  MapPin,
  Phone,
  Pill,
  Package,
  BookOpen,
  CircleQuestionMark,
} from "lucide-react";
import Link from "next/link";

const MobileNavbarHeader = () => {
  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: Package },
    { label: "Medicines", href: "/medicines", icon: Pill },
    { label: "Blog", href: "/blog", icon: BookOpen },
  ];

  const bottomLinks = [
    { label: "My Wishlist", href: "/wishlist", icon: Heart },
    { label: "Track Order", href: "/track-order", icon: MapPin },
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
                  <div>
                    <Link
                      href="/"
                      className="text-xl font-black tracking-tight text-primary"
                    >
                      Oshudpati
                    </Link>
                  </div>
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
              <div className="flex items-center justify-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  asChild
                >
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* <Facebook size={16} /> */} Facebook
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  asChild
                >
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* <Twitter size={16} /> */} Twitter
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  asChild
                >
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* <Instagram size={16} /> */} Instagram
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
        <Link href="/" className="text-xl font-black inline-block">
          Oshudpati
        </Link>

        {/* Right Cart */}
        <Button variant="ghost" size="icon" className="relative cursor-pointer">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary">
            0
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default MobileNavbarHeader;
