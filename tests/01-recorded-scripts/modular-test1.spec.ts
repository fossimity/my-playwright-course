import { test } from '@playwright/test';

import { loginToLoanApp, logout } from '../../functions/authFunctions';

test('test', async ({ page }) => {
  
// Call the reusable login function
await loginToLoanApp(page, 'Alamo', 'admin', 'idmitrenko0103');

// Call the reusable logout function
await logout(page);

});