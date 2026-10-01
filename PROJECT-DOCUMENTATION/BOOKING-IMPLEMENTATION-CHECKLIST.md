# Elmullim — Frontend Lesson & Booking Checklist

**Status:** Active
**Execution model:** Backend contract → Frontend implementation → Tests → Real API integration → Browser verification → Documentation → Merge.

The frontend follows the backend domain contract. Business rules are not reimplemented only in the UI.

## Current baseline

- [x] Existing frontend tests pass.
- [x] Production build passes.
- [x] Lint has no errors.
- [x] Backend Lesson Domain Phase 1 migration verified.
- [x] Backend full regression suite verified: 61 tests / 219 assertions.
- [ ] Live browser/API integration baseline verified.

## Active Feature — Lesson Domain Frontend

### Teacher lesson creation/edit

- [ ] Step 1: subject / stage / grade.
- [ ] Step 2: Online / Offline.
- [ ] Step 3: Private / Group.
- [ ] Step 4: title / description / duration / price / session count.
- [ ] Step 5: Online meeting data.
- [ ] Step 6: Offline location / service area / travel direction.
- [ ] Step 7: Group capacity / seats.
- [ ] Publishing/approval state displayed from backend.
- [ ] Validation and conditional fields match the real backend contract.
- [ ] Create/edit requests use the real API.
- [ ] Existing teacher lesson functionality remains intact.

### Lesson discovery

- [ ] Lesson list uses the real backend data.
- [ ] Online / Offline filter.
- [ ] Private / Group filter.
- [ ] Subject filter.
- [ ] Stage / grade filters.
- [ ] Price filter.
- [ ] Offline location filter.
- [ ] Backend-provided publishing state is respected.

### Lesson details

- [ ] Teacher identity and rating.
- [ ] Subject / stage / grade.
- [ ] Delivery mode.
- [ ] Booking type.
- [ ] Duration.
- [ ] Price.
- [ ] Schedule data when available.
- [ ] Group capacity/remaining seats when available.
- [ ] Description/reviews.
- [ ] Correct booking CTA state without implementing Booking business rules prematurely.

### Verification gate

- [ ] Frontend tests pass.
- [ ] Backend regression tests pass.
- [ ] Production build passes.
- [ ] Real API requests verified locally.
- [ ] Browser teacher flow verified.
- [ ] Browser student discovery/details flow verified.
- [ ] Loading/error/empty/success states verified.
- [ ] Documentation updated.

## Future Phase — Booking UI

Do not implement this before the Lesson feature is integrated end-to-end.

- [ ] Group booking flow.
- [ ] Private booking flow.
- [ ] Teacher approval state.
- [ ] Suggest-new-time UI.
- [ ] Accept/reject proposed time.
- [ ] Parent selects child when booking.
- [ ] Booking status displayed from backend.

## Future Phase — Schedule

- [ ] Student My Schedule.
- [ ] Parent schedule per child.
- [ ] Teacher schedule.
- [ ] Online Join Lesson action with backend authorization.
- [ ] Offline location display.

## Payments — Implemented

- [x] Start payment for eligible booking.
- [x] Start payment for paid courses.
- [x] Shared Card / Fawry / Mobile Wallet payment method selector.
- [x] Shared customer checkout contract for course and booking payments.
- [x] Show pending/success/failed states.
- [x] Do not treat browser redirect alone as payment confirmation.
- [x] Refresh booking/payment state from backend.
- [x] Parent and Student booking payment authorization use the same payment contract.

## Future Phase — Session Results

- [ ] Attendance display.
- [ ] Homework display.
- [ ] Grades/results display.
- [ ] Rating after eligible completion.

## Future Phase — Notifications/Admin visibility

- [ ] Booking notifications.
- [ ] Reschedule notifications.
- [ ] Payment notifications.
- [ ] Upcoming lesson reminders.
- [ ] Admin booking/payment/chat views when available.

## Definition of Done

A frontend feature is complete only when its real API requests match the backend contract, tests pass, build passes, the relevant browser flow has been manually verified, and documentation matches the implementation.
