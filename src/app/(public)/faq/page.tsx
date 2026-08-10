import { HelpCircle } from "lucide-react";
import { PageSection } from "@/components/shared/PageSection";
import { FaqContent, type FaqCategory } from "./_components/FaqContent";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Oshudpati Marketplace",
};

const faqs: FaqCategory[] = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our medicine catalog, add items to your cart, proceed to checkout, enter your shipping address, and confirm your order. You'll receive an order confirmation with a tracking number.",
      },
      {
        q: "How long does delivery take?",
        a: "Delivery typically takes 24-48 hours within Dhaka city and 3-5 business days for other districts across Bangladesh.",
      },
      {
        q: "What are the delivery charges?",
        a: "Delivery is free for orders above ৳300. For orders below ৳300, a flat delivery fee of ৳60 applies.",
      },
      {
        q: "Can I track my order?",
        a: "Yes! You can track your order using the order number on our Order Tracking page. You'll also receive status updates as your order progresses.",
      },
    ],
  },
  {
    category: "Medicines & Products",
    items: [
      {
        q: "Are all medicines authentic?",
        a: "Absolutely. We partner only with licensed pharmacies and certified sellers. All medicines are sourced from authorized distributors and come with proper documentation.",
      },
      {
        q: "Do I need a prescription to buy medicine?",
        a: "Over-the-counter (OTC) medicines can be purchased without a prescription. However, certain prescription-only medicines may require a valid prescription from a registered doctor.",
      },
      {
        q: "Can I return or exchange a medicine?",
        a: "Due to health regulations, we cannot accept returns or exchanges on medicines once they have been delivered. If you receive a damaged or incorrect product, please contact our support team within 24 hours.",
      },
      {
        q: "How are medicines stored during delivery?",
        a: "Our partner pharmacies follow strict storage guidelines. Temperature-sensitive medicines are packaged with cold chain protection to maintain their efficacy during transit.",
      },
    ],
  },
  {
    category: "Account & Payments",
    items: [
      {
        q: "How do I create an account?",
        a: "Click on 'Sign Up' and fill in your name, email, and password. You can also register as a customer or seller. Verify your email to start using your account.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept Cash on Delivery (COD) for all orders. Online payment options including bKash, Nagad, and mobile banking are coming soon.",
      },
      {
        q: "How do I reset my password?",
        a: "Click on 'Forgot Password' on the sign-in page. Enter your registered email, and we'll send you a password reset link.",
      },
    ],
  },
  {
    category: "Selling on Oshudpati",
    items: [
      {
        q: "How do I become a seller?",
        a: "Register as a seller during signup, then create your shop from the seller dashboard. You'll need to provide your pharmacy credentials for verification.",
      },
      {
        q: "What are the seller fees?",
        a: "We charge a competitive commission on each sale. There are no monthly subscription fees. Contact our seller support for detailed commission rates.",
      },
      {
        q: "How do I manage my medicines as a seller?",
        a: "From your seller dashboard, you can add, edit, and manage your medicine listings. You can also track orders, update their status, and view sales analytics.",
      },
    ],
  },
  {
    category: "Support & Safety",
    items: [
      {
        q: "How do I contact customer support?",
        a: "You can reach us via email at support@oshudpati.com or through our Contact page. We typically respond within 24 hours.",
      },
      {
        q: "Is my personal information secure?",
        a: "Yes, we use encryption and follow industry best practices to protect your personal and payment information. We never share your data with third parties.",
      },
      {
        q: "What should I do if I receive a damaged product?",
        a: "Take photos of the damaged product and packaging, then contact our support team within 24 hours of delivery. We'll arrange a replacement or refund.",
      },
    ],
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-12">
        <PageSection className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
            <HelpCircle className="h-7 w-7 text-brand-700" aria-hidden />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              Help Centre
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-900 lg:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              Quick answers to the questions we hear most — about orders,
              delivery, payments, and selling on Oshudpati. Can&apos;t find
              what you need? Reach out and we&apos;ll help personally.
            </p>
          </div>
        </PageSection>

        <PageSection delay={0.05}>
          <FaqContent faqs={faqs} />
        </PageSection>
      </div>
    </div>
  );
};

export default FaqPage;
