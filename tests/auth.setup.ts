import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email = 'example67@gmail.com';
  const name = 'test_user67';

  console.log(`Bypassing UI login for: ${email} via Test API`);
  
  // 1. Navigate to our "Trapdoor" API route
  // This will set the session cookie and redirect back to "/"
  await page.goto(`/api/test/login?email=${encodeURIComponent(email)}`);

  // 2. Wait for the redirect back to the home page
  try {
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
    
    // 3. Verify the session is actually active by checking for the username
    await expect(page.getByText(name, { exact: false })).toBeVisible({ timeout: 10000 });
    
    console.log('Successfully authenticated via Test API.');
  } catch (e) {
    console.log("Authentication via API failed. Current URL:", page.url());
    const bodyText = await page.innerText('body');
    console.log("Page response:", bodyText);
    throw e;
  }

  // 4. Save the "Logged In" state
  await page.context().storageState({ path: authFile });
});
