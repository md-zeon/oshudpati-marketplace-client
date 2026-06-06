export interface WishlistItem {
  id: string;
  userId: string;
  medicineId: string;
  createdAt: string;
  medicine: {
    id: string;
    slug: string;
    name: string;
    genericName: string;
    price: string;
    discountPrice: string | null;
    stockQuantity: number;
    images: { imageUrl: string; altText: string | null; isPrimary: boolean }[];
    category: { id: string; name: string; slug: string };
  };
}
