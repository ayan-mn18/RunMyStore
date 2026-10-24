# Verification record

## Passed

- TypeScript compilation and Vite production build.
- 13 domain tests: exact baseline/daily order reconciliation; filtered aggregates; $800 approved transfer; duplicate-decision prevention; rejection/stale versions; budget validation; immutable storefront snapshots; campaign approval/zero history; pause/no backfill; monthly rollover and spend limits; quoted CSV parsing/formula escaping; URL-scheme validation; immediate invalidation after edits; expired-campaign approval prevention.
- Static React rendering of 24 routes: all main modules, detail screens, onboarding, published store, legal content, and invalid entity/store IDs. No runtime exceptions or `NaN` output. Static rendering does not run browser effects or interactions.
- Direct-open artifact generation: bundled JavaScript, inline application CSS, file-relative assets, hash routing. No local server is necessary to open it.
- Saved-reference inspection: 49 local images, no captured script elements, no remote `src`, `href`, or form targets, and no missing provider-mask image paths after sanitation.

## Not verified — blocked by environment

The sandbox blocked listening on port 5174. Automatic approval review rejected the server-start escalation and the browser-open request because its approval service returned **404: API deployment does not exist**. A local headless Chrome attempt also could not start within the sandbox. No approval rejection was bypassed.

Therefore these checks remain outstanding:

1. Full browser click-through of the five-minute workflow in README.
2. Screenshots at 1440×900, 1280×800, 768×1024, 390×844 and 360 px width; 767/768 breakpoint comparison.
3. Source/implementation overlay comparison. Missing fonts/backgrounds/video remain documented fidelity gaps.
4. Keyboard focus/escape behavior, mobile overflow, actual chart readability, and visual contrast.
5. Browser refresh persistence, local upload/download interactions, interrupted task cancellation/retry, and quota-recovery flows.
6. Browser network inspection confirming that the runtime loads only local/static assets.

## Known prototype limitations

- Original StoreOS fonts and some media were not in the saved bundle. See `asset-manifest.json`; no pixel-perfect claim is made.
- AgenticOrg and commerce integrations are explicitly simulated.
- The video format is a storyboard, not a rendered movie. Carousel cards export individually as PNG; editable scene data exports as TXT/JSON.
- Uploaded images are compressed into browser-local data URLs rather than stored in IndexedDB. Quota errors show a warning and preserve the active session.
- Reporting stays in USD/UTC to preserve the fixture ledger; currency conversion and multi-store accounts are not implemented.
- The direct-open HTML must remain next to `public/`, and has not yet been exercised in a browser here.
- A reloaded in-progress task becomes recoverable Failed state. Its originating saved draft can be submitted again; in-memory retry callbacks do not survive reload.
