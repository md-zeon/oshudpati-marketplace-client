"use client";

import { useState } from "react";
import Image from "next/image";
import { MedicineImage } from "@/types";
import { cn } from "@/lib/utils";

interface MedicineGalleryProps {
  images: MedicineImage[];
  name: string;
}

export function MedicineGallery({ images, name }: MedicineGalleryProps) {
  const validImages = images?.filter((img) => img.imageUrl) || [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (validImages.length === 0) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center">
        <span className="text-sm text-muted-foreground">No image available</span>
      </div>
    );
  }

  const activeImage = validImages[activeIndex];

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-xl bg-surface-card p-6">
        <Image
          key={activeImage.id}
          src={activeImage.imageUrl}
          alt={activeImage.altText || name}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-contain p-4"
          priority={activeIndex === 0}
        />
      </div>

      {validImages.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Product images"
        >
          {validImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1} of ${validImages.length}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-surface-card p-1 transition-all focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
                index === activeIndex
                  ? "border-brand-600 ring-1 ring-brand-600"
                  : "border-border-default hover:border-brand-300",
              )}
            >
              <Image
                src={image.imageUrl}
                alt={image.altText || `${name} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
