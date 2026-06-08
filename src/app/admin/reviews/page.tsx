import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAllReviewsAction } from "@/actions/admin.action";
import { Star, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Manage Reviews",
  description: "Admin review management",
};

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  medicine: {
    id: string;
    name: string;
    slug: string;
  };
}

const AdminReviews = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const res = await getAllReviewsAction();
  const reviews: ReviewItem[] = res?.success ? res.data : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50">
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Reviews</h1>
            <p className="text-sm text-slate-500">
              {reviews.length} total reviews
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Customer Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                      {review.customer.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {review.customer.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {review.customer.email}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-1.5">
                      {new Date(review.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {!review.comment && (
                    <p className="text-sm text-slate-400 italic">
                      No comment provided
                    </p>
                  )}
                </div>

                {/* Medicine Link */}
                <Link
                  href={`/medicine/${review.medicine.slug}`}
                  className="shrink-0 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors"
                >
                  {review.medicine.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
