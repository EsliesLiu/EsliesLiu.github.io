import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleKind = 'posts' | 'essays';
export type ArticleEntry = CollectionEntry<'posts'> | CollectionEntry<'essays'>;

export type ArticleCard = {
  id: string;
  kind: ArticleKind;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  draft: boolean;
};

// Actions 在 UTC 上构建。只写 YYYY-MM-DD 时按上海日历显示，避免跨日。
const dateFormat = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Shanghai',
});

export function formatDate(date: Date) {
  return dateFormat.format(date);
}

export function isPublished(entry: { data: { draft?: boolean } }) {
  // 本地开发要能看见草稿；线上构建丢掉，不靠人记得不要提交。
  return import.meta.env.DEV || entry.data.draft !== true;
}

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T) {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts.filter(isPublished).sort(byDateDesc);
}

export async function getEssays() {
  const essays = await getCollection('essays');
  return essays.filter(isPublished).sort(byDateDesc);
}

export function toCard(kind: ArticleKind, entry: ArticleEntry): ArticleCard {
  return {
    id: entry.id,
    kind,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    tags: entry.data.tags,
    draft: entry.data.draft === true,
  };
}

export function articleHref(kind: ArticleKind, id: string) {
  // 文件名可以是中文。按段编码，保留目录斜杠。
  const path = id
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `/${kind}/${path}/`;
}

export function readingMinutes(body: string | undefined) {
  if (!body) return 1;
  // 代码块和链接不计入。中文约 400 字/分钟，英文约 220 词/分钟。
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ');
  const cjk = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const words = text
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}
