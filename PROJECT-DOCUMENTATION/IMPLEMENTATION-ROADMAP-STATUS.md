# Elmullim — Roadmap Status Snapshot

**Last reviewed:** 2026-09-28

This snapshot reflects the current implementation status across the platform.

## Current state

### Lesson domain

**Core implementation:** complete for the current booking-domain model.

Implemented:
- Online / Offline.
- Private / Group.
- Subject / Stage / Grade.
- Title / Description.
- Duration / Price / Sessions count.
- Meeting URL.
- Offline location / visit type.
- Group maximum capacity.
- Publishing status.
- Teacher create/update flow.
- Public published lesson discovery and details.
- Booking-focused Lesson screens.

Remaining refinements:
- Final browser verification for all four Lesson combinations.

### Availability & Calendar

Implemented:
- Weekly Lesson availability.
- ISO weekday contract.
- Explicit timezone handling.
- Overlap validation.
- Teacher blocked periods.
- Teacher availability management.
- Public Lesson availability.
- Availability-driven Date → Time booking selection.
- Backend enforcement of unavailable periods.

Remaining:
- Final real API/browser verification.
- Future calendar exceptions/holidays if required.

### Booking / Session / Payment

Implemented:
- Student booking.
- Parent booking for linked students.
- Beneficiary vs booking actor distinction.
- Private teacher approval.
- Group booking.
- Accept / Reject / Propose time.
- Student/Parent proposal response.
- Cancellation.
- Duplicate protection.
- Group capacity and concurrency protection.
- Booking payment initiation.
- Paymob callback / HMAC / amount verification.
- Failed provider Order recovery and payment retry.
- Session creation.
- Session access and join authorization.
- Student / Parent / Teacher schedules.
- Session lifecycle and conflict rules.

Remaining:
- Final real API/browser verification.
- Automatic recurring Session generation from `sessions_count` as a later extension.

### Offline service areas

Implemented:
- Teacher service-area CRUD.
- Active/inactive service-area control.
- Frontend Service Areas entry.
- Student location capture for Teacher Goes To Student.
- Backend service-area matching.
- Booking validation against active service areas.

Remaining:
- Final end-to-end browser verification.

### Attendance

Implemented:
- Attendance per Session + Booking.
- Present / Absent / No Show / Excused.
- Teacher-only updates.
- Student / Parent read access.
- Duplicate protection.
- No Show synchronization with Booking.
- Teacher Schedule controls.
- Student Schedule display.

Remaining:
- Final browser verification.

### Notifications

Implemented:
- Database/in-app notifications.
- Notification API.
- Unread count.
- Mark one read.
- Mark all read.
- Booking state notifications.
- Payment confirmation notifications.
- Student / Parent / Teacher recipients.
- Frontend Notification Center.
- Notification bell and unread badge.
- Arabic / English content.

Remaining:
- Advanced Push/FCM delivery if required by the final scope.

### Chat

Implemented:
- Existing user Chat domain.
- User chat route protection.
- Admin Chat Monitoring.
- Conversation/message inspection.
- Participant and message-count visibility.
- Flagged/deleted/attachment visibility.
- Read-only admin monitoring.

Remaining:
- Additional dispute/reporting workflows if required.

### Admin Panel

Implemented current administration modules include:
- Dashboard.
- Users.
- Students.
- Teachers.
- Families.
- Countries.
- Education Systems.
- Education Levels.
- Subjects.
- Courses.
- Contents.
- Lectures.
- Quizzes.
- Questions.
- Question Options.
- Categories / Sub-Categories.
- Orders.
- Payouts.
- Transactions.
- Coupons.
- Chat Monitoring.

Remaining administrative completion:
- Final browser verification for Admin and Super Admin flows.
- Additional approval/reporting/dispute workflows where required.

### Reviews & academic domains

Implemented:
- Completion-linked rating eligibility.

Remaining:
- Review moderation completion where required.
- Homework.
- Exams / Grades.
- Broader academic reports.
- Advanced teacher/student academic reporting.

## Verification

Latest observed automated frontend CI on 2026-09-28:
- Unit/component test suite passed.
- Lint passed.
- Production build passed.

The frontend E2E test is implemented against the real booking/availability flow. CI runs it only when a dedicated staging/test API is supplied through repository secrets; production is intentionally not used for destructive booking tests.

Backend full-suite verification for the current performance-hardening commits is tracked through the Backend CI run on main.

Separate release gates:
- Real API/browser verification for Student, Parent and Teacher.
- Real payment-provider verification.
- Admin/Super Admin browser verification.

## Execution rule

When a business rule changes:
1. Update the product requirements.
2. Update backend implementation and tests.
3. Update frontend contracts and tests.
4. Update this status document.
5. Keep browser/real-API verification separate until it has actually been executed.

The platform should not be described as fully complete until backend, frontend, real API, browser verification, tests and documentation agree.
