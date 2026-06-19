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
  message: z.string().min(10, "Message must be at least 10 characters"),
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
                      Name
                    </FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
                      className="h-11 transition-all focus-visible:ring-1"
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
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="you@company.com"
                      className="h-11 transition-all focus-visible:ring-1"
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
                      Subject
                    </FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="How can we help you?"
                      className="h-11 transition-all focus-visible:ring-1"
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
                      Message
                    </FieldLabel>
                    <Textarea
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Please details your request or question here..."
                      className="min-h-35 resize-y transition-all focus-visible:ring-1"
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

            {/* Submit Button Component */}
            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => (
                <Field className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 text-sm font-medium transition-colors"
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
