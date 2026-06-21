import { Card, CardContent } from "@/components/ui/card";
import { PageSection } from "@/components/shared/PageSection";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Share2,
  Mail,
  UserCheck,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <PageSection className="space-y-4">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase">
            Data Protection & Privacy
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: June 21, 2026</p>
          <p className="text-muted-foreground leading-relaxed">
            At Oshudpati, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our marketplace platform. Please read this
            policy carefully.
          </p>
        </PageSection>

        {/* 1. Information We Collect */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  1. Information We Collect
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We may collect the following types of information when you use
                  our Platform:
                </p>
                <div className="mt-4 space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <h3 className="text-sm font-semibold text-foreground">
                      Personal Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Name, email address, phone number, shipping address, and
                      account credentials provided during registration or
                      checkout.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <h3 className="text-sm font-semibold text-foreground">
                      Health & Prescription Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Prescription details, medicine names, dosage information,
                      and health-related data necessary for order fulfillment.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <h3 className="text-sm font-semibold text-foreground">
                      Payment Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Payment card details and billing information. Please note
                      that payment processing is handled by third-party payment
                      gateways, and we do not store full payment card numbers on
                      our servers.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border">
                    <h3 className="text-sm font-semibold text-foreground">
                      Usage & Device Information
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      IP address, browser type, device information, operating
                      system, pages visited, and interactions with the Platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. How We Use Your Information */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  2. How We Use Your Information
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    To process and fulfill your orders, including prescription
                    verification.
                  </li>
                  <li>
                    To communicate with you about your orders, account, and
                    customer support requests.
                  </li>
                  <li>
                    To improve and personalize your experience on the Platform.
                  </li>
                  <li>
                    To detect, prevent, and address fraud, security, and
                    technical issues.
                  </li>
                  <li>
                    To comply with legal obligations and regulatory requirements
                    in Bangladesh.
                  </li>
                  <li>
                    To send you promotional communications (with your consent,
                    where required by law).
                  </li>
                  <li>
                    To facilitate authentication via third-party services like X
                    (Twitter) OAuth when you choose to use them.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Information Sharing */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Share2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  3. Information Sharing & Disclosure
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We may share your information with the following parties:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    <strong>Vendors & Sellers:</strong> To fulfill orders, we
                    share necessary information (name, address, contact details,
                    prescription info) with the vendor fulfilling your order.
                  </li>
                  <li>
                    <strong>Payment Processors:</strong> To process payments
                    securely through third-party payment gateways.
                  </li>
                  <li>
                    <strong>Delivery Partners:</strong> To facilitate shipping
                    and delivery of your orders.
                  </li>
                  <li>
                    <strong>X (Twitter) OAuth:</strong> If you choose to
                    authenticate via X, certain profile information (such as
                    your name and email, if permitted) will be shared with us by
                    X in accordance with their privacy policy.
                  </li>
                  <li>
                    <strong>Legal Authorities:</strong> When required by law or
                    to protect our legal rights.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  We do not sell your personal information to third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Data Security */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  4. Data Security
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. These measures
                  include encryption, secure socket layer (SSL) technology,
                  regular security audits, and access controls.
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  However, no method of transmission over the Internet or
                  electronic storage is 100% secure. We cannot guarantee
                  absolute security but strive to protect your data to the best
                  of our ability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5. Data Retention */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  5. Data Retention
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We retain your personal information for as long as your
                  account is active or as needed to provide you with our
                  services. We may also retain and use your information to
                  comply with legal obligations, resolve disputes, and enforce
                  our agreements. When data is no longer required, we securely
                  delete or anonymize it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 6. Your Rights */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <UserCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  6. Your Rights
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Depending on your jurisdiction, you may have the following
                  rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-3">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal data
                    we hold about you.
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate or incomplete data.
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal
                    data, subject to legal obligations.
                  </li>
                  <li>
                    <strong>Portability:</strong> Request a copy of your data in
                    a structured, machine-readable format.
                  </li>
                  <li>
                    <strong>Objection:</strong> Object to the processing of your
                    personal data for certain purposes.
                  </li>
                  <li>
                    <strong>Withdrawal of Consent:</strong> Withdraw consent at
                    any time where processing is based on consent.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  To exercise any of these rights, please contact us using the
                  information provided below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7. Cookies & Tracking */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Cookie className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  7. Cookies & Tracking Technologies
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance
                  your experience, analyze usage patterns, and provide
                  personalized content. You can control cookie preferences
                  through your browser settings. Disabling certain cookies may
                  affect the functionality of the Platform.
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  We may also use analytics services (such as Google Analytics)
                  to understand how users interact with the Platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8. Third-Party Services */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Share2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  8. Third-Party Services
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Our Platform may contain links to third-party websites and
                  services, including X (Twitter) for authentication purposes.
                  We are not responsible for the privacy practices of these
                  third parties. We encourage you to review their privacy
                  policies before providing any personal information.
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  When you use X OAuth to sign in to Oshudpati, X will share
                  certain information with us as permitted by your privacy
                  settings on X. This information is used solely for
                  authentication and account creation purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9. Children's Privacy */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  9. Children&rsquo;s Privacy
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Our Platform is not intended for individuals under the age of
                  18. We do not knowingly collect personal information from
                  children. If we become aware that a child has provided us with
                  personal information, we will take steps to delete such
                  information promptly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 10. Changes to Policy */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by updating the &ldquo;Last
                  updated&rdquo; date at the top of this policy and by providing
                  notice through the Platform or via email. Your continued use
                  of the Platform after such modifications constitutes your
                  acceptance of the revised policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 11. Contact */}
        <Card className="border-muted/60 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  11. Contact Information
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy or our data practices, please contact us
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
