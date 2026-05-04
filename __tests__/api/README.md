# API Test Cases

This directory contains API endpoint test cases for the Plant Care Reminder application.

## Test Cases

### TC-API-01: POST /plants - Create plant successfully
- **Preconditions**: Authenticated user with valid token
- **Test Steps**: POST /api/v1/plants with plant data
- **Expected Result**: 201 Created, plant ID generated and returned, data persisted in database

### TC-API-02: GET /plants - Fetch plants
- **Preconditions**: User has 5 plants
- **Test Steps**: GET /api/v1/plants with auth token
- **Expected Result**: 200 OK, returns array of 5 plants

## Running Tests

```bash
# Run all API tests
pnpm test __tests__/api

# Run specific test
pnpm test __tests__/api/TC-API-01.test.ts
```
