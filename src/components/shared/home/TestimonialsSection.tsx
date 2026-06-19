"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";

export interface Testimonial {
  id: string;
  quote: string;
  rating: number;
  image: string;
  name: string;
  medicine: string;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "Excellent service! The medicines arrived on time and were exactly what I needed. Highly recommend Oshudpati for all your healthcare needs.",
    rating: 5,
    image: "",
    name: "Fatima Begum",
    medicine: "Napa Extend",
  },
  {
    id: "2",
    quote:
      "Great platform for buying medicines online. The prices are competitive and the delivery is super fast. Very satisfied!",
    rating: 5,
    image: "",
    name: "Rafiq Hasan",
    medicine: "Seclo 20mg",
  },
  {
    id: "3",
    quote:
      "I was skeptical about ordering medicines online but Oshudpati proved me wrong. Authentic products and professional service.",
    rating: 4,
    image: "",
    name: "Ayesha Khatun",
    medicine: "Fexo 120mg",
  },
  {
    id: "4",
    quote:
      "The customer support team helped me find the right medicine for my condition. Thank you Oshudpati for being so helpful!",
    rating: 5,
    image: "",
    name: "Kamal Hossain",
    medicine: "Maxpro 40mg",
  },
  {
    id: "5",
    quote:
      "Very easy to use website. I could find all the medicines I needed in one place. The search feature is really helpful.",
    rating: 4,
    image: "",
    name: "Nasrin Akter",
    medicine: "Rupuron 5mg",
  },
  {
    id: "6",
    quote:
      "Best online pharmacy in Bangladesh. Quick delivery, genuine products, and reasonable prices. 5 stars from me!",
    rating: 5,
    image: "",
    name: "Shahidul Islam",
    medicine: "Omac 20mg",
  },
];

export function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: Testimonial[];
}) {
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;

  if (displayTestimonials.length < 3) return null;

  const columns = chunkArray(
    displayTestimonials,
    Math.ceil(displayTestimonials.length / 3),
  );
  while (columns.length < 3) columns.push([]);

  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
          <h2 className="font-bold text-3xl tracking-tighter lg:text-4xl text-slate-700 text-center">
            Trusted by Thousands Across Bangladesh
          </h2>
          <p className="text-center text-slate-500 text-sm max-w-md">
            Real experiences from customers who rely on Oshudpati for authentic
            medicines and healthcare essentials.
          </p>
        </div>

        <div
          className={cn(
            "mt-10 flex max-h-160 justify-center gap-6 overflow-hidden",
            "mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
          )}
        >
          <InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
            {columns[0]?.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </InfiniteSlider>
          <InfiniteSlider
            className="hidden md:block"
            direction="vertical"
            speed={50}
            speedOnHover={25}
          >
            {columns[1]?.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </InfiniteSlider>
          <InfiniteSlider
            className="hidden lg:block"
            direction="vertical"
            speed={35}
            speedOnHover={17}
          >
            {columns[2]?.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
}) {
  const { quote, rating, image, name, medicine } = testimonial;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <figure
      className={cn(
        "w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl",
        className,
      )}
      {...props}
    >
      {/* Rating Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>

      <blockquote className="text-sm text-slate-600 leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar className="size-10 rounded-full border border-slate-100">
          <AvatarImage alt={name} src={image || ""} />
          <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-bold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="font-semibold not-italic leading-5 tracking-tight text-slate-900 text-sm">
            {name}
          </cite>
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <ShieldCheck className="w-3 h-3" />
            Verified buyer • {medicine}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
