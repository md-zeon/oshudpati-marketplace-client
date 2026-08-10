import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageSquareHeart,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import ContactUsForm from "./_components/ContactUsForm";
import { PageSection } from "@/components/shared/PageSection";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with the Oshudpati support team",
};

const contactItems = [
  {
    label: "Email",
    value: "support@oshudpati.com",
    href: "mailto:support@oshudpati.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+880 1521 721 040",
    href: "tel:+8801521721040",
    icon: Phone,
  },
  {
    label: "Location",
    value: "Dhaka, Bangladesh",
    href: undefined,
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT SIDE - INFO */}
          <PageSection className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                We{"'"}re here to help
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 lg:text-5xl">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question, suggestion, or just want to say hello? We
                respond as quickly as possible — usually within 24 hours.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <div className="rounded-lg bg-brand-50 p-2.5 text-brand-700">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="break-words font-semibold text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </>
                );
                const className =
                  "flex items-center gap-4 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-600";
                return item.href ? (
                  <Card key={item.label} className="border-muted/60">
                    <CardContent className={className}>
                      <a
                        href={item.href}
                        className="flex w-full items-center gap-4 outline-none"
                      >
                        {inner}
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={item.label} className="border-muted/60">
                    <CardContent className={className}>{inner}</CardContent>
                  </Card>
                );
              })}

              {/* Support hours */}
              <Card className="border-muted/60">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="rounded-lg bg-brand-50 p-2.5 text-brand-700">
                    <Clock className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Support Hours
                    </p>
                    <p className="font-semibold text-foreground">
                      Sat–Thu, 9:00 AM – 9:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Context Note */}
            <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-5 text-sm text-muted-foreground">
              <MessageSquareHeart className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <p>
                <strong className="font-medium text-foreground">Pro-tip:</strong>{" "}
                For the fastest resolution, please include all relevant order
                details or account IDs in your message. You can also check the{" "}
                <Link
                  href="/faq"
                  className="font-medium text-brand-700 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  FAQ page
                </Link>{" "}
                — your question may already be answered.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <ArrowRight className="h-4 w-4" aria-hidden />
              Prefer email? Write to{" "}
              <a
                href="mailto:support@oshudpati.com"
                className="underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                support@oshudpati.com
              </a>
            </div>
          </PageSection>

          {/* RIGHT SIDE - FORM */}
          <PageSection delay={0.15} className="lg:sticky lg:top-16">
            <ContactUsForm />
          </PageSection>
        </div>
      </div>
    </div>
  );
}
