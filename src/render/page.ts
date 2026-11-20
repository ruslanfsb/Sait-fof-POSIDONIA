import { company, footer, material, seo } from '../content/site.ts';
import { logoSprite } from './brand.ts';
import { html, raw, type Markup } from './html.ts';
import {
  aboutSection,
  contactSection,
  heroSection,
  innovationsSection,
  materialSection,
  partnershipSection,
  processSectionMarkup,
  roadmapSection,
  siteFooter,
  siteHeader,
  sustainabilitySection,
  teamSection,
} from './sections.ts';

export type PageId = 'home' | 'privacy';

const abs = (path: string): string => (company.siteUrl ? new URL(path, company.siteUrl).href : path);

function structuredData(): Markup {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    description: footer.description,
    slogan: 'From the Mediterranean. For a Sustainable Future.',
    address: { '@type': 'PostalAddress', addressCountry: 'CY' },
    knowsAbout: [
      'Posidonia oceanica',
      'Sustainable materials',
      'Natural insulation materials',
      'Bio-based plastics',
      'Marine plant fibers',
      'Circular economy',
    ],
  };
  if (company.siteUrl) {
    data.url = company.siteUrl;
    data.logo = abs('apple-touch-icon.png');
  }
  if (company.email) data.email = company.email;
  const sameAs = company.socials.filter((s) => s.url.trim()).map((s) => s.url);
  if (sameAs.length) data.sameAs = sameAs;
  // Escape "<" so the JSON can never close the script element.
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
}

export function renderHead(page: PageId): Markup {
  const title = page === 'home' ? seo.title : `Privacy Policy — ${company.name}`;
  const description =
    page === 'home'
      ? seo.description
      : `How ${company.name} handles personal data submitted through this website.`;
  const path = page === 'home' ? '' : 'privacy.html';
  return html`<title>${title}</title>
    <meta name="description" content="${description}">
    ${company.siteUrl ? html`<link rel="canonical" href="${abs(path)}">` : ''}
    ${page === 'privacy' ? html`<meta name="robots" content="noindex, follow">` : ''}
    <meta name="theme-color" content="${seo.themeColor}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${company.name}">
    <meta property="og:locale" content="en_GB">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    ${company.siteUrl ? html`<meta property="og:url" content="${abs(path)}">` : ''}
    <meta property="og:image" content="${abs('og-image.png')}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${seo.ogImageAlt}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${abs('og-image.png')}">
    ${page === 'home' ? structuredData() : ''}`;
}

function homeBody(): Markup {
  return html`${logoSprite()}
  ${siteHeader('')}
  <main id="main">
    ${heroSection()}
    ${aboutSection()}
    ${materialSection()}
    ${innovationsSection()}
    ${processSectionMarkup()}
    ${sustainabilitySection()}
    ${teamSection()}
    ${roadmapSection()}
    ${partnershipSection()}
    ${contactSection()}
  </main>
  ${siteFooter('')}`;
}

function privacyBody(): Markup {
  const contactLine = company.email
    ? html`by email at <a href="mailto:${company.email}">${company.email}</a>`
    : html`through the <a href="./#contact">contact section</a> of this website`;
  return html`${logoSprite()}
  ${siteHeader('./')}
  <main id="main" class="legal">
    <div class="container legal-inner">
      <p class="label"><span>Legal</span></p>
      <h1 class="h2">Privacy Policy</h1>
      <p class="lead">This policy explains what information this website handles and why. We keep it short because we collect as little as possible.</p>

      <h2 class="h4">Who we are</h2>
      <p>${company.name} is an early-stage startup based in ${company.location}, researching sustainable materials made from Mediterranean seagrass (${raw(`<em>${material.species}</em>`)}). You can contact us ${contactLine}.</p>

      <h2 class="h4">What this website collects</h2>
      <p>This website does not use cookies, analytics or advertising trackers. Fonts and all other assets are served from the same address as the website. Like any website, the hosting provider may process technical data such as your IP address in server logs in order to deliver and secure the site.</p>

      <h2 class="h4">Contact form</h2>
      <p>If you contact us, we receive the details you choose to provide: your name, email address, organization (optional), topic and message.</p>
      <ul>
        <li>If the form opens your email app, your message is sent by your own email provider only when you press send.</li>
        <li>If the form sends messages directly, the submission is transmitted to a form-processing service acting on our behalf, which forwards it to us.</li>
      </ul>
      <p>We use these details only to respond to your enquiry and to continue a conversation you started. We do not sell or share them for marketing purposes, and we delete them when they are no longer needed for that purpose.</p>

      <h2 class="h4">Your choices</h2>
      <p>You can ask us at any time what information we hold about you, and ask us to correct or delete it. Contact us ${contactLine}.</p>

      <h2 class="h4">Changes</h2>
      <p>We will update this policy as the company and this website develop. The current version is always published on this page.</p>

      <p class="fine-print">Last updated: ${company.copyrightYear}.</p>
      <p><a class="btn btn--dark" href="./"><span>Back to the homepage</span></a></p>
    </div>
  </main>
  ${siteFooter('./')}`;
}

export function renderBody(page: PageId): Markup {
  return page === 'home' ? homeBody() : privacyBody();
}

/** Replaces `<!--render:head:PAGE-->` and `<!--render:body:PAGE-->` markers in an HTML template. */
export function renderDocument(template: string): string {
  return template.replace(/<!--render:(head|body):(home|privacy)-->/g, (_m, part: string, page: PageId) =>
    part === 'head' ? renderHead(page).value : renderBody(page).value,
  );
}

export function robotsTxt(): string {
  const lines = ['User-agent: *', 'Allow: /'];
  if (company.siteUrl) lines.push('', `Sitemap: ${abs('sitemap.xml')}`);
  return lines.join('\n') + '\n';
}

export function sitemapXml(): string | null {
  if (!company.siteUrl) return null;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${abs('')}</loc></url>
</urlset>
`;
}
