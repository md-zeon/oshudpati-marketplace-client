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
    <nav className="mx-auto hidden max-w-360 items-center justify-between gap-3 border-b border-border-default px-4 py-2 text-xs font-medium text-muted-foreground lg:flex">
      {/* Header Left */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        {/* Contact Information */}
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Phone aria-hidden="true" className="text-brand-600" size={15} />
          <Link
            href="tel:+8801521721040"
            className="inline-flex min-h-9 items-center rounded-md transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            +880 1521 721 040
          </Link>
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <Mail aria-hidden="true" className="text-brand-600" size={15} />
          <Link
            href="mailto:hello@oshudpati.com"
            className="inline-flex min-h-9 items-center rounded-md transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            hello@oshudpati.com
          </Link>
        </span>
        {/* Links */}
        <span className="whitespace-nowrap">
          <Link
            href="/about"
            className="inline-flex min-h-9 items-center rounded-md transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            About Us
          </Link>
        </span>
        <span className="whitespace-nowrap">
          <Link
            href="/contact"
            className="inline-flex min-h-9 items-center rounded-md transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Contact Us
          </Link>
        </span>
        {/* Benefits */}
        <span className="inline-flex cursor-text items-center gap-1 whitespace-nowrap">
          <Check aria-hidden="true" className="text-brand-600" size={12} /> Cash
          On Delivery
        </span>
        <span className="inline-flex cursor-text items-center gap-1 whitespace-nowrap">
          <Check aria-hidden="true" className="text-brand-600" size={12} /> Free
          Shipping
        </span>
      </div>
      {/* Header Right */}
      <div className="flex shrink-0 items-center gap-4 self-start md:self-auto">
        {/* Language Selector */}
        <Select defaultValue="en">
          <SelectTrigger className="w-auto cursor-pointer border-0 outline-none">
            <SelectValue placeholder="English" />
          </SelectTrigger>
          <SelectContent className="top-9 w-auto min-w-0 bg-background">
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
          <SelectTrigger className="w-auto cursor-pointer border-0">
            <SelectValue placeholder="BDT" />
          </SelectTrigger>
          <SelectContent className="top-9 w-auto min-w-0 bg-background">
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
