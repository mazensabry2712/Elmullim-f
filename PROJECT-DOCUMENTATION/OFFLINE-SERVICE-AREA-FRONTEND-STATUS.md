# Elmullim — Offline Service Area Frontend Status

**Feature branch:** `feat/offline-service-area-v1`
**Status:** Implementation complete; local regression, real API, and browser verification pending.

## Implemented

- Teacher service-area contracts, API client, and React Query hooks.
- Teacher profile `Service Areas` tab with create, edit, delete, active/inactive controls, and browser geolocation helper.
- Teacher Lesson Form supports the backend visit types:
  - `teacher_to_student`
  - `student_to_teacher`
- `teacher_to_student` lessons require at least one active service area on the client.
- Selected service areas are sent as `service_area_ids[]` during lesson create/update.
- Lesson response types expose only service-area metadata needed by the teacher UI.
- Student profile includes an offline-location editor using address + latitude + longitude.
- Parent profile includes per-linked-student offline-location editing.
- Browser geolocation helper is optional; manual coordinates remain supported.
- Frontend service tests cover service-area CRUD, lesson service-area replacement, and student/parent location mutations.

## API contract used

| Actor | Endpoint | Purpose |
| --- | --- | --- |
| Teacher | `GET /api/teacher/service-areas` | List own areas |
| Teacher | `POST /api/teacher/service-areas` | Create area |
| Teacher | `PUT /api/teacher/service-areas/{id}` | Update area |
| Teacher | `DELETE /api/teacher/service-areas/{id}` | Delete area |
| Teacher | `GET /api/teacher/lessons/{lesson_id}/service-areas` | Read assigned areas |
| Teacher | `PUT /api/teacher/lessons/{lesson_id}/service-areas` | Replace assigned areas |
| Student | `PUT /api/student/location` | Update own offline location |
| Parent | `PUT /api/parent/students/{student_id}/location` | Update linked student's location |

## Privacy boundary

Precise student coordinates are not rendered as public lesson metadata. Backend `StudentResource` exposes the location fields only to the student themselves or the linked parent.

## Verification gate

```text
Frontend baseline before Phase 4 ✅ 83/83 tests + build
Frontend implementation ✅
Frontend tests ⏳ re-run after Phase 4 changes
Backend implementation ✅
Backend tests ⏳ re-run after final StudentResource privacy adjustment
Real API integration ⏳
Browser verification ⏳
Documentation finalization ⏳
```

Do not merge to `main` until every remaining gate passes.
