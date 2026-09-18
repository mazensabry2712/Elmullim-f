# Elmullim — Booking Frontend Implementation

## Scope

This document records the frontend implementation corresponding to Booking, Payment, Session, Attendance, Notifications and Offline Service Area integration.

## Student

Implemented:
1. Student opens Book Now.
2. Frontend loads the authenticated student context.
3. Student selects a valid date/time from Lesson availability.
4. Student may add a note.
5. Frontend sends the real booking request.
6. Backend status is shown to the user.

Private lessons remain pending teacher approval. Group lessons follow the backend group flow.

## Parent

Implemented:
- Load linked students.
- Select the beneficiary child.
- Create the booking on behalf of the child.
- Preserve the child as the booking beneficiary and the parent as the booking actor.
- Use the same booking/payment contracts with parent authorization.

## Booking Management

Student/Parent booking management provides:
- Current status.
- Requested/proposed/confirmed time.
- Student information for parents.
- Cancellation for eligible states.
- Accept/reject of teacher reschedule proposals.
- Payment action when the backend says the booking is payable.
- Link to schedule.

Teacher booking management provides:
- Booking list.
- Accept.
- Reject.
- Propose a new time.

## Schedule / Sessions

Role-aware schedule is implemented:
- Student sees scheduled sessions.
- Parent sees linked student sessions.
- Teacher sees teaching schedule.
- Student/Parent can join an available Online session.
- Offline location details are shown when applicable.
- Teacher can manage session lifecycle.

## Attendance

Frontend integration is implemented:
- Teacher Schedule exposes Present / Absent / No Show / Excused controls.
- Student/Parent Schedule displays the recorded attendance.
- Attendance data is represented in booking/session contracts.

## Notifications

Frontend integration is implemented:
- Notification Center.
- Notification route.
- Navbar bell.
- Unread badge.
- Mark read.
- Mark all read.
- Arabic / English notification content.

## Offline Service Areas

Frontend integration is implemented:
- Teacher Service Areas page.
- Add/Edit/Delete service area.
- Active/inactive control.
- Student location capture for Teacher Goes To Student.
- Booking dialog receives the Offline delivery/visit context.
- Backend performs the final service-area validation.

## Payment

Frontend:
- Starts the booking payment flow.
- Opens the returned payment URL when available.
- Displays payment outcome.

Backend remains authoritative for payment confirmation.

## Environment

Local environment configuration is machine-specific. Required API/base URL values should be configured through the environment template and should not be committed as secrets.

## Testing

Current local frontend verification:
- `npm run test:run` → **36 test files / 88 tests passed**.
- `npm run lint` → **passed**.
- `npm run build` → **passed**.

Real API/browser verification remains the final product gate for the completed booking experience.

## Remaining extension

- Dynamic available-seat display for the selected Group time slot.
- Final Subject/Stage discovery filters.
- Automatic recurring Session generation from `sessions_count`.
- Advanced Push/FCM delivery if required.
- Super Admin implementation.
