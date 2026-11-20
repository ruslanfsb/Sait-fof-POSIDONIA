/**
 * Shared between the build-time renderer and the browser script so the
 * contact form always describes honestly what will happen on submit.
 */
export type ContactMode = 'endpoint' | 'mailto' | 'disabled';

export function contactMode(endpoint: string, email: string): ContactMode {
  if (endpoint.trim()) return 'endpoint';
  if (email.trim()) return 'mailto';
  return 'disabled';
}

export const CONTACT_COPY: Record<ContactMode, { button: string; note: string }> = {
  endpoint: {
    button: 'Send message',
    note: 'Your message is delivered directly to the POSIDONIA team.',
  },
  mailto: {
    button: 'Compose email',
    note: 'This opens your email app with your message ready to review. Nothing is sent until you press send there.',
  },
  disabled: {
    button: 'Send message',
    note: 'Our enquiry inbox is being set up. The form will be activated as soon as our contact address is published.',
  },
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
