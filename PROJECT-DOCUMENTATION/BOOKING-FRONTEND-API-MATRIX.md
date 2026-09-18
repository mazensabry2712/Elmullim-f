# Elmullim — Frontend Booking Integration Matrix

**Last reviewed:** 2026-09-18

## Lesson

| UI / Flow | Backend contract | Status |
|---|---|---|
| Lesson discovery | Public Lesson API | Implemented |
| Public lesson details | Public Lesson details API | Implemented |
| Teacher create/edit | Teacher Lesson API | Implemented |
| Student booking | Booking API | Implemented |
| Parent child selection | Parent profile + Booking API | Implemented |
| Stage filter | Education level filter | Backend ready / final UI refinement |
| Subject filter | Subject filter | Backend ready / final UI refinement |
| Weekly availability | Availability API | Implemented |
| Offline service areas | Service-area API | Implemented |
| Student location for teacher visit | Booking API | Implemented |
| Available seats | Slot-derived count | Pending |

## Booking

| Flow | Frontend | Backend | Status |
|---|---|---|---|
| Group booking | Book dialog | Group booking service | Implemented |
| Private booking | Book dialog | Teacher approval | Implemented |
| Teacher accept/reject | Teacher booking UI | Teacher booking endpoints | Implemented |
| Propose another time | Teacher booking UI | Proposal endpoint | Implemented |
| Student/Parent proposal response | Booking UI | Respond endpoint | Implemented |
| Cancel | Booking management | Cancel endpoint | Implemented |
| Payment initiation | Payment UI | Booking payment endpoint | Implemented |
| Payment confirmation | Payment result handling | Server callback | Implemented |

## Sessions

| Flow | Status |
|---|---|
| Student schedule | Implemented |
| Parent schedule/access | Implemented |
| Teacher schedule | Implemented |
| Join Online session | Implemented |
| Offline session location | Implemented |
| Session lifecycle | Implemented |
| Teacher attendance controls | Implemented |
| Student/Parent attendance display | Implemented |
| Recurring sessions from `sessions_count` | Pending |

## Notifications

| Flow | Status |
|---|---|
| Notification center | Implemented |
| Unread count/badge | Implemented |
| Mark one read | Implemented |
| Mark all read | Implemented |
| Booking notifications | Implemented |
| Payment confirmation notification | Implemented |
| Arabic / English notification content | Implemented |
| Advanced Push/FCM | Pending |

## Teacher Service Areas

| Flow | Status |
|---|---|
| Add service area | Implemented |
| Edit service area | Implemented |
| Delete service area | Implemented |
| Active/inactive | Implemented |
| Teacher profile/menu entry | Implemented |
| Student location capture | Implemented |
| Offline matching via backend | Implemented |

## Chat / Admin

| Flow | Status |
|---|---|
| Existing user chat route | Implemented |
| Chat access protection | Implemented |
| Admin Chat Monitoring | Implemented |
| Read-only admin monitoring | Implemented |
| Final browser verification | Pending |

## Academic operations

| Flow | Status |
|---|---|
| Attendance | Implemented |
| No Show | Implemented |
| Homework | Pending |
| Exams / Tests | Pending |
| Grades | Pending |
| Completion-linked rating eligibility | Pending |
| Parent academic dashboard extensions | Pending |
| Advanced teacher earnings/reporting UX | Pending |

## Super Admin

| Flow | Status |
|---|---|
| Super Admin authentication | Pending |
| Admin/Super Admin role separation | Pending |
| Role/Permission management | Pending |
| Sensitive administrative controls | Pending |

## Final verification gate

Latest local frontend checks:
- 36 test files / 88 tests passed.
- Lint passed.
- Production build passed.

Still required:
- Real API end-to-end verification.
- Browser verification for Student, Parent and Teacher flows.
- Real payment-provider verification.
- Super Admin implementation and verification.
