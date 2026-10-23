import { test, expect, Page } from '@playwright/test';

async function loginToLoanApp(page: Page, branch: string, user: string, pass: string){

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

async function logout(page: Page) {

  // Click Logout button
  await page.getByRole('button', { name: 'Log out' }).click();

await expect(page.getByRole('heading', { name: 'Sign in to your Branch account' })).toContainText('Sign in to your Branch account'); 
}

test('test', async ({ page }) => {
  
// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Call the reusable logout function
await logout(page);

});