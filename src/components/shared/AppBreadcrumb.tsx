"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) ?? [];

  // Don't render breadcrumb on the home page
  if (segments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-brand-700"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && <BreadcrumbSeparator />}

        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          // Clean up text format (e.g., "shop-items" becomes "Shop Items")
          const formattedSegment = segment
            .replace(/-+/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <section key={href} className="flex items-center gap-1.5">
              <BreadcrumbItem aria-current={isLast ? "page" : undefined}>
                {!isLast ? (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-brand-700"
                    >
                      {formattedSegment}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="pointer-events-none text-sm font-semibold text-foreground">
                    {formattedSegment}
                  </span>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </section>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
