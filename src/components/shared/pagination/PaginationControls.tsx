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

export default function PaginationControls({
  meta,
}: {
  meta: PaginationMeta;
}) {
  const searchParams = useSearchParams();

  const { page, totalPages, hasNext, hasPrevious, limit, total } = meta;

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = page * limit > total ? total : page * limit;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    pages.push(1);

    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(totalPages - 1, page + 1);

    if (startPage > 2) {
      pages.push("ellipsis");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground sm:text-sm">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">{total}</span> results
      </p>

      <Pagination aria-label="Pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={hasPrevious ? createPageUrl(page - 1) : "#"}
              aria-label="Previous page"
              className={
                !hasPrevious
                  ? "pointer-events-none opacity-40 aria-disabled:text-muted-foreground"
                  : "text-brand-700 hover:bg-brand-50 hover:text-brand-800"
              }
            />
          </PaginationItem>

          <div className="hidden items-center sm:flex">
            {getPageNumbers().map((item, index) => (
              <PaginationItem key={index}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={createPageUrl(item)}
                    isActive={page === item}
                    aria-label={`Go to page ${item}`}
                    className={
                      page === item
                        ? "bg-brand-700 text-white hover:bg-brand-700 hover:text-white"
                        : "text-foreground hover:bg-brand-50 hover:text-brand-700"
                    }
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>

          <PaginationItem className="sm:hidden">
            <span className="px-3 py-1 text-xs font-semibold text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href={hasNext ? createPageUrl(page + 1) : "#"}
              aria-label="Next page"
              className={
                !hasNext
                  ? "pointer-events-none opacity-40 aria-disabled:text-muted-foreground"
                  : "text-brand-700 hover:bg-brand-50 hover:text-brand-800"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
