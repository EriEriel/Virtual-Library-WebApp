import { test, expect } from '@playwright/test';

test.describe('Entry CRUD Operations', () => {
  const testTitle = `Test Book ${Date.now()}`;
  const editedTitle = `${testTitle} (Edited)`;

  test('should add, edit, and delete an entry', async ({ page }) => {
    // 1. GO TO ARCHIVE
    await page.goto('/archive');
    await expect(page).toHaveURL('/archive');

    // 2. ADD ENTRY
    console.log('Adding entry...');
    await page.click('button:has-text("Add Entry")');
    await page.fill('#title', testTitle);
    await page.fill('#author', 'Test Author');
    
    // Select Category
    await page.click('button:has-text("select...")');
    await page.click('role=option[name="Manga"]');
    
    // Select Status
    await page.click('button:has-text("optional")');
    await page.click('role=option[name="Plan to read"]');

    await page.click('button:has-text("save entry")');
    
    // Verify creation
    await expect(page.getByText(testTitle, { exact: true })).toBeVisible({ timeout: 15000 });
    console.log('Entry added successfully.');

    // 3. EDIT ENTRY
    console.log('Editing entry...');
    // Find the card with our title and click its edit button
    const card = page.locator('div.relative', { hasText: testTitle });
    await card.locator('button:has-text("edit")').click();
    
    // Ensure modal is open
    await expect(page.getByText('$ edit entry')).toBeVisible();

    await page.fill('#title', editedTitle);
    await page.click('button:has-text("save changes")');
    
    // Verify edit
    await expect(page.getByText(editedTitle, { exact: true })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(testTitle, { exact: true })).not.toBeVisible();
    console.log('Entry edited successfully.');

    // 4. DELETE ENTRY
    console.log('Deleting entry...');
    const editedCard = page.locator('div.relative', { hasText: editedTitle });
    await editedCard.locator('button:has-text("edit")').click(); // Delete is inside Edit modal
    
    await page.click('button:has-text("delete")');
    await page.click('button:has-text("confirm delete")');
    
    // Verify deletion
    await expect(page.getByText(editedTitle)).not.toBeVisible({ timeout: 15000 });
    console.log('Entry deleted successfully.');
  });
});
