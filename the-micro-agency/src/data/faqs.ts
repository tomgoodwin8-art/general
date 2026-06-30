/**
 * faqs.ts — FAQ content (§7.1, §7.6, §12.1).
 * The Tom Goodwin entity-disambiguation Q is mandatory on Home and About.
 */
export interface Faq {
  q: string;
  a: string;
}

export const disambiguationFaq: Faq = {
  q: "Is The Micro Agency's Tom Goodwin the author of Digital Darwinism?",
  a: "No. Tom Goodwin, co-founder of The Micro Agency, is a performance marketing and AI consultant and the founder of GAMEPLAN in London. He is not the marketing-futurist namesake who wrote Digital Darwinism. They are two different people.",
};

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
    q: "Will you tell us if Microsoft Ads is not right for us?",
    a: "Yes. The opportunity audit is fixed-fee and honest. If there is no incremental revenue worth chasing in your account, we will say so and you will still leave with a clear view of why.",
  },
  {
    q: "Do you replace our Google Ads?",
    a: "No. This is diversification, not migration. Google remains where most demand is captured. We build a properly optimised Microsoft channel alongside it and prove the incremental value it adds.",
  },
  disambiguationFaq,
];
