# Elmullim — مواصفات Frontend Module الدروس والحجز

## قاعدة الـModule

`Lessons` مستقل عن `Courses`.

الـLesson هو عرض تعليمي عام يمكن تصفحه، والحجز يتم من خلال `Booking`. لا تستخدم واجهة الدروس `Course Enrollment` لتحديد التسجيل في الدرس.

## Public flow

الزائر يستطيع:
- فتح `/lessons`.
- البحث عن الدروس.
- استخدام فلاتر Online/Offline وPrivate/Group والصف والسعر والموقع.
- فتح `/lessons/{lessonId}`.
- مشاهدة بيانات المدرس والدرس والسعر وخصائص الحجز.

عند الضغط على `احجز الآن` بدون تسجيل دخول، ينتقل المستخدم إلى Login. لا يتم إرسال Booking request قبل Authentication.

## Authenticated flow

### Student
- Booking على نفسه.
- متابعة `/bookings`.
- متابعة `/schedule`.
- Join للـOnline Session عند السماح.

### Parent
- اختيار Child من linked students.
- إنشاء Booking للطالب مع بقاء Parent هو الـbooker.
- متابعة bookings وschedule الخاصة بالأبناء.
- بدء الدفع عند قابلية الحجز للدفع.

### Teacher
- `/profile/teacher/bookings` لإدارة طلبات Private.
- `/profile/teacher/schedule` لإدارة Sessions.

## Booking rules

Private:
`Booking Requested → Pending Teacher Approval → Accepted → Payment/Confirmation → Confirmed`

Group:
`Available → Booking Requested → Confirmed`

الـFrontend يعرض الحالة القادمة من الـBackend ولا يخترع state transition.

## Lesson page data

يجب أن يدعم العرض:
- Teacher
- Rating
- Subject
- Grade
- Online/Offline
- Private/Group
- Duration
- Price
- Sessions count
- Available seats عند Group
- Schedule/available times
- Location وvisit type عند Offline
- Description

## Separation rules

- Lesson interfaces تحت `src/interfaces/lessons`.
- عدم استخدام `interfaces/courses/lessons` كـpublic Lesson contract.
- عدم استخدام `EnrollFreeLesson` في الـbooking flow.
- عدم استخدام `hasEnrolled` لاتخاذ قرار Booking.
- My Schedule يعتمد على `Session/Booking` وليس Course enrollment.

## Current implementation slice

تم تنفيذ:
- Public lesson contract مستقل.
- Public Lesson cards لا تعرض Enroll/Watch من Course flow.
- Public Lesson details بها Booking CTA.
- Guest booking requires Login.
- Public API search/filter integration.
- Student/Parent Booking dialog.
- Booking management, teacher booking actions, payment initiation, and schedule/session UI.

لاحقًا:
- Subject selector/catalog UI.
- Available-time/slot model والـcalendar الحقيقي.
- Teacher multi-step lesson creation حسب Steps 1–7.
- Attendance, assignments, exams, grades, notifications, ratings, and financial reporting.
