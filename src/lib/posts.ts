import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { Post, PostMeta, TocItem } from "./types";

const contentDir = path.join(process.cwd(), "src/content");

function getMdxFiles(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  const files = getMdxFiles();

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      description: data.description ?? "",
      tags: data.tags ?? [],
      readingTimeMinutes: calculateReadingTime(content),
    } satisfies PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    readingTimeMinutes: calculateReadingTime(content),
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getTableOfContents(content: string): TocItem[] {
  const lines = content.split("\n");
  const result: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) {
      continue;
    }

    const [, hashes, text] = match;
    const cleanText = text.trim();

    result.push({
      id: slugifyHeading(cleanText),
      text: cleanText,
      level: hashes.length as 2 | 3,
    });
  }

  return result;
}

function calculateReadingTime(content: string): number {
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, " ");
  const withoutMdxTags = withoutCodeBlocks.replace(/<[^>]+>/g, " ");
  const plainText = withoutMdxTags.replace(/[#>*_`~\-\[\]()]/g, " ");

  const koreanChars = (plainText.match(/[가-힣]/g) ?? []).length;
  const latinWords = plainText
    .replace(/[가-힣]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const totalWordLikeUnits = latinWords + koreanChars / 2;
  const wordsPerMinute = 220;

  return Math.max(1, Math.ceil(totalWordLikeUnits / wordsPerMinute));
}

function slugifyHeading(text: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(text);
}
