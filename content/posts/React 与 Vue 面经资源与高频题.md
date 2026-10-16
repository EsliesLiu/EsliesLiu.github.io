---
title: "React 与 Vue 面经资源与高频题"
date: 2026-10-16
description: "- 说说对 React 的理解?有哪些特性?为什么说 props 是只读的? - React 构建组件的方式有哪些(函数式/createClass/继承 Component)区…"
tags:
  - "前端面经"
  - "面试"
  - "前端"
  - "React"
  - "Vue"
  - "面经"
  - "高频题"
draft: false
---

# React 与 Vue 面经资源与高频题

> 整理时间:2026-10-16。姊妹篇:[前端+AI Agent 面经资源与高频题](/posts/%E5%89%8D%E7%AB%AF%2BAI%20Agent%20%E9%9D%A2%E7%BB%8F%E8%B5%84%E6%BA%90%E4%B8%8E%E9%AB%98%E9%A2%91%E9%A2%98/)(那份偏 AI/Agent 方向,这份纯框架八股 + 源码原理)。
> 原文归档:[00 前端面经原文索引](/posts/00%20%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F%E5%8E%9F%E6%96%87%E7%B4%A2%E5%BC%95/) · 所有链接均已实测 HTTP 200。

---

## 一、资源清单(按优先级)

### P0 — 框架题库(先刷这三个)

| 资源 | 说明 | 链接 |
|------|------|------|
| **村长 Vue 经典面试题 49 讲** | 每题固定「分析 → 思路 → **回答范例** → 知其所以然(源码/实验) → 可能的追问」。唯一一份能直接照着背答题框架的 | [GitHub](https://github.com/57code/vue-interview) |
| **febobo/web-interview** | 11.8k★,React 33 个专题,统一「面试官:xxx?→ 是什么/如何做/区别」结构;另有 Vue、工程化、CSS 等 | [GitHub](https://github.com/febobo/web-interview) |
| **React 底层原理面试题大全** | 25 题分初级/中级/高级/React18/性能优化,含手写题(createElement、useDebounce、HOC 性能监控、虚拟滚动) | [GitHub](https://github.com/xiumubai/coding) |

### P1 — 大题库 / 真题(当 checklist 扫)

| 资源 | 说明 | 链接 |
|------|------|------|
| **haizlin/fe-interview** | 26k★,6000+ 前端面试题,每天 3+1。React/Vue 分册是全量题目清单,**每题都链到原仓库 Issue(社区答案)** | [GitHub](https://github.com/haizlin/fe-interview) |
| **lgwebdream/FE-Interview** | 7.2k★,1000+ 真题,**有成段答案**:React 120 题(含 RN、Redux/MobX)+ Vue 39 题 | [GitHub](https://github.com/lgwebdream/FE-Interview) |
| **yisainan/web-interview** | 2.7k★,Vue 部分 90KB+ 超大合集(响应式/插槽/路由/性能/首页白屏排查);React 部分是 15/16 生命周期对照 | [GitHub](https://github.com/yisainan/web-interview) |
| **Liqiuyue9597/front-end-interview** | 字节/百度/阿里/腾讯,**真人真面真题**,原文用 ★ 标重要度,答案在 Issue | [GitHub](https://github.com/Liqiuyue9597/front-end-interview) |

### P2 — 源码向(想答出深度再上)

| 资源 | 说明 | 链接 |
|------|------|------|
| ruochuan12/vuex-analysis | Vuex 源码整体架构拆解 8 篇 | [GitHub](https://github.com/ruochuan12/vuex-analysis) |
| ruochuan12/redux-analysis | Redux 源码整体架构拆解 | [GitHub](https://github.com/ruochuan12/redux-analysis) |
| FEGuide | 老牌前端知识体系(2020 停更,基础部分仍可用) | [GitHub](https://github.com/FEGuideTeam/FEGuide) |
| ok3-8/when-i-using-react | React 学习资料 + 面试指南 | [GitHub](https://github.com/ok3-8/when-i-using-react) |
| 面试鸭 mianshiya | 题库站,前端 + 大模型 + Agent | [mianshiya.com](https://www.mianshiya.com) |

---

## 二、React 高频考点(按模块,题目来自上面资源原文)

### 1. 基础与组件模型
- 说说对 React 的理解?有哪些特性?为什么说 props 是只读的?
- React 构建组件的方式有哪些(函数式/createClass/继承 Component)区别?
- 类组件和函数组件有什么区别?有状态 / 无状态组件的优劣
- state 和 props 的区别?`super()` 和 `super(props)` 的区别?
- 受控组件和非受控组件的理解与应用场景?怎么给非受控组件设默认值?
- 高階组件(HOC)、render props、Hooks 有什么区别,为什么要不断迭代?
- `React.Component` 和 `PureComponent` 的区别?`shouldComponentUpdate` 解决什么问题?
- React 中组件之间如何通信?子父组件如何传值?props 层级过深怎么办?
- 什么是渲染劫持?React 的严格模式(StrictMode)有什么用?

### 2. 渲染原理 / diff / Fiber(必考)
- **说说对 Fiber 架构的理解?解决了什么问题** — 对比 stack 协调器优化了什么
- 说一下 React 的协调(Reconciliation)过程 / diff 算法原理
- Real DOM 和 Virtual DOM 的区别?优缺点?虚拟 DOM 一定更快吗?
- JSX 转换成真实 DOM 的过程是怎样的?
- render 方法的原理?返回的数据类型?什么时候会被触发?
- **React key 有什么作用?为什么 key 不能用 index?需要全局唯一吗?**
- React 中 DOM 结构变化后,内部经历了哪些变化(mount 时的 textComponent / composeComponent / domComponent)?
- React 15 / 16 / 18 的区别?新版本解决了什么问题?
- 异步渲染、Time Slicing、Suspense 的概念

### 3. Hooks
- 说说对 React Hooks 的理解?解决了什么问题?实现原理是什么?
- Hooks 要遵守哪些原则?**为什么不能放在条件判断里?**(Fiber 上 hooks 以链表存在)
- `useEffect` 和 `useLayoutEffect` 的区别?`useEffect` 的依赖数组与清理函数
- 为什么 `useState` 返回的是数组而不是对象?
- `useMemo` 和 `useCallback` 的区别及使用场景?`React.memo` 怎么用?
- 怎样用 Hooks 获取服务端数据?怎么定时更新一个组件?

### 4. 状态管理与数据流
- 介绍 Redux 的数据流 / 工作原理?整体工作流程?
- **Redux 中间件是什么?接受几个参数?柯里化函数两端的参数具体是什么?中间件怎么拿到 store 和 action?**
- 常用的中间件有哪些(redux-thunk/logger)?`redux-saga` 和 `mobx` 的比较
- Redux 请求中间件如何处理并发?异步请求怎么处理?
- 说一下单向数据流有什么好处?为什么要用 Redux/Vuex(不要说为了保存状态)?
- 对 Redux / React-Redux / Context 的理解,主要解决什么问题?connect 的原理?
- Redux 和 Vuex 有什么区别?共同思想是什么?
- 说一下 immutable,如何应用在 React 项目中?

### 5. 事件 / 性能 / 工程化
- **React 事件绑定的方式有哪些?区别?**为什么推荐在 constructor 里 bind?
- 说说 React 的事件机制(合成事件 SyntheticEvent)、事件代理的原理、执行顺序
- 说说 React 性能优化的手段有哪些?怎么避免不必要的 render?
- React 组件中怎么做事件代理?`Link` 和 `a` 标签有什么区别?
- 提高组件渲染效率的手段?懒加载组件、动态导入组件怎么做?
- React 项目里怎么捕获错误(Error Boundary 的实现与局限)?
- react 中引入 css 的方式有哪几种?区别(含 CSS Modules / styled-components)?
- 说说 React 服务端渲染(SSR)怎么做?原理是什么?
- React 数据持久化有什么实践?实际项目都做过哪些性能优化?
- 使用 React 过程中遇到的常见问题?怎么解决?

### 6. React 18 新特性(2026 面试高频)
- 并发特性(Concurrent Features)是什么?
- `startTransition` API?`useDeferredValue`?`useId`?`useSyncExternalStore`?
- setState 在 17 里只在 React 事件中批处理,18 里自动批处理的区别
- StrictMode 在 18 中的新变化(开发环境双调用 effect)

### 7. 手写题
- 实现简化版 `React.createElement`
- 实现自定义 Hook `useDebounce` / `useThrottle`
- 实现高阶组件用于性能监控
- 实现虚拟滚动组件(大列表渲染)
- 手写简易 diff / 手写 redux / 手写 react-redux 的 connect

---

## 三、Vue 高频考点(按模块)

### 1. 响应式原理(最高频,几乎必问)
- **Vue2 的响应式(双向绑定)原理** — `Object.defineProperty` 怎么收集依赖、发布订阅;数组为什么要重写 `push/pop/splice` 等 7 个方法
- **Vue3 为什么要用 Proxy 替代 defineProperty**?Proxy 怎么实现数据监听?两者对比的具体实现思路
- Vue 是如何收集依赖的?`dep` / `watcher` / `effect` / `track` 的关系
- 为什么 Vue 的 data 必须是一个函数?
- **`data` 中某个属性值改变后,视图会立即同步重新渲染吗?**(nextTick 异步更新队列)
- `ref` 和 `reactive` 的异同?`computed` 和 `watch` 的区别以及怎么选?`watch` 和 `watchEffect` 的异同?
- Vue3 在哪些方面做了优化?Vue3 的设计目标是什么?

### 2. 渲染与 diff
- 说说你对虚拟 DOM 的理解?虚拟 DOM 主要做了什么?它本身是什么?
- **你了解 Vue 的 diff 算法吗**?Vue2 双端比较 vs Vue3 的最长递增子序列优化
- `key` 的作用是什么?为什么不能用 index?
- `v-if` 和 `v-for` 哪个优先级更高?Vue2 和 Vue3 为什么相反?为什么不要一起用?
- 说说从 template 到 render 的处理过程?`template` / `render` / `$mount` 的关系
- Vue 实例挂载的过程中发生了什么?子组件和父组件创建和挂载的顺序?
- Vue 组件为什么只能有一个根元素?Vue3 为什么可以多个?(Fragment)

### 3. 组件与通信
- 组件之间的通信方式有哪些?(父子 / 兄弟 / 多级嵌套 / 跨级)
- `v-model` 是如何实现的?语法糖实际是什么?
- 子组件可以直接改变父组件的数据吗?为什么?(单向数据流)
- `$attrs` 和 `$listeners` 的使用场景?Vue3 里 `$listeners` 去哪了?
- 怎么扩展某个 Vue 组件?`mixin` 和 `extends` 的覆盖逻辑?
- 递归组件、异步组件、动态组件分别是什么?使用场景?
- 双向数据绑定的原理?
- `v-once`、自定义指令的使用场景?怎么处理 Vue 项目中的错误(全局 errorHandler)?

### 4. 路由 / 状态管理
- `vue-router` 的实现原理?History 模式和 Hash 模式的区别
- 怎么定义动态路由?怎么获取动态参数?路由懒加载怎么做?
- **`vue-router` 中如何保护路由**(全局/路由独享/组件内守卫,以及它们在生命周期中的体现)?
- `router-link` 和 `router-view` 是如何起作用的?除了 router-link 怎么跳转?
- 讲一下 Vuex 的原理与理解?`actions` 和 `mutations` 有什么区别?
- Vuex 的 module 用法?怎么监听 Vuex 数据的变化?Vuex 和 localStorage 的区别?
- 如果让你从零开始写一个 vuex / vue-router,说说你的思路?

### 5. 性能优化
- **你了解哪些 Vue 性能优化方法?**(按路由懒加载 / 组件缓存 / v-if 与 v-show 选择 / v-for 加 key / 计算属性缓存 / 图片懒加载 / 分包 / CDN 分类)
- 怎么缓存当前组件?缓存后怎么更新?(keep-alive 的 `include/exclude/max`、`activated/deactivated`)
- 使用 Vue 渲染大量数据时应该怎么优化?(虚拟列表、冻结数据 `Object.freeze`、分片渲染)
- Vue 中一次性 200 条弹幕怎么处理?
- 首页白屏是什么引起的?vue 如何优化首页加载速度?
- SPA 和 SSR 的区别是什么?怎么取舍?

### 6. 原理深挖(答出深度的关键)
- `nextTick` 是干什么的,实现原理是什么?(宏任务/微任务降级策略:Promise → MutationObserver → setImmediate → setTimeout)
- `keep-alive` 是如何实现的?具体缓存的是什么?
- `vue-loader` 是什么?有什么作用?SFC 的 `<template>/<script>/<style>` 怎么被处理?
- Vue 实例挂载过程中的 `_render` / `_update` / `patch` 链路
- Vue 的自定义指令 `bind/inserted/update/componentUpdated/unbind` 执行时机

---

## 四、React vs Vue 交叉对比题(面试官很爱问)

1. **说一下对 React 和 Vue 的理解,它们的异同**(必背:模板 vs JSX、数据不可变 vs 可变响应式、diff 策略、生态与心智模型)
2. Redux 和 Vuex 有什么区别?共同思想是什么?
3. React 的 diff 和 Vue 的 diff 有什么区别?(Tree diff / 双端比较 / LIS 优化)
4. React 的 setState 和 Vue 的 data 变更在更新机制上的区别?
5. 虚拟 DOM 在 React 和 Vue 里解决的问题一样吗?为什么 Vue 可以做模板编译优化(静态提升、补丁标记)?
6. 为什么 React 单向数据流,而 Vue 支持 v-model 双向绑定?

---

## 五、真实面经(框架相关回合)

### 大厂真题(来自 front-end-interview 真实面试,★ 为原文标注的重要度)

Vue 方向:
- Vue 的响应式(双向绑定)原理 ★★★★
- Vue 生命周期 ★★★
- 讲一下 vuex ★★★
- Vue 中 key 的作用 ★★★
- computed 和 watch ★★
- 讲一下 nextTick 的原理 ★
- 对 virtual DOM 的理解 ★
- Vue 和 React 的区别是什么 ★

React 方向:
- 对 virtual DOM 的理解 ★
- React 里 key 的作用 ★

> 这份仓库的「面试建议」被原作者标了 ★★★★★,值得一读:[issues/82](https://github.com/Liqiuyue9597/front-end-interview/issues/82)

### 掘金上的框架面经复盘(2024-2026)

| 文章 | 链接 |
|------|------|
| 前端两年经验中大厂面经(上)——含 React/Vue 真题 | [掘金](https://juejin.cn/post/7334311273339011087) |
| 【前端面经】字节、钉钉、饿了么 面试 | [掘金](https://juejin.cn/post/7351726029324042267) |
| 2025 前端面试题 - React 进阶篇(考察点梳理) | [掘金](https://juejin.cn/post/7504545616841965583) |
| 面试:轻松拿捏 React 事件机制、fiber 架构 | [掘金](https://juejin.cn/post/7362576303953264650) |

---

## 六、掘金框架好文(按考点挑)

| 文章 | 链接 |
|------|------|
| 50+ Vue 经典面试题源码级详解(2.6 万字合集,村长) | [掘金](https://juejin.cn/post/7097067108663558151) |
| 前端铜九铁十面试必备八股文——Vue | [掘金](https://juejin.cn/post/7270862391155261495) |
| 这 10 个 vue3 的面试题,你会了吗? | [掘金](https://juejin.cn/post/7425786548061241359) |
| 一个问题干懵面试官:Vue2 与 Vue3 的区别 | [掘金](https://juejin.cn/post/7203195123433734203) |
| 「2021」高频前端面试题汇总之 React 篇(上) | [掘金](https://juejin.cn/post/6941546135827775525) |
| 「2021」高频前端面试题汇总之 React 篇(下) | [掘金](https://juejin.cn/post/6940942549305524238) |
| 2024 前端高频面试题之 react 篇 | [掘金](https://juejin.cn/post/7349971654590857216) |
| 2026 最新 React 面试题(持续更新) | [掘金](https://juejin.cn/post/7348651815759282226) |
| 一文带你梳理 React 面试题(含 React 18) | [掘金](https://juejin.cn/post/7182382408807743548) |
| react 高频面试题总结(附答案) | [掘金](https://juejin.cn/post/7164164494603026469) |
| 前端面试题汇总:React 篇 | [掘金](https://juejin.cn/post/7439938405917786139) |
| 44 个 React 前端面试问题 | [掘金](https://juejin.cn/post/7289234975349358627) |
| 前端面试系列之 React 必备知识点 | [掘金](https://juejin.cn/post/7250357906712838205) |

官方文档(原理题的标准答案来源):[react.dev/learn](https://react.dev/learn) · [cn.vuejs.org](https://cn.vuejs.org/guide/introduction)

---

## 七、备考建议

1. **框架题的正确答法 = 结论 + 原理 + 源码/实验证据 + 取舍**。村长的 49 讲就是照这个模板写的:先「回答范例」再「知其所以然」,建议整份过一遍,把答题骨架背下来。
2. **每个考点准备一句「为什么这么设计」**。面试官追问永远落在取舍上(为什么 Vue3 换 Proxy、为什么 React 要 Fiber、为什么 key 不能用 index)。
3. **准备一个自己项目的框架故事**:响应式数据怎么组织的、状态管理选型理由、做过的一次性能优化(要能说出前后指标)。
4. **优先级建议**:响应式原理 / diff 与 key / 生命周期与更新机制 / 状态管理原理 / 性能优化,这五块占框架面试题的 80%。
5. **手写题别裸奔**:React 的 createElement、useDebounce、HOC;Vue 的响应式 mini 实现、`nextTick`、简易 diff。

---

## 八、原文归档(已转成 Obsidian 可读的 md)

> 索引:[00 前端面经原文索引](/posts/00%20%E5%89%8D%E7%AB%AF%E9%9D%A2%E7%BB%8F%E5%8E%9F%E6%96%87%E7%B4%A2%E5%BC%95/)

- [01 大厂前端面试真题索引（含★重要度）](/posts/01%20%E5%A4%A7%E5%8E%82%E5%89%8D%E7%AB%AF%E9%9D%A2%E8%AF%95%E7%9C%9F%E9%A2%98%E7%B4%A2%E5%BC%95%EF%BC%88%E5%90%AB%E2%98%85%E9%87%8D%E8%A6%81%E5%BA%A6%EF%BC%89/)
- [02 React 面试题全量索引（6000 题库）](/posts/02%20React%20%E9%9D%A2%E8%AF%95%E9%A2%98%E5%85%A8%E9%87%8F%E7%B4%A2%E5%BC%95%EF%BC%886000%20%E9%A2%98%E5%BA%93%EF%BC%89/)
- [03 Vue 面试题全量索引（6000 题库）](/posts/03%20Vue%20%E9%9D%A2%E8%AF%95%E9%A2%98%E5%85%A8%E9%87%8F%E7%B4%A2%E5%BC%95%EF%BC%886000%20%E9%A2%98%E5%BA%93%EF%BC%89/)
- [04 村长 Vue 经典面试题 49 讲（含回答范例与追问）](/posts/04%20%E6%9D%91%E9%95%BF%20Vue%20%E7%BB%8F%E5%85%B8%E9%9D%A2%E8%AF%95%E9%A2%98%2049%20%E8%AE%B2%EF%BC%88%E5%90%AB%E5%9B%9E%E7%AD%94%E8%8C%83%E4%BE%8B%E4%B8%8E%E8%BF%BD%E9%97%AE%EF%BC%89/)
- [05 React 底层原理面试题大全（初级→高级→手写）](/posts/05%20React%20%E5%BA%95%E5%B1%82%E5%8E%9F%E7%90%86%E9%9D%A2%E8%AF%95%E9%A2%98%E5%A4%A7%E5%85%A8%EF%BC%88%E5%88%9D%E7%BA%A7%E2%86%92%E9%AB%98%E7%BA%A7%E2%86%92%E6%89%8B%E5%86%99%EF%BC%89/)
- [06 React 专题问答 33 讲（面试官视角）](/posts/06%20React%20%E4%B8%93%E9%A2%98%E9%97%AE%E7%AD%94%2033%20%E8%AE%B2%EF%BC%88%E9%9D%A2%E8%AF%95%E5%AE%98%E8%A7%86%E8%A7%92%EF%BC%89/)
- [07 React 与 Vue 面试题汇总（1000+ 真题库）](/posts/07%20React%20%E4%B8%8E%20Vue%20%E9%9D%A2%E8%AF%95%E9%A2%98%E6%B1%87%E6%80%BB%EF%BC%881000%2B%20%E7%9C%9F%E9%A2%98%E5%BA%93%EF%BC%89/)
- [08 yisainan 前端题库大合集（React + Vue 全量）](/posts/08%20yisainan%20%E5%89%8D%E7%AB%AF%E9%A2%98%E5%BA%93%E5%A4%A7%E5%90%88%E9%9B%86%EF%BC%88React%20%2B%20Vue%20%E5%85%A8%E9%87%8F%EF%BC%89/)
