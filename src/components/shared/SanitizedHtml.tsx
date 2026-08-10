import { cn } from "@/lib/utils";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

const RICH_TEXT_CLASSES = [
  "[&_p]:my-2",
  "[&_h1]:my-3 [&_h1]:text-2xl [&_h1]:font-bold",
  "[&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-bold",
  "[&_h3]:my-3 [&_h3]:text-lg [&_h3]:font-semibold",
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:my-1",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-brand-200 [&_blockquote]:pl-3 [&_blockquote]:italic",
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:text-sm",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_a]:font-medium [&_a]:text-trust-600 [&_a]:underline [&_a]:hover:text-trust-700",
  "[&_mark]:bg-accent-100",
].join(" ");

export function SanitizedHtml({
  html,
  className,
}: {
  html?: string | null;
  className?: string;
}) {
  const safe = sanitizeRichHtml(html);
  if (!safe.trim()) return null;
  return (
    <div
      className={cn(RICH_TEXT_CLASSES, className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
