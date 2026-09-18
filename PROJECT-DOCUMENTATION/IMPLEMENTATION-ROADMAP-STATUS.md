# Elmullim — Roadmap Status Snapshot

**Last reviewed:** 2026-09-18

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
- Public Subject/Stage filter controls in the final discovery UI.
- Dynamic available-seat display based on the selected group time slot.
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
- Super Admin authentication.
- Admin vs Super Admin role separation.
- Role / Permission management.
- Sensitive administrative authorization.
- Platform-level administrative settings/controls.
- Additional approval/reporting/dispute workflows where required.

### Reviews & academic domains

Remaining:
- Completion-linked rating eligibility.
- Review moderation completion where required.
- Homework.
- Exams / Grades.
- Broader academic reports.
- Advanced teacher/student academic reporting.

## Verification

Current local frontend verification:
- **36 test files / 88 tests passed.**
- **Lint passed.**
- **Production build passed.**

Current backend verification:
- Latest main CI is green.
- Latest local database migrations for Attendance, Notifications, Teacher Service Areas and Student Location completed successfully.

Separate final gate:
- Real API end-to-end verification.
- Browser verification for Student, Parent and Teacher.
- Real payment-provider verification.
- Super Admin verification.

## Execution rule

When a business rule changes:
1. Update the product requirements.
2. Update backend implementation and tests.
3. Update frontend contracts and tests.
4. Update this status document.
5. Keep browser/real-API verification separate until it has actually been executed.

The platform should not be described as fully complete until backend, frontend, real API, browser verification, tests and documentation agree.
