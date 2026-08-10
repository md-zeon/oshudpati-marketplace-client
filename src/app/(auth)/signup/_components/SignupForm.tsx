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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import SocialAuth from "../../_components/SocialAuth";
import { Roles } from "@/constants/roles";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShoppingBag,
  Store,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { env } from "@/env";

const SignupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([Roles.CUSTOMER, Roles.SELLER], {
    error: "Please select a role",
  }),
});

const roleCardClass =
  "flex flex-col items-center justify-center gap-1 rounded-xl border border-border-default bg-card p-4 text-muted-foreground shadow-sm transition-all cursor-pointer peer-data-[state=checked]:border-brand-700 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-brand-600/30 peer-data-[state=checked]:text-brand-900 peer-data-[state=checked]:bg-brand-50 hover:border-brand-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";

export function SignupForm({
  redirect,
  ...props
}: React.ComponentProps<typeof Card> & { redirect?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Roles.CUSTOMER,
    },
    validators: {
      onSubmit: SignupSchema,
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const toastId = toast.loading("Creating your account...");

      try {
        const { error } = await authClient.signUp.email({
          ...value,
          callbackURL:
            `${env.NEXT_PUBLIC_FRONTEND_URL}/email-verified` +
            (redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""),
        });
        if (error) {
          toast.error(error.message, {
            id: toastId,
          });
          setIsSubmitting(false);
          return;
        }
        toast.success(
          "Account created successfully! A verification email has been sent to your email. Please check your inbox and verify your email to log in.",
          {
            id: toastId,
          },
        );
        router.push(
          "/verify-email" +
            (redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""),
        );
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
          Create your account
        </CardTitle>
        <CardDescription className="text-sm">
          Join Oshudpati to order medicines faster and track your deliveries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
          noValidate
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className="font-medium text-sm text-foreground"
                      htmlFor={field.name}
                    >
                      Full name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      aria-describedby={
                        isInvalid ? `${field.name}-error` : undefined
                      }
                      placeholder="Your name"
                      autoComplete="name"
                      className="h-12 rounded-xl text-base capitalize"
                    />
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
                    <Input
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
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel className="font-medium text-sm mb-2 block text-foreground">
                    Register as <span className="text-destructive">*</span>
                  </FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as string)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <RadioGroupItem
                        value={Roles.CUSTOMER}
                        id="role-customer"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="role-customer"
                        className={roleCardClass}
                      >
                        <ShoppingBag
                          className="mb-2 h-6 w-6 peer-data-[state=checked]:text-brand-700"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-sm">Customer</span>
                        <span className="text-xs text-muted-foreground text-center">
                          I want to buy products
                        </span>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value={Roles.SELLER}
                        id="role-seller"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="role-seller"
                        className={roleCardClass}
                      >
                        <Store
                          className="mb-2 h-6 w-6 peer-data-[state=checked]:text-brand-700"
                          aria-hidden="true"
                        />
                        <span className="font-medium text-sm">Seller</span>
                        <span className="text-xs text-muted-foreground text-center">
                          I want to sell products
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </Field>
              )}
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
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
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
                    <p className="text-xs text-muted-foreground">
                      Use at least 6 characters.
                    </p>
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
                form="signup-form"
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-brand-700 text-white font-semibold cursor-pointer hover:bg-brand-600 active:bg-brand-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <SocialAuth />
              <FieldDescription className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href={
                    redirect
                      ? `/signin?redirect=${encodeURIComponent(redirect)}`
                      : "/signin"
                  }
                  className="font-semibold text-brand-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
