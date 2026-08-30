# Elmullim Frontend — Future Architecture

## 1. Purpose

This document defines the target architecture for Elmullim as the platform grows into a large, multi-feature educational product.

The target is a feature-based modular frontend that keeps business domains isolated, minimizes shared coupling, separates server state from client state, and allows gradual migration without a full rewrite.

This is the **future target architecture**. The existing codebase does not need to be moved to this structure all at once.

---

## 2. Target Architecture

```text
src/
├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── layouts/
│   ├── providers/
│   ├── router/
│   └── store/
│
├── features/
│   ├── auth/
│   ├── courses/
│   ├── lessons/
│   ├── enrollment/
│   ├── quizzes/
│   ├── chat/
│   ├── profile/
│   ├── events/
│   └── services/
│
├── entities/
│   ├── user/
│   ├── course/
│   ├── lesson/
│   ├── conversation/
│   └── ...
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── lib/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── config/
│
└── tests/
    └── e2e/
```

The exact domain list may grow, but the architectural boundaries should remain stable.

---

## 3. Responsibility of Each Layer

### `app/`

Application composition and infrastructure only:

- application bootstrap
- providers
- router configuration
- global layouts
- global configuration
- global client state setup

`app/` should assemble the application and should not become a business-domain dumping ground.

### `features/`

Business capabilities live here.

Examples:

- authentication
- course browsing and management
- lesson workflows
- enrollment
- quizzes
- chat
- profile management

A feature owns its business behavior, feature-level API functions, hooks, schemas, components, tests, and supporting types where appropriate.

### `entities/`

Stable domain concepts shared by multiple features.

Examples:

- User
- Course
- Lesson
- Conversation

Entities should contain reusable domain representations, not feature-specific workflows.

### `shared/`

Generic infrastructure and reusable UI with no business ownership.

Examples:

- Button
- Modal
- Input
- pagination primitives
- HTTP helpers
- generic utilities
- reusable hooks

`shared/` must not depend on business features.

---

## 4. Dependency Direction

The preferred dependency direction is:

```text
app
 ↓
features
 ↓
entities
 ↓
shared
```

Rules:

- `shared` must never import from `features`.
- `shared` must never import business-specific modules.
- `entities` may depend on `shared` but should not depend on feature implementations.
- `features` may depend on `entities` and `shared`.
- `app` may compose everything.
- A feature should not reach into another feature's internal files unless an explicit public contract allows it.

This direction is intended to prevent circular dependencies and uncontrolled coupling.

---

## 5. Feature Module Shape

A mature feature should normally follow a structure similar to:

```text
features/courses/
├── api/
│   ├── courses.api.ts
│   └── courses.keys.ts
├── components/
├── hooks/
├── schemas/
├── types/
├── utils/
├── __tests__/
└── index.ts
```

Not every feature requires every directory.

Do not create empty layers just to satisfy a template.

The feature should own only what belongs to that feature.

---

## 6. Public Feature API

Each feature should expose a small public surface through `index.ts` where useful.

External modules should prefer importing from the feature's public entry point rather than reaching into internal implementation files.

Example:

```text
features/courses/index.ts
```

This creates an architectural boundary and allows internal structure to evolve without forcing unrelated modules to change.

---

## 7. State Management Strategy

### Server State

Use TanStack React Query for:

- API resources
- authenticated user data
- courses
- lessons
- conversations
- remote lists and details
- mutations
- cache and invalidation

Server state should not be duplicated in Redux without a concrete architectural reason.

### Global Client State

Use Redux Toolkit only for true application-level client state.

Examples may include:

- global UI state
- cross-feature client preferences
- non-server workflow state that genuinely needs centralized coordination

### Local State

Use React local state for component-level concerns.

### URL State

Use router/search parameters for state that naturally belongs in the URL, such as filters, pagination, or shareable navigation state.

### Form State

Use React Hook Form and Zod where appropriate.

---

## 8. Authentication Architecture

Authentication should be treated as a dedicated cross-cutting subsystem rather than as ordinary feature-local state.

Target concepts:

```text
Session
Identity
Authentication status
Authorization capability
Verification status
```

The backend remains the source of truth for identity and authorization.

The frontend may maintain a session model for UX and navigation, but client-controlled role values must never be trusted as authoritative permissions.

Authentication lifecycle should be explicit:

```text
unknown/checking
      ↓
authenticated
      ↓
verified/restricted state where applicable

or

unauthenticated
```

Authentication state should have a single clear source of truth and should not be duplicated across unrelated cookies, Redux flags, and manually derived values without purpose.

---

## 9. API Architecture

The HTTP client is infrastructure.

Feature APIs are business-facing wrappers.

Target shape:

```text
shared/lib/http/
├── client.ts
├── errors.ts
└── interceptors.ts

features/auth/api/
features/courses/api/
features/lessons/api/
features/chat/api/
```

The HTTP layer owns transport concerns.

Feature API modules own endpoint semantics.

Authorization transport should be standardized instead of manually repeated in every service call.

Query parameters must use URL-safe APIs.

Runtime validation should exist at important trust boundaries where malformed API data can cause security, state, or rendering problems.

---

## 10. Realtime Architecture

Realtime functionality should be isolated under the owning feature.

Example:

```text
features/chat/
├── realtime/
│   ├── echo.ts
│   ├── channels.ts
│   └── events.ts
├── api/
├── components/
├── hooks/
└── __tests__/
```

Rules:

- Realtime credentials must follow the current session.
- Each feature may unsubscribe from channels it owns.
- A feature must not globally destroy unrelated subscriptions.
- Listener lifecycle must be explicit.
- Event payloads should be typed.
- Realtime errors should have predictable handling.

---

## 11. Pages and Routing

Pages should become thin composition layers.

A page should primarily:

- choose the feature components to render
- connect route parameters to feature APIs/hooks
- define page-specific composition
- provide page metadata where applicable

Business logic should live inside features.

Routes should remain centralized in `app/router` or a similarly dedicated router boundary.

Routes should be categorized as:

```text
public
        ↓
authentication
        ↓
protected
        ↓
role-restricted
        ↓
system/error
```

Route paths are contracts and should be defined consistently.

---

## 12. Component Strategy

Components should be designed around one responsibility.

Avoid feature components that simultaneously contain:

- REST API implementation
- websocket lifecycle
- complex business rules
- global state coordination
- large unrelated UI sections

When a component becomes difficult to test, review, or reason about, its responsibilities should be separated.

Reuse should be intentional; premature abstraction is discouraged.

---

## 13. Testing Architecture

Testing belongs at multiple levels.

### Unit

```text
feature/__tests__/
```

Use for pure utilities, transformations, validation logic, and deterministic business rules.

### Component

Test user-visible rendering and interactions with React Testing Library.

### Integration

Use Vitest + React Testing Library + MSW for feature flows involving hooks, React Query, and HTTP behavior.

### E2E

Keep browser journeys under:

```text
tests/e2e/
```

Use Playwright for critical production journeys.

Mandatory rule:

> Every bug fix requires a regression test at the lowest level that reliably protects the broken behavior, plus broader tests when the change crosses feature boundaries.

---

## 14. Test Ownership

Tests should normally live close to the feature or behavior they protect.

Examples:

```text
features/auth/__tests__/
features/courses/__tests__/
features/chat/__tests__/
```

Global E2E tests remain centralized because they span the whole application.

This makes feature deletion, migration, and ownership clearer.

---

## 15. Error Handling Architecture

Error ownership follows the same boundaries as responsibility.

```text
HTTP infrastructure errors
        ↓
API/feature interpretation
        ↓
UI behavior
```

Global infrastructure should handle only truly global concerns.

Feature-specific errors belong to the feature.

Unexpected UI failures should have safe fallback rendering.

Normal user feedback should use one consistent notification strategy.

Browser-native `alert()` and `confirm()` should not be the standard application UX.

---

## 16. Performance Architecture

Performance should be designed into module boundaries.

Important rules:

- route-level code should be lazy-loaded where beneficial
- large features should have sensible chunk boundaries
- large assets should remain external assets rather than embedded source strings when possible
- server data should be cached through React Query
- unnecessary refetches should be eliminated
- expensive UI should be split into focused components
- bundle size should be monitored during major changes

Performance decisions should be evidence-driven rather than based solely on assumptions.

---

## 17. Security Architecture

The browser is considered untrusted.

The frontend must never rely on:

- mutable client-side role values as authorization
- exposed encryption keys as secrets
- client-controlled flags as proof of permission

Security-sensitive authentication state should be designed around the backend's session/authentication mechanism.

Environment configuration exposed to the browser must be treated as public configuration.

No real secrets should be tracked in Git.

---

## 18. Internationalization and Locale

Internationalization should be a first-class cross-cutting concern before the platform becomes too large.

Target capabilities:

- centralized locale state
- predictable locale persistence
- translated user-facing strings
- language-aware metadata
- direction support for RTL/LTR interfaces
- locale-independent business logic

Business logic and API contracts must not depend on translated labels.

---

## 19. Accessibility

Accessibility is part of the architecture, not a cleanup phase.

The target system requires:

- semantic HTML
- accessible labels
- keyboard navigation
- focus management
- screen-reader-friendly state changes
- meaningful alternative text
- predictable form errors
- sufficient contrast

Accessibility behavior should be tested for reusable UI primitives and important workflows.

---

## 20. Environment Management

Target environment files:

```text
.env.example
.env.local
```

Private environments must not be tracked.

Browser-exposed configuration must be explicitly treated as public.

Environment validation should happen at application startup/build time for required configuration.

---

## 21. Dependency Strategy

Dependencies should be selected according to platform needs, compatibility, maintenance quality, and bundle impact.

Rules:

- avoid dependencies for problems already solved safely by platform/library primitives
- keep versions compatible with React/Vite/TypeScript
- lock dependency versions through the lockfile
- review security advisories
- remove unused dependencies
- avoid bypassing peer dependency conflicts as a permanent strategy

---

## 22. CI/CD Target

Every pull request should eventually validate:

```text
Install from lockfile
        ↓
Lint
        ↓
TypeScript
        ↓
Unit/component/integration tests
        ↓
Coverage
        ↓
Production build
        ↓
Critical E2E
```

A release should not depend on a developer remembering these checks manually.

---

## 23. Migration Strategy

The existing project must **not** be rewritten in one large migration.

Migration is incremental:

```text
Stabilize current behavior
        ↓
Add regression tests
        ↓
Choose one bounded domain
        ↓
Create target feature module
        ↓
Move logic gradually
        ↓
Keep compatibility during transition
        ↓
Run focused tests
        ↓
Run full suite
        ↓
Remove old implementation
        ↓
Repeat for next domain
```

Preferred migration order is based on risk and coupling, not only file size.

Authentication, courses, lessons, profile, and chat should be treated as independent migration domains.

---

## 24. No Big-Bang Refactor

The following are explicitly discouraged:

- moving the entire repository in one commit
- changing routing, authentication, API, state, and UI architecture simultaneously
- deleting old modules before replacement tests exist
- changing behavior while claiming a task is only a structural migration

Structural refactors should preserve behavior unless behavior change is explicitly part of the task.

---

## 25. Definition of Done for Architectural Migration

A migrated module is considered complete only when:

- target ownership is clear
- dependency direction is respected
- feature boundaries are explicit
- obsolete implementation is removed or intentionally retained with documented reason
- regression tests pass
- integration tests pass where applicable
- build passes
- lint passes
- critical E2E passes where applicable
- documentation reflects the new boundary

---

## 26. Architectural Decision Records

Major architecture decisions should be recorded when they materially affect the project.

Examples:

- authentication strategy
- state ownership decisions
- realtime architecture
- routing conventions
- internationalization strategy
- major dependency selection
- module boundary changes

A future `PROJECT-DOCUMENTATION/ADR/` directory may be introduced for these decisions.

---

## 27. Scaling Principles

As the team and product grow:

- domain ownership should remain clear
- features should be independently understandable
- public module APIs should remain small
- cross-feature communication should be explicit
- global state should remain minimal
- server state should remain server-owned
- tests should move with feature ownership
- architecture should evolve through small documented decisions

The system should support growth in features and developers without requiring every developer to understand the entire repository before safely changing one domain.

---

## 28. Long-Term Goal

The final frontend should behave like a modular product platform rather than a collection of unrelated pages and shared folders.

The intended characteristics are:

```text
Feature ownership
+ Clear boundaries
+ Stable contracts
+ Minimal global state
+ Secure authentication
+ Centralized infrastructure
+ Testable behavior
+ Incremental evolution
+ Observable quality gates
= Scalable Elmullim Frontend
```

This document is the target state toward which future refactoring and new development should move.