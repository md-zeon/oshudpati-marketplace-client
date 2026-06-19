"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createReview,
  updateReview,
  deleteReview,
} from "@/actions/review.action";
import { Review } from "@/types";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

const ReviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().max(500, "Comment cannot exceed 500 characters"),
});

interface ReviewFormProps {
  medicineId: string;
  medicineName: string;
  existingReview?: Review | null;
  isAuthenticated: boolean;
  totalReviews: number;
  onSuccess?: () => void;
}

export function ReviewForm({
  medicineId,
  medicineName,
  existingReview,
  isAuthenticated,
  totalReviews,
  onSuccess,
}: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditing = !!existingReview;

  const form = useForm({
    defaultValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || "",
    },
    validators: {
      onSubmit: ReviewSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isAuthenticated) {
        toast.error("Please sign in to submit a review");
        return;
      }

      const toastId = toast.loading(
        isEditing ? "Updating your review..." : "Submitting your review...",
      );

      try {
        let res;

        if (isEditing && existingReview) {
          res = await updateReview(existingReview.id, {
            rating: value.rating,
            comment: value.comment || undefined,
          });
        } else {
          res = await createReview({
            medicineId,
            rating: value.rating,
            comment: value.comment || undefined,
          });
        }

        if (res?.success) {
          toast.success(
            isEditing
              ? "Review updated successfully!"
              : "Review submitted successfully!",
            { id: toastId },
          );
          setIsOpen(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(res?.message || "Failed to submit review", {
            id: toastId,
          });
        }
      } catch {
        toast.error("An unexpected error occurred", { id: toastId });
      }
    },
  });

  const handleDelete = async () => {
    if (!existingReview) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    setIsDeleting(true);
    const toastId = toast.loading("Deleting your review...");

    try {
      const res = await deleteReview(existingReview.id);

      if (res?.success) {
        toast.success("Review deleted successfully", { id: toastId });
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || "Failed to delete review", {
          id: toastId,
        });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen && !isEditing) {
    // If there are no reviews at all, show the "no reviews yet" prompt
    if (totalReviews === 0) {
      return (
        <div className="text-center py-10">
          <div className="flex justify-center mb-4">
            <Star className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Be the first to review &quot;{medicineName}&quot;
          </p>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("Please sign in to submit a review");
                return;
              }
              setIsOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Write a Review
          </Button>
        </div>
      );
    }

    // There are other reviews, just show the "Write a Review" button
    return (
      <div className="text-center py-6 border-t border-slate-100">
        <p className="text-sm text-slate-500 mb-4">
          Share your experience with this medicine
        </p>
        <Button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error("Please sign in to submit a review");
              return;
            }
            setIsOpen(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          Write a Review
        </Button>
      </div>
    );
  }

  if (!isOpen && isEditing) {
    return (
      <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
        <p className="text-sm text-slate-600 mb-3">
          You have already reviewed this medicine.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => setIsOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs cursor-pointer text-brand hover:bg-brand hover:text-white transition-colors duration-200"
          >
            Edit Your Review
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="outline"
            size="sm"
            className="text-xs text-red-500 border-red-200 hover:bg-red-500 hover:text-white cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>

        {/* Show existing review summary */}
        <div className="mt-4 flex items-center justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= (existingReview?.rating || 0)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200"
              }`}
            />
          ))}
        </div>
        {existingReview?.comment && (
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            &quot;{existingReview.comment}&quot;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white">
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e);
        }}
        className="space-y-4"
      >
        {/* Star Rating */}
        <form.Field name="rating">
          {(field) => (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                Your Rating *
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => field.handleChange(star)}
                    className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || field.state.value)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Comment */}
        <form.Field name="comment">
          {(field) => (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">
                Your Review (optional)
              </p>
              <Textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Share your experience with this medicine..."
                className="min-h-25 resize-y text-sm"
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
                <p className="text-xs text-slate-400 ml-auto">
                  {(field.state.value || "").length}/500
                </p>
              </div>
            </div>
          )}
        </form.Field>

        {/* Buttons */}
        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Submitting..."}
                  </>
                ) : isEditing ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  if (!isEditing) {
                    form.reset();
                  }
                }}
                className="text-sm cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
