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
      <h3 className="text-lg font-bold text-slate-900">
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
              className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white"
            >
              <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                <AvatarImage
                  src={review.customer.image || ""}
                  alt={review.customer.name}
                />
                <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-slate-900">
                    {review.customer.name}
                  </p>
                  <time className="text-xs text-slate-400 shrink-0">
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200 fill-slate-100"
                      }`}
                    />
                  ))}
                </div>

                {review.comment && (
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                )}

                {review.reply && (
                  <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                      Admin Reply
                    </p>
                    <p className="text-sm text-blue-900 leading-relaxed">
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
