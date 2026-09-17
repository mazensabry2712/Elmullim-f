# Elmullim — Availability & Calendar Frontend Specification

**Status:** Contract documented before implementation  
**Feature branch:** `feat/availability-calendar-v1`  
**Backend contract:** `Elmullim-b` Availability & Calendar domain  

## 1. Goal

The frontend must let a teacher define recurring weekly availability for a Lesson and let Student/Parent choose a date/time from those available periods when booking.

The frontend must consume the backend availability contract and must not invent availability rules locally.

## 2. Teacher Lesson Wizard

The existing Lesson wizard keeps the current seven-step structure.

### Step 4 — Lesson Details

Add a dedicated `Weekly Availability` section below lesson details:

```text
Day       Start      End
Saturday  18:00      20:00     [Remove]
Tuesday   18:00      20:00     [Remove]

[+ Add availability slot]
```

Required behavior:

- At least one slot for a bookable Lesson.
- Day is selected from the supported weekday contract.
- Start and end are time-only values.
- End must be later than start.
- Duplicate/overlapping slots should be rejected before submission when possible, but backend validation remains authoritative.
- Timezone is submitted explicitly, using the configured/selected IANA timezone. For the current Egyptian setup use `Africa/Cairo`.

## 3. API Integration

Teacher Lesson create/update must submit availability as a nested collection, for example:

```json
{
  "availability": [
    {
      "day_of_week": 6,
      "start_time": "18:00:00",
      "end_time": "20:00:00",
      "timezone": "Africa/Cairo"
    }
  ]
}
```

The exact day-number contract comes from the backend specification. Frontend must not independently redefine it.

On Lesson update, the submitted availability replaces the current recurring availability set atomically according to backend rules.

## 4. Booking Dialog

The current arbitrary `datetime-local` picker must be replaced with availability-driven selection.

Target flow:

```text
Book Lesson
   ↓
Choose date
   ↓
Load available times for selected date
   ↓
Choose time
   ↓
Submit booking
```

For a Group lesson, multiple students may select the same slot until backend capacity is reached.

For a Private lesson, the selected slot remains subject to the backend's teacher approval and conflict rules.

## 5. Availability Query

Target public endpoint:

```text
GET /api/lessons/{lesson_id}/availability
```

The booking UI should retrieve the active recurring schedule for the selected Lesson.

The frontend may calculate which weekdays apply to the selected calendar date, but it must not bypass backend validation.

## 6. Booking Submission

The booking endpoint stays:

```text
POST /api/lessons/{lesson_id}/bookings
```

The payload continues to include:

```json
{
  "student_id": 123,
  "requested_start_at": "2026-10-03T16:00:00.000Z",
  "customer_note": "..."
}
```

The backend converts the timestamp to the availability timezone and checks the recurring slot, teacher blocks, and session conflicts.

## 7. Parent

Parent flow stays:

```text
Book Lesson
→ Select Child
→ Select Date
→ Select Available Time
→ Confirm Booking
```

`student_id` is the child beneficiary. The authenticated Parent remains the booking actor through the backend authorization model.

## 8. Loading / Empty / Error States

### Teacher

- Loading profile/timezone data.
- Loading current availability on Lesson edit.
- Empty schedule state with Add Slot action.
- Validation errors per slot.
- Save success/error feedback.

### Booking

- Loading availability.
- No availability for selected date.
- Selected slot becomes unavailable before submit.
- Backend validation failure.
- Successful booking state.

## 9. Time Handling

Datetime values sent to the backend use ISO-8601.

Time-only weekly slots must retain the explicit IANA timezone.

The UI should display times in the schedule's timezone and avoid silently converting weekly slot strings through the browser's current timezone.

## 10. Backward Compatibility

Do not remove unrelated Course functionality.

Do not reintroduce Lesson `hasEnrolled` logic to support availability.

Do not use Course Enrollment as a substitute for Booking or Availability.

## 11. Frontend Tests

Required:

- Teacher can add one slot.
- Teacher can add multiple slots.
- Teacher can remove a slot.
- Invalid start/end is rejected in UI.
- Lesson create submits availability payload.
- Lesson update submits replacement availability payload.
- Booking dialog loads availability.
- Available dates/times are displayed.
- Empty availability state is shown.
- Student booking submits selected available datetime.
- Parent selects linked child and available datetime.
- Backend rejection is shown safely.

## 12. Browser Verification

Before merge:

1. Teacher logs in.
2. Teacher creates/updates a Lesson.
3. Teacher adds two weekly availability slots.
4. Student opens public Lesson Details.
5. Student opens Book Now.
6. Student chooses a date matching an availability slot.
7. Available times appear.
8. Student books a valid time.
9. Backend creates the Booking.
10. Student schedule reflects the confirmed/appropriate booking state.
11. Student attempts a time outside availability and receives a backend rejection.
12. Parent repeats the flow for a linked child.

## 13. Definition of Done

- Backend availability contract implemented and tested.
- Frontend teacher schedule UI implemented.
- Booking dialog is availability-driven.
- Student + Parent flows work.
- Real API integration works.
- Browser verification works.
- Existing Course flows remain green.
- Documentation and roadmap are updated with actual verification numbers.
