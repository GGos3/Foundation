import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `#${decodedTag}`,
    description: `"${decodedTag}" 태그가 포함된 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          <span className="text-zinc-400 dark:text-zinc-500">#</span>
          {decodedTag}
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {posts.length}개의 포스트
        </p>
      </section>
      <section>
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}
