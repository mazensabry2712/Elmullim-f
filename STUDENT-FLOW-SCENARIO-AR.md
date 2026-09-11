# سيناريو الطالب الكامل — Elmullim

## الهدف

هذا المستند يعرّف سيناريو الطالب من لحظة فتح صفحة تسجيل الدخول وحتى استخدام الحساب وتسجيل الخروج، مع نقاط التحقق بين الـFrontend والـBackend.

## 1. بيانات الطالب التجريبية

يتم إنشاء حساب الطالب من `database/seeders/TestAccountsSeeder.php` في الـBackend.

```text
Email:    student@elmullim.test
Password: Student@12345
Role:     student
Email verification: already verified
```

قبل الاختبار المحلي يجب أن يكون Frontend متصلًا بالـBackend المحلي:

```env
VITE_API=http://elmullim-b.test
VITE_ENV=local
```

ثم إعادة تشغيل Vite بعد أي تعديل على `.env`.

---

## 2. الدخول إلى شاشة الطالب

الـFlow في الـFrontend:

```text
/login
  ↓
Choose Sign in
  ↓
Sign in as a student
  ↓
/sign-in
```

الـStudent route موجود في `src/routes/authRoutes.tsx`.

---

## 3. Validation قبل إرسال الطلب

الـStudent Login يستخدم `signInSchema`:

- Email مطلوب ويجب أن يكون Email صحيحًا.
- Password مطلوب.

في حالة validation failure يجب عدم إرسال API request، ويظهر الخطأ بجانب الحقل.

---

## 4. Student Login API

الـFrontend يرسل:

```http
POST /api/student/login
Content-Type: application/json

{
  "email": "student@elmullim.test",
  "password": "Student@12345"
}
```

الـBackend route:

```text
POST /api/student/login
```

الـBackend يبحث عن الطالب في جدول `students` ويتحقق من كلمة المرور باستخدام `Hash::check` ثم ينشئ Sanctum token.

الـsuccess response المتوقعة:

```json
{
  "status": true,
  "message": "success login",
  "data": {
    "token": "..."
  }
}
```

---

## 5. بعد نجاح Login

الـFrontend يجب أن ينفذ بالترتيب:

```text
API success
  ↓
Redux auth.login()
  ↓
Cookie: t_n = token
Cookie: r_l = student
  ↓
Navigate → /profile
```

الـ`ProtectedRoute` يعتبر الطالب authenticated عندما يوجد token صالح و`isAuthenticated=true`، ويتحقق من الـrole عند الحاجة.

---

## 6. فتح Student Profile

الصفحة:

```text
/profile
```

تختار `Profile.tsx` نوع الـprofile حسب الـrole:

```text
student → StudentProfile
teacher → TeacherProfile
parent  → ParentProfile
```

داخل Student Profile توجد Tabs:

```text
Main
My Courses
My Lessons
Chat
Quizzes
```

---

## 7. Main Profile

بعد الدخول يتم تحميل:

```http
GET /api/student/me
Authorization: Bearer <token>
```

ومتوقع أن تظهر:

- اسم الطالب
- Email
- Education Level
- Description
- Profile image عند وجودها
- Favorite subjects
- Teacher ratings
- Personal data

ويتم كذلك طلب:

```http
GET /api/student/rating/received-all
```

في حالة عدم وجود Ratings يجب أن يظهر `No ratings yet` بدل كسر الصفحة.

---

## 8. Student Courses

Tab:

```text
My Courses
```

الطلب:

```http
GET /api/student/enrolling/courses
Authorization: Bearer <token>
```

السيناريوهات:

```text
لا توجد courses enrolled
    → Empty state

توجد courses
    → عرض CoursesList
    → فتح Course Details
    → View Course حسب الصلاحية
```

الـseed الحالي ينشئ Courses مرتبطة بالـDemo Teacher، لذلك توجد بيانات أساسية للـcourses بعد `migrate:fresh --seed`.

---

## 9. Student Lessons

Tab:

```text
My Lessons
```

الطلب:

```http
GET /api/student/enrolling/lessons
Authorization: Bearer <token>
```

السيناريوهات:

```text
لا توجد lessons enrolled
    → Empty state

توجد lessons
    → عرض LessonsList
    → فتح Lesson Details
    → View Lesson حسب الصلاحية
```

الـseed الحالي ينشئ Lessons مرتبطة بالـDemo Teacher.

---

## 10. Free Enrollment

لدرس مجاني:

```http
POST /api/student/enrolling/lessons/{lesson_id}/enroll
```

وللكورس المجاني:

```http
POST /api/student/enrolling/courses/{course_id}/enroll
```

قواعد الـBackend:

- لا يسمح بالتسجيل مرتين.
- لا يسمح باستخدام هذا endpoint لمورد مدفوع.
- عند النجاح يضاف enrollment للطالب.

بعد ذلك يجب أن يظهر المورد داخل `My Courses` أو `My Lessons`.

---

## 11. Paid Course / Paid Lesson

الـStudent يبدأ الدفع من:

```http
POST /api/student/payment/intiate
```

والـBackend يتحقق من:

- وجود المورد.
- أن السعر أكبر من صفر.
- أن الطالب غير مسجل بالفعل.
- ثم ينشئ Paymob order ويكمل الدفع.

بعد الدفع الناجح يصل Paymob webhook إلى:

```http
POST /api/student/payment/callback
```

ثم يتم:

```text
Order = SUCCESS
  ↓
Enrollment
  ↓
Teacher Transaction
  ↓
Student can access the resource
```

### ملاحظة

الدفع الحقيقي لا يكتمل محليًا بدون إعداد Paymob المطلوب، لذلك اختبار الدفع الكامل يحتاج بيئة Paymob مهيأة أو flow mock/test مناسب.

---

## 12. Payment Result

بعد مسار الدفع يستطيع الطالب طلب:

```http
GET /api/student/payment/callback?order=<paymob_order_id>
Authorization: Bearer <token>
```

الـendpoint يعيد حالة الطلب و`transaction_id` ولا يجب أن يعتبر مجرد redirect إثباتًا للدفع.

---

## 13. Quizzes

Tab:

```text
Quizzes
```

الـAPI المتاح للطالب:

```http
GET  /api/student/quizzes
GET  /api/student/quizzes/{id}
POST /api/student/quizzes/{id}/start
POST /api/student/quizzes/{id}/submit
GET  /api/student/quizzes/{id}/result
```

قواعد الـQuiz الحالية تشمل:

- فلترة الـquizzes حسب `education_level_id` للطالب.
- لا يمكن بدء Quiz بدون Questions.
- لا يمكن البدء قبل وقت البداية.
- يمنع الإرسال بعد انتهاء الـdeadline.
- يجب إرسال إجابة لكل سؤال.
- يجب أن تكون الخيارات المختارة تابعة لنفس الـQuiz.
- يحسب score وpercentage وcorrect answers.
- يحفظ attempt وanswers.
- يمنع تكرار submission بعد النجاح.

### ملاحظة عن الـSeed

الـ`DatabaseSeeder` الحالي لا يستدعي `QuizSeeder`، لذلك وجود تبويب Quizzes لا يعني أن هناك Quiz data جاهزة بعد `migrate:fresh --seed`. لاختبار هذا الجزء كاملًا يجب إضافة بيانات Quiz + Questions + Options في بيئة الاختبار.

---

## 14. Chat

Tab:

```text
Chat
```

الـChat محمي بـ:

```text
auth:sanctum
hasVerified
```

العمليات الرئيسية:

```http
GET  /api/chat/a/conversations
GET  /api/chat/a/{conversation_id}
POST /api/chat/a/{conversation_id}/messages/create
POST /api/chat/a/conversations/{user_id}/new
POST /api/chat/a/{conversation_id}/clear
POST /api/chat/a/{conversation_id}/messages/{message_id}/delete
POST /api/chat/a/{conversation_id}/messages/{message_id}/flag/toggle
GET  /api/chat/a/messages/flagged
```

لاختبار Chat كاملًا يجب وجود مستخدم آخر/Teacher مناسب وإنشاء Conversation فعلية.

---

## 15. Teacher Ratings

الطالب يستطيع تقييم المعلم من:

```http
POST /api/student/rating/{teacher_id}/rate
```

والاطلاع على التقييمات الواردة:

```http
GET /api/student/rating/received-all
```

والتقييمات التي أعطاها:

```http
GET /api/student/rating/given-all
```

---

## 16. Update Student Profile

الطلب:

```http
POST /api/student/me
Authorization: Bearer <token>
```

يشمل:

- Name
- Email
- Phone
- Address
- Education Level
- Gender
- Description
- Favorite Subjects
- Profile Image

عند تغيير Email يجب أن تصبح حالة الـverification غير مؤكدة ويبدأ verification flow جديد.

---

## 17. Email Verification

للتحقق اليدوي:

```http
POST /api/student/verification-email/verify
Authorization: Bearer <token>

{
  "code": "123456"
}
```

الحساب التجريبي تم إنشاؤه أصلًا بـ`email_verified_at`، لذلك لا يجب أن يتوقف Student Demo Login بانتظار verification.

---

## 18. Password Management

Forgot Password:

```http
POST /api/student/forget-password
```

Reset Password:

```http
POST /api/student/reset-password
```

Update Password بعد تسجيل الدخول:

```http
POST /api/student/update-password
Authorization: Bearer <token>
```

---

## 19. Logout

زر Logout يجب أن ينفذ:

```http
POST /api/student/logout
Authorization: Bearer <token>
```

ثم:

```text
clear token
clear role
Redux isAuthenticated = false
redirect → /login
```

---

## 20. Session / Refresh Scenario

بعد تسجيل الدخول:

```text
Refresh Browser
  ↓
Cookie t_n موجود
  ↓
Redux initial state = authenticated
  ↓
ProtectedRoute يسمح بالدخول
```

وعند انتهاء/إبطال الـtoken:

```text
API returns 401
  ↓
Axios interceptor
  ↓
logout()
  ↓
clear cookies
  ↓
user must login again
```

---

# Full Student Acceptance Flow

## Happy Path

```text
1. Open /login
2. Choose Student
3. Open /sign-in
4. Enter student@elmullim.test
5. Enter Student@12345
6. Click Login
7. POST /api/student/login → 200
8. Save Sanctum token
9. Save role=student
10. Navigate /profile
11. GET /api/student/me → 200
12. GET /api/student/rating/received-all → 200
13. Student Profile renders
14. My Courses loads
15. My Lessons loads
16. Chat loads when conversations exist
17. Quizzes loads when quiz data exists
18. Free enrollment works for free resources
19. Paid flow works when Paymob is configured
20. Student can update profile
21. Student can rate teacher
22. Student can logout
23. /profile becomes protected again
```

# Failure Cases That Must Be Tested

```text
Invalid email format
Empty password
Wrong password
Unknown student email
Missing/invalid API URL
Backend unavailable
401 token
403/verification restrictions
Empty courses
Empty lessons
Quiz without questions
Quiz outside start time
Quiz after deadline
Incomplete quiz submission
Invalid option for quiz question
Duplicate enrollment
Duplicate quiz submission
Payment failure
Invalid payment signature
Logout with expired token
```

# Current Readiness

## Ready

- Student seeded account.
- Student password hash verified.
- Student email marked verified.
- Student login API.
- Student login frontend flow.
- Sanctum student guard.
- Student profile endpoint.
- Student courses endpoint.
- Student lessons endpoint.
- Student enrollment endpoints.
- Student ratings endpoints.
- Student password endpoints.
- Student logout endpoint.
- Student quiz backend endpoints.
- Student chat endpoints.

## Requires Additional Test Data / External Setup

- Quiz data is not currently included in `DatabaseSeeder`.
- Real Paymob payment requires Paymob configuration.
- Full Chat requires a second user and a Conversation.
- Realtime Chat requires the configured Pusher/Echo environment.

## Local Verification Checklist

Backend:

```powershell
cd C:\Herd\Elmullim-b
git pull origin main
php artisan migrate:fresh --seed
```

Frontend:

```powershell
cd C:\Herd\Elmullim-f
npm run dev
```

Then verify the browser request:

```text
POST http://elmullim-b.test/api/student/login
```

Expected result:

```text
200
status=true
message=success login
```

After that verify:

```text
/profile
GET /api/student/me
GET /api/student/rating/received-all
```

The scenario is considered successful only when the student can complete the full flow without being unexpectedly redirected back to `/login`.
