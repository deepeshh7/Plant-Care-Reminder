# Test Suite Documentation

## Structure

```
__tests__/
├── auth/                    # Authentication module tests
│   ├── signup.test.ts      # User registration tests
│   ├── login.test.ts       # User login tests
│   └── password-reset.test.ts  # Password reset tests
├── setup.ts                # Global test setup and utilities
└── README.md              # This file
```

## Test Cases

### Auth Module

#### TC-Auth-01: Successful user registration and login
- **Preconditions**: User is on the registration page
- **Steps**: Enter valid email and strong password → Submit form → Log in with new credentials
- **Expected**: User successfully registered and logged into dashboard
- **Postconditions**: User account created, session active, user logged in

#### TC-Auth-02: Attempt registration with existing email
- **Preconditions**: Account with 'test@example.com' already exists
- **Steps**: Attempt to register with 'test@example.com'
- **Expected**: Error message "Email already in use" is displayed
- **Postconditions**: No duplicate account created, error displayed, user on registration page

#### TC-Auth-03: Password reset via email
- **Preconditions**: Valid user account exists
- **Steps**: Click "Forgot Password" → Enter email: test@example.com → Submit request
- **Expected**: Password hash updated in database; old password invalidated
- **Postconditions**: Old password invalidated, new password saved in database

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test __tests__/auth/signup.test.ts

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test suite
pnpm test -- --testNamePattern="TC-Auth-01"
```

## Test Results

All 34 tests passing:
- ✅ signup.test.ts: 15 tests
- ✅ login.test.ts: 8 tests  
- ✅ password-reset.test.ts: 11 tests

## Adding New Test Modules

1. Create a new folder under `__tests__/` for your module (e.g., `__tests__/payments/`)
2. Create test files following the naming convention: `*.test.ts`
3. Import test utilities from `setup.ts`
4. Follow the existing test structure and documentation format

## Best Practices

- Keep tests isolated and independent
- Use descriptive test names that explain what is being tested
- Clean up test data in `afterEach` hooks
- Use meaningful assertions
- Document preconditions and postconditions
- Group related tests using `describe` blocks
