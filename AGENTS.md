# Repository engineering instructions

These instructions apply to this Astro and TypeScript repository. Follow the repository's established conventions when changing code.

## Choose names by meaning

- Decide an identifier's name from its semantic role, not from `const`, `export`, `as const`, module scope, or whether its value is an object or array. First distinguish application-level static configuration, semantic constants, runtime data, computed values, functions, types, and external/public contracts.
- Never apply mechanical conversions such as `const` to UPPER_SNAKE_CASE, `export const` to camelCase, every module-level value to uppercase, or every object/array to camelCase. **UPPER_SNAKE_CASE is not a synonym for `const`.**
- Do not replace an established repository convention with a generic framework or language convention unless the user explicitly requests that change. Repository-specific conventions take precedence over generic Astro, TypeScript, ESLint, or Codex style preferences.

## Static configuration versus runtime values

- Use `UPPER_SNAKE_CASE` for application-level static configuration and genuine semantic constants. The existing `src/config.ts` exports `SITE`, `CONTENT_TIME_ZONE`, `POSTS_PER_PAGE`, `MOMENTS_PER_PAGE`, `FILING`, `ANALYTICS`, and `NAV_ITEMS` are intentional and correct. Do not rename them to `site`, `contentTimeZone`, `postsPerPage`, `momentsPerPage`, `filing`, `analytics`, or `navItems` for style reasons.
- Objects and arrays can be application-level static configuration: `export const SITE = { ... }`, `export const NAV_ITEMS = [ ... ]`, and `export const ANALYTICS = { ... }` intentionally use UPPER_SNAKE_CASE. `as const` has no direct bearing on naming. Future configuration such as `IMAGE_APIS`, `IMAGE_JSON_APIS`, `DEFAULT_LOCALE`, and `API_TIMEOUT` follows the same rule.
- Module scope alone does not make a value application-level configuration. Keep framework registrations and schema values such as `posts`, `moments`, `collections`, and `contentDate` in `src/content.config.ts` in their established form; `collections` is also an Astro-defined export.
- Use camelCase for ordinary local values, runtime data, computed results, and temporaries: `posts`, `currentPage`, `totalPages`, `siteTitle`, `imageApi`, `formattedDate`, `postList`. For example, `const siteTitle = SITE.title` and `const imageApi = IMAGE_APIS[index]`. Do not turn these into `POSTS`, `CURRENT_PAGE`, `TOTAL_PAGES`, `SITE_TITLE`, or `IMAGE_API` merely because they are declared with `const`.

## Functions, booleans, types, and components

- Use camelCase for ordinary functions, whether declared with `function`, written as an arrow function, exported, or assigned to `const`: `getPosts`, `formatDate`, `fetchImage`, `createImagePool`, `normalizeTagName`. `export const getPosts = () => ...` is still a function; do not rename it to `GET_POSTS`.
- Prefer clear `is...`, `has...`, `can...`, or `should...` names for internal boolean state, such as `isDraft`, `isOpen`, `hasNextPage`, `hasMounted`, `canNavigate`, and `shouldShowUpdated`. Do not force this convention onto external API fields, Content frontmatter/schema fields, JSON contracts, framework-defined fields, or public data structures.
- Use PascalCase for `type`, `interface`, `enum`, and `class`: `Post`, `Props`, `PostData`, `SiteConfig`, `PostStatus`. Do not introduce `I` interface prefixes (`IPost`, `IProps`) unless an existing external contract requires them.
- Use PascalCase for Astro, JSX, and TSX component identifiers and, in principle, component filenames: `SiteHeader`, `PostCard`, `Pagination`, `BaseLayout`; `SiteHeader.astro`, `PostCard.astro`, `BaseLayout.astro`. Components are not ordinary camelCase functions. Match import identifiers and path casing to the actual files.

## Files, routes, and contracts

- Treat everything under `src/pages` as a URL route first. Keep URL-friendly route names such as `index.astro`, `about.astro`, `archives.astro`, `tags/[tag].astro`, and `moments/index.astro`; the current repository also uses directory-based `index.astro` routes. Never rename route files, directories, or dynamic parameters solely to match component naming.
- For ordinary non-component, non-route modules, follow the existing concise lowercase/kebab-case style (for example, `src/lib/posts.ts`, `src/lib/publication.ts`, `src/plugins/copy-code.mjs`, `src/scripts/theme.ts`). Avoid low-value mass file renames for theoretical consistency.
- Use lowercase for ordinary non-route directories and kebab-case for multiword directories, even when they contain components: `components/`, `layouts/`, `scripts/`, `content-utils/`, `image-tools/`. Do not use PascalCase directory names merely because the contents are components. Route directories follow URL semantics first.
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

## Errors and resource lifecycles

- Handle errors according to their meaning. Do not use unexplained `catch {}`, silently swallow unexpected errors, or report success after failure. A fallback is valid only when it is an intentional product behavior, such as trying another image source; do not turn unknown programming errors into ordinary fallback. Preserve existing error and fallback semantics unless the task requires a change.
- Match resource lifetime to the owning page or component. Account for timers, intervals, event listeners, `AbortController`, observers, subscriptions, async requests, timeouts, and DOM side effects. Preserve existing cleanup and arrange cleanup for new long-lived resources; do not leave dangling work.

## Dependencies, imports, comments, and performance

- Before adding a package, check standard JavaScript/TypeScript, Astro, and existing dependencies. Do not add a dependency for a simple feature. Unless the task requires it, do not upgrade dependencies, replace a library, change package managers, modify the lockfile, or add a package with overlapping functionality.
- Inspect existing imports and exports before implementing a feature. Import an available shared function, constant, component, or type; do not recreate it, add a redundant export or wrapper, or introduce a barrel solely to shorten paths. Follow a stable barrel convention if one exists; otherwise do not invent one. Keep import path casing exact.
- Comments should explain why, non-obvious constraints, contracts, workarounds, or edge cases. Do not restate clear code (for example, `// Increment count` above `count++`); remove comments made inaccurate by a change.
- Do not optimize without a demonstrated need. Do not rewrite clear code, add caches or complex state, hand-write memoization, change data structures, add concurrency, or change loading strategies for theoretical speed. For performance work, identify the actual bottleneck first.

## Refactor safety and scope

- **Prefer the smallest correct change.** Change only what the request needs. Do not opportunistically rename, format, move, or restructure unrelated code; report out-of-scope findings instead.
- Preserve behavior during naming, style, deduplication, helper extraction, file organization, and internal refactors unless the user explicitly requests a behavior change. Preserve rendered output, routes, API behavior, content schema, error and fallback semantics, browser behavior, and build behavior.
- When a task explicitly replaces an obsolete implementation, remove confirmed dead code rather than retaining old/new/legacy copies, unused fallbacks, compatibility wrappers, or commented-out code without a compatibility requirement. Before deletion, verify references, public contracts, and hidden framework requirements; do not delete code whose role is uncertain.
- Do not fold architecture refactors, component splitting or merging, dependency upgrades or package replacement, unrelated formatting, route or schema changes, UI changes, CSS redesign, performance rewrites, speculative helper extraction, or directory restructuring into another task.

## Refactor workflow and validation

For naming, style, code quality, deduplication, refactoring, or project-wide normalization:

1. Read this `AGENTS.md`.
2. Inspect the relevant repository code and configuration.
3. Search globally for existing implementations before adding anything.
4. Identify established conventions and import/export relationships.
5. Identify the single source of truth where applicable.
6. Classify identifiers by semantic role and distinguish internal code from public/external contracts.
7. Decide all intended changes before editing; do not edit while still scanning.
8. Make the smallest necessary change and preserve behavior.
9. Reuse existing functions, constants, components, and types where suitable.
10. Avoid unrelated refactors.
11. Search globally afterward for stale names, duplicate implementations, and old imports; check import casing, unused imports/exports, and accidental contract changes.
12. Read `package.json`.
13. Run relevant existing typecheck, lint, test, and build scripts when source changed; do not invent scripts. Report any check that cannot run.
14. Run `git diff --check`.
15. Run `git status --short`.
16. Review the complete diff for unintended changes.
17. Do not commit or push unless explicitly requested.
