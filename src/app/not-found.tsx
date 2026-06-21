import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

const NotFoundPage = async () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-[12rem] sm:text-[15rem] text-transparent bg-linear-to-r from-brand/20 via-brand to-brand/20 bg-clip-text">
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-brand/80 text-3xl sm:text-4xl font-semibold">
            That Page Cant Be Found
          </EmptyDescription>
          <p className="text-center text-muted-foreground mt-2">
            It looks like nothing was found at this location. <br /> Maybe try
            to search for what you are looking for?
          </p>
        </EmptyHeader>
        <EmptyContent>
          <Button
            asChild
            variant="outline"
            className="border-brand/80 text-brand/80 hover:bg-brand/10 hover:text-brand focus-visible:bg-brand/10 focus-visible:text-brand"
          >
            <Link href="/">
              <HomeIcon data-icon="inline-start" /> Go to Home
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NotFoundPage;
