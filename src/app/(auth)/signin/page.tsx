import { SignInForm } from "./_components/SignInForm";

const SignInPage = () => {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
