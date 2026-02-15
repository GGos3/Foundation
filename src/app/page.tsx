import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <section className="mb-10">
        <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
          notes
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Foundation
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          필요한 내용만 짧게 정리해 둡니다.
        </p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">{posts.length} posts</p>
      </section>
      <section>
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="py-12 text-center text-sm text-zinc-500">
            아직 작성된 포스트가 없습니다.
          </p>
        )}
      </section>
    </main>
  );
}
