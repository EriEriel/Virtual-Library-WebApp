import { test, expect } from '@playwright/test';

test('homepage has footer text', async ({ page }) => {
  await page.goto('/');

  // Check if the footer text is present
  await expect(page.getByText('PERSONAL_LIB_SYS')).toBeVisible();
});

test('homepage has github link', async ({ page }) => {
  await page.goto('/');

  // Check if the GitHub link is present
  const githubLink = page.getByRole('link', { name: /GITHUB\/ERI_ERIEL/i });
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute('href', 'https://github.com/EriEriel');
});
