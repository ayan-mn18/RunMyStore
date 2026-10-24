# RunMyStore — hackathon pitch

Open **presentation.html** directly in a current Chrome or Edge browser. It is a portable, single-file, 90-second presentation with embedded images and fonts. No server or network is required for its visuals.

- **Play pitch** runs the 90-second sequence. Space pauses/resumes.
- **Left / Right** move between the nine completed scenes, for a live presenter.
- **F** enters full screen; **N** opens speaker notes and chapter navigation.
- Recorded **Deepgram voice** replaces browser speech. Until generation completes, the button says **Narration pending** and the presentation remains silent. There is no system-voice fallback.
- **Open demo** opens the RunMyStore prototype. This relative link works while the file remains in this repository; the presentation itself can be copied anywhere.

## The story

1. A merchant becomes the connection between scattered tools.
2. RunMyStore connects product, storefront, creative, campaign and budget.
3. Catalog: merchant facts become an editable, reviewed listing.
4. Website: the same catalog powers a responsive storefront.
5. Ads: editable concepts for Meta, Google and TikTok.
6. Campaigns: spend, attributed revenue, purchases and calculated ROAS.
7. Budgets: an $800 planning transfer with an unchanged $12,000 cap.
8. AgenticOrg: the intended orchestration, with prototype boundaries explicit.
9. Invitation: one product, one campaign, one approved decision.

All business figures are the app's seeded demo data. AgenticOrg and external provider execution are simulated. Do not present the numbers as traction or the proposed architecture as a live integration.

## Edit and reproduce

`build/pitch.mjs` contains scenes, copy, timing, captions, speaker notes and product panels. `build/style.css` and `build/refinements.css` define the visual theme. `build/motion.js` uses Hyperframes' native Web Animations API adapter; `build/player.js` provides a separate direct-file player.

```sh
npm run build
npm run verify
npm run check
npm run dev
```

The Hyperframes composition is **index.html**; the standalone presentation is **presentation.html**. **storyboard.html** is a static scene sheet. The Hyperframes CLI is pinned to 0.8.78. Updating was blocked by the environment's approval service. Do not open index.html directly as a presentation; Hyperframes normally owns its timed scene visibility.

After the full browser check passes, render from this directory:

```sh
npm run render -- --quality delivery --output renders/runmystore-pitch.mp4
```

## Verification and remaining limitation

Passed: JavaScript syntax, nine contiguous scenes totaling 90 seconds, continuous caption coverage, unique IDs, local asset references, embedded standalone assets, controller play/pause/seek/replay behavior, and comparison of every highlighted commercial number with the actual app fixture model.

Hyperframes static lint passed with no errors. Its remaining warnings concern the monolithic nine-scene timeline and intentional reuse of the mug image across scenes and device previews.

Browser-based layout, motion, and contrast checks could not run: the sandbox rejected the local server (`listen EPERM 127.0.0.1`), then automatic approval review rejected the check and browser preview because its service returned **404: API deployment does not exist**. No screenshots or MP4 were rendered. Please visually rehearse the presentation before judging it ready for the stage.

Deepgram generation is pending. The sandbox could not resolve api.deepgram.com, and network approval failed because its review service returned 404. No API key was sent or stored. The speaker script in **SCRIPT.md** remains usable for live delivery.

## Recorded narration

Once network access is available, `npm run voice` prompts for a Deepgram key with hidden input. It also accepts `DEEPGRAM_API_KEY` through the process environment. Never put the key in HTML or committed files. The default is the expressive baritone `aura-2-jupiter-en`; `DEEPGRAM_VOICE` can select another Deepgram voice.

The script generates a natural scene-sized take, measures each file, aligns it with the scene and embeds the finished MP3. It refuses to clip words or accelerate a take by more than 8%. Reusable takes are cached by text and voice. `npm run voice:plan` previews the request without credentials or network calls. Caption text is a scene summary, not word-level alignment.

After generation, rerun the checks and listen to the full presentation. Recorded playback uses audio time as the animation clock. The standalone HTML embeds the track, so playback requires no API key or network connection.
