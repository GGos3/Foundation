"use client";

import { useMemo, useSyncExternalStore } from "react";

interface PostHelpfulButtonProps {
  slug: string;
}

export function PostHelpfulButton({ slug }: PostHelpfulButtonProps) {
  const likedKey = useMemo(() => `foundation:helpful:${slug}:liked`, [slug]);
  const countKey = useMemo(() => `foundation:helpful:${slug}:count`, [slug]);
  const eventKey = useMemo(() => `foundation:helpful:${slug}:changed`, [slug]);

  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const snapshot = useSyncExternalStore(
    (callback) => subscribeToStorage(callback, eventKey),
    () => readSnapshotString(likedKey, countKey),
    () => "0|0"
  );

  if (!mounted) {
    return <div className="mt-10 h-[90px]" aria-hidden />;
  }

  const { liked, count } = parseSnapshot(snapshot);

  const toggleLike = () => {
    const nextLiked = !liked;
    const nextCount = Math.max(0, count + (nextLiked ? 1 : -1));

    localStorage.setItem(likedKey, nextLiked ? "1" : "0");
    localStorage.setItem(countKey, String(nextCount));
    window.dispatchEvent(new Event(eventKey));
  };

  return (
    <div className="mt-10 rounded-lg border border-zinc-200/80 px-4 py-4 dark:border-zinc-800/80">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        이 글이 도움이 되었나요?
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={toggleLike}
          className={
            liked
              ? "rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors dark:bg-emerald-500/10 dark:text-emerald-300"
              : "rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600"
          }
          aria-pressed={liked}
        >
          {liked ? "도움이 되었어요" : "도움이 됐어요"}
        </button>
        <span className="text-sm text-zinc-500 dark:text-zinc-500">{count}</span>
      </div>
    </div>
  );
}

function subscribeNoop() {
  return () => {};
}

function subscribeToStorage(callback: () => void, eventKey: string) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(eventKey, handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(eventKey, handler);
  };
}

function readSnapshotString(likedKey: string, countKey: string) {
  const likedRaw = localStorage.getItem(likedKey) === "1" ? "1" : "0";
  const countRaw = localStorage.getItem(countKey) ?? "0";

  return `${likedRaw}|${countRaw}`;
}

function parseSnapshot(snapshot: string) {
  const [likedRaw, countRaw] = snapshot.split("|");
  const liked = likedRaw === "1";
  const count = Number.parseInt(countRaw ?? "0", 10) || 0;

  return { liked, count };
}
