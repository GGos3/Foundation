import { getAllTags, getPostsByTag } from "@/lib/posts";
import { Tag } from "@/components/Tag";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "모든 태그를 모아봅니다.",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tags
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          태그별로 포스트를 모아봅니다.
        </p>
      </section>
      <section>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => {
            const count = getPostsByTag(tag).length;
            return <Tag key={tag} name={tag} count={count} />;
          })}
        </div>
        {tags.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">
            아직 태그가 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
