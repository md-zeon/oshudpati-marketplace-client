import AuthCallbackContent from "./_components/AuthCallbackContent";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return <AuthCallbackContent redirect={redirect ?? "/"} />;
}
