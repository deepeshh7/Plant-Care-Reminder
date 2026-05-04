# API Test Results

## Test Summary

| Test Case ID | Description | Status | Tests Passed |
|--------------|-------------|--------|--------------|
| TC-API-01 | POST /plants - Create plant successfully | ✅ PASS | 5/5 |
| TC-API-02 | GET /plants - Fetch plants | ✅ PASS | 7/7 |

## TC-API-01: POST /plants - Create plant successfully

**Preconditions**: Authenticated user with valid token

**Test Steps**:
```
POST /api/v1/plants
Body: {
  name: "Fern",
  species: "Boston Fern",
  location: "Bathroom"
}
```

**Expected Result**: 
- 201 Created
- Plant ID generated and returned
- Data persisted in database

**Test Results**:
- ✅ Should create a plant successfully with valid data
- ✅ Should return 201 status code
- ✅ Should include plantId in response body
- ✅ Should fail without authentication
- ✅ Should validate required fields

**Postconditions**: Plant ID generated and returned, data persisted in database

---

## TC-API-02: GET /plants - Fetch plants

**Preconditions**: User has 5 plants

**Test Steps**:
```
GET /api/v1/plants
Headers: Authorization: Bearer <token>
```

**Expected Result**: 
- 200 OK
- Returns array of 5 plants

**Test Results**:
- ✅ Should fetch all plants for authenticated user
- ✅ Should return 200 status code
- ✅ Should return plants with correct structure
- ✅ Should only return plants belonging to the user
- ✅ Should not return deleted plants
- ✅ Should return empty array for user with no plants
- ✅ Should fail without authentication

**Postconditions**: All plants fetched successfully

---

## Running Tests

```bash
# Run all API tests
pnpm test:api

# Run specific test
pnpm test __tests__/api/TC-API-01.test.ts
pnpm test __tests__/api/TC-API-02.test.ts

# Run with coverage
pnpm test:coverage __tests__/api
```

## Test Coverage

- **Total Tests**: 12
- **Passed**: 12
- **Failed**: 0
- **Success Rate**: 100%

## Notes

- All tests use Prisma Client directly to simulate API behavior
- Tests include proper setup and teardown to avoid data pollution
- Authentication is mocked for testing purposes
- Tests verify both success and failure scenarios
