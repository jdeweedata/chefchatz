# Setup Documentation for ChefChatz

## Overview
This documentation establishes the guidelines and sequence for generating code across the following markdown files:
- 1-initial-prompt.md
- 2-page-routes.md
- 3-auth.md
- 4-userflow.md
- 5-api.md
- 6-testing.md
- 7-deploy.md
- 8-state.md
- 9-mon.md

You are responsible for maintaining consistency and proper structure throughout the implementation of each phase.

## Sequential File Processing Order

### 1. 1-initial-prompt.md
- Complete environment setup and configuration
- Generate initial Next.js 13+ codebase
- Configure Supabase integration
- Set up AI models and recipe generation
- Document brand identity implementation
- Verify ALL implementation steps
- Log completion status

### 2. 2-page-routes.md
- BEGIN ONLY after 1-initial-prompt.md completion
- Implement Next.js App Router structure
- Generate protected and public routes
- Build complete page components
- Implement API routes
- Verify against initial structure
- Log completion status

### 3. 3-auth.md
- START ONLY after 2-page-routes.md completion
- Implement Supabase authentication
- Configure secured routes and policies
- Set up user profiles and preferences
- Verify integration with existing structure
- Log completion status

### 4. 4-userflow.md
- BEGIN ONLY after 3-auth.md completion
- Implement conversation flows
- Set up recipe generation journey
- Create cooking guidance system
- Document user interactions
- Log completion status

### 5. 5-api.md
- BEGIN ONLY after 4-userflow.md completion
- Document all API endpoints
- Define request/response formats
- Specify authentication requirements
- Document rate limiting
- Set up versioning strategy

### 6. 6-testing.md
- BEGIN ONLY after 5-api.md completion
- Set up testing infrastructure
- Implement unit tests
- Create integration tests
- Configure E2E testing
- Document test coverage requirements

### 7. 7-deploy.md
- BEGIN ONLY after 6-testing.md completion
- Configure deployment environments
- Set up CI/CD pipeline
- Document rollback procedures
- Implement backup strategy
- Configure disaster recovery

### 8. 8-state.md
- BEGIN ONLY after 7-deploy.md completion
- Implement state management
- Configure caching strategy
- Set up real-time updates
- Document offline support
- Optimize performance

### 9. 9-mon.md
- BEGIN ONLY after 8-state.md completion
- Set up monitoring stack
- Configure analytics
- Implement logging
- Set up alerting
- Create dashboards

## Important Notice
CAUTION: Avoid operation errors by following sequential order strictly. Each step must be fully completed and verified before proceeding to the next phase.


## Version Control
- Maintain clear commit messages
- Create feature branches for each major implementation
- Document all changes in respective markdown files
- Keep track of completion status

```bash
# Branch Structure
main
├── setup/initial-config
├── feature/page-routes
├── feature/auth-system
└── feature/user-flows

# Commit Convention
feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style updates
refactor: Code refactoring
test: Testing updates
```

## Quality Assurance
- Verify each step thoroughly
- Document any deviations from initial requirements
- Ensure all implementation steps are logged
- Maintain consistent documentation format

## Deployment Pipeline
```yaml
stages:
  - test
  - build
  - deploy

testing:
  stage: test
  script:
    - pnpm install
    - pnpm test
    - pnpm lint

build:
  stage: build
  script:
    - pnpm build

deploy:
  stage: deploy
  script:
    - vercel deploy --prod
```

## Implementation Tracking
```typescript
interface ImplementationStatus {
  initialPrompt: {
    environment: boolean;
    dependencies: boolean;
    database: boolean;
    aiSetup: boolean;
    branding: boolean;
  };
  pageRoutes: {
    appRouter: boolean;
    apiRoutes: boolean;
    components: boolean;
    middleware: boolean;
  };
  authentication: {
    supabase: boolean;
    policies: boolean;
    profiles: boolean;
    security: boolean;
  };
  userFlows: {
    conversation: boolean;
    recipes: boolean;
    guidance: boolean;
    feedback: boolean;
  };
}
```

## Search Criteria
1. Exact error messages
2. Framework versions
3. Recent solutions
4. Best practices
5. Performance impact

## Validation Steps
1. Check multiple sources
2. Verify compatibility
3. Test solutions
4. Document findings
5. Update approach

## Output Requirements
Your responses must:
1. Be clear and concise
2. Include code examples
3. Explain decisions
4. Document progress
5. Note completion status

## Critical Rules
1. NEVER:
   * Skip sequential order
   * Repeat failed solutions
   * Leave phases incomplete
   * Ignore optimization
   * Skip documentation
2. ALWAYS:
   * Follow setup.md order
   * Complete verification
   * Optimize code
   * Document changes
   * Research solutions

## Performance Standards
Maintain these standards:
1. File size < 300 lines
2. Function size < 30 lines
3. Load time < 3 seconds
4. Memory usage optimized
5. Network calls minimized

## Completion Verification
Before marking complete:
1. Test all implementations
2. Verify integrations
3. Check performance
4. Update documentation
5. Log completion status