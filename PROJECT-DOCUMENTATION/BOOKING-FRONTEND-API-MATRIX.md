# Elmullim — Frontend Booking Integration Matrix

**Last reviewed:** 2026-09-17

## Lesson

| UI | Backend contract | Status |
|---|---|---|
| Lesson discovery | `GET /api/lessons/all` | Implemented |
| Public lesson details | `GET /api/lessons/{id}/details` | Implemented |
| Teacher create/edit | `POST/PUT teacher lessons` | Implemented |
| Student booking | `POST /api/lessons/{id}/bookings` | Implemented |
| Parent child selection | `/api/parent/me` + booking API | Implemented |
| Stage filter | `education_level_id` | Backend ready / UI pending |
| Subject filter | `subject_id` | Backend ready / UI pending |
| Weekly availability | Availability API | Pending |
| Offline service areas | Service-area API | Pending |
| Available seats | Booking/session-derived count | Pending |

## Booking

| Flow | Frontend | Backend | Status |
|---|---|---|---|
| Group booking | Book dialog | Group booking service | Implemented |
| Private booking | Book dialog | Teacher approval | Implemented |
| Teacher accept/reject | Teacher booking UI | Teacher booking endpoints | Implemented |
| Propose another time | Teacher booking UI | Proposal endpoint | Implemented |
| Student/Parent proposal response | Booking UI | Respond endpoint | Implemented |
| Cancel | Booking management | Cancel endpoint | Implemented |
| Payment initiation | Payment UI | Booking Paymob endpoint | Implemented |
| Payment confirmation | Payment result handling | Paymob callback | Implemented |

## Sessions

| Flow | Status |
|---|---|
| Student schedule | Implemented |
| Parent schedule/access | Implemented |
| Teacher schedule | Implemented |
| Join Online session | Implemented |
| Offline session location | Core field implemented |
| Session lifecycle | Implemented |
| Recurring sessions from sessions_count | Pending |
| Teacher declared availability | Pending |

## Academic operations

- Attendance — Pending
- No Show — Pending
- Homework — Pending
- Exams/Tests — Pending
- Grades — Pending
- Completion-linked rating eligibility — Pending
- Parent academic dashboard — Pending
- Teacher earnings/reporting UX — Pending

## Notifications/Admin

- Booking request notifications — Pending
- Accept/reject notifications — Pending
- Reschedule notifications — Pending
- Payment notifications — Pending
- Upcoming reminders — Pending
- Admin lesson publishing/approval — Pending
- Admin lesson/booking/payment oversight — Pending
- Admin chat integration using existing Chat domain — Pending

## Rule

The frontend consumes backend contracts and does not treat Course Enrollment as Lesson Booking. Automated tests and builds are necessary but not sufficient: real API and browser verification remain merge gates.
