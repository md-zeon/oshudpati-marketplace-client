import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldAlert,
  Baby,
  HeartPulse,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE - BRAND MISSION & MARKETPLACE IDENTITY */}
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              Bangladesh&apos;s Trusted Healthcare Marketplace
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              About Oshudpati
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Oshudpati is a specialized digital ecosystem dedicated to making
              authentic medicine and healthcare essentials safe, accessible, and
              transparent. We connect vetted pharmacies and certified sellers
              directly with households across Bangladesh, eliminating
              counterfeit vulnerabilities.
            </p>
          </div>

          {/* Dedicated Marketplace Pillars */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl border bg-muted/30 space-y-3">
              <div className="flex items-center gap-2.5 text-foreground font-semibold">
                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                <h3>The Core Promise: 100% Authenticity</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Counterfeit and improperly stored medicines pose immediate life
                risks. At Oshudpati, every partner pharmacy is rigorously
                screened, ensuring all critical items—from life-saving
                prescription drugs to daily over-the-counter wellness
                essentials—are explicitly checked for provenance and batch
                expiration.
              </p>
            </div>

            {/* Marketplace Segments Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Medicines
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Prescriptions & chronic disease remedies.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Baby className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Baby Care
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Verified infant formula, diapers, & hygiene.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-5 h-5" />
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

          {/* Value Stat Banner */}
          <div className="p-5 border border-dashed rounded-xl bg-primary/5 flex items-start gap-3">
            <span className="text-xl">🇧🇩</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Serving Nationwide Healthcare Infrastructure
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                By bridging localized logistics with dynamic stock layers from
                licensed distribution hubs in Dhaka, we are lowering delivery
                windows for critical life-supporting healthcare formulas across
                all districts.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - OPERATIONAL STANDARDS CARD */}
        <div className="lg:sticky lg:top-16 space-y-6">
          <Card className="border-muted/60 shadow-sm overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Marketplace Ecosystem Standards
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  How we maintain professional integrity inside a decentralized
                  multi-vendor grid.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex gap-3">
                  <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Licensed Pharmacy Network Only
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      We strictly do not allow unauthorized wholesale brokers.
                      Every merchant on Oshudpati must provide valid DGDA
                      (Directorate General of Drug Administration) credentials
                      and operational retail store evidence.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Strict Cold-Chain and Handling Integrity
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Insulins, vaccines, and highly sensitive biological agents
                      require specific temperature compliance profiles. We
                      enforce rigorous packing rules on vendor nodes to prevent
                      transit denaturing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Marketplace Operator</span>
                  <span className="text-foreground font-medium">
                    Oshudpati Technologies
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Compliance Framework</span>
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
                    DGDA Compliant System
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
