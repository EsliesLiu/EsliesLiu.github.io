import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articleHref, getPosts } from '../lib/content';
import { site } from '../site';

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error('astro.config 需要配置 site，RSS 和 sitemap 都依赖绝对地址');
  }

  const posts = await getPosts();
  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: articleHref('posts', post.id),
    })),
  });
}
