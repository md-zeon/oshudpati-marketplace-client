"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MessageCircle, LifeBuoy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

interface FaqContentProps {
  faqs: FaqCategory[];
}

const ALL = "all";

export function FaqContent({ faqs }: FaqContentProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [query, faqs]);

  const visibleCategories =
    activeCategory === ALL
      ? filtered
      : filtered.filter((cat) => cat.category === activeCategory);

  const totalQuestions = faqs.reduce((sum, cat) => sum + cat.items.length, 0);
  const visibleQuestions = visibleCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  const chipClass = (isActive: boolean) =>
    `cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
      isActive
        ? "border-brand-700 bg-brand-700 text-white"
        : "border-border-default bg-card text-muted-foreground hover:border-brand-300 hover:text-brand-800"
    }`;

  return (
    <div className="space-y-10">
      {/* Search + category filter */}
      <div className="space-y-4">
        <div className="relative mx-auto max-w-xl">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions… e.g. delivery, prescription, COD"
            aria-label="Search frequently asked questions"
            className="h-11 rounded-full border-border-default bg-card pl-10 text-base shadow-sm focus-visible:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-600/40"
          />
        </div>

        <div
          className="flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="FAQ categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === ALL}
            onClick={() => setActiveCategory(ALL)}
            className={chipClass(activeCategory === ALL)}
          >
            All
          </button>
          {faqs.map((cat) => {
            const isActive = activeCategory === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(isActive ? ALL : cat.category)}
                className={chipClass(isActive)}
              >
                {cat.category}
              </button>
            );
          })}
        </div>
      </div>

      {visibleCategories.length === 0 ? (
        <Card className="border-border-default border-dashed bg-card">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Search className="mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="font-semibold text-foreground">
              No questions match “{query}”
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search term or contact our support team.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setQuery("");
                setActiveCategory(ALL);
              }}
            >
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {visibleCategories.map((cat) => (
            <section key={cat.category} aria-label={cat.category}>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-brand-900">
                  {cat.category}
                </h2>
                <Badge
                  variant="secondary"
                  className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-600"
                >
                  {cat.items.length}
                </Badge>
              </div>

              <Card className="overflow-hidden border-border-default bg-card shadow-sm">
                <Accordion type="single" collapsible>
                  {cat.items.map((item, idx) => (
                    <AccordionItem
                      key={item.q}
                      value={`${cat.category}-${idx}`}
                      className="border-border-default"
                    >
                      <AccordionTrigger className="px-5 py-4 text-left text-sm font-semibold text-foreground hover:no-underline hover:text-brand-800 data-[state=open]:text-brand-800 focus-visible:ring-2 focus-visible:ring-brand-600 sm:text-base">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </section>
          ))}
        </div>
      )}

      {/* Still need help? */}
      <Card className="border-brand-100 bg-brand-50/40">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-700/10 p-2.5 text-brand-700">
              <LifeBuoy className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-bold text-brand-900">Still have questions?</p>
              <p className="text-sm text-muted-foreground">
                Our support team is here to help you.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild className="bg-brand-700 text-white hover:bg-brand-600">
              <Link href="/contact">
                <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden />
                Contact Support
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-brand-800">
              <Link href="mailto:support@oshudpati.com">
                support@oshudpati.com
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Showing {visibleQuestions} of {totalQuestions} questions across{" "}
        {faqs.length} categories
      </p>
    </div>
  );
}
