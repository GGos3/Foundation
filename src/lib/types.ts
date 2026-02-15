export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTimeMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}
