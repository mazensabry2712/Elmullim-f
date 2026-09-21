# Elmullim — Client Abbreviation

## استخدام الملف

هذا الملف هو مرجع مختصر لأسماء مراحل المشروع المستخدمة عند التعامل مع العميل على **مستقل** أو تنظيم العمل على **Trello**.

الأسماء قصيرة وثابتة، ويمكن استخدامها كأسماء Projects / Lists / Cards / Milestones.

---

## أسماء المراحل

| Code | اسم المرحلة | اسم مختصر للاستخدام |
|---|---|---|
| **PH1** | تثبيت الأساس والتشغيل | **Foundation & Setup** |
| **PH2** | المصادقة والصلاحيات والحماية | **Auth & Security** |
| **PH3** | وظائف المنصة والتكامل | **Features & Integration** |
| **PH4** | الاختبار والمراجعة والتسليم | **Testing & Delivery** |

---

## أسماء جاهزة لـ Trello

```text
PH1 — Foundation & Setup
PH2 — Auth & Security
PH3 — Features & Integration
PH4 — Testing & Delivery
```

## أسماء جاهزة لمستقل

```text
المرحلة 1 — تثبيت الأساس والتشغيل
المرحلة 2 — المصادقة والصلاحيات والحماية
المرحلة 3 — وظائف المنصة والتكامل
المرحلة 4 — الاختبار والمراجعة والتسليم
```

## اختصار شديد للكروت والمهام

```text
PH1 — Setup
PH2 — Auth
PH3 — Features
PH4 — Delivery
```

## قاعدة الاستخدام

- استخدم **PH1 / PH2 / PH3 / PH4** كـ IDs ثابتة للمراحل.
- استخدم الاسم الإنجليزي المختصر في Trello عندما تكون أسماء القوائم أو الـCards بالإنجليزية.
- استخدم الاسم العربي في عروض ومستندات العميل على مستقل.
- لا يتم تغيير أكواد المراحل حتى لو تم تعديل صياغة الاسم المعروض.

---

## التسلسل الرسمي

**PH1 → PH2 → PH3 → PH4**

هذه هي أسماء المراحل المعتمدة للمشروع للاستخدام الإداري والتنظيمي والتواصل مع العميل.


---

# Admin Panel Track

هذه مرحلة تشغيلية مستقلة داخل المشروع، وتُنفذ على Backend/Admin Panel مع المحافظة على تكامل الـFrontend.

| Code | المرحلة | الاسم المختصر |
|---|---|---|
| **AP0** | تثبيت الـAdmin الحالي وإصلاح التناقضات | **Admin Stabilization** |
| **AP1** | لوحة التحكم التشغيلية | **Admin Dashboard** |
| **AP2** | إدارة الدروس والاعتماد | **Lesson Administration** |
| **AP3** | إدارة الحجوزات | **Booking Administration** |
| **AP4** | إدارة الجلسات والـCalendar | **Sessions & Calendar** |
| **AP5** | مراقبة الحضور | **Attendance Administration** |
| **AP6** | الإدارة المالية | **Financial Administration** |
| **AP7** | إدارة ومراجعة التقييمات | **Reviews Administration** |
| **AP8** | مراقبة Availability وService Areas | **Availability & Areas** |
| **AP9** | Communication وNotifications | **Communication & Notifications** |
| **AP10** | التقارير والضوابط النهائية | **Reports & Final Controls** |
| **AP11** | اختبار Admin + Platform وتسليم المرحلة | **Admin QA & Delivery** |

## أسماء جاهزة لـ Trello

```text
AP0 — Admin Stabilization
AP1 — Admin Dashboard
AP2 — Lesson Administration
AP3 — Booking Administration
AP4 — Sessions & Calendar
AP5 — Attendance Administration
AP6 — Financial Administration
AP7 — Reviews Administration
AP8 — Availability & Areas
AP9 — Communication & Notifications
AP10 — Reports & Final Controls
AP11 — Admin QA & Delivery
```

## قاعدة تنفيذ الـAdmin

لا يتم الانتقال من AP إلى المرحلة التالية إلا بعد اجتياز:

```Backend
+ Permissions
+ Admin UI
+ Tests
+ Real API verification where applicable
+ Browser verification
+ Documentation
```

الـMaster roadmap التفصيلي موجود في Backend داخل:
`PROJECT-DOCUMENTATION/ADMIN-PANEL-ROADMAP.md`
