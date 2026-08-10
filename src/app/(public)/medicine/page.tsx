import ShopPage from "../shop/page";
import { SearchParams } from "@/types";

export const metadata = {
  title: "Search Medicines",
  description:
    "Search medicines by name, generic name, or condition across Oshudpati Marketplace.",
};

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

const MedicinePage = ({ searchParams }: ShopPageProps) => {
  return <ShopPage searchParams={searchParams} />;
};

export default MedicinePage;
