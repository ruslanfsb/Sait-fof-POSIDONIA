/**
 * Contact form. Behaviour depends on configuration in src/content/site.ts:
 *  - endpoint → POST JSON to the form service and report the real result;
 *  - email    → open the visitor's email app with a pre-filled draft;
 *  - neither  → submission disabled (nothing is pretended to be sent).
 */
import { CONTACT_COPY, EMAIL_PATTERN, contactMode, type ContactMode } from '../shared/contact-mode.ts';

interface FormValues {
  name: string;
  email: string;
  organization: string;
  topic: string;
  topicLabel: string;
  message: string;
  consent: boolean;
  website: string;
}

type Errors = Partial<Record<'name' | 'email' | 'message' | 'consent', string>>;

function readValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form);
  const get = (key: string): string => String(data.get(key) ?? '').trim();
  const select = form.elements.namedItem('topic') as HTMLSelectElement | null;
  return {
    name: get('name'),
    email: get('email'),
    organization: get('organization'),
    topic: get('topic'),
    topicLabel: select?.selectedOptions[0]?.textContent?.trim() ?? get('topic'),
    message: get('message'),
    consent: data.get('consent') !== null,
    website: get('website'),
  };
}

export function validate(v: FormValues): Errors {
  const errors: Errors = {};
  if (v.name.length < 2) errors.name = 'Please enter your name.';
  if (!v.email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(v.email)) errors.email = 'Please enter a valid email address, e.g. name@company.com.';
  if (v.message.length < 10) errors.message = 'Please write a message of at least 10 characters.';
  if (!v.consent) errors.consent = 'Please confirm that we may use your details to reply.';
  return errors;
}

export function buildMailto(to: string, v: FormValues): string {
  const subject = `[POSIDONIA website] ${v.topicLabel} — ${v.name}`;
  const body = [
    v.message,
    '',
    '—',
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.organization ? `Organization: ${v.organization}` : '',
    `Topic: ${v.topicLabel}`,
  ]
    .filter((line, i, arr) => line !== '' || arr[i - 1] !== '')
    .join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const FIELD_IDS: Record<keyof Errors, string> = {
  name: 'cf-name',
  email: 'cf-email',
  message: 'cf-message',
  consent: 'cf-consent',
};

function setFieldError(form: HTMLFormElement, key: keyof Errors, message?: string): void {
  const input = form.querySelector<HTMLElement>(`#${FIELD_IDS[key]}`);
  const box = form.querySelector<HTMLElement>(`#${FIELD_IDS[key]}-error`);
  if (!input || !box) return;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  box.textContent = message ?? '';
  box.hidden = !message;
}

function showErrors(form: HTMLFormElement, errors: Errors): void {
  (Object.keys(FIELD_IDS) as (keyof Errors)[]).forEach((key) => setFieldError(form, key, errors[key]));
}

function setStatus(box: HTMLElement, kind: 'success' | 'error' | null, title = '', body: Node | string = ''): void {
  box.className = 'form-status' + (kind ? ` is-${kind}` : '');
  box.replaceChildren();
  if (!kind) return;
  const strong = document.createElement('strong');
  strong.textContent = title;
  const p = document.createElement('span');
  if (typeof body === 'string') p.textContent = body;
  else p.append(body);
  box.append(strong, p);
}

function applyMode(form: HTMLFormElement, mode: ContactMode): void {
  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const note = form.querySelector<HTMLElement>('[data-form-note]');
  if (button) button.disabled = mode === 'disabled';
  if (label) label.textContent = CONTACT_COPY[mode].button;
  if (note) note.textContent = CONTACT_COPY[mode].note;
  form.dataset.mode = mode;
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const button = form.querySelector<HTMLButtonElement>('[data-submit]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  if (!status || !button || !label) return;

  const endpoint = form.dataset.endpoint ?? '';
  const email = form.dataset.email ?? '';
  const mode = contactMode(endpoint, email);
  applyMode(form, mode);

  // "Start a conversation" / "Investor enquiries" buttons preselect the topic.
  document.querySelectorAll<HTMLAnchorElement>('a[data-topic]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = form.querySelector<HTMLSelectElement>('#cf-topic');
      if (select && link.dataset.topic) select.value = link.dataset.topic;
    });
  });

  // Clear a field's error as soon as it is corrected.
  const onEdit = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (target.getAttribute('aria-invalid') !== 'true') return;
    const key = (Object.keys(FIELD_IDS) as (keyof Errors)[]).find((k) => FIELD_IDS[k] === target.id);
    if (key && !validate(readValues(form))[key]) setFieldError(form, key);
  };
  form.addEventListener('input', onEdit);
  form.addEventListener('change', onEdit);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (mode === 'disabled') return;

    const values = readValues(form);
    const errors = validate(values);
    showErrors(form, errors);
    const firstInvalid = (Object.keys(FIELD_IDS) as (keyof Errors)[]).find((k) => errors[k]);
    if (firstInvalid) {
      setStatus(status, null);
      form.querySelector<HTMLElement>(`#${FIELD_IDS[firstInvalid]}`)?.focus();
      return;
    }
    // Honeypot filled → almost certainly an automated submission; send nothing.
    if (values.website) return;

    if (mode === 'mailto') {
      const href = buildMailto(email, values);
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'open the email draft again';
      const body = document.createElement('span');
      body.append(
        'Nothing has been sent yet — please review the message and press send in your email app. If it did not open, ',
        link,
        ` or write to ${email}.`,
      );
      setStatus(status, 'success', 'Your email app should open now.', body);
      form.dataset.mailto = href;
      window.location.href = href;
      return;
    }

    // Endpoint mode
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    label.textContent = 'Sending…';
    setStatus(status, null);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          organization: values.organization,
          topic: values.topicLabel,
          message: values.message,
          _subject: `[POSIDONIA website] ${values.topicLabel} — ${values.name}`,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus(status, 'success', 'Thank you — your message has been sent.', 'We will reply to the email address you provided.');
    } catch {
      setStatus(
        status,
        'error',
        'Your message could not be sent.',
        email
          ? `Please try again in a moment, or write to us directly at ${email}.`
          : 'Please check your connection and try again in a moment.',
      );
    } finally {
      button.removeAttribute('aria-busy');
      button.disabled = false;
      label.textContent = CONTACT_COPY.endpoint.button;
      status.focus({ preventScroll: false });
    }
  });
}
