# Elmullim — Implementation Roadmap & System Specification

**Project:** Elmullim Educational Platform  
**Frontend:** `mazensabry2712/Elmullim-f`  
**Backend:** `mazensabry2712/Elmullim-b`  
**Document type:** Internal implementation specification  
**Status:** Active roadmap  
**Purpose:** توثيق المتطلبات التشغيلية المستهدفة، الوضع الحالي، والفجوات، وترتيب التنفيذ بحيث يتم تطوير النظام مرحلة بعد مرحلة مع اختبار كل مرحلة قبل الانتقال إلى التالية.

---

## 1. الهدف من المستند

هذا المستند هو المرجع الأساسي عند استكمال منصة Elmullim من الوضع الحالي إلى نظام الدروس والحجز المتكامل.

نشتغل وفق القواعد التالية:

1. لا نبدأ Frontend feature جديد قبل تثبيت الـBackend contract الخاص به.
2. لا نعيد تصميم أجزاء تعمل حاليًا إلا إذا كانت متعارضة مع الـbusiness model الجديد.
3. كل مرحلة يجب أن تحتوي على Database + Backend + Tests، ثم Frontend integration، ثم verification.
4. لا نعتبر نجاح unit/feature tests وحده دليلًا على اكتمال التكامل؛ يجب اختبار الـFrontend مع الـAPI فعليًا.
5. لا نحذف الـCourse/Enrollment/Payment functionality الحالية دون بديل واضح ومختبر.
6. أي requirement لم يُنفذ بعد يظل مسجلًا هنا ولا يُفترض أنه موجود لمجرد وجود UI مشابه له.

---

# 2. النظام المستهدف

## 2.1 أنواع المستخدمين

### Student

يمكن للطالب:

- البحث عن الدروس والمدرسين.
- مشاهدة المحتوى العام.
- حجز درس خاص.
- الانضمام إلى درس جماعي.
- حجز Online أو Offline.
- متابعة الجدول.
- متابعة الحضور والدرجات والاختبارات.
- التقييم.
- متابعة المدفوعات والحجوزات.

### Parent / Family

حساب ولي الأمر يمكن أن يرتبط بأكثر من طالب.

يمكن لولي الأمر:

- ربط أبنائه بالحساب.
- مشاهدة جدول كل طالب.
- الحجز نيابة عن الطالب.
- الدفع نيابة عن الطالب.
- متابعة الحضور والدرجات والاختبارات والواجبات.
- متابعة المدرسين والحجوزات والمدفوعات.
- استقبال الإشعارات.

**قاعدة مهمة:** الـbooking يجب أن يسجل الطالب المستفيد، وكذلك الجهة التي قامت بالحجز (`booked_by`) عند الحاجة.

### Teacher

يمكن للمدرس:

- إدارة ملفه التعليمي.
- تحديد المواد والصفوف.
- إنشاء الدروس.
- تحديد Online / Offline.
- تحديد Private / Group.
- تحديد السعر والمدة وعدد الحصص.
- تحديد المواعيد المتاحة.
- تحديد معلومات الـOffline.
- قبول/رفض طلبات الـPrivate.
- اقتراح موعد بديل.
- إدارة الطلاب المسجلين.
- تسجيل الحضور.
- إدارة الواجبات والاختبارات والدرجات.
- متابعة الأرباح والمعاملات.

### Admin

الإدارة مسؤولة عن الإدارة التشغيلية والمراجعة والموافقة والسياسات المالية والمحتوى والصلاحيات وفق لوحة الإدارة المعتمدة.

---

# 3. أنواع الدروس المستهدفة

يجب أن يدعم النظام أربعة combinations أساسية:

| Delivery | Booking type | المعنى |
|---|---|---|
| Online | Private | مدرس + طالب واحد |
| Online | Group | مجموعة طلاب أونلاين |
| Offline | Private | مدرس + طالب واحد حضوريًا |
| Offline | Group | مجموعة طلاب حضوريًا |

---

# 4. Lesson vs Booking vs Session

هذه هي أهم قاعدة في الـdomain model.

```text
Lesson / Offering
        |
        +---- Booking 1
        +---- Booking 2
        +---- Booking N
                 |
                 +---- Session / attendance / outcome
```

## Lesson

يمثل العرض التعليمي الذي أنشأه المدرس، مثل:

`Math Group — Saturday 8 PM`

وهو ليس تسجيل طالب معين.

## Booking

يمثل تسجيل طالب معين في Lesson أو طلبه للحجز.

لكل Booking هوية مستقلة وحالة مستقلة وبيانات وقت/سعر/حجز.

## Session

يمثل الموعد الفعلي الذي سيتم تنفيذ الحصة فيه. وجود Session منفصل يصبح مهمًا عند دعم:

- أكثر من حصة للدرس الواحد.
- إعادة الجدولة.
- الحضور.
- بداية/نهاية التنفيذ.
- تاريخ التنفيذ الفعلي.

---

# 5. إنشاء الدرس بواسطة المدرس

الـTeacher flow المستهدف:

### Step 1 — Education / Subject

- المادة.
- المرحلة.
- الصف.

### Step 2 — Delivery mode

- Online.
- Offline.

### Step 3 — Booking type

- Private.
- Group.

### Step 4 — Lesson details

- Title.
- Description.
- Duration.
- Price.
- Number of sessions.
- Days.
- Available times.

### Step 5 — Online data

عند Online:

- Meeting URL أو generated meeting reference.

### Step 6 — Offline data

عند Offline:

- Location.
- Service areas.
- هل المدرس يذهب للطالب أم الطالب يأتي للمدرس.

### Step 7 — Group data

عند Group:

- Maximum students.
- Available seats.

### Publishing

الـLesson تمر بحالة نشر/اعتماد حسب سياسة الإدارة.

**الافتراض التشغيلي المعتمد حاليًا:** لا نعتبر `create lesson` وحده دليلًا على النشر العام؛ نحتاج قرارًا واضحًا لحالة publishing/approval قبل الإظهار العام عند تفعيل هذه السياسة.

---

# 6. Search & Discovery

صفحة الدروس المستهدفة يجب أن تدعم:

- Delivery: Online / Offline.
- Booking: Private / Group.
- Subject.
- Education level / stage.
- Grade.
- Price.
- Location عندما يكون الدرس Offline.

يجب أن يكون الـBackend هو مصدر الحقيقة للـfilters المتاحة والنتائج، وليس مجرد filtering بصري في الـFrontend.

---

# 7. Lesson Details

صفحة تفاصيل الدرس يجب أن تعرض، بحسب النوع:

- Teacher photo/name.
- Teacher rating.
- Subject.
- Stage/grade.
- Online / Offline.
- Private / Group.
- Duration.
- Price.
- Schedule / available slots.
- Remaining seats عندما يكون Group.
- Description.
- Reviews.
- Booking action.

---

# 8. Group Booking Flow

```text
Student / Parent
      |
      v
View Lesson
      |
      v
Confirm Booking
      |
      +--> Payment when required
      |
      v
Confirmed
      |
      v
My Schedule
```

## قواعد Group

- لا يوجد قبول فردي من المدرس لكل طالب في الحالة العادية.
- لا يسمح النظام بتجاوز الـmaximum capacity.
- يجب حماية الحجز من race conditions حتى لا يتم حجز آخر مقعد مرتين.
- حالة المقعد المتاحة يجب أن تأتي من الـBackend.
- لو الدرس مدفوع، لا يصبح الـBooking confirmed نهائيًا قبل نجاح الدفع وفق payment policy.

### Group status target

```text
Available
  -> Booking Requested
  -> Confirmed
  -> Upcoming
  -> In Progress
  -> Completed
```

Additional statuses:

- Cancelled.
- Rejected.
- Rescheduled.
- No Show.
- Disputed.

---

# 9. Private Booking Flow

```text
Student / Parent
      |
      v
Select teacher + lesson + date + time
      |
      v
Send Booking Request
      |
      v
Pending Teacher Approval
      |
      +--> Accept
      |
      +--> Reject
      |
      +--> Suggest Another Time
```

## Accept

بعد قبول المدرس:

- يتم تأكيد الموعد وفق حالة الدفع المطلوبة.
- يتم إنشاء/تثبيت Session.
- يظهر الموعد في Schedule.

## Reject

يتحول الـBooking إلى `Rejected` ولا يصبح موعدًا قابلًا للتنفيذ.

## Suggest Another Time

المدرس يقترح:

- New date.
- New time.

ويرسل النظام إشعارًا للطالب/ولي الأمر.

الطرف الآخر يستطيع:

- Accept.
- Reject.

عند Accept يصبح الموعد `Confirmed` وفق قواعد الدفع.

---

# 10. Online / Offline rules

## Online

يحتاج النظام إلى:

- Meeting URL أو meeting identifier.
- جعل رابط الدخول متاحًا فقط للحجز/الجلسة المؤهلة.
- زر `Join Lesson` في الوقت المناسب.

## Offline

يحتاج النظام إلى:

- Location.
- Teacher service areas.
- Travel direction policy:
  - Teacher goes to student.
  - Student goes to teacher.
- Student location عند الحاجة.
- تحقق Backend من توافق المنطقة مع قدرة المدرس.

---

# 11. Parent as Booked By

هذه قاعدة DB مهمة.

مثال:

```text
Student = Ahmed
Booked By = Parent Account
```

الـBooking يجب أن يحفظ على الأقل:

```text
student_id
booked_by_type
booked_by_id
```

بحيث لا نفقد الطالب المستفيد بسبب استخدام Parent token.

الـParent authorization يجب أن يفرض أن الطالب المستهدف من أبناء ولي الأمر المرتبطين به.

---

# 12. Student Schedule

`My Schedule` يجب أن يعرض:

- Student.
- Lesson.
- Teacher.
- Date.
- Start time.
- End time.
- Delivery mode.
- Booking type.
- Booking status.
- Session status.
- Meeting link أو location حسب النوع.

### Actions

Online:

- `Join Lesson` عندما تسمح حالة/وقت الجلسة.

Offline:

- عرض تفاصيل المكان.

---

# 13. Booking Status Model

## Group

```text
Available
Booking Requested
Confirmed
Upcoming
In Progress
Completed
```

## Private

```text
Booking Requested
Pending Teacher Approval
Accepted
Payment / Confirmation
Confirmed
Upcoming
In Progress
Completed
```

## Shared additional states

```text
Cancelled
Rejected
Rescheduled
No Show
Disputed
```

**قاعدة:** الحالات يجب أن تكون controlled state transitions في الـBackend، ولا يعتمد النظام على frontend navigation لتغيير status.

---

# 14. Payment

الدفع الحالي في الـBackend يعتمد على Paymob ويوجد بالفعل:

- Payment initiation.
- Payment callback/webhook.
- HMAC verification.
- Amount verification.
- Idempotency protection.
- Order/transaction handling.

المطلوب في الـbooking architecture الجديد:

```text
Booking
   |
   v
Order / Payment
   |
   v
Payment result
   |
   v
Confirm booking when policy allows
```

لا يجوز اعتبار customer redirect وحده تأكيدًا نهائيًا للدفع.

---

# 15. Financial Transaction

بعد اكتمال/تأكيد العملية وفق السياسة المالية:

```text
Booking
  |
  v
Payment
  |
  v
Teacher Transaction
  |
  +--> teacher amount
  +--> platform commission
```

الـcommission rate يجب أن يكون configurable من إعدادات النظام، لا hard-coded في الـFrontend.

---

# 16. Attendance

نحتاج Attendance مرتبطًا بالـBooking/Session، وليس مجرد حالة عامة للطالب.

Minimum model concept:

```text
session_id
booking_id
student_id
status
recorded_at
recorded_by
```

الحالات المستهدفة يمكن أن تشمل:

- Present.
- Absent.
- No Show.
- Late.

والـAttendance يجب أن يظهر للطالب وولي الأمر والمدرس حسب الصلاحيات.

---

# 17. Homework / Grades / Quizzes

## Homework

يجب ربط الواجب بالسياق التعليمي الصحيح (Lesson/Course/Session حسب نوع feature) مع الطالب عند الحاجة.

## Grades

نحتاج grade records قابلة للربط بالطالب والحصة/التقييم، ولا نعتمد على quiz result وحده كمفهوم gradebook كامل.

## Quizzes

الجزء الحالي يشمل quiz creation/submission/result، وهو قائم بالفعل ويجب الحفاظ عليه مع توسيعه فقط عند الحاجة ليرتبط بالـlesson/session/gradebook.

---

# 18. Ratings

بعد تنفيذ/اكتمال الدرس يمكن للطالب، ووفق policy المعتمدة، تقييم المدرس.

الـRating يجب أن يرتبط بالـteacher وبالطرف الذي قام بالتقييم، ويفضل ربطه بالحجز/الخدمة عند استقرار الـBooking model حتى لا يتم تقييم خدمة لم تتم.

---

# 19. Notifications

الإشعارات المطلوبة في booking workflow:

- Booking requested.
- Booking accepted.
- Booking rejected.
- Teacher suggested a new time.
- Reschedule accepted/rejected.
- Payment result.
- Upcoming lesson.
- Lesson reminder.
- Cancellation.
- Completion.

يجب أن تكون notifications مصدرها الـBackend events/jobs، لا مجرد toast messages في الـFrontend.

---

# 20. Admin responsibilities

لوحة الإدارة يجب أن تدعم التشغيل والمراجعة حسب scope المشروع، ومنها:

- إدارة المستخدمين والأدوار.
- Teachers / Students / Families.
- Subjects / education hierarchy.
- Courses / Lessons / Content.
- Quiz data.
- Orders / Payments / Transactions / Payouts.
- Booking review عند الحاجة.
- Lesson publish/approval policy.
- Chat moderation / Admin Chat حسب النطاق المعتمد.
- التقارير الأساسية.

---

# 21. الوضع الحالي مقابل المطلوب

## Already implemented / usable foundation

- Student authentication.
- Teacher authentication.
- Parent/Family authentication.
- Email verification.
- Password reset/update.
- Sanctum tokens.
- Student/Teacher/Family profiles.
- Parent ↔ multiple students relation.
- Courses.
- Lessons basic CRUD.
- Contents and lectures.
- Quizzes, questions, options, submission, result.
- Free enrollment.
- Paymob payment initiation/callback.
- Payment HMAC verification.
- Payment idempotency handling.
- Teacher transactions/payout foundation.
- Ratings foundation.
- User chat foundation.
- Frontend routing/protected routes.
- Frontend automated tests.
- Production build.

## Missing / incomplete for the target booking platform

- Booking entity and workflow.
- Lesson delivery mode: Online/Offline as a first-class field.
- Lesson booking type: Private/Group as a first-class field.
- Lesson schedules/slots.
- Session entity and lifecycle where needed.
- Group capacity/seat reservation logic.
- Private booking requests and teacher approval.
- Teacher alternative-time proposal flow.
- Parent-as-booker model.
- Offline location/service-area matching.
- Calendar/Schedule based on Booking/Session.
- Booking state machine.
- Booking-aware payment flow.
- Attendance.
- Booking-aware completion flow.
- Booking-aware rating linkage.
- Booking-related notifications.
- Admin booking management/approval policy where required.

---

# 22. Implementation Phases

## Phase 0 — Baseline & Contracts

### Goal
تثبيت الوضع الحالي قبل إدخال الـBooking domain.

### Tasks

- Record current test results.
- Review API response conventions.
- Review existing enrollment/payment compatibility.
- Freeze current working behavior that must not regress.
- Define migration/backward-compatibility strategy.

### Acceptance

- Existing backend tests pass.
- Existing frontend tests pass.
- Production build passes.
- No existing critical flow intentionally broken.

---

## Phase 1 — Lesson Domain Upgrade

### Goal
تحويل Lesson إلى model قادر على تمثيل Online/Offline وPrivate/Group والـschedule.

### Backend

- Design migrations.
- Update Lesson model.
- Add enums/value objects where appropriate.
- Add validation requests.
- Add availability/schedule storage.
- Add publish/approval state when approved by product policy.
- Add tests.

### Frontend

- Update teacher lesson creation wizard.
- Add conditional Online/Offline fields.
- Add conditional Private/Group fields.
- Add schedule UI.
- Add group capacity UI.

### Done when

- Teacher can create a valid lesson in all four combinations.
- Invalid combinations are rejected by Backend.
- Tests cover all combinations.

---

## Phase 2 — Booking Core

### Goal
إدخال Booking ككيان مستقل عن Lesson وEnrollment.

### Backend

- `bookings` table.
- Booking status enum/state transitions.
- Create/read booking endpoints.
- Group seat constraints.
- Private request flow.
- Teacher approval/rejection.
- Alternative-time proposal.
- Booking history/audit data.
- Tests for concurrency/duplicate scenarios where practical.

### Frontend

- Book Now flow.
- Private request flow.
- Teacher request management.
- Accept/Reject/Suggest Time.
- Booking status UI.

### Done when

- Group and Private booking flows work independently.
- Booking does not mutate into a simple enrollment record.
- Capacity and duplicate rules are enforced by Backend.

---

## Phase 3 — Parent Booking

### Goal
تمكين ولي الأمر من إدارة الحجوزات نيابة عن الطالب.

### Backend

- Validate parent-child relationship.
- Save `student_id` separately from `booked_by_*`.
- Authorize parent actions.
- Tests for allowed and disallowed child bookings.

### Frontend

- Select Child.
- Book for child.
- Show actor/student clearly.
- Parent schedule per child.

---

## Phase 4 — Scheduling & Sessions

### Goal
ربط Booking بموعد تنفيذي حقيقي.

### Backend

- Sessions/slots.
- Date/time conflicts.
- Teacher conflicts.
- Student conflicts.
- Group session capacity.
- Online meeting details.
- Offline location details.
- Session lifecycle.

### Frontend

- My Schedule.
- Teacher Schedule.
- Session details.
- Join Lesson / location.

---

## Phase 5 — Payment Integration with Booking

### Goal
ربط الدفع بالـBooking بدل الاعتماد على enrollment فقط.

### Backend

- Booking payment state.
- Order/payment mapping.
- Confirmation rules.
- Refund/cancellation rules when approved.
- Transaction creation.
- Idempotency tests.

### Frontend

- Checkout/payment state.
- Pending payment.
- Success/failure.
- Booking confirmation state.

---

## Phase 6 — Execution: Attendance / Homework / Grades

### Backend

- Attendance.
- Homework records.
- Grade records.
- Teacher permissions.
- Student/Parent read permissions.
- Tests.

### Frontend

- Teacher attendance screen.
- Student schedule/result views.
- Parent child progress views.

---

## Phase 7 — Notifications & Ratings

### Backend

- Booking events.
- Notifications.
- Reminder jobs.
- Completion/rating eligibility.
- Rating linkage.

### Frontend

- Notification center/in-app states.
- Rating after completion.
- Reschedule notifications.

---

## Phase 8 — Admin & Final Integration

### Scope

- Lesson approval/publishing.
- Booking monitoring.
- Payment/transaction monitoring.
- Chat administration.
- Reports.
- Full permissions review.
- Auditability.

### Done when

Admin can monitor the end-to-end operational lifecycle without bypassing the core business rules.

---

# 23. Testing Strategy

كل phase لازم تضيف tests قبل اعتبارها مكتملة.

## Backend

At minimum:

- Unit tests for enums/state rules where useful.
- Feature tests for every endpoint.
- Authorization tests.
- Validation tests.
- Duplicate booking tests.
- Capacity tests.
- Payment tests.
- Parent-child authorization tests.
- State transition tests.

Current baseline result recorded separately from the target work:

```text
Backend: 59 tests passed / 205 assertions
```

## Frontend

At minimum:

- Component tests.
- Service tests.
- Route/protected-route tests.
- Booking flow tests.
- Parent booking tests.
- Payment state tests.
- Schedule tests.

Current baseline:

```text
33 test files passed
78 tests passed
Production build passed
Lint: 0 errors / 2 warnings
```

## Integration / Browser QA

لا يكفي نجاح automated tests.

يجب اختبار:

```text
Browser
  -> Frontend
  -> Axios
  -> /api
  -> Laravel
  -> DB
  -> External services when enabled
```

الحد الأدنى للـE2E acceptance:

1. Public discovery.
2. Student login.
3. Teacher login.
4. Parent login.
5. Create lesson.
6. Search lesson.
7. Group booking.
8. Private booking request.
9. Teacher accept/reject.
10. Suggest new time.
11. Parent books for child.
12. Payment flow.
13. Schedule.
14. Attendance.
15. Completion/rating.

---

# 24. Definition of Done — Global

الميزة لا تعتبر مكتملة إلا عندما:

- Database structure موجودة وصحيحة.
- Backend validation موجودة.
- Authorization موجود.
- API response ثابت وواضح.
- Tests موجودة وناجحة.
- Frontend مربوط فعليًا بالـAPI.
- Loading/error/empty states موجودة.
- لا يوجد regression في features الموجودة.
- الـbusiness rules enforced on server.
- Documentation محدثة.

---

# 25. Rules for future implementation

1. **Native Laravel first** قبل إدخال packages جديدة إذا لم تكن ضرورية.
2. **Backend-first** في الـbusiness features.
3. كل migration جديدة يجب أن يكون لها سبب واضح وعلاقة موثقة.
4. لا نستخدم `Enrollment` كبديل لـ`Booking` في الـPrivate/Group workflow.
5. الدفع لا يؤكد نفسه من redirect.
6. Parent booking يجب أن يحفظ الطالب المستفيد والـbooker بشكل منفصل.
7. Capacity checks يجب أن تكون server-side.
8. Status transitions يجب أن تكون controlled.
9. لا نعالج warning غير مؤثر على الوظيفة على حساب feature critical.
10. بعد كل phase: run tests → integration check → update documentation.

---

# 26. Current Next Step

**المرحلة التالية المعتمدة: Phase 1 — Lesson Domain Upgrade.**

لا نبدأ Phase 2 قبل أن تكون Phase 1 مكتملة ومختبرة.

### Phase 1 first deliverables

1. Finalize Lesson domain fields.
2. Define migrations.
3. Define enums for delivery and booking type.
4. Define schedule/availability model.
5. Update teacher lesson validation and CRUD.
6. Add Backend tests.
7. Update Frontend lesson creation flow.
8. Add Frontend tests.
9. Run integration test.
10. Update this document with implementation status.

---

# 27. Change Log

| Date | Change |
|---|---|
| 2026-09-16 | Added target booking-domain specification, gap analysis, implementation phases, testing strategy, and Phase 1 as the next implementation step. |
