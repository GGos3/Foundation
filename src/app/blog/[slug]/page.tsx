import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getTableOfContents } from "@/lib/posts";
import { MdxContent } from "@/components/MdxContent";
import { TableOfContents } from "@/components/TableOfContents";
import { PostHelpfulButton } from "@/components/PostHelpfulButton";
import { GiscusComments } from "@/components/GiscusComments";
import { Tag } from "@/components/Tag";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const allPosts = getAllPosts();

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const toc = getTableOfContents(post.content);

  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const previousPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
        <article className="min-w-0 lg:max-w-3xl">
        <header className="mb-10 border-b border-zinc-200/80 pb-8 dark:border-zinc-800/80">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {post.description}
            </p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
            <time
              dateTime={post.date}
            >
              {formattedDate}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingTimeMinutes} min read</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          )}
        </header>

        {toc.length > 0 && <div className="mb-8 lg:hidden"><TableOfContents items={toc} /></div>}

        <MdxContent source={post.content} />

        <PostHelpfulButton slug={post.slug} />

        <GiscusComments />

        {(previousPost || nextPost) && (
          <nav className="mt-12 grid gap-3 border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80 sm:grid-cols-2">
            {previousPost ? (
              <Link
                href={`/blog/${previousPost.slug}`}
                className="rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
              >
                <p className="text-xs text-zinc-500 dark:text-zinc-400">이전 글</p>
                <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {previousPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="rounded-lg border border-zinc-200 px-4 py-3 text-left transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600 sm:text-right"
              >
                <p className="text-xs text-zinc-500 dark:text-zinc-400">다음 글</p>
                <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {nextPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}
        </article>

        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <TableOfContents items={toc} />
          </aside>
        )}
      </div>
    </main>
  );
}
