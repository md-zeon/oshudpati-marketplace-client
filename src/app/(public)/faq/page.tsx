import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about Oshudpati Marketplace",
};

const faqs = [
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
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-emerald-50">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-slate-500">
            Everything you need to know about Oshudpati Marketplace
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              {section.category}
            </h2>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100"
            >
              {section.items.map((faq, i) => (
                <AccordionItem key={i} value={`${section.category}-${i}`}>
                  <AccordionTrigger className="px-5 py-4 text-sm font-semibold text-slate-800 hover:text-emerald-700 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
