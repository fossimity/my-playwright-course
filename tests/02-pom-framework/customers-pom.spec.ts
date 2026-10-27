// Import the Playwright testing tools
import { test, expect } from '@playwright/test';

// Import our Page Object classes
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CustomersPage } from '../../pages/CustomersPage';
import { CustomerFormPage } from '../../pages/CustomerFormPage';

// Group all Customer lifecycle tests into one test suite
test.describe('Customer Management - POM @smoke @regression', () => {

    // test.describe.configure({ mode: 'serial' });

    // Shared Login Data
const branchName = 'Alamo';
const loginUser = 'admin';
const loginPass = 'idmitrenko0103';

// Customer Lifecycle Data
const createdAccountNumber = '1234567';

const newCustomerDetails = {
  accountNumber: createdAccountNumber,
  firstName: 'Alex',
  lastName: 'Smith',
  street: '123 Main Street',
  city: 'Calgary',
  postalCode: 'T2P 1A1',
  phone: '4035550199',
  email: 'alex.smith@example.com'
};

  // Test 1: Add Customer
  test('Add Customer', async ({ page }) => {
// Initialize the Login Page Object
const loginPage = new LoginPage(page);

// Instantiate the Customers Page Object
const customersPage = new CustomersPage(page);

// ========================================================
// STEP 1: Sign In and Navigate to Dashboard Page
// ========================================================

// Navigate to the login page
await loginPage.navigateTo();

// Fill out the login form
await loginPage.enterCredentials(branchName, loginUser, loginPass);

// Fluent Interface: Get DashboardPage from the login method
const dashboardPage = await loginPage.clickSignIn();

// Verify successful login
const welcomeAdminProfile = await dashboardPage.getWelcomeProfile();

await expect(welcomeAdminProfile).toContainText(`Welcome ${loginUser}`);

// ========================================================
// STEP 2: Navigate to Customers Page
// ========================================================

// Click the "Customers" link in the Dashboard sidebar
await dashboardPage.goToCustomers();

// Verify the Customers page is displayed
const customersHeader = await customersPage.getCustomersHeader();

await expect(customersHeader).toBeVisible();

// Configure the grid to show all customer rows
await customersPage.showAllRows();

// ========================================================
// STEP 3: Navigate to Add Customer Page
// ========================================================

// Fluent Interface: Open the form and receive the CustomerFormPage object
const customerFormPage = await customersPage.clickAddCustomer();

// Verify the Add Customer form is displayed
const formHeader = await customerFormPage.getPageHeader();
await expect(formHeader).toBeVisible();

// ========================================================
// STEP 4: Create a New Customer
// ========================================================

// Fill out the customer form and click "Save"
await customerFormPage.createCustomerAndSave(newCustomerDetails);

// ========================================================
// STEP 5: Verify the New Customer
// ========================================================

// Locate the customer row using the unique account number
const newCustomerRow = page.getByRole('row').filter({
  hasText: createdAccountNumber
});

// Verify the newly created customer appears in the grid
await expect(newCustomerRow).toBeVisible();

// ========================================================
// STEP 6: Return to Dashboard
// ========================================================

// Navigate back to the Dashboard page
await dashboardPage.goToDashboard();

// Verify the Dashboard is displayed
const branchHeader = await dashboardPage.getBranchHeader();
await expect(branchHeader).toBeVisible();

// ========================================================
// STEP 7: Log Out
// ========================================================

// Log out of the application
await dashboardPage.clickLogout();

// Verify the login screen is displayed
await expect(page.getByRole('button', { name: 'Fake button' })).toBeVisible();


});

  // Test 2: Edit Customer
 test('Edit Customer', async ({ page }) => {

// Initialize the Page Objects
const loginPage = new LoginPage(page);
const customersPage = new CustomersPage(page);
const customerFormPage = new CustomerFormPage(page);

// ========================================================
// STEP 1: Sign In and Navigate to Dashboard Page
// ========================================================

// Navigate to the login page
await loginPage.navigateTo();

// Enter valid credentials
await loginPage.enterCredentials(branchName, loginUser, loginPass);

// Sign in and receive the Dashboard Page Object
const dashboardPage = await loginPage.clickSignIn();

// Verify successful login
const welcomeProfile = await dashboardPage.getWelcomeProfile();
await expect(welcomeProfile).toBeVisible();

// ========================================================
// STEP 2: Navigate to Customers Page
// ========================================================

// Click the "Customers" link in the Dashboard sidebar
await dashboardPage.goToCustomers();

// Verify the Customers page is displayed
const customersHeader = await customersPage.getCustomersHeader();
await expect(customersHeader).toBeVisible();

// Display all customer records
await customersPage.showAllRows();

// ========================================================
// STEP 3: Open the Customer Edit Form
// ========================================================

// Locate the customer by the unique account number and click "Edit"
await customersPage.clickEditCustomerLink(createdAccountNumber);

// Verify the Edit Customer form is displayed
const formHeader = await customerFormPage.getPageHeader();
await expect(formHeader).toBeVisible();

// ========================================================
// STEP 4: Update Customer Details
// ========================================================

// Modify only the customer's first name and save changes
await customerFormPage.updateCustomerDetails({
  firstName: 'Alexander'
});

// ========================================================
// STEP 5: Verify Updated Customer Details
// ========================================================

// Locate the customer row using the unique account number
const updatedCustomerRow = page.getByRole('row').filter({
  hasText: createdAccountNumber
});

// Verify the customer row contains the updated first name
await expect(updatedCustomerRow).toContainText('Alexander');

// ========================================================
// STEP 6: Return to Dashboard
// ========================================================

// Navigate back to the Dashboard page
await dashboardPage.goToDashboard();

// Verify the Dashboard is displayed
const branchHeader = await dashboardPage.getBranchHeader();
await expect(branchHeader).toBeVisible();

// ========================================================
// STEP 7: Log Out
// ========================================================

// Log out of the application
await dashboardPage.clickLogout();

// Verify the login screen is displayed
await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

 });

  // Test 3: Delete Customer
test('Delete Customer', async ({ page }) => {

// Initialize the Page Objects
const loginPage = new LoginPage(page);
const customersPage = new CustomersPage(page);

// ========================================================
// STEP 1: Sign In and Navigate to Dashboard Page
// ========================================================

// Navigate to the login page
await loginPage.navigateTo();

// Enter valid credentials
await loginPage.enterCredentials(branchName, loginUser, loginPass);

// Sign in and receive the Dashboard Page Object
const dashboardPage = await loginPage.clickSignIn();

// Verify successful login
const welcomeProfile = await dashboardPage.getWelcomeProfile();
await expect(welcomeProfile).toBeVisible();

// ========================================================
// STEP 2: Navigate to Customers Page
// ========================================================

// Click the "Customers" link in the Dashboard sidebar
await dashboardPage.goToCustomers();

// Verify the Customers page is displayed
const customersHeader = await customersPage.getCustomersHeader();
await expect(customersHeader).toBeVisible();

// Display all customer records
await customersPage.showAllRows();

// ========================================================
// STEP 3: Delete the Customer
// ========================================================

// Locate the customer by the unique account number and click "Delete"
await customersPage.deleteCustomer(createdAccountNumber);

// ========================================================
// STEP 4: Verify Customer Deletion
// ========================================================

// Locate the customer row using the unique account number
const deletedCustomerRow = page.getByRole('row').filter({
  hasText: createdAccountNumber
});

// Verify the customer row is no longer visible
await expect(deletedCustomerRow).not.toBeVisible();

// ========================================================
// STEP 5: Return to Dashboard
// ========================================================

// Navigate back to the Dashboard page
await dashboardPage.goToDashboard();

// Verify the Dashboard is displayed
const branchHeader = await dashboardPage.getBranchHeader();
await expect(branchHeader).toBeVisible();

// ========================================================
// STEP 6: Log Out
// ========================================================

// Log out of the application
await dashboardPage.clickLogout();

// Verify the login screen is displayed
await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();


});

});