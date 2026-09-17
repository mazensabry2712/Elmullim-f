# Elmullim — Availability & Calendar Frontend Status

**Feature branch:** `feat/availability-calendar-v1`  
**Status:** Documentation complete; implementation not started.

## Scope

This feature converts lesson booking from arbitrary date/time entry into availability-driven scheduling.

### Teacher

- Add recurring weekly availability to a Lesson.
- Edit and replace the Lesson availability set.
- Use explicit IANA timezone.
- Consume backend validation errors.

### Student / Parent

- Load Lesson availability.
- Choose a date.
- Choose an available time.
- Submit the existing Booking API with the selected datetime.

## Backend dependencies

Target endpoints:

```text
GET /api/teacher/lessons/{lesson_id}/availability
PUT /api/teacher/lessons/{lesson_id}/availability
GET /api/lessons/{lesson_id}/availability
```

Booking remains:

```text
POST /api/lessons/{lesson_id}/bookings
```

The frontend does not own booking availability truth; the backend remains authoritative.

## Definition of Done

- Teacher availability editor works.
- Lesson create/update persists availability through the real API.
- Public Lesson details/booking can load available slots.
- Student booking uses selected availability.
- Parent booking uses linked child + selected availability.
- Empty/loading/error states are covered.
- Frontend tests pass.
- Backend regression tests pass.
- Production build passes.
- Real API verification passes.
- Browser verification passes.
- Documentation and roadmap are synchronized.

## Known future scope

- Offline service areas.
- Student location matching.
- Calendar exceptions/holidays beyond teacher blocks.
- Automatic recurring Session generation from `sessions_count`.
- Attendance, notifications, and Admin calendar operations.
