---
title: "Incrementality testing for Microsoft Ads: a practical framework"
description: "Last-click hides Microsoft's true contribution. A practical incrementality framework, geo and holdout tests, to measure real lift."
targetKeyword: "incrementality testing microsoft ads"
intent: how-to
category: Measurement
author: "Tom Goodwin"
pubDate: 2026-04-02
draft: false
---

Most Microsoft Ads accounts are judged by the one metric most likely to undersell them. Last-click attribution credits the final touch before conversion, and Microsoft frequently sits earlier in the journey than that final click. The result is a channel that looks marginal in the dashboard while genuinely driving revenue the dashboard never attributes to it. Incrementality testing is how you close that gap. This is the framework we use, and the thinking behind our wider [method](/method).

## Why last-click misleads

Last-click answers a narrow question: which channel was touched immediately before the conversion? That is not the same as which spend caused the conversion to happen.

The distortion is structural for Microsoft, not incidental. The audience skews towards desktop research and considered purchases, which means Microsoft often does its work upstream, introducing the brand, supporting the comparison, seeding the consideration, while the final click arrives later, frequently through a branded Google search or a direct visit. Last-click hands the credit to whoever caught the user at the finish line and gives nothing to whoever set up the run.

Two failure modes follow. You under-invest in a channel that is genuinely incremental because its last-click ROAS looks thin. Or you over-invest in channels that capture demand others created, mistaking proximity to the conversion for causation. Both are expensive, and neither is visible from the attribution report alone.

The deeper problem is that last-click measures correlation with conversion, not contribution to it. The only way to measure contribution is to change the spend and watch what happens to outcomes. That is the entire premise of incrementality: not "which touch came last" but "what would have happened without this spend".

## Geo and holdout designs

Incrementality is established by comparison. You create a world with the spend and a comparable world without it, then measure the difference in outcomes. There are two practical designs for Microsoft Ads.

**Holdout (audience) tests.** You withhold Microsoft Ads from a randomly selected portion of your addressable audience and serve it to the rest, then compare conversion outcomes between the two groups. The strength is clean randomisation: if the split is genuinely random, the difference in conversions is caused by the ads. The constraint is that paid search is intent-driven and harder to suppress cleanly than a display audience, so holdouts work best where you have the audience controls to define and exclude a group reliably.

**Geo tests.** You split the country into comparable regions, run Microsoft Ads in some (test) and pause or reduce them in others (control), then compare. Geo tests are usually the more practical design for search, because geography is a clean lever you can pull without complex audience plumbing. The discipline is in the matching: test and control regions need similar baseline demand, seasonality and trend, or the comparison is contaminated before you start. The standard guardrails apply.

- **Match on pre-period behaviour.** Choose test and control geos that tracked each other closely before the test. If they did not move together historically, they will not isolate the effect cleanly.
- **Size for power.** The smaller the expected lift, the more conversion volume and the longer a window you need to detect it above noise. Underpowered tests produce inconclusive results that get misread as "no effect".
- **Hold everything else still.** Do not relaunch a promotion, change bids on other channels, or restructure during the test window. Every other change is a confound.
- **Pick one clean variable.** Turn Microsoft Ads on or off, or scale it up or down by a defined amount. Do not test the channel and a new creative and a new landing page at once.

For most performance teams running Microsoft at national scale, a well-matched geo holdout is the most reliable and least disruptive starting point.

## Reading the lift

When the test concludes, the question is not "did conversions go up in the test region" but "did they go up by more than the control region moved over the same period". The control is what tells you what would have happened anyway.

Incremental lift is the difference between the two, expressed against spend. The figures that matter:

- **Incremental conversions:** test outcomes minus the counterfactual the control implies, not the raw test total.
- **Incremental cost per acquisition:** test spend divided by incremental conversions. This is almost always higher than your last-click CPA, and that is the point. It is the honest number.
- **Confidence:** be explicit about the range, not just the point estimate. A lift of "somewhere between 8% and 22%" is a different decision from "almost certainly around 15%", even if the midpoints are close.

Two interpretation traps are worth naming. First, do not anchor on last-click as the comparison; that comparison is exactly the distortion you are trying to escape. Compare incremental results to your true blended target. Second, resist reading a single test as a permanent truth. It is a measurement at a point in time, under one set of conditions. A clean result tells you the channel was incremental during that window, which is strong evidence, not an eternal law.

Run honestly, these tests frequently reveal that Microsoft Ads is more incremental than its last-click ROAS suggested, precisely because its upstream contribution was being handed to other channels. That is the finding that changes budget decisions. And because Microsoft Ads typically runs at materially lower CPCs than Google, commonly cited at around 33% lower on average, <!-- source: Searchlab / GoDataFeed, 2025-26 --> even a moderate incremental lift can produce attractive incremental economics once you stop measuring it with the wrong ruler.

## Operationalising it quarterly

A single incrementality test is a useful answer to a one-off question. The teams that compound the advantage turn it into a habit, because media markets, competition and your own mix all drift, and a truth measured eighteen months ago is no longer current.

Build it into a quarterly rhythm.

- **Maintain a standing test region.** Keeping a defined geo available for holdout testing means you can validate channel contribution on demand rather than rebuilding the apparatus each time.
- **Re-test after material change.** New competitive entry, a budget shift, a seasonal peak, or a new ad format are all reasons the previous result may no longer hold. Re-measure rather than assume.
- **Feed results back into planning, not just reporting.** The output of an incrementality programme should be a budget decision: shift this much here, hold this much there. If the result sits in a deck and changes nothing, the test was theatre.
- **Document the counterfactual every time.** Record what the control implied, so future tests have a consistent basis for comparison and you can see the trend in incrementality, not just isolated snapshots.

Done this way, incrementality stops being a project and becomes part of how the account is run. The payoff is not just a more accurate number for Microsoft Ads. It is a measurement discipline that protects every channel from the quiet errors of last-click, and that lets you defend budget decisions with causal evidence rather than attribution artefacts. If you want help standing up a testing programme, [get in touch](/contact), and read [is Microsoft Ads worth it in the UK](/blog/09-is-bing-advertising-worth-it-uk) for the channel case it complements.
