# Elmullim — Running Guide

## 1. المتطلبات

### Frontend

- Node.js
- npm
- Git

### Backend

- PHP 8.2 أو أحدث ومتوافق مع `composer.json`.
- Composer 2.
- MySQL أو قاعدة البيانات المحددة في ملف البيئة.
- Node.js وnpm مطلوبان عند تشغيل Vite/الـdevelopment tooling الخاص بالمشروع.

## 2. تشغيل الـBackend

```bash
cd Elmullim-b
composer install
```

انسخ ملف البيئة:

```bash
copy .env.example .env
```

ثم أنشئ application key:

```bash
php artisan key:generate
```

اضبط بيانات قاعدة البيانات والخدمات الخارجية في `.env` ثم نفذ:

```bash
php artisan migrate
```

لو كانت المنصة تستخدم ملفات تخزين محلية:

```bash
php artisan storage:link
```

شغل الخادم:

```bash
php artisan serve
```

في وضع التطوير يمكن استخدام إعداد `composer dev` الموجود في المشروع لتشغيل خدمات التطوير المطلوبة معًا.

## 3. تشغيل الـFrontend

```bash
cd Elmullim-f
npm install
```

أنشئ ملف `.env` اعتمادًا على `.env.example` وضع عنوان الـBackend المطلوب.

ثم:

```bash
npm run dev
```

للوصول من أجهزة أخرى على نفس الشبكة:

```bash
npm run host
```

## 4. Build

```bash
npm run build
```

ينتج Vite نسخة Production داخل مجلد `dist`.

## 5. الاختبارات

### Frontend

```bash
npm run test:run
npm run test:coverage
npm run test:e2e
```

لـ E2E الخاص بالـ booking يمكن تحديد الـFrontend والـBackend بشكل صريح:

```powershell
$env:E2E_BASE_URL="http://127.0.0.1:5173"
$env:E2E_API_BASE_URL="http://Elmullim-b.test"
$env:E2E_STUDENT_EMAIL="student@elmullim.test"
$env:E2E_STUDENT_PASSWORD="Student@12345"
npm run test:e2e
```

الـ E2E لا يستخدم Production API. محليًا يستخدم booking E2E افتراضيًا `http://Elmullim-b.test`. في CI يعمل اختبار الـhome/smoke دائمًا، بينما يتخطى booking E2E فقط عند غياب `E2E_API_BASE_URL`. لتفعيل booking E2E في CI يجب توفير `E2E_API_BASE_URL` وبيانات حساب اختبار مخصص من Repository Secrets.

### Backend

```bash
php artisan test
```

## 6. متغيرات البيئة المهمة

الـFrontend يحتاج على الأقل إلى عنوان الـAPI في متغير البيئة الخاص بـVite.

الـBackend يحتاج إلى إعدادات التطبيق، قاعدة البيانات، البريد، Sanctum، Paymob، Pusher، Vimeo وأي خدمة مستخدمة فعليًا في بيئة التشغيل.

**لا تضع مفاتيح سرية داخل ملفات المصدر أو داخل مستودع Git.**

## 7. ترتيب التشغيل المحلي

```text
1. Start Database
2. Start Laravel Backend
3. Start Queue/Realtime services when required by the environment
4. Start React/Vite Frontend
5. Open the Frontend URL
```

## 8. ملاحظات Production

- استخدم إعدادات البيئة الخاصة بـProduction.
- تأكد أن الـAPI URL يشير إلى عنوان الـBackend الصحيح.
- استخدم HTTPS.
- شغل cache/optimization الخاصة بـLaravel عند النشر.
- تأكد من تشغيل queue workers عند استخدام الوظائف التي تعتمد على الـqueue.
- تأكد من إعداد Pusher/Vimeo/Paymob والبريد حسب الخدمات المستخدمة فعليًا.
