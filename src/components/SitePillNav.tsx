/**
 * 顶栏右侧导航。PillNav 自带一套深浅色，这里跟 html[data-theme] 对齐，
 * 高亮用站点的强调色，避免和页面配色各说各话。
 */
import { useEffect, useState } from 'react';
import PillNav, { type PillNavItem } from './PillNav/PillNav';

const items: PillNavItem[] = [
  { label: '文章', href: '/posts/' },
  { label: '随笔', href: '/essays/' },
  { label: '关于', href: '/about/' },
];

// 顶栏跨路由保留后，服务端传进来的 activeHref 还是上一页的。当前项按地址自己算。
function activeFromPath(pathname: string) {
  return items.find((item) => item.href && (pathname === item.href || pathname.startsWith(item.href)))?.href ?? '';
}

export interface SitePillNavProps {
  /** 传空字符串表示首页，没有一项算当前页。 */
  activeHref?: string;
}

export default function SitePillNav({ activeHref = '' }: SitePillNavProps) {
  // 首屏和 SSR 都按黑夜，和站点默认主题一致，避免水合对不上。
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [current, setCurrent] = useState(activeHref);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
    const syncPath = () => setCurrent(activeFromPath(window.location.pathname));
    syncTheme();
    syncPath();
    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    // 组件实例留在页面上，换页不会重新跑 effect，要靠这个事件改高亮。
    document.addEventListener('astro:page-load', syncPath);
    return () => {
      observer.disconnect();
      document.removeEventListener('astro:page-load', syncPath);
    };
  }, []);

  return (
    <PillNav
      className="pill-nav"
      items={items}
      activeHref={current}
      theme={theme}
      intro={false}
      layout="joined"
      size="sm"
      ariaLabel="主导航"
      highlightColor="var(--color-accent)"
      highlightTextColor="var(--color-bg)"
    />
  );
}
