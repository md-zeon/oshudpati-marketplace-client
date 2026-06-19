import Link from "next/link";
import { ArrowRight, ShoppingBag, UserPlus } from "lucide-react";

export function CtaBannerSection() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Subtle abstract background accent for texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00875A_1px,transparent_1px)] bg-size-[16px_16px] pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />

        {/* Left Content Area: Elegant Typography Focus */}
        <div className="relative z-10 max-w-xl text-center md:text-left space-y-3">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
            Join Oshudpati
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Your Healthcare Essentials, <br className="hidden lg:inline" />
            Delivered Responsibly.
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Join thousands of satisfied customers across Bangladesh. Experience
            authentic medicines, transparent pricing, and fast doorstep
            delivery.
          </p>
        </div>

        {/* Right Content Area: Action Controls */}
        <div>
          <div className="relative z-10 flex flex-col max-sm:justify-center sm:flex-row items-center gap-3 w-full md:w-auto sm:shrink-0">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] group"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-2xl border border-gray-200 shadow-xs transition-all duration-200 active:scale-[0.98]"
            >
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
