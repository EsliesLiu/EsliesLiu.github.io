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
    const text = line.trim();
    if (!text) {
      if (chunks.length) break;
      continue;
    }
    if (/^(#|>|\||---|\*\*\*|```)/.test(text)) continue;
    if (/^https?:\/\//.test(text)) continue;
    if (text.startsWith('![')) continue;
    chunks.push(text);
    if (chunks.join('').length > 100) break;
  }
  let text = chunks
    .join(' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
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

function rewriteBody(body) {
  let next = body.replace(/!\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]/g, (full, target) => {
    const base = path.basename(target.trim());
    const asset = copiedAssets.get(base);
    return asset ? `![](${asset})` : full;
  });
  next = next.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, url) => {
    const clean = url.trim();
    if (/^https?:\/\//.test(clean)) return full;
    const asset = copiedAssets.get(path.basename(clean));
    return asset ? `![${alt}](${asset})` : full;
  });
  next = next.replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (full, target, alias) => {
    const name = path.basename(target.trim());
    const href = titles.get(name) ?? titles.get(target.trim());
    const label = (alias ?? name).trim();
    return href ? `[${label}](${href})` : label;
  });
  return next;
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
  const rewritten = rewriteBody(body).trim();
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
