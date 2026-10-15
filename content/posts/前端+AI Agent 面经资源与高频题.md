---
title: "前端+AI Agent 面经资源与高频题"
date: 2026-09-23
description: "- 最新 AI Agent / 大模型面经索引(2026) — 按公司分类,含 2026-08/09 最新一手复盘"
tags:
  - "AI相关学习"
  - "面试"
  - "前端"
  - "AI"
  - "Agent"
  - "面经"
draft: false
---

# 前端 + AI Agent 面经资源与高频题

> 整理时间:2026-09-17。面向"前端开发 + AI/Agent 经验"的求职准备。
> 关联笔记:[Vibe Coding 视觉词典](/posts/Vibe%20Coding%20%E8%A7%86%E8%A7%89%E8%AF%8D%E5%85%B8/)、[详解claude循环工程](/posts/%E8%AF%A6%E8%A7%A3claude%E5%BE%AA%E7%8E%AF%E5%B7%A5%E7%A8%8B/)

---

## 一、资源清单(按优先级)

### P0 — 前端 + AI 题库(最对口)

| 资源 | 说明 | 链接 |
|------|------|------|
| **senior-frontend-interview** | 高级前端面试手册,**含 AI 工程化专区 15 篇 / 134 题**。讲底层不讲 API。覆盖 Agent、Multi-Agent、MCP/Skill、RAG、Prompt、Design-to-Code、PRD-to-Code、AI 代码生成、LLM 训练 | [GitHub](https://github.com/aaronyanx/senior-frontend-interview) · [在线阅读](https://opc-43d279b8.mintlify.app) |
| **agent-interview-hub** | 572★ AI Agent 工程师面试资料库:国内大厂真实面经、岗位要求、高频题、项目实战题 | [GitHub](https://github.com/Zchary1106/agent-interview-hub) |
| **mianshiya 面试鸭** | 5899★ 题库站,前端 + AI 大模型 + Agent + RAG,1 万+ 题 | [mianshiya.com](https://www.mianshiya.com) · [GitHub](https://github.com/liyupi/mianshiya) |

### P1 — Agent/大模型 题库与面经

| 资源 | 说明 | 链接 |
|------|------|------|
| AgentGuide | 9914★ Agent 开发指南 + LangGraph + 高级 RAG + 大模型面试 | [GitHub](https://github.com/adongwanai/AgentGuide) |
| ai-agents-from-zero | 4839★ Agent 速成 + 面试题库,对标大模型应用开发岗 | [GitHub](https://github.com/didilili/ai-agents-from-zero) |
| LLM-Agent-Interview-Guide | 300+ Q&A,字节/阿里/腾讯真题 | [GitHub](https://github.com/Lau-Jonathan/LLM-Agent-Interview-Guide) |
| llm-interview-notes | 10 篇文档 345 题,含字节 11 篇面经实录 | [GitHub](https://github.com/Imironman123/llm-interview-notes) |
| ai-agent-interview-guide | 题库 + 项目 + 简历 + 系统设计 | [GitHub](https://github.com/bcefghj/ai-agent-interview-guide) |
| JavaGuide docs/ai | 高可信中文 AI 面试体系 | [GitHub](https://github.com/Snailclimb/JavaGuide/tree/main/docs/ai) |

### P2 — 面经索引(持续更新,含牛客直链)

- [最新 AI Agent / 大模型面经索引(2026)](https://github.com/Zchary1106/agent-interview-hub/blob/main/通用知识/最新AI-Agent面经索引.md) — 按公司分类,含 2026-08/09 最新一手复盘

---

## 二、真实面经摘录

### 字节跳动 · AI Agent 一面(16 题)

1. 多模态大模型的具体结构
2. 多模态的用户信息怎么存储和使用
3. Agent 项目背景
4. RAG 系统流程
5. LoRA / QLoRA 原理,QLoRA 怎么优化显存
6. 演示 Agent 项目实现细节
7. AI 辅助开发的实践经验
8. 觉得当前的 Agent 达到预期了吗?对 Agent 的预期是什么
9. 项目中 AI 贡献的代码占比
10. 怎么进行多模态知识检索
11. RAG + MCP 怎么构建
12. **A2A 与 MCP 区别**(新热点)
13. 研发中遇到的困难与解决
14. 较长较多的上下文怎么解决
15. 项目用了什么架构
16. Agent 项目开发的框架

### 字节跳动 · AI Agent 二面

- 项目深挖 / 多模态大模型结构细节
- **Agent Skills 的设计**
- 如何加强大模型记忆机制
- **多 Agent 执行策略的智能选择和切换机制设计**
- SSE 的局限性
- LoRA 效果不佳怎么办?缺点与改进
- RAG 动态知识更新 / RAG 评估方案
- 复杂任务执行准确率评估
- 多轮对话实现方案
- MCP 和 Function Calling 的关系
- 市场上的智能体 Agent 有哪些

### 快手 · AI Agent 开发二面(8 题 + 手撕)

1. RAG 项目怎么评测效果?维度与指标
2. 数据集内容、来源、格式
3. RAG 相关度和回答效果的体系化优化思路
4. 一千条数据做求和,数据处理场景怎么设计
5. RAG 性能怎么提升(工程/算法)
6. 上下文过长、冗余的优化方向
7. **长记忆和短记忆怎么协同工作?衔接逻辑是什么**
8. 怎么让 Agent 更智能

手撕:全排列

### 携程 · AI Agent 开发二面

Agent 完整链路:用户问题 → 意图识别 → query 改写 → 判断走纯 RAG / RAG+Tool / 多 Agent workflow → 混合召回 → rerank → LLM 生成 → 附引用和置信度

追问:**每一层为什么这么设计?哪一层最容易出问题?**

### 京东 · Agent 开发暑期一面

1. Agent workflow 如何拆分和编排
2. 电商 RAG 知识库怎么设计
3. 意图识别如何评估
4. Redis 向量检索、HNSW 索引
5. 幻觉兜底和转人工策略

### 米哈游 · AI Agent 提前批一面

1. AI coding 如何划分人机边界、设置质量门禁
2. 幻觉、事实性、忠实度如何分层治理
3. Skill 与 MCP 的职责边界和组合方式
4. Agent 项目的状态、工具、可靠性、评估指标
5. Memory / RAG / 工具调用 / 多步奖励设计
6. 现场编码:Python 装饰器、数据筛选

---

## 三、Agent 高频拷打题(牛客热帖 3.1W 浏览)

### Agent 架构与设计
1. 你理解的 Agent 架构是什么?一般由哪些模块组成?
2. Tool 怎么设计?什么功能应该做成 Tool?
3. Memory 分几种?Short-term / Long-term 怎么实现?
4. Agent 怎么任务规划?ReAct 还是 Plan-Execute?
5. 多 Agent 协作怎么做?

### RAG 全链路
6. RAG 完整流程(数据→切分→embedding→向量库→检索→重排→生成)
7. Chunk 大小怎么确定?为什么?
8. 向量召回不准怎么办?
9. rerank 怎么做?用什么模型?
10. 如何评估 RAG 效果?指标是什么?
11. RAG 和微调怎么取舍?
12. 多路召回怎么做?
13. 如何降低 RAG 延迟?

### LLM 工程
14. 如何解决幻觉? 15. 如何降低幻觉? 16. 如何让输出稳定格式?
17. 如何做自动化 Prompt 优化(A/B test / eval)?

### 系统设计
18. Agent 系统 QPS 很高怎么设计架构?
19. 向量检索慢怎么办? 20. LLM 调用慢怎么办?
21. 如何做缓存? 22. 如何做降级? 23. 如何控制成本?
24. 高并发 RAG 系统架构

### 业务场景(电商)
25-33. AI 导购助手设计、电商 Agent 的 Tool/Memory、自动运营 Agent、商品库 embedding 字段、个性化 RAG、高并发

---

## 四、前端向 AI 考点(134 题分类)

### Agent 与编排
- Agent 核心原理 / 如何实现企业级 Agent
- 长时间运行 Agent(5h+)设计
- Human-in-the-Loop 详解
- **Agent Skills vs RAG 的区别**
- OpenAI Harness Engineering 是什么
- OpenClaw / Hermes 是什么
- AI 编码工具的原理与多 Agent 协作
- 多 Agent 协作模式、通信方式、Hierarchical vs Collaborative
- 错误处理与容错

### MCP 与 Skill
- MCP / Skill / agent.md 分别是什么,各自适用场景
- MCP 的 Tool、Resource、Prompt 三要素
- MCP 的 Tool 和 Function Calling 的区别
- 如何从零写 MCP Server / 高质量 Skill
- 企业级 MCP/Skill 设计的四大挑战

### Prompt
- 核心技巧 / 输出不稳定 / 幻觉
- Prompt Cache 优化
- Few-shot、CoT
- 提示词注入攻击防护
- Prompt 评测体系、llms.txt

### RAG
- 原理与完整流程 / 企业级搭建
- 高级优化、RAG vs Fine-tuning
- 多模态 RAG(图文混排、表格、图片语义)
- RAGAS 评估体系
- 企业级部署(离线预处理、混合索引、VLM Re-ranking、**前端集成**)

### 前端强相关(AI 落地)
- **Design to Code**:原理、Figma MCP 详解、工具对比、最佳实践
- **PRD to Code**:完整流程、需求提取、代码到测试、端到端工作流
- **AI 代码生成**:演进、原理 vs 传统补全、主流工具对比、局限
- **AI 工程化**:部署、监控、成本优化、评估体系、安全合规、AI 生成内容的多模态渲染
- 前端工程师需要了解的 AI 工具
- Vercel AI SDK 是什么?和 LangChain 的区别
- SSE 的局限性

### 模型基础
- Transformer / 自注意力 / Token 化 / 上下文窗口 / 推理过程 / 局限性
- Embedding 原理、选型、向量数据库对比、微调
- LLM 训练流程:预训练 / SFT / RLHF / DPO / LoRA、QLoRA

---

## 五、前端转型 Agent 参考文章(2026)

| 文章 | 链接 |
|------|------|
| 2026 年前端开发工程师转型 AI Agent 开发工程师全指南 | [掘金](https://juejin.cn/post/7631007870080073770) |
| Vue3 + AI Agent 前端开发实战:一个前端开发工程师的转型记录 | [掘金](https://juejin.cn/post/7618492703295340598) |
| 前端工程师转型 AI Agent 工程师:后端能力补全指南 | [掘金](https://juejin.cn/post/7618456150179643418) |
| DeepSeek 招 36 个岗位,80% 都要会 Agent(JD 拆解) | [掘金](https://juejin.cn/post/7656300675647373321) |
| 一份 Agent 工程岗 JD,暴露了市场真正想要什么样的人 | [掘金](https://juejin.cn/post/7643984132233642036) |
| 2026 年从 0 开发 AI Agent 需要的 10 个技能 | [掘金](https://juejin.cn/post/7648894966207152180) |
| 前端领域 30 个值得安装的 Agent Skills | [掘金](https://juejin.cn/post/7648545475571859475) |
| 前端转型 Agent 开发 01:Agent API 调用 | [掘金](https://juejin.cn/post/7677441124443848713) |
| 前端转型 Agent 开发 03:Agent Tools | [掘金](https://juejin.cn/post/7680079424890601524) |
| 2026 最新 AI Agent 岗面试复盘:拿到三个 offer | [掘金](https://juejin.cn/post/7625576464485842979) |

---

## 六、关键观察

1. **纯前端岗位的 AI 考察点**:AI Coding 工具使用深度、AI 贡献代码占比、Design-to-Code、AI 提效实践、是否理解 Agent 协作原理 —— 不再是"会不会用 Copilot",而是"能不能设计质量门禁和边界"。
2. **Agent 岗位的必考三件套**:RAG 全链路、Agent 记忆机制(长短期协同)、项目实操深挖。
3. **2026 新热点**:A2A vs MCP、Harness/Orchestrator、上下文工程、Skills 渐进加载、Agent 评估体系、长任务续跑。
4. **面试官话术**:几乎每轮都有"为什么这么设计?哪一层最容易出问题?" —— 准备时要能讲清取舍,不只讲流程。
5. **转型路径**:前端 → AI Agent 的天然优势是交互与工程化(SSE/流式渲染、状态管理、可视化 Trace),需要补的是后端(向量库、并发、部署)。
