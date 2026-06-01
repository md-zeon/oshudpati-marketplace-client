"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Keeping it open-ended so any extra filters (search, sort, etc.) are allowed
// interface PaginationSearchParams {
//   [key: string]: string | string[] | undefined;
// }

export default function PaginationControls({
  meta,
  // searchParams,
}: {
  meta: PaginationMeta;
  // searchParams: PaginationSearchParams;
}) {
  const searchParams = useSearchParams();

  const { page, totalPages, hasNext, hasPrevious, limit, total } = meta;

  if (totalPages <= 1) return null;

  // Helper to determine which page numbers to show (with ellipsis)
  /**
   * Logic:
   * - Always show first and last page
   * - Show current page, one before and one after (if they exist)
   * - Use ellipsis if there's a gap between first/last and the current range
   * Example for page 5 of 10: [1, ..., 4, 5, 6, ..., 10]
   * Example for page 2 of 5: [1, 2, 3, ..., 5]
   * Example for page 4 of 5: [1, ..., 3, 4, 5]
   */
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) {
      pages.push("ellipsis");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Helper to build the URL string preserving all existing query params
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString()); // Start with existing params

    // const params = new URLSearchParams();
    // Loop through existing searchParams and append them safely
    // Object.entries(searchParams).forEach(([key, value]) => {
    //   if (value !== undefined) {
    //     if (Array.isArray(value)) {
    //       value.forEach((val) => params.append(key, val));
    //     } else {
    //       params.set(key, value);
    //     }
    //   }
    // });

    // Update or set the active page parameter
    params.set("page", pageNumber.toString());

    return `?${params.toString()}`;
  };

  return (
    <Pagination className="mt-10 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">
          showing {(page - 1) * limit + 1} -{" "}
          {page * limit > total ? total : page * limit} of {total} results
        </p>
      </div>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={hasPrevious ? createPageUrl(page - 1) : "#"}
            className={!hasPrevious ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {/* Dynamic Page Numbers */}
        {getPageNumbers().map((item, index) => (
          <PaginationItem key={index}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageUrl(item)}
                isActive={page === item}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={hasNext ? createPageUrl(page + 1) : "#"}
            className={!hasNext ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
