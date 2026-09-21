# Elmullim — Offline Service Area Frontend Specification

**Status:** Active feature specification
**Feature branch:** `feat/offline-service-area-v1`

## Scope

The frontend must consume the backend Offline Service Area contract without duplicating business rules.

### Teacher

- Manage personal service areas.
- Create, update, and delete service areas.
- Assign one or more active service areas to Offline Lessons.
- Do not show service-area assignment controls for Online Lessons.

### Student

- Maintain their own offline location using address plus latitude/longitude when available.

### Parent

- Maintain/select offline location for a linked beneficiary Student.
- Never use the Parent's own location as the Student beneficiary location for booking.

### Booking

For Offline `teacher_to_student` Lessons:
- Show a clear location-eligibility state.
- Require valid student location before submission.
- Let the backend decide the final match.
- Show backend rejection in an actionable error state.

For Offline `student_to_teacher` Lessons:
- Show the Lesson location.
- Do not require service-area matching.

For Online Lessons:
- Hide Offline Service Area controls entirely.

## API contracts

```text
GET    /api/teacher/service-areas
POST   /api/teacher/service-areas
PUT    /api/teacher/service-areas/{service_area_id}
DELETE /api/teacher/service-areas/{service_area_id}
GET    /api/teacher/lessons/{lesson_id}/service-areas
PUT    /api/teacher/lessons/{lesson_id}/service-areas
PUT    /api/student/location
PUT    /api/parent/students/{student_id}/location
```

The frontend must not calculate booking eligibility as an authoritative rule. Any local indicator is informational; the booking API response is authoritative.

## Required states

Every new screen/control must cover:
- Loading
- Empty
- Validation error
- API error
- Success
- Unauthorized access

## Tests

Add component/service tests for:
- Teacher service-area CRUD UI requests.
- Online Lesson hides service-area selection.
- Offline Lesson supports assigning areas.
- Student location update.
- Parent linked-student location update.
- Booking renders backend service-area rejection.

The feature cannot be marked complete until `npm run test:run`, `npm run build`, real API integration, and browser verification pass.
