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
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-[15rem] text-transparent bg-linear-to-r from-foreground/20 via-foreground to-foreground/20 bg-clip-text">
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80 text-4xl font-semibold">
            That Page Cant Be Found
          </EmptyDescription>
          <p>
            It looks like nothing was found at this location. <br /> Maybe try
            to search for what you are looking for?
          </p>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline">
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
