# Elmullim — Roadmap Status Snapshot

**Last reviewed:** 2026-09-17
**Frontend branch:** `feat/booking-domain-frontend-v1`
**Backend branch:** `feat/booking-domain-v1`

This snapshot supplements the existing roadmap without changing unrelated documentation.

## Current state

### Lesson domain

**Core implementation:** complete for the current field model.

Implemented:
- Online / Offline
- Private / Group
- Subject / Stage / Grade
- Title / Description
- Duration / Price / Sessions count
- Meeting URL
- Offline location / visit type
- Group maximum capacity
- Publishing status
- Teacher create/update flow
- Public published lesson discovery and details

Still required for full product specification:
- Availability/weekly days and time slots
- Blocked periods
- Offline service areas
- Student location and service-area matching
- Public Stage/Subject filter UI
- Dynamic available seats
- Browser verification for all four lesson combinations

### Booking/session/payment integration

Implemented in current feature branches:
- Student booking
- Parent booking for linked student
- Beneficiary vs booking actor distinction
- Private teacher approval
- Group booking flow
- Accept/reject/propose time
- Student/parent response to proposal
- Cancellation
- Duplicate protection
- Group capacity enforcement
- Booking payment initiation
- Paymob callback/HMAC/amount verification
- Session creation and session access
- Student/Parent/Teacher schedules
- Session lifecycle and conflict rules

Remaining later domains:
- Attendance / No Show
- Homework / Exams / Grades
- Completion-linked rating
- Notifications
- Admin approval/oversight

## Verification baseline — 2026-09-17

Frontend:
- `npm run build` — PASS
- `npm run test:run` — 36 test files / 82 tests passed

Backend:
- `php artisan test` — 95 tests / 330 assertions passed

These numbers must be refreshed after every behavior-changing implementation.

## Execution rule

Do not mark a feature complete until backend + frontend + real API + browser verification + documentation agree.
