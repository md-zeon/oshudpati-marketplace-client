import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import {
  getAllUsersAction,
  updateUserAccountStatusAction,
} from "@/actions/admin.action";
import { Users, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const AdminUsers = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; status?: string }>;
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search users..."
              className="pl-9 rounded-lg w-56 text-sm"
            />
          </div>
          <select
            name="role"
            defaultValue={params.role || ""}
            className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="SELLER">Seller</option>
            <option value="CUSTOMER">Customer</option>
          </select>
          <select
            name="status"
            defaultValue={params.status || ""}
            className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BANNED">Banned</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-600">
                  User
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Shop
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-center font-semibold text-slate-600">
                  Verified
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Joined
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const roleBadge =
                  ROLE_BADGE[u.role] || "bg-slate-50 text-slate-600";
                const statusBadge =
                  STATUS_BADGE[u.accountStatus] || "bg-slate-50 text-slate-600";

                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${roleBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {u.shop ? u.shop.name : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`${statusBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
                      >
                        {u.accountStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {u.emailVerified ? (
                        <span className="text-emerald-600 text-xs font-semibold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">✗</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
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
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            u.accountStatus === "ACTIVE"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {u.accountStatus === "ACTIVE" ? "Ban" : "Activate"}
                        </button>
                      </form>
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
export default AdminUsers;
