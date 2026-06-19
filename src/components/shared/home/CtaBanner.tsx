import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 p-8 text-white text-center">
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 animate-pulse-soft" />
      <div
        className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 animate-pulse-soft"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="relative z-10 max-w-lg mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Ready to Get Started?
        </h2>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Join thousands of satisfied customers across Bangladesh. Shop
          authentic medicines from the comfort of your home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg active:scale-[0.98]"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
