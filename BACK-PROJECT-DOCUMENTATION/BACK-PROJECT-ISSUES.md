# Elmullim Backend — Issue Inventory

## 01 — Backend exposes payment-provider credentials in application source
## 02 — Password/email verification codes are generated with predictable `rand()` values
## 03 — Verification codes are not bound to the authenticated/target user during verification
## 04 — Password-reset codes are not bound to the target account during password reset
## 05 — Email verification code lookup is globally scoped by code/type
## 06 — Password-reset verification lookup is globally scoped by code/type
## 07 — Email-change verification is sent before persisting the new email address
## 08 — Password update writes a new password without explicitly hashing at the controller boundary
## 09 — Login invalidates all existing personal access tokens
## 10 — `check-auth` mixes multiple guards and a generic Sanctum user lookup
## 11 — `hasVerified` middleware relies on the generic `sanctum` guard while routes use separate role guards
## 12 — Global stateful API middleware is enabled for a token-based API without a documented boundary
## 13 — Role-specific guards and providers duplicate the same user abstraction across separate models
## 14 — Repeated authentication logic exists in three role-specific AuthControllers
## 15 — Repeated verification and password-reset logic exists across role-specific controllers
## 16 — Public profile endpoints expose phone, address and email through resources
## 17 — Public user-detail endpoints have no visible authorization boundary
## 18 — Student search loads all students, teachers and families into application memory
## 19 — Search performs filtering with PHP regex instead of database-backed search
## 20 — Search input is converted into a custom regex that expands `%` and `_`
## 21 — Search endpoint has no explicit upper bound on the requested `limit`
## 22 — Several controller queries use relationship collections instead of constrained database queries
## 23 — MainController contains multiple unrelated domains and is becoming a god controller
## 24 — Teacher course update/delete operations are not scoped to the authenticated teacher
## 25 — Teacher lesson update/delete operations are not scoped to the authenticated teacher
## 26 — Teacher course show endpoint can resolve arbitrary course IDs
## 27 — Teacher lesson show endpoint can resolve arbitrary lesson IDs
## 28 — Payment amount is accepted from the client and used for Paymob/order creation
## 29 — Payment ownership and payable amount are not derived from the selected orderable
## 30 — Payment callback does not validate Paymob HMAC signature
## 31 — Payment callback trusts request `success` without cryptographic authenticity validation
## 32 — Payment callback uses request order/id values before verifying gateway authenticity
## 33 — Payment flow can create application orders before the final payment result is known
## 34 — Payment callback enrollment is not guarded by a uniqueness invariant at the application layer
## 35 — Payment callback creates teacher transactions with a hardcoded commission rate
## 36 — Payment callback success message is lesson/course specific even when the orderable differs
## 37 — Paymob service hardcodes merchant integration configuration in source code
## 38 — Paymob service contains commented production/test credentials in source history
## 39 — Paymob API integration has no visible timeout/retry/error translation policy
## 40 — Payment service uses `uniqid()` for merchant order identifiers before relying on Paymob IDs
## 41 — Wallet payment flow is hardcoded to Vodafone wallet issuer
## 42 — Verification service performs repeated collection queries before invalidating old codes
## 43 — Verification invalidation and new-code creation are not wrapped in one transaction
## 44 — Email delivery is synchronous inside authentication requests
## 45 — Image storage operations and database updates are not consistently transactional
## 46 — Course deletion deletes contents directly after checking enrollments but lacks complete aggregate cleanup guarantees
## 47 — Lesson deletion follows the same incomplete aggregate-deletion pattern
## 48 — Resource classes execute database queries and business/realtime logic during serialization
## 49 — `StudentResource` performs conversation lookups while serializing a student
## 50 — Realtime conversation existence checks can create N+1-style query amplification
## 51 — API resources embed base64 image data into responses
## 52 — Chat controller constructor resolves the authenticated user before request execution context is fully established
## 53 — Chat conversations sorting reads message collections in memory
## 54 — Chat conversations filtering performs multiple in-memory relationship traversals
## 55 — Chat conversation creation trusts a client-supplied `role` header for target-user model selection
## 56 — Chat conversation creation exposes cross-role identity selection through a user-controlled model selector
## 57 — Chat conversation deletion/clear operations depend on package-level participant resolution and lack explicit policy classes
## 58 — Chat message deletion uses `MessageNotification` as an indirect message lookup
## 59 — Message deletion of type `1` cascades through recipients without an explicit domain transaction around all side effects
## 60 — Chat message image deletion can be decoupled from database mutation
## 61 — Chat file upload validation allows SVG files
## 62 — Chat file upload size/type policy is embedded directly inside controller code
## 63 — Chat endpoints do not show explicit per-user authorization policies beyond participant resolution
## 64 — API routes contain inconsistent naming and endpoint conventions
## 65 — Typo-level API contract inconsistencies exist (`intiate`, `familes`, `VerficationService`)
## 66 — Route definitions mix `auth:sanctum` with role-specific guards inconsistently
## 67 — Generic `check-auth` endpoint is unauthenticated and used as a universal session probe
## 68 — Error responses are generated through global helper functions without a documented API error contract
## 69 — Validation rules are duplicated manually instead of consistently centralized in Form Requests
## 70 — Several controller methods use inline validators instead of dedicated request classes
## 71 — Response status codes are not consistently modeled as REST resource semantics
## 72 — Controllers directly instantiate infrastructure services with `new`
## 73 — Controllers directly orchestrate external payment, mail, image, chat and transaction concerns
## 74 — Domain logic is concentrated in controllers instead of dedicated application/domain services
## 75 — Database queries frequently use unbounded `get()` operations on potentially growing datasets
## 76 — Pagination is largely absent from list/search endpoints
## 77 — No visible API versioning convention is applied to the route tree
## 78 — API resource contracts are not backed by explicit request/response contract tests across all endpoints
## 79 — Automated test coverage is concentrated in a small set of authentication/profile tests
## 80 — Critical payment and chat security flows require broader regression coverage
## 81 — Critical authorization boundaries lack dedicated negative tests across role combinations
## 82 — There is no visible CI workflow enforcing the backend quality gates
## 83 — Static analysis and architecture enforcement are not visible in the repository workflow
## 84 — README is mostly framework-level information rather than full project documentation
## 85 — Environment and secret-management expectations are not documented as deployment contracts
## 86 — Application configuration and external service credentials are not consistently externalized
## 87 — Realtime broadcasting authorization is centralized at route level without explicit channel policy evidence
## 88 — Exception handling customization is effectively empty in `bootstrap/app.php`
## 89 — The backend mixes infrastructure/framework concerns directly into controllers and resources
## 90 — Current structure will become difficult to scale as roles, features and integrations increase
