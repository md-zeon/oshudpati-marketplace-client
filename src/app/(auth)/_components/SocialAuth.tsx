"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const SocialAuth = () => {
  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: env.NEXT_PUBLIC_FRONTEND_URL,
      });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: env.NEXT_PUBLIC_FRONTEND_URL,
      });
    } catch (error) {
      console.error("GitHub login failed:", error);
    }
  };

  return (
    <>
      <div className="my-4 flex items-center gap-2">
        <hr className="flex-1 border-t text-slate-300" />
        <span className="text-sm text-muted-foreground uppercase font-semibold">
          OR Sign in with
        </span>
        <hr className="flex-1 border-t text-slate-300" />
      </div>
      <div className="flex gap-4">
        {/* Google */}
        <Button
          variant="outline"
          type="button"
          onClick={() => handleGoogleLogin()}
          className="flex-1 py-5 cursor-pointer"
        >
          <Image
            src="/logo/google.svg"
            alt="Google Icon"
            width={20}
            height={20}
          />
          Google
        </Button>
        {/* GitHub */}
        <Button
          variant="outline"
          type="button"
          onClick={() => handleGitHubLogin()}
          className="flex-1 py-5 cursor-pointer"
        >
          <Image
            src="/logo/github.svg"
            alt="GitHub Icon"
            width={20}
            height={20}
            className="invert"
          />
          GitHub
        </Button>
      </div>
    </>
  );
};

export default SocialAuth;
