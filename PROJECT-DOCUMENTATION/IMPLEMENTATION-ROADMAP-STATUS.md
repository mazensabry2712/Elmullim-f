# Elmullim — Roadmap Status Snapshot

**Last reviewed:** 2026-09-18
**Frontend branch:** `main`
**Backend branch:** `main`

This snapshot reflects the implementation currently merged into the two main branches.

## Current state

### Lesson domain

**Core implementation:** complete for the current booking-domain model.

Implemented:
- Online / Offline
- Private / Group
- Subject / Stage / Grade
- Title / Description
- Duration / Price / Sessions count
- Meeting URL
- Offline location / visit type
- Group maximum capacity
- Publishing status
- Teacher create/update flow
- Public published lesson discovery and details
- Weekly lesson availability
- Teacher availability blocks
- Server-side availability validation during booking

Still required for the full product specification:
- Offline service areas
- Student location and service-area matching
- Public Stage/Subject/Price/Location filter UI refinement
- Dynamic available-seat display in the public lesson experience
- Browser verification for all four lesson combinations

### Booking / Session / Payment

Implemented:
- Student booking
- Parent booking for linked student
- Beneficiary vs booking actor distinction
- Private teacher approval
- Group booking flow
- Accept / Reject / Propose time
- Student/Parent response to proposal
- Cancellation
- Duplicate protection
- Group capacity enforcement
- Booking payment initiation
- Paymob callback / HMAC / amount verification
- Failed provider Order recovery and payment retry
- Session creation
- Session access and join authorization
- Student / Parent / Teacher schedules
- Session lifecycle and conflict rules

### Attendance

Implemented:
- Attendance records per Session + Booking
- Present / Absent / No Show / Excused
- Teacher-only attendance updates
- Student / Parent read access
- Duplicate attendance protection
- No Show synchronization with Booking status
- Session completion preserves No Show state
- Teacher Schedule attendance controls
- Student Schedule attendance display

### Notifications

Implemented:
- Database/in-app notification storage
- Notification API
- Unread count
- Mark one as read
- Mark all as read
- Booking request / acceptance / rejection / reschedule / cancellation notifications
- Booking confirmation after successful payment
- Student / Parent / Teacher recipient handling
- Frontend notification center
- Notification bell with unread badge
- Arabic / English notification content

### Admin oversight

Implemented:
- Admin Chat Monitoring at `/admin-panel/chat`
- Read-only conversation/message inspection
- Participant, message count, last-message and moderation-state visibility

Remaining later admin domains:
- Lesson/booking approval workflows where required
- Wider reports and dispute workflows

### Later academic domains

Remaining:
- Homework
- Exams / Grades
- Completion-linked rating rules
- Broader attendance/academic reporting
- Advanced push/FCM notification delivery where required

## Verification

Automated CI is used for every behavior-changing commit.

Current implementation gate:
- Backend CI must be green on the latest `main` commit.
- Frontend CI must be green on the latest `main` commit.
- Manual browser / real-API verification remains a separate final gate.

The repository should not claim full product completion until backend + frontend + real API + browser verification + documentation agree.

## Execution rule

When a business rule changes:
1. Update the source-of-truth requirements.
2. Update Backend implementation and tests.
3. Update Frontend contract and tests.
4. Update this status document.
5. Keep the final browser / real-API verification outstanding until it is actually executed.
