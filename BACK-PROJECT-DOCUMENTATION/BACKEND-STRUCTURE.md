# Elmullim — Backend Structure

## 1. Laravel Application

```text
app/
├── Broadcasting/       # Broadcasting events
├── Enums/              # Domain enums
├── Events/             # Application events
├── Http/
│   └── Controllers/
│       └── Api/
│           ├── Family/
│           ├── Student/
│           ├── Teacher/
│           └── shared API controllers
├── Models/             # Eloquent models
├── Notifications/      # Notifications when present
├── Policies/           # Authorization rules where used
└── Services/           # Shared application services where present
```

## 2. Routes

الـAPI الرئيسي موجود في:

```text
routes/api.php
```

وتوجد ملفات منفصلة لـ:

```text
routes/auth.php
routes/chat.php
routes/channels.php
routes/panel.php
routes/web.php
routes/console.php
```

## 3. Controllers

الـControllers مقسمة حسب المستخدم أو الـdomain، مثل:

```text
Api/Student
Api/Teacher
Api/Family
```

وموجودة Controllers مشتركة للمحتوى العام والدورات والدروس والمحادثات.

## 4. Authentication

Sanctum مستخدم مع guards منفصلة لكل نوع حساب. الـroutes الحساسة يتم وضعها داخل middleware authentication، وبعضها داخل middleware التحقق من البريد.

## 5. Content Management

المعلم يمتلك APIs منفصلة لإدارة:

- Courses
- Lessons
- Contents
- Lectures
- Videos
- Quizzes
- Questions

## 6. Payment Domain

مسار الدفع يتكون من:

```text
Student starts payment
        ↓
Payment gateway
        ↓
Paymob webhook
        ↓
Backend verifies callback
        ↓
Transaction / payment state
        ↓
Enrollment state
```

## 7. Chat Domain

المحادثات موزعة بين chat routes/controllers، events، broadcasting channels، ومزود Pusher/Realtime.

## 8. Database

Eloquent models والمigrations هي المصدر الأساسي لتعريف البيانات والعلاقات. يجب تنفيذ migrations قبل تشغيل النظام.

## 9. Testing

الاختبارات تستخدم Pest وتوجد Feature tests للحسابات والـprofiles وغيرها من وظائف الـAPI.
