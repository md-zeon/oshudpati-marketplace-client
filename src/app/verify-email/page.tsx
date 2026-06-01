import VerifyEmailContent from "./_components/VerifyEmailContent";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; email?: string }>;
}) {
  const { redirect, email } = await searchParams;

  return <VerifyEmailContent redirect={redirect ?? "/"} email={email} />;
}
