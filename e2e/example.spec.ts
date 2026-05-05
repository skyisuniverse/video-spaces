import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('combobox', { name: 'Select Category R&D Center' }).click();
  await page.getByRole('option', { name: 'SpaceX Falcon ADRs' }).click();
  await page.getByRole('button', { name: 'Falcon 9 & Heavy Nano-' }).click();
  await page.getByLabel('ADR navigation').getByRole('link', { name: 'decision-record-1 March 2026' }).click();
  await page.getByRole('link', { name: 'Architecture Decision Records' }).click();
  await page.getByRole('link', { name: 'Companies' }).click();
  await page.getByRole('link', { name: 'Products' }).click();
  await page.getByRole('link', { name: 'Services' }).click();
  await page.getByRole('link', { name: 'Apps' }).click();
  await page.getByRole('main').getByRole('link', { name: 'Architecture Decision Records' }).click();
});