#!/usr/bin/env python3
"""
Static-site generator for burnellconsultancy.co.uk.

Emits a self-contained static HTML site (no build tooling, no JS framework)
into ./dist ready to drag-and-drop into Netlify, then zips it.

Every page is assembled from the shared head/header/footer/schema helpers in
this file, so the entity strings, navigation, CTAs and JSON-LD stay identical
across all pages (AEO entity-consistency requirement, brief section 6).

British spelling throughout. No em-dashes in visible copy.
"""

import html
import json
import os
import shutil
import zipfile

# --------------------------------------------------------------------------- #
# Constants: entity, colours, nav                                             #
# --------------------------------------------------------------------------- #

SITE_URL = "https://burnellconsultancy.co.uk"

ORG_NAME = "Burnell Consultancy Ltd"
FOUNDER = "Dr David Burnell"
CTA_TEXT = "Book a fixed-price assessment"
CTA_HREF = "/assessment/"
CALENDLY_URL = "https://calendly.com/burnell-consultancy/assessment-call"
CONTACT_EMAIL = "hello@burnellconsultancy.co.uk"
THESIS_URL = "https://etheses.dur.ac.uk/11055/"

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

# Primary navigation. "Who we help" and "Services" render as grouped links.
NAV = [
    ("Assessment", "/assessment/"),
    ("Services", None, [
        ("Secrets and vault", "/services/secrets-vault/"),
        ("Golden image factory", "/services/golden-images/"),
        ("Security maturity (SAMM + ASPM)", "/services/security-maturity/"),
        ("PKI and machine identity", "/services/pki/"),
    ]),
    ("Who we help", None, [
        ("Scaling SaaS and fintech", "/who-we-help/scaling-saas/"),
        ("Regulated platforms", "/who-we-help/regulated-platforms/"),
        ("Financial services", "/who-we-help/financial-services/"),
    ]),
    ("About", "/about/"),
    ("Insights", "/insights/"),
    ("Scorecard", "/scorecard/"),
]


# --------------------------------------------------------------------------- #
# JSON-LD graph                                                               #
# --------------------------------------------------------------------------- #

def org_node():
    return {
        "@type": ["Organization", "ProfessionalService"],
        "@id": f"{SITE_URL}/#organization",
        "name": ORG_NAME,
        "legalName": ORG_NAME,
        "url": f"{SITE_URL}/",
        "email": CONTACT_EMAIL,
        "description": (
            "UK platform security engineering consultancy specialising in "
            "secrets management, CI/CD pipeline security, golden machine images "
            "and security programme maturity."
        ),
        "founder": {"@id": f"{SITE_URL}/#david-burnell"},
        "areaServed": {"@type": "Country", "name": "United Kingdom"},
        "priceRange": "££",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Godalming",
            "addressRegion": "Surrey",
            "addressCountry": "GB",
        },
        "sameAs": [
            "https://www.linkedin.com/company/burnell-consultancy",
            "https://github.com/burnell-consultancy",
            "https://find-and-update.company-information.service.gov.uk/",
        ],
    }


def person_node():
    return {
        "@type": "Person",
        "@id": f"{SITE_URL}/#david-burnell",
        "name": FOUNDER,
        "honorificPrefix": "Dr",
        "givenName": "David",
        "familyName": "Burnell",
        "jobTitle": "Founder and Principal Platform Security Engineer",
        "worksFor": {"@id": f"{SITE_URL}/#organization"},
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Durham University",
        },
        "knowsAbout": [
            "Secrets management", "HashiCorp Vault", "OpenBao",
            "Public key infrastructure", "CI/CD pipeline security",
            "CIS Benchmarks", "Golden images", "Non-human identity",
            "Application security posture management",
        ],
        "sameAs": [
            "https://www.linkedin.com/in/david-burnell",
            "https://github.com/dburnell",
            "https://orcid.org/0000-0000-0000-0000",
            "https://scholar.google.com/citations?user=placeholder",
            THESIS_URL,
        ],
    }


def professional_service_node():
    return {
        "@type": "ProfessionalService",
        "@id": f"{SITE_URL}/#service",
        "name": ORG_NAME,
        "url": f"{SITE_URL}/",
        "parentOrganization": {"@id": f"{SITE_URL}/#organization"},
        "areaServed": {"@type": "Country", "name": "GB"},
        "priceRange": "££",
        "serviceType": "Platform security engineering",
    }


def website_node():
    return {
        "@type": "WebSite",
        "@id": f"{SITE_URL}/#website",
        "url": f"{SITE_URL}/",
        "name": ORG_NAME,
        "publisher": {"@id": f"{SITE_URL}/#organization"},
        "inLanguage": "en-GB",
    }


def webpage_node(path, title, description):
    return {
        "@type": "WebPage",
        "@id": f"{SITE_URL}{path}#webpage",
        "url": f"{SITE_URL}{path}",
        "name": title,
        "description": description,
        "isPartOf": {"@id": f"{SITE_URL}/#website"},
        "about": {"@id": f"{SITE_URL}/#organization"},
        "inLanguage": "en-GB",
    }


def breadcrumb_node(path, crumbs):
    items = []
    for i, (name, href) in enumerate(crumbs, start=1):
        items.append({
            "@type": "ListItem",
            "position": i,
            "name": name,
            "item": f"{SITE_URL}{href}",
        })
    return {
        "@type": "BreadcrumbList",
        "@id": f"{SITE_URL}{path}#breadcrumb",
        "itemListElement": items,
    }


def faq_node(path, faqs):
    return {
        "@type": "FAQPage",
        "@id": f"{SITE_URL}{path}#faq",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }


def service_offer_node(path, name, description, price=None):
    node = {
        "@type": "Service",
        "@id": f"{SITE_URL}{path}#service",
        "name": name,
        "description": description,
        "provider": {"@id": f"{SITE_URL}/#organization"},
        "areaServed": {"@type": "Country", "name": "GB"},
        "serviceType": "Platform security engineering",
    }
    if price:
        node["offers"] = {
            "@type": "Offer",
            "price": str(price),
            "priceCurrency": "GBP",
            "availability": "https://schema.org/InStock",
            "url": f"{SITE_URL}{path}",
        }
    return node


def article_node(path, title, description, date):
    return {
        "@type": "Article",
        "@id": f"{SITE_URL}{path}#article",
        "headline": title,
        "description": description,
        "datePublished": date,
        "author": {"@id": f"{SITE_URL}/#david-burnell"},
        "publisher": {"@id": f"{SITE_URL}/#organization"},
        "mainEntityOfPage": {"@id": f"{SITE_URL}{path}#webpage"},
        "inLanguage": "en-GB",
    }


def build_graph(extra_nodes):
    graph = [
        org_node(),
        person_node(),
        professional_service_node(),
        website_node(),
    ]
    graph.extend(extra_nodes)
    return {"@context": "https://schema.org", "@graph": graph}


# --------------------------------------------------------------------------- #
# HTML helpers                                                                #
# --------------------------------------------------------------------------- #

def head(path, title, description, graph):
    canonical = f"{SITE_URL}{path}"
    og_image = f"{SITE_URL}/assets/og-card.png"
    schema = json.dumps(graph, indent=None, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description)}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{html.escape(ORG_NAME)}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(description)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og_image}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(description)}">
<meta name="twitter:image" content="{og_image}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/css/styles.css">
<script type="application/ld+json">{schema}</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
"""


def nav_html(active):
    items = []
    for entry in NAV:
        label = entry[0]
        href = entry[1]
        children = entry[2] if len(entry) > 2 else None
        if children:
            sub = "".join(
                f'<li><a href="{h}">{html.escape(l)}</a></li>' for l, h in children
            )
            items.append(
                f'<li class="has-sub"><button class="nav-group" aria-haspopup="true" '
                f'aria-expanded="false">{html.escape(label)}<span class="chev" aria-hidden="true">&#9662;</span></button>'
                f'<ul class="submenu">{sub}</ul></li>'
            )
        else:
            cls = ' class="active"' if href == active else ""
            items.append(f'<li><a href="{href}"{cls}>{html.escape(label)}</a></li>')
    return "".join(items)


def header(active):
    return f"""<header class="site-header">
<div class="wrap header-inner">
<a class="logo" href="/" aria-label="{html.escape(ORG_NAME)} home">
<span class="logo-a">Burnell</span><span class="logo-b">Consultancy</span>
</a>
<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">
<span></span><span></span><span></span>
</button>
<nav class="primary-nav" id="primary-nav" aria-label="Primary">
<ul>{nav_html(active)}</ul>
</nav>
<a class="btn btn-primary header-cta" href="{CTA_HREF}">{CTA_TEXT}</a>
</div>
</header>
<main id="main">
"""


def cta_band():
    return f"""<section class="cta-band">
<div class="wrap cta-band-inner">
<div>
<h2>Take credentials out of code. In two weeks, for a price you can see.</h2>
<p>Fixed scope, fixed fee, no lock-in. If you pass cleanly, we say so and leave.</p>
</div>
<a class="btn btn-invert" href="{CTA_HREF}">{CTA_TEXT}</a>
</div>
</section>
"""


def footer():
    year = 2026
    services = "".join(
        f'<li><a href="{h}">{html.escape(l)}</a></li>'
        for l, h in [
            ("Secrets and vault", "/services/secrets-vault/"),
            ("Golden image factory", "/services/golden-images/"),
            ("Security maturity", "/services/security-maturity/"),
            ("PKI and machine identity", "/services/pki/"),
        ]
    )
    personas = "".join(
        f'<li><a href="{h}">{html.escape(l)}</a></li>'
        for l, h in [
            ("Scaling SaaS and fintech", "/who-we-help/scaling-saas/"),
            ("Regulated platforms", "/who-we-help/regulated-platforms/"),
            ("Financial services", "/who-we-help/financial-services/"),
        ]
    )
    company = "".join(
        f'<li><a href="{h}">{html.escape(l)}</a></li>'
        for l, h in [
            ("The assessment", "/assessment/"),
            ("About Dr David Burnell", "/about/"),
            ("Insights", "/insights/"),
            ("Secrets Sprawl Scorecard", "/scorecard/"),
            ("Contact", "/contact/"),
        ]
    )
    return f"""</main>
<footer class="site-footer">
<div class="wrap footer-grid">
<div class="footer-brand">
<a class="logo" href="/"><span class="logo-a light">Burnell</span><span class="logo-b light">Consultancy</span></a>
<p>{html.escape(ORG_NAME)} is a UK platform security engineering firm. We take
credentials out of code, make machine images compliant by default, and turn
scanner noise into a roadmap your engineers will actually follow.</p>
<p class="footer-meta">Registered in England and Wales, company number [placeholder].<br>
Godalming, Surrey, GB. <a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a></p>
</div>
<div class="footer-col"><h3>Services</h3><ul>{services}</ul></div>
<div class="footer-col"><h3>Who we help</h3><ul>{personas}</ul></div>
<div class="footer-col"><h3>Company</h3><ul>{company}</ul></div>
</div>
<div class="footer-band">
<div class="wrap footer-band-inner">
<a class="btn btn-primary" href="{CTA_HREF}">{CTA_TEXT}</a>
<p class="copyright">&copy; {year} {html.escape(ORG_NAME)}. Vendor-neutral. No resale, no lock-in.</p>
</div>
</div>
</footer>
<script src="/js/main.js" defer></script>
</body>
</html>
"""


def page(path, title, description, body, extra_nodes, active=None,
         crumbs=None):
    if crumbs:
        extra_nodes = [breadcrumb_node(path, crumbs)] + extra_nodes
    extra_nodes = [webpage_node(path, title, description)] + extra_nodes
    graph = build_graph(extra_nodes)
    return head(path, title, description, graph) + header(active or path) + body + footer()


# --------------------------------------------------------------------------- #
# Reusable content blocks                                                     #
# --------------------------------------------------------------------------- #

def faq_block(faqs):
    items = []
    for q, a in faqs:
        items.append(f"""<details class="faq-item">
<summary>{html.escape(q)}</summary>
<div class="faq-answer"><p>{a}</p></div>
</details>""")
    return f"""<section class="section">
<div class="wrap narrow">
<h2>Questions technical buyers ask</h2>
<div class="faq-list">{''.join(items)}</div>
</div>
</section>"""


def calendly_embed(with_email=True):
    # Real Calendly inline widget. Loads Calendly's widget.js (the one third-party
    # script the brief permits). Degrades to a plain booking link without JS.
    email = ""
    if with_email:
        email = (f'<p class="muted">Prefer email? Write to '
                 f'<a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a> '
                 f'or use the <a href="/contact/">contact form</a>.</p>')
    return f"""<div class="calendly-embed" role="region" aria-label="Booking calendar">
<div class="calendly-inline-widget" data-url="{CALENDLY_URL}?hide_gdpr_banner=1&primary_color=2563eb"
     style="min-width:320px;height:700px;"></div>
<noscript>
<div class="calendly-placeholder">
<p><strong>Book an assessment call</strong></p>
<a class="btn btn-primary" href="{CALENDLY_URL}">Open the booking calendar</a>
</div>
</noscript>
{email}
</div>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>"""


ENTERPRISE_LOGOS = [
    ("ibm.svg", "IBM"),
    ("hp.svg", "HP"),
    ("g-research.svg", "G-Research"),
    ("aristocrat.svg", "Aristocrat Leisure"),
]


def enterprise_bar():
    logos = "".join(
        f'<img src="/assets/logos/{f}" alt="{html.escape(name)}" width="180" height="56" loading="lazy">'
        for f, name in ENTERPRISE_LOGOS
    )
    return f"""<section class="logo-wall" aria-label="Founder's enterprise track record">
<div class="wrap">
<h2>Tried and trusted by enterprise organisations</h2>
<div class="logo-row">{logos}</div>
<p class="logo-note">Platform security engineering built and scaled inside these
organisations by our founder, {FOUNDER}.</p>
</div>
</section>"""


def portrait(size="lead", extra_class=""):
    # dave.jpeg is not shipped with the brief; an SVG placeholder stands in.
    # Drop the real photo at /assets/dave.jpeg and update the <img src>.
    return (
        f'<img class="portrait {size} {extra_class}" '
        f'src="/assets/dave.jpeg" '
        f'onerror="this.onerror=null;this.src=\'/assets/dave-placeholder.svg\'" '
        f'width="800" height="800" loading="eager" decoding="async" '
        f'alt="Dr David Burnell, founder of Burnell Consultancy">'
    )


# --------------------------------------------------------------------------- #
# Pages                                                                        #
# --------------------------------------------------------------------------- #

def home():
    path = "/"
    title = "Burnell Consultancy | Platform security engineering, fixed-price"
    desc = (
        "Burnell Consultancy is a UK platform security engineering firm. We take "
        "credentials out of code, make machine images compliant by default, and "
        "turn scanner noise into a roadmap your engineers will follow. Fixed-price "
        "assessment from £14,000."
    )

    faqs = [
        ("Who is this for?",
         "Engineering-led organisations where security has to work with the grain "
         "of how developers build. Three groups in particular: Series B and later "
         "fintech and SaaS teams facing enterprise due diligence, regulated "
         "platforms in gaming, gambling and payments carrying repeat audit "
         "findings, and quant-finance and trading firms with secrets sprawl and "
         "legacy PKI."),
        ("What does the assessment cost?",
         "The Secrets and Pipeline Security Assessment is a fixed £14,000. It runs "
         "two weeks against one business unit and up to 20 repositories. The scope "
         "is agreed in writing before we start and the price is public, so there is "
         "no procurement guessing game."),
        ("Do you resell licences?",
         "No. We are vendor-neutral and take no reseller margin. We work across "
         "HashiCorp Vault, OpenBao, cloud KMS and CyberArk and recommend whatever "
         "fits your estate. You keep all intellectual property from every "
         "engagement."),
        ("Are you a pen-test firm?",
         "No. A penetration test tells you where an attacker could get in. We are "
         "platform security engineers: we change how secrets, pipelines and machine "
         "images work so whole classes of finding stop recurring. We build the fix, "
         "not just the report."),
    ]

    body = f"""<section class="hero">
<div class="wrap hero-grid">
<div class="hero-copy">
<p class="eyebrow">UK platform security engineering</p>
<h1>Secrets, pipelines and golden images. Fixed by the person who did it at 1,000-namespace scale.</h1>
<p class="lede">{html.escape(ORG_NAME)} is a UK platform security engineering firm.
We take credentials out of code, make machine images compliant by default, and
turn scanner noise into a roadmap your engineers will actually follow.</p>
<div class="hero-cta">
<a class="btn btn-primary btn-lg" href="{CTA_HREF}">Book a fixed-price assessment</a>
<a class="btn btn-ghost btn-lg" href="#process">See how it works</a>
</div>
</div>
<div class="hero-media">
<div class="portrait-ring">{portrait('lead')}</div>
<p class="portrait-caption">Dr David Burnell, founder</p>
</div>
</div>
</section>

<section class="trust-bar" aria-label="Key facts">
<div class="wrap trust-grid">
<div class="stat"><span class="stat-num tnum">1,000+</span><span class="stat-label">Vault namespaces architected and scaled</span></div>
<div class="stat"><span class="stat-num tnum">25% &rarr; 95%+</span><span class="stat-label">CIS Level 1 compliance in one programme</span></div>
<div class="stat"><span class="stat-num tnum">£14k fixed</span><span class="stat-label">assessment, scoped in writing, no lock-in</span></div>
<div class="stat"><span class="stat-num tnum">PhD</span><span class="stat-label">plus peer-reviewed publications (PLOS Biology, BMC Bioinformatics)</span></div>
</div>
</section>

<section class="section">
<div class="wrap">
<h2 class="section-q">Why do security programmes stall in engineering organisations?</h2>
<p class="answer-first">Because they arrive as findings, not as fixes. A scanner
or an auditor hands engineering a list, engineering is already shipping product,
and the list rots. The way out is to change the platform so the finding cannot
recur: credentials leave the code, images ship compliant, and the remaining risk
becomes a short roadmap with owners and dates.</p>
<div class="card-grid three">
<article class="card">
<p class="card-kicker">Deals stalling on security questionnaires</p>
<h3>Secrets and pipeline assessment</h3>
<p>A scored, two-week review that turns a stalled enterprise due-diligence
questionnaire into evidence you can send back the same week.</p>
<a class="card-link" href="/assessment/">See the assessment &rarr;</a>
</article>
<article class="card teal">
<p class="card-kicker">Recurring audit findings</p>
<h3>Golden image factory</h3>
<p>Machine images that are CIS-compliant the moment they boot, rebuilt on a
schedule so patching stops being a fire drill.</p>
<a class="card-link" href="/services/golden-images/">See golden images &rarr;</a>
</article>
<article class="card amber">
<p class="card-kicker">Scanner noise nobody actions</p>
<h3>Security maturity and ASPM</h3>
<p>SAMM-based prioritisation and application security posture management that
turns thousands of alerts into the ten things worth doing first.</p>
<a class="card-link" href="/services/security-maturity/">See security maturity &rarr;</a>
</article>
</div>
</div>
</section>

<section class="section alt" id="process">
<div class="wrap">
<h2 class="section-q">How does an engagement work?</h2>
<p class="answer-first">Three steps, and you can stop after any one of them.
Assess to find out where you stand, build to fix what matters, run only if you
want an ongoing hand on the tiller.</p>
<ol class="process">
<li><span class="step-n tnum">1</span><h3>Assess</h3><p>A two-week, fixed-price review of secrets and pipeline security against one business unit. Scored report, 90-day plan, executive readout.</p></li>
<li><span class="step-n tnum">2</span><h3>Build</h3><p>A scoped statement of work to implement the fixes: vault rollout, golden image factory, PKI. You keep all the IP.</p></li>
<li><span class="step-n tnum">3</span><h3>Run</h3><p>Optional fractional security lead who keeps the platform healthy and your engineers unblocked, month to month.</p></li>
</ol>
</div>
</section>

<section class="founder-strip">
<div class="wrap founder-inner">
{portrait('sm', 'founder-photo')}
<div>
<p class="founder-lines">Founded by {FOUNDER}: ex G-Research, ex Aristocrat, ex IBM Security.
The person you meet is the person who does the work.</p>
<a class="card-link light" href="/about/">Read the full profile &rarr;</a>
</div>
</div>
</section>

{enterprise_bar()}

{faq_block(faqs)}

{cta_band()}
"""
    extra = [
        service_offer_node("/assessment/", "Secrets and Pipeline Security Assessment",
                           "Two-week fixed-price review of secrets and CI/CD pipeline security.", 14000),
        faq_node(path, faqs),
    ]
    return path, page(path, title, desc, body, extra, active="/")


def assessment():
    path = "/assessment/"
    title = "The Secrets and Pipeline Security Assessment | £14,000 fixed"
    desc = (
        "A two-week, fixed-price (£14,000) review of how your organisation handles "
        "secrets and pipeline security. You get a scored report, a 90-day "
        "remediation plan, and an executive readout. If you pass cleanly, we say so "
        "and leave."
    )
    faqs = [
        ("What exactly do I get for £14,000?",
         "A scored assessment report against a defined secrets and pipeline "
         "security model, a prioritised 90-day remediation plan with owners and "
         "effort estimates, and a 60-minute executive readout. Everything is yours "
         "to keep and share with auditors or customers."),
        ("How is the price fixed if you do not know our estate yet?",
         "The scope is fixed, not open-ended: one business unit, up to 20 "
         "repositories, remote-first. We agree that boundary in writing before we "
         "start. If your estate is larger, we scope additional units the same way, "
         "each at a stated price."),
        ("What if we are actually in good shape?",
         "Then the report says so, in writing, and we leave. A clean assessment you "
         "can hand to an enterprise buyer or a regulator is worth more than a "
         "manufactured list of problems. We do not pad findings to justify a "
         "follow-on sale."),
        ("Do you need production access?",
         "No standing production access. We work from read-only reviews of "
         "repositories, pipeline configuration and secrets tooling, plus interviews "
         "with your platform and security engineers. Anything more invasive is "
         "agreed explicitly and in scope."),
        ("Who does the work?",
         f"{FOUNDER} does the work. You are not handed to a junior after the sales "
         "call. That is the point of a boutique: the person who architected Vault "
         "at 1,000-namespace scale is the person reading your pipelines."),
    ]
    body = f"""<section class="page-hero">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Assessment</span></nav>
<p class="eyebrow">The wedge offer</p>
<h1>The Secrets and Pipeline Security Assessment</h1>
<p class="answer-first big">A two-week, fixed-price (£14,000) review of how your
organisation handles secrets and pipeline security. You get a scored report, a
90-day remediation plan, and an executive readout. If you pass cleanly, we say
so and leave.</p>
<div class="hero-cta">
<a class="btn btn-primary btn-lg" href="#book">Book a fixed-price assessment</a>
<a class="btn btn-ghost btn-lg" href="#included">What is included</a>
</div>
</div>
</section>

<section class="section" id="included">
<div class="wrap">
<h2 class="section-q">What is in scope?</h2>
<p class="answer-first">One business unit, remote-first, over two calendar weeks.
The boundary is fixed in writing so the price can be fixed too.</p>
<div class="table-wrap">
<table class="spec-table">
<thead><tr><th>Dimension</th><th>Included</th></tr></thead>
<tbody>
<tr><td>Business units</td><td>One</td></tr>
<tr><td>Repositories</td><td>Up to 20</td></tr>
<tr><td>Duration</td><td>Two calendar weeks</td></tr>
<tr><td>Delivery</td><td>Remote-first, on-site optional</td></tr>
<tr><td>Access</td><td>Read-only review plus engineer interviews</td></tr>
<tr><td>Price</td><td class="tnum">£14,000, fixed, stated in writing</td></tr>
</tbody>
</table>
</div>
</div>
</section>

<section class="section alt">
<div class="wrap">
<h2 class="section-q">What do you receive?</h2>
<div class="card-grid three">
<article class="card"><h3>Scored report</h3><p>Your secrets and pipeline posture scored against a defined model, with evidence for every score. Shareable with auditors and enterprise buyers.</p></article>
<article class="card"><h3>90-day remediation plan</h3><p>A prioritised, owner-assigned plan with effort estimates. The first thing to fix is at the top; the roadmap is the deliverable, not a sales hook.</p></article>
<article class="card"><h3>Executive readout</h3><p>A 60-minute session translating the technical findings into risk, cost and timeline for the people who sign off budget.</p></article>
</div>
</div>
</section>

<section class="section">
<div class="wrap">
<h2 class="section-q">Who is it for?</h2>
<ul class="icp-list">
<li><strong>The scaling CTO.</strong> Series B and later fintech or SaaS, where enterprise security questionnaires are stalling deals and DORA is on the horizon.</li>
<li><strong>The regulated head of platform.</strong> Gaming, gambling and payments teams carrying recurring CIS audit findings and slow zero-day patching.</li>
<li><strong>The quant-finance CISO.</strong> Hedge funds and trading firms in London facing secrets sprawl, legacy PKI and non-human identity growth.</li>
</ul>
</div>
</section>

<section class="section alt">
<div class="wrap">
<h2 class="section-q">What happens week by week?</h2>
<ol class="process two">
<li><span class="step-n tnum">Wk 1</span><h3>Discover and map</h3><p>Kick-off, access set-up, and a systematic review of repositories, pipeline configuration and secrets tooling. We map where credentials live and how they move.</p></li>
<li><span class="step-n tnum">Wk 2</span><h3>Score and plan</h3><p>Scoring against the model, drafting the 90-day plan, and the executive readout. You end the fortnight with evidence and a route forward.</p></li>
</ol>
</div>
</section>

{faq_block(faqs)}

<section class="section" id="book">
<div class="wrap narrow">
<h2 class="section-q">Book an assessment call</h2>
<p class="answer-first">A 30-minute call to confirm scope and fit. No slide deck,
no obligation. If we are not the right people for your problem we will tell you.</p>
{calendly_embed(with_email=True)}
</div>
</section>
"""
    extra = [
        service_offer_node(path, "Secrets and Pipeline Security Assessment",
                           desc, 14000),
        faq_node(path, faqs),
    ]
    crumbs = [("Home", "/"), ("Assessment", path)]
    return path, page(path, title, desc, body, extra, active="/assessment/", crumbs=crumbs)


# ---- Service page template ------------------------------------------------ #

def service_page(path, title, meta_desc, h1, answer, evidence_h, evidence_p,
                 price_band, deliverables, faqs, diagram_desc, price=None,
                 accent=""):
    delivs = "".join(f"<li>{d}</li>" for d in deliverables)
    body = f"""<section class="page-hero {accent}">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/assessment/">Services</a> / <span>{html.escape(h1[:32])}...</span></nav>
<p class="eyebrow">Service</p>
<h1>{h1}</h1>
<p class="answer-first big">{answer}</p>
<a class="btn btn-primary btn-lg" href="/assessment/">Book a fixed-price assessment</a>
</div>
</section>

<section class="section">
<div class="wrap two-col">
<div>
<h2 class="section-q">{evidence_h}</h2>
<p class="answer-first">{evidence_p}</p>
</div>
<figure class="diagram" role="img" aria-label="{html.escape(diagram_desc)}">
<!-- Diagram: {diagram_desc} -->
<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<rect x="8" y="8" width="304" height="184" rx="12" fill="#f1f5f9" stroke="#e2e8f0"/>
<rect x="28" y="40" width="80" height="36" rx="8" fill="#fff" stroke="#2563eb"/>
<rect x="212" y="40" width="80" height="36" rx="8" fill="#fff" stroke="#0d9488"/>
<rect x="120" y="120" width="80" height="36" rx="8" fill="#fff" stroke="#d97706"/>
<path d="M108 58 H212" stroke="#1a2332" stroke-width="2" marker-end="url(#a)"/>
<path d="M160 76 V120" stroke="#1a2332" stroke-width="2" marker-end="url(#a)"/>
<defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#1a2332"/></marker></defs>
</svg>
<figcaption>{html.escape(diagram_desc)}</figcaption>
</figure>
</div>
</section>

<section class="section alt">
<div class="wrap two-col">
<div>
<h2 class="section-q">What does it cost?</h2>
<p class="answer-first">{price_band}</p>
</div>
<div>
<h2 class="section-q">What you get</h2>
<ul class="check-list">{delivs}</ul>
</div>
</div>
</section>

{faq_block(faqs)}

{cta_band()}
"""
    extra = [
        service_offer_node(path, h1, meta_desc, price),
        faq_node(path, faqs),
    ]
    crumbs = [("Home", "/"), ("Services", "/assessment/"), (h1, path)]
    return path, page(path, title, meta_desc, body, extra, active=None, crumbs=crumbs)


def secrets_vault():
    return service_page(
        "/services/secrets-vault/",
        "Get secrets out of code and CI | Vault and OpenBao engineering",
        "We design and roll out secrets management with Vault, OpenBao, cloud KMS "
        "or CyberArk so credentials leave your code and pipelines. Vendor-neutral, "
        "you keep all IP. Engagements typically £45,000 to £120,000.",
        "How do we get secrets out of code and CI?",
        "You move every credential behind a broker that issues short-lived, "
        "audited secrets, then wire your pipelines and workloads to fetch them at "
        "run time. We design the model, roll it out across Vault, OpenBao, cloud "
        "KMS or CyberArk, and migrate your existing secrets so nothing hard-codes a "
        "password ever again.",
        "The proof point",
        "The founder architected and scaled a secrets platform to more than 1,000 "
        "Vault namespaces, covering human and non-human identity across a large "
        "engineering estate. That is the experience reading your pipelines, not a "
        "vendor deck. We are vendor-neutral: the right answer might be OpenBao and "
        "cloud KMS, not the most expensive licence.",
        "Vault, PKI and machine-identity engagements typically run £45,000 to "
        "£120,000 depending on estate size, with retainers available. Every "
        "engagement starts from the £14,000 assessment so the scope is grounded in "
        "evidence, not guesswork.",
        [
            "Target-state secrets architecture across Vault, OpenBao, cloud KMS or CyberArk",
            "Dynamic, short-lived credentials for databases, cloud and CI/CD",
            "Migration plan and tooling to remove hard-coded secrets from code and history",
            "Non-human and workload identity model (OIDC, SPIFFE where it fits)",
            "Runbooks, policies and handover so your team owns it",
        ],
        [
            ("Which secrets manager should we use?",
             "It depends on your estate and appetite. Vault is the mature default; "
             "OpenBao is the open-source fork for teams avoiding licence exposure; "
             "cloud KMS suits single-cloud shops; CyberArk fits where privileged "
             "access is already the centre of gravity. We are vendor-neutral and "
             "recommend the fit, not a margin."),
            ("Do we have to rip out what we have?",
             "Rarely. Most estates already have some secrets tooling. We usually "
             "consolidate and correct rather than replace, and we sequence the "
             "migration so nothing breaks in flight."),
            ("What about secrets already leaked into git history?",
             "We inventory them, prioritise by blast radius, rotate the live ones "
             "first, then plan history remediation. Rotation beats scrubbing as the "
             "first move, because a rotated secret is dead whether or not it is "
             "still in history."),
        ],
        "Left node 'code and CI' loses its embedded key; arrow to a central "
        "'secrets broker' (Vault or OpenBao) which issues short-lived credentials "
        "down to a 'workload' node, with an audit log branch.",
        price=None,
        accent="accent-blue",
    )


def golden_images():
    return service_page(
        "/services/golden-images/",
        "Golden image factory | CIS-compliant machine images by default",
        "We build a golden image factory so your machine images boot CIS-compliant "
        "and rebuild on a schedule. Patching stops being a fire drill. Fixed-price "
        "£28,000 to £60,000.",
        "How do we stop failing the same CIS audit every year?",
        "You stop hand-patching servers and start baking compliance into the image. "
        "A golden image factory builds hardened, CIS-benchmarked machine images on a "
        "pipeline, tests them, and republishes on a schedule, so every instance "
        "boots compliant and zero-day patching is a rebuild, not a scramble.",
        "The proof point",
        "The founder ran a compliance programme that moved CIS Level 1 conformance "
        "from 25% to more than 95% by industrialising image builds rather than "
        "chasing findings by hand. The same factory pattern cuts mean time to patch "
        "because a new base image propagates through rebuilds instead of manual "
        "intervention on live hosts.",
        "The golden image factory is a fixed-price build, typically £28,000 to "
        "£60,000 depending on the number of image families and target platforms. "
        "It starts from the £14,000 assessment so scope reflects your actual estate.",
        [
            "Hardened base images built to CIS Benchmarks for your OS families",
            "Automated build, test and compliance-scan pipeline (Packer or equivalent)",
            "Scheduled rebuilds so patches propagate without live-host firefighting",
            "Provenance and signing so you can prove what shipped",
            "CIS conformance reporting your auditors can read directly",
        ],
        [
            ("Which platforms do you support?",
             "The pattern is platform-agnostic: Linux and Windows base images across "
             "AWS, Azure, GCP and on-prem hypervisors. We build the factory around "
             "the OS families and clouds you actually run."),
            ("How does this help with zero-days?",
             "When a critical CVE lands, you patch the base image once and trigger "
             "rebuilds, and the fix flows to every new instance automatically. Your "
             "mean time to patch drops from weeks of manual work to the length of a "
             "pipeline run."),
            ("Do we keep the pipeline?",
             "Yes. You keep all the IP: the image definitions, the pipeline and the "
             "hardening code are yours. We build it to be owned and maintained by "
             "your team, with a documented handover."),
        ],
        "A pipeline flowing left to right: 'base OS' into 'harden (CIS)' into "
        "'test and scan' into 'sign and publish', with a scheduled-trigger clock "
        "feeding the start and a compliance-report output branching off the end.",
        price=None,
        accent="accent-teal",
    )


def security_maturity():
    return service_page(
        "/services/security-maturity/",
        "Security maturity: SAMM and ASPM | Turn scanner noise into a roadmap",
        "We use OWASP SAMM and application security posture management to turn "
        "thousands of scanner alerts into a prioritised roadmap your engineers will "
        "follow. Fixed-price assessment plus scoped build.",
        "How do we turn thousands of scanner alerts into work engineers will do?",
        "You stop treating every alert as equal and start measuring maturity. Using "
        "OWASP SAMM as the frame and application security posture management (ASPM) "
        "to correlate findings, we cut the noise to the handful of changes that move "
        "real risk, then sequence them into a roadmap owned by engineering rather "
        "than imposed on it.",
        "The proof point",
        "Scanner tools are good at finding and bad at prioritising: a typical estate "
        "carries thousands of open alerts that no one actions because everything "
        "looks urgent. SAMM gives a defensible maturity baseline and ASPM "
        "de-duplicates and ranks findings by exploitability and blast radius, so the "
        "roadmap reflects risk, not alert count.",
        "Security maturity work is usually a fixed-price assessment followed by a "
        "scoped statement of work for the build, sized to your estate. It starts "
        "from the £14,000 assessment and prices the follow-on in writing.",
        [
            "OWASP SAMM maturity baseline across governance, design, implementation and operations",
            "ASPM tooling to correlate, de-duplicate and rank existing scanner output",
            "A prioritised roadmap with owners, effort and expected risk reduction",
            "Guardrails and paved-road patterns so new code is secure by default",
            "Metrics your leadership can track quarter on quarter",
        ],
        [
            ("Is this just another scanner?",
             "No. We usually work with the scanners you already have. ASPM sits "
             "above them to correlate and prioritise, and SAMM measures the "
             "programme, not the code. The output is fewer, better-sequenced actions, "
             "not another alert firehose."),
            ("Why SAMM and not another framework?",
             "SAMM is open, engineering-friendly and measures the practices that "
             "actually change outcomes. It maps cleanly to the way software teams "
             "work, which matters when the goal is a roadmap engineers will adopt "
             "rather than resist."),
            ("How long before we see fewer findings?",
             "The prioritisation is immediate: within the assessment you get the "
             "ranked shortlist. The reduction in open findings follows as the "
             "roadmap lands, typically over the first 90 days."),
        ],
        "A funnel: a wide 'raw scanner alerts' inlet narrowing through an 'ASPM "
        "correlate and de-duplicate' stage and a 'SAMM prioritise' stage down to a "
        "short 'roadmap' outlet with numbered items.",
        price=None,
        accent="accent-amber",
    )


def pki():
    return service_page(
        "/services/pki/",
        "PKI and machine identity | Fix legacy PKI and non-human identity sprawl",
        "We modernise public key infrastructure and machine identity: short-lived "
        "certificates, automated rotation and a workload identity model that scales. "
        "Engagements typically £45,000 to £120,000.",
        "How do we fix legacy PKI and the explosion of non-human identities?",
        "You replace long-lived, hand-managed certificates with short-lived ones "
        "issued and rotated automatically, and you give every workload a verifiable "
        "identity instead of a shared secret. We design the PKI, automate issuance "
        "and rotation, and build a machine-identity model that scales with your "
        "estate rather than against it.",
        "The proof point",
        "Non-human identities now outnumber humans in most engineering estates by a "
        "wide margin, and legacy PKI, with certificates that live for years and "
        "rotate by hand, is where the outages and the audit findings come from. The "
        "founder has architected identity for both human and non-human principals at "
        "scale, including the Vault and PKI plumbing that makes short-lived "
        "credentials practical.",
        "PKI and machine-identity engagements typically run £45,000 to £120,000 "
        "depending on estate size and integration surface, with retainers available "
        "for ongoing operation. Every engagement starts from the £14,000 assessment.",
        [
            "Modern PKI design with short-lived, automatically rotated certificates",
            "Automated issuance via Vault PKI, cloud CA or ACME where it fits",
            "Workload identity model (OIDC, SPIFFE/SPIRE, cloud-native identity)",
            "Migration off long-lived certificates and shared service credentials",
            "Monitoring and alerting so expiry never causes an outage again",
        ],
        [
            ("Why short-lived certificates?",
             "A certificate that lives for an hour cannot be stolen and reused for a "
             "year. Short lifetimes plus automated rotation remove the manual "
             "tracking that causes both outages and audit findings, and they shrink "
             "the window any compromised credential is useful for."),
            ("What is non-human identity and why does it matter?",
             "Every service, pipeline job, container and script needs to prove who it "
             "is. These non-human identities now vastly outnumber people, and when "
             "they authenticate with shared, long-lived secrets they are the softest "
             "target in the estate. A proper workload identity model fixes that."),
            ("Can you work with our existing CA?",
             "Usually, yes. We assess what you have and modernise around it where "
             "that is sensible, or plan a migration where the legacy CA is the "
             "problem. Vendor-neutral, as with everything we do."),
        ],
        "Two columns: 'legacy PKI' with a long-lived certificate icon and a manual "
        "hand, versus 'modern PKI' with a certificate authority issuing short-lived "
        "certs to workload nodes on an automated rotation loop.",
        price=None,
        accent="accent-blue",
    )


# ---- Persona page template ------------------------------------------------ #

def persona_page(path, title, meta_desc, h1, situation, pains, mappings,
                 numbers, accent):
    pain_items = "".join(f"<li><strong>{h}</strong> {p}</li>" for h, p in pains)
    map_rows = "".join(
        f"<tr><td>{pain}</td><td><a href=\"{href}\">{svc}</a></td></tr>"
        for pain, svc, href in mappings
    )
    num_items = "".join(
        f'<div class="stat"><span class="stat-num tnum">{n}</span><span class="stat-label">{l}</span></div>'
        for n, l in numbers
    )
    body = f"""<section class="page-hero {accent}">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/">Who we help</a> / <span>{html.escape(h1[:28])}...</span></nav>
<p class="eyebrow">Who we help</p>
<h1>{h1}</h1>
<p class="answer-first big">{situation}</p>
<a class="btn btn-primary btn-lg" href="/assessment/">Book a fixed-price assessment</a>
</div>
</section>

<section class="trust-bar">
<div class="wrap trust-grid">{num_items}</div>
</section>

<section class="section">
<div class="wrap narrow">
<h2 class="section-q">The three pains, in your language</h2>
<ul class="icp-list">{pain_items}</ul>
</div>
</section>

<section class="section alt">
<div class="wrap narrow">
<h2 class="section-q">Which service fixes which pain?</h2>
<div class="table-wrap">
<table class="spec-table">
<thead><tr><th>The pain</th><th>What we do about it</th></tr></thead>
<tbody>{map_rows}</tbody>
</table>
</div>
</div>
</section>

{cta_band()}
"""
    extra = []
    crumbs = [("Home", "/"), ("Who we help", "/"), (h1, path)]
    return path, page(path, title, meta_desc, body, extra, active=None, crumbs=crumbs)


def scaling_saas():
    return persona_page(
        "/who-we-help/scaling-saas/",
        "Security for Series B+ engineering teams | Burnell Consultancy",
        "For Series B and later fintech and SaaS teams facing enterprise due "
        "diligence and DORA. We take secrets out of code and give you evidence for "
        "the security questionnaire, fixed-price from £14,000.",
        "Security for Series B+ engineering teams facing enterprise due diligence",
        "You are 100 to 400 engineers, growth is gated by enterprise deals, and "
        "every one of those deals now arrives with a security questionnaire your "
        "team cannot answer cleanly. We turn that questionnaire from a deal-blocker "
        "into evidence, starting with a two-week, £14,000 assessment.",
        [
            ("Questionnaires stall deals.", "Enterprise buyers send 200-line "
             "security questionnaires and your honest answers about secrets in code "
             "and CI slow or kill the deal."),
            ("DORA is coming into view.", "Digital operational resilience "
             "requirements are landing, and your CI/CD pipeline evidence is not "
             "where it needs to be."),
            ("Security cannot slow shipping.", "You cannot bolt on a heavy security "
             "process without losing the velocity that got you here, so fixes have "
             "to work with the grain of how your engineers build."),
        ],
        [
            ("Questionnaires you cannot answer", "Secrets and Pipeline Assessment", "/assessment/"),
            ("Credentials in code and CI", "Secrets and vault engineering", "/services/secrets-vault/"),
            ("Scanner noise with no roadmap", "Security maturity and ASPM", "/services/security-maturity/"),
        ],
        [
            ("9,300+", "UK cyber-security skills-gap shortfall you are hiring against"),
            ("£705/day", "typical UK security contractor benchmark"),
            ("£14k fixed", "assessment with evidence you can send buyers"),
        ],
        "accent-blue",
    )


def regulated_platforms():
    return persona_page(
        "/who-we-help/regulated-platforms/",
        "Security for regulated platforms | Gaming, gambling and payments",
        "For gaming, gambling and payments platforms with 200 to 2,000 engineers "
        "carrying recurring CIS audit findings and slow patching. Our golden image "
        "factory makes compliance the default.",
        "Security for regulated platforms carrying recurring audit findings",
        "You run a platform of 200 to 2,000 engineers in gaming, gambling or "
        "payments, and the same CIS findings come back every audit while zero-day "
        "patching takes weeks. We industrialise your machine images so compliance is "
        "the default and patching is a rebuild, not a fire drill.",
        [
            ("Recurring CIS audit findings.", "The same benchmark failures resurface "
             "every audit cycle because they are fixed by hand on live hosts and "
             "drift straight back."),
            ("Slow zero-day patching.", "When a critical CVE lands, patching every "
             "instance by hand takes weeks you do not have under regulatory scrutiny."),
            ("Scale makes it worse.", "At thousands of hosts, any manual compliance "
             "process is a losing race, and the auditors know it."),
        ],
        [
            ("Repeat CIS findings", "Golden image factory", "/services/golden-images/"),
            ("Slow patching", "Golden image factory", "/services/golden-images/"),
            ("No maturity baseline", "Security maturity and ASPM", "/services/security-maturity/"),
        ],
        [
            ("25% &rarr; 95%+", "CIS Level 1 conformance achieved in one programme"),
            ("Rebuild", "not hand-patch: zero-day response measured in a pipeline run"),
            ("£28k to £60k", "fixed-price golden image factory build"),
        ],
        "accent-teal",
    )


def financial_services():
    return persona_page(
        "/who-we-help/financial-services/",
        "Security for financial services | Hedge funds and trading firms",
        "For London hedge funds and trading firms facing secrets sprawl, legacy PKI "
        "and non-human identity growth. We modernise secrets and identity with "
        "Vault and PKI engagements.",
        "Security for trading firms facing secrets sprawl and legacy PKI",
        "You are a hedge fund or trading firm in London where secrets are scattered "
        "across scripts and services, PKI is ageing, and non-human identities are "
        "multiplying faster than anyone can track. We consolidate secrets behind a "
        "vault and modernise PKI so machine identity scales with you, not against "
        "you.",
        [
            ("Secrets sprawl.", "Credentials live in scripts, config files and "
             "developer machines with no central control, audit or rotation."),
            ("Legacy PKI.", "Long-lived certificates rotated by hand cause outages "
             "and audit findings, and nobody is confident what expires when."),
            ("Non-human identity explosion.", "Services, jobs and bots authenticate "
             "with shared long-lived secrets, and their number is growing faster "
             "than your controls."),
        ],
        [
            ("Secrets scattered everywhere", "Secrets and vault engineering", "/services/secrets-vault/"),
            ("Ageing, manual PKI", "PKI and machine identity", "/services/pki/"),
            ("Where do we even start", "Secrets and Pipeline Assessment", "/assessment/"),
        ],
        [
            ("1,000+", "Vault namespaces architected and scaled by the founder"),
            ("Short-lived", "certificates and credentials, rotated automatically"),
            ("£45k to £120k", "typical Vault and PKI engagement, retainers available"),
        ],
        "accent-amber",
    )


def about():
    path = "/about/"
    title = "Dr David Burnell | Founder, Burnell Consultancy Ltd"
    desc = (
        "Burnell Consultancy Ltd is a UK platform security engineering firm founded "
        "by Dr David Burnell, ex G-Research, ex Aristocrat, ex IBM Security. PhD "
        "from Durham University, peer-reviewed publications in PLOS Biology and BMC "
        "Bioinformatics."
    )
    body = f"""<section class="page-hero">
<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>About</span></nav>
<div class="about-grid">
<div>
<p class="eyebrow">The person who does the work</p>
<h1>Dr David Burnell</h1>
<p class="answer-first big">{html.escape(ORG_NAME)} is a UK platform security
engineering consultancy founded by {FOUNDER}. It takes credentials out of code,
makes machine images compliant by default, and turns scanner noise into a
prioritised roadmap. The founder architected secrets management at more than
1,000 Vault namespaces and moved CIS Level 1 compliance from 25% to over 95% in
a single programme.</p>
</div>
<div class="about-photo">
<div class="portrait-ring">{portrait('lead')}</div>
</div>
</div>
</div>
</section>

<section class="section">
<div class="wrap narrow prose">
<h2 class="section-q">Career: IBM Security to G-Research</h2>
<p>Dave has spent his career at the platform-security end of engineering. He
began at <strong>IBM Security</strong>, moved through <strong>HP</strong>, then
built and scaled secrets and identity platforms at <strong>G-Research</strong>,
one of Europe's leading quantitative-finance firms, and at
<strong>Aristocrat</strong> in regulated gaming. The common thread is making
security work at scale inside fast-moving engineering organisations: Vault at
1,000-plus namespaces, golden-image factories, PKI and non-human identity.</p>

<h2 class="section-q">Doctorate and publications</h2>
<p>Dave holds a <strong>PhD in Biological Chemistry from Durham University</strong>.
His <a href="{THESIS_URL}">doctoral thesis is publicly available</a> in the Durham
e-Theses archive. His research was published in two peer-reviewed journals:
<strong>PLOS Biology (2013)</strong> and <strong>BMC Bioinformatics (2013)</strong>.
The research grounding matters here: platform security is an evidence discipline,
and the habit of measuring before asserting carries directly into the work.</p>

<h2 class="section-q">Open source</h2>
<p>Dave's open-source history includes the <strong>&Delta;&Delta;PT toolbox</strong>,
built during his research years. The same instinct, publishing methods so others
can check and reuse them, is why every engagement leaves you owning the code and
the runbooks rather than renting them.</p>

<h2 class="section-q">The company</h2>
<p>{html.escape(ORG_NAME)} is registered in England and Wales, company number
[placeholder], based in <strong>Godalming, Surrey</strong>. It is deliberately a
boutique: the person you meet on the assessment call is the person who reads your
pipelines and writes your remediation plan. There is no bench of juniors and no
reseller margin. We are vendor-neutral across HashiCorp Vault, OpenBao, cloud KMS
and CyberArk.</p>

<div class="entity-facts">
<h3>Entity facts</h3>
<dl>
<dt>Legal name</dt><dd>{html.escape(ORG_NAME)}</dd>
<dt>Founder</dt><dd>{FOUNDER}, PhD (Durham University)</dd>
<dt>Registered</dt><dd>England and Wales, company number [placeholder]</dd>
<dt>Location</dt><dd>Godalming, Surrey, GB</dd>
<dt>Discipline</dt><dd>Platform security engineering: secrets, pipelines, golden images, PKI</dd>
<dt>Prior roles</dt><dd>IBM Security, HP, G-Research, Aristocrat</dd>
<dt>Publications</dt><dd>PLOS Biology (2013), BMC Bioinformatics (2013)</dd>
</dl>
</div>
</div>
</section>

{cta_band()}
"""
    extra = []
    crumbs = [("Home", "/"), ("About", path)]
    return path, page(path, title, desc, body, extra, active="/about/", crumbs=crumbs)


def scorecard():
    path = "/scorecard/"
    title = "Secrets Sprawl Scorecard | Score your secrets in ten minutes"
    desc = (
        "How bad is your secrets sprawl? Score yourself in ten minutes with the free "
        "Secrets Sprawl Scorecard from Burnell Consultancy. Ten questions, one PDF, "
        "no obligation."
    )
    questions = [
        "Can you list, right now, every place a production database password lives?",
        "Are any credentials hard-coded in application source or CI configuration?",
        "Do any secrets sit in plaintext in environment files or CI variables?",
        "Are secrets rotated automatically, or only when someone remembers?",
        "Do you know which secrets have leaked into git history?",
        "Do machine and workload identities use short-lived credentials?",
        "Is there a single audited broker issuing secrets, or many stores?",
        "Can you revoke a compromised credential everywhere within minutes?",
        "Do developers need to see raw secrets to do their jobs?",
        "Could you evidence all of the above to an enterprise auditor this week?",
    ]
    q_items = "".join(f"<li>{q}</li>" for q in questions)
    body = f"""<section class="page-hero accent-blue">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Scorecard</span></nav>
<p class="eyebrow">Free lead magnet</p>
<h1>How bad is your secrets sprawl? Score yourself in ten minutes.</h1>
<p class="answer-first big">A ten-question self-assessment that tells you how
exposed your secrets and pipelines are, and what to fix first. Free, no call
required. Answer honestly and you will know within ten minutes whether you need
the full assessment.</p>
</div>
</section>

<section class="section">
<div class="wrap two-col">
<div>
<h2 class="section-q">The ten questions</h2>
<ol class="scorecard-q">{q_items}</ol>
<p class="muted">Score one point for every clean answer. Under seven and secrets
sprawl is already a live risk to your next enterprise deal or audit.</p>
</div>
<div class="lead-form-wrap">
<form class="lead-form" name="scorecard" method="POST"
      action="/thank-you/" data-endpoint="{CONTACT_EMAIL}">
<input type="hidden" name="source" value="scorecard">
<h2>Get the scored PDF</h2>
<p>We will email you the printable scorecard and scoring guide. One field, no spam.</p>
<label for="sc-email">Work email</label>
<input id="sc-email" type="email" name="email" required autocomplete="email"
       placeholder="you@company.com">
<button class="btn btn-primary btn-lg" type="submit">Email me the scorecard</button>
<p class="privacy-note">We use your email only to send the scorecard and, at most,
an occasional relevant note. Unsubscribe any time. No third parties.</p>
</form>
</div>
</div>
</section>

{cta_band()}
"""
    extra = []
    crumbs = [("Home", "/"), ("Scorecard", path)]
    return path, page(path, title, desc, body, extra, active="/scorecard/", crumbs=crumbs)


def contact():
    path = "/contact/"
    title = "Contact Burnell Consultancy | Book an assessment call"
    desc = (
        "Contact Burnell Consultancy Ltd. Book a 30-minute assessment call or send a "
        "message. UK platform security engineering, based in Godalming, Surrey. "
        "Email hello@burnellconsultancy.co.uk."
    )
    body = f"""<section class="page-hero">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Contact</span></nav>
<p class="eyebrow">Talk to us</p>
<h1>Book an assessment call</h1>
<p class="answer-first big">Tell us where secrets and pipeline security is
hurting and we will tell you, honestly, whether the £14,000 assessment is the
right next step. A 30-minute call, no slide deck, no obligation.</p>
</div>
</section>

<section class="section">
<div class="wrap two-col">
<div class="lead-form-wrap">
<form class="lead-form" name="contact" method="POST"
      action="/thank-you/" data-endpoint="{CONTACT_EMAIL}">
<input type="hidden" name="source" value="contact">
<h2>Send a message</h2>
<label for="c-name">Name</label>
<input id="c-name" type="text" name="name" required autocomplete="name">
<label for="c-email">Work email</label>
<input id="c-email" type="email" name="email" required autocomplete="email">
<label for="c-company">Company</label>
<input id="c-company" type="text" name="company" autocomplete="organization">
<label for="c-message">What is the problem, in one line?</label>
<input id="c-message" type="text" name="message"
       placeholder="e.g. enterprise questionnaire is blocking a deal">
<button class="btn btn-primary btn-lg" type="submit">Send</button>
<p class="privacy-note">Goes straight to {CONTACT_EMAIL}. No marketing lists, no
third parties.</p>
</form>
</div>
<div>
<h2 class="section-q">Or book straight in</h2>
{calendly_embed(with_email=False)}
<div class="contact-facts">
<h3>Direct</h3>
<p><a href="mailto:{CONTACT_EMAIL}">{CONTACT_EMAIL}</a></p>
<p>{html.escape(ORG_NAME)}<br>Godalming, Surrey, GB<br>Registered in England and Wales, company number [placeholder]</p>
</div>
</div>
</div>
</section>
"""
    extra = []
    crumbs = [("Home", "/"), ("Contact", path)]
    return path, page(path, title, desc, body, extra, active=None, crumbs=crumbs)


# ---- Insights: 10 AEO-optimised posts -------------------------------------- #

# Canonical contextual links so every article points at the money pages with
# consistent anchor text (helps both readers and answer engines map topic to
# service).
SERVICE_LINKS = {
    "assessment": ("/assessment/", "Secrets and Pipeline Security Assessment"),
    "secrets": ("/services/secrets-vault/", "secrets and vault engineering"),
    "golden": ("/services/golden-images/", "golden image factory"),
    "maturity": ("/services/security-maturity/", "security maturity and ASPM work"),
    "pki": ("/services/pki/", "PKI and machine identity engineering"),
    "scorecard": ("/scorecard/", "Secrets Sprawl Scorecard"),
}


def L(key, text=None):
    href, label = SERVICE_LINKS[key]
    return f'<a href="{href}">{text or label}</a>'


# Each post: full article, answer-first, question-led H2s, one stats box,
# contextual service links, CTA footer, and a generated thumbnail.
POSTS = [
    {
        "slug": "secrets-out-of-code-90-days",
        "date": "2026-06-18", "read": "8 min",
        "accent": "blue", "kicker": "FOR ENGINEERING LEADERS", "tag": "Secrets",
        "title": "How do you get secrets out of code and CI in 90 days?",
        "meta": "A sequenced 90-day plan for removing hard-coded secrets from code "
                "and CI without halting delivery: inventory, rotate by blast radius, "
                "stand up a broker, migrate, then remediate history.",
        "answer": "You sequence it. In the first 30 days you inventory every "
                  "credential and rotate the highest blast-radius ones, in the next "
                  "30 you stand up a secrets broker and migrate workloads behind it, "
                  "and in the final 30 you prove the change to auditors and clean up "
                  "git history. Rotation comes before scrubbing, because a rotated "
                  "secret is dead whether or not it still sits in history.",
        "stats": [
            ("90 days", "to a broker-backed estate with the worst secrets already dead"),
            ("Rotate first", "a rotated credential is neutralised even if still in history"),
            ("0", "delivery freezes required if you sequence by blast radius"),
        ],
        "body": f"""
<h2 class="section-q">Why does hard-coded secrets removal stall?</h2>
<p>Because teams try to boil the ocean: scrub every repository's history at once,
freeze deploys, and lose engineering goodwill in a week. The work stalls, and the
secrets stay. The way through is to treat it as a migration with a fixed order,
not a cleanup.</p>

<h2 class="section-q">Days 1 to 30: inventory and stop the bleeding</h2>
<p>Start by finding out what you have. Scan code, CI configuration, container
images and developer machines, then rank every secret by blast radius: what does
it unlock, and how bad is a leak? Rotate the top of that list immediately. You do
not need a broker yet to rotate a database password. This is exactly the ground
our {L('assessment')} covers in two weeks if you want it done to a scored model.</p>

<h2 class="section-q">Days 31 to 90: broker, migrate, prove</h2>
<p>Now stand up a secrets broker and wire workloads to fetch short-lived
credentials at run time. Whether that broker is Vault, OpenBao or a cloud KMS is
an estate decision, and it is the heart of our {L('secrets')}. Migrate service by
service so nothing breaks in flight, then produce the evidence an enterprise buyer
or auditor will ask for.</p>

<h2 class="section-q">What about the secrets already in git history?</h2>
<p>Leave history remediation until last. Once a leaked secret has been rotated it
is inert, so the urgent work is rotation, not rewriting commits. Clean history on a
schedule after the live risk is gone. If you want to know where you stand before
committing to the plan, the {L('scorecard')} scores your exposure in ten minutes.</p>
""",
        "links": ["assessment", "secrets", "scorecard"],
    },
    {
        "slug": "cis-25-to-95",
        "date": "2026-06-02", "read": "9 min",
        "accent": "teal", "kicker": "FOR REGULATED PLATFORMS", "tag": "CIS L1",
        "title": "How we took CIS Level 1 compliance from 25% to 95%",
        "meta": "A field account of moving CIS Level 1 conformance from 25% to over "
                "95% by industrialising machine-image builds instead of chasing audit "
                "findings by hand.",
        "answer": "We stopped fixing findings on live hosts and started baking "
                  "compliance into the base image. A pipeline built hardened, "
                  "CIS-benchmarked images, tested them, and republished on a schedule, "
                  "so every new instance booted compliant and drift could not "
                  "accumulate. Conformance went from 25% to over 95%, and it stayed "
                  "there because humans were no longer the control loop.",
        "stats": [
            ("25% → 95%+", "CIS Level 1 conformance in one programme"),
            ("Rebuild", "not hand-patch: the new response to a zero-day"),
            ("Schedule", "images rebuilt on a cadence, so drift cannot creep back"),
        ],
        "body": f"""
<h2 class="section-q">Why does hand-patching never converge?</h2>
<p>Because configuration drifts faster than people can correct it. Every manual fix
on a live host is undone by the next deploy, the next image, the next engineer in a
hurry. Conformance plateaus wherever human effort runs out, which for most large
estates is well short of an audit pass.</p>

<h2 class="section-q">What changed the curve?</h2>
<p>Moving the control from the host to the image. Instead of remediating thousands
of running servers, we hardened one base image per OS family, proved it against the
CIS Benchmark in a pipeline, and made every instance boot from it. That is the whole
idea behind our {L('golden')}: compliance becomes the default state, not a task.</p>

<h2 class="section-q">How does this help with zero-day patching?</h2>
<p>When a critical CVE lands, you patch the base image once and trigger rebuilds. The
fix propagates to every new instance automatically, so mean time to patch drops from
weeks of manual work to the length of a pipeline run. Auditors stop seeing the same
findings return, because the thing that generated them is gone.</p>

<h2 class="section-q">Where should a regulated platform start?</h2>
<p>With a clear picture of the current baseline. Our {L('assessment')} scores where
you are and hands back a 90-day plan, so the factory build is grounded in your actual
estate rather than a generic template.</p>
""",
        "links": ["golden", "assessment"],
    },
    {
        "slug": "vault-openbao-cloud-kms",
        "date": "2026-05-14", "read": "10 min",
        "accent": "blue", "kicker": "DECISION GUIDE", "tag": "Vault",
        "title": "Vault, OpenBao or cloud KMS: how to choose in 2026",
        "meta": "A vendor-neutral decision guide for choosing between HashiCorp "
                "Vault, OpenBao and cloud KMS for secrets management in 2026, by total "
                "cost rather than licence cost.",
        "answer": "Choose Vault for a mature, feature-complete platform, OpenBao when "
                  "licence exposure is the deciding constraint, and cloud KMS when you "
                  "are single-cloud and want the least operational surface. The right "
                  "answer is set by your estate and your appetite for running "
                  "infrastructure, not by a feature checklist, and it should be judged "
                  "on total cost, not licence cost.",
        "stats": [
            ("3 options", "Vault, OpenBao, cloud KMS: each wins for a different estate"),
            ("Total cost", "operational burden usually dwarfs the licence line"),
            ("Vendor-neutral", "we take no reseller margin on any of them"),
        ],
        "body": f"""
<h2 class="section-q">When is HashiCorp Vault the right call?</h2>
<p>When you need breadth: dynamic database credentials, PKI, transit encryption,
and a large ecosystem of integrations under one roof. Vault is the mature default
and rewards teams that will invest in running it well. That investment is real,
which is why our {L('secrets')} always sizes the operational cost, not just the
licence.</p>

<h2 class="section-q">Who should look at OpenBao?</h2>
<p>Teams for whom licence exposure is the deciding constraint. OpenBao is the
open-source fork of Vault, governed in the open, and for many estates it delivers
the capabilities that matter without the commercial licence. The migration path from
Vault is short, which makes it a credible option rather than a compromise.</p>

<h2 class="section-q">And cloud KMS?</h2>
<p>If you are single-cloud and want the least infrastructure to run, a cloud KMS plus
the provider's secrets manager may be all you need. You trade breadth and portability
for a smaller operational surface. That is often the correct trade for a lean team.</p>

<h2 class="section-q">How do you actually decide?</h2>
<p>Score the options against your estate: cloud footprint, non-human identity volume,
regulatory constraints and the size of the team that will operate the thing. Our
{L('assessment')} does that scoring for you and outputs a recommendation with reasons,
so the choice is defensible to your board.</p>
""",
        "links": ["secrets", "assessment"],
    },
    {
        "slug": "dora-cicd-pipelines",
        "date": "2026-04-28", "read": "8 min",
        "accent": "blue", "kicker": "FOR SCALING FINTECH", "tag": "DORA",
        "title": "What DORA actually requires of your CI/CD pipelines",
        "meta": "A plain-language reading of what the Digital Operational Resilience "
                "Act asks of your CI/CD pipelines, and the specific controls teams are "
                "usually missing.",
        "answer": "DORA requires demonstrable operational resilience, which for CI/CD "
                  "means evidenced control over who and what can change production, "
                  "provable integrity of the build, and tested recovery. In practice "
                  "that comes down to removing shared long-lived credentials, signing "
                  "artefacts, recording provenance, and proving you can rebuild and "
                  "recover on demand.",
        "stats": [
            ("Evidence", "DORA is satisfied by proof, not by good intentions"),
            ("Provenance", "you must be able to show what shipped and who changed it"),
            ("Tested recovery", "untested backups do not count"),
        ],
        "body": f"""
<h2 class="section-q">What is DORA really asking of a pipeline?</h2>
<p>Strip the legal language and DORA asks three operational questions. Can you prove
who and what can change production? Can you prove the integrity of what you ship? Can
you recover when something breaks, and have you tested that? Everything else is
detail hanging off those three.</p>

<h2 class="section-q">Where do teams fall short?</h2>
<p>Almost always on identity and integrity. Pipelines authenticate with shared,
long-lived credentials that nobody can attribute to a person or a job; artefacts ship
unsigned with no provenance; and recovery has never actually been rehearsed. The
first of those is exactly what our {L('secrets')} removes, replacing shared secrets
with short-lived, attributable credentials.</p>

<h2 class="section-q">What does a compliant pipeline look like?</h2>
<p>Every change is attributable to a verified identity, every artefact is signed and
carries provenance, and recovery is a tested runbook rather than a hope. Where machine
identity is the weak point, our {L('pki')} gives each workload a verifiable identity
instead of a shared password.</p>

<h2 class="section-q">How do you get there without a two-year programme?</h2>
<p>Start with a scored gap analysis. Our {L('assessment')} maps your current pipeline
against these requirements and returns a prioritised 90-day plan, so you close the
highest-risk gaps first and can show a regulator a credible trajectory.</p>
""",
        "links": ["assessment", "secrets", "pki"],
    },
    {
        "slug": "enterprise-security-questionnaire",
        "date": "2026-04-09", "read": "7 min",
        "accent": "blue", "kicker": "FOR SCALING CTOs", "tag": "Due diligence",
        "title": "How do you pass an enterprise security questionnaire without stalling the deal?",
        "answer": "You get ahead of it. Enterprise questionnaires stall deals when your "
                  "honest answers about secrets in code and shared credentials trigger "
                  "follow-up. Fix the two or three issues that generate the most "
                  "follow-up first, then keep a ready pack of evidence, so the "
                  "questionnaire becomes a form you complete rather than a negotiation "
                  "you lose.",
        "meta": "How Series B and later engineering teams pass enterprise security "
                "questionnaires without stalling the deal: fix the high-signal gaps "
                "first and keep an evidence pack ready.",
        "stats": [
            ("Same week", "turn a stalled questionnaire into an evidenced response"),
            ("2 to 3 gaps", "usually generate most of the follow-up"),
            ("Evidence pack", "answer once, reuse for every buyer"),
        ],
        "body": f"""
<h2 class="section-q">Why do questionnaires stall deals?</h2>
<p>Because a single honest answer, secrets are stored in code, or service accounts
share a long-lived key, invites a chain of follow-up questions and a nervous security
reviewer. The deal does not die on price; it dies in due diligence. The fix is to
remove the answers that trigger follow-up.</p>

<h2 class="section-q">Which gaps generate the most follow-up?</h2>
<p>In our experience, three: hard-coded secrets, shared non-human credentials, and no
provenance on what you deploy. Close those and the majority of red flags disappear.
Removing hard-coded secrets is the core of our {L('secrets')}, and it is usually the
single highest-signal change a scaling team can make.</p>

<h2 class="section-q">How do you answer once and reuse it?</h2>
<p>Build an evidence pack: a short, current set of documents and scored results that
answers the standard questionnaire in advance. Our {L('assessment')} produces exactly
this, a scored report you can hand straight to an enterprise buyer, so you stop
rewriting the same answers for every deal.</p>

<h2 class="section-q">What if a deal is live right now?</h2>
<p>Then triage. Score your posture fast, fix the highest-signal gap, and send back
evidence rather than promises. A two-week, fixed-price {L('assessment', 'assessment')}
is designed to move at deal speed.</p>
""",
        "links": ["assessment", "secrets"],
    },
    {
        "slug": "find-every-secret",
        "date": "2026-03-20", "read": "8 min",
        "accent": "amber", "kicker": "FOR FINANCIAL SERVICES", "tag": "Sprawl",
        "title": "How do you find every secret sprawling across your codebase?",
        "meta": "How to inventory secrets sprawl across code, CI, config and developer "
                "machines, then prioritise by blast radius before you try to fix "
                "anything.",
        "answer": "You scan every place a credential can hide, code, CI configuration, "
                  "container images, config stores and developer machines, then rank "
                  "what you find by blast radius rather than by count. The goal of "
                  "discovery is not a tidy list; it is knowing which three secrets "
                  "would hurt most if leaked, so you rotate those first.",
        "stats": [
            ("5 places", "code, CI, images, config stores, laptops"),
            ("Blast radius", "rank by impact, not by number of findings"),
            ("Rotate top first", "the worst credential dead within days"),
        ],
        "body": f"""
<h2 class="section-q">Where do secrets actually hide?</h2>
<p>Everywhere credentials are convenient. Source code and its history, CI environment
variables and pipeline definitions, baked-in container image layers, shared config
stores, and the laptops of long-serving engineers. A scan that only looks at current
code misses most of the estate.</p>

<h2 class="section-q">Why rank by blast radius, not by count?</h2>
<p>Because a thousand low-impact findings are less urgent than one credential that
unlocks the trading database. Counting findings makes everything look equally scary
and nothing get fixed. Ranking by what each secret unlocks tells you where to spend
the first week. This prioritisation is the opening move of our {L('secrets')}.</p>

<h2 class="section-q">What do you do once you have the inventory?</h2>
<p>Rotate the top of the list immediately, then move workloads behind a broker so new
secrets are short-lived and audited. For a quant-finance or trading estate, where
non-human identities multiply fast, that broker work pairs naturally with our
{L('pki')}.</p>

<h2 class="section-q">Can you gauge exposure before a full engagement?</h2>
<p>Yes. The {L('scorecard')} is a ten-question self-assessment that tells you, in ten
minutes, whether secrets sprawl is already a live risk, and a full
{L('assessment', 'assessment')} scores it properly.</p>
""",
        "links": ["secrets", "pki", "scorecard", "assessment"],
    },
    {
        "slug": "golden-image-factory-explained",
        "date": "2026-03-03", "read": "9 min",
        "accent": "teal", "kicker": "FOR REGULATED PLATFORMS", "tag": "Golden images",
        "title": "What is a golden image factory, and why does it end audit findings?",
        "meta": "A plain explanation of the golden image factory pattern: hardened, "
                "CIS-compliant machine images built on a pipeline and rebuilt on a "
                "schedule so audit findings stop recurring.",
        "answer": "A golden image factory is a pipeline that builds hardened, "
                  "CIS-benchmarked machine images, tests them, signs them and "
                  "republishes on a schedule. It ends recurring audit findings because "
                  "compliance is baked into the image every instance boots from, rather "
                  "than hand-applied to live hosts where it drifts straight back.",
        "stats": [
            ("One image", "hardened once, booted everywhere"),
            ("Signed", "provenance proves exactly what shipped"),
            ("Scheduled", "rebuilds keep patches flowing without firefighting"),
        ],
        "body": f"""
<h2 class="section-q">What does the factory actually produce?</h2>
<p>A trusted base image per operating-system family, hardened to the relevant CIS
Benchmark, tested and scanned in a pipeline, signed for provenance, and published on a
cadence. Every server, container host and VM boots from that image, so the compliant
state is the starting state.</p>

<h2 class="section-q">Why does this end recurring findings?</h2>
<p>Because the finding is fixed at the source. Hand-patching a live host is undone by
the next deploy; hardening the image means the fix ships with every new instance and
cannot drift away between audits. That is the whole premise of our {L('golden')}.</p>

<h2 class="section-q">How does it change zero-day response?</h2>
<p>A critical CVE becomes a single image change plus a rebuild trigger. The patched
image propagates automatically, so your mean time to patch is measured in a pipeline
run rather than weeks of manual remediation across thousands of hosts.</p>

<h2 class="section-q">What does it take to stand one up?</h2>
<p>A build tool such as Packer, hardening code, a compliance-scan gate and a schedule.
Our {L('golden', 'golden image factory')} is a fixed-price build, and it starts from an
{L('assessment')} so the image families and platforms match your real estate.</p>
""",
        "links": ["golden", "assessment"],
    },
    {
        "slug": "non-human-identity",
        "date": "2026-02-16", "read": "8 min",
        "accent": "amber", "kicker": "FOR FINANCIAL SERVICES", "tag": "NHI",
        "title": "Non-human identity: how to secure the machines that outnumber your people",
        "meta": "Non-human identities now vastly outnumber humans in engineering "
                "estates. Here is how to give every workload a verifiable identity "
                "instead of a shared, long-lived secret.",
        "answer": "You give every service, job and container a verifiable identity "
                  "instead of a shared secret. Non-human identities now outnumber "
                  "people by a wide margin, and when they authenticate with shared, "
                  "long-lived credentials they are the softest target in the estate. A "
                  "workload identity model plus short-lived credentials removes that "
                  "target.",
        "stats": [
            ("Outnumbered", "non-human identities dwarf human ones in most estates"),
            ("Shared secrets", "the most common and softest attack surface"),
            ("Short-lived", "credentials that expire before they can be reused"),
        ],
        "body": f"""
<h2 class="section-q">What is a non-human identity?</h2>
<p>Anything that authenticates without being a person: a service, a pipeline job, a
container, a script, a bot. Each needs to prove who it is to get a secret or call an
API. Collectively they now vastly outnumber your human users, and they rarely get the
same identity rigour.</p>

<h2 class="section-q">Why are they the softest target?</h2>
<p>Because they so often share long-lived credentials. One static key, copied across
dozens of services, that never rotates and cannot be attributed to a single caller. It
is the credential an attacker most wants and the one most likely to be sitting in a
config file. Removing it is central to our {L('secrets')}.</p>

<h2 class="section-q">What does a good model look like?</h2>
<p>Every workload gets a verifiable identity, using OIDC, SPIFFE/SPIRE or cloud-native
identity, and draws short-lived credentials against it. Nothing shares a static key.
Building that model, and the PKI to support it, is the work in our {L('pki')}.</p>

<h2 class="section-q">Where should a trading firm start?</h2>
<p>With discovery: find the shared credentials first, because you cannot secure
identities you have not enumerated. A scored {L('assessment')} maps them and sequences
the migration so nothing breaks in flight.</p>
""",
        "links": ["pki", "secrets", "assessment"],
    },
    {
        "slug": "scanner-noise-to-roadmap",
        "date": "2026-01-29", "read": "8 min",
        "accent": "teal", "kicker": "FOR SECURITY LEADERS", "tag": "ASPM",
        "title": "How do you turn thousands of scanner alerts into a roadmap engineers will follow?",
        "meta": "How to convert thousands of open scanner alerts into a short, "
                "prioritised roadmap using OWASP SAMM and application security posture "
                "management, so engineering actually does the work.",
        "answer": "You stop treating every alert as equal. Using OWASP SAMM to measure "
                  "programme maturity and application security posture management to "
                  "correlate and rank findings by exploitability and blast radius, you "
                  "cut thousands of alerts to the handful that move real risk, then "
                  "sequence them into a roadmap engineering owns rather than resists.",
        "stats": [
            ("Thousands → tens", "the point of prioritisation is subtraction"),
            ("SAMM", "measures the programme, not just the code"),
            ("Owned", "a roadmap engineers adopt, not one imposed on them"),
        ],
        "body": f"""
<h2 class="section-q">Why does nobody action the scanner output?</h2>
<p>Because everything looks urgent and therefore nothing is. Scanners are good at
finding and bad at prioritising, so a typical estate carries thousands of open alerts
that engineering has learned to ignore. More scanning does not fix this; better
ranking does.</p>

<h2 class="section-q">What does ASPM change?</h2>
<p>Application security posture management sits above your existing scanners and
correlates their output, de-duplicating findings and ranking them by exploitability and
blast radius. The firehose becomes a short list. That correlation layer is the engine
of our {L('maturity')}.</p>

<h2 class="section-q">Where does OWASP SAMM fit?</h2>
<p>SAMM measures the maturity of the programme itself, across governance, design,
implementation and operations, so you are improving practices, not just closing tickets.
It is open and engineering-friendly, which matters when the goal is a roadmap teams will
actually adopt.</p>

<h2 class="section-q">How fast do you see the benefit?</h2>
<p>The prioritisation is immediate: the ranked shortlist falls out of the first pass.
The drop in open findings follows as the roadmap lands, usually across the first 90
days. A scored {L('assessment')} gives you that shortlist and the plan behind it.</p>
""",
        "links": ["maturity", "assessment"],
    },
    {
        "slug": "short-lived-certificates",
        "date": "2026-01-12", "read": "7 min",
        "accent": "amber", "kicker": "FOR FINANCIAL SERVICES", "tag": "PKI",
        "title": "Why short-lived certificates end legacy PKI outages",
        "meta": "Legacy PKI with long-lived, hand-rotated certificates causes outages "
                "and audit findings. Here is why short-lived, automatically rotated "
                "certificates end both.",
        "answer": "Because a certificate that lives for an hour cannot expire "
                  "unnoticed or be stolen and reused for a year. Legacy PKI fails when "
                  "long-lived certificates, tracked by hand, quietly expire or leak. "
                  "Short-lived certificates issued and rotated automatically remove the "
                  "manual tracking that causes outages and shrink the window any "
                  "compromised credential is useful for.",
        "stats": [
            ("Hours, not years", "certificate lifetimes that outpace attackers"),
            ("Automated", "issuance and rotation with no human tracking"),
            ("No surprise expiry", "the classic 3am PKI outage, designed out"),
        ],
        "body": f"""
<h2 class="section-q">Why does legacy PKI cause outages?</h2>
<p>Because it depends on humans remembering. A certificate issued for two years is
tracked in a spreadsheet, the owner leaves, and one quiet weekend it expires and takes
a service down. The same long lifetime that makes manual management bearable is what
makes the outage inevitable.</p>

<h2 class="section-q">How do short-lived certificates fix it?</h2>
<p>By removing the human from the loop. Certificates that live for hours must be issued
and rotated automatically, so there is no spreadsheet to fall out of date and no expiry
to be surprised by. Automating issuance, through Vault PKI, a cloud CA or ACME, is the
core of our {L('pki')}.</p>

<h2 class="section-q">What about the security benefit?</h2>
<p>A stolen certificate that expires in an hour is nearly worthless. Short lifetimes
shrink the window an attacker can use a compromised credential, which is why they are
as much a security control as an availability one. They pair naturally with the
short-lived secrets in our {L('secrets')}.</p>

<h2 class="section-q">How do you migrate without a big bang?</h2>
<p>Assess what you have, modernise around the parts worth keeping, and cut over service
by service. A scored {L('assessment')} maps the legacy estate and sequences the
migration so nothing expires mid-flight.</p>
""",
        "links": ["pki", "secrets", "assessment"],
    },
]


ACCENT_HEX = {"blue": "#2563eb", "teal": "#0d9488", "amber": "#d97706"}


def thumb_svg(accent, kicker, tag):
    hexc = ACCENT_HEX[accent]
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" role="img" aria-label="{html.escape(tag)}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="{hexc}"/><stop offset="1" stop-color="#1a2332"/>
</linearGradient></defs>
<rect width="400" height="225" fill="url(#g)"/>
<circle cx="335" cy="55" r="120" fill="#ffffff" opacity="0.06"/>
<circle cx="70" cy="215" r="90" fill="#ffffff" opacity="0.05"/>
<rect x="300" y="150" width="72" height="72" rx="14" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.35"/>
<text x="28" y="48" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="700" letter-spacing="2.5" fill="#ffffff" opacity="0.9">{html.escape(kicker)}</text>
<text x="28" y="180" font-family="Inter,system-ui,sans-serif" font-size="40" font-weight="800" fill="#ffffff">{html.escape(tag)}</text>
<rect x="28" y="196" width="52" height="4" rx="2" fill="#ffffff" opacity="0.85"/>
</svg>
"""


def insights_index():
    path = "/insights/"
    title = "Insights | Platform security engineering, Burnell Consultancy"
    desc = ("Field notes on secrets management, CI/CD pipeline security, CIS "
            "compliance, PKI and non-human identity from Dr David Burnell of Burnell "
            "Consultancy. Answer-first, evidence-led, no marketing filler.")
    cards = ""
    for p in POSTS:
        cards += f"""<article class="post-card">
<a class="post-thumb" href="/insights/{p['slug']}/" aria-hidden="true" tabindex="-1">
<img src="/assets/insights/{p['slug']}.svg" alt="" width="400" height="225" loading="lazy">
</a>
<div class="post-body">
<p class="post-date">{p['date']} &middot; {p['read']} read &middot; <span class="kick-tag accent-{p['accent']}">{html.escape(p['kicker'].title())}</span></p>
<h2><a href="/insights/{p['slug']}/">{html.escape(p['title'])}</a></h2>
<p>{html.escape(p['meta'])}</p>
<a class="card-link" href="/insights/{p['slug']}/">Read the article &rarr;</a>
</div>
</article>"""
    body = f"""<section class="page-hero">
<div class="wrap narrow">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <span>Insights</span></nav>
<p class="eyebrow">Insights</p>
<h1>Field notes on platform security engineering</h1>
<p class="answer-first big">Answer-first writing on secrets, pipelines, golden
images, PKI and non-human identity, from the engineer who does the work. Every
piece leads with the answer and backs it with numbers, written for scaling CTOs,
regulated heads of platform and finance security leaders.</p>
</div>
</section>

<section class="section">
<div class="wrap">
<div class="post-grid">{cards}</div>
</div>
</section>

{cta_band()}
"""
    extra = []
    crumbs = [("Home", "/"), ("Insights", path)]
    return path, page(path, title, desc, body, extra, active="/insights/", crumbs=crumbs)


def article_page(post):
    slug = post["slug"]
    path = f"/insights/{slug}/"
    t = post["title"]
    d = post["meta"]
    title = f"{t} | Burnell Consultancy"
    stats = "".join(
        f'<li><span class="tnum">{n}</span> {l}</li>' for n, l in post["stats"]
    )
    # Related services block from the post's contextual links.
    related = "".join(
        f'<li>{L(k, SERVICE_LINKS[k][1])}</li>'
        for k in dict.fromkeys(post["links"])
    )
    body = f"""<article class="section">
<div class="wrap narrow prose">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/insights/">Insights</a> / <span>Article</span></nav>
<p class="post-date">{post['date']} &middot; {post['read']} read &middot; by {FOUNDER} &middot; <span class="kick-tag accent-{post['accent']}">{html.escape(post['kicker'].title())}</span></p>
<h1>{html.escape(t)}</h1>
<img class="article-hero" src="/assets/insights/{slug}.svg" alt="" width="400" height="225" loading="eager">
<p class="answer-first big">{post['answer']}</p>
<div class="stats-box accent-{post['accent']}">
<h3>The numbers</h3>
<ul class="stat-lines">{stats}</ul>
</div>
{post['body']}
<div class="related-services">
<h3>Services referenced in this article</h3>
<ul>{related}</ul>
</div>
<div class="article-cta">
<h2>Want this done, not just described?</h2>
<p>The two-week, fixed-price assessment turns this into a scored plan for your
estate, with a 90-day roadmap and an executive readout.</p>
<a class="btn btn-primary btn-lg" href="/assessment/">Book a fixed-price assessment</a>
</div>
</div>
</article>
"""
    extra = [article_node(path, t, d, post["date"])]
    crumbs = [("Home", "/"), ("Insights", "/insights/"), (t, path)]
    return path, page(path, title, d, body, extra, active=None, crumbs=crumbs)


def thank_you():
    path = "/thank-you/"
    title = "Thank you | Burnell Consultancy"
    desc = "Thank you. Your message has reached Burnell Consultancy."
    body = f"""<section class="page-hero">
<div class="wrap narrow center">
<h1>Thank you</h1>
<p class="answer-first big">Your message has reached us at {CONTACT_EMAIL}. We
reply to every genuine enquiry, usually within one working day.</p>
<a class="btn btn-primary btn-lg" href="/">Back to home</a>
</div>
</section>
"""
    return path, page(path, title, desc, body, [], active=None)


def not_found():
    title = "Page not found | Burnell Consultancy"
    desc = "Page not found."
    body = f"""<section class="page-hero">
<div class="wrap narrow center">
<h1>Page not found</h1>
<p class="answer-first big">That page does not exist. Try the
<a href="/assessment/">assessment</a>, the <a href="/services/secrets-vault/">services</a>,
or <a href="/contact/">get in touch</a>.</p>
<a class="btn btn-primary btn-lg" href="/">Back to home</a>
</div>
</section>
"""
    return page("/404", title, desc, body, [], active=None)


# --------------------------------------------------------------------------- #
# Static text assets                                                           #
# --------------------------------------------------------------------------- #

def llms_txt():
    return f"""# {ORG_NAME}

> UK platform security engineering consultancy. We take credentials out of code,
> make machine images compliant by default, and turn scanner noise into a
> roadmap engineers will follow.

## Entity
- Legal name: {ORG_NAME}
- Founder: {FOUNDER}, PhD (Durham University, Biological Chemistry)
- Registered: England and Wales, company number [placeholder]
- Location: Godalming, Surrey, GB
- Site: {SITE_URL}
- Contact: {CONTACT_EMAIL}
- Prior roles of founder: IBM Security, HP, G-Research, Aristocrat
- Publications: PLOS Biology (2013), BMC Bioinformatics (2013)
- Thesis: {THESIS_URL}

## What we do (vendor-neutral: Vault, OpenBao, cloud KMS, CyberArk)
- Secrets and Pipeline Security Assessment: £14,000 fixed, two weeks, one business unit. {SITE_URL}/assessment/
- Secrets and vault engineering: typically £45,000 to £120,000. {SITE_URL}/services/secrets-vault/
- Golden image factory (CIS-compliant images): £28,000 to £60,000 fixed. {SITE_URL}/services/golden-images/
- Security maturity (OWASP SAMM + ASPM): scoped. {SITE_URL}/services/security-maturity/
- PKI and machine identity: typically £45,000 to £120,000. {SITE_URL}/services/pki/

## Who we help
- Series B+ fintech and SaaS facing enterprise due diligence. {SITE_URL}/who-we-help/scaling-saas/
- Regulated gaming, gambling and payments platforms. {SITE_URL}/who-we-help/regulated-platforms/
- London hedge funds and trading firms. {SITE_URL}/who-we-help/financial-services/

## Disambiguating founder bio
{FOUNDER} is a UK platform security engineer who architected secrets management
at more than 1,000 Vault namespaces and moved CIS Level 1 compliance from 25% to
over 95% in a single programme. He holds a PhD from Durham University and
previously worked at IBM Security, HP, G-Research and Aristocrat.

## Proof, not marketing
No fabricated testimonials, client logos or certifications. Trust rests on the
PhD, the publications, the employer track record and public fixed prices.

## Key pages
- {SITE_URL}/ (home)
- {SITE_URL}/assessment/ (primary offer)
- {SITE_URL}/about/ (founder entity page)
- {SITE_URL}/insights/ (articles)
- {SITE_URL}/contact/
"""


def robots_txt():
    return f"""# {ORG_NAME}
User-agent: *
Allow: /

# AI and answer engines explicitly welcome
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: {SITE_URL}/sitemap.xml
"""


def sitemap(paths):
    urls = "".join(
        f"  <url><loc>{SITE_URL}{p}</loc><changefreq>monthly</changefreq></url>\n"
        for p in paths
    )
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls
        + "</urlset>\n"
    )


# --------------------------------------------------------------------------- #
# Static assets: CSS, JS, SVG                                                  #
# --------------------------------------------------------------------------- #

STYLES = """/* Burnell Consultancy design system. Tokens from the brand prospectus. */
:root{
  --ink:#1a2332; --blue:#2563eb; --blue-700:#1d4ed8; --teal:#0d9488;
  --amber:#d97706; --slate:#f1f5f9; --slate-2:#e2e8f0; --slate-3:#cbd5e1;
  --text:#1a2332; --muted:#51617a; --white:#ffffff; --line:#e2e8f0;
  --radius:12px; --wrap:1100px;
  --font:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --shadow:0 1px 2px rgba(26,35,50,.04),0 4px 16px rgba(26,35,50,.05);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;font-family:var(--font);color:var(--text);background:var(--white);
  line-height:1.6;font-size:18px;-webkit-font-smoothing:antialiased;
  font-feature-settings:"cv02","cv03","cv04","cv11";
}
.tnum{font-variant-numeric:tabular-nums lining-nums}
h1,h2,h3{color:var(--ink);line-height:1.15;letter-spacing:-0.02em;margin:0 0 .5em}
h1{font-size:clamp(2rem,4.6vw,3.2rem);font-weight:800}
h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:750}
h3{font-size:1.2rem;font-weight:700}
p{margin:0 0 1em}
a{color:var(--blue);text-decoration:none}
a:hover{text-decoration:underline}
img{max-width:100%;height:auto;display:block}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
.narrow{max-width:820px}
.center{text-align:center}
.muted{color:var(--muted);font-size:.95rem}
.eyebrow{text-transform:uppercase;letter-spacing:.12em;font-size:.78rem;
  font-weight:700;color:var(--teal);margin:0 0 .8em}
.skip-link{position:absolute;left:-999px;top:0;background:var(--ink);color:#fff;
  padding:10px 16px;z-index:200}
.skip-link:focus{left:8px;top:8px}
:focus-visible{outline:3px solid var(--blue);outline-offset:2px;border-radius:4px}

/* Buttons */
.btn{display:inline-block;font-weight:650;font-size:1rem;padding:.72em 1.35em;
  border-radius:10px;border:1.5px solid transparent;cursor:pointer;
  transition:transform .06s ease,background .15s ease;text-align:center}
.btn:hover{text-decoration:none;transform:translateY(-1px)}
.btn-lg{padding:.85em 1.7em;font-size:1.05rem}
.btn-primary{background:var(--blue);color:#fff;border-color:var(--blue)}
.btn-primary:hover{background:var(--blue-700);color:#fff}
.btn-ghost{background:transparent;color:var(--ink);border-color:var(--slate-3)}
.btn-ghost:hover{border-color:var(--ink)}
.btn-invert{background:#fff;color:var(--ink)}
.btn-invert:hover{background:var(--slate)}

/* Header */
.site-header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);
  backdrop-filter:saturate(1.4) blur(8px);border-bottom:1px solid var(--line)}
.header-inner{display:flex;align-items:center;gap:20px;height:70px}
.logo{font-size:1.28rem;letter-spacing:-.02em;white-space:nowrap}
.logo:hover{text-decoration:none}
.logo-a{color:var(--ink);font-weight:700}
.logo-a.light{color:#ffffff}
.logo-b{color:var(--blue);font-weight:400}
.logo-b.light{color:#93b4fb}
.primary-nav{margin-left:auto}
.primary-nav ul{display:flex;gap:4px;list-style:none;margin:0;padding:0;align-items:center}
.primary-nav a,.nav-group{display:inline-block;padding:.5em .7em;color:var(--ink);
  font-size:.95rem;font-weight:550;border-radius:8px;background:none;border:0;
  font-family:inherit;cursor:pointer;white-space:nowrap}
.primary-nav a:hover,.nav-group:hover{background:var(--slate);text-decoration:none}
.primary-nav a.active{color:var(--blue)}
.has-sub{position:relative}
.chev{font-size:.7em;margin-left:.3em;opacity:.6}
.primary-nav .submenu{position:absolute;top:100%;left:0;min-width:260px;background:#fff;
  border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);
  padding:8px;display:none;list-style:none;margin:6px 0 0}
.primary-nav .has-sub:hover .submenu,
.primary-nav .has-sub:focus-within .submenu{display:block}
.submenu a{display:block;width:100%}
.header-cta{margin-left:8px}
.nav-toggle{display:none;margin-left:auto;flex-direction:column;gap:5px;
  background:none;border:0;padding:8px;cursor:pointer}
.nav-toggle span{width:24px;height:2px;background:var(--ink);display:block}

/* Hero */
.hero{padding:64px 0 40px;background:
  radial-gradient(1200px 400px at 80% -10%,rgba(37,99,235,.07),transparent),
  var(--white)}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:center}
.hero-copy h1{margin-bottom:.35em}
.lede{font-size:1.2rem;color:var(--muted);max-width:36ch}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:1.6em}
.hero-media{display:flex;flex-direction:column;align-items:center;gap:12px}
.portrait-ring{padding:6px;border:2px solid var(--teal);border-radius:50%;
  box-shadow:var(--shadow);background:#fff}
.portrait{border-radius:50%;object-fit:cover;background:var(--slate)}
.portrait.lead{width:300px;height:300px}
.portrait.sm{width:88px;height:88px}
.portrait-caption{font-size:.9rem;color:var(--muted);margin:0}

/* Trust bar */
.trust-bar{background:var(--ink);color:#fff;padding:34px 0}
.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
.trust-bar .stat{display:flex;flex-direction:column;gap:6px}
.stat-num{font-size:1.9rem;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1}
.trust-bar .stat-label{color:#c3cede;font-size:.92rem;line-height:1.4}

/* Sections */
.section{padding:72px 0}
.section.alt{background:var(--slate)}
.section-q{max-width:24ch}
.answer-first{font-size:1.14rem;max-width:64ch;color:#33425c}
.answer-first.big{font-size:1.3rem;max-width:60ch;color:#33425c}

/* Cards */
.card-grid{display:grid;gap:22px;margin-top:36px}
.card-grid.three{grid-template-columns:repeat(3,1fr)}
.card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:26px;box-shadow:var(--shadow)}
.card-kicker{font-size:.8rem;font-weight:650;text-transform:uppercase;
  letter-spacing:.06em;color:var(--muted);margin:0 0 .6em}
.card.teal{border-top:3px solid var(--teal)}
.card.amber{border-top:3px solid var(--amber)}
.card h3{margin-bottom:.4em}
.card-link{font-weight:650;font-size:.95rem}
.card-link.light{color:#93b4fb}

/* Process */
.process{list-style:none;counter-reset:s;margin:36px 0 0;padding:0;
  display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.process.two{grid-template-columns:repeat(2,1fr)}
.process li{background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:26px;position:relative}
.section.alt .process li{background:#fff}
.step-n{display:inline-flex;align-items:center;justify-content:center;
  min-width:44px;height:44px;padding:0 12px;border-radius:10px;background:var(--slate);
  color:var(--blue);font-weight:800;font-size:1.05rem;margin-bottom:14px}

/* Enterprise logo wall */
.logo-wall{padding:54px 0;background:#fff;border-bottom:1px solid var(--line)}
.logo-wall h2{text-align:center;font-size:1.2rem;font-weight:650;color:var(--ink);
  margin-bottom:34px}
.logo-row{display:flex;align-items:center;justify-content:center;
  gap:clamp(28px,5vw,64px);flex-wrap:wrap}
.logo-row img{height:40px;width:auto;filter:grayscale(1);opacity:.6;
  transition:opacity .2s ease}
.logo-row img:hover{opacity:1}
.logo-note{text-align:center;color:var(--muted);font-size:.85rem;margin:28px auto 0;
  max-width:52ch}

/* Founder strip */
.founder-strip{background:var(--ink);color:#fff;padding:48px 0}
.founder-inner{display:flex;align-items:center;gap:26px}
.founder-lines{font-size:1.15rem;margin:0 0 .4em;max-width:60ch}
.founder-photo{flex:none;border:2px solid var(--teal)}

/* FAQ */
.faq-list{margin-top:28px;border-top:1px solid var(--line)}
.faq-item{border-bottom:1px solid var(--line)}
.faq-item summary{cursor:pointer;list-style:none;padding:20px 40px 20px 0;
  font-weight:650;font-size:1.08rem;color:var(--ink);position:relative}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";position:absolute;right:6px;top:18px;
  font-size:1.5rem;color:var(--blue);font-weight:400}
.faq-item[open] summary::after{content:"\\2013"}
.faq-answer{padding:0 40px 20px 0;color:#33425c}
.faq-answer p{margin:0;max-width:70ch}

/* CTA band */
.cta-band{background:var(--ink);color:#fff;padding:56px 0}
.cta-band-inner{display:flex;align-items:center;justify-content:space-between;
  gap:32px;flex-wrap:wrap}
.cta-band h2{color:#fff;max-width:22ch;margin-bottom:.2em}
.cta-band p{color:#c3cede;margin:0;max-width:50ch}

/* Page hero */
.page-hero{padding:56px 0 40px;border-bottom:1px solid var(--line);
  background:radial-gradient(900px 300px at 85% -20%,rgba(37,99,235,.06),transparent)}
.page-hero.accent-blue{border-top:4px solid var(--blue)}
.page-hero.accent-teal{border-top:4px solid var(--teal)}
.page-hero.accent-amber{border-top:4px solid var(--amber)}
.crumbs{font-size:.85rem;color:var(--muted);margin-bottom:1.2em}
.crumbs a{color:var(--muted)}

/* Tables */
.table-wrap{overflow-x:auto;margin-top:20px}
.spec-table{border-collapse:collapse;width:100%;background:#fff;
  border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.spec-table th,.spec-table td{text-align:left;padding:14px 18px;
  border-bottom:1px solid var(--line);font-size:1rem}
.spec-table th{background:var(--slate);color:var(--ink);font-weight:700;font-size:.92rem}
.spec-table tr:last-child td{border-bottom:0}

/* Lists */
.icp-list{list-style:none;padding:0;margin:24px 0 0}
.icp-list li{padding:16px 0 16px 34px;border-bottom:1px solid var(--line);
  position:relative;max-width:74ch}
.icp-list li::before{content:"";position:absolute;left:0;top:24px;width:14px;
  height:14px;border-radius:50%;border:3px solid var(--teal)}
.check-list{list-style:none;padding:0;margin:20px 0 0}
.check-list li{padding:12px 0 12px 34px;position:relative;border-bottom:1px solid var(--line)}
.check-list li::before{content:"\\2713";position:absolute;left:0;top:12px;
  color:var(--teal);font-weight:800}

/* Two column */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:start}

/* Diagram */
.diagram{margin:0;background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:18px}
.diagram svg{width:100%;height:auto}
.diagram figcaption{font-size:.85rem;color:var(--muted);margin-top:10px}

/* Prose (about, articles) */
.prose h2{margin-top:1.6em}
.prose p{max-width:72ch;color:#28344a}
.about-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:40px;align-items:center}
.about-photo{display:flex;justify-content:center}
.entity-facts{background:var(--slate);border-radius:var(--radius);padding:24px 28px;margin-top:32px}
.entity-facts dl{display:grid;grid-template-columns:auto 1fr;gap:8px 20px;margin:12px 0 0}
.entity-facts dt{font-weight:700;color:var(--ink)}
.entity-facts dd{margin:0;color:#33425c}

/* Stats box (articles) */
.stats-box{background:var(--slate);border-left:4px solid var(--blue);
  border-radius:8px;padding:20px 24px;margin:28px 0}
.stats-box h3{margin:0 0 .5em}
.stats-box ul{margin:0;padding-left:1.1em}
.stats-box .tnum{font-weight:800;color:var(--ink)}
.todo-tag{display:inline-block;background:#fff3d6;color:#8a5a00;font-size:.72rem;
  font-weight:700;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em}
.post-date{font-size:.9rem;color:var(--muted)}
.article-cta{background:var(--slate);border-radius:var(--radius);padding:30px;margin-top:44px}
.article-cta h2{margin-top:0}

/* Insights index */
.post-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:26px}
.post-card{background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .18s ease,transform .06s ease}
.post-card:hover{box-shadow:var(--shadow);transform:translateY(-2px)}
.post-thumb{display:block;line-height:0}
.post-thumb img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}
.post-body{padding:22px 24px 26px;display:flex;flex-direction:column;gap:6px}
.post-card h2{font-size:1.3rem;margin:2px 0 6px}
.post-card h2 a{color:var(--ink)}
.post-card h2 a:hover{color:var(--blue);text-decoration:none}
.post-card .card-link{margin-top:8px}
.kick-tag{display:inline-block;font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.06em;padding:2px 8px;border-radius:20px;color:#fff;background:var(--ink)}
.kick-tag.accent-blue{background:var(--blue)}
.kick-tag.accent-teal{background:var(--teal)}
.kick-tag.accent-amber{background:var(--amber)}
.article-hero{width:100%;max-width:520px;height:auto;aspect-ratio:16/9;object-fit:cover;
  border-radius:var(--radius);margin:8px 0 24px}
.stat-lines{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.stat-lines li{padding-left:0}
.stat-lines .tnum{font-weight:800;color:var(--ink);margin-right:6px}
.stats-box.accent-teal{border-left-color:var(--teal)}
.stats-box.accent-amber{border-left-color:var(--amber)}
.related-services{background:var(--slate);border-radius:var(--radius);padding:22px 26px;margin:32px 0}
.related-services h3{margin:0 0 .6em}
.related-services ul{margin:0;padding-left:1.1em}
.related-services li{margin-bottom:.3em}

/* Forms */
.lead-form-wrap{}
.lead-form{background:#fff;border:1px solid var(--line);border-radius:var(--radius);
  padding:28px;box-shadow:var(--shadow)}
.lead-form h2{font-size:1.4rem}
.lead-form label{display:block;font-weight:650;font-size:.92rem;margin:16px 0 6px}
.lead-form input{width:100%;padding:12px 14px;border:1.5px solid var(--slate-3);
  border-radius:9px;font-size:1rem;font-family:inherit}
.lead-form input:focus{border-color:var(--blue);outline:none}
.lead-form button{margin-top:20px;width:100%}
.privacy-note{font-size:.82rem;color:var(--muted);margin:14px 0 0}
.scorecard-q{margin:20px 0 0;padding-left:1.3em}
.scorecard-q li{padding:8px 0;max-width:60ch}

/* Calendly */
.calendly-embed{margin-top:14px}
.calendly-placeholder{border:2px dashed var(--slate-3);border-radius:var(--radius);
  padding:32px;text-align:center;background:var(--slate)}
.calendly-placeholder code{background:#fff;padding:2px 6px;border-radius:4px;font-size:.85rem}
.contact-facts{margin-top:32px}
.contact-facts p{color:#33425c}

/* Footer */
.site-footer{background:var(--ink);color:#c3cede}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;padding:56px 24px 40px}
.footer-brand p{max-width:44ch;font-size:.95rem}
.footer-meta{font-size:.85rem;color:#8b9ab5}
.footer-col h3{color:#fff;font-size:.95rem;margin-bottom:1em}
.footer-col ul{list-style:none;padding:0;margin:0}
.footer-col li{margin-bottom:.6em}
.footer-col a{color:#c3cede;font-size:.92rem}
.footer-col a:hover{color:#fff}
.footer-band{border-top:1px solid #2b3a52}
.footer-band-inner{display:flex;align-items:center;justify-content:space-between;
  gap:20px;flex-wrap:wrap;padding:24px}
.copyright{margin:0;font-size:.85rem;color:#8b9ab5}

/* Responsive */
@media(max-width:900px){
  .hero-grid,.two-col,.about-grid{grid-template-columns:1fr}
  .trust-grid{grid-template-columns:repeat(2,1fr)}
  .card-grid.three,.process,.process.two,.post-grid{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr 1fr}
  .hero-media{order:-1}
  .primary-nav{display:none;position:absolute;top:70px;left:0;right:0;background:#fff;
    border-bottom:1px solid var(--line);margin:0;padding:12px}
  .primary-nav.open{display:block}
  .primary-nav ul{flex-direction:column;align-items:stretch;gap:2px}
  .primary-nav .submenu{position:static;display:block;box-shadow:none;border:0;padding:0 0 0 16px;margin:0}
  .has-sub .nav-group{width:100%;text-align:left}
  .nav-toggle{display:flex}
  .header-cta{display:none}
}
@media(max-width:560px){
  .trust-grid,.footer-grid{grid-template-columns:1fr}
  body{font-size:17px}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none}}
"""

MAIN_JS = """// Mobile nav toggle + submenu accessibility. No framework, no third-party JS.
(function(){
  var toggle=document.querySelector('.nav-toggle');
  var nav=document.getElementById('primary-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  // On mobile, tapping a group heading expands its submenu.
  document.querySelectorAll('.nav-group').forEach(function(btn){
    btn.addEventListener('click',function(e){
      if(window.matchMedia('(max-width:900px)').matches){
        e.preventDefault();
        var exp=btn.getAttribute('aria-expanded')==='true';
        btn.setAttribute('aria-expanded',exp?'false':'true');
        var sub=btn.nextElementSibling;
        if(sub) sub.style.display=exp?'none':'block';
      }
    });
  });
  // Progressive-enhancement form handler: posts via fetch if a JSON endpoint is
  // wired later; otherwise falls back to the form's native action.
  document.querySelectorAll('form.lead-form').forEach(function(form){
    form.addEventListener('submit',function(){
      // No-op by default: the static build lets the browser navigate to the
      // action URL. Replace with a fetch() to your Formspark/Pages Function.
    });
  });
})();
"""

# Monogram favicon: white B on ink.
FAVICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" rx="12" fill="#1a2332"/>
<text x="32" y="46" font-family="Inter,system-ui,sans-serif" font-size="42"
 font-weight="700" fill="#ffffff" text-anchor="middle">B</text>
</svg>
"""

# Portrait placeholder shown until assets/dave.jpeg is supplied.
PORTRAIT_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img"
 aria-label="Dr David Burnell, founder of Burnell Consultancy">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#22304a"/><stop offset="1" stop-color="#1a2332"/>
</linearGradient></defs>
<rect width="800" height="800" fill="url(#g)"/>
<circle cx="400" cy="320" r="130" fill="#33425c"/>
<path d="M180 760c0-140 100-250 220-250s220 110 220 250z" fill="#33425c"/>
<text x="400" y="700" font-family="Inter,system-ui,sans-serif" font-size="30"
 fill="#8b9ab5" text-anchor="middle">Dr David Burnell</text>
<text x="400" y="740" font-family="Inter,system-ui,sans-serif" font-size="22"
 fill="#5f7characterplaceholder" text-anchor="middle">portrait: add assets/dave.jpeg</text>
</svg>
""".replace("#5f7characterplaceholder", "#5f708c")

# Branded OG card (SVG source; export to PNG for og:image if desired).
OG_CARD_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#1a2332"/>
<rect x="0" y="0" width="1200" height="8" fill="#0d9488"/>
<text x="80" y="180" font-family="Inter,system-ui,sans-serif" font-size="40"
 font-weight="700" fill="#ffffff">Burnell<tspan fill="#93b4fb" font-weight="400"> Consultancy</tspan></text>
<text x="80" y="300" font-family="Inter,system-ui,sans-serif" font-size="58"
 font-weight="800" fill="#ffffff">Secrets, pipelines and</text>
<text x="80" y="372" font-family="Inter,system-ui,sans-serif" font-size="58"
 font-weight="800" fill="#ffffff">golden images. Fixed.</text>
<text x="80" y="470" font-family="Inter,system-ui,sans-serif" font-size="30"
 fill="#c3cede">UK platform security engineering. £14k fixed-price assessment.</text>
<circle cx="1010" cy="315" r="150" fill="none" stroke="#0d9488" stroke-width="4"/>
<circle cx="1010" cy="285" r="55" fill="#33425c"/>
<path d="M900 470c0-70 50-120 110-120s110 50 110 120z" fill="#33425c"/>
</svg>
"""

# Enterprise track-record logos, rendered as uniform greyscale wordmarks so the
# row reads as one system (they are tinted grey and set to 40px height in CSS).
LOGO_IBM = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 70">
<text x="115" y="53" font-family="Georgia,'Times New Roman',serif" font-size="54"
 font-weight="800" letter-spacing="5" text-anchor="middle" fill="#55607a">IBM</text>
<g fill="#ffffff">
<rect x="0" y="15" width="230" height="4"/><rect x="0" y="23" width="230" height="4"/>
<rect x="0" y="31" width="230" height="4"/><rect x="0" y="39" width="230" height="4"/>
<rect x="0" y="47" width="230" height="4"/></g>
</svg>
"""

LOGO_HP = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 92 70">
<circle cx="46" cy="35" r="31" fill="none" stroke="#55607a" stroke-width="5"/>
<text x="46" y="47" font-family="Arial,Helvetica,sans-serif" font-size="31"
 font-style="italic" font-weight="700" text-anchor="middle" fill="#55607a">hp</text>
</svg>
"""

LOGO_GRESEARCH = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 70">
<text x="160" y="49" font-family="Arial,Helvetica,sans-serif" font-size="40"
 text-anchor="middle" fill="#55607a"><tspan font-weight="800">G</tspan><tspan
 font-weight="400" letter-spacing="2"> RESEARCH</tspan></text>
</svg>
"""

LOGO_ARISTOCRAT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 70">
<text x="170" y="47" font-family="Georgia,'Times New Roman',serif" font-size="36"
 font-weight="600" letter-spacing="4" text-anchor="middle" fill="#55607a">ARISTOCRAT</text>
</svg>
"""

LOGO_FILES = {
    "ibm.svg": LOGO_IBM, "hp.svg": LOGO_HP,
    "g-research.svg": LOGO_GRESEARCH, "aristocrat.svg": LOGO_ARISTOCRAT,
}


# Netlify headers (drag-and-drop honours _headers).
HEADERS = """/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
/css/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=31536000, immutable
/assets/*
  Cache-Control: public, max-age=31536000, immutable
"""

# Clean-URL redirects are unnecessary with directory/index.html, but keep a
# canonical host redirect note for when the domain is live.
REDIRECTS = """# Netlify redirects. Directory index.html gives clean URLs already.
# Add host canonicalisation here once the domain is attached, e.g.
# https://www.burnellconsultancy.co.uk/*  https://burnellconsultancy.co.uk/:splat  301!
"""


# --------------------------------------------------------------------------- #
# Writer                                                                       #
# --------------------------------------------------------------------------- #

def write_page(path, htmlstr):
    if path == "/":
        rel = "index.html"
    else:
        rel = path.strip("/") + "/index.html"
    dest = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(htmlstr)
    return path


def write_raw(rel, content):
    dest = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dest) or OUT, exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    builders = [
        home(), assessment(),
        secrets_vault(), golden_images(), security_maturity(), pki(),
        scaling_saas(), regulated_platforms(), financial_services(),
        about(), scorecard(), contact(),
        insights_index(),
        thank_you(),
    ]
    for post in POSTS:
        builders.append(article_page(post))

    paths = []
    for path, htmlstr in builders:
        paths.append(write_page(path, htmlstr))

    # 404 lives at the root as 404.html (Netlify convention)
    write_raw("404.html", not_found())

    # Static assets
    write_raw("css/styles.css", STYLES)
    write_raw("js/main.js", MAIN_JS)
    write_raw("favicon.svg", FAVICON_SVG)
    write_raw("assets/dave-placeholder.svg", PORTRAIT_SVG)
    write_raw("assets/og-card.svg", OG_CARD_SVG)
    write_raw("_headers", HEADERS)
    write_raw("_redirects", REDIRECTS)
    write_raw("llms.txt", llms_txt())
    write_raw("robots.txt", robots_txt())

    # Enterprise track-record logos
    for fname, svg in LOGO_FILES.items():
        write_raw(f"assets/logos/{fname}", svg)

    # Per-article thumbnails
    for post in POSTS:
        write_raw(f"assets/insights/{post['slug']}.svg",
                  thumb_svg(post["accent"], post["kicker"], post["tag"]))

    # Founder portrait: copy the processed photo in from the build source.
    src_photo = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                             "assets-src", "dave.jpeg")
    if os.path.exists(src_photo):
        shutil.copy(src_photo, os.path.join(OUT, "assets", "dave.jpeg"))
    else:
        print("WARNING: assets-src/dave.jpeg missing; placeholder will show")

    # Sitemap excludes utility pages
    sitemap_paths = [p for p in paths if p not in ("/thank-you/",)]
    write_raw("sitemap.xml", sitemap(sitemap_paths))

    print(f"Wrote {len(paths)} pages + assets to {OUT}")


if __name__ == "__main__":
    main()
