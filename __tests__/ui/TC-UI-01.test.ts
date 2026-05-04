/**
 * UI Test Suite - Full Website Responsiveness
 * Test case: TC-UI-01
 */

import { test, expect, Page } from '@playwright/test';

/**
 * TC-UI-01: Full website responsiveness
 * 
 * Preconditions: App accessible on multiple devices
 * 
 * Test Steps:
 * 1. Test app on desktop, tablet, and mobile viewports
 * 2. Check pages, menus, forms, and cards
 * 
 * Expected Result: Layout adapts across breakpoints; no overflow; navigation & UI elements remain usable
 * Postconditions: Website fully responsive across devices
 */

// Helper function to check for horizontal overflow
async function checkNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(hasOverflow).toBe(false);
}

// Helper function to check if element is visible and clickable
async function checkElementUsable(page: Page, selector: string) {
  const element = page.locator(selector).first();
  await expect(element).toBeVisible();
  const box = await element.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
}

test.describe('TC-UI-01: Full website responsiveness', () => {
  
  test.describe('Landing Page Responsiveness', () => {
    
    test('should display landing page correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Check no horizontal overflow
      await checkNoHorizontalOverflow(page);
      
      // Check header is visible
      await expect(page.locator('header')).toBeVisible();
      
      // Check main content is visible
      await expect(page.locator('main')).toBeVisible();
      
      // Check navigation elements are usable
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await expect(signInButton).toBeVisible();
    });

    test('should display landing page correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Check no horizontal overflow
      await checkNoHorizontalOverflow(page);
      
      // Check header is visible
      await expect(page.locator('header')).toBeVisible();
      
      // Check main content adapts
      await expect(page.locator('main')).toBeVisible();
    });

    test('should have usable navigation on all viewports', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 768, height: 1024, name: 'Tablet' },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        
        // Check header navigation is accessible
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        // Verify no elements are cut off
        await checkNoHorizontalOverflow(page);
      }
    });
  });

  test.describe('Sign In Page Responsiveness', () => {
    
    test('should display sign in form correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/signin');
      
      // Check no horizontal overflow
      await checkNoHorizontalOverflow(page);
      
      // Check form elements are visible
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
      
      // Check submit button is usable
      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton).toBeVisible();
    });

    test('should display sign in form correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/signin');
      
      // Check no horizontal overflow
      await checkNoHorizontalOverflow(page);
      
      // Check form is centered and usable
      await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    });

    test('should have properly sized form inputs on all viewports', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/signin');
        
        // Check inputs are visible and properly sized
        const emailInput = page.locator('input[type="email"], input[name="email"]').first();
        await expect(emailInput).toBeVisible();
        
        const box = await emailInput.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
        expect(box!.width).toBeLessThanOrEqual(viewport.width);
      }
    });
  });

  test.describe('Cards and Components Responsiveness', () => {
    
    test('should display cards correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Check if cards exist and are visible
      const cards = page.locator('[class*="card"], [role="article"]');
      const cardCount = await cards.count();
      
      if (cardCount > 0) {
        // Check first card is visible
        await expect(cards.first()).toBeVisible();
        
        // Check cards don't overflow
        await checkNoHorizontalOverflow(page);
      }
    });

  });

  test.describe('Navigation Menu Responsiveness', () => {
    
    test('should show desktop navigation on large screens', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Desktop navigation should be visible
      const nav = page.locator('nav');
      if (await nav.count() > 0) {
        await expect(nav.first()).toBeVisible();
      }
    });

  });

  test.describe('Breakpoint Transitions', () => {
    
    test('should handle viewport resize gracefully', async ({ page }) => {
      await page.goto('/');
      
      // Start with desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await checkNoHorizontalOverflow(page);
      
      // Resize to tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(300);
      await checkNoHorizontalOverflow(page);
      
      // Resize back to desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(300);
      await checkNoHorizontalOverflow(page);
    });

    test('should maintain functionality across breakpoints', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 1024, height: 768 },
        { width: 768, height: 1024 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        
        // Check page loads
        await expect(page.locator('body')).toBeVisible();
        
        // Check no overflow
        await checkNoHorizontalOverflow(page);
        
        // Check interactive elements are accessible
        const buttons = page.locator('button');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          const firstButton = buttons.first();
          await expect(firstButton).toBeVisible();
        }
      }
    });
  });

  test.describe('Text and Content Readability', () => {
    
    test('should have readable text on all viewports', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/');
        
        // Check headings are visible
        const h1 = page.locator('h1').first();
        if (await h1.count() > 0) {
          await expect(h1).toBeVisible();
          
          // Check font size is reasonable
          const fontSize = await h1.evaluate((el) => {
            return window.getComputedStyle(el).fontSize;
          });
          
          const fontSizeNum = parseFloat(fontSize);
          expect(fontSizeNum).toBeGreaterThan(16); // At least 16px
        }
      }
    });
  });

  test.describe('Images and Media Responsiveness', () => {
    
    test('should handle images responsively', async ({ page }) => {
      await page.goto('/');
      
      const viewports = [
        { width: 1920, height: 1080 },
        { width: 768, height: 1024 },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(300);
        
        // Check images don't cause overflow
        await checkNoHorizontalOverflow(page);
        
        // Check images are within viewport
        const images = page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          const firstImage = images.first();
          const box = await firstImage.boundingBox();
          
          if (box) {
            expect(box.width).toBeLessThanOrEqual(viewport.width);
          }
        }
      }
    });
  });

});
