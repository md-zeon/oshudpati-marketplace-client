"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Loader2 } from "lucide-react";

type Provider = "google" | "twitter";

const SocialAuth = () => {
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  const handleSocialLogin = async (provider: Provider) => {
    if (pendingProvider) return;
    setPendingProvider(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${env.NEXT_PUBLIC_FRONTEND_URL}/auth-callback`,
      });
    } finally {
      setPendingProvider(null);
    }
  };

  const isPending = (provider: Provider) => pendingProvider === provider;

  return (
    <>
      <div
        className="my-4 flex items-center gap-3 text-muted-foreground"
        aria-hidden="true"
      >
        <div className="h-px flex-1 bg-border-default" />
        <span className="text-xs font-medium uppercase tracking-wide">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-border-default" />
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={pendingProvider !== null}
          onClick={() => handleSocialLogin("google")}
          className="h-12 flex-1 cursor-pointer rounded-xl font-medium"
          aria-label="Continue with Google"
        >
          {isPending("google") ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Image
              src="/logo/google.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          )}
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={pendingProvider !== null}
          onClick={() => handleSocialLogin("twitter")}
          className="h-12 flex-1 cursor-pointer rounded-xl font-medium"
          aria-label="Continue with Twitter"
        >
          {isPending("twitter") ? (
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          ) : (
            <Image
              src="/logo/x.svg"
              alt=""
              width={20}
              height={20}
              className="size-5"
            />
          )}
          Twitter
        </Button>
      </div>
    </>
  );
};

export default SocialAuth;
