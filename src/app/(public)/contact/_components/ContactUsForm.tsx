"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

const ContactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
});

export default function ContactUsForm(
  props: React.ComponentProps<typeof Card>,
) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validators: {
      onSubmit: ContactSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Sending your message...");

      try {
        // Replace with your actual backend endpoint API call
        await new Promise((res) => setTimeout(res, 1200));

        console.log("Contact form submitted data:", value);

        toast.success("Message sent successfully!", {
          id: toastId,
        });

        form.reset();
      } catch {
        toast.error("Something went wrong. Please try again later.", {
          id: toastId,
        });
      }
    },
  });

  return (
    <Card {...props} className="w-full border-muted/60 shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <form
          id="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup className="space-y-5">
            {/* Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">
                      Name <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-required="true"
                      className="h-11 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-brand-600"
                    />
                    {isInvalid && (
                      <FieldError
                        className="text-xs font-medium text-destructive animate-in fade-in-50"
                        errors={field.state.meta.errors}
                      />
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
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">
                      Email Address <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      aria-required="true"
                      className="h-11 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-brand-600"
                    />
                    {isInvalid && (
                      <FieldError
                        className="text-xs font-medium text-destructive animate-in fade-in-50"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Subject */}
            <form.Field name="subject">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">
                      Subject <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="How can we help you?"
                      aria-required="true"
                      className="h-11 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-brand-600"
                    />
                    {isInvalid && (
                      <FieldError
                        className="text-xs font-medium text-destructive animate-in fade-in-50"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Message */}
            <form.Field name="message">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-medium">
                      Message <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Please details your request or question here..."
                      aria-required="true"
                      className="min-h-[140px] resize-y rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-brand-600"
                    />
                    <div className="flex items-center justify-between">
                      {isInvalid ? (
                        <FieldError
                          className="text-xs font-medium text-destructive animate-in fade-in-50"
                          errors={field.state.meta.errors}
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Min. 10 characters
                        </span>
                      )}
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {field.state.value.length}/1000
                      </span>
                    </div>
                  </Field>
                );
              }}
            </form.Field>

            {/* Submit Button Component */}
            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => (
                <Field className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full rounded-lg bg-brand-700 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                  <FieldDescription className="text-center text-xs text-muted-foreground">
                    We typically respond within 24 business hours.
                  </FieldDescription>
                </Field>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
