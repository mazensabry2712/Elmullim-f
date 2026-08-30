# Elmullim Frontend — Architecture & Engineering System

## 1. Purpose

This document defines the architecture, engineering rules, testing strategy, debugging workflow, quality gates, and delivery standards for the Elmullim frontend.

The goal is to keep the application maintainable, secure, testable, predictable, and production-ready as the codebase grows.

---

## 2. Technology Baseline

- React + TypeScript
- Vite
- React Router
- Redux Toolkit for application state that genuinely needs global state
- TanStack React Query for server state and API data
- React Hook Form + Zod for forms and validation
- Axios as the HTTP client
- Laravel Echo + Pusher for realtime communication
- Tailwind CSS for UI styling
- Vitest for unit/integration tests
- React Testing Library for UI behavior tests
- MSW for API mocking in tests
- Playwright for browser/E2E tests
- ESLint + TypeScript compiler as static quality gates

---

## 3. Architectural Principles

### 3.1 Separation of Responsibilities

Components are responsible for presentation and user interaction.

Pages are responsible for composing features and page-level behavior.

Services are responsible for HTTP/API communication.

React Query is responsible for server-state fetching, caching, retries, and synchronization.

Redux is reserved for true client/application state and must not become a duplicate API cache.

Utilities contain reusable pure logic and infrastructure helpers.

Routing contains navigation structure and access boundaries, not business logic.

### 3.2 Single Responsibility

A component, service, hook, or utility should have one clear reason to change.

Large components containing unrelated UI, API, realtime, state, and business logic should be decomposed when touched.

### 3.3 Explicit Contracts

Types and interfaces describe expected contracts.

Runtime validation is required at trust boundaries where malformed or unexpected server data can affect application behavior.

### 3.4 Security Boundaries

The browser is an untrusted environment.

Client-side role checks are UX/navigation guards only and must never be treated as authoritative authorization.

Secrets must never be placed in browser bundles or tracked environment files.

Authentication authority belongs to the backend/session mechanism.

---

## 4. State Management Rules

### Server State

Use TanStack React Query for:

- authenticated user data
- courses
- lessons
- conversations
- API resources
- mutations and request lifecycle
- server cache and invalidation

### Client State

Use Redux Toolkit only when state is genuinely application-wide and not server-owned.

Examples include UI/application state that must be shared across unrelated components.

### Local State

Use React `useState`, `useReducer`, and component-local hooks for local UI concerns.

### Cookies / Storage

Storage is not an authorization source.

Tokens, roles, reset state, and other authentication-sensitive values must follow the application's secure authentication contract and must not be duplicated unnecessarily across independent client stores.

---

## 5. API Layer Rules

All HTTP communication must go through the centralized API layer.

Service functions should not duplicate infrastructure concerns unnecessarily.

Authorization transport should be standardized instead of manually repeated in every service call.

Query parameters must be encoded using URL-safe APIs rather than manual string concatenation.

API responses crossing a trust boundary must be validated when the response shape is security- or behavior-critical.

HTTP error handling must use the Axios error shape consistently.

Global interceptors may handle truly global concerns only; endpoint-specific errors must remain endpoint-specific.

---

## 6. Authentication & Authorization Rules

Authentication and authorization are separate concerns.

Authentication answers: "Who is this user?"

Authorization answers: "Is this user allowed to perform this action?"

The frontend may prevent accidental navigation with protected-route guards, but the backend remains authoritative for permissions.

Authentication state must have a clear lifecycle:

1. unknown/checking
2. authenticated
3. unauthenticated
4. authenticated but restricted/unverified where applicable

The application must avoid having multiple independent sources of truth for the same authentication state.

Session validation must not run unnecessarily on every route transition.

Requests associated with a component lifecycle should be cancellable where practical.

---

## 7. Routing Architecture

Routes are divided conceptually into:

- public routes
- authentication routes
- protected authenticated routes
- role-restricted routes
- system/error routes

Route naming must follow one consistent convention.

Route paths are application contracts and should not be duplicated as unexplained string literals throughout unrelated components.

Unauthorized access must be represented separately from a missing route.

Route-level failures should have explicit error handling rather than silently falling through to unrelated pages.

---

## 8. Realtime Architecture

Realtime functionality must be isolated from normal REST API concerns.

Echo/Pusher instances must have a controlled lifecycle.

Authentication credentials used by realtime connections must remain synchronized with the current session.

A feature may leave or unsubscribe from channels it owns; it must not globally destroy unrelated subscriptions.

Realtime listeners must always have cleanup logic.

Events must be typed rather than relying on unrestricted `any` where practical.

Logging in realtime production code must not expose unnecessary identifiers or sensitive payloads.

---

## 9. UI & Component Architecture

Prefer small reusable components over very large feature files.

A component should avoid mixing:

- API implementation
- realtime connection management
- complex business rules
- unrelated UI sections
- global state mutations

Shared UI patterns should be extracted only when reuse or consistency justifies the abstraction.

Accessibility is part of correctness:

- semantic HTML
- accessible labels
- keyboard interaction
- visible focus states
- meaningful button/link semantics
- alternative text for meaningful images
- appropriate error messaging

---

## 10. Forms & Validation

Forms use React Hook Form for state/lifecycle where appropriate and Zod for schema validation.

Validation behavior must be tested for:

- required fields
- invalid values
- boundary values
- valid values
- server-side validation errors
- submit/loading states
- duplicate submission prevention where applicable

User-facing errors must be understandable and consistent.

---

## 11. Testing Strategy

Every bug fix requires a regression test.

Every meaningful feature requires tests appropriate to its behavior.

### Unit Tests — Vitest

Used for:

- pure utilities
- transformations
- mapping functions
- validation helpers
- state-independent business logic
- type contracts where useful

### Component Tests — Vitest + React Testing Library

Used for:

- rendering
- user interaction
- validation
- loading states
- success/error states
- navigation behavior
- conditional UI

Tests should assert user-visible behavior rather than implementation details.

### Integration Tests — Vitest + React Testing Library + MSW

Used for complete feature-level behavior involving components, hooks, React Query, and mocked HTTP APIs.

Examples:

- login
- registration
- password reset
- profile update
- course operations
- lesson operations
- chat actions

### E2E Tests — Playwright

Used for critical browser journeys:

- authentication
- role-based navigation
- course enrollment
- protected pages
- profile flows
- critical chat flows
- important production journeys

E2E tests should represent real user behavior, not internal function calls.

---

## 12. Bug-Fix Workflow

No bug is considered fixed only because the code compiles.

The mandatory workflow is:

```text
Identify problem
      ↓
Reproduce problem
      ↓
Write regression test
      ↓
Confirm test fails when possible
      ↓
Implement fix
      ↓
Run focused test
      ↓
Run related tests
      ↓
Run full test suite
      ↓
Run lint/type checks
      ↓
Run production build
      ↓
Document the change
      ↓
Commit
```

A test must protect the behavior that was previously broken.

Tests must not be weakened merely to make an implementation pass.

---

## 13. Feature Development Workflow

For a new feature:

```text
Requirement
   ↓
Acceptance criteria
   ↓
Architecture/design decision
   ↓
Test cases
   ↓
Implementation
   ↓
Focused tests
   ↓
Integration tests
   ↓
E2E test when the flow is critical
   ↓
Lint + TypeScript
   ↓
Production build
   ↓
Documentation
```

---

## 14. Quality Gates

A change is considered complete only when applicable gates pass:

```text
npm run test:run
npm run build
npm run lint
npx playwright test
```

Not every change requires a full E2E run locally, but all critical production flows must be covered by Playwright and must pass in CI before release.

Coverage is a quality indicator, not the only quality criterion.

Critical paths have higher priority than chasing an arbitrary global percentage.

---

## 15. Dependency Management

Dependencies must be compatible with the project's React, TypeScript, and Vite versions.

Do not bypass dependency conflicts with `--force` or `--legacy-peer-deps` unless there is a documented and explicitly accepted reason.

Security advisories must be reviewed before applying automated upgrades.

Lockfile changes must accompany dependency changes.

Unused dependencies should be removed when identified.

---

## 16. Environment & Secrets

Tracked source control must never contain real secrets.

Browser-exposed `VITE_*` values are public configuration, not secrets.

`.env` files containing local or private configuration must not be committed unless the project explicitly requires a safe template file such as `.env.example`.

Production secrets belong in the backend/deployment secret-management mechanism.

Any secret that has already been exposed must be treated as compromised and reviewed accordingly.

---

## 17. Error Handling & Observability

Errors must be handled at the correct layer.

Global errors should have global handling.

Feature-specific errors should remain feature-specific.

Production code should not depend on `alert`, `window.confirm`, or scattered console logging for normal UX.

User-facing notifications should be consistent.

Unexpected errors should provide a safe fallback UI without leaking internal implementation details.

---

## 18. Performance Rules

Performance work should be evidence-driven.

Large bundles, repeated requests, unnecessary rerenders, duplicated data fetching, oversized component modules, and unoptimized assets must be reviewed when identified.

Lazy loading should be used for meaningful route/feature boundaries.

Large static assets must not be unnecessarily embedded into JavaScript source.

Network requests must not be repeated because of avoidable effect dependencies or duplicated ownership.

---

## 19. SEO & Metadata

Public pages should have meaningful page-level metadata where SEO is relevant.

Document language and direction must match the application's intended locale.

Titles and descriptions should accurately represent each public page.

SEO behavior is part of the production acceptance criteria for public pages.

---

## 20. Internationalization

User-facing strings should not be scattered as hardcoded text when the application requires multiple locales.

Locale selection and persistence must be consistent.

Role-independent UI text should come from the localization layer when i18n is introduced.

Translations must not alter business rules or API contracts.

---

## 21. Git & Repository Hygiene

Commits should describe one logical change.

Commit messages should use a consistent convention.

Do not commit generated build artifacts unless intentionally required.

Do not commit environment secrets.

Avoid mixing unrelated fixes in the same commit.

Before pushing:

```text
working tree clean
↓
tests pass
↓
build passes
↓
commit has clear scope
```

---

## 22. CI/CD Strategy

CI must eventually enforce at minimum:

1. install dependencies from the lockfile
2. TypeScript/build validation
3. lint
4. unit/component/integration tests
5. coverage reporting
6. critical E2E tests

A pull request must not be considered mergeable when mandatory quality gates fail.

---

## 23. Documentation Strategy

`PROJECT-DOCUMENTATION/PROJECT-ISSUES/all-issues.md` is the high-level issue inventory.

`PROJECT-DOCUMENTATION/PROJECT-ISSUES/issues-details.md` contains the detailed explanation of discovered issues without implementation solutions unless explicitly requested.

This architecture document defines the engineering rules used while resolving those issues.

Implemented fixes should be accompanied by tests and a clear commit.

---

## 24. Definition of Done

A task is Done only when all applicable conditions below are satisfied:

- behavior is implemented or corrected
- relevant tests exist
- regression test exists for every bug fix
- focused tests pass
- full test suite passes
- TypeScript/build passes
- lint passes
- critical E2E flow passes where applicable
- no known regression was introduced
- security implications were reviewed
- documentation/issue status was updated
- commit has a clear scope

---

## 25. Non-Negotiable Rules

1. Never hide a bug with a type cast when the underlying contract is wrong.
2. Never weaken a test just to make CI pass.
3. Never treat client-side authorization as backend authorization.
4. Never place secrets in frontend bundles.
5. Never silently ignore failed API operations.
6. Never introduce duplicated sources of truth for authentication without a clear reason.
7. Never add a dependency when existing project infrastructure can safely solve the problem.
8. Never merge a bug fix without a regression test.
9. Never declare the project healthy based only on a successful production build.
10. Prefer small, verifiable changes that can be tested and reviewed independently.
