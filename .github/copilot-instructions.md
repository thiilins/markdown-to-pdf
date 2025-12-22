# Copilot Instructions - Markdown to PDF Pro

## Project Overview

Next.js 16 application that converts Markdown to professional PDFs with real-time preview. Built
with React 19, TypeScript, Tailwind CSS 4.0, and shadcn/ui components. Uses Server Actions for
secure PDF generation via external API.

## Architecture & Data Flow

### State Management Pattern

This project uses **React Context + Custom Hooks** for state management (not Redux/Zustand). All
contexts live in `src/shared/contexts/`:

```
mdToPdfContext.tsx      → Markdown content, PDF generation, print
configContext.tsx       → Page config, typography, theme, editor settings
zoomContext.tsx         → Preview zoom level
headerFooterContext.tsx → Header/footer configuration
gistContext.tsx         → GitHub Gist integration
webExtractorContext.tsx → Web scraping features
```

**Critical Pattern**: State is persisted to IndexedDB, NOT localStorage. Use:

- `usePersistedStateInDB()` for heavy data (markdown content) - async operations
- `usePersistedState()` for lightweight config - sync operations

Example from [mdToPdfContext.tsx](src/shared/contexts/mdToPdfContext.tsx):

```typescript
const [markdown, setMarkdown] = usePersistedStateInDB<string>(
  'md-to-pdf-markdown',
  DEFAULT_MARKDOWN,
)
```

### Type System Architecture

Global types in `src/shared/@types/global.d.ts` (no imports needed). Key interfaces:

- `AppConfig` - Master configuration with page, typography, editor, theme
- `PageConfig`, `TypographyConfig`, `EditorConfig`, `ThemeConfig` - Nested configs
- Type-safe presets: `MarginPreset`, `ThemePreset` (26+ themes), `PageSize`

**Config Normalization**: Always use `normalizeConfig()` from
[normalize-config.ts](src/shared/utils/normalize-config.ts) when setting config to ensure theme and
headerFooter exist.

### PDF Generation Flow (Server Actions)

**Critical**: PDF generation uses Next.js 16 Server Actions to keep API credentials secure:

1. Client → `handleDownloadPDF()` in [mdToPdfContext.tsx](src/shared/contexts/mdToPdfContext.tsx)
2. Server Action → `generatePDF()` in [src/app/actions/pdf.ts](src/app/actions/pdf.ts)
3. Backend transforms `AppConfig` to backend format (removes `editor`, converts `lineHeight` to
   string)
4. Calls external API with `PDF_GENERATE_URL` and `x-api-key` header
5. Returns base64 PDF to client for download

**Never expose** `PDF_GENERATE_URL` or `PDF_GENERATE_TOKEN` to the client. These stay in
`.env.local` on the server.

### Route Structure

Uses Next.js App Router with grouped routes:

- `(home)/` - Landing page
- `(tools)/md-to-pdf/` - Main MD to PDF tool
- `(tools)/gist-explorer/` - GitHub Gist viewer
- `(tools)/web-extractor/` - Web scraping to markdown

View components pattern: Each tool has `page.tsx` (minimal) → `_components/view.tsx` (main logic).

## Component Patterns

### Settings Modal Architecture

[settings-modal/](src/components/settings-modal/) is a complex tabbed configuration system:

- `index.tsx` - Main sheet with dynamic tabs based on route
- Tab components: `page-size.tsx`, `typography.tsx`, `theme.tsx`, `editor.tsx`
- `constants.ts` - `CONFIG_MODAL_SHOW_OPTIONS` defines which tabs appear per route

Example: `/md-to-pdf` shows all tabs, other routes may show subset.

### Custom UI Components

[components/custom-ui/](src/components/custom-ui/) contains project-specific components:

- `color-selector.tsx` - Color picker with `react-colorful`
- `select-with-filter.tsx` - Searchable select for font picker
- `badge-multi-selector.tsx` - Multi-select with badges
- `visual-editor/` - Rich text editor with TipTap

**Don't confuse** with `components/ui/` (shadcn/ui base components).

### Preview Panel Pattern

Three preview implementations in [preview-panel/](src/components/preview-panel/):

- `with-pages.tsx` - Paginated preview with page breaks (MD to PDF)
- `static-pages.tsx` - Single page preview (Web Extractor)
- `no-pages.tsx` - Continuous scroll preview

Each uses different rendering strategy based on tool requirements.

## Development Conventions

### Import Path Alias

Always use `@/*` for absolute imports (configured in [tsconfig.json](tsconfig.json)):

```typescript
import { useConfig } from '@/shared/contexts/configContext'
import { cn } from '@/lib/utils'
```

### Styling Approach

1. **Tailwind CSS 4.0** for utility classes
2. **CSS variables** for theming (see `globals.css`)
3. **`cn()` utility** from [lib/utils.ts](src/lib/utils.ts) for conditional classes
4. **Print styles** dynamically generated in
   [shared/styles/print-styles.tsx](src/shared/styles/print-styles.tsx) based on config

### Monaco Editor Integration

[@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react) for markdown editing:

- Configured in [markdown-editor/editor.tsx](src/components/markdown-editor/editor.tsx)
- Auto-formats with Prettier on toolbar click
- Custom scroll sync between editor and preview

### Environment Variables

Define in `.env.local` (see [env.tpl](env.tpl)):

- `PDF_GENERATE_URL` - External PDF API endpoint (server-only)
- `PDF_GENERATE_TOKEN` - API authentication (server-only)
- `NEXT_PUBLIC_ENABLE_EXPORT_URL` - Feature flag for PDF download

Client vars must have `NEXT_PUBLIC_` prefix. Use [env.ts](src/env.ts) for access.

## Commands & Workflows

### Development

```bash
pnpm dev          # Start dev server (Turbopack enabled)
pnpm build        # Production build
pnpm lint         # ESLint check
```

**Hot Reload**: Turbopack is configured in [next.config.ts](next.config.ts). If PDF generation fails
during development, backend might be reloading.

### Debugging

1. **Context Issues**: Check React DevTools for context values
2. **PDF Generation**: Inspect Network tab for Server Action POST to `/actions/pdf`
3. **IndexedDB**: Use Application tab in DevTools → IndexedDB → `md_tools_pro_db`
4. **Type Errors**: Ensure using types from `global.d.ts` (no imports needed)

## Integration Points

### External PDF API

Backend expects this payload (see [actions/pdf.ts](src/app/actions/pdf.ts)):

```typescript
{
  html: string,
  config: {
    page: { width, height, orientation, margin },
    typography: { fonts, sizes, lineHeight: string },
    theme?: { colors }
  }
}
```

Note: `lineHeight` must be string (e.g., "1.6") for CSS compatibility.

### GitHub Gist API

[gistService.ts](src/services/gistService.ts) handles OAuth and Gist CRUD. Uses `next-auth` for
authentication.

### Web Scraping

[scrapper-html-v2.ts](src/app/actions/scrapper-html-v2.ts) uses `@mozilla/readability` and `jsdom`
for article extraction. Server Action pattern for security.

## Common Pitfalls

1. **Don't use localStorage directly** - Use `usePersistedStateInDB()` or `usePersistedState()`
2. **Config must be normalized** - Call `normalizeConfig()` before saving to ensure theme exists
3. **Server Action limitations** - Can't return functions or complex objects, use base64 for binary
   data
4. **Type imports** - `global.d.ts` types are ambient, don't import them
5. **Font loading** - Google Fonts loaded dynamically in
   [view.tsx](<src/app/(tools)/md-to-pdf/_components/view.tsx>) based on config

## Feature Planning

See [docs/analise-features.md](docs/analise-features.md) and
[docs/features-novas-v2.md](docs/features-novas-v2.md) for roadmap. Priority features:

- Mermaid.js diagram support (medium complexity)
- LaTeX/KaTeX equations (low complexity)
- Header/footer with images/logos (in progress)
- AI-powered content suggestions

When adding features, follow existing patterns:

1. Add types to `global.d.ts`
2. Create context if state needed
3. Update config normalization if needed
4. Use Server Actions for backend communication
