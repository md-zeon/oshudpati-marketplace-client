export interface Review {
  id: string;
  customerId: string;
  medicineId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewMeta {
  averageRating: number;
  totalReviews: number;
}
