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

  test('should auto-reveal adjacent cells (flood fill) when clicking empty cell', async ({ page }) => {
    await page.getByText(/Principiante/).click();
    
    // Count initially revealed cells (should be 0)
    let revealedCells = await page.locator('button.w-10.h-10.bg-gray-300').count();
    expect(revealedCells).toBe(0);
    
    // Click a cell - if it's empty (0 neighbors), it should trigger flood fill
    // We'll click multiple cells until we find an empty one that triggers flood fill
    const cells = await page.locator('button.w-10.h-10').all();
    
    let foundFloodFill = false;
    for (let i = 0; i < Math.min(cells.length, 20); i++) {
      const cell = cells[i];
      await cell.click();
      
      // Wait a bit for the reveal animation
      await page.waitForTimeout(100);
      
      // Count revealed cells
      revealedCells = await page.locator('button.w-10.h-10.bg-gray-300').count();
      
      // If more than 1 cell was revealed, we found flood fill
      if (revealedCells > 1) {
        foundFloodFill = true;
        break;
      }
      
      // Reset for next attempt
      await page.getByText('Reiniciar partida').click();
      await page.getByText(/Principiante/).click();
    }
    
    // Verify that flood fill occurred at least once
    expect(foundFloodFill).toBe(true);
    expect(revealedCells).toBeGreaterThan(1);
  });
});

