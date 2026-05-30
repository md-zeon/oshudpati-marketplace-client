// LocalStorage Schema helper

const LOCAL_STORAGE_KEY = "guest-pharmacy-cart";

type LocalCartItem = {
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
};

export const getLocalCart = (): LocalCartItem[] => {
  if (typeof window === "undefined") return []; // Ensure this only runs in the browser

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveLocalCart = (cart: LocalCartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch a custom event so other components on the page know the cart updated!
    window.dispatchEvent(new Event("local-cart-updated"));
  }
};

export const clearLocalCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(new Event("local-cart-updated"));
  }
};
