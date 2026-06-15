import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarkdownIt from 'markdown-it';
import FuzzyText from './components/FuzzyText';
import GradientText from './components/GradientText';
import PillNav from './components/PillNav';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const Grainient = lazy(() => import('./components/Grainient'));

const profile = {
  name: '周昊天',
  englishName: 'Nevermore',
  role: 'Bioinformatics Graduate Researcher',
  email: 'zhouhaotian0622@163.com',
  github: 'https://github.com/Zhou-Nevermore',
  tagline: '在微生物组、代谢组与深度学习之间，构建可解释的生命数据叙事。',
  introduction:
    '我是一名生物信息学方向研究生，关注水体与鱼类肠道微生物、代谢组数据分析、生石花基因家族分析与深度学习建模。这个网站用于沉淀研究笔记、项目工具、文献精读与个人经历。',
};

const timeline = [
  {
    period: '2019.06 - 2023.09',
    title: '江汉大学 生命科学学院',
    meta: '本科阶段研究方向',
    body: '水体及鱼类肠道微生物，积累微生物生态、实验设计与数据解读基础。',
  },
  {
    period: '2024.03 - 2024.10',
    title: '武汉迈维代谢',
    meta: '代谢组学生信分析工程师',
    body: '参与代谢组项目分析，熟悉组学数据清洗、统计分析、可视化与报告交付流程。',
  },
  {
    period: '2025.09 - 2028.06',
    title: '福建农林大学 海峡联合研究院',
    meta: '硕士研究方向',
    body: '生石花基因家族分析与深度学习建模，探索植物基因组数据中的结构、功能与预测模型。',
  },
];

const navItems = [
  { label: 'Profile', href: '#about' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Lab Notes', href: '#hub' },
];

const markdownSyntaxGuideContent = [
  '# Markdown 全语法速查',
  '',
  '这篇笔记用于测试和复制常用 Markdown 写法。编辑时可以直接 Ctrl+V 粘贴图片，系统会自动插入短 ID，例如 `![图片说明|width=640](local-image:img-xxxxxx)`，图片数据会单独保存在浏览器本地。',
  '',
  '## 1. 标题',
  '',
  '# 一级标题',
  '## 二级标题',
  '### 三级标题',
  '#### 四级标题',
  '',
  '## 2. 强调与行内代码',
  '',
  '普通文字、**加粗文字**、*斜体文字*、~~删除线~~、`inline code`。',
  '',
  '## 3. 列表',
  '',
  '- 无序列表 A',
  '- 无序列表 B',
  '  - 二级列表',
  '',
  '1. 有序列表第一步',
  '2. 有序列表第二步',
  '',
  '## 4. 任务列表',
  '',
  '- [x] 已完成：整理 QIIME2 流程',
  '- [ ] 待完成：补充可视化脚本',
  '',
  '## 5. 引用',
  '',
  '> 看不见的不代表不存在，数据里的模式也一样。',
  '',
  '## 6. 表格',
  '',
  '| 模块 | 用途 | 状态 |',
  '| --- | --- | --- |',
  '| 笔记教程 | 流程沉淀 | 进行中 |',
  '| SciHub 项目 | 工具构想 | 规划中 |',
  '| 期刊精读 | 文献拆解 | 进行中 |',
  '',
  '## 7. 代码块',
  '',
  '```bash',
  'qiime tools import \\',
  '  --type SampleData[PairedEndSequencesWithQuality] \\',
  '  --input-path manifest.tsv \\',
  '  --output-path paired-end-demux.qza',
  '```',
  '',
  '```r',
  'library(ggplot2)',
  'ggplot(df, aes(x = group, y = value, fill = group)) +',
  '  geom_boxplot() +',
  '  theme_classic()',
  '```',
  '',
  '## 8. 链接与图片',
  '',
  '[GitHub 首页](https://github.com/Zhou-Nevermore)',
  '',
  '图片尺寸语法：',
  '',
  '```markdown',
  '![实验流程图|width=520](local-image:img-xxxxxx)',
  '![实验流程图|360x240](local-image:img-xxxxxx)',
  '```',
  '',
  '## 9. 分割线',
  '',
  '---',
  '',
  '## 10. 备注',
  '',
  '如果图片太大，把 `width=640` 改成 `width=420`；如果想恢复自适应宽度，删除 `|width=...` 即可。粘贴后 Markdown 里只保留短 ID，不会再出现一长串 base64。',
].join('\n');

const defaultModules = [
  {
    id: 'notes',
    title: '笔记教程',
    eyebrow: 'Protocols & Notes',
    description: '把常用流程、踩坑记录和可复用脚本整理成可检索的研究手册。',
    categories: [
      {
        id: 'amplicon',
        name: '微生物组分析',
        pages: [
          {
            id: 'qiime2-start',
            title: 'QIIME2 入门流程',
            content:
              '## QIIME2 入门流程\n\n- 数据导入与 manifest 文件准备\n- DADA2 去噪与特征表生成\n- 物种注释、Alpha/Beta 多样性分析\n\n```bash\nqiime tools import\nqiime dada2 denoise-paired\n```\n\n> 目标是把每一步的输入、输出和判断标准写清楚。',
          },
          {
            id: 'markdown-syntax-guide',
            title: 'Markdown 全语法速查',
            content: markdownSyntaxGuideContent,
          },
        ],
      },
      {
        id: 'coding',
        name: '数据分析脚本',
        pages: [
          {
            id: 'r-visual',
            title: 'R 语言可视化模板',
            content:
              '## R 语言可视化模板\n\n- `ggplot2` 主题统一\n- 批量导出 PDF / PNG\n- 图例与配色规范\n\n**原则：** 图形先回答问题，再追求复杂。',
          },
        ],
      },
    ],
  },
  {
    id: 'scihub',
    title: 'SciHub 项目',
    eyebrow: 'Research Toolkit',
    description: '沉淀自用文献检索、下载、整理和元数据管理工具的构想与进度。',
    categories: [
      {
        id: 'crawler',
        name: '文献元数据',
        pages: [
          {
            id: 'doi-parser',
            title: 'DOI 与标题解析',
            content:
              '## DOI 与标题解析\n\n这个模块记录文献元数据解析思路：\n\n1. 输入 DOI、PMID 或标题。\n2. 查询公开 API 获取元数据。\n3. 统一导出 BibTeX / RIS / Markdown 摘要。\n\n`TODO:` 后续接入真实后端。',
          },
        ],
      },
    ],
  },
  {
    id: 'journal',
    title: '期刊精读',
    eyebrow: 'Paper Reading',
    description: '按研究主题拆解论文：问题、方法、数据、图表、结论与可复用思路。',
    categories: [
      {
        id: 'genomics',
        name: '基因组与深度学习',
        pages: [
          {
            id: 'gene-family',
            title: '基因家族分析论文精读框架',
            content:
              '## 基因家族分析论文精读框架\n\n- **研究问题：** 该基因家族与什么表型或胁迫相关？\n- **数据来源：** 基因组版本、注释质量、样本信息。\n- **关键方法：** HMM 搜索、系统发育树、保守结构域、表达分析。\n- **可复用点：** 图表结构、流程参数、验证策略。',
          },
        ],
      },
    ],
  },
];

const storageKey = 'nevermore-site-modules-v1';
const imageStorageKey = 'nevermore-site-images-v1';
const password = 'nevermore';

function loadStoredImages() {
  try {
    return JSON.parse(localStorage.getItem(imageStorageKey)) || {};
  } catch {
    return {};
  }
}

function saveStoredImage(id, dataUrl) {
  try {
    const images = loadStoredImages();
    images[id] = dataUrl;
    localStorage.setItem(imageStorageKey, JSON.stringify(images));
  } catch {
    // If storage quota is exceeded, keep the short token in Markdown and fail gracefully.
  }
}

function resolveImageSource(source) {
  if (!source?.startsWith('local-image:')) return source;
  return loadStoredImages()[source.replace('local-image:', '')] || '';
}

const markdownParser = new MarkdownIt({
  breaks: true,
  html: false,
  linkify: true,
  typographer: true,
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]);
}

function renderCodeBlock(content, language = '') {
  const langClass = language ? ` language-${escapeHtml(language)}` : '';
  const label = language || 'code';
  return `<div class="code-block-shell"><button class="copy-code-button" type="button" data-copy-code>复制</button><pre><code class="${langClass}">${escapeHtml(content)}</code></pre><span class="code-block-label">${escapeHtml(label)}</span></div>`;
}

markdownParser.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index];
  const language = token.info.trim().split(/\s+/)[0] || '';
  return renderCodeBlock(token.content, language);
};

markdownParser.renderer.rules.code_block = (tokens, index) =>
  renderCodeBlock(tokens[index].content);

markdownParser.core.ruler.after('inline', 'task_lists', (state) => {
  state.tokens.forEach((token, index) => {
    if (
      token.type !== 'inline' ||
      state.tokens[index - 1]?.type !== 'paragraph_open' ||
      state.tokens[index - 2]?.type !== 'list_item_open'
    ) {
      return;
    }

    const firstChild = token.children?.[0];
    if (firstChild?.type !== 'text') return;

    const taskMarker = firstChild.content.match(/^\[([ xX])\]\s+/);
    if (!taskMarker) return;

    const listItem = state.tokens[index - 2];
    const list = state.tokens
      .slice(0, index - 2)
      .reverse()
      .find((item) => item.type === 'bullet_list_open' || item.type === 'ordered_list_open');
    const checkbox = new state.Token('html_inline', '', 0);

    checkbox.content = `<input class="task-list-item-checkbox" type="checkbox" disabled${
      taskMarker[1].toLowerCase() === 'x' ? ' checked' : ''
    } />`;
    firstChild.content = firstChild.content.replace(/^\[[ xX]\]\s+/, '');
    token.children.unshift(checkbox);
    listItem.attrJoin('class', 'task-list-item');
    list?.attrJoin('class', 'task-list');
  });
});

markdownParser.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const href = tokens[index].attrGet('href') || '';
  if (/^https?:\/\//i.test(href)) {
    tokens[index].attrSet('target', '_blank');
    tokens[index].attrSet('rel', 'noreferrer');
  }
  return self.renderToken(tokens, index, options);
};

markdownParser.renderer.rules.image = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const rawAlt = token.content || '';
  const [altText, ...directives] = rawAlt.split('|').map((item) => item.trim());
  let width = '';
  let height = '';

  directives.forEach((directive) => {
    const pair = directive.match(/^(\d{2,4})x(\d{2,4})$/i);
    const widthOnly = directive.match(/^(?:w|width)?=?(\d{2,4})$/i);
    const heightOnly = directive.match(/^(?:h|height)=(\d{2,4})$/i);

    if (pair) {
      width = pair[1];
      height = pair[2];
      return;
    }
    if (heightOnly) {
      height = heightOnly[1];
      return;
    }
    if (widthOnly) {
      width = widthOnly[1];
    }
  });

  token.content = altText;
  token.attrSet('alt', altText);
  token.attrSet('loading', 'lazy');
  token.attrSet('src', resolveImageSource(token.attrGet('src')));
  if (width) token.attrSet('width', width);
  if (height) token.attrSet('height', height);
  return self.renderToken(tokens, index, options);
};

function ensureDefaultEnhancements(modules) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return defaultModules;
  }

  return modules.map((module) => {
    if (module.id !== 'notes') return module;

    return {
      ...module,
      categories: module.categories.map((category, categoryIndex) => {
        if (categoryIndex !== 0) return category;
        const hasGuide = category.pages.some((page) => page.id === 'markdown-syntax-guide');
        if (hasGuide) {
          return {
            ...category,
            pages: category.pages.map((page) =>
              page.id === 'markdown-syntax-guide' && !page.content.includes('local-image:')
                ? { ...page, content: markdownSyntaxGuideContent }
                : page,
            ),
          };
        }

        return {
          ...category,
          pages: [
            ...category.pages,
            {
              id: 'markdown-syntax-guide',
              title: 'Markdown 全语法速查',
              content: markdownSyntaxGuideContent,
            },
          ],
        };
      }),
    };
  });
}

function loadModules() {
  try {
    const parsedModules = JSON.parse(localStorage.getItem(storageKey));
    const storedModules = Array.isArray(parsedModules) && parsedModules.length > 0 ? parsedModules : defaultModules;
    const firstPage = storedModules?.[0]?.categories?.[0]?.pages?.[0];

    if (
      firstPage?.title?.startsWith('保存测试 ') &&
      firstPage?.content?.includes('echo save-ok')
    ) {
      firstPage.title = 'QIIME2 入门流程';
      firstPage.content = '你好';
    }

    return ensureDefaultEnhancements(storedModules);
  } catch {
    return ensureDefaultEnhancements(defaultModules);
  }
}

function renderMarkdown(markdown) {
  return markdownParser.render(markdown || '');
}

function App() {
  const [modules, setModules] = useState(loadModules);
  const [activeModuleId, setActiveModuleId] = useState(defaultModules[0].id);
  const [activeCategoryId, setActiveCategoryId] = useState(defaultModules[0].categories[0].id);
  const [activePageId, setActivePageId] = useState(defaultModules[0].categories[0].pages[0].id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialog, setDialog] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [enableGrainient, setEnableGrainient] = useState(false);

  const safeModules = Array.isArray(modules) && modules.length > 0 ? modules : defaultModules;
  const activeModule = safeModules.find((module) => module.id === activeModuleId) || safeModules[0];
  const activeCategory =
    activeModule.categories.find((category) => category.id === activeCategoryId) ||
    activeModule.categories[0];
  const activePage =
    activeCategory.pages.find((page) => page.id === activePageId) || activeCategory.pages[0];

  useEffect(() => {
    const schedule = window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (callback) => window.setTimeout(callback, 1200);
    const cancel = window.cancelIdleCallback
      ? window.cancelIdleCallback.bind(window)
      : window.clearTimeout.bind(window);
    const idleId = schedule(() => setEnableGrainient(true));
    return () => cancel(idleId);
  }, []);

  useEffect(() => {
    const glowSelector = [
      '.portrait-card',
      '.about-copy',
      '.timeline',
      '.hub-panel',
      '.module-tabs button',
      '.contact-grid a',
      '.hub-search input',
      '.search-results',
      '.search-results button',
      '.page-list button',
      '.inline-add-page',
      '.markdown-editor-panel',
      '.markdown-live-preview',
      '.copy-code-button',
      '.markdown-body blockquote',
      '.action-dialog',
      '.dialog-field input',
      '.category-name-input',
      '.login-box input',
    ].join(',');

    let pendingGlowEvent = null;
    let glowFrame = 0;

    const updateGlowFromEvent = (event) => {
      const card = event.target.closest?.(glowSelector);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

      card.style.setProperty('--press-x', `${((x / rect.width) * 100).toFixed(2)}%`);
      card.style.setProperty('--press-y', `${((y / rect.height) * 100).toFixed(2)}%`);
      card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      card.style.setProperty('--cursor-angle', `${angle < 0 ? angle + 360 : angle}deg`);
    };

    const updateGlow = (event) => {
      pendingGlowEvent = event;
      if (glowFrame) return;
      glowFrame = window.requestAnimationFrame(() => {
        glowFrame = 0;
        if (pendingGlowEvent) updateGlowFromEvent(pendingGlowEvent);
        pendingGlowEvent = null;
      });
    };

    document.addEventListener('pointermove', updateGlow, { passive: true });
    return () => {
      document.removeEventListener('pointermove', updateGlow);
      if (glowFrame) window.cancelAnimationFrame(glowFrame);
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.documentElement.classList.add('motion-reduced');
      return undefined;
    }

    document.documentElement.classList.add('motion-ready');

    const context = gsap.context(() => {
      gsap.set('.nav .brand', { autoAlpha: 0, y: -20, filter: 'blur(10px)' });
      gsap.set('.pill-nav-container', { autoAlpha: 0, y: -24, scale: 0.96, filter: 'blur(12px)' });
      gsap.set('.hero-video', { scale: 1.12, filter: 'brightness(0.42) saturate(1.4) blur(6px)' });
      gsap.set('.hero-fuzzy-title', {
        autoAlpha: 0,
        yPercent: 120,
        scaleY: 0.42,
        transformOrigin: '50% 100%',
        filter: 'blur(18px)',
        clipPath: 'inset(100% 0 0 0)',
      });
      gsap.set('.hero-gradient-subtitle', {
        autoAlpha: 0,
        y: 36,
        scaleX: 0.72,
        transformOrigin: '50% 50%',
        filter: 'blur(12px)',
      });
      gsap.set('.hero-actions a', {
        autoAlpha: 0,
        y: 30,
        scaleX: 0.84,
        filter: 'blur(12px)',
      });

      const opening = gsap.timeline({ defaults: { ease: 'power4.out' } });

      opening
        .to(
          '.hero-video',
          {
            scale: 1,
            filter: 'brightness(0.72) saturate(1.18) blur(0px)',
            duration: 2.2,
            ease: 'power3.out',
          },
          0,
        )
        .to(
          '.nav .brand',
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.1,
          },
          0.28,
        )
        .to(
          '.pill-nav-container',
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.15,
          },
          0.42,
        )
        .to(
          '.hero-fuzzy-title',
          {
            autoAlpha: 1,
            yPercent: 0,
            scaleY: 1,
            filter: 'blur(0px)',
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.35,
            stagger: 0.18,
            ease: 'expo.out',
          },
          0.58,
        )
        .to(
          '.hero-gradient-subtitle',
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            filter: 'blur(0px)',
            duration: 1.2,
          },
          1.28,
        )
        .to(
          '.hero-actions a',
          {
            autoAlpha: 1,
            y: 0,
            scaleX: 1,
            filter: 'blur(0px)',
            duration: 1,
            stagger: 0.12,
          },
          1.55,
        );

      gsap.to('.hero-video', {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      const revealSection = (trigger, title, cards) => {
        const cardTargets = gsap.utils.toArray(cards.join(','));
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: 'top 72%',
            end: 'bottom 52%',
            toggleActions: 'play none none reverse',
          },
          defaults: { ease: 'power4.out' },
        });

        if (title) {
          timeline.fromTo(
            title,
            {
              autoAlpha: 0,
              xPercent: -34,
              y: 70,
              scale: 1.32,
              letterSpacing: '0.44em',
              filter: 'blur(18px)',
              clipPath: 'inset(0 100% 0 0)',
            },
            {
              autoAlpha: 1,
              xPercent: 0,
              y: 0,
              scale: 1,
              letterSpacing: '0.16em',
              filter: 'blur(0px)',
              clipPath: 'inset(0 0% 0 0)',
              duration: 1.25,
            },
          );
        }

        timeline.fromTo(
            cardTargets,
            {
              autoAlpha: 0,
              y: 96,
              scale: 0.94,
              rotateX: 8,
              filter: 'blur(18px)',
              clipPath: 'inset(12% 0 22% 0 round 32px)',
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: 'blur(0px)',
              clipPath: 'inset(0% 0 0% 0 round 32px)',
              duration: 1.2,
              stagger: 0.14,
            },
            title ? '-=0.54' : 0,
          );
      };

      revealSection('#about', null, [
        '#about .portrait-card',
        '#about .about-copy',
        '#about .timeline',
      ]);

      gsap.fromTo(
        ['#hub .module-tabs button', '#hub .hub-panel'],
        {
          autoAlpha: 0,
          y: 72,
          scale: 0.96,
          rotateX: 5,
          filter: 'blur(12px)',
          clipPath: 'inset(8% 0 16% 0 round 32px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0 0% 0 round 32px)',
          duration: 0.72,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#hub',
            start: 'top 82%',
            once: true,
          },
        },
      );

      gsap.fromTo(
        '#about .portrait',
        { yPercent: -5, scale: 1.05 },
        {
          yPercent: 6,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        },
      );

      gsap.fromTo(
        '.timeline-item',
        { autoAlpha: 0, x: 56, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.95,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 76%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.set('#hub .hub-search', { autoAlpha: 1, clearProps: 'transform,filter,clipPath' });
      ScrollTrigger.refresh();
    });

    return () => {
      context.revert();
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    async function copyText(text) {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    const handleCopyCode = async (event) => {
      const button = event.target.closest?.('[data-copy-code]');
      if (!button) return;

      const shell = button.closest('.code-block-shell');
      const code = shell?.querySelector('code')?.textContent || '';
      if (!code) return;

      try {
        await copyText(code);
        const previousText = button.textContent;
        button.textContent = '已复制';
        button.classList.add('copied');
        window.setTimeout(() => {
          button.textContent = previousText || '复制';
          button.classList.remove('copied');
        }, 1200);
      } catch {
        button.textContent = '复制失败';
        window.setTimeout(() => {
          button.textContent = '复制';
        }, 1200);
      }
    };

    document.addEventListener('click', handleCopyCode);
    return () => document.removeEventListener('click', handleCopyCode);
  }, []);

  useEffect(() => {
    setEditingCategoryName(activeCategory.name);
    setEditingTitle(activePage.title);
    setEditingContent(activePage.content);
  }, [activeCategory.id, activeCategory.name, activePage.id, activePage.title, activePage.content]);

  function handleLogin(event) {
    event.preventDefault();
    if (loginInput.trim() === password) {
      setIsLoggedIn(true);
      setLoginInput('');
    }
  }

  function logoutEditor() {
    setIsLoggedIn(false);
    setIsEditing(false);
    setLoginInput('');
  }

  function cancelEditing() {
    setEditingCategoryName(activeCategory.name);
    setEditingTitle(activePage.title);
    setEditingContent(activePage.content);
    setIsEditing(false);
  }

  function updateActivePage(categoryName, title, content) {
    const safeCategoryName = categoryName.trim() || activeCategory.name;
    const safeTitle = title.trim() || '未命名笔记';
    setModules((currentModules) => {
      const nextModules = currentModules.map((module) => {
        if (module.id !== activeModuleId) return module;
        return {
          ...module,
          categories: module.categories.map((category) => {
            if (category.id !== activeCategoryId) return category;
            return {
              ...category,
              name: safeCategoryName,
              pages: category.pages.map((page) =>
                page.id === activePageId ? { ...page, title: safeTitle, content } : page,
              ),
            };
          }),
        };
      });
      localStorage.setItem(storageKey, JSON.stringify(nextModules));
      return nextModules;
    });
    setIsEditing(false);
  }

  useEffect(() => {
    const handleNativeAction = (event) => {
      const target = event.target?.closest?.('[data-editor-action]');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();

      if (target.dataset.editorAction === 'logout') {
        logoutEditor();
      }
    };

    document.addEventListener('pointerdown', handleNativeAction, true);
    document.addEventListener('click', handleNativeAction, true);
    return () => {
      document.removeEventListener('pointerdown', handleNativeAction, true);
      document.removeEventListener('click', handleNativeAction, true);
    };
  }, [editingCategoryName, editingTitle, editingContent, activeCategory, activePage]);

  function openDialog(nextDialog) {
    setDialog(nextDialog);
  }

  function closeDialog() {
    setDialog(null);
  }

  function confirmDialog(value) {
    if (!dialog) return;
    const textValue = value?.trim();

    if (dialog.type === 'create-category') {
      if (!textValue) return;
      createCategory(textValue);
    }

    if (dialog.type === 'create-page') {
      if (!textValue) return;
      createPage(dialog.categoryId, textValue);
    }

    if (dialog.type === 'delete-category') {
      removeCategory(dialog.categoryId);
    }

    if (dialog.type === 'delete-page') {
      removePage(dialog.categoryId, dialog.pageId);
    }

    closeDialog();
  }

  function addCategory() {
    openDialog({
      type: 'create-category',
      title: '新建分类',
      description: '在当前大模块下创建一个新的分类，并自动生成第一篇空白笔记。',
      inputLabel: '分类名称',
      placeholder: '例如：转录组分析',
      confirmText: '创建分类',
    });
  }

  function createCategory(name) {
    const newCategoryId = `category-${Date.now()}`;
    const newPageId = `page-${Date.now()}`;
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== activeModuleId) return module;
        return {
          ...module,
          categories: [
            ...module.categories,
            {
              id: newCategoryId,
              name,
              pages: [
                {
                  id: newPageId,
                  title: '新的详细页面',
                  content: '## 新的详细页面\n\n从这里开始写 Markdown 内容。',
                },
              ],
            },
          ],
        };
      }),
    );
    setActiveCategoryId(newCategoryId);
    setActivePageId(newPageId);
    setIsEditing(true);
  }

  function deleteCategory(categoryId) {
    const category = activeModule.categories.find((item) => item.id === categoryId);
    if (!category || activeModule.categories.length <= 1) {
      openDialog({
        type: 'notice',
        title: '无法删除',
        description: '至少需要保留一个分类。',
        confirmText: '我知道了',
      });
      return;
    }
    openDialog({
      type: 'delete-category',
      title: '删除分类',
      description: `确定删除「${category.name}」及其中所有笔记吗？这个操作会立即更新本地数据。`,
      categoryId,
      confirmText: '确认删除',
      danger: true,
    });
  }

  function removeCategory(categoryId) {
    const nextCategory = activeModule.categories.find((item) => item.id !== categoryId);
    setModules((currentModules) =>
      currentModules.map((module) =>
        module.id === activeModuleId
          ? { ...module, categories: module.categories.filter((item) => item.id !== categoryId) }
          : module,
      ),
    );
    if (activeCategoryId === categoryId && nextCategory) {
      setActiveCategoryId(nextCategory.id);
      setActivePageId(nextCategory.pages[0].id);
      setIsEditing(false);
    }
    setCollapsedCategories((current) => {
      const next = { ...current };
      delete next[categoryId];
      return next;
    });
  }

  function addPage(categoryId = activeCategoryId) {
    openDialog({
      type: 'create-page',
      title: '新建笔记',
      description: '这篇笔记会创建在当前分类下。',
      inputLabel: '笔记标题',
      placeholder: '例如：QIIME2 参数记录',
      initialValue: '新的详细页面',
      categoryId,
      confirmText: '创建笔记',
    });
  }

  function createPage(categoryId, title) {
    const newId = `page-${Date.now()}`;
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== activeModuleId) return module;
        return {
          ...module,
          categories: module.categories.map((category) => {
            if (category.id !== categoryId) return category;
            return {
              ...category,
              pages: [
                ...category.pages,
                {
                  id: newId,
                  title,
                  content: `## ${title}\n\n从这里开始写 Markdown 内容。`,
                },
              ],
            };
          }),
        };
      }),
    );
    setActiveCategoryId(categoryId);
    setActivePageId(newId);
    setIsEditing(true);
  }

  function deletePage(categoryId, pageId) {
    const category = activeModule.categories.find((item) => item.id === categoryId);
    const page = category?.pages.find((item) => item.id === pageId);
    if (!category || !page) return;
    if (category.pages.length <= 1) {
      openDialog({
        type: 'notice',
        title: '无法删除',
        description: '每个分类至少需要保留一篇笔记。',
        confirmText: '我知道了',
      });
      return;
    }
    openDialog({
      type: 'delete-page',
      title: '删除笔记',
      description: `确定删除「${page.title}」吗？`,
      categoryId,
      pageId,
      confirmText: '确认删除',
      danger: true,
    });
  }

  function removePage(categoryId, pageId) {
    const category = activeModule.categories.find((item) => item.id === categoryId);
    if (!category) return;
    const nextPage = category.pages.find((item) => item.id !== pageId);
    setModules((currentModules) =>
      currentModules.map((module) => {
        if (module.id !== activeModuleId) return module;
        return {
          ...module,
          categories: module.categories.map((item) =>
            item.id === categoryId
              ? { ...item, pages: item.pages.filter((currentPage) => currentPage.id !== pageId) }
              : item,
          ),
        };
      }),
    );
    if (activePageId === pageId && nextPage) {
      setActivePageId(nextPage.id);
      setIsEditing(false);
    }
  }

  return (
    <main>
      <PillNav
        items={navItems}
        activeHref="#top"
        baseColor="rgba(5, 12, 18, 0.66)"
        pillColor="rgba(8, 15, 22, 0.5)"
        pillTextColor="#9fb3bd"
        hoveredPillTextColor="#041018"
        initialLoadAnimation={false}
      />
      <Hero />
      <div className="lower-page">
        {enableGrainient && (
          <Suspense fallback={null}>
            <Grainient
              className="lower-grainient"
              color1="#149c96"
              color2="#3a3843"
              color3="#e3112f"
              timeSpeed={0.18}
              colorBalance={0}
              warpStrength={0.9}
              warpFrequency={4}
              warpSpeed={1.4}
              warpAmplitude={58}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={360}
              noiseScale={1.7}
              grainAmount={0.06}
              grainScale={2}
              grainAnimated={false}
              contrast={1.35}
              gamma={1}
              saturation={0.96}
              centerX={0}
              centerY={0}
              zoom={0.9}
              maxDpr={1}
              targetFps={20}
            />
          </Suspense>
        )}
        <About />
        <KnowledgeHub
          modules={modules}
          activeModuleId={activeModuleId}
          setActiveModuleId={setActiveModuleId}
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
          activePageId={activePageId}
          setActivePageId={setActivePageId}
          activeModule={activeModule}
          activeCategory={activeCategory}
          activePage={activePage}
          isLoggedIn={isLoggedIn}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          cancelEditing={cancelEditing}
          collapsedCategories={collapsedCategories}
          setCollapsedCategories={setCollapsedCategories}
          loginInput={loginInput}
          setLoginInput={setLoginInput}
          handleLogin={handleLogin}
          editingContent={editingContent}
          editingCategoryName={editingCategoryName}
          setEditingCategoryName={setEditingCategoryName}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          setEditingContent={setEditingContent}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          updateActivePage={updateActivePage}
          addCategory={addCategory}
          addPage={addPage}
          deleteCategory={deleteCategory}
          deletePage={deletePage}
        />
      </div>
      <ActionDialog dialog={dialog} onClose={closeDialog} onConfirm={confirmDialog} />
    </main>
  );
}

function Hero() {
  const videoRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData) return undefined;

    const videoLoadDelay = window.setTimeout(() => setShouldLoadVideo(true), 650);
    return () => window.clearTimeout(videoLoadDelay);
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;
    videoRef.current.load();
    videoRef.current.play?.().catch(() => {
      // Autoplay is best-effort; the background remains usable without video.
    });
  }, [shouldLoadVideo]);

  return (
    <section className="hero" id="top">
      <video
        ref={videoRef}
        className="hero-video"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        poster=""
      >
        {shouldLoadVideo && (
          <source src="/videos/abstract-dna-medical-animation.mp4" type="video/mp4" />
        )}
      </video>
      <div className="scanline" />
      <nav className="nav shell">
        <a className="brand" href="#top">
          HaoTian
        </a>
      </nav>
      <div className="hero-content shell">
        <h1 className="sr-only">Bioinformatics And Deep Learning</h1>
        <div className="hero-fuzzy-stack" aria-hidden="true">
          {['BIOINFORMATICS', 'AND DEEP LEARNING'].map((line) => (
            <FuzzyText
              className="hero-fuzzy-title"
              key={line}
              fontSize="clamp(4.2rem, 8.2vw, 9.2rem)"
              fontWeight={900}
              fontFamily="'Space Grotesk', sans-serif"
              color="#d9efff"
              baseIntensity={0.08}
              hoverIntensity={0.28}
              fuzzRange={18}
              fps={40}
              direction="horizontal"
              transitionDuration={180}
              glitchMode
              glitchInterval={2600}
              glitchDuration={160}
              letterSpacing={-4}
            >
              {line}
            </FuzzyText>
          ))}
        </div>
        <GradientText
          className="hero-gradient-subtitle"
          colors={['#d9efff', '#6df0ff', '#a8f5cf', '#f2d6a2', '#d9efff']}
          animationSpeed={5}
          direction="horizontal"
          pauseOnHover
        >
          看不见的不代表不存在!!!
        </GradientText>
        <div className="hero-actions">
          <a href="#hub" className="primary-action">
            Explore Research Notes
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="ghost-action">
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section shell about-grid" id="about">
      <div className="portrait-card">
        <div className="portrait">
          <span>ZH</span>
        </div>
        <p className="portrait-name">{profile.englishName}</p>
        <p>Graduate Researcher</p>
      </div>
      <div className="about-copy">
        <p className="section-label">Profile</p>
        <h2>把生命科学问题翻译成可计算、可复现、可解释的数据工作流。</h2>
        <p>{profile.introduction}</p>
        <div className="contact-grid">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            github.com/Zhou-Nevermore
          </a>
        </div>
      </div>
      <div className="timeline" id="timeline">
        {timeline.map((item) => (
          <article className="timeline-item" key={item.period}>
            <span>{item.period}</span>
            <h3>{item.title}</h3>
            <strong>{item.meta}</strong>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function KnowledgeHub(props) {
  const {
    modules,
    activeModuleId,
    setActiveModuleId,
    activeCategoryId,
    setActiveCategoryId,
    activePageId,
    setActivePageId,
    activeModule,
    activeCategory,
    activePage,
    isLoggedIn,
    isEditing,
    setIsEditing,
    cancelEditing,
    collapsedCategories,
    setCollapsedCategories,
    loginInput,
    setLoginInput,
    handleLogin,
    editingContent,
    editingCategoryName,
    setEditingCategoryName,
    editingTitle,
    setEditingTitle,
    setEditingContent,
    searchQuery,
    setSearchQuery,
    updateActivePage,
    addCategory,
    addPage,
    deleteCategory,
    deletePage,
  } = props;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? modules.flatMap((module) =>
        module.categories.flatMap((category) =>
          category.pages
            .filter((page) =>
              [module.title, module.eyebrow, category.name, page.title, page.content]
                .join(' ')
                .toLowerCase()
                .includes(normalizedQuery),
            )
            .map((page) => ({ module, category, page })),
        ),
      )
    : [];

  function openSearchResult(result) {
    setActiveModuleId(result.module.id);
    setActiveCategoryId(result.category.id);
    setActivePageId(result.page.id);
    setIsEditing(false);
  }

  function selectModule(module) {
    const nextCategory = module.categories[0];
    const nextPage = nextCategory.pages[0];
    setActiveModuleId(module.id);
    setActiveCategoryId(nextCategory.id);
    setActivePageId(nextPage.id);
    setIsEditing(false);
  }

  function startEditing() {
    setEditingCategoryName(activeCategory.name);
    setEditingTitle(activePage.title);
    setEditingContent(activePage.content);
    setIsEditing(true);
  }

  function toggleCategory(category) {
    const isCollapsed = collapsedCategories[category.id];
    const isActive = category.id === activeCategoryId;

    if (isActive && !isCollapsed) {
      setCollapsedCategories((current) => ({ ...current, [category.id]: true }));
      return;
    }

    setActiveCategoryId(category.id);
    setActivePageId(category.pages[0].id);
    setIsEditing(false);
    setCollapsedCategories((current) => ({ ...current, [category.id]: false }));
  }

  return (
    <section className="section shell hub" id="hub">
      <div className="module-tabs">
        {modules.map((module) => (
          <button
            className={module.id === activeModuleId ? 'active' : ''}
            key={module.id}
            onClick={() => selectModule(module)}
          >
            <span>{module.eyebrow}</span>
            <strong>{module.title}</strong>
          </button>
        ))}
      </div>
      <div className="hub-search">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="搜索三个模块中的标题、分类或 Markdown 内容"
          type="search"
        />
        {normalizedQuery && (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  key={`${result.module.id}-${result.category.id}-${result.page.id}`}
                  onClick={() => openSearchResult(result)}
                >
                  <span>{result.module.title} / {result.category.name}</span>
                  {result.page.title}
                </button>
              ))
            ) : (
              <p>没有找到匹配内容。</p>
            )}
          </div>
        )}
      </div>
      <div className="hub-panel">
        <aside className="sidebar">
          <h3>{activeModule.title}</h3>
          <p>{activeModule.description}</p>
          {isLoggedIn && (
            <button className="add-page add-category" onClick={addCategory}>
              + 新建分类
            </button>
          )}
          {activeModule.categories.map((category) => (
            <div className="category" key={category.id}>
              <div className="category-row">
                <button
                  className={category.id === activeCategoryId ? 'category-title active' : 'category-title'}
                  onClick={() => toggleCategory(category)}
                >
                  <span>{category.name}</span>
                  <strong>{collapsedCategories[category.id] ? '+' : '-'}</strong>
                </button>
                {isLoggedIn && (
                  <button
                    className="delete-mini"
                    onClick={() => deleteCategory(category.id)}
                    aria-label={`删除分类 ${category.name}`}
                  >
                    删除
                  </button>
                )}
              </div>
              {category.id === activeCategoryId && !collapsedCategories[category.id] && (
                <div className="page-list">
                  {category.pages.map((page) => (
                    <div className="page-row" key={page.id}>
                      <button
                        className={page.id === activePageId ? 'active' : ''}
                        onClick={() => {
                          setActivePageId(page.id);
                          setIsEditing(false);
                        }}
                      >
                        {page.title}
                      </button>
                      {isLoggedIn && (
                        <button
                          className="delete-mini"
                          onClick={() => deletePage(category.id, page.id)}
                          aria-label={`删除笔记 ${page.title}`}
                        >
                          删除
                        </button>
                      )}
                    </div>
                  ))}
                  {isLoggedIn && (
                    <button className="inline-add-page" onClick={() => addPage(category.id)}>
                      + 在此分类下新建笔记
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </aside>
        <article className="reader">
          <div className="reader-top">
            <div>
              <span>{activeCategory.name}</span>
              <h3>{activePage.title}</h3>
            </div>
            <LoginBox
              isLoggedIn={isLoggedIn}
              isEditing={isEditing}
              onLogout={() => {
                logoutEditor();
              }}
              loginInput={loginInput}
              setLoginInput={setLoginInput}
              handleLogin={handleLogin}
            />
          </div>
          {isLoggedIn && isEditing ? (
            <form
              className="notion-editor"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                updateActivePage(
                  String(formData.get('categoryName') || editingCategoryName),
                  String(formData.get('noteTitle') || editingTitle),
                  String(formData.get('noteContent') || editingContent),
                );
              }}
            >
              <MarkdownEditor
                categoryName={editingCategoryName}
                title={editingTitle}
                content={editingContent}
                onCategoryNameChange={setEditingCategoryName}
                onTitleChange={setEditingTitle}
                onContentChange={setEditingContent}
              />
              <div className="editor-actions">
                <button
                  className="save-button"
                  type="submit"
                >
                  保存并返回阅读
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={cancelEditing}
                >
                  取消修改
                </button>
              </div>
            </form>
          ) : (
            <>
              {isLoggedIn && (
                <button className="save-button edit-entry" onClick={startEditing}>
                  编辑当前笔记
                </button>
              )}
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activePage.content) }}
              />
            </>
          )}
        </article>
      </div>
    </section>
  );
}

function MarkdownEditor({ categoryName, title, content, onCategoryNameChange, onTitleChange, onContentChange }) {
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const [imageRevision, setImageRevision] = useState(0);

  function insertAtSelection(text, nextCursorOffset = text.length) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.focus();
    if (document.queryCommandSupported?.('insertText')) {
      document.execCommand('insertText', false, text);
      textarea.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const source = textarea.value;
    const nextContent = `${source.slice(0, start)}${text}${source.slice(end)}`;
    onContentChange(nextContent);
    window.requestAnimationFrame(() => {
      textarea.selectionStart = start + nextCursorOffset;
      textarea.selectionEnd = start + nextCursorOffset;
      textarea.focus();
    });
  }

  function createImageToken(file) {
    const id = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const alt = file.name?.replace(/\.[^.]+$/, '') || 'pasted-image';
    return {
      id,
      markdown: `\n![${alt}|width=640](local-image:${id})\n`,
    };
  }

  function saveImageFile(file, id) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      saveStoredImage(id, reader.result);
      onContentChange(textareaRef.current?.value || content);
      setImageRevision((current) => current + 1);
    });
    reader.readAsDataURL(file);
  }

  function insertImageFromFile(file) {
    if (!file) return;
    const image = createImageToken(file);
    insertAtSelection(image.markdown, image.markdown.length);
    saveImageFile(file, image.id);
  }

  function handleMarkdownPaste(event) {
    const files = Array.from(event.clipboardData?.files || []).filter((file) =>
      file.type.startsWith('image/'),
    );

    if (!files.length) return;

    event.preventDefault();
    const images = files.map(createImageToken);
    const imageMarkdown = images.map((image) => image.markdown).join('\n');
    insertAtSelection(imageMarkdown, imageMarkdown.length);
    files.forEach((file, index) => saveImageFile(file, images[index].id));
  }

  function handleMarkdownKeyDown(event) {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeCursor = content.slice(0, start);
    const currentLineStart = beforeCursor.lastIndexOf('\n') + 1;
    const beforeCurrentLine = content.slice(0, currentLineStart);
    const currentLine = content.slice(currentLineStart, start);
    const afterCursor = content.slice(end);
    const restOfLine = afterCursor.split('\n')[0];
    const nextNonEmptyLine = afterCursor
      .split('\n')
      .slice(1)
      .find((line) => line.trim() !== '');
    const isFenceLine = /^```[\w-]*$/.test(currentLine.trim());
    const isInsideCodeBlock =
      (beforeCurrentLine.match(/^```/gm) || []).length % 2 === 1;
    const hasClosingFenceAhead = nextNonEmptyLine?.trim() === '```';

    if (
      event.key === 'Enter' &&
      start === end &&
      isFenceLine &&
      restOfLine.trim() === '' &&
      !isInsideCodeBlock &&
      !hasClosingFenceAhead
    ) {
      event.preventDefault();
      insertAtSelection('\n\n```', 1);
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      insertAtSelection('  ');
    }
  }

  return (
    <div className="markdown-editor-panel">
      <div className="markdown-editor-toolbar">
        <span>Markdown Editor</span>
        <div className="markdown-editor-tools">
          <strong>支持 Ctrl+V 粘贴图片，修改 width 数字控制大小</strong>
          <input
            ref={imageInputRef}
            className="hidden-file-input"
            type="file"
            accept="image/*"
            onChange={(event) => {
              insertImageFromFile(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <button
            className="insert-image-button"
            type="button"
            onClick={() => imageInputRef.current?.click()}
          >
            插入图片
          </button>
        </div>
      </div>
      <label className="editor-field-label">
        分类标题
        <input
          name="categoryName"
          className="category-name-input"
          value={categoryName}
          onChange={(event) => onCategoryNameChange(event.target.value)}
          placeholder="输入分类标题"
        />
      </label>
      <label className="editor-field-label">
        文章标题
      </label>
      <input
        name="noteTitle"
        className="note-title-input"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="输入文章标题"
      />
      <textarea
        name="noteContent"
        ref={textareaRef}
        className="markdown-source-editor"
        value={content}
        onChange={(event) => onContentChange(event.target.value)}
        onKeyDown={handleMarkdownKeyDown}
        onPaste={handleMarkdownPaste}
        placeholder="从这里开始写 Markdown 内容。"
      />
      <div className="markdown-live-preview">
        <div className="markdown-live-preview-title">
          <span>Live Preview</span>
          <strong>实时渲染 Markdown</strong>
        </div>
        <div
          key={`${content.length}-${imageRevision}`}
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '预览会显示在这里。') }}
        />
      </div>
    </div>
  );
}

function LoginBox({ isLoggedIn, isEditing, onLogout, loginInput, setLoginInput, handleLogin }) {
  function handleLogout(event) {
    event.preventDefault();
    event.stopPropagation();
    onLogout();
  }

  if (isLoggedIn) {
    return (
      <div className="login-state-actions" onClick={(event) => event.stopPropagation()}>
        <span className="login-status">{isEditing ? 'Editing mode' : 'Editing enabled'}</span>
        <button
          className="logout-pill"
          type="button"
          data-editor-action="logout"
          onPointerDownCapture={handleLogout}
          onMouseDownCapture={handleLogout}
          onClick={handleLogout}
        >
          退出登录
        </button>
      </div>
    );
  }

  return (
    <form className="login-box" onSubmit={handleLogin}>
      <input
        value={loginInput}
        onChange={(event) => setLoginInput(event.target.value)}
        placeholder="输入编辑密码"
        type="password"
      />
      <button type="submit">登录编辑</button>
    </form>
  );
}

function ActionDialog({ dialog, onClose, onConfirm }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(dialog?.initialValue || '');
  }, [dialog]);

  if (!dialog) return null;

  const needsInput = dialog.type === 'create-category' || dialog.type === 'create-page';
  const isNotice = dialog.type === 'notice';

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className={`action-dialog${dialog.danger ? ' danger' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="section-label">Notebook Control</p>
        <h3 id="action-dialog-title">{dialog.title}</h3>
        <p>{dialog.description}</p>
        {needsInput && (
          <label className="dialog-field">
            <span>{dialog.inputLabel}</span>
            <input
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onConfirm(value);
              }}
              placeholder={dialog.placeholder}
            />
          </label>
        )}
        <div className="dialog-actions">
          <button
            className={dialog.danger ? 'danger-button' : 'save-button'}
            onClick={() => onConfirm(value)}
          >
            {dialog.confirmText || '确认'}
          </button>
          {!isNotice && (
            <button className="ghost-button" onClick={onClose}>
              取消
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');

const renderBootError = (error) => {
  if (!rootElement) return;
  const message = error?.stack || error?.message || String(error);
  rootElement.innerHTML = `
    <pre style="
      min-height: 100vh;
      margin: 0;
      padding: 32px;
      color: #d9fbff;
      background: #020607;
      white-space: pre-wrap;
      font: 14px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace;
    ">${message.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    })[char])}</pre>
  `;
};

window.addEventListener('error', (event) => renderBootError(event.error || event.message));
window.addEventListener('unhandledrejection', (event) => renderBootError(event.reason));

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  renderBootError(error);
}
