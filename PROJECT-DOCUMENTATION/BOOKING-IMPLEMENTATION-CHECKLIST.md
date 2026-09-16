# Elmullim — Frontend Lesson & Booking Checklist

The frontend follows the backend domain contract. Business rules are not reimplemented only in the UI.

## Current baseline

- [x] Existing frontend tests pass.
- [x] Production build passes.
- [x] Lint has no errors.
- [ ] Live browser/API integration baseline verified.

## Phase 1 — Lesson Creation UI

- [ ] Step 1: subject / stage / grade.
- [ ] Step 2: Online / Offline.
- [ ] Step 3: Private / Group.
- [ ] Step 4: title / description / duration / price / session count / days / times.
- [ ] Step 5: Online meeting data.
- [ ] Step 6: Offline location / service area / travel direction.
- [ ] Step 7: Group capacity / seats.
- [ ] Publishing/approval state displayed from backend.

## Phase 2 — Lesson Discovery

- [ ] Online / Offline filter.
- [ ] Private / Group filter.
- [ ] Subject filter.
- [ ] Stage / grade filters.
- [ ] Price filter.
- [ ] Offline location filter.
- [ ] Backend-provided availability/seats displayed.

## Phase 3 — Booking UI

- [ ] Group booking flow.
- [ ] Private booking flow.
- [ ] Teacher approval state.
- [ ] Suggest-new-time UI.
- [ ] Accept/reject proposed time.
- [ ] Parent selects child when booking.
- [ ] Booking status displayed from backend.

## Phase 4 — Schedule

- [ ] Student My Schedule.
- [ ] Parent schedule per child.
- [ ] Teacher schedule.
- [ ] Online Join Lesson action with backend authorization.
- [ ] Offline location display.

## Phase 5 — Payments

- [ ] Start payment for eligible booking.
- [ ] Show pending/success/failed states.
- [ ] Do not treat browser redirect alone as payment confirmation.
- [ ] Refresh booking/payment state from backend.

## Phase 6 — Session Results

- [ ] Attendance display.
- [ ] Homework display.
- [ ] Grades/results display.
- [ ] Rating after eligible completion.

## Phase 7 — Notifications/Admin visibility

- [ ] Booking notifications.
- [ ] Reschedule notifications.
- [ ] Payment notifications.
- [ ] Upcoming lesson reminders.
- [ ] Admin booking/payment/chat views when available.

## Definition of Done

A frontend phase is complete only when its real API requests match the backend contract, tests pass, build passes, and the relevant browser flow has been manually verified.