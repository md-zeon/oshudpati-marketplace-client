import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Users } from "lucide-react";

export const metadata = {
  title: "Manage Users",
  description: "Admin user management",
};

const AdminUsers = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h1 className="text-xl font-bold text-slate-900">Users</h1>
      </div>
      <p className="text-sm text-slate-500 text-center py-16">
        User management coming soon.
      </p>
    </div>
  );
};
export default AdminUsers;
