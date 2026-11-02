/**
 * 高项案例背诵。结构跟原页面一致：侧栏章节、学习、测验、统计。
 * 题库单独拆包，密码不对就不请求，页面源码里也不放明文。
 */
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import './practice.css';

type Status = 'unlearned' | 'mastered' | 'review';
type Mode = 'study' | 'quiz' | 'stats';

interface PracticeQA {
  number: number;
  question: string;
  question_display: string;
  question_short: string;
  answer_text: string;
  mnemonic: string | null;
  is_important: boolean;
  is_2025: boolean;
}

interface PracticeChapter {
  id: number;
  title: string;
  qas: PracticeQA[];
}

interface PracticeData {
  total_chapters: number;
  total_qas: number;
  chapters: PracticeChapter[];
}

interface FlatQA extends PracticeQA {
  chId: number;
  chTitle: string;
}

interface QuizState {
  items: FlatQA[];
  index: number;
  mastered: number;
  review: number;
}

const PROGRESS_KEY = 'practice_progress';
const SESSION_KEY = 'practice_unlock';
/** 口令的 SHA-256。源码里只留摘要，对不上就不会去拉题库。 */
const PASS_DIGEST = 'e6b1481390ce1021a071af8be8fbb5f3dcbe2748a5fbd28cbf6252295f979633';

function statusKey(chId: number, num: number) {
  return `${chId}_${num}`;
}

function loadProgress(): Record<string, Status> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const next: Record<string, Status> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === 'mastered' || value === 'review' || value === 'unlearned') next[key] = value;
    }
    return next;
  } catch {
    return {};
  }
}

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function loadExam(): Promise<PracticeData> {
  const mod = await import('../../data/practice/exam-data.json');
  return mod.default as PracticeData;
}

function shuffle<T>(list: T[]) {
  const next = list.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function filterQAs(data: PracticeData, chapterId: number, query: string): FlatQA[] {
  const chapters = chapterId === -1 ? data.chapters : data.chapters.filter((ch) => ch.id === chapterId);
  const q = query.trim().toLowerCase();
  const rows: FlatQA[] = [];
  for (const ch of chapters) {
    for (const qa of ch.qas) {
      if (
        q &&
        !qa.question_display.toLowerCase().includes(q) &&
        !qa.answer_text.toLowerCase().includes(q)
      ) {
        continue;
      }
      rows.push({ ...qa, chId: ch.id, chTitle: ch.title });
    }
  }
  return rows;
}

function splitRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\[\[IMG:[^\]]+\]\])/g);
  return parts.map((part, index) => {
    const matched = part.match(/^\[\[IMG:([^\]]+)\]\]$/);
    if (!matched) return <span key={index}>{part}</span>;
    // 只认导出的配图文件名，避免答案文本被拼成任意地址。
    if (!/^image\d+\.png$/.test(matched[1])) return <span key={index} />;
    return <img key={index} src={`/practice/images/${matched[1]}`} alt="知识点配图" loading="lazy" />;
  });
}

function AnswerBody({ text }: { text: string }) {
  const lines = text.split('\n');
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      nodes.push(
        <table key={`t-${nodes.length}`}>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) =>
                  ri === 0 ? <th key={ci}>{inline(cell)}</th> : <td key={ci}>{inline(cell)}</td>,
                )}
              </tr>
            ))}
          </tbody>
        </table>,
      );
    } else {
      const line = lines[i];
      nodes.push(
        <div className="qa-line" key={`l-${nodes.length}`}>
          {line.trim() ? inline(line) : '\u00a0'}
        </div>,
      );
      i += 1;
    }
  }
  return <>{nodes}</>;
}

function PasswordGate({ onUnlock }: { onUnlock: (data: PracticeData) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    setError('');
    try {
      const digest = await sha256(password.trim());
      if (digest !== PASS_DIGEST) {
        setError('密码不对');
        return;
      }
      const exam = await loadExam();
      try {
        sessionStorage.setItem(SESSION_KEY, PASS_DIGEST);
      } catch {
        /* 记不住就下次再输，不影响这次进入 */
      }
      onUnlock(exam);
    } catch {
      setError('题库没有打开，刷新后再试');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="practice-app">
      <div className="practice-gate">
        <form onSubmit={onSubmit}>
          <h1>练习</h1>
          <p>高项案例背诵。密码正确后才加载考点。</p>
          <label htmlFor="practice-password">密码</label>
          <input
            id="practice-password"
            type="password"
            autoComplete="off"
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="gate-error">{error}</p> : null}
          <button type="submit" disabled={checking || password.trim() === ''}>
            {checking ? '正在核对…' : '进入'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function PracticeApp() {
  const [data, setData] = useState<PracticeData | null>(null);
  const [mode, setMode] = useState<Mode>('study');
  const [chapterId, setChapterId] = useState(-1);
  const [query, setQuery] = useState('');
  const [progress, setProgress] = useState<Record<string, Status>>(loadProgress);
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [answerShown, setAnswerShown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      if (sessionStorage.getItem(SESSION_KEY) !== PASS_DIGEST) return;
    } catch {
      return;
    }
    loadExam()
      .then((exam) => {
        if (!cancelled) setData(exam);
      })
      .catch(() => {
        /* 这次没加载到就留在密码页，让人再进一次 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const qas = useMemo(
    () => (data ? filterQAs(data, chapterId, query) : []),
    [data, chapterId, query],
  );

  useEffect(() => {
    if (mode !== 'quiz' || quiz || !data) return;
    setQuiz({
      items: shuffle(filterQAs(data, chapterId, query)),
      index: 0,
      mastered: 0,
      review: 0,
    });
  }, [mode, quiz, data, chapterId, query]);

  function getStatus(chId: number, num: number): Status {
    return progress[statusKey(chId, num)] ?? 'unlearned';
  }

  function updateStatus(chId: number, num: number, status: Status) {
    setProgress((prev) => {
      const next = { ...prev, [statusKey(chId, num)]: status };
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* 写不进就只留在这次会话的内存里 */
      }
      return next;
    });
  }

  function selectChapter(id: number) {
    setChapterId(id);
    setQuiz(null);
    setAnswerShown(false);
    setSidebarOpen(false);
  }

  function switchMode(next: Mode) {
    setMode(next);
    if (next !== 'quiz') setAnswerShown(false);
  }

  if (!data) return <PasswordGate onUnlock={setData} />;

  const totals = countProgress(data, progress);
  const current = data.chapters.find((ch) => ch.id === chapterId);
  const headerText = chapterId === -1 ? '全部章节' : (current?.title ?? '');

  return (
    <div className="practice-app">
      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="sidebar-header">
          <h1>信息系统项目管理师</h1>
          <p>高项案例背诵考点</p>
        </div>
        <div className="progress-overview">
          <div className="progress-text">
            总进度：<strong>{totals.mastered}</strong> / <strong>{totals.total}</strong>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: totals.total ? `${(totals.mastered / totals.total) * 100}%` : '0%' }}
            />
          </div>
          <div className="progress-text" style={{ marginTop: 6 }}>
            已背熟 <span className="mem">{totals.mastered}</span> · 需复习{' '}
            <span className="rev">{totals.review}</span>
          </div>
        </div>
        <div className="chapter-list">
          <button
            type="button"
            className={chapterId === -1 ? 'chapter-item active' : 'chapter-item'}
            onClick={() => selectChapter(-1)}
          >
            <span className="chapter-num">∑</span>
            <span className="chapter-info">
              <span className="chapter-title">全部章节</span>
            </span>
            <span className="chapter-count">
              {totals.mastered}/{totals.total}
            </span>
          </button>
          {data.chapters.map((ch) => {
            const mem = ch.qas.filter((qa) => getStatus(ch.id, qa.number) === 'mastered').length;
            const pct = ch.qas.length ? Math.round((mem / ch.qas.length) * 100) : 0;
            return (
              <button
                type="button"
                key={ch.id}
                className={chapterId === ch.id ? 'chapter-item active' : 'chapter-item'}
                onClick={() => selectChapter(ch.id)}
              >
                <span className="chapter-num">{ch.id}</span>
                <span className="chapter-info">
                  <span className="chapter-title">{ch.title}</span>
                  <span className="chapter-progress">
                    {mem}/{ch.qas.length} · {pct}%
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="sidebar-footer">进度只存在这台浏览器里。</div>
      </aside>
      <button
        type="button"
        className={sidebarOpen ? 'mobile-overlay show' : 'mobile-overlay'}
        aria-label="关闭章节"
        onClick={() => setSidebarOpen(false)}
      />
      <div className="main">
        <div className="topbar">
          <button type="button" className="menu-toggle" onClick={() => setSidebarOpen((v) => !v)}>
            ☰
          </button>
          <div className="search-box">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="搜索考点关键词…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="mode-tabs" role="tablist" aria-label="练习模式">
            {(
              [
                ['study', '📚 学习'],
                ['quiz', '🧪 测验'],
                ['stats', '📊 统计'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={mode === id ? 'mode-tab active' : 'mode-tab'}
                onClick={() => switchMode(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="content">
          {mode === 'study' && (
            <StudyView
              title={headerText}
              qas={qas}
              open={open}
              getStatus={getStatus}
              onToggle={(key) =>
                setOpen((prev) => {
                  const next = new Set(prev);
                  if (next.has(key)) next.delete(key);
                  else next.add(key);
                  return next;
                })
              }
              onStatus={updateStatus}
            />
          )}
          {mode === 'quiz' && (
            <QuizView
              title={headerText}
              quiz={quiz}
              answerShown={answerShown}
              onShow={() => setAnswerShown(true)}
              onAnswer={(ok) => {
                if (!quiz) return;
                const qa = quiz.items[quiz.index];
                if (!qa) return;
                updateStatus(qa.chId, qa.number, ok ? 'mastered' : 'review');
                setAnswerShown(false);
                setQuiz({
                  ...quiz,
                  index: quiz.index + 1,
                  mastered: quiz.mastered + (ok ? 1 : 0),
                  review: quiz.review + (ok ? 0 : 1),
                });
              }}
              onRestart={() => {
                setAnswerShown(false);
                setQuiz(null);
              }}
            />
          )}
          {mode === 'stats' && data && (
            <StatsView
              data={data}
              progress={progress}
              onSelect={(id) => {
                selectChapter(id);
                setMode('study');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function countProgress(data: PracticeData, progress: Record<string, Status>) {
  let total = 0;
  let mastered = 0;
  let review = 0;
  for (const ch of data.chapters) {
    for (const qa of ch.qas) {
      total += 1;
      const status = progress[statusKey(ch.id, qa.number)];
      if (status === 'mastered') mastered += 1;
      else if (status === 'review') review += 1;
    }
  }
  return { total, mastered, review, unlearned: total - mastered - review };
}

function StudyView({
  title,
  qas,
  open,
  getStatus,
  onToggle,
  onStatus,
}: {
  title: string;
  qas: FlatQA[];
  open: Set<string>;
  getStatus: (chId: number, num: number) => Status;
  onToggle: (key: string) => void;
  onStatus: (chId: number, num: number, status: Status) => void;
}) {
  return (
    <>
      <div className="content-header">
        <h2>{title}</h2>
        <p>{qas.length ? `共 ${qas.length} 个考点 · 点击「显示答案」逐条背诵` : '共 0 个考点'}</p>
      </div>
      {qas.length === 0 ? (
        <div className="empty">没有匹配的考点，换个关键词试试</div>
      ) : (
        <div className="qa-list">
          {qas.map((qa) => {
            const key = statusKey(qa.chId, qa.number);
            const status = getStatus(qa.chId, qa.number);
            const shown = open.has(key);
            return (
              <article className="qa-card" key={key}>
                <div className="qa-header">
                  <span className="qa-number">{qa.number}</span>
                  <span className="qa-question">{qa.question_display}</span>
                </div>
                <div className="qa-tags">
                  <span className="qa-tag tag-chapter">{qa.chTitle}</span>
                  {status === 'mastered' && <span className="qa-tag tag-mastered">✓ 已背熟</span>}
                  {status === 'review' && <span className="qa-tag tag-review">↻ 需复习</span>}
                </div>
                {shown && (
                  <div className="qa-answer">
                    <AnswerBody text={qa.answer_text} />
                  </div>
                )}
                <div className="qa-actions">
                  <button type="button" className="qa-btn btn-show" onClick={() => onToggle(key)}>
                    {shown ? '隐藏答案' : '显示答案'}
                  </button>
                  <button
                    type="button"
                    className={status === 'unlearned' ? 'qa-btn btn-unlearned active' : 'qa-btn btn-unlearned'}
                    onClick={() => onStatus(qa.chId, qa.number, 'unlearned')}
                  >
                    ○ 未学
                  </button>
                  <button
                    type="button"
                    className={status === 'mastered' ? 'qa-btn btn-mastered active' : 'qa-btn btn-mastered'}
                    onClick={() => onStatus(qa.chId, qa.number, 'mastered')}
                  >
                    ✓ 已背熟
                  </button>
                  <button
                    type="button"
                    className={status === 'review' ? 'qa-btn btn-review active' : 'qa-btn btn-review'}
                    onClick={() => onStatus(qa.chId, qa.number, 'review')}
                  >
                    ↻ 需复习
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function QuizView({
  title,
  quiz,
  answerShown,
  onShow,
  onAnswer,
  onRestart,
}: {
  title: string;
  quiz: QuizState | null;
  answerShown: boolean;
  onShow: () => void;
  onAnswer: (ok: boolean) => void;
  onRestart: () => void;
}) {
  if (!quiz) {
    return (
      <div className="content-header">
        <h2>测验模式</h2>
        <p>正在抽题…</p>
      </div>
    );
  }
  if (!quiz.items.length) {
    return (
      <div className="content-header">
        <h2>测验模式</h2>
        <p>没有可用的考点</p>
      </div>
    );
  }
  if (quiz.index >= quiz.items.length) {
    const pct = Math.round((quiz.mastered / quiz.items.length) * 100);
    return (
      <div className="quiz-container">
        <div className="quiz-result">
          <h3>测验完成！</h3>
          <div className="score">{pct}%</div>
          <div className="detail">
            已背熟 {quiz.mastered} / {quiz.items.length} · 需复习 {quiz.review}
          </div>
          <div className="quiz-actions">
            <button type="button" className="quiz-btn primary" onClick={onRestart}>
              再来一轮
            </button>
          </div>
        </div>
      </div>
    );
  }
  const qa = quiz.items[quiz.index];
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>
          {title} · 测验
        </h3>
        <div className="quiz-progress">
          第 {quiz.index + 1} / {quiz.items.length} 题
        </div>
      </div>
      <div className="quiz-question">{qa.question_display}</div>
      {answerShown && (
        <div className="quiz-answer">
          <AnswerBody text={qa.answer_text} />
        </div>
      )}
      <div className="quiz-actions">
        {!answerShown ? (
          <button type="button" className="quiz-btn show" onClick={onShow}>
            查看答案
          </button>
        ) : (
          <>
            <button type="button" className="quiz-btn ok" onClick={() => onAnswer(true)}>
              ✓ 已背熟
            </button>
            <button type="button" className="quiz-btn review" onClick={() => onAnswer(false)}>
              ↻ 需复习
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatsView({
  data,
  progress,
  onSelect,
}: {
  data: PracticeData;
  progress: Record<string, Status>;
  onSelect: (id: number) => void;
}) {
  const totals = countProgress(data, progress);
  const pct = totals.total ? Math.round((totals.mastered / totals.total) * 100) : 0;
  return (
    <>
      <div className="content-header">
        <h2>学习统计</h2>
        <p>总体背诵进度（数据保存在本机浏览器）</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value green">{totals.mastered}</div>
          <div className="stat-label">已背熟</div>
        </div>
        <div className="stat-card">
          <div className="stat-value amber">{totals.review}</div>
          <div className="stat-label">需复习</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totals.unlearned}</div>
          <div className="stat-label">未学习</div>
        </div>
        <div className="stat-card">
          <div className="stat-value blue">{pct}%</div>
          <div className="stat-label">完成率</div>
        </div>
        <div className="stat-card">
          <div className="stat-value red">{totals.total}</div>
          <div className="stat-label">考点总数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value blue">{data.chapters.length}</div>
          <div className="stat-label">章节数</div>
        </div>
      </div>
      <div className="chapter-stats">
        <h3>各章节进度</h3>
        {data.chapters.map((ch) => {
          const mem = ch.qas.filter((qa) => progress[statusKey(ch.id, qa.number)] === 'mastered').length;
          const chPct = ch.qas.length ? Math.round((mem / ch.qas.length) * 100) : 0;
          return (
            <button type="button" className="chapter-stat-item" key={ch.id} onClick={() => onSelect(ch.id)}>
              <span className="chapter-stat-name">{ch.title}</span>
              <span className="chapter-stat-bar">
                <span className="chapter-stat-fill" style={{ width: `${chPct}%` }} />
              </span>
              <span className="chapter-stat-text">
                {mem}/{ch.qas.length}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
