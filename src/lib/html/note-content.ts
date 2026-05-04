import sanitizeHtml from "sanitize-html";
import { htmlHasChecklistItems } from "@/lib/html/note-checklist";
import { NOTE_CHECKLIST } from "@/types/legacy-note-checklist-html";

export function isSafeColorValue(v: string): boolean {
  const s = v.trim();
  if (!s || s.length > 120) return false;
  if (/^#[0-9a-fA-F]{3,8}$/i.test(s)) return true;
  if (/^rgba?\(\s*[\d.%\s,]+\)$/i.test(s)) return true;
  if (s.toLowerCase() === "transparent") return true;
  return false;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  /* Legacy embedded checklist tags in older note HTML (subset). */
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
    "input",
  ],
  allowedAttributes: {
    span: ["style", "class"],
    p: ["style"],
    div: ["style"],
    font: ["color"],
    ul: ["class", "data-note-checklist"],
    ol: ["class"],
    li: ["class", "data-checked"],
    input: ["type", "class", "checked", "contenteditable"],
  },
  exclusiveFilter(frame: { tag: string; attribs: Record<string, string> }) {
    if (frame.tag !== "input") {
      return false;
    }
    const type = String(frame.attribs.type ?? "").toLowerCase();
    if (type !== "checkbox") {
      return true;
    }
    const cls = String(frame.attribs.class ?? "");
    const classes = cls.split(/\s+/).filter(Boolean);
    if (!classes.includes(NOTE_CHECKLIST.inputClass)) {
      return true;
    }
    return false;
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
    input: (_tag, attribs) => {
      const type = String(attribs.type ?? "").toLowerCase();
      const cls = String(attribs.class ?? "");
      const classes = cls.split(/\s+/).filter(Boolean);
      if (type !== "checkbox" || !classes.includes(NOTE_CHECKLIST.inputClass)) {
        return { tagName: "span", attribs: {} };
      }
      const next: Record<string, string> = {
        type: "checkbox",
        class: NOTE_CHECKLIST.inputClass,
        contenteditable: "false",
      };
      const c = attribs.checked;
      const truthy =
        c === "" ||
        c === "checked" ||
        String(c ?? "").toLowerCase() === "true" ||
        String(c ?? "").toLowerCase() === "on";
      if (truthy) {
        next.checked = "checked";
      }
      return { tagName: "input", attribs: next };
    },
    font: (_tag, attribs) => {
      const raw = String(attribs.color ?? "").trim();
      if (isSafeColorValue(raw)) {
        return { tagName: "span", attribs: { style: `color: ${raw}` } };
      }
      return { tagName: "span", attribs: {} as Record<string, string> };
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

/** Heuristic: stored rich HTML vs legacy plain text (avoids false positives e.g. "<pilot"). */
export function looksLikeStoredHtml(content: string): boolean {
  const t = content.trim();
  if (!t) return false;
  return /^<\s*(p|div|br|span|strong|b|em|i|u|s|strike|del|ul|ol|li|font)\b/i.test(t);
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
  if (htmlHasChecklistItems(sanitized)) return false;
  return true;
}

/** True when the note should show a body (plain text or checklist rows, including empty rows). */
export function noteContentHasDisplayableBody(rawHtml: string): boolean {
  const safe = sanitizeNoteHtml(rawHtml);
  if (htmlHasChecklistItems(safe)) return true;
  return stripHtmlToText(safe).replace(/\s+/g, " ").trim().length > 0;
}

export function noteContentSearchText(htmlOrPlain: string): string {
  const t = stripHtmlToText(htmlOrPlain).toLowerCase();
  return t.replace(/\s+/g, " ").trim();
}
