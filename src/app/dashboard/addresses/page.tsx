import { redirect } from "next/navigation";
import { userService } from "@/services/user.service";
import { Address } from "@/types";
import { AddressManager } from "./_components/AddressManager";
import { AddressService } from "@/services/address.service";

export const metadata = {
  title: "My Addresses",
  description: "Manage your delivery addresses",
};

const AddressesPage = async () => {
  const [sessionPromise, addressesPromise] = await Promise.all([
    userService.getSession(),
    AddressService.getAddresses(),
  ]);

  const session = await sessionPromise;
  if (!session?.success || !session.data?.user) {
    return redirect("/signin");
  }

  const addressesRes = await addressesPromise;
  const addresses: Address[] = addressesRes?.data || [];

  return (
    <div className="max-w-5xl mx-auto">
      <AddressManager initialAddresses={addresses} />
    </div>
  );
};

export default AddressesPage;
