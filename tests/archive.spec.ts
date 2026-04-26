import { test, expect } from '@playwright/test';

test('logged in user can access archive', async ({ page }) => {
  // We should already be logged in thanks to playwright.config.ts and auth.setup.ts
  await page.goto('/archive');

  // Verify we are not seeing the NonSessionScreen
  // NonSessionScreen usually has a "Please login" message
  await expect(page.getByText(/Shelf: all entries/i)).toBeVisible();
  
  // Verify user name is still in header
  await expect(page.getByText('test_user67')).toBeVisible();
});
