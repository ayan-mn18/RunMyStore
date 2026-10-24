# RunMyStore hackathon deck

The editable deck is [RunMyStore-Hackathon.pptx](output/RunMyStore-Hackathon.pptx).

Twelve slides cover the problem, target customers, the market model, product workflow, AgenticOrg integration plan, competition and the proposed North Star. Exactly one slide contains the market numbers and fictional social-post illustrations. The post images retain their disclosure labels.

Every external claim has a source in its slide's speaker notes. Full research data, units, assumptions and links are in [research/sources.json](research/sources.json). The observed market counts are third-party detected store domains, not unique companies or paying customers.

The $1.66B indicative TAM and $376M initial Shopify SAM are annual software-revenue scenarios. They assume 10% of the observed stores qualify and a $99 monthly subscription. Neither fit nor willingness to pay has been validated. The estimates are not GMV, traction or forecasts.

The proposed North Star is the weekly median of verified owner hours saved per active store, net of review and rework. No time-saving result has been measured yet.

The demo remains frontend-only. Its data, generation and agent runs are simulated. Real AgenticOrg execution is a next step, not an implemented claim.

## Source

`build/deck.mjs` creates editable text and embedded product images using Artifact Tool. It exports, renders and validates a new PPTX. Set `DECK_FILENAME` to a new name for a revision; the finalizer intentionally will not overwrite an existing output. The separate animated presentation remains in `../videos/runmystore-hackathon/`.
