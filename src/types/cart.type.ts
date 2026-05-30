export interface CartItem {
  id: string;
  userId: string;
  medicineId: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    genericName: string;
    slug: string;
    price: string;
    discountPrice: string;
    stockQuantity: number;
    images: {
      id: string;
      medicineId: string;
      imageUrl: string;
      altText: string;
      isPrimary: boolean;
      createdAt: string;
    }[];
  };
}
