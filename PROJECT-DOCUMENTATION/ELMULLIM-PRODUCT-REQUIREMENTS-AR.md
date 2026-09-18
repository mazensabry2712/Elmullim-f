# ELMULLIM — Product Requirements (AR)

**Document:** Product Requirements & Business Rules  
**Status:** Source of Truth  
**Applies to:** Frontend + Backend + Admin Panel  
**Last reviewed:** 2026-09-18

> هذه الوثيقة تحدد السلوك المطلوب للمنصة. وجود بند هنا لا يعني أن البند منفذ بالفعل؛ حالة التنفيذ تُحدد في وثائق الـStatus ووفق Definition of Done.

---

# 1. الهدف العام

منصة **ELMULLIM** هي منصة تعليمية تربط بين الطالب وولي الأمر والمدرس، وتدير دورة الدرس من البداية إلى النهاية:

**إنشاء الدرس → البحث → الحجز → التأكيد → الدفع عند تطبيقه → الجدول → تنفيذ الدرس → الحضور → انتهاء الدرس → التقييم → المعاملة المالية والتقارير**

يجب أن يدعم النظام تدفقات مختلفة حسب:
- Online / Offline
- Private / Group

# 2. أنواع المستخدمين

## 2.1 الطالب — Student
- البحث عن الدروس والمدرسين.
- مشاهدة الدروس العامة.
- حجز درس خصوصي.
- الانضمام إلى درس جماعي.
- حجز Online أو Offline.
- متابعة جدول الدروس.
- متابعة الحضور والدرجات والاختبارات والواجبات.
- تقييم المدرس.

## 2.2 ولي الأمر — Parent / Family
ولي الأمر يكون مرتبطًا بطالب واحد أو أكثر.
- إضافة وربط أبنائه.
- إدارة أكثر من طالب من حساب واحد.
- مشاهدة جدول كل طالب.
- حجز الدروس نيابة عن الطالب.
- دفع قيمة الدروس.
- متابعة الحضور والدرجات والاختبارات والواجبات.
- متابعة المدرسين والحجوزات.
- استقبال الإشعارات.

### قاعدة مهمة
ولي الأمر **لا يحتاج إلى حساب مستقل لكل طالب**.

العلاقة:

Parent Account
→ Student 1
→ Student 2
→ Student 3

كل Student يحتفظ ببياناته التعليمية الخاصة، بينما يستطيع الـParent إدارة الطلاب المرتبطين من الحساب نفسه.

## 2.3 المدرس — Teacher
- إنشاء الملف التعليمي.
- تحديد المواد والصفوف والمراحل.
- إضافة الدروس.
- تحديد Online / Offline.
- تحديد Private / Group.
- تحديد السعر.
- تحديد المواعيد المتاحة.
- تحديد المناطق التي يخدمها في حالة Offline.
- قبول أو رفض طلبات الدروس الخصوصية.
- اقتراح موعد بديل.
- إدارة الطلاب المسجلين.
- تسجيل الحضور.
- إضافة الواجبات والاختبارات والدرجات.
- متابعة الأرباح والمعاملات الخاصة به.

## 2.4 الإدارة — Admin
الإدارة مسؤولة عن تشغيل ومراقبة المنصة وفق الصلاحيات المعتمدة، بما في ذلك عند الحاجة:
- اعتماد المحتوى أو الدروس.
- مراجعة المستخدمين.
- مراجعة الحجوزات.
- مراجعة المدفوعات والمعاملات.
- متابعة الشكاوى والنزاعات.
- متابعة المحادثات عند الحاجة.
- التقارير والإحصائيات.

# 3. أنواع الدروس
| Delivery | Booking Type | Description |
|---|---|---|
| Online | Private | مدرس + طالب واحد |
| Online | Group | مدرس + مجموعة طلاب |
| Offline | Private | مدرس + طالب واحد |
| Offline | Group | مدرس + مجموعة طلاب |

# 4. Online + Private
درس مباشر بين مدرس وطالب واحد.

### التدفق
1. الطالب يختار المدرس.
2. يختار المادة والصف.
3. يختار التاريخ والوقت ومدة الحصة.
4. يرسل طلب الحجز.
5. تبدأ الحالة في انتظار موافقة المدرس.
6. المدرس يستطيع Accept أو Reject أو Suggest Another Time.
7. بعد التأكيد والدفع عند تطبيقه، يتم إنشاء الحجز المؤكد.
8. يظهر رابط الدرس للطالب والمدرس.

# 5. Online + Group
درس Online مفتوح لعدد من الطلاب.

### قواعد
- يظهر الدرس في البحث العام.
- الطالب يختار الموعد المطلوب.
- يتم التحقق من المقاعد المتاحة.
- عند وجود دفع إلكتروني يتم الدفع ثم التأكيد.
- لا يحتاج المدرس إلى قبول كل طالب بشكل منفصل.
- يضاف الدرس إلى My Schedule بعد التأكيد.
- يمنع تجاوز السعة القصوى.

# 6. Offline + Private
درس حضوري بين مدرس وطالب واحد.

يمكن أن يكون:
- المدرس يذهب إلى منزل الطالب.
- الطالب يذهب إلى مكان المدرس.

### قواعد
- المدرس يحدد المناطق التي يستطيع التدريس فيها.
- يحدد نوع الزيارة ومكان التنفيذ عند الحاجة.
- الطالب يحدد موقعه عند الحاجة.
- النظام يعرض المدرسين/الدروس المناسبة بناءً على مناطق الخدمة.

# 7. Offline + Group
درس حضوري لمجموعة من الطلاب.

### قواعد
- الطالب يحجز مقعدًا.
- النظام يحتسب المقاعد المتاحة.
- يمنع تجاوز الحد الأقصى.
- تظهر تفاصيل المكان للمؤهلين.

# 8. إنشاء درس بواسطة المدرس
## Step 1 — المادة
- Subject
- Education Stage
- Grade

## Step 2 — نوع الدرس
- Online
- Offline

## Step 3 — نوع الحجز
- Private
- Group

## Step 4 — تفاصيل الدرس
- Title
- Description
- Duration
- Price
- Sessions Count
- Days
- Available Times

## Step 5 — Online
- Meeting URL
- أو توليد الرابط تلقائيًا عندما يكون مدعومًا.

## Step 6 — Offline
- Lesson Location
- Service Areas
- Teacher goes to student
- Student goes to teacher

## Step 7 — Group
- Maximum Students
- Available Seats

ثم **Publish Lesson**.
إذا كانت سياسة المنصة تتطلب اعتماد الإدارة، ينتظر الدرس اعتماد الإدارة قبل ظهوره للطلاب.

# 9. البحث عن الدروس
صفحة Lessons يجب أن تدعم:
- Online / Offline
- Private / Group
- Subject
- Education Stage
- Grade
- Price
- Location عند Offline

# 10. صفحة الدرس — Lesson Details
تعرض:
- صورة المدرس
- اسم المدرس
- تقييم المدرس
- المادة
- المرحلة
- الصف
- Online / Offline
- Private / Group
- مدة الدرس
- السعر
- المواعيد المتاحة
- المقاعد المتاحة إذا كان Group
- الوصف
- تقييمات الطلاب عند توفرها

الإجراء الرئيسي: **احجز الآن / Book Now**

# 11. حجز الدرس الجماعي — Group Booking
يعرض للطالب:
- الدرس
- المدرس
- التاريخ
- الوقت
- السعر
- المقاعد المتاحة

ثم **Confirm Booking**.

عند وجود الدفع الإلكتروني:
**Payment → Confirmation → Booking Confirmed**

بعد التأكيد:
- يضاف إلى My Schedule.
- يحجز مقعدًا فعليًا من سعة الدرس.
- لا يحتاج المدرس إلى موافقة فردية لكل طالب.

# 12. حجز الدرس الخصوصي — Private Booking
الطالب يختار:
- المادة
- الصف
- المدرس
- Online / Offline
- التاريخ
- الوقت
- مدة الحصة

إذا كان Offline يحدد الموقع عند الحاجة.

ثم **Send Booking Request**.

تبدأ الحالة: **Pending Teacher Approval**

المدرس يستطيع:
- Accept
- Reject
- Suggest Another Time

# 13. اقتراح موعد بديل
عند Suggest Another Time يحدد المدرس:
- التاريخ الجديد
- الوقت الجديد

يصل إشعار للطالب، ويستطيع:
- Accept
- Reject

عند القبول تصبح الحالة **Confirmed** وفق قواعد الجدولة.

# 14. ولي الأمر والحجز نيابة عن الطالب
التدفق:
**Book Lesson → Select Child → Select Lesson → Confirm Booking**

يجب الفصل في قاعدة البيانات بين:
- **Student = المستفيد من الحجز**
- **Booked By = الشخص الذي أنشأ الحجز**

مثال:
- Student = أحمد
- Booked By = Parent

# 15. لوحة ولي الأمر
يحتوي Dashboard على My Children، ولكل طالب:
- Schedule
- Upcoming Lessons
- Previous Lessons
- Teachers
- Attendance
- Grades
- Exams
- Homework
- Bookings
- Payments

# 16. جدول الطالب — My Schedule
يظهر على الأقل:

| Lesson | Teacher | Date | Type | Status |
|---|---|---|---|---|
| رياضيات | المدرس | الأحد | Online Private | Confirmed |
| عربي | المدرس | الاثنين | Offline Group | Confirmed |
| إنجليزي | المدرس | الثلاثاء | Online Group | Upcoming |

Online: **Join Lesson** عندما يكون الدخول مسموحًا.
Offline: تظهر معلومات المكان.

# 17. حالات Group Booking
التدفق المستهدف:
**Available → Booking Requested → Confirmed → Upcoming → In Progress → Completed**

حالات إضافية:
- Cancelled
- Rejected
- Rescheduled
- No Show
- Disputed

# 18. حالات Private Booking
التدفق المستهدف:
**Booking Requested → Pending Teacher Approval → Accepted → Payment / Confirmation → Confirmed → Upcoming → In Progress → Completed**

حالات إضافية:
- Cancelled
- Rejected
- Rescheduled
- No Show
- Disputed

الـPrivate booking لا يصبح confirmed لمجرد إنشاء الطلب؛ يجب احترام موافقة المدرس والدفع/التأكيد حسب الحالة.

# 19. الفصل بين Lesson و Booking
هذه قاعدة معمارية أساسية.

## Lesson
هو العرض/الحصة التي ينشئها المدرس.
مثال: Math Group — Saturday 8 PM

## Booking
هو تسجيل طالب محدد داخل الحصة.

وبالتالي:
**1 Lesson → Many Bookings**

خصوصًا في Group. يجب ألا يتم تصميم Lesson على أنه حجز طالب واحد.

# 20. البيانات الأساسية للحجز
بحسب السيناريو يجب أن يستطيع النظام تحديد:
- Student
- Teacher
- Lesson
- Booking Actor
- Date
- Time
- Duration
- Location أو Meeting Link
- Price
- Booking Status
- Payment / Confirmation state عند تطبيق الدفع

# 21. تنفيذ الدرس بعد التأكيد
1. يظهر ضمن Schedule.
2. يتم إنشاء/ربط Session حسب نموذج النظام.
3. Online: الوصول إلى رابط الدرس في الوقت المسموح.
4. Offline: عرض معلومات المكان.
5. تسجيل Attendance.
6. انتهاء الجلسة.
7. Completion.
8. فتح التقييم عند تحقق شروطه.
9. تسجيل الأثر المالي/المعاملة وفق النظام.

# 22. الحضور والدرجات والاختبارات
يجب أن يكون لكل Student سجل مستقل عن:
- Attendance
- Homework
- Exams / Quizzes
- Grades

ربط الطلاب بحساب Parent لا يعني دمج بياناتهم التعليمية.

# 23. التقييم
بعد اكتمال الدرس وفق شروط النظام:
- يستطيع الطالب تقييم المدرس.
- يربط التقييم بالحجز/الجلسة المناسبة عند الحاجة.
- يمنع إنشاء تقييمات غير مرتبطة بعملية تعليمية حقيقية.
- تخضع التقييمات للمراجعة الإدارية عند تطبيقها.

# 24. الأموال والمعاملات
يجب أن يستطيع النظام ربط:
**Booking → Payment → Transaction / Financial Record**

بحيث يمكن:
- معرفة قيمة العملية.
- معرفة حالة الدفع.
- تسجيل المعاملة المالية.
- حساب مستحقات المدرس حسب القواعد التجارية.
- دعم التقارير.

تأكيد الدفع الإلكتروني يجب أن يعتمد على التحقق server-side من مزود الدفع، وليس على Redirect من الـFrontend وحده.

# 25. Notifications
الأحداث المهمة التي قد تنتج إشعارات تشمل:
- Booking created
- Teacher accepted
- Teacher rejected
- Teacher suggested another time
- Student/Parent accepted proposal
- Student/Parent rejected proposal
- Payment result
- Upcoming lesson
- Lesson/session status
- Attendance / academic events
- Admin events

# 26. Admin Approval
عند تطبيق سياسة الاعتماد:
**Teacher creates Lesson → Pending Approval → Admin Review → Published**

ولا يظهر الدرس للبحث العام قبل السماح بذلك.

# 27. Admin Oversight
لوحة الإدارة يجب أن تكون قابلة لمراجعة وإدارة:
- Students
- Teachers
- Parents / Families
- Lessons
- Bookings
- Sessions
- Payments
- Transactions
- Reviews
- Reports
- Notifications
- Chat عند الحاجة

مع تطبيق الصلاحيات المناسبة.

# 28. التكامل بين Frontend وBackend
يجب أن يكون هناك contract متوافق لكل domain، خصوصًا:
- Lesson
- Availability / Calendar
- Booking
- Session
- Payment
- Parent/Student relationship
- Attendance
- Reviews

لا يعتمد الـFrontend على assumptions غير مدعومة من الـBackend.

# 29. قواعد عامة غير قابلة للكسر
1. **Lesson ≠ Booking**
2. **Student beneficiary ≠ Booking Actor** عندما يحجز ولي الأمر نيابة عن الطالب.
3. Group capacity يجب حمايته في Backend.
4. Private approval يجب أن يكون server-side.
5. Payment confirmation يعتمد على المصدر المعتمد server-side.
6. Authorization لا يعتمد على الـFrontend.
7. بيانات كل Student مستقلة حتى مع وجود Parent واحد.
8. كل state transition واضحة وقابلة للاختبار.
9. Feature لا تعتبر مكتملة إلا عند توافق Backend + Frontend + Real API + Browser + Tests + Documentation.

# 30. Definition of Product Completion
دورة المنتج المستهدفة:
**Teacher creates Lesson → Lesson published → Student/Parent finds Lesson → Selects Lesson → Booking → Approval/Payment حسب النوع → Confirmed → Schedule → Session → Attendance → Completed → Rating → Financial Transaction / Reporting**

ويجب دعم:
- Online + Private
- Online + Group
- Offline + Private
- Offline + Group

ولكل من:
- Student
- Parent / Family
- Teacher
- Admin

# 31. ملاحظات التنفيذ
- هذه الوثيقة هي Product Requirements وليست implementation status.
- لا يعتبر أي بند مكتملًا لمجرد وجوده هنا.
- حالة التنفيذ تؤخذ من ملفات الـStatus والاختبارات.
- عند تغيير business rule يجب تحديث هذه الوثيقة ثم مراجعة Backend وFrontend والاختبارات والتوثيق المرتبط.