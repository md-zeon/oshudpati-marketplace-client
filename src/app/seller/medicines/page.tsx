import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import {
  getSellerMedicines,
  deleteMedicineAction,
} from "@/actions/medicine.action";
import { Pill, Plus, Package, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "My Medicines",
  description: "Manage your medicines",
};

interface MedicineImage {
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
}

interface MedicineCategory {
  id: string;
  name: string;
  slug: string;
}

interface MedicineItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  discountPrice: string | null;
  stockQuantity: number;
  isActive: boolean;
  images: MedicineImage[];
  category: MedicineCategory;
  _count: { orderItems: number };
  createdAt: string;
}

const SellerMedicines = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "SELLER") return redirect("/dashboard");

  const res = await getSellerMedicines();
  const medicines: MedicineItem[] = res?.success ? res.data : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50">
            <Pill className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Medicines</h1>
            <p className="text-sm text-slate-500">
              {medicines.length} medicines
            </p>
          </div>
        </div>
        <Link
          href="/seller/medicines/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </Link>
      </div>

      {medicines.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">No medicines yet</p>
          <Link
            href="/seller/medicines/new"
            className="inline-block mt-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Add your first medicine
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-600">
                  Medicine
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Category
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Price
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Stock
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Sold
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((m) => {
                const primaryImage =
                  m.images?.find((i) => i.isPrimary)?.imageUrl ||
                  m.images?.[0]?.imageUrl;
                const price = m.discountPrice
                  ? Number(m.discountPrice)
                  : Number(m.price);
                const originalPrice = Number(m.price);

                return (
                  <TableRow key={m.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={m.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Pill className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            /{m.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {m.category?.name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-slate-800">
                        ৳{price.toFixed(0)}
                      </span>
                      {originalPrice > price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1">
                          ৳{originalPrice.toFixed(0)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${m.stockQuantity > 5 ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {m.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {m._count?.orderItems || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/seller/medicines/${m.id}`}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteMedicineAction(m.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
export default SellerMedicines;
