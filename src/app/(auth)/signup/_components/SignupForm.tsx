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
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import SocialAuth from "../../_components/SocialAuth";
import { Roles } from "@/constants/roles";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Store } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { env } from "@/env";

const SignupSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([Roles.CUSTOMER, Roles.SELLER], {
    error: "Please select a role",
  }),
});

export function SignupForm({
  redirect,
  ...props
}: React.ComponentProps<typeof Card> & { redirect?: string }) {
  const router = useRouter();
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
      const toastId = toast.loading("Creating your account...");

      try {
        const { data, error } = await authClient.signUp.email({
          ...value,
          callbackURL:
            `${env.NEXT_PUBLIC_FRONTEND_URL}/email-verified` +
            (redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""),
        });
        if (error) {
          toast.error(error.message, {
            id: toastId,
          });
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
      }
    },
  });
  return (
    <Card {...props} className="ring-background">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-semibold">
          Create an Account
        </CardTitle>
        <CardDescription className="text-xs">
          There are many advantages to creating an account: the payment process
          is faster, shipment tracking is possible and much more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(e);
          }}
        >
          {/* Name */}
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel className="font-light" htmlFor={field.name}>
                      Name *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your name"
                      className="capitalize py-5 shadow-md"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            {/* Email */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel className="font-light" htmlFor={field.name}>
                      Email Address *
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter your email"
                      autoComplete="off"
                      className="lowercase py-5 shadow-md"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            {/* Role */}
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel className="font-light mb-2 block">
                    Register as *
                  </FieldLabel>
                  <RadioGroup
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as string)}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Customer Card */}
                    <div>
                      <RadioGroupItem
                        value={Roles.CUSTOMER}
                        id="role-customer"
                        className="peer sr-only" // Hide the default radio button
                      />
                      <Label
                        htmlFor="role-customer"
                        className="flex flex-col items-center justify-between rounded-xl border border-slate-300 hover:border-black bg-popover p-4 text-slate-500 hover:text-black cursor-pointer transition-all shadow-md gap-1 peer-data-[state=checked]:border-black peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-black/20 peer-data-[state=checked]:text-black"
                      >
                        <ShoppingBag className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                        <span className="font-medium text-sm">Customer</span>
                        <span className="text-[10px] text-muted-foreground text-center mt-1">
                          I want to buy products
                        </span>
                      </Label>
                    </div>

                    {/* Seller Card */}
                    <div>
                      <RadioGroupItem
                        value={Roles.SELLER}
                        id="role-seller"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="role-seller"
                        className="flex flex-col items-center justify-between rounded-xl border border-slate-300 hover:border-black bg-popover p-4 text-slate-500 hover:text-black cursor-pointer transition-all shadow-md gap-1 peer-data-[state=checked]:border-black peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-black/20 peer-data-[state=checked]:text-black"
                      >
                        <Store className="mb-2 h-6 w-6 text-muted-foreground peer-data-[state=checked]:text-primary" />
                        <span className="font-medium text-sm">Seller</span>
                        <span className="text-[10px] text-muted-foreground text-center mt-1">
                          I want to sell products
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </Field>
              )}
            </form.Field>
            {/* Password */}
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
                      autoComplete="off"
                      className="py-5 shadow-md"
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
                form="signup-form"
                type="submit"
                variant="outline"
                className="w-full py-5 cursor-pointer"
              >
                Sign Up
              </Button>
              <SocialAuth />
              <FieldDescription className="text-center">
                Already have an account? <Link href="/signin">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
