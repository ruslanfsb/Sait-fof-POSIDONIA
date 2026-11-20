import { expect, test, type Page } from '@playwright/test';

/**
 * The form's mode comes from src/content/site.ts at build time. To test every
 * mode against the same build, the HTML is rewritten on the fly so the form
 * carries a given endpoint / email — exactly what a configured build would contain.
 */
async function openWithConfig(page: Page, config: { endpoint?: string; email?: string }) {
  await page.route(
    (url) => url.pathname === '/' || url.pathname.endsWith('/index.html'),
    async (route) => {
      const response = await route.fetch();
      let body = await response.text();
      body = body
        .replace('data-endpoint=""', `data-endpoint="${config.endpoint ?? ''}"`)
        .replace('data-email=""', `data-email="${config.email ?? ''}"`);
      await route.fulfill({ response, body });
    },
  );
  await page.goto('/#contact');
}

async function fillValid(page: Page) {
  await page.getByLabel('Name').fill('Maria Georgiou');
  await page.getByLabel('Email').fill('maria@example.org');
  await page.getByLabel('Organization').fill('Coastal Research Lab');
  await page.getByLabel('I’m interested in').selectOption('research');
  await page.getByLabel('Message').fill('We would like to discuss joint testing of fiber samples.');
  await page.getByLabel(/I agree that POSIDONIA/).check();
}

const submit = (page: Page) => page.locator('[data-submit]');
const status = (page: Page) => page.locator('[data-form-status]');

test.describe('contact form — not configured (default build)', () => {
  test('is visibly inactive and does not pretend to send', async ({ page }) => {
    await page.goto('/#contact');
    await expect(submit(page)).toBeDisabled();
    await expect(page.locator('[data-form-note]')).toContainText('being set up');
    await expect(page.locator('.contact-details')).toContainText('To be published');
  });
});

test.describe('contact form — mailto fallback', () => {
  test.beforeEach(async ({ page }) => {
    await openWithConfig(page, { email: 'team@example.com' });
  });

  test('validates required fields accessibly', async ({ page }) => {
    await expect(submit(page)).toBeEnabled();
    await expect(submit(page)).toHaveText(/Compose email/);
    await submit(page).click();

    for (const id of ['cf-name', 'cf-email', 'cf-message', 'cf-consent']) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator(`#${id}-error`)).toBeVisible();
    }
    await expect(page.locator('#cf-name')).toBeFocused();
    await expect(status(page)).toBeEmpty();

    await page.getByLabel('Email').fill('not-an-email');
    await submit(page).click();
    await expect(page.locator('#cf-email-error')).toContainText('valid email');

    // Errors clear once a field is corrected
    await page.getByLabel('Name').fill('Maria');
    await expect(page.locator('#cf-name')).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('builds a pre-filled email draft and explains that nothing was sent', async ({ page }) => {
    await fillValid(page);
    await submit(page).click();

    await expect(status(page)).toContainText('Your email app should open now');
    await expect(status(page)).toContainText('Nothing has been sent yet');
    const href = await page.locator('[data-contact-form]').getAttribute('data-mailto');
    expect(href).toMatch(/^mailto:team@example\.com\?subject=/);
    const url = new URL(href ?? '');
    const subject = url.searchParams.get('subject');
    const body = url.searchParams.get('body');
    expect(subject).toBe('[POSIDONIA website] Research collaboration — Maria Georgiou');
    expect(body).toContain('We would like to discuss joint testing of fiber samples.');
    expect(body).toContain('Organization: Coastal Research Lab');
    await expect(status(page).locator('a')).toHaveAttribute('href', href ?? '');
  });

  test('partner buttons preselect the enquiry topic', async ({ page }) => {
    await page.getByRole('link', { name: 'Investor enquiries' }).click();
    await expect(page.getByLabel('I’m interested in')).toHaveValue('investment');
  });
});

test.describe('contact form — form-service endpoint', () => {
  const ENDPOINT = 'https://forms.example.test/f/posidonia';

  test('sends JSON and confirms only after a successful response', async ({ page }) => {
    let payload: Record<string, string> | null = null;
    await page.route(ENDPOINT, async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });
    await openWithConfig(page, { endpoint: ENDPOINT });

    await expect(submit(page)).toHaveText(/Send message/);
    await fillValid(page);
    await submit(page).click();

    await expect(status(page)).toContainText('your message has been sent');
    expect(payload).toMatchObject({
      name: 'Maria Georgiou',
      email: 'maria@example.org',
      organization: 'Coastal Research Lab',
      topic: 'Research collaboration',
    });
    await expect(page.getByLabel('Name')).toHaveValue('');
  });

  test('reports a failed delivery honestly and keeps the message', async ({ page }) => {
    await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, body: 'error' }));
    await openWithConfig(page, { endpoint: ENDPOINT, email: 'team@example.com' });

    await fillValid(page);
    await submit(page).click();

    await expect(status(page)).toContainText('could not be sent');
    await expect(status(page)).toContainText('team@example.com');
    await expect(page.getByLabel('Message')).toHaveValue(/joint testing/);
    await expect(submit(page)).toBeEnabled();
  });

  test('silently drops submissions that fill the spam trap', async ({ page }) => {
    let requests = 0;
    await page.route(ENDPOINT, (route) => {
      requests++;
      return route.fulfill({ status: 200, body: '{}' });
    });
    await openWithConfig(page, { endpoint: ENDPOINT });
    await fillValid(page);
    await page.locator('#cf-website').fill('spam', { force: true });
    await submit(page).click();
    await page.waitForTimeout(300);
    expect(requests).toBe(0);
  });
});
