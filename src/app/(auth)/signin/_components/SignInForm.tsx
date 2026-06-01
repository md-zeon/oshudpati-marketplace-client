"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import SocialAuth from "../../_components/SocialAuth";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInForm({
  redirect,
  ...props
}: { redirect?: string } & React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Signing you in...");
      try {
        const { data, error } = await authClient.signIn.email(value);
        if (error) {
          console.error("Sign-in error:", error);
          console.error("data:", data);
          if (error.status === 403) {
            toast.error(
              "Your email is not verified. Please verify your email before signing in.",
              { id: toastId },
            );
            router.push(
              "/verify-email?email=" +
                encodeURIComponent(value.email) +
                (redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""),
            );
          } else {
            toast.error(error.message, {
              id: toastId,
            });
          }
          return;
        }

        toast.success("Signed in successfully!", {
          id: toastId,
        });

        if (redirect) {
          router.push(
            "/auth-callback?redirect=" + encodeURIComponent(redirect || "/"),
          );
        } else {
          router.push("/auth-callback");
        }
      } catch {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      }
    },
  });
  return (
    <Card {...props} className="ring-background">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold">
          Sign in to your account
        </CardTitle>
        <CardDescription className="text-xs">
          If you have an account, sign in with your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel className="font-light" htmlFor={field.name}>
                      Email *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your email"
                      className="lowercase py-5 shadow-md"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel className="font-light" htmlFor={field.name}>
                      Password *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your password"
                      className="py-5 shadow-md"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <Field>
              <Button
                type="submit"
                variant="outline"
                className="w-full py-5 cursor-pointer"
              >
                Sign In
              </Button>
              <SocialAuth />
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link
                  href={
                    redirect
                      ? `/signup?redirect=${encodeURIComponent(redirect)}`
                      : "/signup"
                  }
                >
                  Sign up
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
