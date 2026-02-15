import Link from "next/link";

interface TagProps {
  name: string;
  count?: number;
}

export function Tag({ name, count }: TagProps) {
  const href = `/tags/${encodeURIComponent(name)}`;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
    >
      {name}
      {count !== undefined && (
        <span className="text-zinc-400 dark:text-zinc-500">
          {count}
        </span>
      )}
    </Link>
  );
}
