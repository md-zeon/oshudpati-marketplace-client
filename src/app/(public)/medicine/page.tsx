import ShopPage from "../shop/page";
import { SearchParams } from "@/types";

interface ShopPageProps {
  searchParams: Promise<SearchParams>;
}

const MedicinePage = ({ searchParams }: ShopPageProps) => {
  return <ShopPage searchParams={searchParams} />;
};

export default MedicinePage;
