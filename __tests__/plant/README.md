# Plant Module Tests

## TC-Plant-01: Add a new plant to the catalog

### Test Overview
This test suite validates the functionality of adding a new plant to the user's catalog.

### Preconditions
- User is logged in
- Database is accessible

### Test Steps
1. Navigate to 'Add Plant'
2. Upload a plant photo
3. Enter plant name and select a species suggestion

### Expected Results
- The new plant appears in the user's catalog with the correct details
- Plant record created with unique ID
- Photo stored successfully
- Default schedule generated (if applicable)

### Test Cases Covered

#### ✅ Core Functionality (12 tests)
1. **should create a new plant with valid data** - Verifies basic plant creation
2. **should store plant with correct details** - Validates all plant fields are saved correctly
3. **should store plant photo URL** - Ensures image URL is stored
4. **should set isDeleted to false by default** - Verifies soft delete flag
5. **should create plant with timestamps** - Checks createdAt and updatedAt
6. **should appear in user catalog after creation** - Confirms plant is queryable
7. **should allow optional fields to be null** - Tests optional field handling
8. **should create plant with unique ID for each plant** - Validates ID uniqueness
9. **should associate plant with correct user** - Verifies user relationship
10. **should validate required fields** - Tests validation for required fields
11. **should handle long plant names** - Tests edge case with long strings
12. **should handle special characters in plant name** - Tests special character handling

### Test Results
```
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Time:        ~20s
```

### Running the Tests

#### Run all plant tests:
```bash
pnpm test __tests__/plant
```

#### Run specific test:
```bash
pnpm test __tests__/plant/TC-Plant-01.test.ts
```

#### Run with coverage:
```bash
pnpm test:coverage __tests__/plant
```

### Database Schema
The test validates the following Plant model fields:
- `id` (String, unique, auto-generated)
- `name` (String, required)
- `species` (String, optional)
- `imageUrl` (String, optional)
- `location` (String, optional)
- `acquisitionDate` (DateTime, optional)
- `notes` (String, optional)
- `userId` (String, required, foreign key)
- `isDeleted` (Boolean, default: false)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

### CI/CD Integration
These tests run automatically in the CI/CD pipeline on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

The tests must pass for the build to succeed.

### Notes
- Tests use a separate test database
- Test data is cleaned up after each test
- Tests run in band (sequentially) to avoid database conflicts
- All tests are isolated and can run independently
