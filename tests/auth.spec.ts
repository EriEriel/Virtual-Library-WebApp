import { test, expect } from '@playwright/test';

test('user can register and see their dashboard', async ({ page }) => {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  // 1. Go to register page
  await page.goto('/register');

  // 2. Fill out the form
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // 3. Submit the form
  await page.click('button[type="submit"]');

  // 4. Wait for redirection to home page or check for success
  // According to src/app/register/page.tsx, it auto-signs in and redirects to "/"
  await expect(page).toHaveURL('/');

  // 5. Verify we are logged in
  await expect(page.getByText(name)).toBeVisible();
});
