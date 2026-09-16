# Elmullim — Development Workflow & Phase Gates

**Status:** Active
**Frontend:** `mazensabry2712/Elmullim-f`
**Backend:** `mazensabry2712/Elmullim-b`

## 1. Purpose

This document defines how Elmullim is developed from the current codebase toward the target educational platform.

The goal is not to keep adding isolated fixes. Every feature must be implemented as a complete, traceable flow and documented in the repositories.

## 2. Golden Rule

**One feature/domain slice at a time:**

```text
Backend contract
   -> Backend implementation
   -> Backend tests
   -> Frontend implementation
   -> Frontend tests
   -> Real API integration
   -> Browser verification
   -> Documentation update
   -> Merge
   -> Next feature
```

We do not implement all backend phases first and postpone the frontend to the end.

## 3. Repository Responsibilities

### Backend

`Elmullim-b` is the source of truth for:

- Database schema.
- Authentication and authorization.
- Domain rules.
- Status transitions.
- Validation.
- Capacity/conflict protection.
- Payment confirmation.
- API response contract.

### Frontend

`Elmullim-f` is responsible for:

- User-facing screens and flows.
- Calling the real backend APIs.
- Displaying server state.
- Client-side usability validation.
- Loading/error/empty states.
- Navigation according to backend state.

The frontend must not become a second business-rule engine.

## 4. Existing Functionality Protection

Existing working features must remain working unless a documented domain change intentionally replaces them.

Especially preserve and regression-test:

- Authentication.
- Student/Parent/Teacher profiles.
- Chat.
- Courses.
- Existing enrollment behavior.
- Existing Paymob/payment behavior.
- Quizzes.

A new feature must not silently delete or invalidate these areas.

## 5. Domain Rules

### Lesson

`Lesson` is the teacher-created educational offering/template.

It can define:

- Subject.
- Grade.
- Online/Offline.
- Private/Group.
- Duration.
- Price.
- Session count.
- Online meeting data.
- Offline location data.
- Group capacity.
- Publishing state.

### Booking

`Booking` is a specific student's registration/request against a Lesson.

A Booking must keep the beneficiary student separate from the actor who created the booking.

```text
student_id       = beneficiary student
booked_by_type   = Student or Family
booked_by_id     = actor account
```

### Session

`Session` is an actual scheduled occurrence. It is separate from the Lesson and Booking so scheduling, attendance, rescheduling, and completion can evolve without turning `lessons` into a large table.

## 6. Four Lesson Combinations

The target platform supports:

| Delivery | Booking | Meaning |
|---|---|---|
| Online | Private | One teacher + one student |
| Online | Group | One teacher + multiple students |
| Offline | Private | In-person one-to-one |
| Offline | Group | In-person group |

## 7. Frontend Phase Gates

A frontend feature is considered complete only when all of the following are true:

- The backend contract is known and documented.
- The screen uses the real API contract.
- Client tests pass.
- Backend tests remain green.
- Production build passes.
- Relevant browser flow is manually verified.
- Loading, error, empty, success, and authorization states are handled.
- Documentation/checklists are updated.

## 8. Current Execution Order

### Feature 1 — Lesson Domain

Backend domain foundation: **completed and merged to `main`**.

Frontend work is now active:

1. Teacher lesson creation/edit UI.
2. Conditional Online/Offline fields.
3. Conditional Private/Group fields.
4. Lesson details.
5. Lesson discovery/search filters.
6. Real API integration.
7. Frontend tests + build.
8. Browser verification.

### Feature 2 — Booking

Only after the Lesson feature is integrated end-to-end:

- Group booking.
- Private booking.
- Parent-as-booker.
- Teacher approval.
- Booking states.

### Feature 3 — Scheduling

- Availability.
- Sessions.
- Conflict protection.
- Student/Parent/Teacher schedules.

### Feature 4 — Payment Integration

- Booking payment.
- Paymob confirmation.
- Idempotency.
- Financial transaction linkage.

### Feature 5 — Session Operations

- Attendance.
- Homework.
- Grades.
- Completion.
- Rating.
- Earnings.

### Feature 6 — Notifications/Admin Integration

- Booking notifications.
- Reschedule notifications.
- Payment notifications.
- Reminders.
- Publishing/approval.
- Admin oversight.

## 9. Testing Strategy

### Backend

At minimum:

- Domain/schema tests.
- Authorization tests.
- Validation tests.
- State transition tests.
- Integration tests for payment and booking flows where applicable.
- Full regression suite before merge.

### Frontend

At minimum:

- Component tests.
- Form/validation tests.
- API-state tests.
- Route/permission tests.
- Production build.
- Browser verification against the local backend.

Passing automated tests alone does not prove the real frontend/backend flow works.

## 10. Git Workflow

Recommended pattern:

```text
main
  |
  +-- feature branch
        |
        +-- implementation
        +-- tests
        +-- documentation
        |
        +-- Pull Request
               |
               +-- verification
               +-- merge to main
```

Do not develop large unrelated features on the same branch.

## 11. Documentation Rule

Whenever implementation changes, update the relevant documentation in the same phase.

At minimum keep aligned:

- `IMPLEMENTATION-ROADMAP.md`
- `BOOKING-IMPLEMENTATION-CHECKLIST.md`
- Domain/design documents.
- Frontend/backend contract documents.
- Phase status documents.

Documentation must describe what actually exists, not what is planned only.

## 12. Current Baseline

After Lesson Domain Phase 1 backend migration:

- Backend full suite: **61 passed / 219 assertions**.
- Lesson domain foundation tests: **2 passed / 14 assertions**.
- Phase 1 backend migration verified locally.

The next active implementation target is the **Frontend Lesson Domain**, not the Booking UI.
