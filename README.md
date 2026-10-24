# RunMyStore

A working frontend commerce prototype using the supplied StoreOS theme and imagery. Website Builder, Catalog Studio, Ad Studio, campaigns, budgeting, approvals, orders, support, discovery, and settings share one persistent browser workspace.

## Open the demo

Open **[open-demo.html](./open-demo.html)** directly in Chrome or Edge. Keep the `public` folder beside it. This artifact bundles the application JavaScript and styles, uses hash routing, and loads images and fonts from that folder. It requires no development server or backend. The saved workspace is specific to this browser/file origin.

- Landing: `open-demo.html`
- Workspace: `open-demo.html#/app/overview`
- Published example store: `open-demo.html#/store/northwind`

Browser execution of this artifact has **not yet been verified** in the current environment: the automatic approval service returned a 404 for browser access and the development server. The file was built successfully; the production build, domain tests, and static React route checks pass.

## Develop and build

Requires Node.js 22.13+ and npm. The project source, assets, scripts, and direct-open demo work independently of the Optimus application. Install dependencies in the RunMyStore repository:

```sh
npm install
npm run dev
```

The development preview runs at `http://localhost:5174`. Build commands:

```sh
npm run build
npm run preview
npm test
npm run build:open-demo
npm run verify:render
```

`npm run build` produces the normal Vite static site in `dist`. Configure static hosting to serve `index.html` for application routes. There are no server/API functions. `npm run build:open-demo` produces the additional direct-open file described above.

During this session, package downloads were blocked by the approval service. The local checkout uses an ignored absolute `node_modules` symlink to packages already installed on this machine. This link is not committed; a Git clone uses its own dependencies through `npm install`. The direct-open demo needs no npm dependencies.

To regenerate the optional landing reference, run `python3 scripts/prepare-reference.py --source "/path/to/storeOS – The AI-native operating system for e-commerce.html"`. The source HTML and companion `_files` directory are only required for regeneration, not for development or building. Fallback fonts are bundled in this repository.

## What works

- **Landing and onboarding:** original desktop/mobile section compositions, supplied imagery, local CTAs, validated URL context, sample-store setup, configurable store identity, garment selection, an example bag, and manual look switching. URLs are not fetched.
- **Overview:** period-filtered metrics and daily chart, current store identity, contextual recommendations, recent products and activity.
- **Website Builder:** six page previews, ten block types, add/reorder/hide/remove, three themes, editable copy, image and product selections, accent/font/spacing controls, real 1100/768/390 CSS-pixel previews, undo/redo, review and local publication, published version history and restore-to-draft. Published products and pages are snapshots.
- **Catalog:** grid/table, search, filters, bulk archive, product CRUD, prices/stock/SKU validation, confirmed facts, prepared listing generation, six supplied mug treatments, uploaded image preview, SEO fields, review and approval. Approved products appear in downstream selectors.
- **CSV import:** quoted commas/newlines, mapping preview, required-column validation, duplicate-SKU skip/update choice, per-row errors, valid-row import, downloadable sample. CSV limit: 5 MB.
- **Ad Studio:** product briefs, three visual variations, Meta/Google/TikTok previews, static/carousel/storyboard modes, editable copy and CTA, crop/layout controls, scene reordering, versioned library saves, duplication, JSON/TXT export, and PNG export for static artwork or each selected carousel card.
- **Campaigns:** creation wizard, creative snapshots, budget reservation, approval before launch, scheduling, pause/resume, search/filter/sort, period charts and aggregates, details, CSV export, and next-day simulation.
- **Budgets:** monthly cap, channel and campaign allocations, spend/remaining/forecast, validation against actual spend, $800 reference recommendation, before/after review, approval/rejection, history, stale-proposal handling, monthly rollover, JSON export.
- **Agents and approvals:** prepared staged jobs, visible progress, cancellation, chosen failure scenarios, retry, task/artifact links, version checks, idempotent approval, persistent decision journal.
- **Operations:** 399 reconciled baseline orders, filters/pagination, fulfillment progression, synthetic receipts, local refund-request notes, support conversations, product/order-grounded replies, demo sending, editable metadata and completeness checks.
- **Settings:** store identity, local domain setup preview, demo connection states, normal/fast generation, deliberate failure scenarios, export, reset with confirmation.
- **Global navigation:** command-K search across products/campaigns/pages, notification links, contextual assistant, mobile navigation and builder tabs.

## The shared demo model

The baseline date is **2026-10-24**, in UTC and USD. Monetary values are integer cents. The three active campaigns total **$31,920 revenue**, **$9,000 spend**, **830,000 impressions**, **18,000 clicks**, and **399 purchases**. Each purchase corresponds to a unique order, and daily event rows reconcile with order lines. The approved monthly cap is **$12,000**.

The budget scenario moves $500 from Meta and $300 from TikTok to Google, resulting in **$5,500 / $4,400 / $2,100**. It updates channel and campaign allocations without increasing the cap. Forecasts use elapsed calendar days of the simulated month. New campaigns begin with zero history. Paused campaigns keep their history without accruing new simulated events.

State is stored under `runmystore.workspace.v1` in localStorage. Uploaded PNG/JPEG/WebP files (up to 10 MB) are resized locally to a maximum 1400-pixel edge and stored as WebP data URLs. They are not replaced with unrelated sample treatments. Storage errors preserve the in-memory session and show export/reset recovery guidance. A corrupted saved workspace is not overwritten automatically.

## Five-minute walkthrough

1. Open the landing page, then **Open demo**.
2. In **Catalog Studio**, open the draft mug, add its known material, generate copy, then review and approve. Alternatively create a new product.
3. In **Website Builder**, include the product, edit the hero, preview desktop/mobile, and choose **Review & publish**. Open the published demo.
4. In **Ad Studio**, select the same product, generate concepts, refine one, save it, and choose **Use in a campaign**.
5. Complete the campaign wizard and submit for review. In **Approvals**, approve and launch. The new campaign has zero results until **Simulate next day**.
6. In **Budgets**, review the $800 move and approve it. Inspect the decision history and **Agent workspace**.

Use **Settings → Demo controls → Reset demo workspace** before repeating the presentation. Export first to retain edits.

## Verification and boundaries

See [VERIFICATION.md](./VERIFICATION.md) for actual checks and remaining browser acceptance work. The StoreOS references were sanitized into inert markup: no captured scripts, analytics, Tally forms, extension bundles, external account links, or live execution are retained. All operations use browser data; the only normal network requests when hosted are static site assets.

AgenticOrg is a **workflow preview, simulated**. No AI model, provider account, advertisement, payment, email, shipment, or customer-message action is actually executed. This prototype does not satisfy a requirement for real AgenticOrg execution by itself.

The original Geist, Instrument Serif, Anton fonts, sky/night imagery, and video were absent from the supplied bundle. Inter/JetBrains Mono/Georgia and sky gradients are recorded fallbacks. The film frame opens a local walkthrough entry. Exact pixel fidelity and visual accessibility have not been certified.

## Source layout

```text
src/domain.ts              Typed entities, fixtures, calculations, state transitions
src/store.tsx              Shared state, persistence, staged local jobs
src/Workspace.tsx          App shell, routing, search, assistant
src/pages/                 Connected capability screens
src/generated/landing.html Sanitized reference markup
src/styles.css             Theme, components, responsive layouts
public/assets/             Supplied local imagery and fallback fonts
scripts/                   Reference conversion, direct-open build, render checks
tests/domain.test.ts       State/calculation regression checks
asset-manifest.json        Reference assets and known fidelity gaps
```
# RunMyStore
