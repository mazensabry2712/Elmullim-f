# Elmullim Backend — Architecture & Engineering System

## 1. Scope

This document defines the engineering system for the Laravel backend: API boundaries, authentication, authorization, domain logic, persistence, integrations, testing, security, performance, observability and delivery quality.

## 2. Current Baseline

- Laravel 11
- PHP 8.2+
- Laravel Sanctum
- Pest PHP
- Eloquent ORM
- API Resources
- Form Requests
- Laravel Events/Broadcasting
- Pusher
- Musonza Chat
- Paymob integration
- Vimeo integration
- Image/file storage services

The existing application is a Laravel monolith with role-specific models and controllers for Student, Teacher and Family.

## 3. Core Architectural Principles

### Single Responsibility
Controllers coordinate use cases. They should not become the location for payment rules, authorization rules, external HTTP calls, file manipulation, serialization logic and database orchestration at the same time.

### Explicit Boundaries
Authentication, authorization, domain rules, persistence, external integrations and presentation must have identifiable boundaries.

### Backend Authority
The backend is the authoritative source for identity, permissions, ownership, prices, enrollment, payment state and other security-sensitive decisions.

### Transactional Integrity
Any operation spanning multiple database writes or external side effects must have an explicit consistency strategy.

### Observable Behavior
Important business operations must be auditable through structured logs/events without leaking secrets or sensitive personal data.

## 4. Recommended Layering

```text
HTTP / Routes
    ↓
Form Requests / Authentication / Authorization
    ↓
Application Use Cases
    ↓
Domain Services / Policies / Rules
    ↓
Repositories / Eloquent Models
    ↓
Database

External Integrations live behind dedicated adapters:
Paymob / Mail / Storage / Vimeo / Realtime
```

The project does not need an academic DDD implementation everywhere. Boundaries should be introduced where business complexity or change frequency justifies them.

## 5. Feature Ownership

Features should be organized around business capabilities, for example:

- Auth
- Users / Profiles
- Education Catalog
- Courses
- Lessons
- Enrollments
- Quizzes
- Ratings
- Chat
- Payments
- Wallet / Payouts
- Notifications

A feature should own its requests, actions/use cases, policies, resources, validation rules, domain services and tests where practical.

## 6. Authentication

The system uses Sanctum tokens with separate guards/providers for the current role-specific models.

Authentication lifecycle must be explicit:

1. unauthenticated
2. authenticated
3. authenticated but unverified
4. authenticated and verified
5. authenticated but restricted where business rules require it

Verification and password-reset tokens/codes must be bound to the intended account and purpose.

Authentication must not be inferred from user-controlled role values.

## 7. Authorization

Authorization must be resource-aware.

Examples:

- a teacher may update/delete only courses they own
- a teacher may update/delete only lessons they own
- a student may enroll only in eligible resources
- chat mutations require verified participation/ownership rules
- payment state transitions require server-side ownership and provider verification

Policies and explicit ownership queries should be preferred over scattered controller checks.

## 8. API Design

All public API routes should follow a documented versioning and naming convention.

Responses should have a consistent envelope and documented error schema.

List endpoints should support predictable pagination and bounded filtering.

Path parameters and request values must be validated before database work.

Search and filtering should execute primarily in the database, not by loading unbounded datasets into PHP memory.

## 9. Requests & Validation

Form Requests are the default home for input validation and request authorization.

Inline validators may be used only for very small internal cases where a dedicated request would add no clarity.

Business invariants are not replaced by validation rules. Validation answers whether input has the right shape; domain rules answer whether the action is allowed.

## 10. Application Services / Actions

Use cases that coordinate multiple models or integrations should live in dedicated action/service classes.

Examples:

- RegisterStudent
- VerifyEmail
- RequestPasswordReset
- ResetPassword
- CreateCourse
- PublishCourse
- EnrollStudent
- InitiatePayment
- ConfirmPayment
- SendChatMessage
- RequestTeacherPayout

## 11. Payments

Payment amount, currency, orderable ownership and payable state must be derived or verified server-side.

Gateway callbacks/webhooks must be authenticated cryptographically according to provider requirements before changing payment state.

Payment state changes must be idempotent and protected by database invariants.

Provider credentials must live in configuration/environment secret management.

External payment communication should be isolated behind a `PaymentGateway`/adapter boundary.

## 12. Verification & Password Reset

Verification records must be scoped by user, purpose, expiry and single-use status.

Codes should use cryptographically appropriate random generation.

Verification attempts should have rate limits and abuse controls.

Email delivery should be queued rather than blocking authentication requests.

## 13. Realtime / Chat

REST APIs and realtime events are separate boundaries.

Broadcast channels must have explicit authorization rules.

Realtime event payloads should be typed and minimal.

Chat operations should use policies/services where ownership or participant rules are non-trivial.

Image attachments must have a hardened upload policy and lifecycle consistency with database state.

## 14. Database & Persistence

Database constraints are part of business correctness.

Use foreign keys, unique constraints, indexes and checkable invariants where appropriate.

Large collections should be paginated or chunked.

Queries should avoid accidental N+1 behavior and excessive relationship loading.

Deletion strategy must be explicit for every aggregate: cascade, restrict, soft delete or domain cleanup.

## 15. Resources & Serialization

API Resources are presentation boundaries only.

They should not perform heavy queries, chat lookups, business decisions or external storage work during serialization.

Relationships needed by resources should be loaded deliberately by the application layer.

Sensitive fields such as private contact information must be intentionally classified as public/private.

## 16. External Services

External services must be isolated behind adapters/services with:

- configuration from environment
- timeouts
- bounded retries where safe
- translated exceptions
- structured logging
- test doubles/fakes

Examples: Paymob, mail provider, image storage, Vimeo, Pusher.

## 17. Testing System

Every bug fix requires a regression test.

Every business use case requires feature tests for success and failure paths.

Critical authorization boundaries require negative tests for incorrect roles and ownership.

Critical payment flows require provider-verification tests, idempotency tests and replay/invalid-signature tests.

Chat requires authorization, attachment and realtime-related coverage.

Unit tests are for pure domain logic. Feature tests are the primary level for API behavior.

## 18. Test Categories

```text
Unit
→ domain rules, value transformations, pure services

Feature
→ HTTP endpoints, authentication, authorization, database behavior

Integration
→ external adapters with fakes/stubs where appropriate

Contract
→ API response/request contracts where needed

Architecture
→ dependency/boundary rules for critical modules
```

## 19. Quality Gates

Before a change is considered complete:

```text
php artisan test
php artisan pint --test
php artisan route:list
php artisan config:clear
php artisan optimize
```

Static analysis should be introduced and enforced as the project grows.

Critical CI gates must include tests and static quality checks.

## 20. Security Rules

- Never hardcode provider credentials.
- Never trust client-provided price or authorization metadata.
- Never accept verification codes without binding them to the intended account/purpose.
- Never treat UI role checks as security boundaries.
- Validate payment callbacks cryptographically.
- Apply rate limits to sensitive endpoints.
- Validate and sanitize uploaded files according to the actual threat model.
- Avoid exposing private contact data through public resources.
- Never log access tokens, provider keys or sensitive authentication codes.

## 21. Performance Rules

Performance must be measured from query counts, response time, memory and payload size.

Avoid loading full user tables for search.

Avoid serializing the same relationships repeatedly.

Use pagination and indexes for growing collections.

Move slow mail/external operations to queues.

Cache stable reference data where appropriate.

## 22. Error Handling

The API should expose a documented error contract.

Validation, authentication, authorization, not-found, conflict, rate-limit and unexpected server errors should be distinguishable.

Unexpected exceptions should be handled centrally while preserving contextual logs.

## 23. Git & Change Management

One logical change per commit.

Commit names should follow a consistent conventional style.

Bug fixes include regression tests.

Large refactors should be split into independently verifiable steps.

## 24. Bug-Fix Workflow

```text
Reproduce
→ write failing test
→ fix
→ focused test
→ related suite
→ full suite
→ static checks
→ production-readiness checks
→ documentation
→ commit
```

## 25. Definition of Done

A backend change is complete only when applicable behavior, authorization, validation, error handling, tests, performance impact, security implications and documentation have been reviewed and the required quality gates pass.
