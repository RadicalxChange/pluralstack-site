/**
 * Seeds the Plural Stack site content from "Plural Stack - Website Content and Page Tree".
 *
 * Idempotent: every document uses a deterministic _id and is written with
 * createOrReplace, so re-running overwrites rather than duplicating.
 *
 *   set -a; . ./.env; set +a; node ./sanity-export/seed-content.js
 */
const fs = require('fs');
const path = require('path');
const {createClient} = require('@sanity/client');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN;

if (!projectId || !token) {
    throw new Error('SANITY_PROJECT_ID and SANITY_TOKEN must be set (source your .env first)');
}

const client = createClient({projectId, dataset, token, apiVersion: '2024-01-31', useCdn: false});

// The stock "Home" page already occupies slug "/". Reuse its _id so the homepage is
// replaced in place rather than colliding with a second document on the same slug.
const HOMEPAGE_ID = 'a59d87e4-e3ff-4929-acc1-d67b1808d36c';
const SITE_CONFIG_ID = '427de992-8d59-40a3-af5f-2f83675af6c3';

/** Sanity needs a stable _key on every array item for the Studio to edit it. */
let keySeq = 0;
const keyed = (items) => items.map((item) => ({_key: `k${++keySeq}`, ...item}));

const button = (label, url, theme = 'primary') => ({_type: 'actionButton', label, url, theme});
const link = (label, url) => ({_type: 'actionLink', label, url});

const hero = ({heading, subheading, body, cta, outro, sketch, theme}) => ({
    _type: 'heroSection',
    heading,
    ...(subheading && {subheading}),
    ...(body && {body}),
    ...(cta && {cta: keyed(cta)}),
    ...(outro && {outro}),
    ...(sketch && {sketch}),
    theme: theme || 'light',
    width: 'full'
});

const cards = ({eyebrow, heading, body, items, outro, cta, columns = 'three', compactTiles, dividerAfter, theme}) => ({
    _type: 'cardsSection',
    ...(eyebrow && {eyebrow}),
    ...(heading && {heading}),
    ...(body && {body}),
    ...(items && {items: keyed(items.map((i) => ({_type: 'card', hasBorder: true, textAlign: 'left', ...i})))}),
    ...(outro && {outro}),
    ...(cta && {cta: keyed(cta)}),
    ...(compactTiles && {compactTiles}),
    ...(dividerAfter && {dividerAfter}),
    columns,
    theme: theme || 'light',
    width: 'full'
});

const cta = ({eyebrow, heading, body, cta: actions, theme}) => ({
    _type: 'ctaSection',
    ...(eyebrow && {eyebrow}),
    ...(heading && {heading}),
    ...(body && {body}),
    ...(actions && {cta: keyed(actions)}),
    theme: theme || 'light',
    width: 'full'
});

const domain = ({eyebrow, heading, body, examples}) => ({
    _type: 'domainSection',
    eyebrow,
    heading,
    body,
    examples,
    theme: 'light',
    width: 'full'
});

const form = ({heading, body, fields, submitLabel}) => ({
    _type: 'formSection',
    ...(heading && {heading}),
    ...(body && {body}),
    fields: keyed(fields.map((f) => ({_type: 'formField', ...f}))),
    submitLabel,
    isConnected: false,
    notConnectedNotice:
        'This form is not connected yet — a form backend still needs to be chosen and wired up.',
    theme: 'light',
    width: 'full'
});

// Second value is a one-liner (used on /our-pitch only).
const ORGS = [
    [
        'RadicalxChange Foundation (RxC)',
        'A think-and-do civic tech nonprofit working to keep human agency and democratic participation central to the digital sphere.'
    ],
    [
        'European Ethereum Institute (EEI)',
        "A nonprofit organisation working to shape crypto regulation and Ethereum's potential in Europe."
    ],
    ['Identity Valley (IDV)', 'A nonprofit research organisation ensuring ethical digital innovation and transformation.'],
    [
        'European Decentralisation Institute (EDI)',
        "A nonprofit research organisation promoting decentralised technologies to address Europe's current digital infrastructure challenges."
    ],
    [
        'Global Solutions Initiative (GSI)',
        'An international nonprofit delivering research-based policy advice to the G20, G7, and related bodies in pursuit of a human-centred global economic system.'
    ]
];

const AUDIENCES = [
    ['Funders', 'Invest in Plural protocol ecosystems through plural funding mechanisms.'],
    ['Enterprises', 'Build on Plural protocols, and contribute back to the ecosystems you rely on.'],
    [
        'Governments',
        'Provide truly sovereign digital public infrastructure, the legal frameworks to build it, and oversight of the gatekeepers that still dominate.'
    ],
    [
        'Builders',
        'Co-create Plural protocol ecosystems, build in the open, and add your project to our catalogue.'
    ]
];

const page = ({id, title, slug, metaDescription, sections}) => ({
    _id: id,
    _type: 'page',
    title,
    slug: {_type: 'slug', current: slug},
    metaTitle: title,
    addTitleSuffix: true,
    metaDescription,
    sections: keyed(sections)
});

const pages = [
    page({
        id: HOMEPAGE_ID,
        title: 'Home',
        slug: '/',
        metaDescription:
            "Europe doesn't need its own Big Tech. It needs digital infrastructure nobody can capture — open, non-extractive, and built to serve the people who use it.",
        sections: [
            hero({
                heading: 'Rebuilding our digital foundations, protocol by protocol.',
                body: "Europe doesn't need its own Big Tech. It needs digital infrastructure nobody can capture — open, non-extractive, and built to serve the people who use, build, and create on it.",
                cta: [
                    button('Our Pitch →', '/our-pitch/', 'primary'),
                    button('Get Involved →', '/get-involved/', 'secondary')
                ],
                outro: 'Prefer to go straight to the source? [Read the Paper →](/projects/plural-stack-paper/)',
                sketch: 'squares',
                theme: 'lemonade'
            }),
            cards({
                heading: "Three cracks are already showing in Europe's digital foundations.",
                items: [
                    {
                        heading: 'Systemic vulnerability',
                        body: 'When a handful of firms control the infrastructure, one outage can take down half the web.'
                    },
                    {
                        heading: 'Extractive economics',
                        body: 'Platforms harvest our data, our attention, and our open-source labour — and hand back crumbs.'
                    },
                    {
                        heading: 'Strategic dependency',
                        body: "Europe's digital life runs on infrastructure it doesn't own, governed by laws it doesn't write."
                    }
                ],
                outro: "The problem isn't where these platforms are based. It's that they're centralised — and regulation alone won't change that.",
                cta: [link('See the full case in the paper →', '/projects/plural-stack-paper/')]
            }),
            cta({
                heading: 'Plurality: technology that holds difference together.',
                body: 'We believe digital infrastructure should look like ecosystems, not empires. A Plural protocol ecosystem is open, decentralised, and built to serve its builders, creators, and users first — not to extract from them. It only works when three dimensions hold at once: technical (open and verifiable), economic (fair and non-extractive), and social (participatory and accountable).',
                cta: [
                    link('Meet the people behind it →', '/our-pitch/'),
                    link('Read the full framework →', '/projects/plural-stack-paper/')
                ],
                theme: 'dark'
            }),
            cards({
                heading: 'Where to start.',
                columns: 'two',
                items: [
                    {
                        heading: 'Projects',
                        body: 'A living catalogue of Plural protocol initiatives, starting with our own paper and assessment framework.',
                        cta: keyed([link('Explore Projects →', '/projects/')])
                    },
                    // Paper and Assessment are reached via the Projects page, not from here.
                    {
                        heading: 'Domains',
                        body: 'Four places this plays out first: digital public infrastructure, civic tech, AI, and social media.',
                        cta: keyed([link('Explore Domains →', '/domains/')])
                    }
                ]
            }),
            cards({
                heading: 'Build this with us.',
                columns: 'two',
                items: AUDIENCES.map(([heading, body]) => ({heading, body})),
                cta: [button('Get Involved →', '/get-involved/', 'primary')]
            })
        ]
    }),

    page({
        id: 'page-projects',
        title: 'Projects',
        slug: 'projects/',
        metaDescription:
            'Our living dashboard of Plural protocol initiatives — starting with our own, and growing as the ecosystem does.',
        sections: [
            hero({
                heading: "What's being built.",
                body: 'Projects is our living dashboard of Plural protocol initiatives — starting with our own, and growing as the ecosystem does.'
            }),
            cards({
                columns: 'two',
                items: [
                    {
                        badge: {_type: 'badge', label: 'Cross-domain', theme: 'neutral'},
                        heading: 'The Plural Stack Paper',
                        body: 'Rebuilding our digital foundations from protocol up. Our founding report, and the intellectual backbone of everything else here.',
                        cta: keyed([link('Read the Paper →', '/projects/plural-stack-paper/')])
                    },
                    {
                        badge: {_type: 'badge', label: 'Cross-domain', theme: 'neutral'},
                        heading: 'Plural Protocol Assessment Framework',
                        body: 'A scoring framework for measuring how open, fair, and accountable a digital protocol or platform really is.',
                        cta: keyed([link('See the Framework →', '/projects/plural-stack-assessment/')])
                    }
                ]
            }),
            cards({
                heading: 'Plurality already exists.',
                body: "We're not starting from zero. Plural protocol ecosystems are already working in the wild:",
                columns: 'two',
                items: [
                    {
                        heading: 'Ethereum',
                        body: 'Thousands of independent developers building on shared, permissionless infrastructure.'
                    },
                    {
                        heading: 'The AT Protocol & Bluesky',
                        body: 'One open specification, many independent implementations.'
                    },
                    {
                        heading: 'IPFS & Filecoin',
                        body: 'Decentralised storage networks with no single point of failure.'
                    },
                    {
                        heading: "Taiwan's vTaiwan and g0v",
                        body: 'Civic technology that puts deliberation directly into policymaking.'
                    }
                ],
                outro: "These aren't case studies from a textbook. They're proof that this works today."
            }),
            cta({
                heading: 'Building something plural? Add it to the catalogue.',
                body: "If you're building open, decentralised, non-extractive digital infrastructure, we want to hear about it.",
                cta: [button('Submit Your Project →', '/get-involved/', 'primary')],
                theme: 'dark'
            })
        ]
    }),

    page({
        id: 'page-plural-stack-paper',
        title: 'The Plural Stack Paper',
        slug: 'projects/plural-stack-paper/',
        metaDescription:
            'Our flagship report: the case for Plural protocol ecosystems, and eight concrete recommendations for Europe.',
        // Structure and copy mirror plural-stack.webflow.io. Its hero, top nav and
        // footer are deliberately not reproduced: the hero was excluded on request,
        // and nav/footer are site chrome that siteConfig already provides.
        sections: [
            hero({
                heading: 'The Plural Stack Paper',
                subheading: 'Rebuilding Our Digital Foundations from Protocol Up',
                body: 'Our flagship report: the case for Plural protocol ecosystems, and eight concrete recommendations for Europe.'
            }),

            // Stats band, carried over from the source page's hero, with the source's
            // positioning paragraph above it.
            cards({
                body: 'Europe cannot regulate its way to digital sovereignty. The Plural Stack is a policy and design framework for infrastructure that is plural by architecture rather than extractive by default — built on open protocols that resist capture by design.',
                items: [
                    {
                        heading: '~40%',
                        body: 'of global web traffic paralysed by the 2025 AWS outage',
                        textAlign: 'center'
                    },
                    {
                        heading: '¢ vs. $',
                        body: 'creators earn cents while platforms pocket dollars',
                        textAlign: 'center'
                    },
                    {
                        heading: '>80%',
                        body: 'of EU digital products, services & IP from non-EU providers',
                        textAlign: 'center'
                    }
                ]
            }),

            // PART 1 — WHY NOW
            cards({
                eyebrow: 'Part 1 — Why Now',
                heading: 'The Imperative for Action',
                body: "### The problem is architecture, not geography\n\nA few platforms run the digital world and, with it, our markets, our informational environment, and, increasingly, our democracy. But the biggest underlying issue isn't that these platforms are foreign — it's that they're **centralised**. A European Big Tech would behave the same way. Regulation treats symptoms; the fix is architectural, not geographic.",
                items: [
                    {
                        heading: 'Systemic Vulnerability',
                        body: 'A handful of firms control the infrastructure through which public and private life operates. When they fail — deliberately or not — entire digital ecosystems are exposed.'
                    },
                    {
                        heading: 'Extractive Economics',
                        body: 'Platforms harvest data, attention and open-source labour, and hand back crumbs. AI repeats this pattern at a new order of magnitude.'
                    },
                    {
                        heading: 'Strategic Dependency',
                        body: "Europe's data lives on foreign soil, governed by foreign law, on platforms whose rules are set beyond European reach."
                    }
                ],
                outro: "> \"It's not about the foreign origin of digital platforms, but the architectural logic of technical centralisation, economic extraction, and the funnelling of decision-making power.\"\n>\n> — The Plural Stack, Executive Summary\n\nThe answer is a different architecture: **plural protocol ecosystems**. Think ecosystems, not champions; technical decentralisation, not centralisation; community-led protocols, not corporate-led platforms — and digital infrastructure that serves its builders, creators and users as first priority."
            }),

            // PART 2 — THE FRAMEWORK
            cards({
                eyebrow: 'Part 2 — The Framework',
                heading: 'Operationalising Democratic Values in the Digital Sphere',
                body: "### Sovereignty can't be engineered — it's earned\n\n⿻ Plurality lives across three co-equal dimensions. All three must hold at once: **foundational properties** are enforceable by design; they give rise to **emergent properties**; and only when all three dimensions work together do the **super-emergent** outcomes appear — sovereignty, resilience, competitiveness.",
                items: [
                    {
                        badge: {_type: 'badge', label: 'Technical', theme: 'neutral'},
                        body: '- Open-source code\n- Decentralised architecture\n- Interoperable open standards\n- Privacy-by-design\n- Verifiable execution\n- Auditability'
                    },
                    {
                        badge: {_type: 'badge', label: 'Economic', theme: 'neutral'},
                        body: '- Non-extractive value distribution\n- Transparent economics\n- Purposeful public funding\n- Data dignity'
                    },
                    {
                        badge: {_type: 'badge', label: 'Social', theme: 'neutral'},
                        body: '- Participatory governance\n- Bridging deliberation\n- Generative openness\n- Social provenance\n- The right to exit and fork'
                    }
                ],
                outro: '**Foundational** — enforceable by design\n\n↓\n\n**Emergent** — verifiable trust · credible neutrality · composability · agency\n\n↓\n\n**Super-emergent** — sovereignty · resilience · competitiveness'
            }),
            cards({
                columns: 'two',
                items: [
                    {
                        heading: '⿻ Plurality is NOT:',
                        body: '- **Decentralisation alone** — fragmented, exclusionary\n- **Democracy alone** — voting without teeth\n- **Open source alone** — code ≠ fair governance\n- **Web3 alone** — consensus needs a social layer\n- **Multistakeholder-ism alone** — can be performative.'
                    },
                    {
                        heading: '⿻ Plurality IS:',
                        body: '- **Emergent order** across all three dimensions\n- **Ecosystems over champions**\n- **Protocols over platforms**\n- **Communities over corporations**\n- **Cooperation over competition**.'
                    }
                ]
            }),
            cta({
                heading: 'Is it a protocol — or a platform in disguise?',
                body: "The paper's two-tier assessment framework separates genuinely plural protocols from open-washing. Tier 1 asks four eligibility questions — ownership of the specification, multiplicity of implementations, permissionless entry, true interoperability. Tier 2 scores the foundational properties on a maturity spectrum, classifying systems as **Truly Plural**, **Emerging Plural**, or **Pseudo-Plural**. This method is operationalised in the Plural Stack Assessment toolkit.",
                theme: 'dark'
            }),

            // THREE HIGH-IMPACT DOMAINS
            cards({
                heading: 'Where the framework bites first',
                body: 'The Plural Stack applies its assessment framework across three domains where the architectural choice between plural protocols and extractive platforms will shape the next decade.',
                items: [
                    {
                        badge: {_type: 'badge', label: 'Artificial Intelligence', theme: 'neutral'},
                        heading: 'AI as local infrastructure',
                        body: "Instead of systems built for infinite scale from a single point of control, plural AI means hyper-local guardian intelligences bound to the communities they serve — open models, resource caps, and explicit non-expansion pacts as design requirements of trustworthy AI.\n\nMultiple models trained on diverse datasets, operating within interoperable protocols, preserve the cognitive diversity that healthy democracies depend on — and turn Europe's languages, regional cultures and dense civil society from a coordination problem into irreplaceable training substrate."
                    },
                    {
                        badge: {_type: 'badge', label: 'Social Media', theme: 'neutral'},
                        heading: 'Protocols over platforms',
                        body: "Open specifications with many independent implementations — as the AT Protocol demonstrates — mean no single operator can capture the network. Users and communities keep their identity, data and social graph when they leave, forcing services to compete on quality of care rather than lock-in.\n\nUser agency over the algorithms replaces opaque, attention-extracting curation: instead of a feed that ranks — and quietly buries — content on the platform's terms, open protocols let users and communities inspect, choose, swap or build the ranking algorithms that shape what they see. Social provenance adds transparency through active labeling, showing which communities embrace or contest a piece of content."
                    },
                    {
                        badge: {_type: 'badge', label: 'Civic Tech', theme: 'neutral'},
                        heading: 'Democratic governance by design',
                        body: "Taiwan's digital democracy — g0v, vTaiwan, Pol.is — shows how open-source collaboration and structured deliberation integrate citizens directly into policymaking, improving responsiveness while reducing capture by state or commercial actors.\n\nTools like quadratic voting, conviction voting and bridging-based ranking enable nuanced preference expression; AI-assisted deliberation at continental scale can feed legislative processes as a verifiable, auditable extension of democratic decision-making."
                    }
                ]
            }),

            // PART 3 — THE STRATEGIC IMPERATIVE
            cards({
                eyebrow: 'Part 3 — The Strategic Imperative',
                heading: "Why ⿻ Plural Protocol Ecosystems Are Europe's Third Path",
                body: '### Every weakness maps to an earned strength\n\nEurope missed the platform wave — but it is positioned to lead the open protocol-ecosystem wave. With plural properties in place, each structural problem becomes a structural advantage:',
                items: [
                    {heading: 'Systemic vulnerability → Infrastructural resilience', textAlign: 'center'},
                    {heading: 'Extractive economics → Competitiveness through ⿻ Plurality', textAlign: 'center'},
                    {heading: 'Strategic dependency → Shared sovereignty', textAlign: 'center'}
                ],
                outro: "The window for action is narrow. The European Parliament's 2026 report on technological sovereignty — adopted by 471 votes to 68 — found that the EU relies on non-EU countries for over 80% of digital products, services, infrastructure and intellectual property. Once foundations harden, the cost of building alternatives rises by orders of magnitude.\n\nAnd the scope is not limited to geography: the plural approach — between platform-capitalism and state-authoritarianism — is open to any actor who honours plural values. Democratic middle powers across the globe can co-create it, turning technical interoperability into a vehicle for global cooperation."
            }),

            // PART 4 — THE POLICY TOOLKIT
            cards({
                eyebrow: 'Part 4 — The Policy Toolkit',
                heading: 'Building ⿻ Plural Protocol Ecosystems',
                body: "### Eight recommendations — transformation, not exclusion\n\nLead, don't compete: Europe should not try to beat US hyperscalers at their own game. It should define the next paradigm and become the steward of plural protocol ecosystems — funding, building, and adopting them first.",
                columns: 'two',
                items: [
                    [
                        "Lead, Don't Compete",
                        'A €5–10bn digital public infrastructure fund; define the next paradigm and steward its protocols.'
                    ],
                    [
                        'New Funding Mechanisms',
                        'Quadratic & retroactive funding, directly plural digital taxes, deep funding for foundational layers.'
                    ],
                    [
                        'Cooperation over Competition',
                        'Mandatory interoperability, shared infrastructure, regulatory cooperation, global coalition building.'
                    ],
                    [
                        'Attract Global Talent',
                        'A plural protocol champions programme, agile innovation cycles, dedicated talent visas.'
                    ],
                    [
                        'Public-Sector Adoption',
                        'Plural protocol standards as procurement requirement; 50% plural infrastructure by 2035.'
                    ],
                    [
                        'DAOs as a Legal Form',
                        'The European Cooperative Society as the preferred legal wrapper for decentralised organisations.'
                    ],
                    [
                        'Empower Users & Builders',
                        'User innovation, data and data-product co-ownership, preventive rules-based controls.'
                    ],
                    [
                        'Apply the Assessment Framework',
                        'Score hyperscalers and EU initiatives; reward those that evolve toward ⿻ Plurality.'
                    ]
                ].map(([heading, body], i) => ({
                    badge: {_type: 'badge', label: String(i + 1), theme: 'primary'},
                    heading,
                    body
                }))
            }),

            // THE PLURAL STACK ASSESSMENT
            cta({
                heading: 'How plural is your service?',
                body: 'The paper’s tiered framework is operationalised as a practical evaluation toolkit: evidence-graded verdicts across 16 properties in all three dimensions, so "how plural is this service?" becomes a measurable question rather than a slogan.',
                cta: [button('Request an assessment', '/contact-us/', 'primary')],
                theme: 'dark'
            }),

            // THE PAPER
            cta({
                heading: 'Read the full paper',
                body: 'The ⿻ Plural Stack: Rebuilding Our Digital Foundations from Protocol Up. 51 pages · v1.0, June 2026 · CC BY 4.0. The collaborative work of researchers, legal experts, policy specialists and technology practitioners from across the ⿻ Plurality community.\n\n**Citation:** Cite as: Fauler, A., von Rosenstiel, A., Nuti, J., Ferroli, F. et al., The ⿻ Plural Stack: Rebuilding our digital foundations from protocol up, ⿻ Plurality Community, 2026.',
                cta: [
                    button(
                        'Download PDF',
                        'https://cdn.prod.website-files.com/6a2c0897be4cc0501c332eb3/6a4641d858750e0053578180_The-Plural-Stack.pdf',
                        'primary'
                    ),
                    button('Request a briefing', '/contact-us/', 'secondary')
                ]
            }),

            // LINEAGE
            cta({
                heading: 'Lineage & related initiatives',
                body: 'The framework builds on the intellectual lineage of Plurality — the body of work associated with Audrey Tang, E. Glen Weyl and the RadicalxChange community — and stands alongside a growing European movement for sovereign, open digital infrastructure.',
                cta: [
                    link('Plurality.net', 'https://www.plurality.net'),
                    link('RadicalxChange', 'https://www.radicalxchange.org'),
                    link('EuroStack Initiative', 'https://eurostack.eu'),
                    link('EuroStack Report (Bria et al.)', 'https://euro-stack.info'),
                    link('Europe 2031', 'https://europe2031.ai')
                ]
            }),

            // CO-AUTHORS
            cards({
                heading: 'Written across the ⿻ Plurality community',
                body: 'The Plural Stack is the collaborative work of an interdisciplinary group of researchers, legal experts, policy specialists and technology practitioners.',
                items: [
                    ['Andreas Fauler', 'Co-Lead Germany & EU', 'RadicalxChange Foundation (RxC)', 'https://www.radicalxchange.org'],
                    ['Anja von Rosenstiel', 'Lawyer', 'Emerging technologies & digital assets', null],
                    ['Jacopo Nuti', 'Researcher & Chapter Lead Amsterdam', 'RadicalxChange Foundation (RxC)', 'https://www.radicalxchange.org'],
                    ['Ferdinand Ferroli', 'Director Policy & Research', 'Identity Valley (IDV)', 'https://identityvalley.org'],
                    ['Arno Laeven', 'Executive Director', 'European Decentralisation Institute (EDI)', 'https://eudecentralisation.org'],
                    ['Marina Markezic', 'CEO & Co-founder', 'European Ethereum Institute (EEI)', 'https://ethereum.institute'],
                    ['Vyara Savova', 'Senior Policy Lead', 'European Ethereum Institute (EEI)', 'https://ethereum.institute'],
                    ['Mateo Rodriguez', 'Senior Manager, Global Outreach & Policy', 'Global Solutions Initiative (GSI)', 'https://www.global-solutions-initiative.org'],
                    ['Jack Henderson', 'Director of Operations', 'RadicalxChange Foundation (RxC)', 'https://www.radicalxchange.org']
                ].map(([name, role, org, url]) => ({
                    heading: name,
                    body: `${role}\n\n${url ? `[${org}](${url})` : org}`
                }))
            }),

            // ORGANISATIONS BEHIND THE PAPER
            cta({
                heading: 'Organisations behind the paper',
                cta: [
                    link('RadicalxChange Foundation', 'https://www.radicalxchange.org'),
                    link('Identity Valley', 'https://identityvalley.org'),
                    link('European Decentralisation Institute', 'https://eudecentralisation.org'),
                    link('European Ethereum Institute', 'https://ethereum.institute'),
                    link('Global Solutions Initiative', 'https://www.global-solutions-initiative.org')
                ]
            }),

            // GET INVOLVED — the source page's inline contact form is replaced by a link
            // to /contact-us/ so there is a single contact form on the site.
            cta({
                heading: 'Build it with us',
                body: 'Plural protocol ecosystems are an invitation — to policymakers, public-sector builders, protocol communities, civil society, researchers and funders. Whether you want a briefing, an assessment, or to contribute to the framework: get in touch.\n\nPrefer email? Write to [andreas@radicalxchange.org](mailto:andreas@radicalxchange.org)',
                cta: [button('Get in touch →', '/contact-us/', 'primary')]
            })
        ]
    }),

    page({
        id: 'page-plural-stack-assessment',
        title: 'Plural Protocol Assessment',
        slug: 'projects/plural-stack-assessment/',
        metaDescription:
            'A framework for scoring any protocol or platform against the three dimensions that make an ecosystem genuinely plural.',
        sections: [
            hero({
                heading: 'How plural is it, really?',
                body: 'The Plural Protocol Assessment Framework is our tool for scoring any protocol or platform against the three dimensions that make an ecosystem genuinely plural: technical, economic, and social.'
            }),
            cards({
                heading: 'Three dimensions. One score.',
                body: "Every assessment checks a protocol's foundational properties across all three dimensions, and tracks whether they add up to the outcomes that matter — verifiable trust, fair prosperity, sovereignty, resilience.",
                items: [
                    {heading: 'Conducted by independent auditors', textAlign: 'center'},
                    {heading: 'Published transparently', textAlign: 'center'},
                    {heading: 'Refined through an ongoing multi-stakeholder process', textAlign: 'center'}
                ]
            }),
            cards({
                heading: 'A framework with teeth.',
                body: 'We designed this to be used, not just admired:',
                items: [
                    {body: 'Apply it to hyperscalers and EU digital initiatives alike.'},
                    {
                        body: 'Feed a public European Digital Sovereignty Dashboard, so users, businesses, and governments can choose with open eyes.'
                    },
                    {
                        body: 'Unlock procurement preference, regulatory fast-track treatment, and tax incentives for platforms that score well.'
                    }
                ],
                theme: 'dark'
            }),
            cta({
                heading: 'Want your protocol assessed?',
                body: "Whether you're building a protocol, running a platform, or funding one — get in touch to request or apply for an assessment.",
                cta: [button('Request an Assessment →', '/contact-us/', 'primary')]
            })
        ]
    }),

    page({
        id: 'page-our-pitch',
        title: 'Our Pitch',
        slug: 'our-pitch/',
        metaDescription:
            'The Plural Stack is the collaborative work of an interdisciplinary group drawn from across the Plurality community, convened and led by RadicalxChange.',
        sections: [
            hero({
                heading: 'Plural by architecture,\nnot by promise.',
                body: "We think Europe's digital future shouldn't be decided by a handful of platforms. Four ideas anchor everything we build:",
                sketch: 'mark'
            }),
            cards({
                columns: 'two',
                items: [
                    {
                        heading: 'Ecosystems over champions',
                        body: 'Many organisations and communities cooperating, not one national winner.'
                    },
                    {
                        heading: 'Protocols over platforms',
                        body: "Open specifications with many implementations, not one company's rulebook."
                    },
                    {
                        heading: 'Decentralisation over centralisation',
                        body: 'Infrastructure that resists capture by design.'
                    },
                    {
                        heading: 'Builders, creators, and users first',
                        body: 'Value flows back to the people who create it.'
                    }
                ]
            }),
            cta({
                heading: 'A community, not a company.',
                body: 'The Plural Stack is the collaborative work of an interdisciplinary group of researchers, legal experts, policy specialists, and technology practitioners drawn from across the Plurality community — convened and led by RadicalxChange (RxC).',
                theme: 'dark'
            }),
            cards({
                heading: "Who's behind this.",
                columns: 'three',
                compactTiles: true,
                dividerAfter: true,
                items: ORGS.map(([name, blurb]) => ({heading: name, body: blurb, textAlign: 'center'}))
            })
        ]
    }),

    page({
        id: 'page-get-involved',
        title: 'Get Involved',
        slug: 'get-involved/',
        metaDescription:
            'The Plural Stack is a coalition, not just a paper. However you build, there is a way in.',
        sections: [
            hero({
                heading: "However you build, there's a way in.",
                body: "The Plural Stack is a coalition, not just a paper. Here's what joining means for you:"
            }),
            cards({
                columns: 'two',
                items: AUDIENCES.map(([heading, body]) => ({heading, body})),
                outro: 'Joining means being added to our general or domain-specific mailing list. Nothing more, unless you want it to be.'
            }),
            form({
                heading: 'Get involved',
                fields: [
                    {label: 'Name', name: 'name', type: 'text', isRequired: true},
                    {label: 'Email', name: 'email', type: 'email', isRequired: true},
                    {label: 'Organisation (optional)', name: 'organisation', type: 'text', isRequired: false},
                    {
                        label: 'I am a…',
                        name: 'audience',
                        type: 'select',
                        isRequired: true,
                        options: ['Funder', 'Enterprise', 'Government', 'Builder', 'Just curious']
                    },
                    {
                        label: "Tell us a bit about what you're working on or interested in (optional)",
                        name: 'about',
                        type: 'textarea',
                        isRequired: false
                    }
                ],
                submitLabel: 'Get Involved →'
            }),
            cards({
                heading: 'In good company.',
                body: 'The Plural Stack paper, and the ecosystem around it, are made possible by:',
                columns: 'three',
                items: ORGS.map(([name]) => ({heading: name, textAlign: 'center'})),
                cta: [link("See who's behind this →", '/our-pitch/')]
            })
        ]
    }),

    page({
        id: 'page-domains',
        title: 'Domains',
        slug: 'domains/',
        metaDescription:
            'Plural protocol ecosystems apply everywhere digital infrastructure touches public life. We are starting with four.',
        sections: [
            hero({
                heading: 'Four places this starts.',
                body: "Plural protocol ecosystems apply everywhere digital infrastructure touches public life. We're starting with four: digital public infrastructure, civic tech, AI, and social media."
            }),
            domain({
                eyebrow: 'Digital Public Infrastructure (DPI)',
                heading: 'The plumbing of digital government.',
                body: 'Foundational public protocols and infrastructure that governments and institutions can adopt or mandate — from digital identity wallets to shared data spaces.',
                examples: ['EUDI Wallet', 'Gaia-X', 'EBSI', 'Common European Data Spaces']
            }),
            domain({
                eyebrow: 'Civic Technology',
                heading: 'Democracy, built into the infrastructure.',
                body: 'Civic technology and digital democracy tools that let citizens participate directly in governance and deliberation.',
                examples: ['vTaiwan', 'g0v', 'the Presidential Hackathon']
            }),
            domain({
                eyebrow: 'Artificial Intelligence',
                heading: 'AI that answers to its community.',
                body: 'Decentralised, community-governed AI infrastructure — from local models to agentic AI that stays accountable to the people it serves.',
                examples: ['The 6-Pack of Care', 'AI as extended cognition']
            }),
            domain({
                eyebrow: 'Social Media',
                heading: 'Feeds you can leave, and take with you.',
                body: 'Open social protocols as an alternative to closed, algorithm-controlled platforms.',
                examples: ['The AT Protocol', 'Bluesky']
            })
        ]
    }),

    page({
        id: 'page-contact-us',
        title: 'Contact Us',
        slug: 'contact-us/',
        metaDescription:
            'General enquiries, media, partnerships, funding — get in touch with The Plural Stack.',
        sections: [
            // The headline lives in a hero rather than on the form itself, so the page
            // gets a single h1. Form headings render as h2.
            hero({
                heading: 'Get in touch.',
                body: 'General enquiries, media, partnerships, funding — whatever it is, tell us more below.'
            }),
            form({
                fields: [
                    {label: 'Name', name: 'name', type: 'text', isRequired: true},
                    {label: 'Email', name: 'email', type: 'email', isRequired: true},
                    {
                        label: "I'm reaching out about…",
                        name: 'topic',
                        type: 'select',
                        isRequired: true,
                        options: ['Media', 'Partnership', 'Funding', 'Something else']
                    },
                    {label: 'Message', name: 'message', type: 'textarea', isRequired: true}
                ],
                submitLabel: 'Send →'
            }),
            cta({
                body: 'Prefer email? Reach us directly at **{functional mailbox address to be confirmed}**.',
                theme: 'dark'
            })
        ]
    })
];

// Paper and Assessment are subpages of Projects, so they are deliberately absent
// from the nav — they are reached from the Projects page instead. No dropdown for now.
const NAV_LINKS = keyed([
    link('Our Pitch', '/our-pitch/'),
    link('Projects', '/projects/'),
    link('Domains', '/domains/'),
    link('Contact Us', '/contact-us/'),
    button('Get Involved →', '/get-involved/', 'secondary')
]);

const FOOTER_LINKS = keyed([
    link('Our Pitch', '/our-pitch/'),
    link('Projects', '/projects/'),
    link('Domains', '/domains/'),
    link('Contact Us', '/contact-us/'),
    link('Get Involved', '/get-involved/')
]);

// Documents from earlier revisions of the page tree. Deleting a missing document is a
// no-op, so this stays safe to re-run.
const RETIRED_IDS = ['page-who-we-are'];

const LOGO_FILENAME = 'plural-stack-logo.png';
const LOGO_PATH = path.join(__dirname, 'assets', LOGO_FILENAME);

/**
 * Upload the logo once and reuse it on re-runs. Sanity assigns asset IDs on upload,
 * so we look the asset up by original filename rather than hardcoding an ID.
 */
async function ensureLogoAsset() {
    const existing = await client.fetch(
        '*[_type == "sanity.imageAsset" && originalFilename == $name] | order(_createdAt asc) [0]._id',
        {name: LOGO_FILENAME}
    );
    if (existing) {
        console.log('reusing logo asset', existing);
        return existing;
    }
    const asset = await client.assets.upload('image', fs.createReadStream(LOGO_PATH), {
        filename: LOGO_FILENAME
    });
    console.log('uploaded logo asset', asset._id);
    return asset._id;
}

async function run() {
    const tx = client.transaction();
    pages.forEach((doc) => tx.createOrReplace(doc));
    RETIRED_IDS.forEach((id) => tx.delete(id));
    await tx.commit();
    console.log(`wrote ${pages.length} pages, retired ${RETIRED_IDS.length}`);

    const logoAssetId = await ensureLogoAsset();
    const logo = {
        _type: 'customImage',
        image: {_type: 'image', asset: {_type: 'reference', _ref: logoAssetId}},
        alt: 'The Plural Stack'
    };

    await client
        .patch(SITE_CONFIG_ID)
        .set({
            'header.title': 'The Plural Stack',
            'header.logo': logo,
            'header.navLinks': NAV_LINKS,
            'footer.logo': logo,
            'footer.navLinks': FOOTER_LINKS,
            'footer.text': 'The Plural Stack — convened by RadicalxChange (RxC).',
            favicon: {_type: 'image', asset: {_type: 'reference', _ref: logoAssetId}},
            titleSuffix: ' | The Plural Stack'
        })
        // Newsletter and social copy are still undrafted.
        .unset(['footer.newsletter', 'footer.socialLinks'])
        .commit();
    console.log('patched siteConfig');
}

run().catch((error) => {
    console.error('seed failed:', error.message);
    process.exit(1);
});
