import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { User, Mail, Smartphone } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { PageSection } from "../PageSection";

export const metadata = {
  title: "Profile Settings",
  description: "Manage your profile information",
};

const ProfilePage = async () => {
  const session = await userService.getSession();

  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const user = session.data.user;

  return (
    <PageSection>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-50">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-500">
              Update your personal information and profile picture
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Email</p>
              <p className="text-sm font-semibold text-slate-800">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 font-medium">Phone</p>
              <p className="text-sm font-semibold text-slate-800">
                {user.phoneNumber || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <ProfileForm
            initialData={{
              name: user.name,
              email: user.email,
              phoneNumber: user.phoneNumber,
              image: user.image,
            }}
          />
        </div>
      </div>
    </PageSection>
  );
};

export default ProfilePage;
