
import { test, expect } from '@playwright/test';

test.describe('Turbo Frame', () => {

	test('updates turbo frame', async ({ page }) => {
		await page.goto('/test');

		const responsePromise = page.waitForResponse('/frame', { timeout: 3000 });
		await page.getByTestId('test-1-link').click();
		const response = await responsePromise;

		await expect(page.locator('#test-1')).toContainText('afterclick');
	});

});

test.describe('Turbo Stream', () => {

	test.beforeEach(async ({ page }) => {
		await page.addInitScript(() => {
			window.addEventListener('turbo:render', e => {
				window.TURBO_RENDER_EVENT = e.detail.renderMethod;
			});
		});

		await page.goto('/test');
	});

	test('action: append', async ({ page }) => {
		await page.locator('#select').selectOption('append');
		await page.locator('#submit').click();
		await expect(page.locator('ul#stream-response > li')).toContainText([
			'initial', 
			'append'
		]);
	});

	test('action: prepend', async ({ page }) => {
		await page.locator('#select').selectOption('prepend');
		await page.locator('#submit').click();
		await expect(page.locator('ul#stream-response > li')).toContainText([
			'prepend',
			'initial'
		]);
	});

	test('action: replace', async ({ page }) => {
		await page.locator('#select').selectOption('replace');
		await page.locator('#submit').click();
		await expect(page.locator('div#stream-response')).toContainText('replace');
	});

	test('action: update', async ({ page }) => {
		await page.locator('#select').selectOption('update');
		await page.locator('#submit').click();
		await expect(page.locator('ul#stream-response > li')).toHaveCount(1);
		await expect(page.locator('ul#stream-response > li')).toContainText('update');
	});

	test('action: remove', async ({ page }) => {
		await page.locator('#select').selectOption('remove');
		await page.locator('#submit').click();
		await expect(page.locator('#stream-response')).toHaveCount(0);
	});

	test('action: before', async ({ page }) => {
		await page.locator('#select').selectOption('before');
		await page.locator('#submit').click();
		await expect(page.locator('#before')).toHaveCount(1);
		await expect(page.locator('#before')).toContainText('before');
	});

	test('action: after', async ({ page }) => {
		await page.locator('#select').selectOption('after');
		await page.locator('#submit').click();
		await expect(page.locator('#after')).toHaveCount(1);
		await expect(page.locator('#after')).toContainText('after');
	});

	test('action: refresh', async ({ page }) => {
		const func = page.waitForFunction(() => (window.TURBO_RENDER_EVENT === 'replace'), { timeout: 3000 });

		await page.locator('#select').selectOption('refresh');
		await page.locator('#submit').click();
		await func;

		await expect(page.locator('#select')).toHaveValue('append');
	});

	test('async (SSE)', async ({ page }) => {
		await page.locator('#sse').click();
		await expect(page.locator('#sse-response')).toContainText('sse-sent');
	});

});
