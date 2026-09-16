# Elmullim — Booking Frontend Implementation

## Scope

This document records the frontend implementation corresponding to the Booking Domain Backend feature.

## Backend Contract Used

- `POST /api/lessons/{lesson_id}/bookings`
- `GET /api/bookings/{booking_id}`
- Student and Parent authentication are supported by the backend contract.
- Booking creation requires:
  - `student_id`
  - `requested_start_at`
  - optional `customer_note`

## Current Frontend Scope

### Student

Implemented on Lesson Details:

1. Student opens `Book now`.
2. Frontend loads the authenticated student's id from `/api/student/me`.
3. Student selects requested date/time.
4. Student may add a note.
5. Frontend sends the real booking request to the backend.
6. The returned backend status is shown to the user.

Private lessons are presented as requiring teacher approval. Group lessons are presented as starting with a booking request.

### Parent

The backend supports Parent booking with `student_id`, but the current frontend does not yet guess or fabricate the linked-student list. The Parent button remains a documented integration point until a dedicated linked-students endpoint/data contract is available in the frontend.

## Important Rules

- Frontend does not invent booking status transitions.
- Backend remains the source of truth for authorization and booking status.
- Student beneficiary and booking actor remain separate backend concepts.
- Payment confirmation is intentionally not implemented here; it belongs to the payment phase.
- Teacher accept/reject UI belongs to the teacher booking-management frontend step and consumes the existing backend endpoints.

## Verification

Expected local checks:

```powershell
npm run test:run
npm run build
npm run lint
```

Manual verification must be performed against the real backend booking endpoints. For local integration, run the compatible backend branch `feat/booking-domain-v1` until its changes are merged to backend `main`.

## Next Frontend Work

- Parent child selector backed by a linked-students API.
- Student/Parent booking history and detail page.
- Teacher pending-bookings screen with Accept/Reject.
- Booking status refresh.
- Payment flow connected to booking after the backend payment phase.
