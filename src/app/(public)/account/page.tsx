import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import {
  User,
  Mail,
  Smartphone,
  Shield,
  Calendar,
  ShoppingBag,
  Heart,
  MapPin,
  ArrowRight,
  LayoutDashboard,
  Store,
  ShieldCheck,
  Package,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Signout from "./_components/Signout";

export const metadata = {
  title: "My Account",
  description: "Manage your Oshudpati account",
};

const ROLE_BADGES: Record<string, string> = {
  ADMIN: "bg-red-50 text-red-700 border-red-200",
  SELLER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CUSTOMER: "bg-blue-50 text-blue-700 border-blue-200",
};

const ROLE_ICONS: Record<string, typeof Shield> = {
  ADMIN: ShieldCheck,
  SELLER: Store,
  CUSTOMER: User,
};

const AccountPage = async () => {
  const session = await userService.getSession();

  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const user = session.data.user;
  const role = user.role || "CUSTOMER";

  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const RoleIcon = ROLE_ICONS[role] || User;
  const roleBadge =
    ROLE_BADGES[role] || "bg-slate-50 text-slate-600 border-slate-200";

  const quickLinks = [
    ...(role === "ADMIN"
      ? [
          {
            href: "/admin/dashboard",
            label: "Admin Dashboard",
            icon: LayoutDashboard,
            desc: "Manage platform",
          },
          {
            href: "/admin/orders",
            label: "All Orders",
            icon: Package,
            desc: "View all orders",
          },
        ]
      : []),
    ...(role === "SELLER"
      ? [
          {
            href: "/seller/dashboard",
            label: "Seller Dashboard",
            icon: LayoutDashboard,
            desc: "Manage your shop",
          },
          {
            href: "/seller/medicines",
            label: "My Medicines",
            icon: Package,
            desc: "Manage inventory",
          },
          {
            href: "/seller/orders",
            label: "Orders",
            icon: ShoppingBag,
            desc: "View incoming orders",
          },
          {
            href: "/seller/shop",
            label: "My Shop",
            icon: Store,
            desc: "Manage shop details",
          },
        ]
      : []),
    ...(role === "CUSTOMER"
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            desc: "Your overview",
          },
          {
            href: "/dashboard/orders",
            label: "My Orders",
            icon: ShoppingBag,
            desc: "View order history",
          },
          {
            href: "/wishlist",
            label: "Wishlist",
            icon: Heart,
            desc: "Saved medicines",
          },
          {
            href: "/dashboard/addresses",
            label: "Addresses",
            icon: MapPin,
            desc: "Manage addresses",
          },
        ]
      : []),
  ];

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-BD", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16 border-2 border-emerald-200">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback className="bg-emerald-50 text-emerald-700 text-lg font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <Badge
              className={`${roleBadge} border text-[10px] font-bold uppercase px-2 py-0.5`}
            >
              <RoleIcon className="w-3 h-3 inline-block mr-0.5" />
              {role}
            </Badge>
          </div>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      {/* ============ INFO CARDS ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Email</p>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user.email}
            </p>
            {user.emailVerified && (
              <span className="text-[10px] text-emerald-600 font-semibold">
                ✓ Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Phone</p>
            <p className="text-sm font-semibold text-slate-800">
              {user.phoneNumber || "Not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Account Type</p>
            <p className="text-sm font-semibold text-slate-800 capitalize">
              {role.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Joined</p>
            <p className="text-sm font-semibold text-slate-800">{joinedDate}</p>
          </div>
        </div>
      </div>

      {/* ============ QUICK LINKS ============ */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {link.label}
                    </p>
                    <p className="text-xs text-slate-400">{link.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============ PROFILE EDIT ============ */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Account Settings
        </h2>
        <Link
          href="/dashboard/profile"
          className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                Edit Profile
              </p>
              <p className="text-xs text-slate-400">
                Update your name, photo, and contact information
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>

      {/* ============ SIGN OUT ============ */}
      <div className="mt-6">
        <Signout />
      </div>
    </div>
  );
};

export default AccountPage;
