import { test, expect } from '@playwright/test';

test.describe('Minesweeper Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the game and show level selector', async ({ page }) => {
    await expect(page.getByText('Seleccione Nivel')).toBeVisible();
    await expect(page.getByText(/Principiante/)).toBeVisible();
  });

  test('should start game when level is selected', async ({ page }) => {
    await page.getByText(/Principiante/).click();
    // Check if board is visible (grid of cells)
    const cells = await page.locator('button.w-10.h-10').all();
    expect(cells.length).toBe(81); // 9x9 board
    // Lives are displayed as heart icons, not text
    const hearts = await page.locator('svg.text-red-500').all();
    expect(hearts.length).toBeGreaterThan(0);
  });

  test('should reveal cell on click', async ({ page }) => {
    await page.getByText(/Principiante/).click();
    const cell = page.locator('button.w-10.h-10').first();
    await cell.click();
    // Cell should change style (bg-gray-300)
    await expect(cell).toHaveClass(/bg-gray-300/);
  });

  test('should flag cell on right click', async ({ page }) => {
    await page.getByText(/Principiante/).click();
    const cell = page.locator('button.w-10.h-10').first();
    await cell.click({ button: 'right' });
    // Should show flag icon (SVG)
    await expect(cell.locator('svg.text-red-600')).toBeVisible();
  });

  test('should reset game', async ({ page }) => {
    await page.getByText(/Principiante/).click();
    const cell = page.locator('button.w-10.h-10').first();
    await cell.click();
    
    await page.getByText('Reiniciar partida').click();
    // resetGame sets level to null, so we should see the level selector again
    await expect(page.getByText('Seleccione Nivel')).toBeVisible();
  });
});

