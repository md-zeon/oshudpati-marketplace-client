import EmailVerifiedContent from "./_components/EmailVerifiedContent";

export default async function EmailVerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <EmailVerifiedContent redirect={redirect ?? "/"} />;
}
