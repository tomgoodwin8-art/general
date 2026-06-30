---
title: "How to structure a Microsoft Ads account from scratch"
description: "Account structure decisions that differ from Google: match types, audiences, network settings and naming. A platform-native build guide."
targetKeyword: "microsoft ads account structure"
intent: how-to
category: How-to
author: "Tom Goodwin"
pubDate: 2026-04-16
draft: false
---

If you have built and run Google accounts for years, the temptation with Microsoft is to import everything and walk away. It works, technically. But an imported account inherits Google's assumptions about your audience, your devices and your settings, and Microsoft's audience is not Google's audience. The build below treats Microsoft as its own platform, because that is where the gains sit.

## Campaign and ad group architecture

Start with the same discipline you would apply anywhere: campaigns map to budget and strategy decisions, ad groups map to intent. The difference on Microsoft is that you usually have less volume to work with, so over-segmentation hurts you faster. Where a Google account might justify thirty tightly themed ad groups, the Microsoft equivalent often performs better consolidated into ten or twelve, because each one then gathers enough data for the bidding to learn.

A sensible default structure looks like this:

- **Brand** in its own campaign, isolated so you can read and protect it cleanly.
- **Core non-brand** split by product line or service, one campaign per meaningful budget decision.
- **Generic or category terms** kept separate from high-intent terms, because they behave differently and you will want different bids and different expectations.
- **A controlled testing campaign** for new themes, so experiments never contaminate your proven performers.

Within each campaign, group ad groups by a single coherent intent rather than by keyword count. A useful test: if you cannot write three genuinely relevant headlines for every keyword in an ad group, the group is too broad.

Naming matters more than people admit, because it is the layer you will live inside every day. Adopt a consistent convention from the first campaign: `[Market]_[Brand/NonBrand]_[Product]_[MatchType/Theme]`. Consistency lets you filter, pivot and report at scale later without renaming anything. Decide it once, write it down, never deviate.

A note on Microsoft's [campaign settings](/why-microsoft) that catch people out: time zones, currency and target locations are set at the campaign level and cannot be changed after creation. Get them right at build, because the only fix later is a rebuild.

## Match types and negatives

Microsoft's match types mirror Google's vocabulary, but the matching behaviour is not identical, and treating them as interchangeable is the most common imported-account mistake. Phrase and broad match interpret intent slightly differently, and broad match in particular will reach further than you expect on a smaller query pool.

Build deliberately:

- **Start tighter than feels comfortable.** Lead with phrase and exact for your core terms so you learn what actually converts before you widen. On a lower-volume platform, a few weeks of clean data is worth more than early reach.
- **Introduce broad match with intent signals attached**, not on its own. Broad behaves best when it has audiences, smart bidding and a healthy negative list around it, so it explores within guardrails rather than wandering.
- **Treat the search terms report as a weekly habit, not a quarterly audit.** Smaller query volumes mean a single irrelevant theme can take a disproportionate share of spend before you notice.

Negatives are where a platform-native build pulls ahead. Maintain shared negative keyword lists at the account level for the obvious waste (jobs, free, DIY, competitor noise where appropriate) and apply campaign-specific negatives to enforce the boundaries between your ad groups. The discipline of mutual negatives, where brand terms are excluded from non-brand campaigns and category terms from product campaigns, keeps your data clean enough to actually trust. On a smaller account, dirty data is expensive precisely because there is less of it to average out.

## Audience layering

This is the section that separates a real Microsoft build from an import, and it is where the platform earns its reputation. Microsoft's audience skews professional, desktop-dominant and, in aggregate, higher-income than the open web. A meaningful share of the audience is higher-income and desktop-dominant. <!-- source: Microsoft Advertising / Nerdynav, 2025-26 --> Structuring to use that, rather than ignoring it, is the whole point.

Layer audiences in observation mode first on every campaign you launch. That gives you performance data by segment without restricting reach while you are still learning. The segments worth attaching from day one:

- **In-market audiences** aligned to your category, to read intent strength.
- **Remarketing lists**, built early even if small, because they compound.
- **Customer match** where you have first-party data, for both targeting and exclusion.
- **LinkedIn Profile Targeting** by job title, company and industry, which is exclusive to Microsoft Advertising and has no equivalent on Google. <!-- source: Microsoft Advertising product docs -->

Once you have a few weeks of observation data, move your strongest segments toward targeting and apply bid adjustments to the rest. The structural decision to make at build time is simply to ensure every campaign has audiences attached from the start, so you are never retrofitting intelligence onto a campaign that has already spent blind. Our [method](/method) treats audience layering as part of the build, not an optimisation you bolt on in month three.

## Network and device settings

The settings layer is unglamorous and routinely ignored, which is exactly why it is worth your attention on a fresh build.

**Search network versus the audience network.** Microsoft runs both search partner traffic and a native audience network, and they behave very differently. For a new account chasing clean performance data, separate them. Keep core search campaigns on search-led placements, and run the audience network as its own deliberate campaign with its own budget and expectations rather than letting it ride along inside a search campaign where it muddies the read.

**Search partners.** These can deliver efficient volume, but quality varies by vertical. Launch with them enabled, then monitor performance as a distinct segment in your reporting. If a partner placement is dragging efficiency, you want to see it isolated, not buried in a blended number.

**Devices.** This is where Microsoft's audience character should change your defaults. Microsoft is materially more desktop-dominant than Google. Do not simply copy Google's mobile-led bid adjustments across; read your own device data and adjust toward where this audience actually converts. For many B2B and considered-purchase advertisers, that means desktop deserves a stronger position than a Google-imported setup would ever give it. Reviewing the [why Microsoft](/why-microsoft) case makes the device logic concrete.

**Location and scheduling.** Set target locations precisely, and confirm whether you want presence, interest, or both, because the default is broader than most advertisers intend. If your audience is professional, consider how ad scheduling maps to working patterns rather than leaving it flat across the week.

Build all of this once, deliberately, at the start. A Microsoft account structured on its own terms (consolidated where Google would fragment, desktop-weighted where Google leans mobile, and audience-layered from the first impression) is not a copy of your Google account running at a discount. It is a different asset, and it is the one that grows. If you want a second set of eyes before you launch, [get in touch](/contact).
