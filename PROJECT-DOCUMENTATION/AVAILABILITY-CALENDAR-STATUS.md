# Elmullim — Availability & Calendar Frontend Status

**Feature branch:** `feat/availability-calendar-v1`  
**Status:** Frontend implementation is in place; local test/build and real browser verification are still required before merge.

## Implemented

### Teacher

- Weekly availability editor inside Lesson creation/update Step 4.
- Day selection using ISO `1=Monday ... 7=Sunday`.
- Start/end time inputs.
- Explicit `Africa/Cairo` default timezone for the current Egyptian setup.
- Add/remove recurring availability rows.
- Availability is submitted as a nested collection with the Lesson create/update request.
- Teacher unavailable-period manager for adding/removing blocked periods.

### Student / Parent

- Booking dialog loads the public Lesson availability API.
- Booking uses Date → Available Time instead of arbitrary datetime entry.
- Available start times are generated according to the Lesson duration and active recurring slots.
- Selected local schedule time is converted to an ISO timestamp using the slot timezone.
- Parent continues to select a linked child before booking.
- Existing Booking API remains the submission endpoint.

### API integration

```text
GET /api/lessons/{lesson_id}/availability
POST /api/lessons/{lesson_id}/bookings
GET/PUT /api/teacher/lessons/{lesson_id}/availability
GET/POST/PUT/DELETE /api/teacher/availability-blocks...
```

## Verification status

Backend GitHub Actions CI is green on the current Availability branch commit before the documentation-only status update.

Frontend local verification is pending after pulling the latest Availability branch:

```powershell
git checkout feat/availability-calendar-v1
git pull origin feat/availability-calendar-v1
npm run test:run
npm run build
```

Real API/browser verification remains mandatory.

## Required final browser checks

1. Teacher opens Lesson create/update.
2. Teacher adds two weekly availability slots.
3. Lesson saves through the real API.
4. Student opens the published Lesson.
5. Student opens Book now.
6. Student chooses a matching date.
7. Only valid start times for that Lesson duration appear.
8. Booking succeeds for an available time.
9. Booking outside availability is rejected by the backend.
10. Teacher adds a blocked period.
11. A booking inside the blocked period is rejected by the backend.
12. Parent repeats booking for a linked child.

## Known future scope

- Offline service areas.
- Student location matching.
- Calendar exceptions/holidays beyond teacher blocks.
- Automatic recurring Session generation from `sessions_count`.
- Attendance, notifications, and Admin calendar operations.
