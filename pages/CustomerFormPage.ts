// Import the necessary types from the Playwright testing framework
import { Page, Locator } from '@playwright/test';

// Define and export our blueprint class for the Add Customer form screen
export class CustomerFormPage {

      // ==========================================
  // 1. PROPERTIES (Declaring the form locators)
  // ==========================================

    private page: Page;
    private pageHeader: Locator;
    private accountNumberInput: Locator;
    private titleDropdown: Locator;
    private firstNameInput: Locator;
    private lastNameInput: Locator;
    private streetInput: Locator;
    private cityInput: Locator;
    private provinceDropdown: Locator;
    private postalCodeInput: Locator;
    private phoneInput: Locator;
    private emailInput: Locator;
    private saveButton: Locator;
    private saveAndAddAnotherButton: Locator;
    private cancelButton: Locator;

    // ==========================================
// 2. CONSTRUCTOR (Wiring up the form fields and buttons)
// ==========================================

constructor(page: Page) {
  this.page = page;

  // Smart Locator: Dynamically targets the main page heading whether it's "Add Customer" or "Edit Customer"
  this.pageHeader = page.locator('h1, h2, .main-heading');

    // Wire up the customer account number and name fields
    this.accountNumberInput = page.getByLabel('Account #:*');
    this.firstNameInput = page.getByLabel('First Name:*');
    this.lastNameInput = page.getByLabel('Last Name:*');

    // Wire up the customer address fields
    this.streetInput = page.getByLabel('Street:');
    this.cityInput = page.getByLabel('City:');
    this.postalCodeInput = page.getByLabel('Postal Code:');

    // Wire up the customer contact fields
    this.phoneInput = page.getByLabel('Phone:');
    this.emailInput = page.getByLabel('Email:');

    // Wire up the Title and Province dropdown elements
    this.titleDropdown = page.getByLabel('Title:');
    this.provinceDropdown = page.getByLabel('Province:');

    // Smart Locator: Matches "Save" OR "Save changes" automatically using a Regular Expression
    this.saveButton = page.getByRole('button', { name: /^Save( changes)?$/i });

    // Wire up the "Save & Add another" button
    this.saveAndAddAnotherButton = page.getByRole('button', { name: 'Save & Add another' });

    // Flexible Locator: Handles "Cancel" button whether rendered as a button or direct anchor link
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).or(page.getByRole('link', { name: 'Cancel', exact: true }));
        
 }

 // ==========================================
// 3. METHODS (Actions performed on the Customer form)
// ==========================================

/**
 * Helper method to populate all text fields and dropdown selections on the form.
 * This prevents repeating the .fill() steps across different click actions.
 */
private async fillFormFields(details: {
  accountNumber?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
}) {

// We use conditional checks so we can safely reuse this method for partial Updates/Edits
if (details.accountNumber !== undefined) await this.accountNumberInput.fill(details.accountNumber);
if (details.firstName !== undefined) await this.firstNameInput.fill(details.firstName);
if (details.lastName !== undefined) await this.lastNameInput.fill(details.lastName);
if (details.street !== undefined) await this.streetInput.fill(details.street);
if (details.city !== undefined) await this.cityInput.fill(details.city);
if (details.postalCode !== undefined) await this.postalCodeInput.fill(details.postalCode);
if (details.phone !== undefined) await this.phoneInput.fill(details.phone);
if (details.province !== undefined) await this.provinceDropdown.selectOption({ label: details.province });
if (details.title !== undefined) await this.titleDropdown.selectOption({ label: details.title });
if (details.email !== undefined) await this.emailInput.fill(details.email);
}
/**
 * Action: Fills out the entire customer creation form and clicks the standard "Save" button
 */
async createCustomerAndSave(details: any) {
  await this.fillFormFields(details);
  await this.saveButton.click();
}

/**
 * Action: Fills out the entire customer creation form and clicks "Save & Add another"
 * to clear the form and submit data without leaving the screen.
 */
async createCustomerAndAddAnother(details: any) {
  await this.fillFormFields(details);
  await this.saveAndAddAnotherButton.click();
}

/**
 * Action: Fills out the entire form and then clicks the Cancel button.
 */
async createCustomerAndCancel(details: any) {
  await this.fillFormFields(details);
  await this.cancelButton.click();
}

// Modifies existing customer fields and clicks "Save changes"
async updateCustomerDetails(updatedDetails: any) {
  await this.fillFormFields(updatedDetails);
  await this.saveButton.click();
}

/**
 * Action: Clicks the "Cancel" button to abort customer creation and exit the form.
 */
async clickCancel() {
  await this.cancelButton.click();
}

// Data Provider: Hands the header element back to the test for verification checks
async getPageHeader() {
  return this.pageHeader;
}
}
