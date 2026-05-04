"use client";

import { isSafeColorValue, sanitizeNoteHtml } from "@/lib/html/note-content";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  defaultHtml: string;
  /** Hidden field name for form submission */
  name?: string;
}

function syncToHidden(editor: HTMLDivElement, hidden: HTMLInputElement | null) {
  if (!hidden) return;
  hidden.value = editor.innerHTML;
}

function ToolbarBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:text-sm"
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ defaultHtml, name = "content" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [textColor, setTextColor] = useState("#18181b");
  const [hiliteColor, setHiliteColor] = useState("#fef08a");

  const sync = useCallback(() => {
    const ed = editorRef.current;
    if (ed) syncToHidden(ed, hiddenRef.current);
  }, []);

  const stashSelection = useCallback(() => {
    const ed = editorRef.current;
    const sel = window.getSelection();
    if (!ed || !sel || sel.rangeCount === 0) {
      savedRangeRef.current = null;
      return;
    }
    const r = sel.getRangeAt(0);
    if (ed.contains(r.commonAncestorContainer)) {
      savedRangeRef.current = r.cloneRange();
    } else {
      savedRangeRef.current = null;
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const ed = editorRef.current;
    const r = savedRangeRef.current;
    if (!ed || !r) return;
    const sel = window.getSelection();
    if (!sel) return;
    try {
      sel.removeAllRanges();
      sel.addRange(r);
    } catch {
      savedRangeRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    el.innerHTML = defaultHtml;
    syncToHidden(el, hiddenRef.current);
  }, [defaultHtml]);

  useEffect(() => {
    const form = editorRef.current?.closest("form");
    if (!form) return;
    const beforeSubmit = () => sync();
    form.addEventListener("submit", beforeSubmit);
    return () => form.removeEventListener("submit", beforeSubmit);
  }, [sync]);

  const focusAndRun = useCallback(
    (command: string, value?: string, opts?: { restore?: boolean }) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      if (opts?.restore) {
        restoreSelection();
      }
      try {
        if (command === "hiliteColor" || command === "foreColor") {
          try {
            document.execCommand("styleWithCSS", false, "true");
          } catch {
            /* ignore */
          }
        }
        document.execCommand(command, false, value);
      } catch {
        /* invalid command / color in some browsers */
      }
      sync();
    },
    [restoreSelection, sync],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const html = e.clipboardData.getData("text/html");
      const plain = e.clipboardData.getData("text/plain");
      try {
        if (html) {
          const clean = sanitizeNoteHtml(html);
          if (clean) {
            document.execCommand("insertHTML", false, clean);
          } else if (plain) {
            document.execCommand("insertText", false, plain);
          }
        } else if (plain) {
          document.execCommand("insertText", false, plain);
        }
      } catch {
        if (plain) {
          try {
            document.execCommand("insertText", false, plain);
          } catch {
            /* ignore */
          }
        }
      }
      sync();
    },
    [sync],
  );

  return (
    <div className="space-y-2">
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultHtml} />
      <div
        className="flex flex-wrap gap-1 rounded-t-md border border-b-0 border-zinc-300 bg-zinc-50 p-2 dark:border-zinc-600 dark:bg-zinc-900 sm:gap-2"
        role="toolbar"
        aria-label="Opmaak"
      >
        <ToolbarBtn label="Vet" onClick={() => focusAndRun("bold")} />
        <ToolbarBtn label="Cursief" onClick={() => focusAndRun("italic")} />
        <ToolbarBtn label="Onderstrepen" onClick={() => focusAndRun("underline")} />
        <ToolbarBtn label="Doorstrepen" onClick={() => focusAndRun("strikeThrough")} />
        <ToolbarBtn label="Opsommingstekens" onClick={() => focusAndRun("insertUnorderedList")} />
        <ToolbarBtn label="Nummering" onClick={() => focusAndRun("insertOrderedList")} />
        <label className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="sr-only sm:not-sr-only sm:inline">Markering</span>
          <span onPointerDown={stashSelection}>
            <input
              type="color"
              value={hiliteColor}
              onChange={(ev) => {
                const v = ev.target.value;
                setHiliteColor(v);
                if (!isSafeColorValue(v)) return;
                focusAndRun("hiliteColor", v, { restore: true });
              }}
              aria-label="Markeringkleur"
              className="h-8 w-10 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
            />
          </span>
        </label>
        <label className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="sr-only sm:not-sr-only sm:inline">Tekst</span>
          <span onPointerDown={stashSelection}>
            <input
              type="color"
              value={textColor}
              onChange={(ev) => {
                const v = ev.target.value;
                setTextColor(v);
                if (!isSafeColorValue(v)) return;
                focusAndRun("foreColor", v, { restore: true });
              }}
              aria-label="Tekstkleur"
              className="h-8 w-10 cursor-pointer rounded border border-zinc-300 bg-white p-0.5 dark:border-zinc-600"
            />
          </span>
        </label>
      </div>
      <div
        ref={editorRef}
        id="content"
        role="textbox"
        aria-multiline="true"
        aria-label="Notitie-inhoud"
        contentEditable
        suppressHydrationWarning
        onInput={sync}
        onBlur={sync}
        onPaste={onPaste}
        className="min-h-[12rem] max-h-[min(70vh,40rem)] w-full max-w-full overflow-y-auto overflow-x-hidden break-words rounded-b-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500 [&_li]:my-0.5 [&_li]:list-item [&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:pl-1 [&_p]:my-1 [&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:pl-1 [&_*]:break-words"
      />
    </div>
  );
}
