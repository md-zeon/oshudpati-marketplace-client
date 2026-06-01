"use server";

import { updateTag } from "next/cache";
import { ReviewService } from "@/services/review.service";
import { CreateReviewPayload, UpdateReviewPayload } from "@/types";

export const getMedicineReviews = async (medicineId: string) => {
  const res = await ReviewService.getMedicineReviews(medicineId);
  return res;
};

export const createReview = async (payload: CreateReviewPayload) => {
  const res = await ReviewService.createReview(
    payload.medicineId,
    payload.rating,
    payload.comment,
  );

  if (res?.success) {
    updateTag("reviews");
    updateTag("medicine");
  }

  return res;
};

export const updateReview = async (
  reviewId: string,
  payload: UpdateReviewPayload,
) => {
  const res = await ReviewService.updateReview(reviewId, payload);

  if (res?.success) {
    updateTag("reviews");
    updateTag("medicine");
  }

  return res;
};

export const deleteReview = async (reviewId: string) => {
  const res = await ReviewService.deleteReview(reviewId);

  if (res?.success) {
    updateTag("reviews");
    updateTag("medicine");
  }

  return res;
};
