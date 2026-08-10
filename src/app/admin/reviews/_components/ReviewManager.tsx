"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  toggleReviewStatusAction,
  addReviewReplyAction,
  getAllReviewsAction,
} from "@/actions/admin.action";
import { MessageSquare, ShieldCheck, ShieldOff, Loader2 } from "lucide-react";
import { Review } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageSection } from "@/components/shared/PageSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ReviewManagerProps {
  initialReviews: Review[];
}

type FilterKey = "all" | "active" | "hidden";

export function ReviewManager({ initialReviews }: ReviewManagerProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [confirmTarget, setConfirmTarget] = useState<Review | null>(null);

  const refresh = async () => {
    const res = await getAllReviewsAction();
    if (res?.success) setReviews(res.data);
    router.refresh();
  };

  const handleToggleStatus = async (reviewId: string, currentStatus: boolean) => {
    setBusyId(reviewId);
    const tid = toast.loading(
      currentStatus ? "Deactivating review..." : "Activating review...",
    );
    const res = await toggleReviewStatusAction(reviewId, !currentStatus);
    if (res?.success) {
      toast.success(
        `Review ${currentStatus ? "deactivated" : "activated"}`,
        { id: tid },
      );
      setConfirmTarget(null);
      refresh();
    } else {
      toast.error(res?.message || "Failed to update", { id: tid });
    }
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
    } else {
      toast.error(res?.message || "Failed to add reply", { id: tid });
    }
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

  const activeCount = reviews.filter((r) => r.isActive).length;
  const hiddenCount = reviews.length - activeCount;
  const filteredReviews =
    filter === "active"
      ? reviews.filter((r) => r.isActive)
      : filter === "hidden"
        ? reviews.filter((r) => !r.isActive)
        : reviews;

  const initials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-accent-50 p-2.5">
            <MessageSquare className="h-5 w-5 text-amber-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-trust-900">Reviews</h1>
            <p className="text-sm text-muted-foreground">
              {reviews.length} total · {activeCount} visible · {hiddenCount}{" "}
              hidden
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as FilterKey)}
          className="flex w-full flex-col"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="text-sm">
              All
              <Badge className="ml-1.5 bg-trust-600 px-1.5 py-0 text-[10px] text-white">
                {reviews.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active" className="text-sm">
              Active
              <Badge className="ml-1.5 bg-brand-700 px-1.5 py-0 text-[10px] text-white">
                {activeCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="hidden" className="text-sm">
              Hidden
              {hiddenCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 px-1.5 py-0 text-[10px]"
                >
                  {hiddenCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            {filteredReviews.length === 0 ? (
              <Empty className="py-16">
                <MessageSquare className="h-10 w-10 text-trust-300" aria-hidden />
                <EmptyTitle>
                  {filter === "all"
                    ? "No reviews found"
                    : filter === "active"
                      ? "No active reviews"
                      : "No hidden reviews"}
                </EmptyTitle>
                <EmptyDescription>
                  {filter === "hidden"
                    ? "Reviews you hide will appear here."
                    : "Customer reviews will appear here."}
                </EmptyDescription>
              </Empty>
            ) : (
              <div className="space-y-3 stagger-children">
                {filteredReviews.map((review) => (
                  <Card
                    key={review.id}
                    className="border-admin-border p-5 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Avatar className="h-9 w-9 border border-admin-border">
                            <AvatarImage
                              src={review.customer.image || ""}
                              alt={review.customer.name}
                            />
                            <AvatarFallback className="bg-trust-100 text-xs font-bold text-trust-700">
                              {initials(review.customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="truncate text-sm font-semibold text-foreground">
                            {review.customer.name}
                          </p>
                          <Badge
                            className={`ml-auto border px-2 py-0.5 text-[10px] font-bold uppercase ${
                              review.isActive
                                ? "bg-status-delivered/10 text-status-delivered border-status-delivered/20"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {review.isActive ? (
                              <ShieldCheck className="h-3 w-3" aria-hidden />
                            ) : (
                              <ShieldOff className="h-3 w-3" aria-hidden />
                            )}
                            {review.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Rating
                            value={review.rating}
                            max={5}
                            readOnly
                            size="sm"
                            aria-label={`${review.rating} out of 5 stars`}
                          />
                          <span className="text-xs text-muted-foreground">
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

                        {review.comment ? (
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {review.comment}
                          </p>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">
                            No comment provided
                          </p>
                        )}

                        {review.reply && !replyingTo && (
                          <div className="rounded-lg border border-trust-200 bg-trust-50 p-3">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-trust-700">
                              Admin Reply
                              {review.repliedAt && (
                                <span className="ml-2 font-normal text-admin-text/70">
                                  ·{" "}
                                  {new Date(
                                    review.repliedAt,
                                  ).toLocaleDateString("en-BD", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              )}
                            </p>
                            <p className="text-sm leading-relaxed text-trust-900">
                              {review.reply}
                            </p>
                          </div>
                        )}

                        {replyingTo === review.id && (
                          <div className="space-y-2 rounded-lg bg-slate-50 p-3">
                            <Textarea
                              value={replyText}
                              onChange={(e) => {
                                setReplyText(e.target.value);
                                setLocalReply(review.id, e.target.value);
                              }}
                              placeholder="Write your reply..."
                              aria-label="Reply text"
                              className="min-h-20 rounded-lg text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(review.id)}
                                disabled={busyId === review.id}
                                className="bg-trust-700 text-xs text-white hover:bg-trust-600"
                              >
                                {busyId === review.id ? (
                                  <>
                                    <Loader2
                                      className="mr-1 h-3.5 w-3.5 animate-spin"
                                      aria-hidden
                                    />
                                    Saving...
                                  </>
                                ) : (
                                  "Save Reply"
                                )}
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
                            className="text-xs text-admin-text/70"
                          >
                            Reply
                          </Button>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setConfirmTarget(review)}
                          disabled={busyId === review.id}
                          title={
                            review.isActive ? "Hide review" : "Show review"
                          }
                          aria-label={
                            review.isActive ? "Hide review" : "Show review"
                          }
                          className={`h-8 w-8 ${
                            review.isActive
                              ? "text-admin-text/60 hover:bg-red-50 hover:text-red-500"
                              : "text-brand-500 hover:bg-brand-50 hover:text-brand-600"
                          }`}
                        >
                          {review.isActive ? (
                            <ShieldOff className="h-4 w-4" aria-hidden />
                          ) : (
                            <ShieldCheck className="h-4 w-4" aria-hidden />
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PageSection>

      <AlertDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        <AlertDialogContent className="max-w-sm rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              {confirmTarget?.isActive ? "Hide review" : "Show review"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {confirmTarget?.isActive ? (
                <>
                  Hide the review by{" "}
                  <span className="font-semibold text-foreground">
                    {confirmTarget.customer.name}
                  </span>
                  ? It will no longer be visible to customers on the storefront.
                </>
              ) : (
                <>
                  Make the review by{" "}
                  <span className="font-semibold text-foreground">
                    {confirmTarget?.customer.name}
                  </span>{" "}
                  visible to customers again?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmTarget(null)}
              className="cursor-pointer rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmTarget &&
                handleToggleStatus(confirmTarget.id, confirmTarget.isActive)
              }
              disabled={busyId === confirmTarget?.id}
              className={`cursor-pointer rounded-lg ${
                confirmTarget?.isActive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-brand-600 text-white hover:bg-brand-700"
              }`}
            >
              {busyId === confirmTarget?.id && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              {confirmTarget?.isActive ? "Hide review" : "Show review"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
