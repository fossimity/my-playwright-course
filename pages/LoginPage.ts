import { Page, Locator } from '@playwright/test';
import { DashboardPage } from './DashboardPage'; // New: Required for Fluent Interface

export class LoginPage {
  // 1. PROPERTIES: The class remembers the page context and ALL UI elements
  private page: Page;
  private branchInput: Locator;
  private userInput: Locator;
  private passwordInput: Locator;
  private signInButton: Locator;
  private welcomeBanner: Locator;

  // 2. CONSTRUCTOR: The electrical breaker box that hooks up the 'page' ONCE
  constructor(page: Page) {
    this.page = page;

    this.branchInput = page.getByLabel('Branch Name*');
    this.userInput = page.getByLabel('User Name*');
    this.passwordInput = page.getByLabel('Password*');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.welcomeBanner = page.getByRole('main');
  }

  // 3. METHODS: Pure actions and data providers only. No assertions!
  async navigateTo() {
    await this.page.goto('login');
  }

  async enterCredentials(branch: string, user: string, pass: string) {
    await this.branchInput.fill(branch);
    await this.userInput.fill(user);
    await this.passwordInput.fill(pass);
  }

  async clickSignIn(): Promise<DashboardPage> {
  await this.signInButton.click();

  // Instantiate and return the next page object, passing the live browser context
  return new DashboardPage(this.page); // New: Required for Fluent Interface
  }

  async getWelcomeBanner() {
    return this.welcomeBanner;
  }
}