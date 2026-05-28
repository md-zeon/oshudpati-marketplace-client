import { Check, Mail, Phone } from "lucide-react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NavbarHeader = () => {
  return (
    // hidden on mobile, visible on large screens and above
    <nav className="hidden text-xs lg:flex justify-between gap-3 px-4 py-2 text-black">
      {/* Header Left */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {/* Contact Information */}
        <span className="inline-flex items-center gap-1 whitespace-nowrap hover:pb-0.5 transition-all duration-200">
          <Phone className="inline-block" size={16} />
          <Link href="tel:+8801521721040">+880 1521 721 040</Link>
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap hover:pb-0.5 transition-all duration-200">
          <Mail className="inline-block" size={16} />
          <Link href="mailto:hello@oshudpati.com">hello@oshudpati.com</Link>
        </span>
        {/* Links */}
        <span className="whitespace-nowrap hover:pb-0.5 transition-all duration-200">
          <Link href="/about">About Us</Link>
        </span>
        <span className="whitespace-nowrap hover:pb-0.5 transition-all duration-200">
          <Link href="/contact">Contact Us</Link>
        </span>
        {/* Benefits */}
        <span className="whitespace-nowrap cursor-text">
          {" "}
          <Check className="inline-block" size={12} /> Cash On Delivery
        </span>
        <span className="whitespace-nowrap cursor-text">
          {" "}
          <Check className="inline-block" size={12} /> Free Shipping
        </span>
      </div>
      {/* Header Right */}
      <div className="flex shrink-0 items-center gap-4 self-start md:self-auto">
        {/* Language Selector */}
        <Select defaultValue="en">
          <SelectTrigger className="w-auto border-0 cursor-pointer outline-none">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-0 top-9 bg-background">
            <SelectGroup>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="bn" disabled className="cursor-not-allowed">
                Bengali (বাংলা)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Currency Selector */}
        <Select defaultValue="bdt">
          <SelectTrigger className="w-auto border-0 cursor-pointer">
            <SelectValue placeholder="BDT" />
          </SelectTrigger>
          <SelectContent className="w-auto min-w-0 top-9 bg-background">
            <SelectGroup>
              <SelectItem value="bdt">BDT</SelectItem>
              <SelectItem value="usd" disabled className="cursor-not-allowed">
                USD
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
};

export default NavbarHeader;
