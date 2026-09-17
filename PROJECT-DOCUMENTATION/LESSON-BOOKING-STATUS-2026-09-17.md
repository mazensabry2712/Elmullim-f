# Elmullim — Lesson & Booking Implementation Status

**Last verified:** 2026-09-17
**Frontend branch:** `feat/booking-domain-frontend-v1`
**Backend branch:** `feat/booking-domain-v1`

## Verified locally

### Frontend

```text
npm run build
✓ PASS

npm run test:run
✓ 36 test files passed
✓ 82 tests passed
```

Existing console/test warnings are non-failing and are not counted as failures.

### Backend

```text
php artisan test
✓ 95 tests passed
✓ 330 assertions passed
```

## Implemented and verified domain slices

### Lesson foundation

- Online / Offline
- Private / Group
- Subject
- Education Stage (`education_level_id`)
- Grade
- Title / Description
- Duration
- Price
- Sessions count
- Meeting URL
- Offline location
- Offline visit type
- Group maximum students
- Publishing status
- Public published-lesson discovery
- Public lesson details
- Teacher Lesson create/update contract

### Booking

- Student booking
- Parent/Family booking for linked student
- Separate beneficiary student and booking actor
- Private teacher approval flow
- Group booking without per-student teacher approval
- Capacity enforcement
- Duplicate active-booking protection
- Accept / Reject
- Proposed time / student response
- Cancellation
- Booking authorization rules

### Sessions / Schedule

- Separate `lesson_sessions` domain table
- Booking/session pivot
- Student schedule
- Parent schedule/access
- Teacher schedule
- Session join authorization
- Session status lifecycle
- Teacher/student conflict detection
- Shared Group session for same Lesson/start time

### Payment

- Student/Parent booking payment initiation
- Paymob integration
- HMAC verification
- Amount validation
- Idempotent successful callback
- Paid booking confirmation
- Teacher transaction/commission recording

## Known gaps — intentionally not marked complete

### Availability / Calendar

- Teacher weekly availability
- Available days
- Available time slots
- Blocked/unavailable periods
- Booking against declared availability
- Recurring session generation from `sessions_count`

These require a dedicated Availability/Calendar domain rather than fake fields on `lessons`.

### Offline Service Areas

- Teacher service-area entities
- Area coverage rules
- Teacher travels to student vs student travels to teacher as a normalized rule
- Student location capture for booking
- Matching/filtering teachers by service area

### Public discovery UX

Backend supports Stage and Subject filtering, but the current frontend Lessons page still needs visible Stage and Subject controls.

### Group seats

`max_students` is implemented and enforced by backend, but the public Lesson UI does not yet expose a calculated `available_seats` value from the booking/session state.

### Academic operations

- Attendance
- No Show workflow
- Homework
- Exams/tests connected to lesson sessions
- Grades
- Parent academic visibility
- Rating eligibility tied to completed booking/session
- Earnings/reporting UX

### Notifications / Admin

- Booking notifications
- Reschedule notifications
- Payment notifications
- Upcoming reminders
- Lesson publish/approval UI
- Admin booking/payment/lesson oversight
- Admin chat integration using the existing chat domain

## Domain separation rule

Do not use Course Enrollment as the Lesson Booking mechanism.

```text
Lesson = teacher-created offering
aBooking = student-specific registration/request
Session = actual scheduled occurrence
Course = separate domain
Course Enrollment = separate domain
```

## Required next implementation order

1. Availability / Calendar domain.
2. Offline Service Areas + student location/matching.
3. Public Stage + Subject discovery filters.
4. Dynamic Group available seats.
5. Re-verify real API + browser flow.
6. Then move to Attendance / Academic Operations.

Do not merge a feature simply because its TypeScript/PHP tests pass. The relevant real API and browser flow must also be verified.
