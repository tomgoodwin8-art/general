/**
 * faqs.ts - FAQ content (§7, §12 AEO). 10 questions per core section.
 * House style: British spelling, no em-dashes, Appendix A stats only.
 */
export interface Faq {
  q: string;
  a: string;
}

/** Home: what the agency is and how working together works. */
export const homeFaqs: Faq[] = [
  {
    q: "What does The Micro Agency actually do?",
    a: "We are the UK's specialist Microsoft Advertising agency. We build and run platform-native Microsoft Ads campaigns, measure the incremental revenue Microsoft adds on top of Google, and advise on how search budget should be diversified across engines.",
  },
  {
    q: "Why specialise in Microsoft Ads rather than offer everything?",
    a: "Most agencies treat Microsoft as the channel nobody wanted, importing Google campaigns and stopping there. Microsoft is the whole business here. That focus is the difference between capturing most of the value and capturing all of it.",
  },
  {
    q: "Do you replace our Google Ads?",
    a: "No. This is search diversification, not migration. Google remains where most demand is captured. We build a properly optimised Microsoft channel alongside it and prove the incremental value it adds.",
  },
  {
    q: "Will you tell us if Microsoft Ads is not right for us?",
    a: "Yes. The opportunity audit is fixed-fee and honest. If there is no incremental revenue worth chasing in your account, we will say so and you will still leave with a clear view of why.",
  },
  {
    q: "How big does our budget need to be to work with you?",
    a: "There is no hard floor, but the economics work best when there is enough Google spend to diversify from and enough Microsoft headroom to test properly. The audit tells you whether the opportunity justifies the effort before you commit.",
  },
  {
    q: "How quickly will we see results?",
    a: "A clean platform-native build can improve efficiency within the first weeks, but the meaningful answer comes from an incrementality test, which typically needs a quarter to read cleanly. We design for a durable read, not a fast vanity number.",
  },
  {
    q: "Are you tied into long contracts?",
    a: "No. Managed engagements run on a clear monthly fee you can exit. We would rather keep clients because the incremental revenue is real than because a contract makes leaving painful.",
  },
  {
    q: "Who will run our account day to day?",
    a: "A senior practitioner, not a junior learning on your budget. We are a lean boutique by design, so the people who win the work are the people who do it.",
  },
  {
    q: "Do you work with agencies as well as brands?",
    a: "Yes. We partner with full-service and Google-led agencies that want a genuine Microsoft specialism behind them, on a white-label or co-delivery basis, rather than running Microsoft as an afterthought.",
  },
  {
    q: "Which industries do you focus on?",
    a: "Microsoft's audience skews desktop-dominant and higher-income, so the fit is strongest in B2B and SaaS, financial services and professional services. We work across sectors, but those are where the platform tends to punch above its share.",
  },
];

/** Services: the three engagements, pricing model, onboarding. */
export const servicesFaqs: Faq[] = [
  {
    q: "What is the difference between the audit, managed and strategy engagements?",
    a: "The Opportunity Audit is a fixed-fee first look that quantifies the gap. Managed Microsoft Advertising is ongoing platform-native build and optimisation. Search Diversification Strategy is a premium advisory engagement on how budget should be split across engines.",
  },
  {
    q: "How do you charge? Is it a percentage of spend?",
    a: "No. We charge a clear monthly fee rather than a percentage of spend, because percentage models reward bloat and penalise efficiency. You should never pay us more simply because we spent more of your money.",
  },
  {
    q: "What happens in the Opportunity Audit?",
    a: "We analyse your account and quantify the incremental revenue available from Microsoft Ads on your own numbers, before you commit to anything. It is fixed-fee, and the output is a clear go or no-go with the reasoning behind it.",
  },
  {
    q: "What does onboarding look like?",
    a: "We baseline your Google performance on like-for-like metrics, then build the Microsoft account platform-native rather than importing. You get a clear plan, the measurement design, and the timeline up front.",
  },
  {
    q: "Do you just use the Google import tool?",
    a: "The import tool is a starting line, not a strategy. We may use it to seed an account, then rebuild the layer that actually moves performance: LinkedIn Profile Targeting, the Microsoft Audience Network, match types and audiences suited to the platform.",
  },
  {
    q: "Can you manage Microsoft alongside our existing Google agency?",
    a: "Yes, and it is common. We focus solely on Microsoft and share like-for-like benchmarks, so your Google team and ours are measured on the same definitions rather than competing on attribution.",
  },
  {
    q: "What is Search Diversification Strategy for?",
    a: "It is for performance leaders and CFOs deciding how search budget should be allocated across engines. You get concentration-risk analysis, an incrementality design, and a reallocation plan your finance team can sign off.",
  },
  {
    q: "What reporting do we get?",
    a: "Reporting on revenue and blended cost of acquisition, not clicks, plus a quarterly benchmarking snapshot against Google on like-for-like metrics. The measurement methodology is yours to keep.",
  },
  {
    q: "Do you handle creative and feeds, or just bidding?",
    a: "Both. Platform-native work spans account structure, audiences, creative suited to the surface, and shopping feeds, because the wins on Microsoft come from building for the platform rather than tuning bids on an import.",
  },
  {
    q: "How do we get started?",
    a: "Book an audit. Twenty minutes tells us whether there is incremental revenue worth chasing, and the fixed-fee audit quantifies it before you make any longer commitment.",
  },
];

/** Method: measurement, incrementality and benchmarking. */
export const methodFaqs: Faq[] = [
  {
    q: "What is incrementality, in plain terms?",
    a: "Incrementality is the revenue a channel genuinely adds that you would not have earned without it. It separates real lift from demand that would have converted anyway, which is the only honest way to value a second search engine.",
  },
  {
    q: "Why does last-click attribution understate Microsoft?",
    a: "Last-click structurally favours the highest-volume platform, so a smaller engine looks smaller than it is. Microsoft often contributes value that last-click hands to Google, which is why we measure lift rather than read a last-click dashboard.",
  },
  {
    q: "How do geo and holdout tests work?",
    a: "We hold Microsoft back in some regions or audiences and run it in others, then compare outcomes. The difference is the incremental effect, isolated from seasonality and from demand that would have arrived regardless.",
  },
  {
    q: "How long does an incrementality test take?",
    a: "Typically a quarter to read cleanly, depending on volume. We would rather give you a durable answer you can take to finance than a fast number that does not survive scrutiny.",
  },
  {
    q: "Do we own the measurement methodology?",
    a: "Yes. The output is a measurement methodology you keep, not a black box you rent. If we part ways, you retain the framework and can keep running it.",
  },
  {
    q: "What metrics do you actually report on?",
    a: "Incremental revenue and blended cost of acquisition, benchmarked against your Google performance on like-for-like definitions. We report the lift in revenue, not clicks or impressions.",
  },
  {
    q: "How is this different from a standard agency dashboard?",
    a: "A dashboard reports what the platform claims. The Method tests what is genuinely incremental and benchmarks it against Google on the same terms, so the number means something to a CFO rather than only to a marketer.",
  },
  {
    q: "What is the quarterly benchmarking snapshot?",
    a: "A short quarterly read comparing Microsoft against Google on like-for-like metrics, flagging drift before it costs you. It keeps the comparison honest and repeatable rather than a one-off claim.",
  },
  {
    q: "Can you measure if our tracking is imperfect?",
    a: "Geo and holdout designs are more robust to messy tracking than user-level attribution, because they compare outcomes at the market level. We will tell you honestly where your data limits what can be claimed.",
  },
  {
    q: "What do we need to provide to run the framework?",
    a: "Access to your accounts and conversion data, a willingness to hold spend back in a controlled way for the test, and a shared definition of the metrics that matter. We handle the design and the read.",
  },
];

/** Agencies: white-label Microsoft Ads partner programme. */
export const agenciesFaqs: Faq[] = [
  {
    q: "What is white-label Microsoft Ads?",
    a: "White-label Microsoft Ads means we build and run Microsoft Advertising campaigns that your agency delivers under its own brand. Your client sees your agency; we are the specialist desk behind it. You add a genuine Microsoft capability without hiring for it.",
  },
  {
    q: "How does Microsoft Ads for agencies work with us?",
    a: "You stay the client relationship and the brand. We handle the platform-native build, optimisation, incrementality measurement and reporting, delivered in your templates. You brief us, we deliver, you present. It is a quiet, reliable desk, not another logo in the room.",
  },
  {
    q: "Will you contact or poach our clients?",
    a: "No. We work behind your brand and do not approach your clients. That is written into the partnership. Our entire model depends on agencies trusting us with their accounts, so protecting your relationship is non-negotiable.",
  },
  {
    q: "Can we resell Microsoft Ads under our own brand?",
    a: "Yes. White-label partners present the work as their own, in their own reporting and decks. We provide the specialism and the measurement methodology; you own the client and the margin.",
  },
  {
    q: "What is the commercial model: referral or white-label?",
    a: "Both are available. With white-label, you mark up our managed fee and keep the client. With referral, you introduce the client to us, we run it directly, and we share revenue. We will recommend whichever fits how your agency prefers to work. [Commercials TODO: confirm referral share and white-label rate card.]",
  },
  {
    q: "We are a Google-led agency. Why offer Microsoft Ads?",
    a: "Because your clients have concentration risk and you are leaving incremental revenue on the table. Microsoft reaches over a billion users monthly and commonly runs at materially lower CPCs, with LinkedIn Profile Targeting available nowhere else. Offering it deepens retention without you building the desk.",
  },
  {
    q: "What do we need to provide?",
    a: "An introduction to the account and the client's goals, your reporting template, and a single point of contact on your side. We handle the build, the testing and the day-to-day. You stay in control of the relationship and the narrative.",
  },
  {
    q: "Who runs the campaigns and the reporting?",
    a: "A senior Microsoft specialist on our side runs the account and produces reporting in your branding. You review and present it. There is no junior learning on your client's budget, and the measurement methodology is shared so you can stand behind the numbers.",
  },
  {
    q: "How quickly can we launch with a client?",
    a: "A clean platform-native build typically goes live within the first weeks of access. The meaningful read on incremental value comes from a quarter-long test, which we design up front so you can set the client's expectations correctly from day one.",
  },
  {
    q: "How do we become a partner?",
    a: "Book a short partner call or forward our one-pager internally to your head of paid or managing director. We will agree the model, the commercials and a first account to prove it on. Start with the partner kit on this page.",
  },
];

/** Why Microsoft: the thesis, the ecosystem, diversification. */
export const whyMicrosoftFaqs: Faq[] = [
  {
    q: "Is Microsoft Advertising worth it in the UK?",
    a: "For the right audience, yes. Microsoft holds roughly 14 to 16% of UK desktop search share and reaches a desktop-dominant, higher-income audience, often at materially lower CPCs than Google. The audit tells you whether that fit applies to you.",
  },
  {
    q: "How large is Microsoft's reach?",
    a: "Microsoft's ecosystem reaches over a billion users monthly. The point is not raw scale against Google, but a meaningful, distinct audience that most UK advertisers are not properly capturing.",
  },
  {
    q: "Are Microsoft Ads really cheaper than Google?",
    a: "Microsoft Ads commonly runs at materially lower CPCs than Google, often cited at around a third lower on average. Lower auction density is a large part of why, though the gap varies by vertical.",
  },
  {
    q: "What is concentration risk in paid search?",
    a: "It is the risk of routing almost all of your search spend through one engine, so a pricing, policy or algorithm change lands on the whole budget at once. Adding a properly optimised second engine reduces that single point of failure.",
  },
  {
    q: "What is LinkedIn Profile Targeting?",
    a: "It lets you target by job title, company and industry, and it is exclusive to Microsoft Advertising. For B2B, it is one of the strongest reasons to run platform-native campaigns rather than an import.",
  },
  {
    q: "Who is the Microsoft audience?",
    a: "It skews desktop-dominant and higher-income; in the US, around 41% of Bing users earn over $100k. That profile is why the platform tends to convert well for B2B, financial services and considered purchases.",
  },
  {
    q: "Why do most advertisers underuse Microsoft?",
    a: "It is a skills gap, not an awareness gap. Most UK advertisers know Microsoft exists but run no properly optimised campaigns, because no one on the team specialises in building for the platform.",
  },
  {
    q: "Does the Google antitrust remedy change things?",
    a: "The 2025 US v Google remedy orders Google to syndicate search and text-ad feeds on commercial terms. It is widely read as narrow and is under appeal, so we treat it as context for paying attention to search structure, not a switch that opens the market.",
  },
  {
    q: "Isn't this just an anti-Google argument?",
    a: "No. We are pro-intelligence, not anti-Google. Google should remain the largest line in most plans. Diversification stops it from being the entire portfolio, which is a risk decision a CFO recognises.",
  },
  {
    q: "How much budget should move to Microsoft?",
    a: "There is no universal split. The right answer comes from incrementality: you size the second engine to the lift it genuinely produces and the concentration risk it removes, not to a rule of thumb.",
  },
];
