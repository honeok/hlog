# AGENTS.md

These instructions apply throughout this repository; also read any more specific `AGENTS.md` in the area you change. Follow the repository's established conventions. Use the actual code and configuration to establish project facts; do not replace explicit developer constraints with generic framework or language preferences.

## Project overview

`hlog` is a personal blog built with Astro, TypeScript, and Markdown. It publishes articles and Moments, with tags, archives, RSS, and browser-side article search. Astro generates a static site in `dist/`, deployed as Cloudflare Workers static assets.

- Preserve the static architecture: content queries and Markdown rendering run at build time; DOM and browser APIs belong in component `<script>` blocks or `src/scripts/`. The RSS, JSON, and robots endpoints are generated assets, not request-time services.
- Use the Node version in `.node-version` and the pnpm version in `package.json`. `pnpm-lock.yaml` records dependency resolution; `pnpm-workspace.yaml` records allowed dependency build scripts. Do not infer a multi-package architecture from that filename.
- Keep Astro components, plain TypeScript browser scripts, and the existing CSS and Markdown pipeline. Introducing a client framework, server adapter, or replacement rendering system requires a task that calls for that architectural change.

## Before changing code

- Read `package.json` for scripts and dependencies, `astro.config.mjs` for static output, URL handling, fonts, sitemap, and Markdown plugins, and `tsconfig.json` for strict checking and import aliases.
- Read `src/config.ts`, `src/content.config.ts`, and the relevant `src/lib/` modules before changing content behavior. Follow their callers through routes, layouts, and components; `README.md` is only a brief project introduction.
- Read `.editorconfig`, `.prettierrc.json`, and nearby code for formatting. For build or deployment work, also read `.github/workflows/build.yml`, `wrangler.toml`, `public/_redirects`, and `public/_headers`.
- Start with `git status --short` and inspect existing diffs so you can distinguish the task's changes from work already in progress. Use relevant Git history when intent is unclear; do not create a separate roadmap, dev log, or tracking system unless requested.

## Workspace and architecture boundaries

```text
src/config.ts          Site metadata, content time zone, pagination, navigation, optional integrations
src/content.config.ts  Posts and Moments loaders, schemas, content date interpretation
src/content/           Markdown articles, Moments, and directly imported About content
src/lib/               Shared publication checks, collection queries, sorting, article links
src/pages/             URL routes, static endpoints, pagination, tags, archive grouping
src/layouts/           Site shell and article layout
src/components/        Shared presentation, metadata, navigation, search, dates, pagination
src/scripts/           Browser theme and code-copy behavior
src/plugins/           Build-time Markdown transformations for video, reading time, code blocks
src/styles/            Global CSS entry point, theme colors, layout, typography, code, media
public/                Static assets and Cloudflare redirect/header rules
.github/workflows/     Build/deploy and repository automation
```

- **Publication has one authority.** `src/lib/publication.ts` excludes drafts and future-dated entries. `getPublishedPosts` and `getPublishedMoments` return the complete published collections in descending date order. Keep pagination, tag filtering, archive grouping, and RSS/JSON field mapping with their existing callers; do not limit the shared queries to a page size.
- **Content schemas are contracts.** Posts and Moments load `**/index.md` through `src/content.config.ts`; About is imported directly from `src/content/about/index.md`. Article frontmatter `id` is a positive integer and supplies the public URL, independently of the collection entry's string `id`. Preserve duplicate article ID validation across the entire collection, including drafts, before publication filtering in `src/pages/[id].astro`.
- **Dates use the configured writing time zone.** Preserve the schema's content wall-time conversion, use `CONTENT_TIME_ZONE` for content display and archive grouping, and reuse `FormattedDate.astro` for the shared date presentation. Do not substitute the build machine's local time zone or duplicate the parsing logic.
- **Article links use `getPostHref`.** Articles use `/<id>.html`; list routes use directory-based `index.astro` files and public URLs without trailing slashes. For a requested URL change, check the route, link helpers, canonical metadata in `Head.astro`, sitemap serialization in `astro.config.mjs`, and `public/_redirects` together. Preserve the relationship between `trailingSlash: 'never'`, `build.format: 'preserve'`, and `html_handling = "none"` in `wrangler.toml`.
- **Markdown transformations belong in the existing satteri pipeline.** Read the mdast/hast registration in `astro.config.mjs` before changing a plugin. Preserve the `remarkPluginFrontmatter.readingTime` contract used by article and archive rendering, and the markup/hooks shared by the code-block plugin, browser copy script, and CSS.
- **Presentation shares existing styles and behavior.** Reuse the color variables and layout/typography rules imported by `src/styles/global.css`, including the `prose-content` container. Keep the early theme initialization in `Head.astro` consistent with `src/scripts/theme.ts`; they cover initial rendering and interactive updates respectively.

## Change scope and refactor safety

- **Prefer the smallest correct change.** Change only what the request needs. Do not opportunistically rename, format, move, or restructure unrelated code; report out-of-scope findings instead.
- Preserve behavior during naming, style, deduplication, helper extraction, file organization, and internal refactors unless the user explicitly requests a behavior change. Preserve rendered output, routes, API behavior, content schema, error and fallback semantics, browser behavior, and build behavior.
- When a task explicitly replaces an obsolete implementation, remove confirmed dead code rather than retaining old/new/legacy copies, unused fallbacks, compatibility wrappers, or commented-out code without a compatibility requirement. Before deletion, verify references, public contracts, and hidden framework requirements; do not delete code whose role is uncertain.
- Do not fold architecture refactors, component splitting or merging, dependency upgrades or package replacement, unrelated formatting, route or schema changes, UI changes, CSS redesign, performance rewrites, speculative helper extraction, or directory restructuring into another task.

## Naming conventions

### Choose names by meaning

- Decide an identifier's name from its semantic role, not from `const`, `export`, `as const`, module scope, or whether its value is an object or array. First distinguish application-level static configuration, semantic constants, runtime data, computed values, functions, types, and external/public contracts.
- Never apply mechanical conversions such as `const` to UPPER_SNAKE_CASE, `export const` to camelCase, every module-level value to uppercase, or every object/array to camelCase. **UPPER_SNAKE_CASE is not a synonym for `const`.**
- Do not replace an established repository convention with a generic framework or language convention unless the user explicitly requests that change. Repository-specific conventions take precedence over generic Astro, TypeScript, ESLint, or Codex style preferences.

### Static configuration versus runtime values

- Use `UPPER_SNAKE_CASE` for application-level static configuration and genuine semantic constants. The existing `src/config.ts` exports `SITE`, `CONTENT_TIME_ZONE`, `POSTS_PER_PAGE`, `MOMENTS_PER_PAGE`, `FILING`, `ANALYTICS`, and `NAV_ITEMS` are intentional and correct. Do not rename them to `site`, `contentTimeZone`, `postsPerPage`, `momentsPerPage`, `filing`, `analytics`, or `navItems` for style reasons.
- Objects and arrays can be application-level static configuration: `export const SITE = { ... }`, `export const NAV_ITEMS = [ ... ]`, and `export const ANALYTICS = { ... }` intentionally use UPPER_SNAKE_CASE. `as const` has no direct bearing on naming. Future configuration such as `IMAGE_APIS`, `IMAGE_JSON_APIS`, `DEFAULT_LOCALE`, and `API_TIMEOUT` follows the same rule.
- Module scope alone does not make a value application-level configuration. Keep framework registrations and schema values such as `posts`, `moments`, `collections`, and `contentDate` in `src/content.config.ts` in their established form; `collections` is also an Astro-defined export.
- Use camelCase for ordinary local values, runtime data, computed results, and temporaries: `posts`, `currentPage`, `totalPages`, `siteTitle`, `imageApi`, `formattedDate`, `postList`. For example, `const siteTitle = SITE.title` and `const imageApi = IMAGE_APIS[index]`. Do not turn these into `POSTS`, `CURRENT_PAGE`, `TOTAL_PAGES`, `SITE_TITLE`, or `IMAGE_API` merely because they are declared with `const`.

### Functions, booleans, types, and components

- Use camelCase for ordinary functions, whether declared with `function`, written as an arrow function, exported, or assigned to `const`: `getPosts`, `formatDate`, `fetchImage`, `createImagePool`, `normalizeTagName`. `export const getPosts = () => ...` is still a function; do not rename it to `GET_POSTS`.
- Prefer clear `is...`, `has...`, `can...`, or `should...` names for internal boolean state, such as `isDraft`, `isOpen`, `hasNextPage`, `hasMounted`, `canNavigate`, and `shouldShowUpdated`. Do not force this convention onto external API fields, Content frontmatter/schema fields, JSON contracts, framework-defined fields, or public data structures.
- Use PascalCase for `type`, `interface`, `enum`, and `class`: `Post`, `Props`, `PostData`, `SiteConfig`, `PostStatus`. Do not introduce `I` interface prefixes (`IPost`, `IProps`) unless an existing external contract requires them.
- Use PascalCase for Astro, JSX, and TSX component identifiers and, in principle, component filenames: `SiteHeader`, `PostList`, `Pagination`, `SiteLayout`; `SiteHeader.astro`, `PostList.astro`, `SiteLayout.astro`. Components are not ordinary camelCase functions. Match import identifiers and path casing to the actual files.

### Files, routes, and contracts

- Treat everything under `src/pages` as a URL route first. Keep URL-friendly route names such as `index.astro`, `[id].astro`, `about/index.astro`, `archives/index.astro`, `tags/[tag]/index.astro`, and `moments/index.astro`. Never rename route files, directories, or dynamic parameters solely to match component naming.
- For ordinary non-component, non-route modules, follow the existing concise lowercase/kebab-case style (for example, `src/lib/posts.ts`, `src/lib/publication.ts`, `src/plugins/copy-code.mjs`, `src/scripts/theme.ts`). Avoid low-value mass file renames for theoretical consistency.
- Use lowercase for ordinary non-route directories, even when they contain components: `components/`, `layouts/`, `scripts/`. Use kebab-case for multiword non-route directories, such as `content-utils/` or `image-tools/`. Preserve existing directory names unless a rename is explicitly required. Do not use PascalCase directory names merely because the contents are components. Route directories follow URL semantics first.
- Before renaming anything, decide whether it is a code identifier or an external/public contract. Never rename these solely for naming or style: public URLs, Astro routes, dynamic route parameters, Content Collection fields, content frontmatter fields, external API fields, JSON contracts, RSS/Atom fields, query parameters, environment variables, Cloudflare bindings, third-party configuration properties, framework-defined properties, HTML attributes, `data-*` attributes, `aria-*` attributes, and CSS class names. Preserve Astro-defined exports such as `getStaticPaths` and `GET`.

## Search, reuse, and one source of truth

- **Search before adding.** Before adding a function, helper, component, utility, constant, configuration, type, formatter, parser, validator, data transformation, or fallback, search the repository for an existing implementation. Reuse it first; extend it only if its responsibility remains clear; add a new implementation only when neither is suitable.
- **Reuse before reimplementation.** Import an existing shared implementation instead of copying date formatting, URL or slug/tag handling, pagination, filtering, sorting, validation, image/API fallback, error normalization, content transformation, or configuration lookup. Do not merge code that only looks similar but has different semantics.
- **Keep a single source of truth.** A business rule, static setting, constant, or transformation should have one authoritative source. Reuse `SITE.url`, `POSTS_PER_PAGE`, and `CONTENT_TIME_ZONE` rather than duplicating their values or meaning elsewhere. When configurations overlap, reference the existing authority rather than creating another.
- Look for repeated conditions, transformations, error handling, configuration mappings, and fallback flows. Share a genuinely common implementation when doing so reduces maintenance cost; do not copy it for local convenience.

## Simple code and sound abstractions

- Prefer straightforward, readable, explicit, minimal code. Avoid needless wrappers, adapters, forwarding helpers, single-caller functions without abstraction value, service/controller/repository layers, and complex directories for simple logic. Pass `fail` directly as a callback instead of `() => fail()` when the wrapper changes nothing.
- **Do not over-abstract merely to satisfy DRY.** Keep one-off, short, clear local logic local. Do not extract code that only coincidentally looks alike, requires more parameters than it saves, makes callers harder to read, or creates a utility for two or three trivial lines. An abstraction must reduce maintenance cost, not just line count.
- Do not build generic helpers, extension points, plugin systems, configuration indirection, generic types, or compatibility layers for hypothetical future needs. Add shared abstractions for actual multiple callers or a clear reuse requirement.
- Prefer existing TypeScript types and useful inference; do not repeat equivalent type shapes or add noisy annotations and generics. Do not use `any`, unnecessary `as unknown as ...`, or unsupported assertions to hide real errors. Validate or narrow untrusted external data at its boundary; use clear verified types internally.

## Errors, input boundaries, and resource lifecycles

- Handle errors according to their meaning. Do not use unexplained `catch {}`, silently swallow unexpected errors, or report success after failure. A fallback is valid only when it is an intentional product behavior, such as trying another image source; do not turn unknown programming errors into ordinary fallback. Preserve existing error and fallback semantics unless the task requires a change.
- Let invalid content schemas and duplicate article IDs fail the build with actionable errors. Preserve intentional browser fallbacks, such as following the system theme when stored preferences cannot be read; do not hide content or programming errors behind empty results.
- Preserve the existing escaping at output boundaries: video directive attributes in `src/plugins/video.mjs`, JSON-LD serialization in `Head.astro`, and text insertion in `SearchDialog.astro`. Do not interpolate untrusted values into raw HTML. Keep deployment credentials in CI secrets; static site output and browser code are public.
- Match resource lifetime to the owning page or component. Account for timers, intervals, event listeners, `AbortController`, observers, subscriptions, async requests, timeouts, and DOM side effects. Preserve existing cleanup and arrange cleanup for new long-lived resources; do not leave dangling work.

## Dependencies, formatting, imports, comments, and performance

- Before adding a package, check standard JavaScript/TypeScript, Astro, and existing dependencies. Do not add a dependency for a simple feature. Unless the task requires it, do not upgrade dependencies, replace a library, change package managers, modify the lockfile, or add a package with overlapping functionality.
- Follow `.editorconfig`: UTF-8, LF, two-space indentation, and a final newline, with its Markdown-specific exceptions. Follow `.prettierrc.json` and nearby code for single quotes and omitted semicolons in JavaScript/TypeScript. Do not reformat unrelated files.
- Inspect existing imports and exports before implementing a feature. Import an available shared function, constant, component, or type; do not recreate it, add a redundant export or wrapper, or introduce a barrel solely to shorten paths. Follow a stable barrel convention if one exists; otherwise do not invent one. Keep import path casing exact.
- Comments should explain why, non-obvious constraints, contracts, workarounds, or edge cases. Do not restate clear code (for example, `// Increment count` above `count++`); remove comments made inaccurate by a change.
- Do not optimize without a demonstrated need. Do not rewrite clear code, add caches or complex state, hand-write memoization, change data structures, add concurrency, or change loading strategies for theoretical speed. For performance work, identify the actual bottleneck first.

## Development workflow

1. Read the applicable instructions and the relevant code, configuration, and `package.json`. Establish the requested outcome, affected files, and behavior that must remain unchanged. For a bug, identify a reproducible case before choosing a fix.
2. Search globally for existing implementations and callers. Identify established conventions, import/export relationships, and the authoritative configuration or business rule. For naming or refactoring work, classify identifiers by semantic role and distinguish internal code from public/external contracts.
3. Decide the intended changes and relevant validation before editing; do not edit while still scanning. Keep the scope limited to the task and reuse existing functions, constants, components, and types where suitable.
4. Make the smallest necessary change. Check affected edge cases and error paths as well as the normal case; do not add abstractions, dependencies, or unrelated fixes to make the task appear more complete.
5. Search globally afterward for stale names, duplicate implementations, and old imports; check import casing, unused imports/exports, and accidental contract changes.
6. Run the applicable checks below. Review the complete diff, run `git diff --check` and `git status --short`, and verify that unrelated work and generated files are not included in the change.
7. Report what changed, why, the checks actually run and their results, and any remaining limitation or out-of-scope finding. Do not describe an unrun check as passing. Do not commit or push unless explicitly requested.

## Shared workspaces and parallel agents

- Preserve other contributors' and agents' uncommitted changes. Do not reset, overwrite, delete, stash, or clean work that is not yours merely to obtain a clean tree.
- When parallel work is used, agree on separate file ownership before editing. Re-read shared files and their current diffs immediately before changing them; keep edits small, especially in `src/config.ts`, `src/content.config.ts`, `astro.config.mjs`, and shared layouts/styles.
- If another task's in-progress changes break validation or overlap your edit, coordinate before touching those files and report the interference. Do not silently repair or roll back another task, run broad formatting over its files, or remove its build artifacts or workspace.

## Validation

The existing scripts are `pnpm dev`, `pnpm typecheck` (`astro check`), `pnpm build` (`astro build`), and `pnpm preview`. There are no dedicated format, lint, or test scripts, no configured test suite, and no formatter/linter declared as a direct dependency in `package.json`. Do not invent commands or install new tools merely to satisfy a checklist; recheck the scripts if the project changes.

### During development

- Use `pnpm dev` for focused route and interaction checks. Use `pnpm preview` after a build to inspect generated output; it does not reproduce Cloudflare's redirect/header handling.
- For UI changes, inspect the affected pages at narrow and wide widths and in both themes. Exercise the changed interactions, including keyboard/focus behavior where relevant; a successful build does not verify presentation or browser behavior.
- For publication, schema, date, or route changes, check affected outputs for drafts and future dates, duplicate IDs, time zone boundaries, empty lists, pagination boundaries, encoded tags, and consistency between article links, RSS, and `/posts.json`, as applicable. For Markdown rendering changes, render representative affected content and inspect the generated markup.
- For a bug fix, verify the reproducer fails before the fix and succeeds afterward. Add or update a focused regression test when a suitable test setup exists or the task requires it; otherwise report reproducible manual/output checks. Do not add a test framework for a routine edit or tests that merely mirror the implementation.

### Before finishing

- **Documentation only:** check the changed document's paths, commands, claims, and Markdown, then review the diff and run `git diff --check` and `git status --short`. An application build is not required for prose-only changes outside site content.
- **Code or build configuration:** run `pnpm typecheck` and `pnpm build`, matching the full check sequence in `.github/workflows/build.yml`. This covers Astro/TypeScript, content schemas, Markdown plugins, and build configuration. Run any relevant lint/test scripts if the repository later provides them; use focused checks during iteration and the full applicable checks before finishing.
- **Markdown content or CSS only:** run `pnpm build` and inspect the affected output/pages. Include `pnpm typecheck` when the change also touches code, schemas, or build configuration.
- **Dependency setup:** when installation is needed, use `pnpm install --frozen-lockfile` as CI does. Do not regenerate the lockfile to make an unrelated change pass. CI deploys the built `dist/` through the Wrangler action; deployment is not a local validation step.
- **Blocked checks:** report the command, failure, and what remains unverified. Font providers in `astro.config.mjs` can require network access during a build; distinguish environment/network failures from code failures without changing fonts or weakening checks as a workaround.
