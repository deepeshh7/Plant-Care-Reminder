# Schedule Module Tests

## TC-Sched-01: Create a recurring watering schedule

### Test Overview
This test suite validates the functionality of creating a recurring watering schedule for a plant.

### Preconditions
- User is logged in
- User has added a plant
- Database is accessible

### Test Steps
1. Select the plant
2. Set a watering schedule for every 3 days

### Expected Results
- A notification is scheduled to trigger every 3 days for that plant
- Schedule task created
- Notification queued
- Appears in calendar

### Test Cases Covered

#### ✅ Core Functionality (16 tests)
1. **should create a watering schedule for every 3 days** - Verifies basic schedule creation
2. **should set correct frequency of 3 days** - Validates frequency field
3. **should set schedule as active by default** - Checks isActive flag
4. **should set isDeleted to false by default** - Verifies soft delete flag
5. **should store time of day correctly** - Validates time format (HH:MM)
6. **should set nextDueDate for notification scheduling** - Ensures notification timing
7. **should appear in calendar/schedule list** - Confirms schedule is queryable
8. **should associate schedule with correct plant** - Verifies plant relationship
9. **should create schedule with timestamps** - Checks createdAt and updatedAt
10. **should allow optional notes field** - Tests notes storage
11. **should create schedule without notes** - Tests optional field handling
12. **should support different task types** - Validates WATERING and FERTILIZING
13. **should support different frequencies** - Tests various day intervals
14. **should validate required fields** - Tests validation for required fields
15. **should create multiple schedules for same plant** - Tests multiple schedules
16. **should store startDate correctly** - Validates start date storage

### Test Results
```
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
Time:        ~32s
```

### Running the Tests

#### Run all schedule tests:
```bash
pnpm test __tests__/schedule
```

#### Run specific test:
```bash
pnpm test __tests__/schedule/TC-Sched-01.test.ts
```

#### Run with coverage:
```bash
pnpm test:coverage __tests__/schedule
```

### Database Schema
The test validates the following CareSchedule model fields:
- `id` (String, unique, auto-generated)
- `plantId` (String, required, foreign key)
- `taskType` (Enum: WATERING | FERTILIZING, required)
- `frequencyDays` (Int, required, minimum 1)
- `timeOfDay` (String, required, format: HH:MM)
- `startDate` (DateTime, required)
- `nextDueDate` (DateTime, required)
- `notes` (String, optional)
- `isActive` (Boolean, default: true)
- `isDeleted` (Boolean, default: false)
- `createdAt` (DateTime, auto-generated)
- `updatedAt` (DateTime, auto-generated)

### Schedule Behavior
- **Frequency**: Determines how often the task repeats (in days)
- **Time of Day**: Specific time when notification should be sent (HH:MM format)
- **Next Due Date**: Calculated date/time for next notification
- **Active Status**: Schedule can be paused/resumed via isActive flag
- **Task Types**: 
  - WATERING: Regular watering reminders
  - FERTILIZING: Fertilizing reminders

### Notification System
When a schedule is created:
1. `nextDueDate` is set based on `startDate` and `frequencyDays`
2. Cron job checks for due schedules
3. Notifications sent via email/push based on user preferences
4. After notification, `nextDueDate` is updated by adding `frequencyDays`

### CI/CD Integration
These tests run automatically in the CI/CD pipeline on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

The tests must pass for the build to succeed.

### Notes
- Tests use a separate test database
- Test data (user, plant, schedule) is cleaned up after each test
- Tests run in band (sequentially) to avoid database conflicts
- All tests are isolated and can run independently
- Multiple schedules can exist for the same plant (e.g., watering + fertilizing)
