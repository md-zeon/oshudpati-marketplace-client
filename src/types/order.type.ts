export interface ShippingAddressSnapshot {
  id?: string;
  fullName: string;
  phoneNumber: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  postalCode?: string;
  addressLabel?: string;
}

export interface SellerSnapshot {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "SELLER" | string;
  accountStatus: "ACTIVE" | string;
  phoneNumber: string | null;
}

export interface OrderItemSnapshot {
  id: string;
  vendorOrderId: string;
  medicineId: string;
  medicineNameSnapshot: string;
  medicineImageSnapshot: string;
  quantity: number;
  unitPrice: string; // Stored as a string in the API payload
  totalPrice: string; // Stored as a string in the API payload
  createdAt: string;
}

export interface VendorOrder {
  id: string;
  orderId: string;
  sellerId: string;
  orderStatus:
    | "PLACED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | string;
  vendorSubtotal: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemSnapshot[];
  seller: SellerSnapshot;
}

export interface OrderReceivedPayload {
  id: string;
  orderNumber: string;
  customerId: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | string;
  subtotalAmount: string;
  deliveryFee: string;
  discountAmount: string;
  totalAmount: string;
  shippingAddressSnapshot: ShippingAddressSnapshot;
  customerNote: string | null;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
  vendorOrders: VendorOrder[]; // <--- This replaces "vo: any"
}

export interface CheckoutItemInput {
  medicineId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  shippingAddressSnapshot: ShippingAddressSnapshot;
  customerNote?: string;
  items: CheckoutItemInput[];
}
