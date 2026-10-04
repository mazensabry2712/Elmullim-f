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
6. The booking UX branches from the lesson's own state:
   - Free + Group → immediate confirmation.
   - Free + Private → teacher approval.
   - Paid + Group → create the booking reservation, initialize the booking payment immediately, then redirect to the secure checkout.
   - Paid + Private → send the booking request first; payment is offered only after teacher acceptance.
7. Backend status is shown to the user.

The dialog is therefore driven by the Lesson's price and booking type instead of treating every booking as the same generic form.

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
- Paid Group booking can enter checkout directly from the booking dialog.
- Paid Private booking stays approval-gated before checkout.
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

Customer-facing payment is unified across all paid products.

Frontend:
- Course purchases and lesson bookings use the same payment method contract: Card, Fawry/Kiosk, Mobile Wallets.
- Both flows use the same shared payment method selector component.
- Both flows send the selected method to the backend.
- Course promo pricing is shown before payment and the applied code is the only code sent to checkout.
- Payment result handling is shared for course and booking orders.
- Parent and Student booking payments use the same checkout contract.

Backend:
- Course and booking orders use the same `orders` financial record shape.
- A shared `PaymentCheckoutService` initializes provider checkout for both resources.
- A centralized `PaymentMethodEnums` validates the supported payment methods.
- Provider callbacks remain the source of truth for payment confirmation.
- Payment reconciliation confirms the underlying course enrollment or booking and creates the teacher transaction atomically.

The provider name is not exposed in the customer-facing payment UI.

Booking dialog UX now uses the same payment method contract as the existing Booking Payment dialog:
- Card.
- Fawry / Kiosk.
- Mobile Wallets.

For a paid Group lesson, the selected payment method is submitted immediately after the booking reservation is created. If provider initialization fails, the booking remains visible in My Bookings so payment can be retried through the existing booking-payment flow.

## Environment

Local environment configuration is machine-specific. Required API/base URL values should be configured through the environment template and should not be committed as secrets.

## Testing

Current local frontend verification:
- `npm run test:run` → **36 test files / 88 tests passed**.
- `npm run lint` → **passed**.
- `npm run build` → **passed**.

Real API/browser verification remains the final product gate for the completed booking experience.

## Remaining extension

- Final real API/browser verification of the four Lesson booking combinations.
- Automatic recurring Session generation/semantics should remain aligned with the current Backend SessionService behavior.
- Advanced Push/FCM delivery if required.
