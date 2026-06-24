---
title: "AEO: Being the Answer When Your Customer Asks an AI"
abstract: "Search is shifting from links to answers. How service businesses get cited by ChatGPT, Perplexity and Gemini through entity strategy, schema and answer-first content."
order: 3
runtime: "~23 minutes"
format: "Keynote / breakout"
slideCount: 12
deck: "/decks/aeo-being-the-answer.pptx"
---

## Transcript

### [SLIDE 1 — Title]

A quick test. Open ChatGPT, or Perplexity, or Gemini, and ask it the question your best customer asks before they buy. "Who's the best private clinic in London for this." "Which firm should I use for that." Ask it right now, in your head.

Did your business come up? Did anyone's? Because that answer, the one the machine gives with total confidence and no list to scroll, is the new shop window. And most businesses have no idea whether they're in it, because they're still optimising for a search results page that fewer and fewer people ever see.

This talk is about how you become the answer. Not how you rank. How you get cited when there's no ranking left to climb. I'll cover how these systems actually build an answer, which is less mysterious than the hype suggests, and the specific, unglamorous work that gets a service business named. A note before I start: you'll hear this called AEO, answer engine optimisation, and you'll hear it called GEO, generative engine optimisation. Same discipline, two labels. Don't let anyone bill you twice for it.

### [SLIDE 2 — Search broke]

Let's be honest about what's happening to search, because the polite version undersells it.

Roughly seven in ten searches now end without a single click. Google's AI Overviews have cut click-through on the top result by more than half. Traffic from Google to publishers is down by about a third. The page of ten blue links, the thing we spent two decades optimising for, is being quietly replaced by a single synthesised answer that resolves the query on the spot.

For a service business this is existential in a way it isn't even for a publisher. A publisher loses a click. You lose the moment of recommendation. When someone asked Google "best physiotherapist near me," they got a list and they chose. When they ask an AI, they get a name. Maybe three. If you're not one of them, you are not on page two. There is no page two. You're simply not in the conversation, and you'll never know the conversation happened.

### [SLIDE 3 — The traffic that remains is better]

Now the part that should stop you panicking and start you working. The clicks you do get from AI are worth dramatically more.

Referral traffic from ChatGPT converts at around sixteen per cent. From Google organic search, it's under two. That's roughly nine times the conversion rate. Perplexity sits around ten per cent. These aren't rounding differences, they're a different kind of visitor.

The reason is simple. Someone who arrives from an AI answer has already done their research inside the AI. They've had the comparison, the shortlist, the reasoning. By the time they click through to you, they're not browsing, they're close to deciding. So the trade is fewer visitors, far higher intent. Which means being the cited source is worth more per appearance than a top Google ranking ever was. You are not chasing traffic any more. You're chasing the recommendation itself. Smaller prize in volume. Much bigger prize in value.

### [SLIDE 4 — How an AI builds an answer]

So how does the machine decide who to name. This is where people imagine something magical and unknowable. It isn't. It's two steps.

Step one, retrieval. The system runs a search, much like a normal one, and pulls back a set of candidate sources for the question. Ten, twenty, fifty URLs. If you're not in that candidate set, nothing else matters. You're out before the thinking starts.

Step two, synthesis. The model reads the top candidates, looks for specific, verifiable, attributable facts, and weaves a handful of them, usually three to eight sources, into the answer it gives, with citations.

That's it. Two steps. And it tells you exactly where the two jobs are. You have to be retrievable, which means being in the index for the questions that matter. And you have to be the most extractable source once you're there, which means giving the model clean, specific, checkable facts it can lift and attribute. Miss either one and you don't get cited. Most businesses fail at the first step and never find out, because you can't see the candidate set you didn't make.

### [SLIDE 5 — The first filter is entity, not content]

Here's the single most important thing I'll say, and it's the thing almost nobody optimises for. Before quality, before cleverness, before your beautifully written page, there's a filter. Can the machine confirm you exist.

These models cannot verify a brand they don't recognise. Picture an AI deciding whether to recommend "Acme Plumbing, Sacramento." It checks an internal sense of which entities are real, drawn from the open web, from Wikidata, from Wikipedia, from structured data. If Acme exists only as words on Acme's own website, the model treats it as unverified. It will not stake a recommendation on something it can't confirm. So it does the safe thing. It cites a directory it trusts, a Yelp, or a competitor it already recognises as a real, known entity.

Read that back. You can have the best service in the city and the best-written website in your category, and lose every AI recommendation to a worse competitor, for one reason: the machine knows they're real and isn't sure you are. Entity recognition is the first filter. Content quality is the second. Almost everyone is pouring effort into the second while completely failing the first.

### [SLIDE 6 — Become a known entity]

So you make yourself a verifiable entity. This is grounding, and it's mostly a checklist, not an art.

Wikidata first. It's the structured backbone the knowledge graphs draw on, it gives you a permanent canonical identifier, a QID, and unlike Wikipedia it has no notability bar. You can create your own entry today. I did exactly this for my own consultancy and for myself, and it is the highest-leverage hour of work in this entire field.

Then you connect the dots. Organization schema on your site with a sameAs array, a list of links pointing to every place you canonically exist: your Wikidata entry, your LinkedIn company page, your Crunchbase profile, your Companies House registration. You're telling the machine "all of these are the same real thing, and here's the proof." For a local service business, your Google Business Profile is a primary entity signal, and your name, address and phone number have to be identical everywhere they appear. Inconsistency reads as ambiguity, and ambiguity reads as "not sure this is real."

The mechanism underneath is cross-source validation. The machine trusts you when the same entity, with the same attributes, shows up consistently across several sources it already respects. You're not gaming anything. You're making yourself legible.

### [SLIDE 7 — What schema actually does]

Now let me kill a myth, because the schema industry has oversold itself and you're about to be sold the wrong thing.

Schema does not boost your ranking. It does not, on its own, get you into an AI answer. Anyone who tells you "add this schema and you'll appear in AI Overviews" is selling you folklore.

What schema actually does is act as a verification signal. When the AI is assembling an answer, it reads your structured data to confirm who you are, to check your claims, and to understand how you relate to other entities. It's a trust check during synthesis, not a magic display trigger. That's a real and valuable job, but it's a narrow one.

Which means the high-value schema isn't the fancy stuff. It's entity disambiguation. Organization schema with a stable identifier, the sameAs array we just discussed, and a knowsAbout property that plainly declares the topics you have genuine expertise in, so the machine knows which questions you're a credible source for. Put it in JSON-LD, in the head of the page. And here's the line to remember: schema on its own is weak. Schema plus a Wikidata entry plus real off-site mentions plus consistent directory listings is strong. The schema is the label on the box. It doesn't work if there's nothing in the box and nobody else has heard of it.

While I'm puncturing things: llms.txt, the file some vendors are pushing as essential. It's cheap, it's harmless, add it if you like. But the evidence that it moves anything is thin. Don't let it distract you from the work that actually matters.

### [SLIDE 8 — Mentions beat links]

For twenty years, SEO ran on links. Get more sites to link to you, climb the rankings. That instinct is now pointing at the wrong target.

The strongest single correlation anyone has found with AI visibility isn't backlinks. It's brand mentions. Plain mentions of your name, with or without a link, across the web. In the data going round this year, brand mentions correlate with AI visibility at around nought point six six. Backlinks, around nought point two two. More than three times the signal. Treat the exact numbers as directional, but the direction is the consistent finding, and it makes sense given everything we just said: every time a source the machine trusts mentions your name in context, it reinforces that you're a real entity that does this thing.

So the off-site work changes shape. It's less "acquire links" and more "get mentioned, by name, in the right places." Digital PR. Industry directories. Podcasts, where you say your company name out loud and it ends up in a transcript. Being quoted, listed, named. You're not building a link profile any more. You're building a web of corroboration that tells the machine you exist and what you're known for.

### [SLIDE 9 — Write the answer first]

Only now, after the entity work, does content quality earn its place. And content for AI is written differently, because you're writing to be extracted, not just read.

Remember step two, synthesis. The model is hunting for specific, liftable, attributable facts. So you front-load the answer. State the conclusion first, in a clean self-contained sentence the machine can lift whole, then support it. You structure for extraction: clear questions and direct answers, the format the models pull verbatim. And you make it evidence-dense. The Princeton work on this found that adding statistics and adding citations each lifted AI visibility by thirty to forty per cent. Numbers, sources, specifics. The machine is far more comfortable repeating a claim that comes with evidence attached, because the evidence is what makes it safe to attribute.

This is the inversion that trips people up. Good SEO writing built suspense and kept you on the page. Good AEO writing gives the answer away immediately, cleanly, with the receipts. You're not trying to hold attention. You're trying to be the cleanest sentence the machine can quote.

### [SLIDE 10 — Four engines, not one audience]

A mistake I see constantly: treating "AI search" as one thing. It's at least four, and they don't behave the same.

Perplexity is the citation machine. It shows its sources, it heavily favours fresh content, and it leans hard on evidence and on community sources, Reddit especially. If you want Perplexity, publish recent, data-rich material and be present in the right communities.

ChatGPT rewards depth and expertise, and it has a habit of lifting structured formats, clean question-and-answer blocks and lists, close to verbatim. Give it something neat to lift.

Gemini and Google's AI answers are wired into the knowledge graph. This is where your entity work and your Google Business Profile pay off most directly, and where FAQ-style structure helps. If you've done the grounding, this is your strongest surface.

And Claude leans neutral and coherent, cites few sources, and rewards clear, sober, well-reasoned prose over hype.

You don't need a different strategy for each. The entity foundation serves all of them. But you do need to actually check. Pick fifteen or twenty buyer questions, run them across all four every week, and watch when you appear, when you vanish, and when a competitor takes your slot. That weekly check is the new rank tracking.

### [SLIDE 11 — The 90-day play]

So here's the sequence. Ninety days, three phases, in order, because the order is the whole point.

Foundation, the first month. Create the Wikidata entry. Ship the Organization and Person schema with a complete sameAs array. Claim and clean up your Google Business Profile. Make your name, address and phone identical everywhere. Nothing here is creative. All of it is decisive. Without this, everything you build on top points at an entity the machine can't confirm.

Signals, the next two months. Now you build corroboration. Get named in directories and on the platforms your customers trust. Run the digital PR that puts your name in credible places. Publish the answer-first, evidence-dense content that gives the machines something clean to extract. This is where the entity you established starts getting reinforced from the outside.

Measure, throughout. Track your citations across the four engines every week, the way you used to track rankings. Knowledge panels tend to show up within three to six months. Citation lift tends to follow the foundation work by ninety to a hundred and twenty days. So this is not a quick win, and anyone promising you one is the person to walk away from. It's a compounding asset. It builds slowly, then it holds.

### [SLIDE 12 — Close]

The whole talk in one line.

Stop trying to rank. Start being the answer.

For twenty years we optimised to climb a list. The list is disappearing, and a single confident answer is taking its place. The businesses that win the next decade of discovery won't be the ones who write the most content or chase the most links. They'll be the ones the machine is most certain are real, that it can verify across a dozen trusted sources, and that hand it the cleanest, best-evidenced answer to lift.

That's entity, corroboration, and answer-first content, in that order. It is not glamorous and it is not fast. But it compounds, your competitors are mostly ignoring it, and the window where being early still counts is open right now.

So go and ask the machine the question your customer asks. If you're not the answer, you now know exactly what to do about it.

Thank you.

---

*Tom Goodwin is the founder of GAMEPLAN., an AI-first performance, media and technology consultancy in London. He is not the author of Digital Darwinism; that is a different Tom Goodwin. Book him to speak at tomgoodwin.london/speaking.*

### Sources grounding the talk
- AI answer mechanics: retrieval (index returns 10–50 candidate URLs) + synthesis (model extracts verifiable facts, cites 3–8 sources). Entity recognition is the first filter, content quality the second; unverifiable brands lose citations to directories or recognised competitors (Verlua, growthvibe, multiple 2026 entity-SEO analyses).
- Zero-click ~69%; AI Overviews cut top-result CTR ~58%; publisher traffic from Google down ~33% (Ahrefs / Jasper / Pixelmojo, 2026).
- AI referral conversion: ChatGPT ~15.9% vs Google organic ~1.76% (~9x); Perplexity ~10.5% (Seer Interactive / Pixelmojo, 2026).
- Entity grounding: Wikidata QIDs as canonical identifiers (no notability bar), Organization/Person schema with @id + sameAs (Wikidata, LinkedIn, Crunchbase), knowsAbout topic declaration, Google Business Profile, consistent NAP; cross-source validation builds entity confidence.
- Schema is a verification/trust signal for AI synthesis, not a ranking or display lever; schema alone is weak vs schema + Wikidata + off-site mentions + directories (digitalapplied, stackmatix, March 2026 structured-data analyses). ~92% of AI Overview citations come from pages already ranking top-10 (Onely).
- Brand mentions correlate with AI visibility ~0.664 vs backlinks ~0.218 (treat as directional; Onely / contentforce, 2026).
- Princeton GEO study: adding statistics and citations each boost AI visibility 30–40%; answer-first, extractable structure (FAQ/Q&A) lifted verbatim.
- Platform behaviour: Perplexity (freshness, evidence, Reddit ~46.5% of its citations), ChatGPT (depth, lifts structured formats), Gemini/AI Overviews (Knowledge Graph + GBP, FAQ schema), Claude (neutral, few sources). Timelines: Knowledge Panel ~3–6 months; citation lift ~90–120 days. (Tinuiti, Frase, Jasper, 2026.)
