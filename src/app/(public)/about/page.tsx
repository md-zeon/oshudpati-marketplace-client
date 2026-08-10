import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  Baby,
  HeartPulse,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { PageSection } from "@/components/shared/PageSection";

const stats = [
  { value: "64", label: "Districts served" },
  { value: "100%", label: "Authentic products" },
  { value: "24–48h", label: "Dhaka delivery" },
  { value: "24/7", label: "Customer support" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT SIDE - BRAND MISSION & MARKETPLACE IDENTITY */}
          <PageSection className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                Bangladesh{"'"}s Trusted Healthcare Marketplace
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 lg:text-5xl">
                About Oshudpati
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Oshudpati is a specialized digital ecosystem dedicated to making
                authentic medicine and healthcare essentials safe, accessible,
                and transparent. We connect vetted pharmacies and certified
                sellers directly with households across Bangladesh, eliminating
                counterfeit vulnerabilities.
              </p>
            </div>

            {/* Dedicated Marketplace Pillars */}
            <div className="space-y-4">
              <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-5">
                <div className="flex items-center gap-2.5 font-semibold text-foreground">
                  <ShieldAlert className="h-5 w-5 text-brand-700" />
                  <h3>The Core Promise: 100% Authenticity</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Counterfeit and improperly stored medicines pose immediate
                  life risks. At Oshudpati, every partner pharmacy is rigorously
                  screened, ensuring all critical items—from life-saving
                  prescription drugs to daily over-the-counter wellness
                  essentials—are explicitly checked for provenance and batch
                  expiration.
                </p>
              </div>

              {/* Marketplace Segments Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="border-border-default bg-card/50">
                  <CardContent className="flex flex-col items-center space-y-2 p-4 text-center">
                    <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
                      <HeartPulse className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Medicines
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Prescriptions & chronic disease remedies.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border-default bg-card/50">
                  <CardContent className="flex flex-col items-center space-y-2 p-4 text-center">
                    <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
                      <Baby className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Baby Care
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Verified infant formula, diapers, & hygiene.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border-default bg-card/50">
                  <CardContent className="flex flex-col items-center space-y-2 p-4 text-center">
                    <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Wellness
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Personal care items & nutrition tracking.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Band */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-brand-100 bg-brand-50/40 p-4 text-center"
                >
                  <p className="text-2xl font-extrabold text-brand-800">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                Browse Medicines
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 outline-none transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </PageSection>

          {/* RIGHT SIDE - OPERATIONAL STANDARDS CARD */}
          <div className="space-y-6 lg:sticky lg:top-16">
            <Card className="overflow-hidden border-muted/60 shadow-sm">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div>
                  <h2 className="text-2xl font-bold text-brand-900">
                    Marketplace Ecosystem Standards
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    How we maintain professional integrity inside a
                    decentralized multi-vendor grid.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Licensed Pharmacy Network Only
                      </h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        We strictly do not allow unauthorized wholesale brokers.
                        Every merchant on Oshudpati must provide valid DGDA
                        (Directorate General of Drug Administration) credentials
                        and operational retail store evidence.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Strict Cold-Chain and Handling Integrity
                      </h4>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                        Insulins, vaccines, and highly sensitive biological
                        agents require specific temperature compliance profiles.
                        We enforce rigorous packing rules on vendor nodes to
                        prevent transit denaturing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Marketplace Operator</span>
                    <span className="font-medium text-foreground">
                      Oshudpati Technologies
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Compliance Framework</span>
                    <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                      DGDA Compliant System
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
