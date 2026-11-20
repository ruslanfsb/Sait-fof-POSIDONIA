import {
  about,
  company,
  contact,
  footer,
  hero,
  innovations,
  material,
  navigation,
  partnership,
  processSection,
  roadmap,
  sustainability,
  team,
  type Founder,
  type Product,
} from '../content/site.ts';
import { CONTACT_COPY, contactMode } from '../shared/contact-mode.ts';
import { arrowIcon, ecosystemDiagram, externalIcon, processIcon, productArt } from './art.ts';
import { brandLockup, brandMark } from './brand.ts';
import { html, pad2, type Markup } from './html.ts';

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function sectionHead(opts: { index: number; label: string; title: string; id: string; intro?: string; aside?: Markup }): Markup {
  return html`<header class="section-head" data-reveal>
    <p class="label"><span class="label-index">${pad2(opts.index)}</span><span>${opts.label}</span></p>
    <h2 class="h2" id="${opts.id}">${opts.title}</h2>
    ${opts.intro ? html`<p class="section-intro">${opts.intro}</p>` : ''}
    ${opts.aside ?? ''}
  </header>`;
}

function button(label: string, href: string, variant: string, extra: Markup | string = ''): Markup {
  return html`<a class="btn ${variant}" href="${href}" ${extra}><span>${label}</span>${arrowIcon()}</a>`;
}

const activeSocials = (): { label: string; url: string }[] => company.socials.filter((s) => s.url.trim());

/* ------------------------------------------------------------------ */
/* Header & mobile menu                                                */
/* ------------------------------------------------------------------ */

export function siteHeader(base: string): Markup {
  return html`<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="container header-inner">
      ${brandLockup(base ? base : '#top')}
      <nav class="site-nav" aria-label="Primary">
        <ul>
          ${navigation.map((item) => html`<li><a href="${base}#${item.id}" data-nav-link="${item.id}">${item.label}</a></li>`)}
        </ul>
      </nav>
      <a class="btn btn--small header-cta" href="${base}#partner"><span>Partner With Us</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="sr-only" data-menu-label>Open menu</span>
        <span class="menu-icon" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
    <nav class="mobile-menu-inner container" aria-label="Mobile">
      <ol class="mobile-nav">
        ${navigation.map(
          (item, i) => html`<li style="--i:${i}"><a href="${base}#${item.id}" data-menu-link><span class="mono">${pad2(i + 1)}</span>${item.label}</a></li>`,
        )}
        <li style="--i:${navigation.length}"><a href="${base}#contact" data-menu-link><span class="mono">${pad2(navigation.length + 1)}</span>Contact</a></li>
      </ol>
      <div class="mobile-menu-foot">
        ${button('Partner With Us', `${base}#partner`, 'btn--light', html`data-menu-link`)}
        <p class="mono">POSIDONIA · ${company.location}</p>
      </div>
    </nav>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* 1 · Hero                                                            */
/* ------------------------------------------------------------------ */

export function heroSection(): Markup {
  return html`<section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero-media" aria-hidden="true">
      <canvas class="hero-canvas" data-hero-canvas></canvas>
      <div class="hero-shade"></div>
    </div>
    <div class="container hero-inner" data-hero-content>
      <p class="hero-eyebrow">${brandMark('hero-eyebrow-mark')}<span>${hero.eyebrow}</span></p>
      <h1 class="hero-title" id="hero-title">
        ${hero.title.map((line, i) => html`<span class="line" style="--i:${i}"><span>${line}</span></span>`)}
      </h1>
      <p class="hero-lead">${hero.lead}</p>
      <div class="hero-actions">
        ${button(hero.primaryCta.label, hero.primaryCta.href, 'btn--light')}
        ${button(hero.secondaryCta.label, hero.secondaryCta.href, 'btn--outline-light')}
      </div>
    </div>
    <div class="container hero-foot">
      <p class="stage-pill"><span class="stage-dot" aria-hidden="true"></span>${hero.stage}</p>
      <p class="hero-figure mono" aria-hidden="true">${hero.figure}</p>
      <a class="scroll-cue" href="#about" aria-label="Scroll to About POSIDONIA"><span></span></a>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 2 · About                                                           */
/* ------------------------------------------------------------------ */

export function aboutSection(): Markup {
  return html`<section class="section section--paper" id="about" aria-labelledby="about-title">
    <div class="container">
      <div class="about-grid">
        ${sectionHead({ index: 1, label: about.label, title: about.title, id: 'about-title' })}
        <div class="about-copy" data-reveal>
          ${about.paragraphs.map((p, i) => html`<p class="${i === 0 ? 'lead' : ''}">${p}</p>`)}
        </div>
      </div>

      <figure class="philosophy" data-reveal>
        <blockquote><p>${about.philosophy}</p></blockquote>
        <figcaption class="mono">Our philosophy</figcaption>
      </figure>

      <div class="pillars">
        ${about.pillars.map(
          (p, i) => html`<article class="pillar" data-reveal style="--d:${i}">
            <p class="mono pillar-index">${pad2(i + 1)}</p>
            <h3 class="h4">${p.title}</h3>
            <p>${p.text}</p>
          </article>`,
        )}
      </div>

      <dl class="facts" data-reveal>
        ${about.facts.map((f) => html`<div class="fact"><dt class="mono">${f.label}</dt><dd>${f.value}</dd></div>`)}
      </dl>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 3 · The power of Posidonia                                          */
/* ------------------------------------------------------------------ */

export function materialSection(): Markup {
  return html`<section class="section section--sand" id="posidonia" aria-labelledby="posidonia-title">
    <div class="container">
      ${sectionHead({
        index: 2,
        label: material.label,
        title: material.title,
        id: 'posidonia-title',
        intro: material.intro,
        aside: html`<p class="species mono"><em>${material.species}</em></p>`,
      })}

      <figure class="diagram" data-reveal>
        <div class="diagram-canvas">
          ${ecosystemDiagram('From living meadow to beach-cast deposit: how Posidonia leaves reach the shore')}
        </div>
        <ol class="diagram-steps">
          ${material.diagramSteps.map(
            (s, i) => html`<li><span class="step-num" aria-hidden="true">${i + 1}</span><div><strong>${s.title}</strong><span>${s.text}</span></div></li>`,
          )}
        </ol>
        <figcaption class="mono">${material.diagramCaption}</figcaption>
      </figure>

      <div class="material-facts">
        ${material.facts.map(
          (f, i) => html`<article class="material-fact" data-reveal style="--d:${i % 2}">
            <p class="mono">${pad2(i + 1)}</p>
            <h3 class="h4">${f.title}</h3>
            <p>${f.text}</p>
            ${'source' in f && f.source
              ? html`<a class="source-link" href="${f.source.url}" target="_blank" rel="noopener noreferrer">${f.source.label}${externalIcon()}<span class="sr-only"> (opens in a new tab)</span></a>`
              : ''}
          </article>`,
        )}
      </div>

      <aside class="commitment" data-reveal aria-label="Sourcing commitment">
        ${brandMark('commitment-mark')}
        <p>${material.commitment}</p>
      </aside>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 4 · Innovations                                                     */
/* ------------------------------------------------------------------ */

function productCard(p: Product, i: number): Markup {
  return html`<article class="product product--${p.status}" data-reveal style="--d:${i % 2}">
    <div class="product-visual">
      ${productArt(p.art)}
      <span class="product-index mono" aria-hidden="true">${pad2(i + 1)}</span>
    </div>
    <div class="product-body">
      <p class="status status--${p.status}"><span class="status-dot" aria-hidden="true"></span>${p.statusLabel}</p>
      <h3 class="h3">${p.name}</h3>
      <p class="product-summary">${p.summary}</p>
      <div class="product-focus">
        <p class="mono">${p.focusLabel}</p>
        <ul class="chips">${p.focus.map((f) => html`<li>${f}</li>`)}</ul>
      </div>
      ${p.note ? html`<p class="product-note">${p.note}</p>` : ''}
    </div>
  </article>`;
}

export function innovationsSection(): Markup {
  return html`<section class="section section--paper" id="innovations" aria-labelledby="innovations-title">
    <div class="container">
      ${sectionHead({
        index: 3,
        label: innovations.label,
        title: innovations.title,
        id: 'innovations-title',
        intro: innovations.intro,
        aside: html`<ul class="status-legend" aria-label="Status legend">
          <li class="status status--development"><span class="status-dot" aria-hidden="true"></span>In development</li>
          <li class="status status--research"><span class="status-dot" aria-hidden="true"></span>Future research</li>
        </ul>`,
      })}
      <div class="products">${innovations.products.map(productCard)}</div>
      <p class="fine-print" data-reveal>${innovations.disclaimer}</p>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 5 · Process                                                         */
/* ------------------------------------------------------------------ */

export function processSectionMarkup(): Markup {
  return html`<section class="section section--dark" id="process" aria-labelledby="process-title">
    <div class="container">
      ${sectionHead({
        index: 4,
        label: processSection.label,
        title: processSection.title,
        id: 'process-title',
        intro: processSection.intro,
        aside: html`<p class="badge">${processSection.badge}</p>`,
      })}
      <ol class="process" data-reveal>
        ${processSection.steps.map(
          (s, i) => html`<li class="process-step" style="--d:${i}">
            <div class="process-node"><span class="process-icon">${processIcon(s.icon)}</span></div>
            <p class="mono process-num">Stage ${pad2(i + 1)}</p>
            <h3 class="h4">${s.title}</h3>
            <p>${s.text}</p>
          </li>`,
        )}
      </ol>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 6 · Sustainability                                                  */
/* ------------------------------------------------------------------ */

export function sustainabilitySection(): Markup {
  return html`<section class="section section--sand" id="sustainability" aria-labelledby="sustainability-title">
    <div class="container">
      ${sectionHead({
        index: 5,
        label: sustainability.label,
        title: sustainability.title,
        id: 'sustainability-title',
        intro: sustainability.intro,
      })}
      <div class="sustain-grid">
        <div class="principles">
          ${sustainability.principles.map(
            (p, i) => html`<article class="principle" data-reveal style="--d:${i % 3}">
              <p class="mono">${pad2(i + 1)}</p>
              <h3 class="h4">${p.title}</h3>
              <p>${p.text}</p>
            </article>`,
          )}
        </div>
        <aside class="commitments" data-reveal aria-labelledby="commitments-title">
          <h3 class="h4" id="commitments-title">${sustainability.commitmentsTitle}</h3>
          <ul>
            ${sustainability.commitments.map(
              (c) => html`<li><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${c}</span></li>`,
            )}
          </ul>
        </aside>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 7 · Team                                                            */
/* ------------------------------------------------------------------ */

function founderCard(f: Founder, i: number): Markup {
  const portrait = f.photo
    ? html`<img class="founder-photo" src="${f.photo}" alt="${f.name ? `Portrait of ${f.name}` : f.role}" width="96" height="96" loading="lazy" decoding="async">`
    : html`<div class="founder-monogram" aria-hidden="true"><span>${f.monogram}</span></div>`;
  return html`<article class="founder" data-reveal style="--d:${i % 2}">
    <div class="founder-top">
      ${portrait}
      <div>
        <p class="mono founder-kicker">${f.name ? 'Co-founder' : `Co-founder · ${pad2(i + 1)}`}</p>
        ${f.name ? html`<p class="founder-name">${f.name}</p>` : ''}
        <h3 class="h4 founder-role">${f.role}</h3>
      </div>
    </div>
    <p class="founder-summary">${f.summary}</p>
    <ul class="founder-list">${f.responsibilities.map((r) => html`<li>${r}</li>`)}</ul>
  </article>`;
}

export function teamSection(): Markup {
  return html`<section class="section section--paper" id="team" aria-labelledby="team-title">
    <div class="container">
      ${sectionHead({ index: 6, label: team.label, title: team.title, id: 'team-title', intro: team.intro })}
      <div class="founders">${team.founders.map(founderCard)}</div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 8 · Roadmap & future facility                                       */
/* ------------------------------------------------------------------ */

export function roadmapSection(): Markup {
  const f = roadmap.facility;
  return html`<section class="section section--teal" id="roadmap" aria-labelledby="roadmap-title">
    <div class="container">
      ${sectionHead({ index: 7, label: roadmap.label, title: roadmap.title, id: 'roadmap-title', intro: roadmap.intro })}

      <ol class="roadmap" data-reveal>
        ${roadmap.stages.map(
          (s, i) => html`<li class="roadmap-stage${s.current ? ' is-current' : ''}" style="--d:${i}" ${s.current ? html`aria-current="step"` : ''}>
            <div class="roadmap-marker" aria-hidden="true"><span></span></div>
            ${s.current ? html`<p class="roadmap-here">${roadmap.currentLabel}</p>` : ''}
            <p class="mono">Stage ${pad2(i + 1)}</p>
            <h3 class="h4">${s.title}</h3>
            <p>${s.text}</p>
          </li>`,
        )}
      </ol>

      <div class="focus-grid">
        <div class="focus" data-reveal>
          <h3 class="h4">${roadmap.focusTitle}</h3>
          <ul class="focus-list">${roadmap.focus.map((item) => html`<li>${item}</li>`)}</ul>
        </div>
        <div class="competition" data-reveal>
          <p class="mono">2027</p>
          <p>${roadmap.competition}</p>
        </div>
      </div>

      <div class="facility" aria-labelledby="facility-title">
        <div class="facility-copy" data-reveal>
          <p class="label"><span>${f.label}</span></p>
          <h3 class="h3" id="facility-title">${f.title}</h3>
          ${f.text.map((t) => html`<p>${t}</p>`)}
        </div>
        <figure class="blueprint" data-reveal>
          <ol class="blueprint-grid">
            ${f.zones.map((z, i) => html`<li class="zone zone-${i + 1}"><span class="mono">${pad2(i + 1)}</span>${z}</li>`)}
          </ol>
          <figcaption class="mono">${f.caption}</figcaption>
        </figure>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 9 · Partnerships                                                    */
/* ------------------------------------------------------------------ */

export function partnershipSection(): Markup {
  return html`<section class="section section--sand" id="partner" aria-labelledby="partner-title">
    <div class="container partner-grid">
      <div class="partner-copy" data-reveal>
        <p class="label"><span class="label-index">08</span><span>${partnership.label}</span></p>
        <h2 class="h2 partner-title" id="partner-title">${partnership.title}</h2>
        <p class="section-intro">${partnership.intro}</p>
        <div class="partner-actions">
          ${button(partnership.primaryCta.label, '#contact', 'btn--dark', html`data-topic="${partnership.primaryCta.topic}"`)}
          ${button(partnership.secondaryCta.label, '#contact', 'btn--outline-dark', html`data-topic="${partnership.secondaryCta.topic}"`)}
        </div>
        <p class="fine-print">${partnership.disclaimer}</p>
      </div>
      <ul class="partner-list" data-reveal aria-label="Who we want to work with">
        ${partnership.partners.map(
          (p, i) => html`<li><span class="mono">${pad2(i + 1)}</span><div><strong>${p.title}</strong><span>${p.text}</span></div></li>`,
        )}
      </ul>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* 10 · Contact                                                        */
/* ------------------------------------------------------------------ */

function field(opts: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autocomplete?: string;
  textarea?: boolean;
}): Markup {
  const describedBy = `${opts.id}-error`;
  const req = opts.required ? html` required aria-required="true"` : '';
  const control = opts.textarea
    ? html`<textarea id="${opts.id}" name="${opts.name}" rows="5" ${req} aria-describedby="${describedBy}"></textarea>`
    : html`<input id="${opts.id}" name="${opts.name}" type="${opts.type ?? 'text'}" ${opts.autocomplete ? html`autocomplete="${opts.autocomplete}"` : ''} ${req} aria-describedby="${describedBy}">`;
  return html`<div class="field${opts.textarea ? ' field--wide' : ''}">
    <label for="${opts.id}">${opts.label}${opts.required ? html`<span class="req" aria-hidden="true"> *</span>` : html`<span class="optional"> (optional)</span>`}</label>
    ${control}
    <p class="field-error" id="${describedBy}" hidden></p>
  </div>`;
}

export function contactSection(): Markup {
  const mode = contactMode(company.formEndpoint, company.email);
  const copy = CONTACT_COPY[mode];
  const socials = activeSocials();
  return html`<section class="section section--paper" id="contact" aria-labelledby="contact-title">
    <div class="container contact-grid">
      <div class="contact-info">
        ${sectionHead({ index: 9, label: contact.label, title: contact.title, id: 'contact-title', intro: contact.intro })}
        <dl class="contact-details" data-reveal>
          <div><dt class="mono">Company</dt><dd>${company.name}</dd></div>
          <div><dt class="mono">Location</dt><dd>${company.location}</dd></div>
          <div><dt class="mono">Email</dt><dd>${company.email
            ? html`<a href="mailto:${company.email}">${company.email}</a>`
            : html`<span class="pending">${contact.emailPending}</span>`}</dd></div>
          ${socials.length
            ? html`<div><dt class="mono">Social</dt><dd class="socials">${socials.map(
                (s) => html`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}<span class="sr-only"> (opens in a new tab)</span></a>`,
              )}</dd></div>`
            : ''}
        </dl>
      </div>

      <form class="contact-form" data-contact-form data-reveal data-endpoint="${company.formEndpoint}" data-email="${company.email}" data-mode="${mode}" novalidate>
        <div class="form-grid">
          ${field({ id: 'cf-name', name: 'name', label: 'Name', required: true, autocomplete: 'name' })}
          ${field({ id: 'cf-email', name: 'email', label: 'Email', required: true, type: 'email', autocomplete: 'email' })}
          ${field({ id: 'cf-org', name: 'organization', label: 'Organization', autocomplete: 'organization' })}
          <div class="field">
            <label for="cf-topic">I’m interested in</label>
            <div class="select-wrap">
              <select id="cf-topic" name="topic">
                ${contact.topics.map((t) => html`<option value="${t.value}">${t.label}</option>`)}
              </select>
            </div>
          </div>
          ${field({ id: 'cf-message', name: 'message', label: 'Message', required: true, textarea: true })}
          <div class="field field--wide field--check">
            <input id="cf-consent" name="consent" type="checkbox" required aria-required="true" aria-describedby="cf-consent-error">
            <label for="cf-consent">I agree that POSIDONIA may use these details to respond to my enquiry, as described in the <a href="privacy.html">Privacy Policy</a>.<span class="req" aria-hidden="true"> *</span></label>
            <p class="field-error" id="cf-consent-error" hidden></p>
          </div>
          <div class="hp" aria-hidden="true">
            <label for="cf-website">Leave this field empty</label>
            <input id="cf-website" name="website" type="text" tabindex="-1" autocomplete="off">
          </div>
        </div>
        <div class="form-foot">
          <button class="btn btn--dark" type="submit" data-submit ${mode === 'disabled' ? html`disabled` : ''}><span data-submit-label>${copy.button}</span>${arrowIcon()}</button>
          <p class="form-note" data-form-note>${copy.note}</p>
        </div>
        <div class="form-status" data-form-status role="status" aria-live="polite" tabindex="-1"></div>
      </form>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function siteFooter(base: string): Markup {
  const socials = activeSocials();
  return html`<footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          ${brandLockup(base ? base : '#top', 'POSIDONIA — back to top')}
          <p>${footer.description}</p>
          <p class="footer-tagline">From the Mediterranean. For a Sustainable Future.</p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
          <p class="mono">Explore</p>
          <ul>
            ${navigation.map((item) => html`<li><a href="${base}#${item.id}">${item.label}</a></li>`)}
            <li><a href="${base}#partner">Partner With Us</a></li>
          </ul>
        </nav>
        <div class="footer-contact">
          <p class="mono">Contact</p>
          <ul>
            <li>${company.name}, ${company.location}</li>
            <li>${company.email ? html`<a href="mailto:${company.email}">${company.email}</a>` : html`<a href="${base}#contact">Contact form</a>`}</li>
            ${socials.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a></li>`)}
          </ul>
        </div>
      </div>
      <p class="footer-stage">${footer.stageNote}</p>
      <div class="footer-bottom">
        <p>© ${company.copyrightYear} ${company.name}. All rights reserved.</p>
        <a href="privacy.html">Privacy Policy</a>
      </div>
    </div>
  </footer>`;
}
