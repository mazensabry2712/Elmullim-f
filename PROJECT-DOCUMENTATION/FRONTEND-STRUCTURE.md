# Elmullim — Frontend Structure

## 1. Stack

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- TanStack React Query
- Axios
- Tailwind CSS
- React Hook Form / Zod
- Laravel Echo / Pusher
- Vitest / Playwright

## 2. Source Structure

```text
src/
├── animations/       # animations and motion helpers
├── components/       # reusable UI and feature components
├── config/           # application configuration such as Axios
├── constant/         # shared constants
├── enums/            # frontend enums/types
├── hooks/            # reusable React hooks
├── interfaces/       # data interfaces
├── layout/           # application layouts
├── lib/              # shared libraries/helpers
├── pages/            # route-level pages
├── providers/        # React providers
├── routes/           # router configuration
├── store/            # Redux store and slices
├── types/            # shared TypeScript types
└── utils/             # utility services
```

## 3. Routes

الـrouter يقسم الصفحات إلى:

- Public pages: home, about, contact, events, services, FAQs, testimonials, courses and lessons.
- Student protected pages.
- Teacher protected pages.
- Profile pages.
- Authentication pages.
- Unauthorized and Not Found pages.

## 4. API Communication

يتم استخدام Axios client مركزي، وتكون قيمة الـAPI base URL قادمة من إعدادات البيئة الخاصة بالـFrontend.

الطلبات الخاصة بالحساب والمحتوى والدفع والمحادثات تمر من الـFrontend إلى Laravel API.

## 5. State

Redux مخصص للحالة العامة، بينما React Query مناسب للبيانات المرتبطة بالـAPI والـserver state.

## 6. Forms

النماذج تستخدم React Hook Form مع validation عند الحاجة باستخدام Zod.

## 7. Realtime

Laravel Echo وPusher مسؤولان عن الاتصال بالـRealtime channels المطلوبة للمحادثات والتحديثات المباشرة.

## 8. Routing Rules

الصفحة لا تعتبر محمية فعليًا لمجرد إخفائها من الـFrontend. الـBackend هو المسؤول عن التأكد من هوية المستخدم ودوره وملكية المورد قبل تنفيذ العملية.
