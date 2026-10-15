import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 笔记放在 src 外面，Obsidian 只打开 content，不扫框架目录。
// 文件名原样当 id。默认 slug 会改掉空格和大小写，库里的 [[双链]] 会对不上。
function noteId({ entry }: { entry: string }) {
  return entry.replace(/\.(md|mdx)$/i, '');
}
const article = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

const profile = defineCollection({
  loader: glob({ pattern: 'about.md', base: './content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = {
  posts: defineCollection({
    loader: glob({
      pattern: '**/*.{md,mdx}',
      base: './content/posts',
      generateId: noteId,
    }),
    schema: article,
  }),
  essays: defineCollection({
    loader: glob({
      pattern: '**/*.{md,mdx}',
      base: './content/essays',
      generateId: noteId,
    }),
    schema: article,
  }),
  profile,
};
