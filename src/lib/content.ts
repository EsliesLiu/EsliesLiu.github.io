import fs from 'node:fs';
import path from 'node:path';
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

// 首页「最近更新」看文件修改时间。frontmatter 的 date 是写入日期，同一天会停在原来的顺序上。
const RECENT_LIMIT = 4;

function updatedMs(entry: ArticleEntry) {
  const written = entry.data.date.valueOf();
  if (!entry.filePath) return written;
  try {
    return fs.statSync(path.resolve(entry.filePath)).mtimeMs;
  } catch {
    return written;
  }
}

export async function getRecent(limit = RECENT_LIMIT) {
  const [posts, essays] = await Promise.all([getCollection('posts'), getCollection('essays')]);
  const entries = [
    ...posts.map((entry) => ({ entry, kind: 'posts' as const })),
    ...essays.map((entry) => ({ entry, kind: 'essays' as const })),
  ];
  return entries
    .filter(({ entry }) => isPublished(entry))
    .sort((a, b) => {
      const delta = updatedMs(b.entry) - updatedMs(a.entry);
      if (delta !== 0) return delta;
      return byDateDesc(a.entry, b.entry);
    })
    .slice(0, limit)
    .map(({ entry, kind }) => ({
      ...toCard(kind, entry),
      // 卡片上的时间和排序用同一套修改时间，避免日期看着是乱的。
      date: new Date(updatedMs(entry)),
    }));
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

// 文章按 Obsidian 顶层目录分组。列表已按时间倒序，目录第一次出现的位置就是它最新的一篇。
export function groupByFirstTag(items: ArticleCard[]) {
  const groups = new Map<string, ArticleCard[]>();
  for (const item of items) {
    const name = item.tags[0] ?? '未分类';
    const list = groups.get(name) ?? [];
    list.push(item);
    groups.set(name, list);
  }
  return [...groups.entries()];
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
