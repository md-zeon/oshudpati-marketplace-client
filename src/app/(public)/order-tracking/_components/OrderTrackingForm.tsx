"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderTrackingForm() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) return;

    router.push(`/order-tracking?orderNumber=${orderNumber.trim()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-xl gap-2">
      <Input
        placeholder="Enter order number (ORD-XXXXXXXX)"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
      />

      <Button type="submit">
        <Search />
        Track
      </Button>
    </form>
  );
}
