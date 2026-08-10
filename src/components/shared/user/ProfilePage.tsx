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
          <div className="p-2 rounded-xl bg-brand-subtle">
            <User className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Profile Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your personal information and profile picture
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border-default bg-card">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Email</p>
              <p className="text-sm font-semibold text-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border-default bg-card">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Phone</p>
              <p className="text-sm font-semibold text-foreground">
                {user.phoneNumber || "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-card rounded-xl border border-border-default p-6">
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
