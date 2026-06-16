import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getSellerMedicines } from "@/actions/medicine.action";
import { Pill, Plus, Package } from "lucide-react";
import Link from "next/link";
import { PageSection } from "@/components/shared/PageSection";
import { MedicinesTable } from "./_components/MedicinesTable";

export const metadata = {
  title: "My Medicines",
  description: "Manage your medicines",
};

export interface MedicineItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  discountPrice: string | null;
  stockQuantity: number;
  isActive: boolean;
  images: { imageUrl: string; altText: string | null; isPrimary: boolean }[];
  category: { id: string; name: string; slug: string };
  _count: { orderItems: number };
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface SearchParams {
  page?: string;
  search?: string;
}

const SellerMedicines = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search || "";

  const res = await getSellerMedicines({ page, limit: 10, search });
  const medicines: MedicineItem[] = res?.success ? res.data : [];
  const meta: PaginationMeta | null = res?.meta || null;

  return (
    <div>
      {/* Header */}
      <PageSection>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Medicines</h1>
              <p className="text-sm text-slate-500">
                {meta ? meta.total : medicines.length} medicines
              </p>
            </div>
          </div>
          <Link
            href="/seller/medicines/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </Link>
        </div>
      </PageSection>

      {/* Empty State */}
      {medicines.length === 0 && !search ? (
        <PageSection>
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500">
              No medicines yet
            </p>
            <Link
              href="/seller/medicines/new"
              className="inline-block mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Add your first medicine
            </Link>
          </div>
        </PageSection>
      ) : (
        <MedicinesTable medicines={medicines} meta={meta} />
      )}
    </div>
  );
};
export default SellerMedicines;
