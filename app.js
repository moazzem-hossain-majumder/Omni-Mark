/**
 * OmniMark — Pro Markdown Studio & Live Reader
 * High-performance, reactive dual-pane reader engine.
 */

(function () {
  'use strict';

  // --- Theme Name Mapping ---
  const THEME_NAMES = {
    'obsidian': 'Obsidian Dark',
    'deep-navy': 'Deep Navy',
    'warm-espresso': 'Warm Espresso',
    'ivory-parchment': 'Ivory Parchment',
    'pure-light': 'Pure Light'
  };

  // --- DOM Elements ---
  const markdownInput = document.getElementById('markdown-input');
  const markdownOutput = document.getElementById('markdown-output');
  const lineNumbers = document.getElementById('line-numbers');
  const workspace = document.getElementById('workspace');
  const editorPane = document.getElementById('editor-pane');
  const readerPane = document.getElementById('reader-pane');
  const readerBody = document.getElementById('reader-body');
  const gutter = document.getElementById('gutter');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const fileNameBadge = document.getElementById('file-name-badge');
  const readerThemePill = document.getElementById('reader-theme-pill');
  const themeSelector = document.getElementById('theme-selector');
  const hljsTheme = document.getElementById('hljs-theme');
  const syncScrollBtn = document.getElementById('sync-scroll-btn');
  const toggleTocBtn = document.getElementById('toggle-toc-btn');
  const closeTocBtn = document.getElementById('close-toc-btn');
  const tocDrawer = document.getElementById('toc-drawer');
  const tocList = document.getElementById('toc-list');
  const loadSampleBtn = document.getElementById('load-sample-btn');
  const clearBtn = document.getElementById('clear-btn');
  const copyMarkdownBtn = document.getElementById('copy-markdown-btn');
  const exportHtmlBtn = document.getElementById('export-html-btn');
  const uploadTriggerBtn = document.getElementById('upload-trigger-btn');
  const toastContainer = document.getElementById('toast-container');
  const readerSearchInput = document.getElementById('reader-search-input');
  const zenReaderBtn = document.getElementById('zen-reader-btn');

  // View Mode Tabs
  const modeSplitBtn = document.getElementById('mode-split-btn');
  const modeEditorBtn = document.getElementById('mode-editor-btn');
  const modeReaderBtn = document.getElementById('mode-reader-btn');

  // Stats Elements
  const statWords = document.getElementById('stat-words');
  const statChars = document.getElementById('stat-chars');
  const statLines = document.getElementById('stat-lines');
  const statReadTime = document.getElementById('stat-read-time');
  const statHeadings = document.getElementById('stat-headings');

  // --- State Variables ---
  let isSyncScrollEnabled = true;
  let isDraggingGutter = false;
  let isSyncingScroll = false;
  let renderDebounceTimer = null;
  let mermaidInitialized = false;

  const VALID_THEMES = ['obsidian', 'deep-navy', 'warm-espresso', 'ivory-parchment', 'pure-light'];
  const rawStoredTheme = localStorage.getItem('omnimark_theme') || 'obsidian';
  let activeTheme = VALID_THEMES.includes(rawStoredTheme) ? rawStoredTheme : 'obsidian';

  // --- SVGs for Callout Alerts ---
  const ALERT_ICONS = {
    NOTE: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75zM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`,
    TIP: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.918.208.371.379.84.379 1.525h3.5c0-.685.171-1.154.379-1.525.203-.362.45-.654.673-.918l.214-.253c.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75zM6.5 12h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5zm1 2.5h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1 0-1.5z"/></svg>`,
    IMPORTANT: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM7.25 4a.75.75 0 0 1 1.5 0v5a.75.75 0 0 1-1.5 0V4zm.75 7.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`,
    WARNING: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047zM8 4a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 4zm0 7.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`,
    CAUTION: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.47.22A.75.75 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 0 1-.22.53l-4.25 4.25A.75.75 0 0 1 11 16H5a.75.75 0 0 1-.53-.22L.22 11.53A.75.75 0 0 1 0 11V5c0-.199.079-.389.22-.53L4.47.22zm.843 1.28L1.5 5.313v5.374l3.813 3.813h5.374l3.813-3.813V5.313L10.687 1.5H5.313zM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4zm0 7.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>`
  };

  // --- Utility Functions ---
  function escapeHtml(string) {
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--accent); font-weight: bold;">${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // --- Configure Marked Renderer with Code Block Cards & GFM ---
  const renderer = new marked.Renderer();

  // Custom Heading with Anchor Links
  renderer.heading = function (text, level, raw) {
    const id = slugify(raw);
    return `
      <h${level} id="${id}">
        ${text}
        <a class="anchor-link" href="#${id}" title="Direct link to heading" aria-hidden="true">#</a>
      </h${level}>
    `;
  };

  // Custom Table with Wrapper for horizontal scroll
  renderer.table = function (header, body) {
    return `
      <div class="table-wrapper">
        <table>
          <thead>${header}</thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  };

  // Custom Code Block (Studio Card Design)
  renderer.code = function (code, lang) {
    const language = (lang || '').trim().toLowerCase();

    // Handle Mermaid block
    if (language === 'mermaid') {
      return `<div class="mermaid-container"><div class="mermaid">${escapeHtml(code)}</div></div>`;
    }

    // Handle Math / LaTeX block
    if (language === 'math' || language === 'latex') {
      try {
        if (window.katex) {
          const renderedMath = window.katex.renderToString(code, { displayMode: true, throwOnError: false });
          return `<div class="katex-display">${renderedMath}</div>`;
        }
      } catch (err) {
        console.warn('KaTeX render error:', err);
      }
    }

    // Syntax highlight with Highlight.js
    let highlightedCode = '';
    let validLang = language || 'text';

    if (window.hljs && language && window.hljs.getLanguage(language)) {
      try {
        highlightedCode = window.hljs.highlight(code, { language }).value;
      } catch (e) {
        highlightedCode = escapeHtml(code);
      }
    } else if (window.hljs) {
      try {
        const auto = window.hljs.highlightAuto(code);
        highlightedCode = auto.value;
        if (auto.language) validLang = auto.language;
      } catch (e) {
        highlightedCode = escapeHtml(code);
      }
    } else {
      highlightedCode = escapeHtml(code);
    }

    const displayLang = validLang.toUpperCase();

    return `
      <div class="code-card">
        <div class="code-card-header">
          <span class="code-language-tag">${displayLang}</span>
          <button class="code-copy-btn" data-code="${encodeURIComponent(code)}" title="Copy code">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre><code class="hljs language-${validLang}">${highlightedCode}</code></pre>
      </div>
    `;
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
    pedantic: false
  });

  // --- KaTeX Pre/Post Processing to Preserve Formulas ---
  function preprocessMath(text) {
    const mathMap = [];
    let counter = 0;

    // Block math: $$ ... $$
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, equation) => {
      const placeholder = `<!--KATEX_BLOCK_${counter}-->`;
      mathMap.push({ placeholder, equation, display: true });
      counter++;
      return placeholder;
    });

    // Inline math: $ ... $ (excluding escaped \$)
    text = text.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, (match, equation) => {
      const placeholder = `<!--KATEX_INLINE_${counter}-->`;
      mathMap.push({ placeholder, equation, display: false });
      counter++;
      return placeholder;
    });

    return { text, mathMap };
  }

  function restoreMath(html, mathMap) {
    if (!window.katex || !mathMap.length) return html;

    mathMap.forEach(item => {
      try {
        const rendered = window.katex.renderToString(item.equation, {
          displayMode: item.display,
          throwOnError: false
        });
        const wrapped = item.display ? `<div class="katex-display">${rendered}</div>` : rendered;
        html = html.replace(item.placeholder, wrapped);
      } catch (err) {
        html = html.replace(item.placeholder, `<code>${escapeHtml(item.equation)}</code>`);
      }
    });

    return html;
  }

  // --- Transform Blockquotes to Callout Alert Blocks ---
  function transformCalloutAlerts(container) {
    const blockquotes = container.querySelectorAll('blockquote');

    blockquotes.forEach(bq => {
      const firstP = bq.querySelector('p');
      if (!firstP) return;

      const text = firstP.innerHTML.trim();
      // Match [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
      const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](\s*<br\s*\/?>|\n|\s+)?([\s\S]*)$/i);

      if (match) {
        const alertType = match[1].toUpperCase();
        const remainingText = match[3] || '';

        const alertDiv = document.createElement('div');
        alertDiv.className = `markdown-alert markdown-alert-${alertType.toLowerCase()}`;

        const alertTitle = document.createElement('div');
        alertTitle.className = 'markdown-alert-title';
        alertTitle.innerHTML = `${ALERT_ICONS[alertType] || ''} <span>${alertType.charAt(0) + alertType.slice(1).toLowerCase()}</span>`;

        const alertContent = document.createElement('div');
        alertContent.className = 'markdown-alert-content';

        // Update first paragraph content
        if (remainingText.trim()) {
          firstP.innerHTML = remainingText;
        } else {
          firstP.remove();
        }

        // Move all remaining children of blockquote into alertContent
        while (bq.firstChild) {
          alertContent.appendChild(bq.firstChild);
        }

        alertDiv.appendChild(alertTitle);
        alertDiv.appendChild(alertContent);

        bq.parentNode.replaceChild(alertDiv, bq);
      }
    });
  }

  // --- Attach Copy Listeners to Code Blocks ---
  function setupCodeBlockCopyListeners(container) {
    const copyButtons = container.querySelectorAll('.code-copy-btn');
    copyButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const code = decodeURIComponent(btn.getAttribute('data-code') || '');
        try {
          await navigator.clipboard.writeText(code);
          btn.classList.add('copied');
          btn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              <span>Copy</span>
            `;
          }, 2000);
        } catch (err) {
          showToast('Failed to copy to clipboard', '✕');
        }
      });
    });
  }

  // --- Build Dynamic Table of Contents ---
  function updateTableOfContents(container) {
    tocList.innerHTML = '';
    const headings = container.querySelectorAll('h1, h2, h3, h4');
    statHeadings.textContent = `${headings.length} Heading${headings.length === 1 ? '' : 's'}`;

    if (!headings.length) {
      tocList.innerHTML = '<li style="padding: 16px; color: var(--text-muted); font-size: 12px;">No headings detected in this document.</li>';
      return;
    }

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}-${slugify(heading.textContent)}`;
      }

      const level = parseInt(heading.tagName.substring(1), 10);
      const li = document.createElement('li');
      li.className = `toc-item level-${level}`;

      const a = document.createElement('a');
      a.className = 'toc-link';
      a.href = `#${heading.id}`;
      // Strip anchor # symbol from heading text
      a.textContent = heading.innerText.replace(/#$/, '').trim();

      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Set active link
        tocList.querySelectorAll('.toc-link').forEach(link => link.classList.remove('active'));
        a.classList.add('active');
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  // --- Compute Document Telemetry (Words, Chars, Lines, Read Time) ---
  function updateTelemetry(text) {
    const chars = text.length;
    const words = text.trim() ? (text.trim().match(/\S+/g) || []).length : 0;
    const lines = text.split('\n').length;
    const readTimeMinutes = Math.max(0.5, Math.ceil(words / 200));

    statWords.textContent = `${words.toLocaleString()} word${words === 1 ? '' : 's'}`;
    statChars.textContent = `${chars.toLocaleString()} char${chars === 1 ? '' : 's'}`;
    statLines.textContent = `${lines.toLocaleString()} line${lines === 1 ? '' : 's'}`;
    statReadTime.textContent = words > 0 ? `~${readTimeMinutes} min read` : '0 min read';

    // Update Line Numbers in Editor Gutter
    let lineNumbersHtml = '';
    for (let i = 1; i <= lines; i++) {
      lineNumbersHtml += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersHtml;
  }

  // --- Initialize Mermaid Config based on current Theme ---
  function configureMermaid() {
    if (!window.mermaid) return;
    const isDark = activeTheme.includes('dark');
    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, -apple-system, sans-serif'
    });
    mermaidInitialized = true;
  }

  // --- Core Render Pipeline ---
  function renderMarkdown() {
    const rawMarkdown = markdownInput.value;

    // 1. Telemetry
    updateTelemetry(rawMarkdown);

    // 2. Preprocess Math (protect LaTeX from markdown parsers)
    const { text: preprocessedText, mathMap } = preprocessMath(rawMarkdown);

    // 3. Marked Parse
    let html = marked.parse(preprocessedText);

    // 4. Restore KaTeX Math formulas
    html = restoreMath(html, mathMap);

    // 5. Sanitize HTML with DOMPurify
    if (window.DOMPurify) {
      html = DOMPurify.sanitize(html, {
        ADD_TAGS: ['svg', 'path', 'rect', 'circle', 'line', 'polyline', 'details', 'summary', 'kbd'],
        ADD_ATTR: ['target', 'id', 'class', 'style', 'data-code', 'xmlns', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'd', 'open']
      });
    }

    // 6. Inject into Reader Output
    markdownOutput.innerHTML = html;

    // 7. Postprocess Callout Alerts
    transformCalloutAlerts(markdownOutput);

    // 8. Attach Code Block Copy Handlers
    setupCodeBlockCopyListeners(markdownOutput);

    // 9. Update Table of Contents
    updateTableOfContents(markdownOutput);

    // 10. Render Mermaid Diagrams
    if (window.mermaid) {
      try {
        const mermaidElements = markdownOutput.querySelectorAll('.mermaid');
        if (mermaidElements.length > 0) {
          window.mermaid.run({
            nodes: mermaidElements
          });
        }
      } catch (err) {
        console.warn('Mermaid rendering issue:', err);
      }
    }
  }

  // Debounced input handler for 60fps responsiveness
  function queueRender() {
    if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(renderMarkdown, 120);
  }

  // --- File Reader & Drag-and-Drop ---
  function loadFileContent(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      markdownInput.value = content;
      fileNameBadge.textContent = file.name;
      renderMarkdown();
      showToast(`Loaded ${file.name}`);
    };
    reader.readAsText(file);
  }

  // --- Setup Drag and Drop onto Editor ---
  function setupDragAndDrop() {
    ['dragenter', 'dragover'].forEach(eventName => {
      editorPane.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('active');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      editorPane.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'drop') {
          dropzone.classList.remove('active');
          const dt = e.dataTransfer;
          const files = dt.files;
          if (files.length > 0) {
            loadFileContent(files[0]);
          }
        } else if (e.target === dropzone || !editorPane.contains(e.relatedTarget)) {
          dropzone.classList.remove('active');
        }
      });
    });

    // File input trigger button
    uploadTriggerBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        loadFileContent(fileInput.files[0]);
      }
    });
  }

  // --- Resizable Gutter / Splitter Logic ---
  function setupSplitter() {
    gutter.addEventListener('mousedown', (e) => {
      isDraggingGutter = true;
      gutter.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDraggingGutter) return;
      const workspaceRect = workspace.getBoundingClientRect();
      const relativeX = e.clientX - workspaceRect.left;
      const percentage = (relativeX / workspaceRect.width) * 100;

      // Constrain between 20% and 80%
      if (percentage >= 20 && percentage <= 80) {
        editorPane.style.width = `${percentage}%`;
        editorPane.style.flex = `0 0 ${percentage}%`;
        readerPane.style.width = `${100 - percentage}%`;
        readerPane.style.flex = `0 0 ${100 - percentage}%`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDraggingGutter) {
        isDraggingGutter = false;
        gutter.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  // --- Synchronized Scrolling ---
  function setupSynchronizedScroll() {
    markdownInput.addEventListener('scroll', () => {
      // Sync line numbers column
      lineNumbers.scrollTop = markdownInput.scrollTop;

      if (!isSyncScrollEnabled || isSyncingScroll) return;
      isSyncingScroll = true;

      const editorScrollable = markdownInput.scrollHeight - markdownInput.clientHeight;
      if (editorScrollable > 0) {
        const scrollFraction = markdownInput.scrollTop / editorScrollable;
        const readerScrollable = readerBody.scrollHeight - readerBody.clientHeight;
        readerBody.scrollTop = scrollFraction * readerScrollable;
      }

      setTimeout(() => { isSyncingScroll = false; }, 50);
    });

    readerBody.addEventListener('scroll', () => {
      if (!isSyncScrollEnabled || isSyncingScroll) return;
      isSyncingScroll = true;

      const readerScrollable = readerBody.scrollHeight - readerBody.clientHeight;
      if (readerScrollable > 0) {
        const scrollFraction = readerBody.scrollTop / readerScrollable;
        const editorScrollable = markdownInput.scrollHeight - markdownInput.clientHeight;
        markdownInput.scrollTop = scrollFraction * editorScrollable;
        lineNumbers.scrollTop = markdownInput.scrollTop;
      }

      setTimeout(() => { isSyncingScroll = false; }, 50);
    });

    syncScrollBtn.addEventListener('click', () => {
      isSyncScrollEnabled = !isSyncScrollEnabled;
      syncScrollBtn.classList.toggle('active', isSyncScrollEnabled);
      syncScrollBtn.setAttribute('data-tooltip', `Synchronized Scroll: ${isSyncScrollEnabled ? 'ON' : 'OFF'}`);
      showToast(`Scroll sync ${isSyncScrollEnabled ? 'enabled' : 'disabled'}`);
    });
  }

  // --- Markdown Formatting Helpers (Toolbar + Shortcuts) ---
  function insertFormat(prefix, suffix = '', placeholder = '') {
    const start = markdownInput.selectionStart;
    const end = markdownInput.selectionEnd;
    const text = markdownInput.value;
    const selected = text.substring(start, end) || placeholder;

    const replacement = prefix + selected + suffix;
    markdownInput.value = text.substring(0, start) + replacement + text.substring(end);
    markdownInput.focus();
    markdownInput.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    queueRender();
  }

  function setupFormattingToolbar() {
    document.getElementById('fmt-bold').addEventListener('click', () => insertFormat('**', '**', 'bold text'));
    document.getElementById('fmt-italic').addEventListener('click', () => insertFormat('*', '*', 'italic text'));
    document.getElementById('fmt-strike').addEventListener('click', () => insertFormat('~~', '~~', 'strikethrough'));
    document.getElementById('fmt-h1').addEventListener('click', () => insertFormat('# ', '', 'Heading 1'));
    document.getElementById('fmt-h2').addEventListener('click', () => insertFormat('## ', '', 'Heading 2'));
    document.getElementById('fmt-h3').addEventListener('click', () => insertFormat('### ', '', 'Heading 3'));
    document.getElementById('fmt-quote').addEventListener('click', () => insertFormat('> ', '', 'Quote text'));
    document.getElementById('fmt-code').addEventListener('click', () => insertFormat('`', '`', 'code'));
    document.getElementById('fmt-codeblock').addEventListener('click', () => insertFormat('```javascript\n', '\n```', '// Your code here'));
    document.getElementById('fmt-link').addEventListener('click', () => insertFormat('[', '](https://example.com)', 'Link text'));
    document.getElementById('fmt-table').addEventListener('click', () => {
      const tableTpl = `\n| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| Item A | Value 1 | $10.00 |\n| Item B | Value 2 | $25.00 |\n`;
      insertFormat('', '', tableTpl);
    });
    document.getElementById('fmt-task').addEventListener('click', () => insertFormat('- [ ] ', '', 'Task item'));
    document.getElementById('fmt-alert').addEventListener('click', () => {
      const alertTpl = `> [!NOTE]\n> Write your alert details here.\n`;
      insertFormat('', '', alertTpl);
    });

    // Keyboard Shortcuts: Ctrl+B, Ctrl+I, Ctrl+K, Tab support
    markdownInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b' || e.key === 'B') {
          e.preventDefault();
          insertFormat('**', '**', 'bold text');
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          insertFormat('*', '*', 'italic text');
        } else if (e.key === 'k' || e.key === 'K') {
          e.preventDefault();
          insertFormat('[', '](url)', 'link');
        }
      } else if (e.key === 'Tab') {
        // Tab indentation
        e.preventDefault();
        const start = markdownInput.selectionStart;
        const end = markdownInput.selectionEnd;
        markdownInput.value = markdownInput.value.substring(0, start) + '  ' + markdownInput.value.substring(end);
        markdownInput.selectionStart = markdownInput.selectionEnd = start + 2;
        queueRender();
      }
    });
  }

  // --- Theme Management ---
  function applyTheme(themeName) {
    if (!THEME_NAMES[themeName]) {
      themeName = 'obsidian';
    }
    activeTheme = themeName;
    document.body.setAttribute('data-theme', themeName);
    themeSelector.value = themeName;
    localStorage.setItem('omnimark_theme', themeName);

    // Update reader theme pill
    readerThemePill.textContent = THEME_NAMES[themeName] || 'Obsidian Dark';

    // Switch Highlight.js Theme CSS
    const isDark = themeName === 'obsidian' || themeName === 'deep-navy' || themeName === 'warm-espresso';
    hljsTheme.href = isDark
      ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css'
      : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-light.min.css';

    // Re-configure mermaid for dark/light contrast
    configureMermaid();
    renderMarkdown();
  }

  function setupThemeSelector() {
    themeSelector.addEventListener('change', (e) => {
      applyTheme(e.target.value);
      showToast(`Theme: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // --- View Mode Tabs (Split, Editor Only, Reader Only) ---
  function setupViewModes() {
    const tabs = [
      { btn: modeSplitBtn, className: '' },
      { btn: modeEditorBtn, className: 'mode-editor-only' },
      { btn: modeReaderBtn, className: 'mode-reader-only' }
    ];

    tabs.forEach(({ btn, className }) => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => t.btn.classList.remove('active'));
        btn.classList.add('active');

        workspace.className = 'workspace-wrapper ' + className;
      });
    });

    zenReaderBtn.addEventListener('click', () => {
      const isZen = workspace.classList.contains('mode-reader-only');
      if (isZen) {
        modeSplitBtn.click();
      } else {
        modeReaderBtn.click();
      }
    });
  }

  // --- Table of Contents Drawer Toggle ---
  function setupTocDrawer() {
    toggleTocBtn.addEventListener('click', () => {
      tocDrawer.classList.toggle('open');
      toggleTocBtn.classList.toggle('active', tocDrawer.classList.contains('open'));
    });

    closeTocBtn.addEventListener('click', () => {
      tocDrawer.classList.remove('open');
      toggleTocBtn.classList.remove('active');
    });
  }

  // --- Reader Search in Document ---
  function setupSearch() {
    readerSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        // Clear highlights
        const marks = markdownOutput.querySelectorAll('mark.search-highlight');
        marks.forEach(m => m.outerHTML = m.innerHTML);
        return;
      }

      // Simple first-match scroll
      const walker = document.createTreeWalker(markdownOutput, NodeFilter.SHOW_TEXT);
      let foundNode = null;

      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.nodeValue.toLowerCase().includes(query)) {
          foundNode = node;
          break;
        }
      }

      if (foundNode && foundNode.parentElement) {
        foundNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // --- Action Buttons: Sample, Clear, Copy, Export ---
  function setupActionButtons() {
    // Load Sample Markdown
    loadSampleBtn.addEventListener('click', async () => {
      try {
        const resp = await fetch('sample.md');
        if (resp.ok) {
          const sampleText = await resp.text();
          markdownInput.value = sampleText;
          fileNameBadge.textContent = 'sample.md';
          renderMarkdown();
          showToast('Sample document loaded');
          return;
        }
      } catch (e) {
        // Fallback default
      }
      showToast('Loaded sample', '✓');
    });

    // Clear
    clearBtn.addEventListener('click', () => {
      if (markdownInput.value && !confirm('Are you sure you want to clear the editor?')) return;
      markdownInput.value = '';
      fileNameBadge.textContent = 'untitled.md';
      renderMarkdown();
      showToast('Editor cleared', '✓');
    });

    // Copy Raw Markdown
    copyMarkdownBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(markdownInput.value);
        showToast('Markdown copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy', '✕');
      }
    });

    // Export Options
    exportHtmlBtn.addEventListener('click', () => {
      const choice = confirm("Click OK to Download HTML Document, or Cancel to Print / Save as PDF.");
      if (choice) {
        // Download standalone HTML
        const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(fileNameBadge.textContent)} - OmniMark Export</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      max-width: 900px;
      margin: 40px auto;
      padding: 0 20px;
      line-height: 1.6;
      background: #0d1117;
      color: #e6edf3;
    }
  </style>
</head>
<body>
  ${markdownOutput.innerHTML}
</body>
</html>`;
        const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${fileNameBadge.textContent.replace(/\.[^/.]+$/, "")}.html`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToast('HTML file exported!');
      } else {
        window.print();
      }
    });
  }

  // --- Initial Bootstrapping ---
  async function init() {
    setupSplitter();
    setupDragAndDrop();
    setupSynchronizedScroll();
    setupFormattingToolbar();
    setupThemeSelector();
    setupViewModes();
    setupTocDrawer();
    setupSearch();
    setupActionButtons();

    // Editor live input event
    markdownInput.addEventListener('input', queueRender);

    // Apply saved or default theme
    applyTheme(activeTheme);

    // Load initial sample.md content
    try {
      const resp = await fetch('sample.md');
      if (resp.ok) {
        const text = await resp.text();
        markdownInput.value = text;
        fileNameBadge.textContent = 'sample.md';
      }
    } catch (e) {
      console.warn('Initial fetch error:', e);
    }

    renderMarkdown();
  }

  // Start app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
