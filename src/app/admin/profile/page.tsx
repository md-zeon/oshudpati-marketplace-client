import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { UserCircle, Mail, Smartphone, ShieldCheck } from "lucide-react";
import { ProfileForm } from "@/components/shared/user/ProfileForm";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "Admin Profile Settings",
  description: "Manage your admin profile information",
};

const AdminProfile = async () => {
  const session = await userService.getSession();
  if (!session?.success || !session.data?.user) return redirect("/signin");
  if (session.data.user.role !== "ADMIN") return redirect("/dashboard");

  const user = session.data.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "A";

  return (
    <div className="max-w-3xl space-y-6">
      <PageSection>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-trust-50 p-2.5">
            <UserCircle className="h-5 w-5 text-trust-600" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-trust-900">
              Profile Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Update your personal information and profile picture
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection delay={0.05}>
        <Card className="border-admin-border">
          <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16 border-2 border-trust-200">
              <AvatarImage src={user.image || ""} alt={user.name} />
              <AvatarFallback className="bg-trust-100 text-lg font-bold text-trust-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-trust-900">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-trust-200 bg-trust-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-trust-700">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                Admin
              </span>
            </div>
          </CardContent>
        </Card>
      </PageSection>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="border-admin-border">
          <CardContent className="flex items-center gap-3 p-4">
            <Mail className="h-4 w-4 text-trust-500" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {user.email}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-admin-border">
          <CardContent className="flex items-center gap-3 p-4">
            <Smartphone className="h-4 w-4 text-trust-500" aria-hidden />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Phone</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {user.phoneNumber || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <PageSection delay={0.1}>
        <Card className="border-admin-border">
          <CardContent className="p-6">
            <ProfileForm
              initialData={{
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                image: user.image,
              }}
            />
          </CardContent>
        </Card>
      </PageSection>
    </div>
  );
};

export default AdminProfile;
