---
title: "How to import Google Ads to Microsoft, and why you shouldn't stop there"
description: "The Google import tool is a starting line, not a strategy. How to import cleanly, then build the platform-native layer that actually moves performance."
targetKeyword: "import google ads to microsoft"
intent: how-to
category: How-to
author: "Tom Goodwin"
pubDate: 2026-02-05
draft: false
---

The Google Ads import tool inside Microsoft Advertising is genuinely good at what it does, which is also the problem. It works so smoothly that teams treat the import as the project, declare Microsoft "live," and move on. The import is a starting line, not a strategy. Here is how to do it cleanly, what it quietly breaks, and the platform-native work that actually moves performance afterwards.

## What the import tool does

The import tool pulls your Google Ads account structure into Microsoft Advertising and reconstructs it. In a single pass it brings across campaigns, ad groups, keywords, text ads and most of the settings that have direct equivalents on both platforms. You can run it once or schedule it to sync on a recurring basis, so changes on the Google side flow through automatically.

For getting from zero to a populated account, it is the right first move. Rebuilding a mature Google structure by hand would take days and introduce errors, and there is no prize for doing manually what the tool does reliably in minutes. So use it, and use it without guilt. The trap is not the import itself. The trap is believing that an account which mirrors Google is an account that is ready to perform on Microsoft.

A clean import follows a few rules. Import into a clearly named, contained structure so you can tell imported assets from native ones later. Choose your sync setting deliberately: a recurring sync keeps the accounts aligned, but it also keeps overwriting the platform-native changes you are about to make, so most serious programmes move to a one-time import or a tightly scoped sync once they start optimising. And review before you publish rather than accepting everything, because the tool will faithfully carry across things that do not belong on Microsoft.

## What it silently breaks

The danger of a tool this smooth is that the failures are silent. Nothing errors. The account looks complete. But several things arrive degraded, missing or actively wrong, and because there is no warning, they sit there costing money.

The recurring issues to check for:

- Negative keyword gaps. Lists, especially shared library negatives, do not always come across intact. The result is spend on queries you deliberately excluded on Google, now running unblocked on Microsoft.
- Conversion tracking. Imported conversion settings frequently need rebuilding against the Microsoft tag (UET). An account that looks fine but is not recording conversions correctly will train its automated bidding on bad signals, which is worse than no automation at all.
- Bid strategies. Strategies map across, but they were tuned to Google's auction. Microsoft's competition is lighter and its CPCs are different, so a bid strategy that was optimal on Google is, by definition, not optimal here.
- Audience and targeting layers. The parts of your Google setup that have no Microsoft equivalent simply do not appear, and the parts that do are not configured for Microsoft's distinct audiences.
- Format mismatches. Some Google-specific asset and extension types do not translate one-to-one and arrive incomplete.

None of these throws an alert. That is precisely why "imported and live" is a dangerous status to report upward. The honest status is "imported and not yet verified," and the gap between those two is where budget leaks.

## The platform-native gap

Even a perfectly clean import only gives you a Google account running on Microsoft. The larger issue is everything an import structurally cannot do, because it can only copy what exists on the other side.

The biggest single example is LinkedIn Profile Targeting. Targeting by job title, company and industry is exclusive to Microsoft Advertising, <!-- source: Microsoft Advertising product docs --> which means it has no Google source to import from. It is invisible to the import tool by definition. For a B2B advertiser, this is often the most valuable capability on the platform, and the import will never surface it. You have to build it deliberately. We cover the mechanics in our [guide to LinkedIn Profile Targeting](/blog/04-linkedin-profile-targeting-microsoft-ads).

Then there is the economics the import ignores. Microsoft Ads typically runs at materially lower CPCs than Google, commonly cited at around 33% lower on average, <!-- source: Searchlab / GoDataFeed, 2025-26 --> against an audience that skews higher-income and desktop-led. Imported bids, budgets and targets all assume Google's cost structure and Google's audience. Carrying them over unchanged means you are pricing and pacing for the wrong auction. The efficiency Microsoft can deliver is left on the table because the settings were never re-tuned to claim it.

This is the heart of why you should not stop at the import. The import gives you parity with Google. The value of Microsoft is in the places where it is not Google: cheaper auctions, a different audience, and targeting Google cannot offer. A copied account, by construction, captures none of that. Closing the platform-native gap is the actual work, and it is what our [method](/method) is built to do.

## A post-import checklist

Treat the import as step one of a defined sequence, not the finish line. Here is the checklist we run before an imported account is allowed to be called "live."

First, verify before you celebrate. Confirm conversion tracking fires correctly against UET and reconcile it against real conversions, because every automated decision downstream depends on this being right. Audit negative keyword coverage against your Google lists and patch the gaps. Check that bid strategies imported in a usable state rather than defaulting to something you did not intend.

Second, re-tune for Microsoft's reality. Reset bids and budgets to Microsoft's lighter competition and lower CPCs rather than inheriting Google's. Set separate performance targets, because measuring a cheaper auction and a different audience against Google's benchmarks will make a good account look like a failure or a bad one look fine.

Third, build the layer the import could never bring. Add the LinkedIn Profile Targeting layer if you sell B2B. Configure Microsoft-native audiences to reflect the desktop-led, higher-income skew. Adjust ad copy and extensions for what actually performs here rather than assuming Google's winners transfer unchanged.

Run that sequence and you end up somewhere the import alone never reaches: an account that uses Microsoft as Microsoft, not as a mirror of Google. The import saved you days of rebuild work, which is exactly its job. The performance comes from everything you do after it. If you would rather not run that sequence yourself, [talk to us](/contact), or read the wider case for [search diversification](/blog/02-what-is-search-diversification).
