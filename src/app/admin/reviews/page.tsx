import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getAllReviewsAction } from "@/actions/admin.action";
import { ReviewManager } from "./_components/ReviewManager";
import type { Review } from "@/types";

export const metadata = {
  title: "Manage Reviews",
  description: "Admin review management",
};

const AdminReviews = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const res = await getAllReviewsAction();
  const reviews: Review[] = res?.success ? res.data : [];

  return <ReviewManager initialReviews={reviews} />;
};

export default AdminReviews;
