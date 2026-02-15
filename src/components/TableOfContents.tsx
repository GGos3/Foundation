"use client";

import { useEffect, useMemo, useState } from "react";
import type { TocItem } from "@/lib/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  const ids = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    if (!ids.length) {
      return;
    }

    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (!headings.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-90px 0px -60% 0px",
        threshold: [0, 1],
      }
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => {
      observer.disconnect();
    };
  }, [ids]);

  if (!items.length) {
    return null;
  }

  return (
    <nav className="toc-sticky rounded-lg border border-zinc-200/90 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        Contents
      </p>
      <ol className="max-h-[calc(100vh-9rem)] space-y-1 overflow-auto pr-1">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className={item.level === 3 ? "ml-3" : "ml-0"}>
              <a
                href={`#${item.id}`}
                className={
                  isActive
                    ? "block rounded-md border-l-2 border-zinc-700 bg-zinc-100 px-2 py-1.5 text-sm font-medium text-zinc-900 dark:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100"
                    : "block rounded-md border-l-2 border-transparent px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
