import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { getSellerMedicines } from "@/actions/medicine.action";
import { Pill, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SellerPageHeader } from "../_components/SellerPageHeader";
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
    <div className="space-y-6">
      <SellerPageHeader
        title="My Medicines"
        subtitle={
          meta
            ? `${meta.total} ${meta.total === 1 ? "medicine" : "medicines"} in your catalogue`
            : `${medicines.length} medicines`
        }
        icon={<Pill className="size-5" aria-hidden />}
        action={
          <Button
            asChild
            className="w-full bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800 sm:w-auto"
          >
            <Link href="/seller/medicines/new">
              <Plus className="size-4" aria-hidden /> Add Medicine
            </Link>
          </Button>
        }
      />

      {medicines.length === 0 && !search ? (
        <div className="rounded-xl border border-dashed border-border-default bg-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Pill className="size-7 text-brand-600" aria-hidden />
          </div>
          <h2 className="mt-4 text-base font-semibold text-brand-900">
            No medicines yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Add your first medicine to start selling on Oshudpati. Medicines
            with accurate names, prices and images sell better.
          </p>
          <Button
            asChild
            className="mt-5 bg-brand-700 text-white hover:bg-brand-600 active:bg-brand-800"
          >
            <Link href="/seller/medicines/new">
              <Plus className="size-4" aria-hidden /> Add your first medicine
            </Link>
          </Button>
        </div>
      ) : (
        <MedicinesTable medicines={medicines} meta={meta} />
      )}
    </div>
  );
};
export default SellerMedicines;
