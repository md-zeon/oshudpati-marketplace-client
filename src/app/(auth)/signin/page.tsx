import { SignInForm } from "./_components/SignInForm";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) => {
  const params = await searchParams;
  return (
    <div className="flex min-h-9/12 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md animate-fade-in-up">
        <SignInForm redirect={params?.redirect} />
      </div>
    </div>
  );
};

export default SignInPage;
