"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeCopyButtonProps {
  code: string;
}

export function CodeCopyButton({ code }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyWithExecCommand = (value: string): boolean => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copiedByFallback = document.execCommand("copy");
    document.body.removeChild(textarea);

    return copiedByFallback;
  };

  const handleCopy = async () => {
    if (!code) {
      return;
    }

    let success = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(code);
        success = true;
      } catch {
        success = copyWithExecCommand(code);
      }
    } else {
      success = copyWithExecCommand(code);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 bg-white/80 text-zinc-500 opacity-0 backdrop-blur-sm transition-all hover:text-zinc-900 focus-visible:opacity-100 group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:text-zinc-100"
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
