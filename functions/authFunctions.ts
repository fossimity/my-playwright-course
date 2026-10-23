import { Page, expect } from '@playwright/test';

export async function loginToLoanApp(page: Page, branch: string, user: string, pass: string){

 // Navigate to the Login Application Area
  await page.goto('https://qa.hitekschool.com/lms/3108/login');

  // Locate Branch text box and enter branch name
  await page.getByLabel('Branch Name*').fill(branch);

  // Locate User Name text box and enter username
  await page.getByLabel('User Name*').fill(user);

  // Locate Password text box and enter password
  await page.getByLabel('Password*').fill(pass);

  // Click Sign in button
  await page.getByRole('button', { name: 'Sign in' }).click();

    // Assertion to validate successful login banner
await expect(page.getByRole('main')).toContainText(`Welcome ${user}`);

   }     

export async function logout(page: Page) {

  // Click Logout button
  await page.getByRole('button', { name: 'Log out' }).click();

await expect(page.getByRole('heading', { name: 'Sign in to your Branch account' })).toContainText('Sign in to your Branch account'); 
}

// --- REUSABLE Fill Add User fields FUNCTION ---
export async function fillAddUserFields(page: Page, username: string, password: string, branchRole: string) {

// Enter the username
await page.getByLabel('Username').fill(username);

// Enter the password
await page.getByLabel('Password').fill(password);

// Select Loan Manager for Branch Drop Down List Box
await page.getByLabel('Branch Role:*').selectOption(branchRole);

// Click the Save button
await page.getByRole('button', { name: 'Save', exact: true }).click();
}

export async function fillAddCustomerFields(
  page: Page,
  account: string,
  firstName: string,
  lastName: string
) {

  await page.getByLabel('Account #:*').fill(account);
  await page.getByLabel('First Name:*').fill(firstName);
  await page.getByLabel('Last Name:*').fill(lastName);

}