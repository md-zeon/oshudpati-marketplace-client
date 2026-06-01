"use client";

import { useEffect, useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { Review } from "@/types";
import { authClient } from "@/lib/auth-client";

interface ReviewFormWrapperProps {
  medicineId: string;
  medicineName: string;
  totalReviews: number;
  reviews: Review[];
}

export function ReviewFormWrapper({
  medicineId,
  medicineName,
  totalReviews,
  reviews,
}: ReviewFormWrapperProps) {
  const [session, setSession] = useState<{
    authenticated: boolean;
    userId?: string;
  }>({ authenticated: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user) {
          setSession({ authenticated: true, userId: data.user.id });
        }
      } catch {
        // Not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse h-8 w-32 bg-slate-100 rounded mx-auto" />
      </div>
    );
  }

  // Find the current user's review from the reviews list
  const existingReview = session.userId
    ? reviews.find((r) => r.customerId === session.userId) || null
    : null;

  return (
    <ReviewForm
      medicineId={medicineId}
      medicineName={medicineName}
      existingReview={existingReview}
      isAuthenticated={session.authenticated}
      totalReviews={totalReviews}
    />
  );
}
