import { test, expect } from '@playwright/test';

test('loads users and filters them by name', async ({ page }) => {
  // Replace the external API with predictable test data.
  await page.route('**/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          name: 'Ada Lovelace',
          email: 'ada@example.com',
        },
        {
          id: 2,
          name: 'Grace Hopper',
          email: 'grace@example.com',
        },
      ]),
    });
  });

  // Open the actual application in Chromium.
  await page.goto('/');

  // Load users.
  await page.locator('#load-users').click();

  // Verify both users appear.
  const userCards = page.locator('.user-card');

  await expect(userCards).toHaveCount(2);
  await expect(
    userCards.getByRole('heading', { name: 'Ada Lovelace' })
  ).toBeVisible();
  await expect(
    userCards.getByRole('heading', { name: 'Grace Hopper' })
  ).toBeVisible();

  // Search for one user.
  await page.locator('#user-search').fill('grace');

  // Verify the results update.
  await expect(userCards).toHaveCount(1);
  await expect(
    userCards.getByRole('heading', { name: 'Grace Hopper' })
  ).toBeVisible();
  await expect(
    userCards.getByRole('heading', { name: 'Ada Lovelace' })
  ).toHaveCount(0);
});


test('displays an error when the users API fails', async ({ page }) => {
  // Simulate a network failure for the users API.
  await page.route('**/users', async (route) => {
    await route.abort();
  });

  await page.goto('/');

  // Start the API request.
  await page.locator('#load-users').click();

  // Verify that the app communicates the failure.
  await expect(page.locator('#message')).toContainText(
    /error|failed|unable|could not/i
  );
});
