import { test, expect } from '@playwright/test';

import { loginToLoanApp, logout, fillAddUserFields } from '../../functions/authFunctions';

// Define an array of test data set
const testCases = [
  { username: 'MaanagerUser1', password: 'password2', branchRole: 'manager' },
  { username: 'AdminUser2', password: 'securePass1', branchRole: 'admin' },
  { username: 'ClerkUser3', password: 'clerkPass9', branchRole: 'clerk' }
];

// Loop through each data set to generate parameterized tests dynamically
testCases.forEach(({ username, password, branchRole }) => {

test(`Add User valid input - Role: ${branchRole}`, async ({ page }) => {
  
// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Click the Users link
await page.getByRole('link', { name: 'Users' }).click();

// Click the Add User button
await page.getByRole('link', { name: 'Add User' }).click();

// Fill in the Add User fields and save
await fillAddUserFields(page, username, password, branchRole);

// Validate that the new username appears in the Users table on Users page
await expect(page.locator('tbody')).toContainText(username);

// Click the Dashboard link
await page.getByRole('link', { name: 'Dashboard' }).click();

// Call the reusable logout function
await logout(page);

});

});

testCases.forEach(({ username, branchRole }) => {

test(`Delete user workflow - Role: ${branchRole}`, async ({ page }) => {

// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Click the Users link
await page.getByRole('link', { name: 'Users' }).click();

// Click the user we want to delete
await page.getByRole('link', { name: username }).click();

// Click Delete button
await page.getByRole('button', { name: 'Delete' }).click();

// Confirm the deleteion
await page.getByRole('button', { name: 'Yes, delete it' }).click();

// Verify 'Deleted' message appears on the screen
await expect(page.getByRole('status')).toContainText('Deleted');

// Verify the deleted user is no longer visible
await expect(page.getByRole('link', { name: username })).not.toBeVisible();

// Click the Dashboard link
await page.getByRole('link', { name: 'Dashboard' }).click();

// Call the reusable logout function
await logout(page);

});

});
