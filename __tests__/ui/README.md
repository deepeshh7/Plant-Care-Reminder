# UI Responsiveness Tests

## TC-UI-01: Full website responsiveness

### Test Overview
This test suite validates the responsiveness of the website across different devices and screen sizes.

### Preconditions
- App is accessible
- Development server is running

### Test Steps
1. Test app on desktop and tablet viewports
2. Check pages, menus, forms, and cards

### Expected Results
- Layout adapts across breakpoints
- No horizontal overflow
- Navigation & UI elements remain usable
- Website fully responsive across devices

### Test Cases Covered

#### ✅ Landing Page Responsiveness (3 tests)
1. **Desktop (1920x1080)** - Full layout with all elements visible
2. **Tablet (768x1024)** - Adapted layout for medium screens
3. **Navigation usability** - All viewports have accessible navigation

#### ✅ Sign In Page Responsiveness (3 tests)
1. **Desktop form layout** - Full-width form with proper spacing
2. **Tablet form layout** - Centered form with adapted sizing
3. **Form input sizing** - Inputs properly sized across viewports

#### ✅ Cards and Components (2 tests)
1. **Desktop card layout** - Cards displayed in grid
2. **No overflow** - Cards don't cause horizontal scrolling

#### ✅ Navigation Menu (1 test)
1. **Desktop navigation** - Full navigation menu visible

#### ✅ Breakpoint Transitions (2 tests)
1. **Viewport resize** - Smooth transitions between breakpoints
2. **Functionality maintained** - All features work across sizes

#### ✅ Text and Content (1 test)
1. **Readable text** - Font sizes appropriate for each viewport

#### ✅ Images and Media (1 test)
1. **Responsive images** - Images scale properly without overflow

### Test Results
```
Test Suites: 1 passed
Tests:       13 passed
Viewports:   Desktop (1920x1080), Tablet (768x1024)
```

### Running the Tests

#### Prerequisites
```bash
# Install Playwright browsers (first time only)
npx playwright install chromium
```

#### Run UI tests
```bash
pnpm test:ui
```

#### Run with browser visible
```bash
pnpm test:ui:headed
```

#### Debug mode
```bash
pnpm test:ui:debug
```

#### Run specific test
```bash
pnpm test:ui TC-UI-01
```

### Test Configuration

**File**: `playwright.config.ts`

```typescript
{
  testDir: './__tests__/ui',
  baseURL: 'http://localhost:3000',
  projects: [
    { name: 'Desktop Chrome', viewport: { width: 1920, height: 1080 } },
    { name: 'Tablet', viewport: { width: 1024, height: 768 } }
  ]
}
```

### Viewports Tested

| Device | Width | Height | Description |
|--------|-------|--------|-------------|
| Desktop | 1920px | 1080px | Full HD desktop |
| Tablet | 1024px | 768px | iPad Pro landscape |

### What We Check

#### No Horizontal Overflow
- Page width doesn't exceed viewport width
- No horizontal scrollbars appear
- Content stays within bounds

#### Usable Navigation
- All navigation elements are visible
- Buttons and links are clickable
- Menu items are accessible

#### Responsive Forms
- Input fields are properly sized
- Forms don't overflow viewport
- Submit buttons are accessible

#### Adaptive Cards
- Cards resize appropriately
- Grid layouts adapt to screen size
- No content is cut off

#### Readable Text
- Font sizes are appropriate
- Text doesn't overflow containers
- Headings are properly sized

#### Responsive Images
- Images scale to fit viewport
- No image causes overflow
- Aspect ratios are maintained

### CI/CD Integration

UI tests run separately from unit tests:

```yaml
- name: Run unit tests
  run: pnpm test

- name: Run UI tests
  run: pnpm test:ui
```

### Notes

- UI tests require a running development server
- Playwright automatically starts the dev server
- Tests run in headless mode in CI/CD
- Screenshots captured on failure
- Tests are excluded from Jest runs

### Troubleshooting

#### Dev server not starting
```bash
# Manually start dev server
pnpm dev

# In another terminal, run tests
pnpm test:ui
```

#### Browser not installed
```bash
npx playwright install chromium
```

#### Tests timing out
```bash
# Increase timeout in playwright.config.ts
timeout: 60000
```

### Best Practices

1. **Test real user scenarios** - Focus on actual user interactions
2. **Check multiple viewports** - Ensure responsiveness across sizes
3. **Verify no overflow** - Always check for horizontal scrolling
4. **Test interactive elements** - Ensure buttons and links work
5. **Keep tests fast** - Use efficient selectors and waits
6. **Screenshot failures** - Automatically captured for debugging

### Future Enhancements

- [ ] Add more page tests (dashboard, plants, schedules)
- [ ] Test form submissions
- [ ] Test navigation flows
- [ ] Add accessibility tests
- [ ] Test dark mode responsiveness
- [ ] Add performance metrics

---

**Last Updated**: November 2024  
**Test Framework**: Playwright  
**Status**: ✅ All Tests Passing
