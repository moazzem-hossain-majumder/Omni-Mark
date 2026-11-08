# OmniMark

OmniMark is a client-side Markdown editor and preview engine. It compiles CommonMark and GitHub Flavored Markdown (GFM) directly in browser memory, evaluating KaTeX mathematical expressions, Highlight.js code syntax, and Mermaid diagram vectors in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-omni--mark--zorox.vercel.app-2563eb?style=flat-square)](https://omni-mark-zorox.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-neutral.svg?style=flat-square)](LICENSE)

Live Deployment: [https://omni-mark-zorox.vercel.app/](https://omni-mark-zorox.vercel.app/)

---

## Technical Specifications

| Component | Engine / Dependency | Processing Details |
| :--- | :--- | :--- |
| **Markdown Tokenization** | Marked.js 12.0.2 | Full GFM and CommonMark parsing with custom heading slugification and table wrappers |
| **Mathematical Formulas** | KaTeX 0.16.10 | Evaluates inline (`$...$`) and block (`$$...$$`) LaTeX expressions with HTML/MathML output |
| **Diagrams & Flowcharts** | Mermaid.js 10.9.1 | Dynamic SVG graph compilation from fenced `mermaid` code blocks |
| **Syntax Highlighting** | Highlight.js 11.9.0 | Polyglot tokenizer with language identification for JavaScript, TypeScript, Python, Rust, Bash, JSON, SQL |
| **Security Sanitization** | DOMPurify 3.1.2 | XSS vector elimination preserving SVG structures and KaTeX MathML trees |
| **Callout Alerts** | Custom Postprocessor | Maps `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]` to semantic containers |
| **Viewport Synchronization** | Dual-pane scroll engine | Proportional vertical scroll position synchronization between textarea and preview |

---

## Architecture & Layout

OmniMark runs completely within browser client memory without server-side rendering or network data transmission.

### 1. Editor Pane
- Direct textarea input with tab indentation (2 spaces) and line-number gutter synchronization.
- HTML5 Drag-and-drop file ingestion via the `FileReader` API (supports `.md`, `.markdown`, `.txt`).
- Keyboard formatting bindings: `Cmd+B` / `Ctrl+B` (Bold), `Cmd+I` / `Ctrl+I` (Italic), `Cmd+K` / `Ctrl+K` (Link).
- Document telemetry calculation: word count, character count, line count, and estimated reading time at a 200 WPM baseline benchmark.

### 2. Preview Pane
- Live DOM tree rendering debounced at 120ms for smooth 60fps interaction during continuous typing.
- Interactive Table of Contents (TOC) drawer generated from document heading nodes (H1–H4) with direct anchor navigation.
- In-document text filter and highlight walker.
- Individual code block cards featuring language tags and clipboard copying.

### 3. Display Modes & Themes
- Three workspace layout modes: Split View, Editor Only, and Preview Only.
- Monochromatic palettes built on zinc, slate, and neutral color bases with standardized border tokens (`4px` and `6px`).
- Standalone HTML document export bundling standard styles and compiled output.

---

## Local Development

OmniMark requires no build tools or package bundlers to run.

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge).
- Optional: Node.js (for running a local HTTP server).

### Running Locally

```bash
# Clone the repository
git clone https://github.com/moazzem-hossain-majumder/Omni-Mark.git
cd Omni-Mark

# Start local server via npm
npm start
```

Alternatively, open `index.html` directly in any web browser without starting a server.

---

## Deployment

OmniMark is configured for static hosting platforms.

### Vercel Deployment

1. Fork or clone this repository to GitHub.
2. Import the project into Vercel.
3. Use the default configuration (`Framework Preset: Other`, output directory: root).
4. Deploy.

---

## License

This project is licensed under the [MIT License](LICENSE).
