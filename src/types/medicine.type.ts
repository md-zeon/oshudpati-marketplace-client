import { Category } from "./category.type";

export interface MedicineImage {
  id: string;
  medicineId: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface Medicine {
  id: string;
  slug: string;
  name: string;
  genericName: string;
  shortDescription: string;
  description: string;
  indications: string;
  dosageInstructions: string;
  sideEffects: string;
  manufacturerName: string;
  brandName: string;
  dosageForm: string;
  strength: string;
  unitPresentation: string;
  sku: string;
  price: string;
  discountPrice: string;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  totalSalesCount: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: MedicineImage[];
}
