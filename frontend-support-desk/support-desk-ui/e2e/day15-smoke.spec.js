import { test, expect } from '@playwright/test';

test('admin can login and create a ticket through the protected UI', async ({ page }) => {
  const uniqueSuffix = Date.now();
  const ticketTitle = `E2E smoke ticket ${uniqueSuffix}`;

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('Admin@12345');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/app\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Backend Connection' })).toBeVisible();

  await page.getByRole('link', { name: 'Tickets', exact: true }).click();
  await expect(page).toHaveURL(/\/app\/tickets$/);
  await expect(page.getByPlaceholder('Search by title or category…')).toBeVisible();

  await page.getByRole('link', { name: 'New Ticket', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'New ticket' })).toBeVisible();

  await page.getByLabel('Title').fill(ticketTitle);
  await page.getByLabel('Description').fill('Created by the Day 15 Playwright smoke test.');
  await page.getByLabel('Category').selectOption('Software');
  await page.getByLabel('Priority').selectOption('MEDIUM');
  await page.getByLabel('Status').selectOption('OPEN');

  await page.getByRole('button', { name: 'Save ticket' }).click();

  await expect(page.getByText(/Ticket created with id/)).toBeVisible();
});
