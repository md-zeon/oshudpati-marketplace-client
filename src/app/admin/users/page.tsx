import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import {
  getAllUsersAction,
  updateUserAccountStatusAction,
} from "@/actions/admin.action";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "Manage Users",
  description: "Admin user management",
};

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "bg-red-50 text-red-700 border-red-200",
  SELLER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CUSTOMER: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BANNED: "bg-red-50 text-red-700 border-red-200",
};

interface ShopInfo {
  id: string;
  name: string;
  slug: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  image: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  createdAt: string;
  shop: ShopInfo | null;
}

interface SearchParams {
  search?: string;
  role?: string;
  status?: string;
}

const AdminUsers = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const params = await searchParams;

  const res = await getAllUsersAction({
    search: params.search,
    role: params.role,
    accountStatus: params.status,
    limit: 50,
  });

  const users: AdminUser[] = res?.success ? res.data : [];
  const meta = res?.meta || { total: 0 };

  return (
    <div>
      <PageSection>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Users</h1>
              <p className="text-sm text-slate-500">{meta.total} total users</p>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection>
        {users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-sm font-medium text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      User
                    </th>
                    <th className="text-left font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Role
                    </th>
                    <th className="text-left font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Shop
                    </th>
                    <th className="text-center font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-center font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Verified
                    </th>
                    <th className="text-right font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Joined
                    </th>
                    <th className="text-right font-semibold text-slate-600 text-xs uppercase tracking-wider px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => {
                    const roleBadge =
                      ROLE_BADGE[u.role] || "bg-slate-50 text-slate-600";
                    const statusBadge =
                      STATUS_BADGE[u.accountStatus] ||
                      "bg-slate-50 text-slate-600";
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 text-sm">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            className={`${roleBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {u.shop ? u.shop.name : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            className={`${statusBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                          >
                            {u.accountStatus}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {u.emailVerified ? (
                            <span className="text-emerald-600 text-xs font-semibold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">✗</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form
                            action={async () => {
                              "use server";
                              await updateUserAccountStatusAction(
                                u.id,
                                u.accountStatus === "ACTIVE"
                                  ? "BANNED"
                                  : "ACTIVE",
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                u.accountStatus === "ACTIVE"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >
                              {u.accountStatus === "ACTIVE"
                                ? "Ban"
                                : "Activate"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {users.map((u) => {
                const roleBadge =
                  ROLE_BADGE[u.role] || "bg-slate-50 text-slate-600";
                const statusBadge =
                  STATUS_BADGE[u.accountStatus] || "bg-slate-50 text-slate-600";
                return (
                  <div key={u.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                      <Badge
                        className={`${roleBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                      >
                        {u.role}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-500">
                          Status:{" "}
                          <Badge
                            className={`${statusBadge} border text-[10px] font-bold uppercase px-2 py-0.5 ml-1`}
                          >
                            {u.accountStatus}
                          </Badge>
                        </p>
                        <p className="text-slate-500">
                          Shop:{" "}
                          <span className="text-slate-800">
                            {u.shop?.name || "-"}
                          </span>
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        {u.emailVerified ? "✓ Verified" : "✗ Unverified"}
                        <br />
                        {new Date(u.createdAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await updateUserAccountStatusAction(
                          u.id,
                          u.accountStatus === "ACTIVE" ? "BANNED" : "ACTIVE",
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className={`w-full text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                          u.accountStatus === "ACTIVE"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {u.accountStatus === "ACTIVE"
                          ? "Ban User"
                          : "Activate User"}
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PageSection>
    </div>
  );
};
export default AdminUsers;
