import { SignInForm } from "./_components/SignInForm";

// /signin?redirect=/checkout
const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) => {
  const params = await searchParams;
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <SignInForm redirect={params?.redirect} />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
