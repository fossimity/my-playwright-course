// Import the core testing functions and assertion utilities from the Playwright Test runner library
import { test, expect } from '@playwright/test';

// Import our custom Page Object classes
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { CustomerFormPage } from '../../pages/CustomerFormPage';

test.describe('SmartBank Application - Customer Management Workflows', () => {

  // 1. Define the arrays for customer variations and form action buttons
  const customerTitles = ['Mr.', 'Mrs.', 'Ms.'];
  const actionButtons = ['Save', 'Save & Add another', 'Cancel'];

  // 2. Outer Loop: Controls the Customer Titles
for (const title of customerTitles) {

  // 3. Inner Loop: Controls form buttons
  for (const buttonAction of actionButtons) {

// Dynamically name the test case based on the parameters
test(`Should handle workflow for Title: "${title}" using Button: "${buttonAction}" @regression`, async ({ page }) => {

// ========================================================
// INITIALIZE ALL PAGE OBJECT BLUEPRINTS
// ========================================================
const loginPage = new LoginPage(page);
const dashboardPage = new DashboardPage(page);
const customersPage = new CustomersPage(page);

// Instantiate the Customer Form Page Object
const customerFormPage = new CustomerFormPage(page);

// Sanitize data to avoid customer account number collisions across parallel runs
// Generate a random 7-digit account number containing only numeric characters
const uniqueId = Math.floor(1000000 + Math.random() * 9000000);

const newCustomerDetails = {
  accountNumber: uniqueId.toString(),
  title: title,
  firstName: 'Alex',
  lastName: 'Smith',
  street: '123 Main Street',
  city: 'Calgary',
  province: 'Alberta',
  postalCode: 'T2P 1A1',
  phone: '4035550199',
  email: `alex.${uniqueId}@example.com`
};

// ========================================================
// STEP 1: Sign In and Navigate to Dashboard Page
// ========================================================

// Navigate to the login page
await loginPage.navigateTo();

// Enter valid credentials
await loginPage.enterCredentials('Alamo', 'admin', 'idmitrenko0103');

// Sign in
await loginPage.clickSignIn();

// Verify successful login
const welcomeAdminProfile = await dashboardPage.getWelcomeProfile();
const branchHeader = await dashboardPage.getBranchHeader();

await expect(welcomeAdminProfile).toContainText('Welcome admin');
await expect(branchHeader).toBeVisible();

// ========================================================
// STEP 2: Navigate to Customers Page & Verify Page Entry
// ========================================================

// Navigate to Customers using the Dashboard Page Object
await dashboardPage.goToCustomers();

// Verify the Customers page heading is visible
const customersPageHeading = await customersPage.getCustomersHeader();
await expect(customersPageHeading).toBeVisible();

// Configure the grid to show all customer records
await customersPage.showAllRows();

// ========================================================
// STEP 3: Click Add Customer and Verify Form Entry
// ========================================================

// Fluent Interface: Open the Add Customer form
const addCustomerForm = await customersPage.clickAddCustomer();

// Verify the Add Customer form is displayed
const formHeader = await addCustomerForm.getPageHeader();
await expect(formHeader).toBeVisible();

// ========================================================
// DATA POPULATION & DYNAMIC FORM ACTION ROUTING
// ========================================================

// Execute the corresponding form action based on the inner loop parameter
if (buttonAction === 'Save') {
  await customerFormPage.createCustomerAndSave(newCustomerDetails);

} else if (buttonAction === 'Save & Add another') {
  await customerFormPage.createCustomerAndAddAnother(newCustomerDetails);

} else if (buttonAction === 'Cancel') {
  await customerFormPage.createCustomerAndCancel(newCustomerDetails);
}

// ========================================================
// CONDITIONAL ASSERTIONS BASED ON ACTIONS
// ========================================================

if (buttonAction === 'Save') {

  // Verify the newly created customer appears in the grid
  const newCustomerRow = page.getByRole('row').filter({
    hasText: newCustomerDetails.accountNumber
  });

  await expect(newCustomerRow).toBeVisible();

} else if (buttonAction === 'Save & Add another') {

  // Verify the form remains visible and the account number field is cleared
  await expect(formHeader).toBeVisible();
  await expect(page.getByLabel('Account #:*')).toHaveValue('');

  // Return to the Customers grid and verify the saved record
  await dashboardPage.goToCustomers();

  const savedCustomerRow = page.getByRole('row').filter({
    hasText: newCustomerDetails.accountNumber
  });

  await expect(savedCustomerRow).toBeVisible();

} else if (buttonAction === 'Cancel') {

  // Verify the Customers grid is displayed
  await expect(customersPageHeading).toBeVisible();

  // Verify the canceled customer was not created
  const canceledCustomerRow = page.getByRole('row').filter({
    hasText: newCustomerDetails.accountNumber
  });

  await expect(canceledCustomerRow).not.toBeVisible();
}

// ========================================================
// TEARDOWN AND CLEANUP
// ========================================================

// Return to Dashboard
await dashboardPage.goToDashboard();

// Verify the Dashboard is displayed
await expect(branchHeader).toBeVisible();

// Log out of the application
await dashboardPage.clickLogout();

// Verify the login screen is displayed
await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

// ========================================================
// ⏳ ANTI-BRUTE FORCE PACING DELAY
// ========================================================

// Pause for 3 seconds to let the SmartBank application firewall cool down
// before the next parallel or iterative loop attempts another login.
await page.waitForTimeout(3000);
    });
  }
}
});    