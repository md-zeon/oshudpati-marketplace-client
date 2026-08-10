"use client";

import { useState } from "react";
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
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import SocialAuth from "../../_components/SocialAuth";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInForm({
  redirect,
  ...props
}: { redirect?: string } & React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId = toast.loading("Signing you in...");
      try {
        const { error } = await authClient.signIn.email(value);
        if (error) {
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
          setIsSubmitting(false);
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
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Card
      {...props}
      className="ring-brand-700/10 shadow-lg shadow-brand-900/5 border-border-default"
    >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold text-brand-900">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in with your email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
          noValidate
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="font-medium text-sm text-foreground"
                      htmlFor={field.name}
                    >
                      Email address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 rounded-xl text-base"
                      />
                    </InputGroup>
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                        className="flex items-center gap-1.5"
                      >
                        <ShieldAlert className="size-3.5 shrink-0" aria-hidden="true" />
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
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
                    <FieldLabel
                      className="font-medium text-sm text-foreground"
                      htmlFor={field.name}
                    >
                      Password <span className="text-destructive">*</span>
                    </FieldLabel>
                    <InputGroup className="h-12">
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        aria-describedby={
                          isInvalid ? `${field.name}-error` : undefined
                        }
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="h-12 rounded-xl text-base"
                      />
                      <InputGroupButton
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="mr-1 size-9 cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </InputGroupButton>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                        className="flex items-center gap-1.5"
                      >
                        <ShieldAlert className="size-3.5 shrink-0" aria-hidden="true" />
                        {field.state.meta.errors[0]?.message}
                      </FieldError>
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <Field>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-brand-700 text-white font-semibold cursor-pointer hover:bg-brand-600 active:bg-brand-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <SocialAuth />
              <FieldDescription className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={
                    redirect
                      ? `/signup?redirect=${encodeURIComponent(redirect)}`
                      : "/signup"
                  }
                  className="font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
                >
                  Create an account
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
