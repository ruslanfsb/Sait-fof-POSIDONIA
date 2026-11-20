/**
 * POSIDONIA — website content.
 *
 * Everything a non-developer may need to change lives in this file:
 * company details, contact settings, founder names/photos and all section copy.
 * The pages are pre-rendered from this file at build time, so search engines
 * see the full text. After editing, run `npm run build` (or keep `npm run dev`
 * running — the page reloads automatically).
 *
 * Accuracy rules for anyone editing this file:
 *  - Do not add performance figures, certifications, awards, investment or
 *    partnerships unless they are real and documented.
 *  - Keep product statuses honest ("In development" / "Future research").
 */

/* ------------------------------------------------------------------ */
/* Company & contact settings                                          */
/* ------------------------------------------------------------------ */

export const company = {
  name: 'POSIDONIA',
  location: 'Cyprus',
  /** Year shown in the copyright line. */
  copyrightYear: 2026,

  /**
   * Public URL of the deployed site, ending with "/".
   * Example: 'https://www.posidonia.example/' or
   * 'https://<user>.github.io/<repository>/'.
   * Used for the canonical link, social-sharing image and sitemap.
   * Leave empty until the final address is known.
   */
  siteUrl: '',

  /**
   * Public contact email, e.g. 'hello@your-domain.com'.
   * While empty, the site shows "To be published" and the form stays inactive
   * (unless a form endpoint is configured below).
   */
  email: '',

  /**
   * Optional form-service endpoint that accepts JSON POST requests,
   * e.g. a Formspree URL such as 'https://formspree.io/f/xxxxxxx'.
   * This is a public URL, not a secret.
   *  - Endpoint set   → the form sends messages directly.
   *  - Only email set → the form opens the visitor's email app with the
   *                     message pre-filled (mailto fallback).
   *  - Neither set    → the form is shown but submission is disabled.
   */
  formEndpoint: '',

  /** Social profiles. Only entries with a URL are shown. */
  socials: [
    { label: 'LinkedIn', url: '' },
    { label: 'Instagram', url: '' },
  ] as { label: string; url: string }[],
};

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export const seo = {
  title: 'POSIDONIA — Sustainable Materials from Mediterranean Seagrass | Cyprus',
  description:
    'POSIDONIA is a Cyprus-based startup developing natural insulation and eco-plastic from responsibly sourced, beach-cast Posidonia oceanica — the start of a new family of sustainable materials.',
  ogImageAlt: 'POSIDONIA — From the Mediterranean. For a Sustainable Future.',
  themeColor: '#123F37',
};

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navigation = [
  { id: 'about', label: 'About' },
  { id: 'posidonia', label: 'Posidonia' },
  { id: 'innovations', label: 'Innovations' },
  { id: 'process', label: 'Process' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'team', label: 'Team' },
  { id: 'roadmap', label: 'Roadmap' },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: 'Sustainable materials from Cyprus',
  title: ['From the Mediterranean.', 'For a Sustainable Future.'],
  lead: 'Transforming Mediterranean seagrass into innovative materials for a more sustainable world.',
  primaryCta: { label: 'Explore Our Vision', href: '#about' },
  secondaryCta: { label: 'Partner With Us', href: '#partner' },
  stage: 'Early-stage · Research & prototype development',
  figure: 'Fig. 01 — Posidonia oceanica, abstracted',
};

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export const about = {
  label: 'About POSIDONIA',
  title: 'A materials company, grown from a Mediterranean plant.',
  paragraphs: [
    'POSIDONIA is a startup from Cyprus exploring how suitable, legally collected beach-cast seagrass can become a renewable feedstock for sustainable manufacturing.',
    'Our first products in development are two types of natural insulation for buildings and an eco-plastic made with Posidonia fibers. They are a starting point, not a boundary: we are building the research base for a wider family of materials and applications still to be discovered.',
  ],
  philosophy:
    'Nature provides valuable resources. Technology and responsible innovation can help transform them into practical solutions for the future.',
  pillars: [
    {
      title: 'Mission',
      text: 'To transform Mediterranean marine plant resources into innovative, useful and environmentally responsible products while supporting circular economy principles.',
    },
    {
      title: 'Vision',
      text: 'To become a recognized European innovator in sustainable materials derived from Mediterranean seagrass.',
    },
    {
      title: 'Approach',
      text: 'Start with practical applications, validate them through testing, then expand — combining scientific research, modern manufacturing and commercial viability.',
    },
  ],
  facts: [
    { label: 'Based in', value: 'Cyprus' },
    { label: 'Founded by', value: 'Four young entrepreneurs' },
    { label: 'Stage', value: 'Research & prototyping' },
    { label: 'Focus', value: 'Materials from marine plant fibers' },
  ],
};

/* ------------------------------------------------------------------ */
/* The material                                                        */
/* ------------------------------------------------------------------ */

export const material = {
  label: 'The Material',
  title: 'The power of Posidonia',
  intro:
    'Posidonia oceanica is not a seaweed. It is a flowering marine plant, found only in the Mediterranean Sea, that forms vast underwater meadows — and every year it renews its leaves.',
  species: 'Posidonia oceanica (L.) Delile',
  facts: [
    {
      title: 'A flowering plant, not an alga',
      text: 'Like plants on land, Posidonia has roots, creeping stems called rhizomes and ribbon-like leaves, and it can flower and bear fruit. It is one of the defining species of the Mediterranean.',
    },
    {
      title: 'Meadows that matter',
      text: 'Posidonia meadows shelter marine life, store carbon in the seabed and soften wave energy along the coast. Posidonia beds are listed as a priority habitat in Annex I of the EU Habitats Directive.',
      source: {
        label: 'Source: EU Publications Office',
        url: 'https://op.europa.eu/publication/manifestation_identifier/PUB_KH0125197ENN',
      },
    },
    {
      title: 'A natural seasonal cycle',
      text: 'The plant sheds older leaves, especially in autumn. Waves carry them ashore, where they can build up into deposits known as banquettes, together with rounded fiber balls often called “Neptune balls”.',
    },
    {
      title: 'Deposits with a role of their own',
      text: 'Beach-cast deposits help protect shorelines from erosion and return nutrients to coastal ecosystems. They are not simply waste — which is why any use must be carefully assessed and managed.',
    },
  ],
  diagramSteps: [
    { title: 'Living meadow', text: 'Protected habitat. Never harvested.' },
    { title: 'Seasonal leaf shedding', text: 'Older leaves detach and drift.' },
    { title: 'Beach-cast deposits', text: 'Ecologically valuable — much stays in place.' },
    { title: 'Responsible research', text: 'Only suitable material, collected legally.' },
  ],
  diagramCaption: 'Illustrative diagram — not to scale.',
  commitment:
    'We do not harvest living meadows. Our research focuses only on suitable beach-cast material, collected in line with local environmental rules, the necessary permissions and responsible coastal-management practice.',
};

/* ------------------------------------------------------------------ */
/* Innovations                                                         */
/* ------------------------------------------------------------------ */

export type ProductArt = 'loosefill' | 'boards' | 'ecoplastic';

export interface Product {
  name: string;
  /** Short status line shown on the card — keep it honest. */
  statusLabel: string;
  summary: string;
  focusLabel: string;
  focus: string[];
  note?: string;
  art: ProductArt;
}

export const innovations = {
  label: 'Our Innovations',
  title: 'One material. A growing family of products.',
  intro:
    'Our first three products are two natural insulation materials for buildings and an eco-plastic. All three are in development — and they are the beginning of a wider materials platform.',
  products: [
    {
      name: 'Loose-Fill Insulation',
      statusLabel: 'In development · First prototypes',
      summary:
        'Processed Posidonia fibers as loose-fill insulation for wall cavities, roof structures, attic spaces and other suitable construction applications.',
      focusLabel: 'Under investigation',
      focus: ['Thermal performance', 'Acoustic properties', 'Durability', 'Environmental impact'],
      note: 'Performance will be stated only after testing.',
      art: 'loosefill',
    },
    {
      name: 'Insulation Boards',
      statusLabel: 'In development',
      summary:
        'Rigid and semi-rigid panels that combine processed fibers with natural or low-impact binding systems, for selected building insulation applications.',
      focusLabel: 'Research areas',
      focus: [
        'Binding systems',
        'Pressing & forming',
        'Thermal conductivity',
        'Moisture & fire performance',
        'Industrial scalability',
      ],
      art: 'boards',
    },
    {
      name: 'Eco-Plastic',
      statusLabel: 'In development · Early research',
      summary:
        'A bio-based plastic material that combines processed Posidonia fibers with suitable binders or biopolymers — for products where conventional plastic could be partly replaced.',
      focusLabel: 'Research areas',
      focus: [
        'Fiber–biopolymer formulations',
        'Strength & flexibility',
        'Molding & processing',
        'Moisture behavior',
        'End-of-life options',
      ],
      note: 'Biodegradability, compostability or food-contact suitability will be claimed only after testing.',
      art: 'ecoplastic',
    },
  ] satisfies Product[],
  future: {
    label: 'Future research',
    title: 'Where the material could go next',
    items: [
      'Sustainable packaging',
      'Molded fiber products',
      'Composite panels',
      'Decorative interior materials',
      'Consumer products',
    ],
    note: 'Ideas for later research stages — not products in development.',
  },
  disclaimer:
    'Illustrations are conceptual. No POSIDONIA product is commercially available or certified at this stage.',
};

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export type ProcessIcon = 'sourcing' | 'preparation' | 'fiber' | 'product' | 'testing' | 'manufacturing';

export const processSection = {
  label: 'Our Process',
  title: 'From shoreline to material.',
  badge: 'Proposed process · in development',
  intro:
    'This is the development pathway we are researching and refining. It describes how we intend to work — not an operating production line.',
  steps: [
    {
      title: 'Responsible Sourcing',
      text: 'Identify suitable beach-cast material and collect it only where permitted, leaving ecologically important deposits in place.',
      icon: 'sourcing',
    },
    {
      title: 'Material Preparation',
      text: 'Remove sand, salt and impurities, then dry the material in a controlled way.',
      icon: 'preparation',
    },
    {
      title: 'Fiber Processing',
      text: 'Separate, open and grade the fibers to suit each target application.',
      icon: 'fiber',
    },
    {
      title: 'Product Development',
      text: 'Formulate, form and prototype products — loose-fill and board insulation, and eco-plastic.',
      icon: 'product',
    },
    {
      title: 'Testing & Validation',
      text: 'Assess thermal, acoustic, mechanical, moisture and fire behavior with appropriate methods and partners.',
      icon: 'testing',
    },
    {
      title: 'Future Manufacturing',
      text: 'Scale validated processes into a manufacturing facility in Cyprus.',
      icon: 'manufacturing',
    },
  ] satisfies { title: string; text: string; icon: ProcessIcon }[],
};

/* ------------------------------------------------------------------ */
/* Sustainability                                                      */
/* ------------------------------------------------------------------ */

export const sustainability = {
  label: 'Sustainability',
  title: 'Responsibility is part of the material.',
  intro:
    'A material that comes from the sea carries a responsibility to the sea. These principles guide every decision we make — from where material is collected to what we say about our products.',
  principles: [
    {
      title: 'Marine ecosystem protection',
      text: 'Living meadows are never harvested. Protecting Posidonia habitats comes before any commercial interest.',
    },
    {
      title: 'Responsible resource use',
      text: 'We work only with suitable beach-cast material, collected legally and in ways that respect coastal ecology.',
    },
    {
      title: 'Circular economy',
      text: 'We investigate how a naturally renewed material can become a long-lasting product, instead of relying entirely on newly extracted resources.',
    },
    {
      title: 'Materials innovation',
      text: 'Natural origin is a starting point, not a guarantee. Our products must meet real technical requirements.',
    },
    {
      title: 'Evidence before claims',
      text: 'We will describe performance or reduced dependence on conventional resources only where testing and data support it.',
    },
    {
      title: 'Long-term responsibility',
      text: 'We aim to work with scientists, authorities and coastal communities to build a sourcing model that can last.',
    },
  ],
  commitmentsTitle: 'What we commit to',
  commitments: [
    'No harvesting of living Posidonia meadows.',
    'Collection only with the required permissions and in line with local rules.',
    'Deposits that serve an ecological role stay where they are.',
    'No environmental or performance claims without supporting evidence.',
  ],
};

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

export interface Founder {
  /** Leave empty until the founder's name should be published. */
  name: string;
  /** Path to a square photo in /public, e.g. 'team/ceo.jpg'. Leave empty for the monogram. */
  photo: string;
  monogram: string;
  role: string;
  summary: string;
  responsibilities: string[];
}

export const team = {
  label: 'Our Team',
  title: 'Four founders. One shared ambition.',
  intro:
    'POSIDONIA was founded in Cyprus by four young entrepreneurs. We bring fresh thinking, speed and long-term commitment to a field that needs new ideas — and we organize our work like the company we intend to become, with clear ownership of every area.',
  founders: [
    {
      name: '',
      photo: '',
      monogram: 'CEO',
      role: 'Chief Executive Officer',
      summary: 'Leads the company and turns its long-term vision into an actionable strategy.',
      responsibilities: [
        'Company leadership & business strategy',
        'Long-term development planning',
        'Team coordination',
        'Marketing strategy & brand management',
        'Digital infrastructure, website & online presence',
        'Technology strategy',
      ],
    },
    {
      name: '',
      photo: '',
      monogram: 'PD',
      role: 'Head of Product Development',
      summary: 'Leads material research and turns raw fiber into working prototypes.',
      responsibilities: [
        'Material research',
        'Product formulations',
        'Prototype development',
        'Technical testing & product quality',
        'New applications & material properties',
      ],
    },
    {
      name: '',
      photo: '',
      monogram: 'MO',
      role: 'Head of Manufacturing & Operations',
      summary: 'Designs how POSIDONIA materials will be processed and produced.',
      responsibilities: [
        'Production planning & processes',
        'Equipment selection',
        'Workshop organization',
        'Raw material processing & logistics',
        'Production efficiency & future automation',
      ],
    },
    {
      name: '',
      photo: '',
      monogram: 'BD',
      role: 'Head of Business Development & Partnerships',
      summary: 'Builds the relationships that take POSIDONIA from research to market.',
      responsibilities: [
        'Strategic partnerships',
        'Investor communication',
        'Supplier & customer relationships',
        'Commercial negotiations',
        'Networking & new opportunities',
      ],
    },
  ] satisfies Founder[],
};

/* ------------------------------------------------------------------ */
/* Roadmap & future manufacturing                                      */
/* ------------------------------------------------------------------ */

export const roadmap = {
  label: 'Our Roadmap',
  title: 'A staged path from prototype to production.',
  intro: 'Each stage builds on evidence from the one before. We move forward when results justify it — not to a fixed calendar.',
  stages: [
    {
      title: 'Research & Prototyping',
      text: 'Development of initial material concepts and physical samples.',
      current: true,
    },
    {
      title: 'Testing & Validation',
      text: 'Technical testing, optimization, and assessment of commercial viability.',
      current: false,
    },
    {
      title: 'Pilot Production',
      text: 'Development of a small-scale manufacturing process and initial market partnerships.',
      current: false,
    },
    {
      title: 'Industrial Expansion',
      text: 'Scaling manufacturing, increasing automation, and exploring European markets.',
      current: false,
    },
  ],
  currentLabel: 'We are here',
  focusTitle: 'Current focus',
  focus: [
    'Developing our first insulation prototypes',
    'Researching eco-plastic formulations',
    'Researching suitable processing methods',
    'Investigating material properties',
    'Evaluating production costs',
    'Studying industrial manufacturing possibilities',
    'Exploring future product applications',
    'Establishing relationships with potential partners',
    'Preparing our business development strategy',
  ],
  competition:
    'In 2027 we are preparing to take part in a student entrepreneurship competition in Cyprus, with the possibility of advancing to a European final in Luxembourg.',
  facility: {
    label: 'Future manufacturing',
    title: 'A modern facility in Cyprus — the plan.',
    text: [
      'Our long-term goal is a manufacturing facility in Cyprus designed to grow with demand and to support several product categories over time.',
      'We intend to begin with a combination of manual work and industrial equipment, then automate suitable stages as demand grows and automation becomes economically justified.',
    ],
    caption: 'Concept layout — a future plan, not an existing facility.',
    zones: [
      'Raw material reception & storage',
      'Cleaning & preparation',
      'Sand & impurity separation',
      'Drying',
      'Fiber processing',
      'Loose-fill production',
      'Board manufacturing',
      'Packaging',
      'Quality control',
      'Finished product storage',
      'Research & development',
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Partnerships & investment                                           */
/* ------------------------------------------------------------------ */

export const partnership = {
  label: 'Partnerships & Investment',
  title: 'Let’s Build the Future of Sustainable Materials.',
  intro:
    'We are looking for people and organizations who want to help a new material move from the workbench to real buildings and products. Early conversations shape what we build next.',
  partners: [
    { title: 'Research institutions', text: 'Testing, characterization and joint research.' },
    { title: 'Material scientists', text: 'Formulation, binders and processing expertise.' },
    { title: 'Construction companies', text: 'Real-world requirements and future pilot applications.' },
    { title: 'Manufacturing partners', text: 'Processing, forming, molding and production know-how.' },
    { title: 'Sustainability organizations', text: 'Responsible sourcing and coastal stewardship.' },
    { title: 'Potential investors', text: 'Support for the next stages of development.' },
    { title: 'Industrial technology suppliers', text: 'Equipment for cleaning, drying and fiber processing.' },
  ],
  primaryCta: { label: 'Start a conversation', topic: 'partnership' },
  secondaryCta: { label: 'Investor enquiries', topic: 'investment' },
  disclaimer:
    'POSIDONIA is an early-stage company. Nothing on this website is an offer of securities or a promise of financial returns.',
};

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  label: 'Contact',
  title: 'Get in touch.',
  intro:
    'Whether you represent a research institution, a company or an investor — or you are simply curious about Posidonia — we would be glad to hear from you.',
  emailPending: 'To be published',
  topics: [
    { value: 'partnership', label: 'Partnership' },
    { value: 'investment', label: 'Investment' },
    { value: 'research', label: 'Research collaboration' },
    { value: 'media', label: 'Media' },
    { value: 'other', label: 'Other' },
  ],
};

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footer = {
  description:
    'A Cyprus-based startup researching sustainable materials made from responsibly sourced Mediterranean seagrass.',
  stageNote:
    'POSIDONIA is in research and prototype development. Products described on this website are under development and are not commercially available.',
};
