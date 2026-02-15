"use client";

import Giscus from "@giscus/react";
import { useSyncExternalStore } from "react";

function subscribeNoop() {
  return () => {};
}

const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function GiscusComments() {
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  if (!mounted) {
    return <div className="h-24" aria-hidden />;
  }

  if (!repo || !repoId || !category || !categoryId) {
    return null;
  }

  if (!isRepoFormat(repo)) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80">
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}

function isRepoFormat(value: string): value is `${string}/${string}` {
  return /^[^/]+\/[^/]+$/.test(value);
}
