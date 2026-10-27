# OmniMark — Modern Markdown Reader & Studio 🚀

> **A high-fidelity, client-side Markdown reader and live editor engineered for modern technical documents, diagrams, and code.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-omni--mark--zorox.vercel.app-38bdf8?style=for-the-badge&logo=vercel)](https://omni-mark-zorox.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

🔗 **Try it live right now:** **[https://omni-mark-zorox.vercel.app/](https://omni-mark-zorox.vercel.app/)**

---

## 🎯 The Problem We Solve

Most online Markdown readers were built a decade ago and haven't kept pace with modern developer and researcher workflows. If you've used standard online Markdown viewers, you've likely hit these frustrating roadblocks:

| The Problem with Conventional Readers | How OmniMark Solves It |
| :--- | :--- |
| ❌ **Broken Alert Callouts**: Modern documentation uses `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`. Traditional readers render these as plain, ugly quotes with raw bracketed text. | ✅ **Native Callout Alert Cards**: Renders pixel-perfect alert callouts (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) with dedicated icons, tinted accents, and colored left borders. |
| ❌ **Unrendered Diagrams**: Pasting `mermaid` flowcharts or sequence diagrams results in a raw text block instead of a visual chart. | ✅ **Real-Time Mermaid SVG Engine**: Dynamically compiles mermaid code blocks into sharp, interactive vector SVG flowcharts directly in the preview. |
| ❌ **Mangling Mathematical Formulas**: LaTeX equations (`$E=mc^2$` or `$$\int f(x)dx$$`) either don't render or get scrambled by aggressive markdown parsers. | ✅ **KaTeX Math Engine**: Protects mathematical notation from AST mangling and renders crisp scientific formulas at lightning speed. |
| ❌ **Bare, Impractical Code Blocks**: Code blocks are plain text boxes with no language labels, no line numbers, and no easy way to copy code. | ✅ **Studio Code Cards**: Features top header bars with uppercase language badges and a **1-click animated Copy Code button**. |
| ❌ **Privacy & Latency Concerns**: Many online editors upload your files to remote servers, causing latency and exposing proprietary specs or private notes. | ✅ **100% Client-Side & Private**: Everything parses in your browser memory via Web APIs. Zero data, keystrokes, or files leave your device. |
| ❌ **Drifting & Clunky Scrolling**: Split-pane viewers either don't sync or get wildly desynchronized as you scroll through long documents. | ✅ **Proportional Sync Scroll & Resizer**: Synchronized scrolling with a draggable divider gutter and 3 flexible view modes (Split, Editor Only, Reader Only). |
| ❌ **Eye Fatigue & Rigid Themes**: Most viewers offer only blinding white or harsh pure black. | ✅ **5 Curated Color Themes**: Includes **Obsidian Dark**, **Deep Navy**, **Warm Espresso**, **Ivory Parchment**, and **Pure Light**. |
| ❌ **Lost in Long Documents**: No quick way to navigate extensive READMEs or API specs. | ✅ **Interactive Table of Contents (TOC)**: Auto-detects headings (H1–H4) with smooth 1-click jump-to-section navigation. |

---

## 🌟 Key Features

### 1. Dual-Pane Studio Environment
- **Left Pane (Editor & Uploader)**:
  - Drag and drop any `.md`, `.markdown`, or `.txt` file directly onto the editor.
  - Dedicated **Upload .md** file picker.
  - Line numbers gutter that synchronizes with vertical scrolling.
  - Quick formatting toolbar (Bold, Italic, Strikethrough, Headings, Quotes, Code, Tables, Task lists, Callouts).
  - Keyboard shortcuts (<kbd>Ctrl</kbd>+<kbd>B</kbd>, <kbd>Ctrl</kbd>+<kbd>I</kbd>, <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Tab</kbd> indent).
- **Right Pane (Reader View)**:
  - Responsive typography engineered for readability.
  - In-document quick text search.
  - Live document telemetry: words, characters, line count, and estimated reading time.
- **Draggable Gutter Resizer**: Click and drag the divider between panes to set your preferred width ratio.
- **View Mode Switcher**: Seamlessly toggle between **Split Screen**, **Editor Only**, or **Reader Only (Distraction-Free Zen Mode)**.

### 2. High-Fidelity Rendering
- **Callout Alert Blocks**: Full support for `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]`.
- **Code Block Cards**: Complete syntax highlighting powered by Highlight.js supporting JavaScript, TypeScript, Python, Rust, Bash, JSON, SQL, and more.
- **LaTeX Math (KaTeX)**: Display both inline equations (`$formula$`) and multiline block equations (`$$formula$$`).
- **Mermaid Diagrams**: Interactive flowcharts, sequence diagrams, and class diagrams rendered as vector SVGs.
- **GFM Tables & Task Lists**: Zebra striping, responsive horizontal overflow scroll, and interactive task checklists (`- [ ]`, `- [x]`).

### 3. 5 Curated Color Themes
- 🌌 **Obsidian Dark**: Sleek deep dark mode with crisp borders and azure accents.
- 🌊 **Deep Navy**: Rich oceanic midnight navy (`#080e1a` / `#0f192e`) with luminous sapphire and sky blue tones.
- ☕ **Warm Espresso**: Deep charcoal and volcanic stone with warm terracotta accents.
- 📜 **Ivory Parchment**: Clean warm cream paper finish designed for long-form reading comfort.
- ☀️ **Pure Light**: Minimalist daylight theme with clean contrast and slate borders.

### 4. Export & Utility
- **Export to HTML**: Download a standalone, self-contained HTML file.
- **Print / PDF**: Clean print stylesheet for creating professional PDFs without editor chrome.
- **Copy Markdown**: One-click raw markdown copy.

---

## 🚀 Live Demo & Deployment

### 🌐 Live URL
Access the live deployment here: **[https://omni-mark-zorox.vercel.app/](https://omni-mark-zorox.vercel.app/)**

### 📦 Deploy Your Own Copy on Vercel
OmniMark is 100% static and zero-config with the included `vercel.json`:

1. Fork or clone this repository:
   ```bash
   git clone https://github.com/moazzem-hossain-majumder/Omni-Mark.git
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Keep default settings (**Framework Preset: Other**) and click **Deploy**.

---

## 💻 Local Development

Clone and run locally in seconds:

```bash
# Clone the repository
git clone https://github.com/moazzem-hossain-majumder/Omni-Mark.git
cd Omni-Mark

# Start local server
npm start
```

Visit **`http://localhost:5173`** in your browser.
*(You can also directly double-click `index.html` in File Explorer—no build steps or node dependencies required!)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
