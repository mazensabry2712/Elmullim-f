# Elmullim — Project Documentation

هذا المجلد هو المرجع الأساسي لفهم وتشغيل حالة **Elmullim** من جهة الـFrontend.

## أهم الوثائق الحالية

- `SYSTEM-OVERVIEW.md` — نظرة عامة على النظام ومكوناته.
- `RUNNING.md` — خطوات التشغيل والبناء.
- `AUTH-AND-ROLES.md` — المستخدمون والمصادقة والصلاحيات الحالية.
- `FRONTEND-STRUCTURE.md` — تنظيم مشروع الواجهة.
- `IMPLEMENTATION-ROADMAP-STATUS.md` — الحالة التنفيذية الحالية وما تم وما تبقى.
- `CLIENT.md` — تقرير حالة وتسليم موجه للعميل.
- `BOOKING-FRONTEND-API-MATRIX.md` — حالة التكامل بين واجهة الحجز والـBackend.
- `BOOKING-FRONTEND-IMPLEMENTATION.md` — تفاصيل تنفيذ الحجز والدفع والجلسات والحضور والإشعارات.
- `AVAILABILITY-CALENDAR-STATUS.md` — حالة Availability/Calendar الحالية.
- `client_abbreviation.md` — أسماء المراحل المختصرة للاستخدام في متابعة العمل.

## مبدأ التوثيق

- وثائق الـRequirements تصف السلوك المطلوب.
- وثائق الـStatus تصف ما تم تنفيذه فعليًا وما هو متبقٍ.
- وثيقة `CLIENT.md` هي الملخص المناسب للمراجعة والتسليم للعميل.
- أي Feature لا يتم اعتبارها مكتملة لمجرد وجود كود أو Tests؛ يجب أن تتوافق Backend + Frontend + Real API + Browser Verification + Tests + Documentation.
- وثائق الـPhase القديمة تحتفظ بسجل نقاط التحقق التاريخية، بينما يتم الاعتماد على وثائق الـStatus الحالية لمعرفة الحالة الفعلية.

## التقنية الحالية

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack React Query
- Axios
- Laravel Echo / Broadcasting
- Vitest
- Playwright
