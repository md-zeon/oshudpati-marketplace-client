import { redirect } from "next/navigation";
import Link from "next/link";
import { userService } from "@/services/user.service";
import { getAllUsersAction } from "@/actions/admin.action";
import {
  Users,
  ShieldAlert,
  Store,
  User,
  CheckCircle2,
  Ban,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageSection } from "@/components/shared/PageSection";
import { BanButton } from "./_components/BanButton";
import { UserFilters } from "./_components/UserFilters";

export const metadata = {
  title: "Manage Users",
  description: "Admin user management",
};

const ROLE_BADGE: Record<string, { label: string; className: string; Icon: typeof User }> = {
  ADMIN: {
    label: "Admin",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: ShieldAlert,
  },
  SELLER: {
    label: "Seller",
    className: "bg-brand-50 text-brand-700 border-brand-200",
    Icon: Store,
  },
  CUSTOMER: {
    label: "Customer",
    className: "bg-trust-50 text-trust-700 border-trust-200",
    Icon: User,
  },
};

const STATUS_BADGE: Record<string, { label: string; className: string; Icon: typeof User }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-status-delivered/10 text-status-delivered border-status-delivered/20",
    Icon: CheckCircle2,
  },
  BANNED: {
    label: "Banned",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: Ban,
  },
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
  page?: string;
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
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 25;

  const res = await getAllUsersAction({
    search: params.search,
    role: params.role,
    accountStatus: params.status,
    page,
    limit,
  });

  const users: AdminUser[] = res?.success ? res.data : [];
  const meta = res?.meta || { total: 0 };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / limit));

  const pageUrl = (nextPage: number) => {
    const qp = new URLSearchParams();
    if (params.search) qp.set("search", params.search);
    if (params.role) qp.set("role", params.role);
    if (params.status) qp.set("status", params.status);
    if (nextPage > 1) qp.set("page", String(nextPage));
    const qs = qp.toString();
    return qs ? `/admin/users?${qs}` : "/admin/users";
  };

  const initials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const roleConfig = (role: string) =>
    ROLE_BADGE[role] || {
      label: role,
      className: "bg-slate-50 text-slate-600 border-slate-200",
      Icon: User,
    };

  const statusConfig = (status: string) =>
    STATUS_BADGE[status] || {
      label: status,
      className: "bg-slate-50 text-slate-600 border-slate-200",
      Icon: User,
    };

  return (
    <div className="space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-trust-50 p-2.5">
            <Users className="h-5 w-5 text-trust-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-trust-900">Users</h1>
            <p className="text-sm text-muted-foreground">
              {meta.total} user{meta.total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <Card className="border-admin-border">
          <CardHeader className="border-b border-admin-border">
            <UserFilters
              initialSearch={params.search}
              initialRole={params.role}
              initialStatus={params.status}
            />
          </CardHeader>

          {users.length === 0 ? (
            <Empty className="py-16">
              <Users className="h-10 w-10 text-trust-300" aria-hidden />
              <EmptyTitle>
                {params.search || params.role || params.status
                  ? "No users match your filters"
                  : "No users found"}
              </EmptyTitle>
              <EmptyDescription>
                {params.search || params.role || params.status
                  ? "Try adjusting your search or clearing the filters."
                  : "Registered users will appear here."}
              </EmptyDescription>
            </Empty>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-175">
                  <thead>
                    <tr className="border-b border-admin-border bg-trust-50/60">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-text">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-text">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-text">
                        Shop
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-admin-text">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-admin-text">
                        Verified
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-admin-text">
                        Joined
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-admin-text">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => {
                      const rc = roleConfig(u.role);
                      const sc = statusConfig(u.accountStatus);
                      const RoleIcon = rc.Icon;
                      const StatusIcon = sc.Icon;
                      return (
                        <tr
                          key={u.id}
                          className="transition-colors hover:bg-trust-50/40"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-admin-border">
                                <AvatarImage src={u.image || ""} alt={u.name} />
                                <AvatarFallback className="bg-trust-100 text-xs font-bold text-trust-700">
                                  {initials(u.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {u.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              className={`${rc.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                            >
                              <RoleIcon className="h-3 w-3" aria-hidden />
                              {rc.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {u.shop ? u.shop.name : "-"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge
                              className={`${sc.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                            >
                              <StatusIcon className="h-3 w-3" aria-hidden />
                              {sc.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {u.emailVerified ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-delivered">
                                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                                Verified
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString("en-BD", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <BanButton
                              userId={u.id}
                              userName={u.name}
                              currentStatus={u.accountStatus}
                              isAdmin={u.role === "ADMIN"}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 lg:hidden">
                {users.map((u) => {
                  const rc = roleConfig(u.role);
                  const sc = statusConfig(u.accountStatus);
                  const RoleIcon = rc.Icon;
                  const StatusIcon = sc.Icon;
                  return (
                    <div key={u.id} className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Avatar className="h-10 w-10 border border-admin-border">
                            <AvatarImage src={u.image || ""} alt={u.name} />
                            <AvatarFallback className="bg-trust-100 text-xs font-bold text-trust-700">
                              {initials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {u.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`${rc.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                        >
                          <RoleIcon className="h-3 w-3" aria-hidden />
                          {rc.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Status
                          </p>
                          <Badge
                            className={`${sc.className} border px-2 py-0.5 text-[10px] font-bold uppercase`}
                          >
                            <StatusIcon className="h-3 w-3" aria-hidden />
                            {sc.label}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Shop
                          </p>
                          <p className="truncate text-foreground">
                            {u.shop?.name || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {u.emailVerified ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-status-delivered">
                              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                              Verified
                            </span>
                          ) : (
                            "Unverified"
                          )}
                        </span>
                        <span>
                          {new Date(u.createdAt).toLocaleDateString("en-BD", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <BanButton
                        userId={u.id}
                        userName={u.name}
                        currentStatus={u.accountStatus}
                        isAdmin={u.role === "ADMIN"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {users.length > 0 && totalPages > 1 && (
            <nav
              aria-label="User pagination"
              className="flex items-center justify-between gap-3 border-t border-admin-border px-4 py-3"
            >
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} · {meta.total} users
              </p>
              <div className="flex items-center gap-1">
                <Link
                  href={page > 1 ? pageUrl(page - 1) : "#"}
                  aria-disabled={page <= 1}
                  className={`inline-flex items-center gap-1 rounded-lg border border-admin-border bg-white px-2.5 py-1.5 text-sm font-medium text-admin-text/70 outline-none transition-colors hover:bg-trust-50 hover:text-trust-700 focus-visible:ring-2 focus-visible:ring-trust-600 ${
                    page <= 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Prev
                </Link>
                <Link
                  href={page < totalPages ? pageUrl(page + 1) : "#"}
                  aria-disabled={page >= totalPages}
                  className={`inline-flex items-center gap-1 rounded-lg border border-admin-border bg-white px-2.5 py-1.5 text-sm font-medium text-admin-text/70 outline-none transition-colors hover:bg-trust-50 hover:text-trust-700 focus-visible:ring-2 focus-visible:ring-trust-600 ${
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </nav>
          )}
        </Card>
      </PageSection>
    </div>
  );
};
export default AdminUsers;
