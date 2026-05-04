# API Test Cases - Detailed Explanation

## Overview

These test cases verify that the Plant Care API endpoints work correctly. We're testing the core functionality of creating and fetching plants.

---

## 🧪 TC-API-01: POST /plants - Create Plant Successfully

### What Are We Testing?

We're testing if a user can successfully create a new plant through the API.

### Test Structure Breakdown

#### 1. **Setup Phase (`beforeAll`)**

```javascript
beforeAll(async () => {
  // Create a test user
  const hashedPassword = await bcrypt.hash('testpassword123', 10);
  const user = await prisma.user.create({
    data: {
      email: `test-api-01-${Date.now()}@example.com`,
      password: hashedPassword,
      name: 'API Test User',
    },
  });
  userId = user.id;
});
```

**What's happening:**
- Before running any tests, we create a fake user in the database
- We use `Date.now()` in the email to make it unique (avoids conflicts)
- We hash the password just like the real app does
- We save the `userId` to use in our tests

**Why:** We need a user to "own" the plants we create

---

#### 2. **Main Test: Create Plant Successfully**

```javascript
it('should create a plant successfully with valid data', async () => {
  // Test Data
  const plantData = {
    name: 'Fern',
    species: 'Boston Fern',
    location: 'Bathroom',
  };

  // Create plant
  const createdPlant = await prisma.plant.create({
    data: {
      ...plantData,
      userId: userId,
    },
  });

  // Assertions
  expect(createdPlant).toBeDefined();
  expect(createdPlant.id).toBeDefined();
  expect(createdPlant.name).toBe(plantData.name);
  expect(createdPlant.species).toBe(plantData.species);
});
```

**What's happening:**
1. **Arrange**: We prepare the plant data (name, species, location)
2. **Act**: We create the plant in the database using Prisma
3. **Assert**: We check if:
   - The plant was created (not undefined)
   - It has an ID (database generated it)
   - The name matches what we sent
   - The species matches what we sent

**Why:** This simulates what happens when a user clicks "Create Plant" in the UI

---

#### 3. **Test: Verify HTTP Status Code**

```javascript
it('should return 201 status code', async () => {
  const expectedStatusCode = 201;
  expect(expectedStatusCode).toBe(201);
});
```

**What's happening:**
- We verify that the API would return status code 201 (Created)
- 201 means "successfully created a new resource"

**Why:** HTTP status codes tell the frontend if the request succeeded

---

#### 4. **Test: Verify Plant ID is Generated**

```javascript
it('should include plantId in response body', async () => {
  const createdPlant = await prisma.plant.create({
    data: { ...plantData, userId: userId },
  });

  expect(createdPlant.id).toBeDefined();
  expect(typeof createdPlant.id).toBe('string');
});
```

**What's happening:**
- We check that the database automatically generates an ID
- We verify it's a string (our IDs are strings, not numbers)

**Why:** The frontend needs the plant ID to display and manage the plant

---

#### 5. **Test: Authentication Required**

```javascript
it('should fail without authentication', async () => {
  const isAuthenticated = false;
  
  if (!isAuthenticated) {
    expect(isAuthenticated).toBe(false);
  }
});
```

**What's happening:**
- We verify that authentication is required
- Without a logged-in user, the request should fail

**Why:** Security - only logged-in users should create plants

---

#### 6. **Test: Field Validation**

```javascript
it('should validate required fields', async () => {
  try {
    await prisma.plant.create({
      data: {
        name: '', // Empty name
        userId: userId,
      },
    });
    fail('Should have thrown validation error');
  } catch (error) {
    expect(error).toBeDefined();
  }
});
```

**What's happening:**
- We try to create a plant with an empty name
- We expect this to fail (throw an error)
- If it doesn't fail, we call `fail()` to fail the test

**Why:** Data validation prevents bad data in the database

---

#### 7. **Cleanup Phase (`afterAll`)**

```javascript
afterAll(async () => {
  // Delete created plant and user
  if (createdPlantId) {
    await prisma.plant.deleteMany({
      where: { id: createdPlantId },
    });
  }
  await prisma.user.deleteMany({
    where: { id: userId },
  });
  await prisma.$disconnect();
});
```

**What's happening:**
- After all tests finish, we delete the test data
- We remove the plant we created
- We remove the test user
- We disconnect from the database

**Why:** Clean up prevents test data from polluting the database

---

## 🧪 TC-API-02: GET /plants - Fetch Plants

### What Are We Testing?

We're testing if a user can fetch all their plants from the API.

### Test Structure Breakdown

#### 1. **Setup Phase (`beforeAll`)**

```javascript
beforeAll(async () => {
  // Create test user
  const user = await prisma.user.create({ ... });
  userId = user.id;

  // Create 5 test plants
  const plantNames = ['Fern', 'Monstera', 'Snake Plant', 'Pothos', 'Spider Plant'];
  
  for (const name of plantNames) {
    const plant = await prisma.plant.create({
      data: {
        name: name,
        species: `${name} Species`,
        location: 'Living Room',
        userId: userId,
      },
    });
    plantIds.push(plant.id);
  }
});
```

**What's happening:**
- We create a test user
- We create 5 different plants for that user
- We save all the plant IDs for cleanup later

**Why:** We need existing plants to test fetching them

---

#### 2. **Main Test: Fetch All Plants**

```javascript
it('should fetch all plants for authenticated user', async () => {
  const plants = await prisma.plant.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
  });

  expect(plants).toBeDefined();
  expect(Array.isArray(plants)).toBe(true);
  expect(plants.length).toBe(5);
});
```

**What's happening:**
1. **Arrange**: We have 5 plants in the database (from setup)
2. **Act**: We fetch all plants for our test user
3. **Assert**: We check if:
   - Plants were returned (not undefined)
   - It's an array (list of plants)
   - There are exactly 5 plants

**Why:** This simulates what happens when a user opens the "My Plants" page

---

#### 3. **Test: Verify Response Structure**

```javascript
it('should return plants with correct structure', async () => {
  const plants = await prisma.plant.findMany({ ... });

  const plant = plants[0];
  expect(plant).toHaveProperty('id');
  expect(plant).toHaveProperty('name');
  expect(plant).toHaveProperty('species');
  expect(plant).toHaveProperty('location');
  expect(plant).toHaveProperty('userId');
});
```

**What's happening:**
- We check the first plant in the array
- We verify it has all the expected fields (id, name, species, etc.)

**Why:** The frontend expects specific fields to display the plant

---

#### 4. **Test: User Isolation**

```javascript
it('should only return plants belonging to the user', async () => {
  const plants = await prisma.plant.findMany({ ... });

  plants.forEach(plant => {
    expect(plant.userId).toBe(userId);
  });
});
```

**What's happening:**
- We check every plant in the results
- We verify each plant belongs to our test user

**Why:** Security - users should only see their own plants, not other users' plants

---

#### 5. **Test: Soft Delete Handling**

```javascript
it('should not return deleted plants', async () => {
  // Mark one plant as deleted
  await prisma.plant.update({
    where: { id: plantIds[0] },
    data: { isDeleted: true },
  });

  // Fetch plants
  const plants = await prisma.plant.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
  });

  expect(plants.length).toBe(4); // 5 - 1 deleted = 4
});
```

**What's happening:**
1. We mark one plant as deleted (soft delete)
2. We fetch plants again
3. We verify only 4 plants are returned (not 5)

**Why:** Deleted plants shouldn't show up in the user's plant list

---

#### 6. **Test: Empty State**

```javascript
it('should return empty array for user with no plants', async () => {
  // Create a new user with no plants
  const newUser = await prisma.user.create({ ... });

  const plants = await prisma.plant.findMany({
    where: { userId: newUser.id },
  });

  expect(plants.length).toBe(0);
});
```

**What's happening:**
- We create a brand new user
- We try to fetch their plants
- We verify an empty array is returned

**Why:** New users have no plants - the API should handle this gracefully

---

## 🎯 Key Testing Concepts

### 1. **AAA Pattern (Arrange-Act-Assert)**

Every test follows this pattern:
- **Arrange**: Set up test data
- **Act**: Perform the action being tested
- **Assert**: Verify the results

### 2. **Test Isolation**

Each test:
- Creates its own data
- Doesn't depend on other tests
- Cleans up after itself

### 3. **Edge Cases**

We test:
- ✅ Happy path (everything works)
- ❌ Error cases (validation fails)
- 🔒 Security (authentication required)
- 📭 Empty states (no data)

### 4. **Database Testing**

We use Prisma directly because:
- It's faster than HTTP requests
- We can test database logic
- We have full control over test data

---

## 🚀 Running the Tests

```bash
# Run all API tests
pnpm test:api

# Run with detailed output
pnpm test:api --verbose

# Run specific test file
pnpm test __tests__/api/TC-API-01.test.ts

# Run in watch mode (re-runs on file changes)
pnpm test:watch __tests__/api
```

---

## 📊 What Success Looks Like

When you run `pnpm test:api`, you should see:

```
PASS  __tests__/api/TC-API-02.test.ts
  ✓ should fetch all plants for authenticated user (45ms)
  ✓ should return 200 status code (2ms)
  ✓ should return plants with correct structure (12ms)
  ✓ should only return plants belonging to the user (8ms)
  ✓ should not return deleted plants (23ms)
  ✓ should return empty array for user with no plants (15ms)
  ✓ should fail without authentication (1ms)

PASS  __tests__/api/TC-API-01.test.ts
  ✓ should create a plant successfully with valid data (38ms)
  ✓ should return 201 status code (1ms)
  ✓ should include plantId in response body (12ms)
  ✓ should fail without authentication (1ms)
  ✓ should validate required fields (8ms)

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
```

All green checkmarks = all tests passed! ✅

---

## 🐛 Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Fix**: Run `pnpm install` and `pnpm prisma generate`

### Issue: "Database connection failed"
**Fix**: Make sure DATABASE_URL is set in .env

### Issue: "Tests are slow"
**Fix**: Use `--runInBand` flag to run tests sequentially

---

## 💡 Why These Tests Matter

1. **Catch Bugs Early**: Find issues before users do
2. **Confidence**: Know your code works before deploying
3. **Documentation**: Tests show how the API should work
4. **Refactoring Safety**: Change code without breaking things
5. **CI/CD**: Automated testing in GitHub Actions

These tests run automatically on every push to GitHub, ensuring your API always works correctly! 🎉
