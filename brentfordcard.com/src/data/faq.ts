import { CARD } from './site';

// Eight FAQ questions (brief §8). Answers are complete standalone sentences so
// answer engines can lift them verbatim.
export const CARD_FAQ = [
  {
    q: 'What is the Brentford Card?',
    a: 'The Brentford Card is a paid annual membership that gives you discounts and offers at independent businesses across Brentford (TW8), delivered as a pass in your Apple or Google Wallet.',
  },
  {
    q: 'How much does the Brentford Card cost?',
    a: `The Brentford Card costs ${CARD.priceDisplay} a year, and that includes a ${CARD.charityPct}% donation to ${CARD.charityName}.`,
  },
  {
    q: 'Where is the Brentford Card accepted?',
    a: 'The Brentford Card is accepted at every participating business listed in the Brentford Directory with an offer, across food and drink, shops, health and beauty, fitness, services and culture in Brentford.',
  },
  {
    q: 'How do I redeem a Brentford Card offer?',
    a: 'To redeem an offer, show your Brentford Card pass on your phone to a member of staff at the participating business before you pay, and they will apply the discount shown on that business’s directory page.',
  },
  {
    q: 'How do I add the Brentford Card to my phone wallet?',
    a: 'After you buy the card you are sent a link by email; open it on your phone and tap Add to Apple Wallet or Add to Google Wallet, and the pass installs in a few seconds.',
  },
  {
    q: 'How does renewal work?',
    a: 'The Brentford Card is an annual membership that you renew once a year, and we email you before your card is due so nothing renews without warning.',
  },
  {
    q: 'Can I get a refund on the Brentford Card?',
    a: 'Yes — you can request a full refund within 14 days of purchase as long as you have not already redeemed an offer, in line with UK consumer law and our terms.',
  },
  {
    q: 'Does buying a Brentford Card support charity?',
    a: `Yes — ${CARD.charityPct} per cent of every Brentford Card membership goes to ${CARD.charityName}, a named local cause, so every card supports Brentford directly.`,
  },
];
