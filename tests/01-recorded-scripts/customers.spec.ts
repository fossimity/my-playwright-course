import { test, expect } from '@playwright/test';

import { loginToLoanApp, logout, fillAddCustomerFields } from '../../functions/authFunctions';

const testCases = [ 
  { account: '1234567', firstName: 'Good', lastName: 'Will', title: 'Mr.' },
  { account: '2345678', firstName: 'June', lastName: 'Smith', title: 'Mrs.' }, 
  { account: '3456790', firstName: 'Johanna', lastName: 'Carpenter', title: 'Miss' }, 
  { account: '4567901', firstName: 'Linda', lastName: 'Johnson', title: 'Ms.' }, 
  { account: '5679012', firstName: 'Olga', lastName: 'Steveston', title: 'Ms.' }
];

testCases.forEach(({ account, firstName, lastName, title }) => {

test(`Add Customer valid input - Title: ${title} - Account: ${account}`, async ({ page }) => {

// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Click the Customers link
await page.getByRole('link', { name: 'Customers' }).click();

// Click the Add Customer button
await page.getByRole('link', { name: 'Add Customer' }).click();

// Fill in the Add Customer fields
await fillAddCustomerFields(page, account, firstName, lastName);

// Click the Save button
await page.getByRole('button', { name: 'Save', exact: true }).click();

// Verify the account number appears in the Customers table
await expect(page.locator('tbody')).toContainText(account);

// Click the Dashboard link
await page.getByRole('link', { name: 'Dashboard' }).click();

// Call the reusable logout function
await logout(page); 

});

});

testCases.forEach(({ account, firstName, lastName, title }) => {

test(`Delete Customer valid input - Title: ${title} - Account: ${account}`, async ({ page }) => {

// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Click the Customers link
await page.getByRole('link', { name: 'Customers' }).click();

// Click the Delete button in the customer's row
await page.getByRole('row', { name: account }).getByRole('button', { name: 'Delete' }).click();

// Confirm the deletion
await page.getByRole('button', { name: 'Yes, delete it' }).click();

// Verify the customer account is no longer visible
await expect(page.getByRole('link', { name: account })).not.toBeVisible();

// Click the Dashboard link
await page.getByRole('link', { name: 'Dashboard' }).click();

// Call the reusable logout function
await logout(page);                                                

});

});

