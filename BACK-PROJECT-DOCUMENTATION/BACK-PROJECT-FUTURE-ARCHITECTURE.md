# Elmullim Backend — Future Scalable Architecture

## 1. Objective

This is the target architecture for an Elmullim backend that grows from the current Laravel monolith into a large, multi-feature education platform without prematurely introducing microservices.

The target is a modular Laravel monolith with strong feature boundaries, explicit application use cases, isolated integrations, strict authorization, scalable persistence and comprehensive automated tests.

## 2. Target Shape

```text
app/
├── Application/
├── Domain/
├── Infrastructure/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   ├── Resources/
│   └── Middleware/
└── Providers/

modules/ or app/Modules/
├── Auth/
├── Users/
├── Education/
├── Courses/
├── Lessons/
├── Enrollments/
├── Quizzes/
├── Ratings/
├── Chat/
├── Payments/
├── Wallet/
├── Notifications/
└── Administration/
```

The exact physical directory can be chosen during migration. The important rule is ownership by business capability.

## 3. Module Template

Each mature module should converge toward:

```text
ModuleName/
├── Domain/
│   ├── Models/
│   ├── Enums/
│   ├── ValueObjects/
│   ├── Policies/
│   ├── Rules/
│   └── Events/
├── Application/
│   ├── Actions/
│   ├── Commands/
│   ├── Queries/
│   └── DTOs/
├── Infrastructure/
│   ├── Persistence/
│   ├── Integrations/
│   └── Jobs/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
└── Tests/
```

Not every small feature needs every folder. Structure follows complexity.

## 4. Dependency Direction

The long-term dependency direction is:

```text
HTTP / Presentation
        ↓
Application
        ↓
Domain
        ↑
Infrastructure
```

Domain rules must not depend on controllers, HTTP requests, vendor SDKs or framework-specific presentation concerns.

Infrastructure implements contracts required by application/domain code.

## 5. Authentication Model

The current role-specific models can be stabilized first and gradually moved toward a clearer identity model.

Preferred long-term concept:

```text
Identity / User
     ↓
Role assignments / capabilities
     ↓
Student / Teacher / Parent profile data
```

The exact database design is an architectural decision to be made after the current contracts and migration history are fully understood. The goal is to avoid duplicating identical authentication behavior across separate controllers forever.

## 6. Authorization Model

Authorization should converge on policies and capabilities rather than controller-local checks.

Examples:

```text
CoursePolicy
LessonPolicy
ConversationPolicy
MessagePolicy
PaymentPolicy
PayoutPolicy
```

Ownership should be expressed directly in policy/query boundaries.

## 7. Application Use Cases

Controllers should become thin adapters to explicit use cases.

Examples:

```text
RegisterAccount
AuthenticateAccount
VerifyAccountEmail
RequestPasswordReset
ResetPassword
UpdateProfile
CreateCourse
UpdateCourse
DeleteCourse
CreateLesson
EnrollStudent
InitiatePayment
ConfirmPayment
SendMessage
DeleteMessage
HideConversation
CreatePayout
```

Each use case gets focused tests and a clear input/output contract.

## 8. Queries and Commands

As read/write complexity grows, separate intent:

```text
Queries
→ read-only data retrieval
→ filtering/pagination
→ resources/DTOs

Commands/Actions
→ state changes
→ transactions
→ domain events
```

This is a gradual evolution, not an immediate CQRS rewrite.

## 9. Persistence Strategy

Large collections must use:

- pagination
- indexes
- constrained eager loading
- database-side filtering
- selective columns
- cursor pagination where appropriate
- background processing for expensive work

Search should have a dedicated strategy once basic database search stops being sufficient. A search engine should only be introduced when real scale/requirements justify it.

## 10. Payments Architecture

Introduce a gateway abstraction:

```text
PaymentService
      ↓
PaymentGateway contract
      ↓
PaymobAdapter
FutureGatewayAdapter...
```

Payment state should be modeled explicitly:

```text
created
pending
authorized
paid
failed
cancelled
refunded
```

Gateway events must be idempotent, authenticated and persisted for audit/reconciliation.

Financial calculations should use exact monetary representations and explicit policies rather than controller-local arithmetic.

## 11. Async Processing

Slow or failure-prone work should move to queues:

```text
Email
External API calls
Media processing
Notifications
Large imports/exports
Payment reconciliation
Report generation
```

Jobs must be idempotent or have explicit retry/recovery behavior.

## 12. Events

Domain/application events should be introduced for important state changes:

```text
StudentEnrolled
PaymentConfirmed
CoursePublished
MessageSent
EmailVerified
PayoutRequested
```

Listeners should handle side effects that do not need to block the main request.

## 13. Realtime Architecture

Realtime should consume domain/application events instead of embedding broadcasting logic deeply inside controllers.

```text
Use Case
   ↓
Domain/Application Event
   ↓
Listener
   ↓
Broadcast Event
   ↓
Pusher/Echo
```

Channel authorization remains explicit and policy-driven.

## 14. API Versioning

Large-scale evolution should use an explicit API version boundary:

```text
/api/v1/...
/api/v2/...
```

Breaking changes require a versioning/migration strategy rather than silently changing the current contract.

## 15. DTOs and API Contracts

Internal application DTOs may be used to prevent controllers and services from passing unstructured arrays across many layers.

Public API Resources remain presentation contracts.

Critical request/response contracts should have automated tests.

## 16. Validation Strategy

Keep three separate concepts:

```text
Input validation
→ shape and basic constraints

Authorization
→ who may perform the action

Domain invariants
→ whether the state transition is valid
```

Never rely on one layer to perform another layer's job.

## 17. File and Media Architecture

Media operations should converge on a storage abstraction:

```text
MediaService
      ↓
Storage contract
      ↓
Local / S3 / other provider
```

The database record and physical file lifecycle must have a defined consistency strategy.

## 18. Observability

Future production observability should include:

- structured application logs
- request correlation IDs
- queue/job monitoring
- payment reconciliation logs
- authentication/security events
- error reporting
- performance metrics
- database/query monitoring

Sensitive credentials and personal data must never be logged casually.

## 19. Testing Pyramid

```text
Many
├── Unit / domain tests
├── Feature/API tests
├── Integration tests
└── Fewer high-value E2E/contract tests
```

Every bug gets a regression test.

Every critical authorization path gets negative tests.

Every payment state transition gets security/idempotency tests.

High-value modules should have contract tests to protect frontend/backend integration.

## 20. Static Analysis

The mature project should enforce:

```text
Pint
PHPStan or Larastan
Pest
Architecture tests
Dependency/security auditing
```

Static analysis should become stricter as technical debt is reduced.

## 21. Database Evolution

All schema changes are migration-driven.

Large production migrations must be backward-compatible where possible.

Destructive operations require explicit migration planning and data review.

Indexes and constraints are reviewed as data volume increases.

## 22. Caching

Caching should be introduced by measured need.

Suitable candidates include:

- countries
- education systems
- categories
- other stable reference data
- expensive read models

Cache invalidation belongs to the application workflow that changes the source data.

## 23. Security Evolution

The backend must progressively enforce:

```text
secure secret management
strict auth boundaries
policy-based authorization
rate limiting
request validation
file-upload hardening
payment webhook verification
audit logging
least privilege
```

Security-sensitive behavior must be covered by automated tests.

## 24. Module Boundaries and Ownership

A mature feature should be understandable without searching the entire application.

Cross-module access should happen through explicit contracts/use cases rather than reaching into another module's internal classes and tables whenever possible.

Shared code should be genuinely shared infrastructure, not a dumping ground.

## 25. Migration Strategy

Do not perform a big-bang rewrite.

Use:

```text
Stabilize current behavior
        ↓
Add tests around existing contracts
        ↓
Extract one use case
        ↓
Introduce one module boundary
        ↓
Move related tests
        ↓
Migrate dependent code
        ↓
Delete old path
        ↓
Repeat
```

Priority should follow risk and business value:

1. payment/security/authentication
2. authorization/ownership
3. core courses/lessons/enrollment
4. chat/realtime
5. performance-heavy queries
6. documentation and cleanup

## 26. When Not to Split into Microservices

Stay modular monolith unless there is a concrete reason such as:

- independent scaling requirements
- independent deployment requirements
- team ownership boundaries
- infrastructure isolation requirements
- operational reasons backed by measured system constraints

A clean modular monolith is preferable to distributed complexity without a real need.

## 27. Future Operational Model

```text
Developer
  ↓
PR
  ↓
CI
  ├── dependency install
  ├── Pint
  ├── static analysis
  ├── tests
  ├── architecture checks
  └── security checks
  ↓
Review
  ↓
Deploy
  ↓
Migrations / health checks
  ↓
Monitoring
```

## 28. Definition of Future Architectural Success

The architecture is considered successful when:

- business modules have clear ownership
- authorization is centralized and testable
- payment operations are secure and idempotent
- expensive operations are asynchronous where appropriate
- queries remain bounded as data grows
- external vendors are replaceable behind adapters
- APIs can evolve without uncontrolled breaking changes
- tests protect critical business behavior
- developers can change one feature without understanding the entire codebase

## 29. Non-Negotiable Future Rules

1. Backend authorization remains authoritative.
2. Client input never determines protected business facts such as price or permission.
3. Security-sensitive callbacks require authenticity verification.
4. Every bug fix adds a regression test.
5. Every financial operation is auditable and idempotent.
6. Large collections are never allowed to grow through unbounded memory-based processing.
7. External services are isolated behind integration boundaries.
8. Domain/business rules do not live only inside controllers.
9. Architecture evolves incrementally; no uncontrolled rewrite.
10. Complexity must be earned by real requirements and measured scale.
