# Elmullim — Backend Operations Guide

## 1. Requirements

- PHP 8.2+
- Composer 2
- Database server
- Node.js/npm for frontend assets and development tooling when required

## 2. Installation

```bash
composer install
copy .env.example .env
php artisan key:generate
```

اضبط بيانات قاعدة البيانات والخدمات الخارجية داخل `.env`.

## 3. Database

```bash
php artisan migrate
```

واستخدم seeders فقط عندما تكون بيانات seed مطلوبة للبيئة الحالية.

## 4. Storage

```bash
php artisan storage:link
```

## 5. تشغيل التطبيق

```bash
php artisan serve
```

## 6. Queue

المشروع يحتوي على تشغيل queue ضمن بيئة التطوير. في Production يجب تشغيل worker/queue process بالطريقة المناسبة للـhosting المستخدم.

## 7. Realtime

للمحادثات والتحديثات المباشرة يجب ضبط بيانات Pusher/Broadcasting في البيئة وتشغيل إعدادات Laravel الخاصة بالـbroadcasting.

## 8. Email

اضبط MAIL_* داخل `.env` حسب مزود البريد المستخدم. عمليات التحقق واستعادة كلمة المرور تعتمد على البريد الإلكتروني.

## 9. Paymob

اضبط بيانات Paymob المطلوبة فقط داخل environment variables، ولا تضع المفاتيح داخل source code.

التدفق الأساسي:

```text
Frontend
  ↓
Start Payment API
  ↓
Paymob
  ↓
Webhook POST
  ↓
Laravel validates callback
  ↓
Payment / Transaction processing
```

## 10. Vimeo

اضبط مفاتيح Vimeo المطلوبة في بيئة الـBackend إذا كان الفيديو يعتمد على Vimeo في البيئة الحالية.

## 11. Production Laravel Commands

بعد نشر الكود وضبط البيئة:

```bash
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

استخدم `migrate --force` فقط في بيئة Production وبعد التأكد من migrations.

## 12. Health Check يدوي

بعد التشغيل تأكد من:

- API يستجيب.
- تسجيل الدخول لكل role يعمل.
- البريد يعمل.
- قاعدة البيانات متصلة.
- الدورات والدروس تظهر.
- التسجيل في المحتوى يعمل.
- الدفع يصل إلى Paymob ويعود عبر webhook.
- الـRealtime/chat يعمل عند تفعيل Pusher.
- ملفات الفيديو والـstorage تعمل.
