# Elmullim — Admin Panel / Frontend Integration Roadmap

**Status:** Active companion document  
**Last reviewed:** 2026-09-18  
**Backend:** `mazensabry2712/Elmullim-b`  
**Frontend:** `mazensabry2712/Elmullim-f`

## 1. Purpose

The Admin Panel is a Laravel Blade application inside the Backend repository.

This frontend repository does not contain a separate React Admin Panel. The React application remains the public Student / Parent / Teacher platform.

This document exists to keep both repositories synchronized while Admin functionality is built in the Backend.

## 2. Integration rule

The public frontend and Admin Panel must consume the same Backend domain behavior.

For any changed platform domain:

```
Backend domain rule
    ↓
Backend API contract
    ↓
React public flow
    ↓
Laravel Blade Admin oversight
```

The Admin Panel must never invent business rules that contradict the Backend services.

## 3. Active public-platform domains relevant to Admin

The current React frontend already integrates with:

- Lessons
- Availability
- Bookings
- Booking Payment
- Sessions / Schedule
- Attendance
- Notifications
- Teacher Service Areas
- Chat
- Courses
- Quizzes
- Profiles
- Authentication

These domains are the source of the data the Admin Panel will inspect.

## 4. Admin integration phases

### Phase 0 — Existing Admin stabilization

No React Admin work is required.

Frontend responsibility:

- Keep public-platform behavior unchanged.
- Run regression tests after Backend Admin changes.
- Confirm public APIs remain compatible.

Required checks:

```powershell
npm run test:run
npm run lint
npm run build
```

### Phase 1 — Dashboard

The Admin Dashboard is backend/Blade work.

Frontend responsibility:

- No duplicate dashboard business logic.
- Public screens must continue to use the real API.
- Regression-test any Backend model/query changes that touch shared resources.

### Phase 2 — Lessons

The Admin Panel will inspect the same Lesson entity used by React.

Current public Lesson contract includes:

- teacher
- subject
- education level
- grade
- delivery mode
- booking type
- duration
- price
- sessions count
- meeting URL
- offline location/visit type
- group capacity
- publishing status
- availability

Important:

The React Lesson flow must continue to distinguish Lesson from Course.

### Phase 3 — Bookings

Admin Booking inspection must correspond to the public booking contract:

- lesson
- student
- booked by
- booking type
- requested time
- proposed time
- confirmed time
- duration
- price
- status
- customer note
- teacher note
- student location

The React booking flow remains authoritative for user interaction; Admin is operational oversight.

### Phase 4 — Sessions / Calendar

Admin Session views use the same Session records surfaced in the public Schedule screens.

Current public session data includes:

- lesson
- start
- end
- status
- meeting URL
- location
- bookings
- attendance

Historical public schedule behavior must not be broken by Admin work.

### Phase 5 — Attendance

Admin attendance monitoring must match the public attendance contract:

- session
- booking
- student
- attendance status
- note
- marked time

Statuses:

- present
- absent
- no_show
- excused

### Phase 6 — Financial Administration

Admin financial changes must preserve the public payment contract.

Public booking payment flow:

```
Booking
 -> payment initiation
 -> payment provider
 -> verified callback/webhook
 -> successful Order
 -> confirmed Booking
 -> Session
 -> Transaction
```

React must never treat a payment redirect alone as the authoritative confirmation.

### Phase 7 — Reviews

Review/Rating Admin work must not change public rating eligibility until the completion-linked rating rule is explicitly implemented and documented.

### Phase 8 — Availability / Service Areas

Admin views are oversight of data already managed by Teachers through the public platform.

The React app currently uses:

- Lesson availability
- Teacher blocked periods
- Teacher service areas
- Student location where the teacher travels to the student

Admin visibility must not weaken teacher ownership rules.

### Phase 9 — Notifications / Communication

The public frontend currently has:

- Notification center
- Unread count
- Mark read
- Mark all read
- User chat
- Flagging/deletion behavior supported by the current chat domain

Admin monitoring must remain compatible with those contracts.

### Phase 10 — Reports / final controls

Reports are primarily a Backend/Admin concern.

Any new endpoint created for reporting that is also consumed by React must have a documented API contract and frontend tests.

## 5. Frontend regression matrix

After each Admin phase, at minimum keep these public flows green where affected:

### Authentication

- Student login
- Teacher login
- Parent login
- Protected routes

### Lesson

- Lessons list
- Lesson details
- Teacher lesson management
- Availability selection

### Booking

- Student booking
- Parent booking
- Private approval
- Group booking
- Cancellation
- Payment initiation

### Sessions

- Student schedule
- Parent schedule
- Teacher schedule
- Online join

### Attendance

- Teacher marking
- Student/Parent viewing

### Notifications

- Notification center
- Read
- Read all

### Chat

- Chat route
- Conversation
- Message actions

## 6. Browser verification rule

Automated React tests are necessary but not sufficient.

When a Backend Admin change modifies a shared domain, perform:

1. Backend automated tests.
2. React automated tests.
3. React build.
4. Real API verification.
5. Browser verification of the affected public flow.
6. Admin browser verification for the affected Admin flow.

## 7. Contract synchronization rule

If a backend contract changes:

- Update Backend API documentation.
- Update React interface/type.
- Update React service.
- Update React component/page.
- Update React tests.
- Update Admin Blade/controller if the domain is surfaced in Admin.
- Update Admin roadmap/status documentation.

Do not patch only one side.

## 8. Current public frontend verification baseline

Current documented local baseline:

- 36 test files / 88 tests passed.
- Lint passed.
- Production build passed.

A later Admin change must not silently reduce this baseline.

## 9. Ownership rule

```
Backend
  = data + authorization + business rules

React
  = public user experience

Admin Blade
  = operational oversight and controlled administration
```

No layer should become a competing business-rule engine.

## 10. Completion definition

The Admin integration is complete only when:

- Admin functionality is implemented in the Backend repository.
- Shared domains remain consistent with React contracts.
- React regression tests pass.
- Backend tests pass.
- Real API verification passes.
- Browser verification passes.
- Documentation in both repositories describes the same current state.
