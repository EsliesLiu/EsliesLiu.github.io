import fs from 'node:fs';
import path from 'node:path';

// 库在仓库外面。构建机上看不到它，所以要先抄进 content/posts，再提交。
const vault = process.env.OBSIDIAN_VAULT ?? '/Users/siyanliu/Documents/Obsidian Vault';
const root = path.resolve(import.meta.dirname, '..');
const postsDir = path.join(root, 'content/posts');
const assetsDir = path.join(root, 'content/assets');
const manifestPath = path.join(root, 'content/.imported.json');

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.obsidian' || entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else found.push(full);
  }
  return found;
}

function splitFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---')) return { tags: [], body: normalized };
  const end = normalized.indexOf('\n---', 3);
  if (end === -1) return { tags: [], body: normalized };
  const raw = normalized.slice(3, end);
  const body = normalized.slice(end + 4).replace(/^\r?\n/, '');
  const tags = [];
  const inline = raw.match(/tags:\s*\[([^\]]*)\]/);
  if (inline) {
    for (const part of inline[1].split(',')) {
      const tag = part.trim().replace(/^['"]|['"]$/g, '');
      if (tag) tags.push(tag);
    }
  }
  return { tags, body };
}

function descriptionOf(body, title) {
  const chunks = [];
  for (const line of body.split('\n')) {
    let text = line.trim();
    if (!text) {
      if (chunks.length) break;
      continue;
    }
    if (/^(#|>|\||---|\*\*\*|```)/.test(text)) continue;
    if (/^https?:\/\//.test(text)) continue;
    if (text.startsWith('![')) continue;
    // 合集笔记第一段经常是 <details><summary>，标签本身不能当摘要。
    text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    chunks.push(text);
    if (chunks.join('').length > 100) break;
  }
  let text = chunks
    .join(' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) text = title;
  if (text.length > 90) text = `${text.slice(0, 88)}…`;
  return text;
}

function shanghaiDate(mtimeMs) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(mtimeMs));
}

function postHref(id) {
  return `/posts/${encodeURIComponent(id)}/`;
}

function yaml(value) {
  return JSON.stringify(value);
}

if (!fs.existsSync(vault)) {
  console.error(`找不到 Obsidian 库：${vault}`);
  process.exit(1);
}

fs.mkdirSync(postsDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const files = walk(vault);
const notes = files.filter((file) => file.endsWith('.md'));
const images = files.filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()));

const imageByBase = new Map();
for (const file of images) {
  const base = path.basename(file);
  const existing = imageByBase.get(base);
  if (!existing) {
    imageByBase.set(base, file);
    continue;
  }
  // 同名附件不能互相覆盖，带上父目录区分。
  imageByBase.set(`${path.basename(path.dirname(file))}-${base}`, file);
}

const copiedAssets = new Map();
for (const [key, file] of imageByBase) {
  const filename = path.basename(key);
  fs.copyFileSync(file, path.join(assetsDir, filename));
  copiedAssets.set(path.basename(file), `../assets/${filename}`);
  copiedAssets.set(key, `../assets/${filename}`);
}

const titles = new Map();
for (const file of notes) {
  const title = path.basename(file, '.md');
  titles.set(title, postHref(title));
}

const missingImages = [];

function isRemoteUrl(url) {
  const src = url.trim();
  return /^(https?:)?\/\//.test(src) || src.startsWith('data:');
}

function assetFor(url) {
  const src = url.trim().replace(/^<|>$/g, '').split(/\s+/)[0].split('?')[0];
  let base = path.basename(src);
  try {
    base = decodeURIComponent(base);
  } catch {
    // 文件名本身不是合法转义时，按原样查找。
  }
  return copiedAssets.get(base) ?? null;
}

function missingLabel(alt, url) {
  const file = path.basename(url.trim().split(/\s+/)[0].split('?')[0]);
  const name = alt.trim();
  return name && name !== file ? `（缺少本地图片：${name} / ${file}）` : `（缺少本地图片：${file}）`;
}

function rewriteSegment(segment, title) {
  let next = segment.replace(/!\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g, (full, target) => {
    const raw = target.trim();
    const asset = copiedAssets.get(path.basename(raw));
    if (asset) return `![](${asset})`;
    // 嵌入的是图片但库里没有文件。留着 ![[ ]] 没问题，写成 ![](路径) 会让构建失败。
    if (!IMAGE_EXT.has(path.extname(raw).toLowerCase())) return full;
    missingImages.push({ title, ref: raw });
    return missingLabel('', raw);
  });
  next = next.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, url) => {
    const src = url.trim().split(/\s+/)[0];
    if (isRemoteUrl(src)) return full;
    const asset = assetFor(src);
    if (asset) return `![${alt}](${asset})`;
    // Astro 会把本地图片当成构建资源，文件不存在就整站失败。改成纯文本，正文还在。
    missingImages.push({ title, ref: src });
    return missingLabel(alt, src);
  });
  next = next.replace(/<img\b[^>]*\bsrc\s*=\s*(["'])([^"']+)\1[^>]*>/gi, (full, _quote, src) => {
    if (isRemoteUrl(src) || src.includes('{')) return full;
    const asset = assetFor(src);
    if (asset) return full.replace(src, asset);
    const alt = full.match(/\balt\s*=\s*["']([^"']*)["']/i)?.[1] ?? '';
    missingImages.push({ title, ref: src });
    return missingLabel(alt, src);
  });
  next = next.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (full, target, alias) => {
    const name = path.basename(target.trim());
    const href = titles.get(name) ?? titles.get(target.trim());
    const label = (alias ?? name).trim();
    return href ? `[${label}](${href})` : label;
  });
  return next;
}

function rewriteBody(body, title) {
  // 代码块里的示例图片不是页面资源，不能改，也不能拿去参与构建。
  const parts = body.split(/(```[\s\S]*?```)/g);
  return parts.map((part, index) => (index % 2 === 1 ? part : rewriteSegment(part, title))).join('');
}

const previous = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : [];
const imported = [];

for (const file of notes) {
  const title = path.basename(file, '.md');
  const relative = path.relative(vault, file);
  const folder = relative.split(path.sep)[0];
  const raw = fs.readFileSync(file, 'utf8');
  const { tags: noteTags, body } = splitFrontmatter(raw);
  const tags = [...new Set([folder, ...noteTags])];
  const rewritten = rewriteBody(body, title).trim();
  const stat = fs.statSync(file);
  const frontmatter = [
    '---',
    `title: ${yaml(title)}`,
    `date: ${shanghaiDate(stat.mtimeMs)}`,
    `description: ${yaml(descriptionOf(rewritten, title))}`,
    'tags:',
    ...tags.map((tag) => `  - ${yaml(tag)}`),
    'draft: false',
    '---',
    '',
    rewritten,
    '',
  ].join('\n');
  const dest = path.join(postsDir, `${title}.md`);
  fs.writeFileSync(dest, frontmatter);
  imported.push(`${title}.md`);
}

for (const name of previous) {
  if (imported.includes(name)) continue;
  const stale = path.join(postsDir, name);
  if (fs.existsSync(stale)) fs.unlinkSync(stale);
}

fs.writeFileSync(manifestPath, `${JSON.stringify(imported, null, 2)}\n`);
console.log(`已导入 ${imported.length} 篇，附件 ${images.length} 个`);
console.log(`来源：${vault}`);
if (missingImages.length) {
  console.log(`库里没有、已改成文字占位的图片 ${missingImages.length} 处：`);
  for (const item of missingImages) console.log(`- ${item.title} -> ${item.ref}`);
}
