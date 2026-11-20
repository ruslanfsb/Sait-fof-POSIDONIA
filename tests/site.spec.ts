import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('loads without console errors and exposes core content', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/');
    await expect(page).toHaveTitle(/POSIDONIA/);
    await expect(page.locator('h1')).toHaveText(/From the Mediterranean\.\s*For a Sustainable Future\./);
    await expect(page.locator('h1')).toHaveCount(1);

    // Scroll through the page so every observer and animation runs.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    expect(errors).toEqual([]);
  });

  test('has SEO and social metadata', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Posidonia oceanica/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /POSIDONIA/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd ?? '{}');
    expect(data['@type']).toBe('Organization');
    expect(data.name).toBe('POSIDONIA');

    for (const asset of ['og-image.png', 'favicon.svg', 'apple-touch-icon.png', 'site.webmanifest', 'robots.txt']) {
      const res = await page.request.get(`/${asset}`);
      expect(res.status(), asset).toBe(200);
    }
  });

  test('every in-page link points to an existing section and other links resolve', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''));
    expect(hrefs.length).toBeGreaterThan(20);
    for (const href of new Set(hrefs)) {
      if (href.startsWith('#')) {
        expect(await page.locator(href).count(), `target for ${href}`).toBe(1);
      } else if (!/^(https?:|mailto:)/.test(href)) {
        const res = await page.request.get(new URL(href, page.url()).href);
        expect(res.status(), href).toBe(200);
      }
    }
    // External links open safely
    for (const rel of await page.locator('a[target="_blank"]').evaluateAll((l) => l.map((a) => a.getAttribute('rel')))) {
      expect(rel).toContain('noopener');
    }
  });

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('presents honest product statuses', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.product');
    await expect(cards).toHaveCount(4);
    await expect(page.locator('.product .status--development')).toHaveCount(2);
    await expect(page.locator('.product .status--research')).toHaveCount(2);
    await expect(page.getByText('No POSIDONIA product is commercially available or certified')).toBeVisible();
  });

  test('shows all content with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('#team').scrollIntoViewIfNeeded();
    const hidden = await page.locator('[data-reveal]').evaluateAll(
      (els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe('mobile menu', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'The menu button is only shown on small screens');
  });

  test('opens, traps focus, closes with Escape and navigates', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-menu-toggle]');
    const menu = page.locator('#mobile-menu');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(page.locator('main')).toHaveJSProperty('inert', true);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();

    await toggle.click();
    await menu.getByRole('link', { name: /Roadmap/ }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#roadmap$/);
    await expect(page.locator('#roadmap')).toBeInViewport();
  });
});

test('privacy page renders and links back home', async ({ page }) => {
  await page.goto('/privacy.html');
  await expect(page.locator('h1')).toHaveText('Privacy Policy');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await page.getByRole('link', { name: 'Back to the homepage' }).click();
  await expect(page.locator('h1')).toContainText('From the Mediterranean.');
});
