# CI/CD Pipeline Documentation

## Overview

This CI/CD pipeline automates testing, building, and deployment of the Plant Care Reminder application using GitHub Actions.

## Pipeline Structure

### Workflow Triggers
- **Push**: Runs on `main` and `develop` branches
- **Pull Request**: Runs on PRs targeting `main` and `develop`
- **Manual**: Can be triggered via `workflow_dispatch`

### Jobs

#### 1. Code Quality & Linting
- Runs ESLint to check code quality
- Performs TypeScript type checking
- Checks code formatting (if Prettier is configured)
- **Fails if**: Linting or type errors are found

#### 2. Security Audit
- Runs `pnpm audit` to check for vulnerable dependencies
- Checks for outdated packages
- **Continues on error**: Won't block the pipeline

#### 3. Database Schema Validation
- Spins up PostgreSQL test database
- Validates Prisma schema
- Generates Prisma Client
- Runs database migrations
- **Fails if**: Schema is invalid or migrations fail

#### 4. Run Tests
- Runs all test suites with PostgreSQL database
- Uploads test results and coverage
- **Requires**: Database and code-quality jobs to pass
- **Fails if**: Any tests fail

#### 5. Build Application
- Installs dependencies
- Generates Prisma Client
- Builds Next.js application
- Uploads build artifacts
- **Requires**: Code quality, security, and database jobs to pass
- **Fails if**: Build fails

#### 6. Deploy to Staging
- Downloads build artifacts
- Deploys to staging environment
- Runs smoke tests
- **Triggers**: Only on push to `develop` branch
- **Requires**: Test and build jobs to pass

#### 7. Deploy to Production
- Downloads build artifacts
- Deploys to production environment
- Creates deployment tag
- Runs production smoke tests
- **Triggers**: Only on push to `main` branch
- **Requires**: Test and build jobs to pass

#### 8. Post-Deployment Validation
- Validates deployment success
- Generates deployment report
- **Triggers**: After production deployment

## Environment Variables

### Required for CI/CD
```yaml
DATABASE_URL: PostgreSQL connection string
NEXTAUTH_URL: Application URL
NEXTAUTH_SECRET: NextAuth secret key
```

### Optional (for deployment)
```yaml
VERCEL_TOKEN: Vercel deployment token
VERCEL_ORG_ID: Vercel organization ID
VERCEL_PROJECT_ID: Vercel project ID
```

## GitHub Secrets Setup

Add these secrets in your repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VERCEL_TOKEN` (if using Vercel)
   - `DATABASE_URL` (production database)
   - `NEXTAUTH_SECRET` (production secret)

## Deployment Configuration

### Staging Environment
- **Branch**: `develop`
- **URL**: https://staging.yourapp.com
- **Auto-deploy**: Yes

### Production Environment
- **Branch**: `main`
- **URL**: https://yourapp.com
- **Auto-deploy**: Yes
- **Protection**: Requires approval (configure in GitHub)

## Local Testing

### Run all checks locally before pushing:

```bash
# Install dependencies
pnpm install

# Run linting
pnpm run lint

# Run type checking
pnpm run type-check

# Generate Prisma Client
pnpm prisma generate

# Run tests (when Jest is configured)
pnpm test

# Build application
pnpm run build
```

## Setting Up Jest (Optional)

The test files exist but Jest is not installed. To enable testing:

```bash
# Install Jest and dependencies
pnpm add -D jest @jest/globals ts-jest @types/jest

# Create jest.config.js
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
};
EOF

# Update package.json scripts
# Replace the test script with:
# "test": "jest",
# "test:watch": "jest --watch",
# "test:coverage": "jest --coverage"
```

## Troubleshooting

### Pipeline Fails on Linting
```bash
# Fix linting issues locally
pnpm run lint --fix
```

### Pipeline Fails on Type Checking
```bash
# Check types locally
pnpm run type-check
```

### Pipeline Fails on Build
```bash
# Test build locally
pnpm run build
```

### Database Migration Issues
```bash
# Check migration status
pnpm prisma migrate status

# Create new migration
pnpm prisma migrate dev --name your_migration_name
```

## Customization

### Adding New Jobs

Add a new job in `.github/workflows/ci-cd.yml`:

```yaml
your-job-name:
  name: Your Job Name
  runs-on: ubuntu-latest
  needs: [previous-job]  # Optional dependencies
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    # Add your steps here
```

### Modifying Deployment

Update the deployment steps in `deploy-staging` or `deploy-production` jobs:

```yaml
- name: Deploy to Vercel
  run: |
    npx vercel deploy --token=${{ secrets.VERCEL_TOKEN }} --prod
```

## Best Practices

1. **Always test locally** before pushing
2. **Keep secrets secure** - never commit them
3. **Use feature branches** for development
4. **Create PRs** for code review before merging
5. **Monitor pipeline** failures and fix promptly
6. **Keep dependencies updated** regularly

## Support

For issues with the CI/CD pipeline:
1. Check the Actions tab in GitHub
2. Review the job logs for errors
3. Ensure all secrets are configured
4. Verify database connectivity

## Status Badges

Add these to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci-cd.yml/badge.svg)
```
