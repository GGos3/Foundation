import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import { Tag } from "./Tag";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group py-5">
      <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
        <time dateTime={post.date}>{formattedDate}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTimeMinutes} min read</span>
      </div>
      <h2 className="mt-1.5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {post.title}
        </Link>
      </h2>
      {post.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
