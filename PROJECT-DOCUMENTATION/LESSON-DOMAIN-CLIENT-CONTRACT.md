# Lesson Domain — Frontend Contract

This file mirrors the Backend lesson-domain contract for frontend implementation.

## Current Phase

Phase 1 establishes the Lesson domain fields. The Frontend should consume these fields only after the Backend migration and API resources are verified.

### Lesson fields

- `subject_id`
- `grade`
- `delivery_mode`: `online | offline`
- `booking_type`: `private | group`
- `duration_minutes`
- `sessions_count`
- `meeting_url` (Online)
- `location` (Offline)
- `offline_visit_type`
- `max_students` (Group)
- `publishing_status`

## Rules

- Lesson is booking-oriented and is not a Course content hierarchy.
- Do not create or consume Lesson Content/Lecture/Video endpoints.
- Do not use legacy Lesson Enrollment for participation; Lesson participation is represented by Booking.
- Course Content/Lecture/Video and Course Enrollment remain Course-only concerns.

- Do not implement a fake booking flow using the old enrollment endpoint.
- Do not infer availability, capacity, confirmation, or payment status from local UI state.
- Booking UI starts only after the Backend exposes the Booking contract.
- `online` UI may display a meeting link only when the Backend says the user is eligible to join.
- `offline` UI should display location data returned by the Backend.
- Group seat availability must come from the Backend.
- Parent booking must identify the selected student separately from the authenticated Parent account.

## Planned Frontend order

1. Lesson create/update form for the new fields.
2. Lesson details display.
3. Availability/slots UI after Backend support exists.
4. Group booking UI.
5. Private booking request UI.
6. Parent booking UI.
7. Schedule UI.
8. Payment UI integration.
9. Attendance/result/rating UI.

## Verification

For each feature:

- Add/update component tests.
- Verify API request payload and response mapping.
- Run the frontend test suite.
- Run `npm run build`.
- Verify the real browser flow against the local Laravel API.
