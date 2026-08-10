import { Review } from "@/types";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-brand-900">
        Customer Reviews ({reviews.length})
      </h3>

      <div className="space-y-5">
        {reviews.map((review) => {
          const initials = review.customer.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <div
              key={review.id}
              className="flex gap-4 rounded-xl border border-border-default bg-card p-4"
            >
              <Avatar className="h-10 w-10 shrink-0 border border-border-default">
                <AvatarImage
                  src={review.customer.image || ""}
                  alt={review.customer.name}
                />
                <AvatarFallback className="bg-brand-50 text-brand-800 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {review.customer.name}
                  </p>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div
                  className="mt-1 flex items-center gap-0.5"
                  role="img"
                  aria-label={`Rated ${review.rating} out of 5`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 ${
                        star <= review.rating
                          ? "fill-accent-500 text-accent-500"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>

                {review.comment && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                )}

                {review.reply && (
                  <div className="mt-3 rounded-lg border border-trust-200 bg-trust-50 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-trust-700">
                      Admin Reply
                    </p>
                    <p className="text-sm leading-relaxed text-trust-600">
                      {review.reply}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
