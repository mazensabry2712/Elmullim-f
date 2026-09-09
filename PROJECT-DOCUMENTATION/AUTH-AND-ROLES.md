# Elmullim — Authentication and Roles

## 1. أنواع الحسابات

| Role | Backend Guard | Frontend Area |
|---|---|---|
| Student | `auth:student` | Student pages and profile |
| Teacher | `auth:teacher` | Teacher courses, lessons, quizzes and wallet |
| Parent / Family | `auth:family` | Family profile and student-related data |

## 2. دورة تسجيل الدخول

```text
Login Form
   ↓
Frontend Auth Service
   ↓
Laravel API
   ↓
Role-specific authentication
   ↓
Token / session state
   ↓
Frontend auth state
   ↓
Protected Routes
```

## 3. الحماية على الFrontend

`ProtectedRoute` يمنع الزائر غير المسجل من دخول الصفحات الخاصة، ويمكنه تقييد الصفحة حسب الـrole.

هذا الحارس وظيفته التحكم في التنقل والـUI فقط. لا يتم الاعتماد عليه كبديل عن authorization في الـBackend.

## 4. الحماية على الـBackend

المسارات الحساسة تستخدم guards مستقلة حسب نوع المستخدم، وبعض العمليات تتطلب التحقق من البريد الإلكتروني قبل السماح بتنفيذها.

## 5. حساب الطالب

المسارات الأساسية تكون تحت:

```text
/api/student/register
/api/student/login
/api/student/forget-password
/api/student/reset-password
/api/student/logout
/api/student/me
```

وتوجد عمليات إضافية للتسجيل في الدورات والدروس، التقييمات، والدفع.

## 6. حساب المعلم

المسارات الأساسية تكون تحت:

```text
/api/teacher/register
/api/teacher/login
/api/teacher/forget-password
/api/teacher/reset-password
/api/teacher/logout
/api/teacher/me
```

وتوجد تحت حساب المعلم عمليات إدارة الدورات والدروس والمحاضرات والاختبارات والمحفظة.

## 7. حساب ولي الأمر

المسارات الأساسية تكون تحت:

```text
/api/parent/register
/api/parent/login
/api/parent/forget-password
/api/parent/reset-password
/api/parent/logout
/api/parent/me
```

## 8. التحقق من البريد

النظام يحتوي على إرسال والتحقق من كود البريد الإلكتروني مع rate limiting على العمليات الحساسة.

## 9. استعادة كلمة المرور

الدورة العامة هي:

```text
Request Reset
    ↓
Receive Verification Code
    ↓
Verify Code
    ↓
Set New Password
```

كل التحقق النهائي يتم على الـBackend.

## 10. قواعد الصلاحيات

- الطالب يستخدم عمليات الطالب فقط.
- المعلم يستخدم عمليات المعلم فقط.
- ولي الأمر يستخدم عمليات الأسرة فقط.
- ملكية الموارد التعليمية يجب أن يتحقق منها الـBackend.
- تغيير قيمة role في المتصفح لا يمنح المستخدم صلاحية حقيقية على الـAPI.
