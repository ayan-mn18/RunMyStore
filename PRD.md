# RunMyStore — Product Requirements Document

**Version:** 1.0  
**Date:** 24 October 2026  
**Deliverable:** Responsive, frontend-only hackathon prototype with realistic mock data  
**Product name:** RunMyStore  
**Implementation status:** Specification only; the application has not been built by this document.

## 1. Product definition

RunMyStore helps a business owner build and operate an online store from one workspace. The owner can create a storefront, prepare a product catalog, generate ad concepts, track campaigns, manage budgets, and review proposed changes through a conversational assistant.

**Problem:** Running an online store requires a merchant to coordinate website changes, product information, advertising, orders, customer questions, and spending across multiple tools.

**Product promise:** “You run the business. RunMyStore runs the store.”

**Prototype goal:** Demonstrate the complete merchant experience through working UI interactions. A presenter must be able to create a catalog item, use it on a storefront, create an ad for it, attach that ad to a campaign, and adjust that campaign's budget without leaving the prototype.

### Non-negotiable constraints

1. Frontend only: no backend, database server, serverless functions, or application API routes.
2. All AI generation, integrations, imports, analytics, and operational events use deterministic mock data or local browser processing.
3. No real LLM, AgenticOrg, ad-network, commerce, payment, shipping, email, or messaging calls.
4. The landing page reproduces the supplied StoreOS reference with pixel-level fidelity, subject to the explicitly listed RunMyStore branding and demo changes.
5. Website Builder, Catalog Studio, Ad Studio, Campaigns, and Budgets must be complete interactive modules, not “coming soon” cards.
6. Shared data must remain consistent across modules and survive a browser refresh on the same browser and origin.
7. Simulated results must be identified as demo data. The UI must not imply that money was spent, a real store was migrated, an ad was delivered, or an external account was connected.

## 2. Users and primary jobs

| User | Job to complete | Prototype outcome |
| --- | --- | --- |
| First-time merchant | Turn products and a brand idea into a storefront | Editable catalog and a locally viewable store preview |
| Existing store owner | Refresh a store and prepare a promotion | Approved local website revision and campaign draft |
| Growth marketer | Produce ad variations and review performance | Saved creatives, campaign comparisons, and an actionable budget scenario |
| Hackathon presenter | Demonstrate an understandable end-to-end product | A repeatable five-minute flow with visible agent steps and approvals |

The default demo store is **Northwind**, a fictional global lifestyle retailer. Use English, USD, and consistent dates. Other storefronts in the landing-page gallery remain illustrative designs, not RunMyStore customers.

## 3. Scope and priorities

**P0:** Required for the primary demo and release acceptance.  
**P1:** Required supporting capability screens, with a bounded interaction depth.  
**Later:** Not part of this prototype.

| Capability | Priority | Required depth |
| --- | --- | --- |
| Reference-matched landing page | P0 | Full desktop/mobile page and functional entry points |
| Demo onboarding and store setup | P0 | Start from sample store, local CSV, or a simulated URL import |
| Overview dashboard and assistant | P0 | Linked metrics, actionable recommendations, and contextual assistant |
| Website Builder | P0 | Structured page editing, prompt-driven presets, preview, revision history, local publish |
| Catalog Studio | P0 | Product/variant editing, local import, preset image treatments, copy drafts, approvals |
| Ad Studio | P0 | Static, carousel, and storyboard concepts with editable copy and exports |
| Campaign tracking | P0 | Campaign creation, filtering, charts, details, pause/resume, creative linkage |
| Budgeting | P0 | Allocations, pacing, forecasts, alerts, and reviewed reallocation |
| Agents and approvals | P0 | Clearly simulated AgenticOrg-style task execution and persistent decision history |
| Orders, payments, shipping | P1 | Searchable orders, detail timeline, local fulfillment progression, mock payment status |
| Customer support | P1 | Seeded conversations, draft replies, local sent-message simulation |
| Discoverability | P1 | Editable SEO metadata, structured product preview, deterministic issue checks |
| Domain and hosting | P1 | Domain form, simulated validation, local store URL, publication history |
| Integrations and settings | P1 | Demo connection states, preferences, reset, export |
| Real AgenticOrg/LLM, commerce or ad integration | Later | Separate implementation requiring backend and credentials |
| Real payment collection, refunds, ad spend, shipping or messages | Later | Out of scope |
| General-purpose code generation or arbitrary website cloning | Later | Builder uses a defined component/schema system |

P1 screens must have useful content and the bounded interactions specified below. They do not need the depth of a real ERP, ad manager, help desk, or payment processor.

## 4. Experience and navigation

### Entry flow

`Landing → Open demo / Show me my store → Demo onboarding → Overview → Product workspace`

No registration or real login is required. “Open demo” enters a seeded Northwind session immediately. A mock profile menu represents the merchant; it must not collect passwords or suggest that authentication is implemented.

### Routes

```text
/
/onboarding
/app/overview
/app/website
/app/catalog
/app/catalog/:productId
/app/ads
/app/ads/:creativeId
/app/campaigns
/app/campaigns/:campaignId
/app/budgets
/app/orders
/app/orders/:orderId
/app/inbox
/app/discoverability
/app/agents
/app/approvals
/app/settings
/store/:storeSlug
/legal/privacy
/legal/terms
```

Unknown routes display a useful not-found page. Invalid entity IDs offer a route back to the relevant list. Static hosting must support deep links using an SPA fallback; hash routing is an acceptable deployment choice where rewrites are unavailable.

### Workspace shell

- Desktop sidebar: Overview; Website Builder; Catalog Studio; Ad Studio; Campaigns; Budgets; Orders; Inbox; Discoverability; Agents; Approvals; Settings.
- Group the navigation visually into Store, Growth, and Operations without nesting several submenu levels.
- Top bar: current store, page title, contextual action, notification tray, and merchant avatar.
- One persistent, understated **Demo workspace** indicator. Detail screens add “Simulated” next to relevant execution states.
- A contextual “Ask RunMyStore” panel is available from every main page. It receives the selected product, campaign, or page context.
- Notifications open the specific task, approval, stock warning, or budget alert they describe.
- On small screens, the sidebar becomes a drawer and secondary editing panels become tabs or sheets.

## 5. Landing-page fidelity contract

### Reference authority

Use the supplied saved HTML and its companion assets as the design source of truth:

- [Saved StoreOS HTML](</Users/bizer/Downloads/storeOS – The AI-native operating system for e-commerce.html>)
- [Saved asset directory](</Users/bizer/Downloads/storeOS – The AI-native operating system for e-commerce_files/>)
- Primary source CSS: `110h1qsw6-acw.css` and `1vjswq1xn0fa1.css`.

The saved HTML contains legacy wrappers as well as the active `.v2` layout. The rendered `.v2-desktop` and `.v2-mobile` versions determine the intended page. Do not accidentally render both navigation bars, both footers, or both responsive versions.

Match the original section sequence, proportions, typography, content density, backgrounds, gradients, image crops, borders, spacing, fixed/sticky behavior, and interaction states. Do not redesign the reference into a generic SaaS landing page.

### Required sections, in reference order

| Section | Reference content/visual | Required behavior |
| --- | --- | --- |
| Navigation | Wordmark, four anchor links, rounded early-access CTA | Anchors scroll to matching sections; CTA opens the demo |
| Hero | Dark background, orange glow, large serif headline, URL pill, proof row | URL input validates and enters simulated onboarding |
| Store gallery | Horizontal strip of product-category storefronts | Preserve crops, order, card proportions and motion; accessible static alternative |
| Partner strip | Small marks/labels with generous space | Preserve geometry; use accurate demo/context labels |
| Product-film section | “One message. A real store.” and a video frame | Preserve video container and controls; see missing-media requirements |
| Conversational redesign | “Say it. Watch it appear.” with three storefront looks | Festive, bold and warm selections visibly change the example |
| Problem section | “Eight tools. One tired person.” with operational fragments | Preserve composition, connectors, example data treatment and spacing |
| Capability tiles | Build, Host, Sell, Ship/Get paid, Get found, Answer customers, Change anything | Preserve all seven image-led tiles and their layout |
| Apparel rail | NORTHWIND clothing rail with selectable colours | Selection updates name/image/price; “Add to bag” changes a local example count |
| Everyday work | Catalog transformation, ad previews, shipping timeline | Preserve all three examples and image arrangements |
| Bring your store | Three-step explanation and import preview | URL form launches the same onboarding as the hero |
| Integrations | Channel/service diagram on a sky background | Decorative example marks remain examples; detail opens a local demo explanation |
| FAQ | Eight expandable questions and short answers | Keyboard-accessible accordion; copy updated for the prototype's actual scope |
| Closing CTA | Floating storefront imagery around the final headline/form | Same entry behavior as the hero |
| Footer | Brand statement, company/legal links, lower brand strip | Local, meaningful links; no submission to StoreOS contacts |

### Allowed differences from the reference

1. Replace StoreOS/storeOS branding, page metadata and brand mentions with RunMyStore.
2. Hero headline: **“You run the business.” / “RunMyStore runs the store.”** Preserve the two-part hierarchy, serif treatment and orange italic emphasis.
3. Replace early-access/waitlist actions with **Open demo** while retaining the CTA placement and styling. URL CTA remains **Show me my store**.
4. Replace the unsupported “60 brands” claim with **“Explore 12 example storefronts”** in the same proof slot.
5. Do not carry over StoreOS's NVIDIA membership, business-partner claims, email address, social profiles, or customer assertions as RunMyStore facts. Preserve those areas' visual weight using clearly labelled demo/context content. AgenticOrg may be described as the planned hackathon orchestration platform, not a verified connection or partnership.
6. Replace the external Tally waitlist with a local onboarding dialog/page. Do not load the saved Tally scripts, telemetry, extension scripts, or donor-site analytics.
7. FAQ/legal copy explains a browser-local demo. It must not promise actual migration, hosting, payments, or a commercial service already operating.

Only these specific copy/branding areas may differ in visual comparison. A new section, different palette, altered composition, or missing illustration is not an approved exception.

### Extracted visual tokens

| Token | Reference value |
| --- | --- |
| Dark ink | `#0d0b09` |
| Elevated dark | `#130f0c` |
| Warm cream | `#f4efe6` |
| Elevated cream | `#fbf8f2` |
| Secondary cream | `#ece5d7` |
| Main text | `#17130f` |
| Muted text | `#6b6358` |
| Ember accent | `#ff9a4d` |
| Deeper ember | `#d4531a` |
| Soft ember | `#ffab6e` |
| Dark-section text | `#f6f0e6` |
| Hero CTA gradient | `115deg: #ffd27a → #ff9a4d at 55% → #e8622f` |
| Primary easing | `cubic-bezier(.16, 1, .3, 1)` |
| Body / utility typography | Geist / Geist Mono |
| Editorial typography | Instrument Serif, regular and italic |
| Additional reference face | Anton, where actually used by the reference |

Important geometry from the source:

- Responsive desktop switch at **768 px**; separate mobile compositions below it.
- Desktop navigation: 76 px high with 40 px horizontal padding.
- Main desktop content wrapper: max-width 1160 px with 40 px inline padding.
- Hero inner wrapper: max-width 980 px with 24 px inline padding; hero top padding 128 px.
- Desktop hero type: `clamp(56px, 7.6vw, 112px)`, weight 400, line-height .96, letter-spacing -.025em.
- Mobile hero type: 56 px, weight 400, line-height .98, letter-spacing -.025em; mobile section-specific rules still apply.
- URL pill: maximum width 680 px, height 68 px, fully rounded, source-specific mobile adjustments.
- Gallery cards: aspect ratio 3:4; source height uses `clamp(320px, 46svh, 560px)`.

These values are extracted anchors, not a replacement for the full cascade. Later source rules override earlier rules, including gallery animation duration and section backgrounds.

### Asset readiness and known gaps

The saved folder includes the storefront thumbnails, catalog before/after images, apparel colours, ad sample images, and logo SVGs. Reuse the supplied visual assets for the reference reproduction; keep landing showcase assets separate from transactional catalog fixture data.

The inspected bundle does **not** contain several referenced dependencies:

- Geist, Geist Mono, Instrument Serif regular/italic, and Anton `.woff2` files.
- `/v2/sky-a.webp`, `/v2/sky-a-m.webp`, `/v2/sky-b.webp`, `/v2/sky-b-m.webp`, and `/v2/night.webp`.
- `/v2/film-poster.webp` and `/film/storeos-demo.mp4`.

Create an asset manifest during implementation and resolve every used image, CSS background, font, and poster to a local asset. Relative Next.js font/media paths must be corrected. Obtain the exact missing reference assets before declaring pixel-level completion. Temporary fallbacks may keep development moving but must be recorded as fidelity gaps. Replacing the StoreOS film with a RunMyStore demo requires an explicitly recorded media exception; its container must still match.

### Visual acceptance

- Compare source and implementation at **1440×900**, **1280×800**, **768×1024**, and **390×844** using the same browser, device scale, loaded fonts, scroll position and interaction state.
- Capture full-page and section screenshots. Freeze marquees, reveals and other motion at the same deterministic frame for comparison, then verify motion separately.
- Use a 50% opacity overlay and image diff. Outside the allowed copy/brand regions, require no obvious double edges, no missing elements, and major layout anchors within 2 CSS px of the reference.
- The numeric tolerance is a verification aid; it does not excuse visibly wrong typography, crops, shadows, colours, or section heights.
- Check exactly one responsive layout at 767 px and 768 px. Also check 360 px for overflow and text clipping.
- “Pixel-perfect” is a completion claim only after these comparisons pass and missing assets are resolved. This PRD is not a claim that the prototype has already passed.

## 6. Product UI design requirements

Carry the landing page's warm neutral palette and ember accent into the application. Use restrained serif display headings and readable Geist text for data, forms, tables and navigation. Use colour sparingly so status and primary actions remain distinguishable.

- Desktop sidebar around 224 px; top bar around 64 px; consistent 24–32 px content spacing.
- Neutral surfaces, thin borders, compact charts, meaningful product imagery, clear labels.
- Tables use tabular numerals. Amounts align consistently and include currency context.
- Primary actions describe outcomes: **Generate catalog draft**, **Preview changes**, **Create campaign**, **Apply allocation**.
- Statuses use text/icons as well as colour: Draft, Needs review, Approved, Demo live, Paused, Failed, Scheduled.
- Maintain selected inputs when switching panels or opening a preview.
- Loading states occupy the expected layout; avoid full-screen spinners during local edits.
- Every visible control either performs a meaningful local action or explains its prototype boundary. No silent no-op controls or broken `#` links.

## 7. P0 functional requirements

### 7.1 Demo onboarding

Provide three entry options: **Explore Northwind**, **Use a catalog CSV**, and **Preview a store import**.

The merchant provides store name, category, audience, tone, accent colour and currency. Defaults allow immediate entry. A submitted URL is validated and displayed as context only; it is never fetched. The import screen explicitly says it is using sample products and pages.

Show deterministic stages: preparing sample data → mapping products → assembling preview → ready for review. The user can go back, edit settings, or cancel. Cancellation leaves previously saved data intact.

**Acceptance:** any valid URL leads to a labelled sample preview; malformed URLs show inline errors; no network request goes to the submitted store; the selected store identity appears across the app.

### 7.2 Overview and assistant

Overview displays store sales from demo orders, campaign-attributed revenue, orders, ad spend, ROAS, budget remaining, and a daily sales/spend chart. Identify the source and period of each metric so campaign revenue is not confused with total store revenue.

Show actionable cards for an incomplete product, a pending site revision, a campaign budget warning, and a customer reply. Cards open the relevant entity or approval.

The assistant supports bounded intents, including:

- “Build a warm storefront for my products.”
- “Create a catalog draft for this mug.”
- “Create an Instagram ad for this collection.”
- “How did my campaigns perform this month?”
- “Move $800 to Google without increasing the total budget.”

Use local intent matching and curated responses. Responses interpolate current store data and link to real local drafts; they are not static paragraphs disconnected from application state. Ask a clarifying question when a required product or campaign is not selected. For unsupported requests, explain the available demo actions and preserve the user's input.

**Acceptance:** executing a supported request creates or opens the actual local draft; KPI values agree with Campaigns and Budgets; unsupported input never implies an external action happened.

### 7.3 Website Builder

**Layout:** pages/sections panel, central storefront canvas, contextual properties panel, and an optional assistant panel. Provide desktop, tablet and mobile preview widths.

**Supported pages:** Home, Collection, Product detail, About, Contact and Cart preview. A real checkout is outside scope.

**Supported blocks:** announcement bar, navigation, hero, featured collection, product grid, image/text story, testimonial examples, newsletter form, FAQ and footer. Testimonials are marked as sample content.

**Interactions:**

- Choose one of three curated looks: Warm, Bold or Minimal.
- Edit headline, copy, images, buttons, brand colour, fonts, spacing presets and product collections.
- Add, remove, hide and reorder blocks. Provide move-up/down controls as an accessible alternative to dragging.
- Preview preset requests such as changing the hero, adding a collection, applying a seasonal look, or changing the accent colour.
- Show a before/after or change-list review identifying exactly which fields will change.
- Save draft, undo/redo edits, request approval, and publish an approved revision to `/store/northwind`.
- Keep draft and published schemas separate. Unapproved edits never alter the published demo view.
- Restore an earlier published revision through a visible confirmation and record the restoration.

**Demo publishing:** label the result **Published to demo** and provide a local preview link. No DNS, hosting deployment, source-code generation or public-domain claim is involved.

**Acceptance:** changing a catalog product changes its draft storefront representation; publication uses an approved snapshot; a page reload preserves draft/published distinctions; responsive preview actually changes layout.

### 7.4 Catalog Studio

**List:** grid/table toggle; search; collection, status and stock filters; product count; completeness indicator; bulk selection; add/import actions.

**Product editor:** name, description, SKU, collection, price, currency, product images, alt text, material/attributes, variant options, stock quantity, SEO title/description and draft/published state.

**Creation flow:**

1. Select the supplied sample product image or choose a local image for browser preview.
2. Enter the product type and known facts; clarify missing facts such as material, price and variants.
3. Generate a mock listing draft from a finite template using those facts.
4. Compare source input and draft, edit it, and approve the product.
5. Add it to a collection and make it available to the website and ad pickers.

**Image-treatment flow:** use the supplied mug assets to demonstrate Studio, Colour, Detail, Flat lay, In hand and Lifestyle treatments. Each tile uses a clearly labelled prepared sample. An arbitrary uploaded photo is previewed as-is; do not present unrelated sample renders as a transformation of that photo.

**CSV import:** include a downloadable sample CSV. Parse supported columns locally, preview row mappings, validate required fields, identify duplicate SKUs and show per-row errors before committing valid rows. Support quoted CSV values; do not parse by simply splitting on commas. Explicit confirmation chooses skip or update for existing SKUs. No file is uploaded.

**Acceptance:** imported products are editable and persistent; invalid prices/quantities cannot be committed; missing facts remain missing until supplied; bulk actions update counts; downstream selectors receive the new product IDs.

### 7.5 Ad Studio

**Inputs:** product/collection, campaign objective, audience description, region, platform, tone, offer, destination page and creative format.

**P0 preview platforms:** Meta/Instagram, Google Display and TikTok. Platform preview styling is illustrative, not a claim of an authenticated platform connection or certification.

**Formats:** static image, 3–5-card carousel, and short-video storyboard. The video option provides ordered scenes, timing, captions, voiceover text and asset suggestions; it does not render a new MP4.

**Output:** three prepared design/copy variations assembled from the selected catalog product, brand settings and local layout templates. Show editable headline, body, CTA, destination and creative dimensions.

**Interactions:** regenerate through a finite variation set, edit copy, choose image crop, reorder carousel cards, preview placements, duplicate, save to library, and attach to a campaign draft. Track a version for each saved creative.

**Exports:** download copy/storyboard as TXT or JSON and an implemented static/carousel image format such as PNG. Export buttons must not promise unsupported formats. Image rendering uses local canvas or an equivalent browser-only implementation.

**Acceptance:** selected product names/prices and image assets carry into the creatives; saving preserves edits; campaign selection references the saved creative version; “launch” routes to Campaigns and never spends money.

### 7.6 Campaigns and tracking

**List columns:** name, platform, objective, status, budget, spend, impressions, clicks, purchases, attributed revenue and ROAS. Provide search, status/platform filters, date range, sorting and a CSV export.

**Create wizard:** name/objective → select products → choose saved creative → select audience/platform → dates/budget → review → launch in demo.

**Detail tabs:** Overview, Creatives, Audience, Budget and Activity. Overview includes daily spend/revenue, funnel counts and period comparisons. Creative rows open the actual saved variation and its seeded performance data.

**State transitions:** Draft → Needs review → Scheduled or Demo active; Demo active ↔ Paused; Scheduled can be cancelled back to Draft. End dates lead to Completed on an explicit demo-time advance.

**Tracking behavior:** metrics come from shared daily fixtures. A newly created campaign begins with zero results. **Simulate next day** appends a deterministic day's demo events for active campaigns only. Pausing preserves historical results; resuming does not backfill days while paused. Changing a date filter changes every relevant chart and aggregate together.

**Acceptance:** launch requires a saved creative, valid dates and an approved budget; pause/resume changes status and future simulated activity; historical spend remains unchanged; newly generated results reconcile with Budgets and Overview.

### 7.7 Budgets

**Views:** monthly cap, spent, remaining, projected month-end spend, per-channel allocation, per-campaign allocation, pacing chart and alerts.

**Interactions:** change a monthly cap; adjust allocations through numeric inputs/sliders; compare current and proposed allocations; review a seeded recommendation; approve or reject; inspect history; export a budget summary.

**Validation:** nonnegative money in integer minor units; allocated totals cannot exceed the monthly cap; campaign allocations cannot exceed the parent channel's allocation. An allocation reduction below already-spent amounts is blocked. Allow unallocated funds and show them explicitly.

**Definitions:**

- Remaining monthly budget = monthly cap − actual demo spend. A negative result is displayed as overspend, not clamped to zero.
- Unallocated budget = monthly cap − sum of approved channel allocations.
- Forecast = month-to-date spend ÷ elapsed calendar days × calendar days in month.
- Pacing ratio = spend ÷ expected spend to date, where expected spend = allocation × elapsed days ÷ days in month.
- Compare forecast with the appropriate monthly/channel allocation to flag a possible overspend.
- Zero-day or zero-denominator cases display “— / Not enough data.”

Recommendations explain their arithmetic and the source period. They are planning scenarios, not promised ROI improvements. Applying an approved reallocation updates campaign/channel views and activity history while preserving the total cap.

**Acceptance:** invalid allocation sums cannot be applied; changes persist; a rejected proposal does not alter budgets; a previously approved proposal becomes stale if its underlying budget version changes; forecasts use the simulated date rather than the real device clock.

### 7.8 Agent workspace and approvals

This is a **simulation of the planned AgenticOrg integration**, implemented entirely in browser state.

Display a RunMyStore Operator coordinating illustrative Store Builder, Catalog, Creative, Campaign Analyst and Budget Planner roles. These are proposed product roles, not claims that those exact agents are preinstalled in AgenticOrg.

Each task shows the request, scoped store context, planned steps, simulated tool calls, outputs, status, timestamps and linked artifacts. Example tool labels include `read_catalog`, `prepare_site_revision`, `draft_creatives`, `read_campaign_metrics` and `propose_budget_change`.

**Task states:** Queued → Running → Needs input / Awaiting approval → Completed; also Failed and Cancelled. Use concise progress descriptions, not fabricated internal model reasoning.

**Approval card:** proposed changes, before/after values, affected products/campaigns, validation notes, creator and creation time. Approve, reject with reason, or edit draft. The final apply/publish button names the local demo action.

- Approve once: a repeated click must not apply changes twice.
- Reject: leave existing published data and budgets unchanged.
- Edit after approval: invalidate the old approval and require review of the new version.
- Cancel during generation: clear timers and prevent delayed application of results.
- Retry after a demo failure: reuse the same job/artifact identity or otherwise prevent duplicates.

**Acceptance:** approving a site revision or budget proposal changes the corresponding local module; simulated steps can fail and recover; approval/activity records survive refresh; no real integration status is shown.

## 8. P1 supporting capabilities

| Screen | Required content | Required local interaction |
| --- | --- | --- |
| Orders | Seeded orders, customer alias, products, totals, payment and fulfillment states | Filter/open an order; progress a selected eligible order through Packed → Picked up → In transit → Delivered |
| Payments | Payment state and transaction reference inside order detail | Open a synthetic receipt; view a simulated decline/refund request; no financial action |
| Shipping | Tracking timeline, carrier label, last update and customer notification draft | Advance a demo shipment; update its timeline and local notification |
| Inbox | Seeded conversations about products, shipping and returns | Generate a catalog/order-grounded canned reply; edit; “Send in demo” appends locally |
| Discoverability | Product/page metadata, preview snippets, structured product fields and issue list | Edit title/description/alt text; rerun deterministic completeness checks |
| Domain and hosting | Store slug, local preview URL, draft/published revision and custom-domain field | Validate domain syntax and show simulated setup steps; never label DNS as verified |
| Integrations | AgenticOrg, Shopify, WooCommerce, Meta, Google, TikTok, Plural, email and shipping cards | Open capability detail; switch explicit demo states such as Not configured, Demo connected and Demo error |
| Settings | Store identity, currency display, timezone, preferences and demo controls | Export local state; reset with confirmation; adjust demo speed/failure scenario |

Discovery scores are completeness scores, not Google rankings or predictions of appearance in AI search. Third-party credentials are not requested or stored in this prototype. Real invoice, shipping-label or legally binding policy generation is not represented as completed.

## 9. Mock data and calculation contract

### Single coherent baseline

- Store: Northwind; currency USD; reporting timezone UTC.
- Reporting period: 1–24 October 2026 inclusive; simulated current date 24 October 2026.
- 24 published products across Apparel, Bags, Accessories and Home; several have seeded completeness or stock issues. Additional drafts are counted separately.
- Three seeded active campaigns, one per paid channel, and two zero-spend drafts.
- Seeded order/event factories must reconcile to the campaign rows below. Include paid and non-paid order states where useful; only qualifying completed payment events contribute to revenue.
- Populate support, shipment, approval and activity records with references to those same entities.

| Channel | Monthly allocation | Spend to date | Attributed revenue | Impressions | Clicks | Purchases |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Meta | $6,000 | $4,200 | $15,120 | 350,000 | 7,000 | 189 |
| Google | $3,600 | $3,300 | $13,200 | 180,000 | 6,000 | 165 |
| TikTok | $2,400 | $1,500 | $3,600 | 300,000 | 5,000 | 45 |
| **Total** | **$12,000** | **$9,000** | **$31,920** | **830,000** | **18,000** | **399** |

Use daily records whose sums produce these totals. Do not hardcode a different number into a KPI tile, chart, table, report or assistant answer. Campaign purchases map to 399 unique attributed demo orders; attribution does not duplicate an order between campaigns. If organic orders are included, keep them separate and calculate total store sales from the full qualifying order set.

### Baseline expected calculations

- Campaign ROAS: 31,920 ÷ 9,000 = **3.55×** displayed.
- CTR: 18,000 ÷ 830,000 × 100 = **2.17%**.
- CPC: 9,000 ÷ 18,000 = **$0.50**.
- Click-to-purchase conversion: 399 ÷ 18,000 × 100 = **2.22%**.
- Cost per attributed purchase: 9,000 ÷ 399 = **$22.56**.
- Remaining monthly budget: **$3,000**.
- Month-end spend forecast: 9,000 ÷ 24 × 31 = **$11,625**.
- Google's forecast: 3,300 ÷ 24 × 31 = **$4,262.50**, or **$662.50 above** its allocation.

The primary budget recommendation moves **$500 from Meta and $300 from TikTok to Google**, producing allocations of **$5,500 / $4,400 / $2,100** and preserving the **$12,000** total. It is supported by current pacing; it does not claim that changing allocation guarantees higher revenue.

### Calculation rules

- Calculate ratio KPIs from aggregate numerators/denominators, not averages of row percentages.
- Round for presentation only. Store monetary values in cents and preserve calculation precision.
- Revenue means qualifying demo order revenue; document treatment of refunds, tax and shipping. Baseline attributed revenue is product revenue before tax/shipping, with no refunded baseline orders.
- Date comparison uses a matching prior period only when those fixtures exist; otherwise display unavailable, not an invented percentage.
- Empty or zero denominators display an explanatory dash. Zero spending is not infinite ROAS.
- “Simulate next day” advances one shared demo clock, records additional metrics/orders deterministically, and updates all dependent selectors.
- After 31 October, monthly budgets require a new-period record; October spend and allocations remain in history.

### Core entities

```text
Store: id, name, slug, currency, timezone, brandSettings
Product: id, sku, title, description, collectionId, variants, media, status
Variant: id, attributes, priceMinor, stockQuantity
SiteRevision: id, storeId, version, pageSchema, status, basedOnVersion
Creative: id, productIds, platform, format, copy, assetRefs, version, status
Campaign: id, creativeVersionIds, productIds, platform, objective, dates, status
DailyMetric: campaignId, date, spendMinor, impressions, clicks, purchases, revenueMinor
BudgetPlan: id, month, capMinor, channelAllocations, campaignAllocations, version
Order: id, items, productRevenueMinor, paymentStatus, campaignId, fulfillmentStatus
Conversation: id, customerAlias, productId/orderId, messages
AgentRun: id, request, role, contextRefs, steps, status, outputRefs, timestamps
Approval: id, artifactRef, artifactVersion, before, after, status, decisionReason
ActivityEvent: id, entityRef, action, timestamp, demoFlag
DemoState: schemaVersion, simulatedDate, seed, preferences, entities
```

Draft artifact versions and approved versions must be distinguishable. Referenced products/creatives cannot be silently hard-deleted; archive them or explain which dependent records prevent deletion.

## 10. Frontend implementation boundaries

Recommended implementation: React + TypeScript + Vite, a client router, reusable UI components, a shared state store, schema validation and a chart library. Equivalent frontend tooling is acceptable. This is a separate RunMyStore project; no changes to the existing Optimus production application are required.

### State and persistence

- Keep fixtures and local business logic outside presentation components.
- Expose a typed mock service interface so pages use consistent calls such as `generateCatalogDraft`, `prepareSiteRevision`, `launchDemoCampaign` and `applyApprovedAllocation`.
- These calls return local promises; they do not fetch application APIs.
- Persist serializable app state under a versioned RunMyStore localStorage key. Store uploaded images in IndexedDB if persistence is supported; do not depend on object URLs surviving reload.
- Use a separate schema-version check and safe reset prompt for incompatible or corrupted saved state.
- Handle storage quota errors visibly without losing the current unsaved draft.
- Scope state to the browser/origin. Cross-device, cross-user and account sync are not supported.

### Mock timing and controls

- Navigation/filter/edit feedback should be immediate.
- Prepared generation flows use short, deterministic delays: approximately 300–800 ms per step and 1–3 seconds overall in normal demo mode.
- Include a presentation control to speed up or skip mock delays.
- Provide selectable success, missing-input, validation-failure and retryable-error scenarios. Failures are triggered intentionally, not randomly during a presentation.
- Reloading an interrupted job leaves a recoverable draft/job state; it must not silently double-run or apply unfinished changes.

### File, URL and export handling

- CSV and images are read locally using browser APIs. Define visible type/size limits, e.g. 5 MB CSV and 10 MB image, and validate before parsing.
- Local URL imports use named fixture sets and disclose that behavior on the import result.
- Files exported as CSV escape spreadsheet formula prefixes in user-controlled text. JSON export excludes transient browser handles.
- URLs cannot execute JavaScript or inject HTML into previews. Storefront blocks render controlled schemas and sanitized text, not arbitrary script output.
- Bundle used demo images, fonts and icons so the happy path needs no third-party service at runtime. Normal static asset loading from the deployed site is permitted.
- Do not reuse captured analytics, extension, Tally, or unrelated Next.js runtime bundles merely to make the screenshot look correct.

## 11. AgenticOrg and hackathon positioning

Earlier planning included a real AgenticOrg API/SDK integration. The latest frontend-only requirement supersedes that implementation plan for this prototype.

**In this deliverable:** agent orchestration, tool calls, approval handling and audit history are local simulations. The Agents screen must say **“AgenticOrg workflow preview — simulated”**. Do not show a real API key form, successful provider authentication, live agent execution or an official integration badge.

**Requirement gap:** a UI simulation does not demonstrate actual use of AgenticOrg. If the hackathon requires real platform execution, this prototype alone will not satisfy that requirement. Organizer acceptance of a simulation or a separately scoped integration would be needed. This does not authorize adding a backend or live calls to the current deliverable.

**Future replacement points:** local service adapter → server integration; local task state → provider run state; local approval queue → authenticated approval service; fixtures → merchant-owned catalog/order data. Store IDs, entity versions and tool input/output shapes should remain explicit to make that replacement possible.

AgenticOrg's previously reviewed documentation distinguishes SDK/REST access, external MCP clients, remote MCP read tools and actual commerce/provider execution. Do not infer that a generic MCP connection implements storefront publishing or payments. Current hosted features and deployed contracts must be verified when a real integration is separately implemented.

References:

- [AgenticOrg API, SDK, MCP and A2A guide](https://agenticorg.ai/docs/api-sdk-mcp)
- [AgenticOrg workflows](https://app.agenticorg.ai/docs/workflows)
- [AgenticOrg commerce boundaries](https://agenticorg.ai/docs/commerce)

## 12. Accessibility and responsiveness

- Use semantic landmarks, headings, buttons, labels, tables and dialogs.
- All primary flows work by keyboard; dialogs trap and restore focus; Escape closes dismissible overlays.
- Match reference motion while respecting reduced-motion preferences. No required information depends on autoplay or animation.
- Provide text summaries/accessible tables for charts and alt text for meaningful product images.
- Desktop tables may scroll horizontally in their own labelled region; the page itself must not overflow sideways.
- At mobile widths, builder controls become Section / Preview / Properties tabs. Keep save/review actions reachable without covering content.
- Errors explain the field and recovery action. Toasts do not replace persistent validation or an accessible task result.

## 13. Performance and quality targets

These are prototype acceptance targets, not measured results:

- Initial static landing assets are sized appropriately; lazy-load below-fold image groups and app routes.
- Route changes and local filtering respond within roughly 100 ms after required assets are loaded on the test laptop.
- Avoid artificial waits for ordinary CRUD actions. Only simulated generation/execution uses staged delays.
- No broken images, unresolved fonts, layout shifts from unsized images, unhandled exceptions or runtime console errors on the main flow.
- The complete prepared demo works with third-party network access disabled after the site's static assets load.
- Tests should target state transitions, cross-screen propagation, calculation correctness and visual fidelity rather than reproducing component internals.

## 14. Five-minute presentation script

1. **0:00–0:30 — Problem and landing.** Show the reference-matched page, explain the merchant's fragmented workflow, click Open demo.
2. **0:30–1:20 — Catalog.** Select the sample mug, provide missing attributes, review prepared photo treatments/copy, and approve the product.
3. **1:20–2:10 — Website.** Add that product to a featured collection, ask for a warmer hero, inspect the change preview, approve and publish to the local store.
4. **2:10–3:00 — Ads.** Create three ad concepts using the same product, edit one, save it and attach it to a campaign draft.
5. **3:00–3:45 — Tracking.** Launch the new campaign in demo, show the seeded campaign dashboard, and explain current results versus the new campaign's zero-history state.
6. **3:45–4:30 — Budget.** Open Google's projected overspend, inspect the $800 reallocation, approve it, and show the updated allocations without changing the total cap.
7. **4:30–5:00 — Agent workflow.** Show the linked local task steps, approval history, and one rejected proposal. State clearly that this build is frontend-only and AgenticOrg execution is simulated.

Provide a Reset demo action and a seeded presentation start state. The presenter should not have to type lengthy prompts, sign in, configure external accounts, or wait for network services.

## 15. Acceptance checklist

| ID | Scenario | Pass condition |
| --- | --- | --- |
| LP-01 | Desktop/mobile landing comparison | All reference sections, imagery, typography and geometry match within the recorded visual criteria |
| LP-02 | Responsive breakpoint | No duplicated navigation/content at 767/768 px; mobile composition matches source |
| LP-03 | Landing entry | Hero, import and closing CTAs reach the working local onboarding |
| LP-04 | Assets and claims | Used assets resolve locally; no borrowed customer/partner claims or donor-site forms |
| ON-01 | Arbitrary URL | Validated URL produces a labelled fixture-based preview without fetching that site |
| CAT-01 | Product creation | Approved product appears in Catalog, Website Builder and Ad Studio selectors |
| CAT-02 | Import validation | Duplicate SKU, malformed CSV, invalid numbers and missing fields have recoverable errors |
| CAT-03 | Uploaded image | Preview remains the user's actual image; prepared sample treatments are not misattributed |
| WEB-01 | Edit and publish | Draft can be edited, reviewed and published locally; published revision stays unchanged before approval |
| WEB-02 | Versioning | Undo/redo and restore work; editing an approved artifact invalidates its old approval |
| ADS-01 | Ad generation | Three editable local variations reference selected catalog/brand values |
| ADS-02 | Creative reuse | Saved creative attaches to a campaign by ID/version and exports an implemented format |
| CMP-01 | Campaign lifecycle | Draft/review/schedule/active/pause transitions follow valid rules |
| CMP-02 | Simulated events | Only active campaigns accrue future demo events; historical metrics remain intact |
| MET-01 | Metric reconciliation | Baseline totals and formulas in section 9 match every related screen |
| BUD-01 | Reallocation | $500 Meta + $300 TikTok move to Google, preserving the $12,000 cap |
| BUD-02 | Budget errors | Oversubscribed or negative allocations cannot apply; zero denominators are handled |
| AGT-01 | Approval and cancellation | Reject/cancel does not mutate published state; approve applies exactly once |
| AGT-02 | Honest execution | AgenticOrg steps and external connection/payment states remain explicitly simulated |
| OPS-01 | Supporting screens | Orders, Inbox, Discoverability, Domain and Integrations each perform their specified local action |
| STATE-01 | Refresh | Saved products, revisions, creatives, campaigns, budgets and decisions persist |
| STATE-02 | Recovery | Failed jobs retry without duplicates; corrupted/full storage has a recovery path |
| STATE-03 | Reset | Reset restores the exact seed data and simulated date after confirmation |
| A11Y-01 | Keyboard/mobile | Main creation, editing, review and navigation paths work without a mouse and on mobile |
| NET-01 | Network inspection | No external generation, merchant fetching, advertising, payment, telemetry or messaging calls |
| DEMO-01 | Presentation | Full script runs repeatedly without setup or manual state repairs |

## 16. Implementation sequence and handoff

1. **Reference preparation:** verify local assets/fonts/media, establish deterministic landing screenshots, record approved branding differences.
2. **Foundation:** app shell, routes, design tokens, fixtures, shared selectors, local persistence and reset.
3. **Landing and store preview:** reproduce desktop/mobile sections and wire onboarding entry points.
4. **Merchant flow:** Catalog → Website Builder → Ad Studio, including actual shared artifact updates.
5. **Growth flow:** campaign metrics, lifecycle controls, budget allocations and calculations.
6. **Workflow and supporting UI:** assistant, approvals, agents, orders, inbox, discoverability, settings.
7. **Verification:** visual comparisons, cross-module checks, responsive/accessibility passes, deterministic presentation rehearsal.

Handoff must include application source, local assets, sample CSV, fixture seed/reset controls, a README with the static run/build commands, visual comparison evidence, known fidelity gaps, and the five-minute demo script.

**Definition of done:** all P0 and bounded P1 acceptance cases pass; the landing-page fidelity evidence is complete; every main workflow is interactive with consistent local data; and the project is accurately presented as a frontend-only prototype.
