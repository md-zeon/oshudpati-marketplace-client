"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const SocialAuth = () => {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/auth-callback`,
    });
  };

  const handleGitHubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/auth-callback`,
    });
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
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          className="flex-1 py-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
        >
          <Image
            src="/logo/google.svg"
            alt="Google Icon"
            width={20}
            height={20}
          />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={handleGitHubLogin}
          className="flex-1 py-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
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
