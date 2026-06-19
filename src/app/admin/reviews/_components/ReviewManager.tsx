"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleReviewStatusAction,
  addReviewReplyAction,
  getAllReviewsAction,
} from "@/actions/admin.action";
import { Star, MessageSquare, ShieldCheck, ShieldOff } from "lucide-react";
import { Review } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageSection } from "@/components/shared/PageSection";

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BANNED: "bg-red-50 text-red-700 border-red-200",
};

interface ReviewManagerProps {
  initialReviews: Review[];
}

export function ReviewManager({ initialReviews }: ReviewManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = async () => {
    const res = await getAllReviewsAction();
    if (res?.success) setReviews(res.data);
    router.refresh();
  };

  const handleToggleStatus = async (
    reviewId: string,
    currentStatus: boolean,
  ) => {
    setBusyId(reviewId);
    const tid = toast.loading(
      currentStatus ? "Deactivating review..." : "Activating review...",
    );
    const res = await toggleReviewStatusAction(reviewId, !currentStatus);
    if (res?.success) {
      toast.success(`Review ${currentStatus ? "deactivated" : "activated"}`, {
        id: tid,
      });
      refresh();
    } else toast.error(res?.message || "Failed to update", { id: tid });
    setBusyId(null);
  };

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) {
      toast.error("Reply text is required");
      return;
    }
    setBusyId(reviewId);
    const tid = toast.loading("Submitting reply...");
    const res = await addReviewReplyAction(reviewId, replyText.trim());
    if (res?.success) {
      toast.success("Reply added", { id: tid });
      setReplyText("");
      setReplyingTo(null);
      refresh();
    } else toast.error(res?.message || "Failed to add reply", { id: tid });
    setBusyId(null);
  };

  const setLocalReply = (reviewId: string, text: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, reply: text, repliedAt: new Date().toISOString() }
          : r,
      ),
    );
  };

  return (
    <div>
      <PageSection>
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
      </PageSection>

      <PageSection>
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500">
              No reviews found
            </p>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Customer */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0">
                        {review.customer.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {review.customer.name}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          review.isActive
                            ? STATUS_BADGE.ACTIVE
                            : STATUS_BADGE.BANNED
                        } border text-[10px] font-bold uppercase px-2 py-0.5 ml-auto`}
                      >
                        {review.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-slate-400 ml-1.5">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-BD",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    {/* Comment */}
                    {review.comment ? (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {review.comment}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No comment provided
                      </p>
                    )}

                    {/* Admin Reply */}
                    {review.reply && !replyingTo && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                          Admin Reply
                          {review.repliedAt && (
                            <span className="font-normal text-blue-500 ml-2">
                              ·{" "}
                              {new Date(review.repliedAt).toLocaleDateString(
                                "en-BD",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {review.reply}
                        </p>
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === review.id && (
                      <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => {
                            setReplyText(e.target.value);
                            setLocalReply(review.id, e.target.value);
                          }}
                          placeholder="Write your reply..."
                          className="rounded-lg text-sm min-h-20"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReply(review.id)}
                            disabled={busyId === review.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            {busyId === review.id ? "Saving..." : "Save Reply"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!review.reply && !replyingTo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyingTo(review.id)}
                        className="text-xs"
                      >
                        Reply
                      </Button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        handleToggleStatus(review.id, review.isActive)
                      }
                      disabled={busyId === review.id}
                      title={review.isActive ? "Hide review" : "Show review"}
                      className={`h-8 w-8 ${
                        review.isActive
                          ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {review.isActive ? (
                        <ShieldOff className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
