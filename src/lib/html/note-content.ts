import sanitizeHtml from "sanitize-html";

export function isSafeColorValue(v: string): boolean {
  const s = v.trim();
  if (!s || s.length > 120) return false;
  if (/^#[0-9a-fA-F]{3,8}$/i.test(s)) return true;
  if (/^rgba?\(\s*[\d.%\s,]+\)$/i.test(s)) return true;
  if (s.toLowerCase() === "transparent") return true;
  return false;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "div",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "del",
    "ul",
    "ol",
    "li",
    "span",
    "font",
  ],
  allowedAttributes: {
    span: ["style"],
    p: ["style"],
    div: ["style"],
    font: ["color"],
  },
  allowedStyles: {
    "*": {
      color: [
        /^#[0-9a-fA-F]{3,8}$/i,
        /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
        /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/,
      ],
      "background-color": [
        /^#[0-9a-fA-F]{3,8}$/i,
        /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
        /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/,
        /^transparent$/i,
      ],
    },
  },
  transformTags: {
    font: (_tag, attribs) => {
      const raw = String(attribs.color ?? "").trim();
      if (isSafeColorValue(raw)) {
        return { tagName: "span", attribs: { style: `color: ${raw}` } };
      }
      return { tagName: "span", attribs: {} };
    },
  },
  allowedSchemes: [],
  allowProtocolRelative: false,
};

export function sanitizeNoteHtml(raw: string): string {
  try {
    return sanitizeHtml(raw, SANITIZE_OPTIONS).trim();
  } catch {
    return "";
  }
}

/** Heuristic: stored rich HTML vs legacy plain text. */
export function looksLikeStoredHtml(content: string): boolean {
  const t = content.trim();
  if (!t) return false;
  return /^<[a-z]/i.test(t);
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Wrap legacy plain note content as safe HTML paragraphs. */
export function legacyPlainContentToHtml(content: string): string {
  const t = content.replace(/\r\n/g, "\n");
  if (!t.trim()) return "";
  const blocks = t.split(/\n{2,}/);
  const parts = blocks.map((block) => {
    const inner = escapeHtmlText(block).replace(/\n/g, "<br />");
    return `<p>${inner}</p>`;
  });
  return parts.join("");
}

/** Prepare HTML for the rich text editor (sanitized, never scripts). */
export function prepareEditorInitialHtml(rawFromDb: string): string {
  const raw = rawFromDb ?? "";
  if (!raw.trim()) return "<p><br></p>";
  if (looksLikeStoredHtml(raw)) {
    const s = sanitizeNoteHtml(raw);
    return s.trim() ? s : "<p><br></p>";
  }
  const built = legacyPlainContentToHtml(raw);
  const s = sanitizeNoteHtml(built);
  return s.trim() ? s : "<p><br></p>";
}

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u00a0/g, " ");
}

/** Plain text for previews, search, and empty detection. */
export function stripHtmlToText(html: string): string {
  if (!html) return "";
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n");
  const stripped = withBreaks.replace(/<[^>]+>/g, "");
  return decodeBasicEntities(stripped).replace(/\u00a0/g, " ");
}

export function isEmptyNoteContent(html: string): boolean {
  const sanitized = sanitizeNoteHtml(html);
  const text = stripHtmlToText(sanitized).replace(/\s+/g, " ").trim();
  if (text.length > 0) return false;
  return true;
}

export function noteContentSearchText(htmlOrPlain: string): string {
  const t = stripHtmlToText(htmlOrPlain).toLowerCase();
  return t.replace(/\s+/g, " ").trim();
}
