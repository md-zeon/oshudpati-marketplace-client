import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactUsForm from "./_components/ContactUsForm";
import { PageSection } from "@/components/shared/PageSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE - INFO */}
        <PageSection className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question, suggestion, or just want to say hello? We{"'"}re
              here to help you and respond as quickly as possible.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-4">
            <Card className="transition-all duration-200 hover:border-muted-foreground/30 hover:-translate-y-0.5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="font-semibold text-foreground">
                    support@oshudpati.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:border-muted-foreground/30 hover:-translate-y-0.5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-semibold text-foreground">
                    +880 1521 721 040
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-200 hover:border-muted-foreground/30 hover:-translate-y-0.5">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Location
                  </p>
                  <p className="font-semibold text-foreground">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Context Note */}
          <div className="rounded-xl border bg-muted/40 p-5 text-sm text-muted-foreground flex gap-3 items-start">
            <span className="text-base">💡</span>
            <p>
              <strong className="text-foreground font-medium">Pro-tip:</strong>{" "}
              For the fastest resolution, please include all relevant order
              details or account IDs in your message.
            </p>
          </div>
        </PageSection>

        {/* RIGHT SIDE - FORM */}
        <PageSection delay={0.15} className="lg:sticky lg:top-16">
          <ContactUsForm />
        </PageSection>
      </div>
    </div>
  );
}
