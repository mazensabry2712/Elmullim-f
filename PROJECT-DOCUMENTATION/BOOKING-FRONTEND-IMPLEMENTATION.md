# Elmullim — Booking Frontend Implementation

## Scope

This document records the frontend implementation corresponding to the Booking, Payment, and Session backend slices.

## API Contract Used

### Booking

- `POST /api/lessons/{lesson_id}/bookings`
- `GET /api/bookings`
- `GET /api/bookings/{booking_id}`
- `POST /api/bookings/{booking_id}/respond`
- `POST /api/bookings/{booking_id}/cancel`
- `GET /api/teacher/bookings`
- `POST /api/teacher/bookings/{booking_id}/accept`
- `POST /api/teacher/bookings/{booking_id}/reject`
- `POST /api/teacher/bookings/{booking_id}/propose`

### Payment

- `POST /api/student/payment/booking/initiate`
- `POST /api/parent/payment/booking/initiate`
- Paymob redirect URL is opened when returned by the backend.
- Booking confirmation remains backend/webhook driven.

### Sessions

- `GET /api/schedule`
- `GET /api/teacher/schedule`
- `GET /api/sessions/{session_id}`
- `POST /api/bookings/{booking_id}/join`
- `POST /api/teacher/sessions/{session_id}/status`

## Student

Implemented on Lesson Details:

1. Student opens `Book now`.
2. Frontend loads the authenticated student's id from `/api/student/me`.
3. Student selects requested date/time.
4. Student may add a note.
5. Frontend sends the real booking request.
6. Backend status is shown to the user.

Private lessons remain pending teacher approval. Group lessons follow the backend group flow.

## Parent

The booking dialog loads `/api/parent/me` and uses the linked `students` data for child selection. Parent booking/payment requests preserve the child as the booking beneficiary and the parent as the actor.

## Booking Management

`/bookings` provides:

- Current status.
- Requested/proposed/confirmed time.
- Student information for parents.
- Cancellation for eligible states.
- Accept/reject of teacher reschedule proposals.
- Booking payment action when the backend says the booking is payable.
- Link to the schedule.

`/profile/teacher/bookings` provides:

- Teacher booking list.
- Accept.
- Reject with optional note.
- Propose a new time with optional note.

## Schedule / Sessions

`/schedule` is role-aware:

- Student/Parent see their scheduled sessions.
- Teacher sees teaching schedule.
- Student/Parent can join an available session.
- Teacher can start, complete, or cancel a session.

## Environment

For local development using the Laravel server started with `php artisan serve --host=127.0.0.1 --port=8000`:

```env
VITE_API=http://127.0.0.1:8000
VITE_ENV=local
```

The checked-in `.env.development` uses this same API target, so the frontend does not depend on a Herd hostname that may not resolve on every machine. Production continues to use the configured production API URL.

## Testing

Automated frontend checks:

```powershell
npm run test:run
npm run build
npm run lint
```

Booking dialog tests cover student and parent flows. `e2e/booking.spec.ts` covers the real browser request against the local Laravel API.

The E2E runner can target an existing local Vite instance with:

```powershell
$env:E2E_BASE_URL='http://localhost:5174'
$env:E2E_API_BASE_URL='http://127.0.0.1:8000'
npx playwright test
```

## Integration Rules

- Frontend does not invent booking status transitions.
- Backend is the source of truth for authorization, capacity, payment confirmation, and session lifecycle.
- Customer redirect is not treated as payment confirmation; the server callback is authoritative.
- Do not use the old free `Enroll` flow for lessons that are booking-enabled.

## Remaining Extension

The current session model creates one scheduled session per confirmed booking and allows group bookings for the same lesson/start time to share a session. Automatic recurring session generation from `sessions_count`, richer calendar UX, notifications, and attendance workflows remain later extensions rather than unfinished booking basics.
