# OmniMark — Modern Markdown Reader & Studio

OmniMark is a high-performance, split-pane Markdown reader and live editor engineered with clean typography, code block cards, rich callout alerts, KaTeX mathematical notation, and interactive Mermaid diagrams.

---

## 🌟 Key Features

- **Split-Pane Layout**:
  - **Left Pane**: Upload any `.md` or `.markdown` file (via drag-and-drop or file picker) or paste raw markdown code. Includes line numbers, quick formatting toolbar, and keyboard shortcuts (<kbd>Ctrl</kbd>+<kbd>B</kbd>, <kbd>Ctrl</kbd>+<kbd>I</kbd>, <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Tab</kbd> indent).
  - **Right Pane**: The live rendered document reader with refined typography and responsive components.
  - **Draggable Resizer**: Seamlessly resize the left and right panels to your preferred ratio.
  - **View Modes**: Toggle between **Split Screen**, **Editor Only**, or **Reader Only (Distraction-Free)**.
- **Interactive Callout Alert Blocks**:
  - Full support for `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]` with matching icons, background tints, and colored accent borders.
- **Code Block Cards**:
  - Rounded card wrappers with top bar showing language badge and a **1-click Copy Code** button with animated checkmark feedback.
  - Full syntax highlighting for JavaScript, TypeScript, Python, Rust, Bash, JSON, SQL, and more.
- **LaTeX Math Support (KaTeX)**:
  - Inline equations (`$E=mc^2$`) and display blocks (`$$\int_0^\infty e^{-x^2}dx$$`).
- **Mermaid Diagrams**:
  - Flowcharts, sequence diagrams, and class diagrams rendered dynamically as vector SVGs.
- **5 Curated Themes**:
  - **Obsidian Dark**: Sleek dark mode with crisp borders and azure accents.
  - **Deep Navy**: Rich oceanic navy blue with luminous sapphire and sky blue tones.
  - **Warm Espresso**: Deep charcoal and volcanic stone with warm terracotta accents.
  - **Ivory Parchment**: Clean warm cream paper finish designed for reading comfort.
  - **Pure Light**: Minimalist daylight theme with crisp contrast and slate borders.
- **Document Navigation & Telemetry**:
  - Sliding **Table of Contents (TOC)** with smooth jump-to-section.
  - Live document telemetry: words, characters, line count, and estimated reading time.
  - In-document quick search.
  - Synchronized scrolling between editor and reader.
- **Export**:
  - Download `.md` source, export standalone `.html`, or print to PDF.

---

## 🚀 Deployment to Vercel

OmniMark is 100% static, fast, and optimized for Vercel deployment with included `vercel.json`.

### Option A: Via Git Repository (Recommended)
1. Push this project folder to your remote Git repository.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import your repository.
3. Keep default settings (Framework Preset: **Other**) and click **Deploy**.
4. Your Markdown Reader will be live on a `*.vercel.app` domain with instant global CDN caching!

### Option B: Via Vercel CLI
1. Open a terminal in this folder.
2. Run:
   ```bash
   npx vercel
   ```
3. Follow the quick prompts to log in and deploy.
4. For production deployment:
   ```bash
   npx vercel --prod
   ```

---

## 💻 Local Development

To run locally:
```bash
npm start
```
Then navigate to **`http://localhost:5173`**.
You can also directly double-click `index.html` in any browser!
