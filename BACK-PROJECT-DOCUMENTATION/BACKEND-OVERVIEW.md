# Elmullim — Backend Overview

## 1. النظام

الـBackend هو Laravel application مسؤول عن منطق المنصة، الحسابات، المحتوى التعليمي، الدفع، المحادثات، والبيانات.

## 2. أنواع المستخدمين

### Student

- Register / Login / Logout.
- Email verification.
- Password reset/update.
- Profile.
- Course and lesson enrollment.
- Ratings.
- Payment.
- Access to purchased/enrolled learning content.

### Teacher

- Register / Login / Logout.
- Email verification.
- Profile.
- Course management.
- Lesson management.
- Contents and lectures management.
- Video upload.
- Quiz and question management.
- Ratings.
- Wallet and payouts.

### Family / Parent

- Register / Login / Logout.
- Email verification.
- Profile.
- Ratings and student-related information.

## 3. المحتوى التعليمي

التطبيق يدعم:

- Courses
- Course contents
- Course lectures
- Lessons
- Lesson contents
- Lesson lectures
- Quizzes
- Questions

## 4. الدفع

يحتوي الـBackend على تكامل Paymob لبدء الدفع واستقبال callback/webhook الخاص بالبوابة.

الـWebhook منفصل عن authentication الخاص بالطالب، ومعالجة نجاح الدفع تتم في الـBackend.

## 5. المحادثات وRealtime

المشروع يستخدم Musonza Chat مع Laravel Broadcasting وPusher لتوفير المحادثات والتحديثات المباشرة.

## 6. الفيديو

يوجد تكامل Vimeo، بالإضافة إلى رفع فيديوهات المحاضرات باستخدام chunk upload.

## 7. الأمان الأساسي

- Sanctum authentication.
- Guards منفصلة حسب المستخدم.
- Email verification للعمليات المقيدة.
- Rate limiting على عمليات التحقق واستعادة كلمة المرور ورفع الفيديوهات.
- Webhook payment مستقل عن session المستخدم.
- Idempotent transaction handling ضمن مسار الدفع.

## 8. طبقة الـAPI

الـAPI منظمة حسب domains وroles داخل `routes/api.php`، مع مسارات إضافية للمحادثات والـbroadcasting.
