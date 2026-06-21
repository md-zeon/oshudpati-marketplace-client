import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/components/shared/PageSection";
import {
  Shield,
  Scale,
  FileText,
  AlertTriangle,
  Ban,
  Mail,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <PageSection className="space-y-4">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase">
            Legal Agreement
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: June 21, 2026</p>
          <p className="text-muted-foreground leading-relaxed">
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully
            before using the Oshudpati marketplace platform. By accessing or
            using our platform, you agree to be bound by these Terms.
          </p>
        </PageSection>

        {/* 1. Acceptance */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  By accessing or using Oshudpati (&ldquo;the Platform&rdquo;),
                  you agree to comply with and be bound by these Terms. If you
                  do not agree with any part of these Terms, you must not use
                  the Platform. These Terms apply to all visitors, users,
                  buyers, sellers, and vendors of the Platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Platform Description */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  2. Platform Description
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Oshudpati is an online marketplace that connects buyers with
                  licensed pharmacies and certified healthcare product sellers
                  in Bangladesh. The Platform facilitates the discovery,
                  ordering, and delivery of medicines, healthcare products, baby
                  care items, and wellness essentials. Oshudpati acts as an
                  intermediary and does not own, manufacture, or store the
                  products listed by vendors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Eligibility */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Scale className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  3. Eligibility & Account Registration
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  To use the Platform, you must be at least 18 years of age or
                  have the consent of a legal guardian. You agree to provide
                  accurate, current, and complete information during the
                  registration process and to update such information as
                  necessary. You are responsible for maintaining the
                  confidentiality of your account credentials and for all
                  activities that occur under your account.
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    You must not create multiple accounts for abusive purposes.
                  </li>
                  <li>
                    You must not share your account credentials with third
                    parties.
                  </li>
                  <li>
                    You must notify us immediately of any unauthorized account
                    access.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts for
                    violations.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Vendor Terms */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  4. Vendor & Seller Terms
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Vendors and sellers listing products on Oshudpati must hold
                  valid licenses issued by the Directorate General of Drug
                  Administration (DGDA) of Bangladesh or other relevant
                  regulatory authorities. By listing products, vendors agree to:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    Ensure all products are authentic, properly stored, and
                    within expiration dates.
                  </li>
                  <li>
                    Comply with all applicable Bangladesh laws and regulations.
                  </li>
                  <li>Maintain accurate inventory and pricing information.</li>
                  <li>
                    Fulfill orders in a timely manner as per Platform
                    guidelines.
                  </li>
                  <li>
                    Handle customer returns and refunds in accordance with
                    Platform policies.
                  </li>
                  <li>
                    Not list counterfeit, expired, or prohibited products.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Oshudpati reserves the right to verify vendor credentials and
                  delist any vendor found to be in violation of these Terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Orders & Payments */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  5. Orders, Payments & Delivery
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  When you place an order on Oshudpati, you agree to pay the
                  listed price including any applicable taxes and delivery fees.
                  Payment may be processed through third-party payment gateways
                  as made available on the Platform.
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    Orders are subject to availability and vendor acceptance.
                  </li>
                  <li>Prices may change at any time without prior notice.</li>
                  <li>Delivery times are estimates and not guaranteed.</li>
                  <li>
                    Risk of loss passes to you upon delivery of the product.
                  </li>
                  <li>
                    Returns and refunds are governed by our Refund Policy.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6. Prohibited Activities */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Ban className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  6. Prohibited Activities
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  You agree not to engage in any of the following prohibited
                  activities:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    Using the Platform for any unlawful purpose or in violation
                    of any applicable law.
                  </li>
                  <li>
                    Attempting to interfere with the proper functioning of the
                    Platform.
                  </li>
                  <li>
                    Uploading malicious code or content that could harm the
                    Platform or its users.
                  </li>
                  <li>
                    Engaging in price manipulation, bid rigging, or other
                    fraudulent practices.
                  </li>
                  <li>Impersonating another person or entity.</li>
                  <li>Collecting user data without authorization.</li>
                  <li>
                    Reselling or misusing Platform services for unauthorized
                    commercial purposes.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. Limitation of Liability */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  7. Limitation of Liability
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  To the maximum extent permitted by applicable law, Oshudpati
                  and its affiliates, officers, directors, employees, and agents
                  shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising out of or related
                  to your use of the Platform. Oshudpati&rsquo;s total liability
                  for any claims arising under these Terms shall not exceed the
                  amount paid by you to Oshudpati in the twelve (12) months
                  preceding the claim.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8. Governing Law */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Scale className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  8. Governing Law & Disputes
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  These Terms shall be governed by and construed in accordance
                  with the laws of the People&rsquo;s Republic of Bangladesh.
                  Any disputes arising out of or relating to these Terms or the
                  use of the Platform shall be subject to the exclusive
                  jurisdiction of the courts located in Dhaka, Bangladesh.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9. Changes to Terms */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  9. Changes to These Terms
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify users of material changes by updating the
                  &ldquo;Last updated&rdquo; date at the top of these Terms and
                  by providing notice through the Platform or via email. Your
                  continued use of the Platform after such modifications
                  constitutes your acceptance of the revised Terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 10. Contact */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  10. Contact Information
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="mt-4 p-4 rounded-lg bg-muted/30 border text-sm space-y-1">
                  <p className="font-medium text-foreground">
                    Oshudpati Marketplace
                  </p>
                  <p className="text-muted-foreground">
                    Email: zeon.cse@gmail.com
                  </p>
                  <p className="text-muted-foreground">
                    Location: Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
