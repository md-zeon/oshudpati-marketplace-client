export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalSpent: number;
  totalSavings: number;
  savedAddresses: number;
  cartItemCount: number;
}

export interface QuickReorderItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  image: string | null;
}

export interface DashboardVendorOrder {
  id: string;
  sellerId: string;
  orderStatus: string;
  vendorSubtotal: number;
  orderItems: DashboardOrderItem[];
}

export interface DashboardOrderItem {
  id: string;
  medicineId: string;
  medicineNameSnapshot: string;
  medicineImageSnapshot: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  subtotalAmount: number;
  deliveryFee: number;
  paymentStatus: string;
  placedAt: string;
  createdAt: string;
  vendorOrders: DashboardVendorOrder[];
}

export interface DashboardDefaultAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  division: string;
  district: string;
  area: string;
  streetAddress: string;
  addressLabel: string | null;
  isDefault: boolean;
}

export interface CustomerDashboard {
  stats: DashboardStats;
  recentOrders: DashboardRecentOrder[];
  quickReorder: QuickReorderItem[];
  defaultAddress: DashboardDefaultAddress | null;
}
