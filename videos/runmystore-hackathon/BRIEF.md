---
workflow: product-launch-video
flow: automation
storyboard: no
message: "RunMyStore connects the work of running an online store, from product to campaign, with the merchant in control."
destination: hackathon-stage
aspect: 1920x1080
language: en
audience: "AI for Commerce hackathon judges and merchants"
length: 90s
angle: "Merchant problem → connected workflow → concrete demo → agent orchestration → invitation"
narration: deepgram-requested
---

## Intent

Create a polished hackathon video ad or presentation for RunMyStore. Accurately explain the problem and the solutions provided. The user requested Hyperframes. Default to a 90-second widescreen pitch suitable for a projector; the user may steer format through the pending optional question. Automated execution and English follow saved user preferences.

## Assets

- ../../PRD.md — source of the problem statement, connected workflow, and prototype scope.
- ../../README.md — implemented capabilities and truthful limitations.
- ../../src/pages/ — implemented UI behavior; use simplified presentation diagrams and product panels, not fabricated customer results.
- ../../public/assets/ — product photography and local fonts from the supplied StoreOS reference.

## Customizations

- Warm cream, forest, and terracotta brand; editorial serif headlines with clear sans-serif annotations.
- Show catalog preparation, website building, ad concepts, campaign tracking, and budget approval.
- AgenticOrg by Pine Labs is presented as the intended orchestration layer. The current workflow is explicitly labeled simulated.
- All commercial numbers are labeled demo data. No invented market size, customer adoption, speed, or savings statistics.
- Include a presentation fallback with keyboard controls, captions, and speaker notes for the hackathon.

## Notes

No source website capture is required: the user supplied the complete prototype and PRD in this workspace. This is a product pitch with stylized UI panels and real bundled imagery.
The installed Hyperframes CLI is 0.8.78. Skill refresh failed because automatic approval review returned an infrastructure 404. Continue using the actual installed skill files, not reconstructed instructions.
The local project has the correct GitHub origin and main tracks origin/main; do not change Git history for this video request.

## Delivery state

The deliverable is a 90-second animated HTML presentation with manual navigation, speaker notes and captions. On 24 Oct 2026 the user rejected browser speech and requested Deepgram. Browser speech has been removed. The player now supports a recorded audio master clock and synchronized pause, resume, seek and mute, with tests. Deepgram synthesis is pending because API connectivity was blocked and escalation failed with an approval-service 404. No key was persisted. The build embeds narration only after its metadata, scene signature and file hash validate. No audio soundtrack or MP4 has been rendered. Visual rehearsal remains outstanding.

The separate editable PowerPoint lives at ../../pitch/output/RunMyStore-Hackathon.pptx. It includes researched sources, an explicitly hypothetical TAM/SAM model, a target-customer profile, competition and a proposed North Star metric. Exactly one slide combines market numbers and clearly labeled fictional social-post illustrations. Those posts are not evidence or real X screenshots.
