const ALLOWED_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "strong",
  "em",
  "s",
  "u",
  "mark",
  "br",
  "hr",
  "a",
]);

const DANGEROUS_TAGS =
  /<(script|style|iframe|object|embed|noscript|svg|math|form|input|button|textarea|select|link|meta|base|title|frameset|frame)\b[^>]*>[\s\S]*?<\/\1\s*>|<\s*\1\b[^>]*\/>/gi;

const TAG_PATTERN =
  /<([a-zA-Z][a-zA-Z0-9]*)((?:\s[a-zA-Z_:][a-zA-Z0-9:._-]*\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))*)\s*>|<\/([a-zA-Z][a-zA-Z0-9]*)\s*>/g;

function safeUrl(url: string): string {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return "";
  }
  return trimmed;
}

function sanitizeAttributes(tag: string, attrs: string): string {
  if (!attrs.trim()) return "";
  if (tag !== "a") return "";
  const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i.exec(
    attrs,
  );
  if (!hrefMatch) return "";
  const url = safeUrl(hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? "");
  if (!url) return "";
  const escaped = url.replace(/"/g, "&quot;");
  const target = /target\s*=\s*"?_blank"?/i.test(attrs)
    ? ' target="_blank"'
    : "";
  const rel = target ? ' rel="noopener noreferrer"' : "";
  return ` href="${escaped}"${target}${rel}`;
}

export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(DANGEROUS_TAGS, "")
    .replace(TAG_PATTERN, (match, openTag, attrs, closeTag) => {
      if (closeTag) {
        return ALLOWED_TAGS.has(closeTag.toLowerCase()) ? match : "";
      }
      const tag = openTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      const cleanAttrs = sanitizeAttributes(tag, attrs ?? "");
      return `<${openTag}${cleanAttrs}>`;
    });
}
