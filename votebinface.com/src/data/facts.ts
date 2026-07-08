// Canonical data for votebinface.com. Single source of truth (brief §9).
// Every figure that appears on the site is defined here and imported, never
// retyped into a template.

export const CLACTON_2024 = {
  electorate: 78245,
  turnout: 0.587,
  validVotes: 45958,
  majority: 8405,
  results: [
    { candidate: 'Nigel Farage', party: 'Reform UK', votes: 21225, share: 46.2 },
    { candidate: 'Giles Watling', party: 'Conservative', votes: 12820, share: 27.9 },
    { candidate: 'Jovan Owusu-Nepaul', party: 'Labour', votes: 7448, share: 16.2 },
    { candidate: 'Matthew Bensilum', party: 'Liberal Democrat', votes: 2016, share: 4.4 },
    { candidate: 'Natasha Osben', party: 'Green', votes: 1935, share: 4.2 },
  ],
  orphanedVote: 24219, // Con + Lab + LD + Green
} as const;

// The five parties that declined to stand against Farage in the by-election.
export const DECLINED_PARTIES = [
  'Labour',
  'the Conservatives',
  'the Liberal Democrats',
  'the Greens',
  'Restore Britain',
] as const;

export const BINFACE_RECORD = [
  // The 2017 Maidenhead (Lord Buckethead, 249) row is verified against the
  // published Maidenhead 2017 GE result and retained. Drop if ever disputed.
  { year: 2017, contest: 'Maidenhead GE (as Lord Buckethead)', vs: 'Theresa May', result: '249 votes' },
  { year: 2019, contest: 'Uxbridge & South Ruislip GE', vs: 'Boris Johnson', result: '69 votes' },
  { year: 2021, contest: 'London Mayoral', vs: 'the entire capital', result: '24,775 first-choice votes, 9th of 20' },
  { year: 2023, contest: 'Uxbridge & South Ruislip by-election', vs: '', result: '190 votes, up 275% on 2019' },
  { year: 2024, contest: 'London Mayoral', vs: '', result: '24,260 votes, ahead of Britain First' },
  { year: 2024, contest: 'Richmond & Northallerton GE', vs: 'Rishi Sunak', result: '308 votes (a moral victory)' },
  { year: 2026, contest: 'Makerfield by-election', vs: 'Andy Burnham', result: '95 votes, 7th of 14' },
] as const;

export const SITE = {
  name: 'Vote Binface',
  domain: 'votebinface.com',
  url: 'https://votebinface.com',
  tagline: 'The only one who turned up',

  pollingDate: 'Date to be confirmed',
  registrationDeadline: 'TBC, check with Tendring District Council',
  postalDeadline: 'TBC, typically 5pm, 11 working days before polling day',

  officialSite: 'https://countbinface.com',
  merch: 'https://www.binfaceshop.co.uk',
  registerUrl: 'https://www.gov.uk/register-to-vote',
  postalUrl: 'https://www.gov.uk/apply-postal-vote',

  // Statutory UK digital imprint for the AUTHORISED (party) operating mode.
  // Rendered from config only, never hardcoded in templates (brief §1).
  imprint: 'Published and promoted by The Count Binface Party, PO Box 818, Tonbridge, TN9 9YF',

  // REQUIRED before deploy in authorised mode: the reference of the written
  // authorisation held from The Count Binface Party. While this is empty the
  // site MUST NOT name the party on the imprint (that would be a false imprint
  // and an offence), so it renders in legally-safe FAN MODE instead. See
  // src/config/mode.ts and scripts/check-imprint.mjs.
  authorisationRef: '',

  // FAN MODE fallback imprint. Used only when authorisationRef is empty.
  // The promoter must be the real person publishing the site; replace the
  // token with an actual name and postal address before any fan-mode deploy.
  fanPromoterName: '{{IMPRINT_PROMOTER_NAME}}',
  fanPromoterAddress: '{{IMPRINT_PROMOTER_ADDRESS}}',

  pressEmail: 'press@votebinface.com',
  contactEmail: 'hello@votebinface.com',

  social: {
    x: 'https://x.com/CountBinface',
    youtube: 'https://www.youtube.com/countbinface',
    substack: 'https://countbinface.substack.com',
    wikipedia: 'https://en.wikipedia.org/wiki/Count_Binface',
    wikidata: 'https://www.wikidata.org/wiki/Q65042066',
  },
} as const;
