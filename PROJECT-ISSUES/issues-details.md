# Project Issues — Detailed Audit

هذا الملف يوثق المشاكل المؤكدة من فحص الكود الحالي والملفات المرفوعة إلى المستودع. الوصف هنا يشرح المشكلة وأثرها، بدون اقتراح حلول أو خطوات إصلاح.

## 01 — Dependency Conflict: React 19.1.0 vs react-loader-spinner 6.1.6

المشروع كان يطلب React 19.1.0 بينما الإصدار 6.1.6 من `react-loader-spinner` يعلن peer dependency لا تتجاوز React 18. هذا التعارض منع `npm install` من حل شجرة الاعتمادات بشكل طبيعي، وأدى إلى فشل التثبيت قبل الوصول إلى build.

## 02 — Exposed .env File in Public Repository

ملف `.env` موجود داخل المستودع العام ويحتوي على إعدادات تشغيل ومفاتيح مستخدمة من التطبيق. وجود ملف البيئة المتعقب داخل Git يجعل قيمه متاحة لأي شخص لديه وصول إلى المستودع، كما يجعل تغييرها لاحقًا أصعب لأن القيمة قد تبقى في سجل Git.

## 03 — Client-Side Encryption Secret Exposed via VITE_ Environment Variable

التطبيق يقرأ `VITE_ENCRYPT_SECRET_KEY` داخل كود المتصفح ويستخدمه في `CryptoJS.AES.encrypt/decrypt`. أي قيمة تبدأ بـ`VITE_` يتم تضمينها في client bundle، وبالتالي المفتاح المستخدم في هذا التشفير ليس سرًا فعليًا من منظور المتصفح.

## 04 — Authentication Token Stored in JavaScript-Accessible Cookie

`cookieService` يخزن access token باستخدام JavaScript cookie API ولا توجد `HttpOnly` attribute لأن الكوكي يتم إنشاؤه من JavaScript. هذا يجعل التوكن قابلًا للوصول من كود الصفحة في حال نجاح XSS أو أي كود غير موثوق في نفس origin.

## 05 — Client-Side Role Cookie Used for Authorization Decisions

الدور يتم تخزينه في cookie باسم `r_l` ويُقرأ من `cookieService.getRole()`. واجهة التطبيق تستخدم هذه القيمة في `ProtectedRoute` لاتخاذ قرار السماح بالمسارات، رغم أن قيمة client-side قابلة للتغيير من المستخدم ولا تمثل authorization موثوقًا.

## 06 — Password-Reset Authorization State Trusted from Client-Side Cookie

بعد طلب استعادة كلمة المرور، يتم تخزين role مشفر في `_cr_p` داخل cookie على جهاز العميل، ثم يعتمد `getCanResetPass()` على هذا الـcookie لتحديد الدور المسموح في شاشة reset password. هذا يجعل حالة وسيطة مرتبطة بتدفق أمني حساس موجودة بالكامل في متصفح المستخدم.

## 07 — Malformed Encrypted Reset Cookie Can Break Password-Reset Flow

`getCanResetPass()` يستدعي `decryptData()` ثم يحاول تحليل الناتج كـJSON بدون وجود معالجة خطأ محلية للحالة التي تكون فيها قيمة `_cr_p` تالفة أو غير صالحة. قيمة cookie غير متوقعة يمكن أن تؤدي إلى exception بدل إرجاع حالة عدم صلاحية نظيفة.

## 08 — RootLayout Owns Authentication Validation for Public and Protected Areas

`RootLayout` يحتوي على منطق `checkAuth` الخاص بالجلسة، بينما هذا الـlayout هو الغلاف للمسارات العامة وكذلك المسارات المحمية. بالتالي عملية session validation مرتبطة بجذر الموقع بدل أن تكون مرتبطة بحدود المصادقة نفسها، ما يجعل مسؤولية الـlayout مختلطة بين العرض وإدارة الجلسة.

## 09 — Authentication Validation Request Is Not Aborted When the Layout Unmounts

تمت إضافة flag باسم `cancelled` لمنع تطبيق نتيجة الطلب بعد unmount، لكن الطلب الشبكي نفسه لا يتم إلغاؤه. هذا يعني أن request يمكن أن يستمر في الخلفية حتى بعد انتهاء مكوّن `RootLayout` من استخدامه.

## 10 — Missing /unauthorized Route

`ProtectedRoute` يستخدم `/unauthorized` عند فشل فحص الدور، بينما المسار لم يكن موجودًا في النسخة الأصلية وكان يسقط عمليًا إلى `NotFound`. هذا يجعل حالة عدم السماح تظهر كأن الصفحة غير موجودة بدل كونها حالة صلاحيات مستقلة.

## 11 — Inconsistent Route Naming Between /course and /courses

المشروع يستخدم plural convention في بعض المسارات مثل `/courses/:courseId` بينما يستخدم singular `/course/:courseId/enroll` في مسار آخر لنفس المجال. عدم الاتساق في naming يجعل routing contract أقل وضوحًا ويزيد فرص hard-coded path mismatches.

## 12 — Duplicate Role-to-Route Mapping Logic

أكثر من خدمة في auth تبني prefix المسار بهذه الصيغة المتكررة: teacher/parent/student عبر nested ternary. تكرار نفس القرار في عدة أماكن يجعل أي تغيير لاحق في أسماء الأدوار أو endpoints معرضًا لعدم الاتساق بين الخدمات.

## 13 — Authentication State Has Multiple Sources of Truth

الجلسة موزعة بين Redux state، وtoken cookie، وrole cookie، ونتيجة `checkAuth` من الـAPI. نفس مفهوم "هل المستخدم مسجل؟ ومن هو؟" لا يأتي من مصدر واحد، ولذلك يمكن أن تكون هذه الحالات غير متزامنة مؤقتًا أو دائمًا.

## 14 — Weak Authentication State Model

`authSlice` يخزن `isAuthenticated` فقط. لا توجد حالة صريحة لكون الجلسة قيد التحقق أو المستخدم معروف أو غير معروف، ولا توجد بيانات مستخدم وrole موحدة داخل state، مما يترك أجزاء متعددة من التطبيق تعتمد على cookies مباشرة.

## 15 — Client-Side Role Determines Profile Rendering

صفحة `Profile` تقرأ role من cookie وتقرر تحميل `TeacherProfile` أو `ParentProfile` أو `StudentProfile` بناءً على هذه القيمة. وبالتالي اختيار واجهة الحساب في العميل يعتمد على بيانات قابلة للتغيير من المتصفح، مع أن المصدر الحقيقي للدور يفترض أن يكون session identity الموثوقة.

## 16 — ProtectedRoute Performs Client-Side Authorization Based on Mutable Cookie Role

`ProtectedRoute` يقارن `requiredRole` مع قيمة `r_l` القادمة من cookie. هذا يمثل UI guard فقط لكنه موجود بصيغة قد تبدو كأنها authorization كاملة، بينما تغيير cookie يغير القرار المحلي قبل أي تحقق backend في نفس المكوّن.

## 17 — Axios Authentication Headers Are Duplicated Across Services

العديد من service functions تستقبل token صراحة وتبني `Authorization: Bearer ...` بنفسها. هذا يكرر مسؤولية session transport في طبقة الأعمال ويجعل طريقة إرسال التوثيق غير موحدة بين الخدمات.

## 18 — Axios 500 Error Detection Uses the Wrong Error Property

في response interceptor يتم فحص `error?.response?.status` لحالة 401، لكن فحص 500 يستخدم `error?.status`. في Axios الأخطاء الشبكية المعتادة يكون HTTP status داخل `error.response.status`، لذلك منطق 500 الحالي لا يعتمد على نفس error shape الذي يعتمد عليه 401.

## 19 — Global Axios 401 Interceptor Forces Logout for Every Matching API Request

أي request عبر `axiosAPI` يرجع 401 يؤدي مباشرة إلى `store.dispatch(logout())` مع toast. هذا السلوك global وغير مربوط بنوع الطلب، لذلك أي endpoint يعيد 401 لأسباب تخص ذلك المورد يمكن أن يتسبب في إنهاء session على مستوى التطبيق كله.

## 20 — React Query Online-State Configuration Uses a Non-Reactive Snapshot

`QueryProvider` يحدد `enabled` باستخدام `navigator.onLine` وقت إنشاء `QueryClient`. هذه قراءة لحظية وليست state تفاعلية، وبالتالي تغيّر حالة الاتصال بعد إنشاء العميل لا يغير هذه القيمة نفسها.

## 21 — API Query Parameters Are Manually Concatenated Without Encoding

`getAllCourses` يبني query string يدويًا من خلال `${q}` داخل URL. قيم البحث التي تحتوي على spaces أو `&` أو `?` أو رموز خاصة قد تغيّر صياغة URL أو تنتج query parameters مختلفة عن القيمة المقصودة.

## 22 — API Response Contracts Are Trusted Only at Compile Time

الـinterfaces وTypeScript types تصف الاستجابات المتوقعة لكنها لا تتحقق من response runtime. التطبيق يأخذ `data` من Axios ويعامله كأنه مطابق للـinterface بدون schema validation في runtime، لذلك اختلاف API response عن النوع المكتوب قد يصل مباشرة إلى components.

## 23 — Pusher/Echo Authentication Token Is Captured Once at Module Initialization

`src/lib/echo/echo.ts` يقرأ `cookieService.getToken()` أثناء تحميل module ويضع القيمة مباشرة داخل `auth.headers`. لو تغير token بعد تسجيل الدخول أو تبديل session، instance الحالية من Echo تحتفظ بقيمة التوكن التي قرأتها وقت initialization.

## 24 — ChatWindow Calls leaveAllChannels and Can Disrupt Other Realtime Channels

عند فتح محادثة، `ChatWindow` يستدعي `echo.leaveAllChannels()` قبل الاشتراك في قناة المحادثة المحددة. هذا لا يترك قناة المحادثة فقط، بل يزيل كل القنوات التي يستخدمها نفس Echo instance، ما قد يؤثر على realtime features أخرى في التطبيق.

## 25 — Chat Code Contains Production Console Logging and Browser Alerts

كود chat يحتوي على `console.log` و`console.error` ويستخدم `alert()` و`window.confirm()` مباشرة. هذه الآليات موزعة داخل feature production code بدل وجود notification/error UX موحد، كما أن logs قد تتضمن identifiers خاصة بالمحادثات وأخطاء realtime.

## 26 — ChatWindow Contains a Large Embedded Base64 Image

داخل `ChatWindow.tsx` توجد صورة كاملة مضمنة كـbase64 داخل JSX. هذا يرفع حجم source module والـbundle المرتبط بالـchat بدل تحميل الأصل كasset مستقل، كما يصعّب إدارة الصورة أو استبدالها لاحقًا.

## 27 — Chat Sidebar Is Excessively Large and Creates a Heavy Bundle Boundary

`SideBar.tsx` حجم الملف نفسه كبير جدًا مقارنة بمكوّن React معتاد، وهو جزء من feature chat. تضخم المكوّن، مع منطق العرض والحالة والبحث والـconversation management داخل نفس الملف، يزيد تعقيد الصيانة ويجعل حدود إعادة التحميل والتقسيم أقل كفاءة.

## 28 — Large Production JavaScript and CSS Bundles

نتيجة الـproduction build أظهرت chunk للـChat بحجم يقارب 425 KB قبل الضغط و277 KB gzip، كما ظهر ملف CSS رئيسي بحجم يتجاوز 1.2 MB قبل الضغط. هذه الأحجام تشير إلى حمل client مرتفع خصوصًا عند أول استخدام للواجهة أو عند تحميل أجزاء تحتوي على dependencies وfont assets كثيرة.

## 29 — Missing Route-Level Error Boundaries

ملفات routing تحتوي على `errorElement` معلّق في `RootLayout` و`AuthLayout`، بينما التطبيق يعتمد على `NotFound` لمسار النجمة فقط. هذا يغطي 404 لكنه لا يمثل boundary مستقلة لأخطاء rendering أو loader/action errors داخل route tree.

## 30 — Playwright Script Exists Without a Playwright Configuration File

`package.json` يحتوي على `test:e2e: playwright test` وdependency لـ`@playwright/test`، لكن لا يوجد `playwright.config.ts` في جذر المشروع. لذلك طبقة الـE2E أصبحت معرفة في scripts والdependencies بدون configuration واضحة تحدد browsers أو base URL أو retries أو test directories.

## 31 — Test Suite Coverage Is Extremely Limited

الـtest suite الحالية تحتوي على اختبارات قليلة جدًا مقارنة بحجم المشروع، منها test للـroles وtest لمسار unauthorized واختبار RootLayout. لا توجد تغطية مماثلة لمسارات auth المتعددة، forms، courses، lessons، chat، profile، mutations، API failure states، أو user journeys الرئيسية.

## 32 — No CI Workflow Is Present for Automated Build and Test Validation

لا يظهر في المستودع workflow داخل `.github` لتشغيل build أو unit/integration tests أو E2E على push/PR. وبالتالي نجاح الاختبارات محليًا لا يتحول حاليًا إلى gate آلي يمنع إدخال regression إلى `main`.

## 33 — README Is Still the Default Vite Template

`README.md` يصف المشروع على أنه مجرد React + TypeScript + Vite template ويشرح كيفية توسيع ESLint، لكنه لا يشرح Elmullim ولا architecture ولا environment variables ولا تشغيل الاختبارات ولا طريقة تشغيل المشروع أو build أو أهم flows.

## 34 — Incomplete Page-Level SEO Metadata Strategy

`index.html` يحتوي على title وdescription وkeywords عامة للمنصة كلها. لا توجد استراتيجية واضحة لتغيير metadata حسب route أو entity، وبالتالي صفحات مثل course details وlesson details وغيرها تشترك في metadata ثابتة على مستوى SPA.

## 35 — HTML Language Configuration Is Hardcoded to English

`index.html` يبدأ بـ`<html lang="en">` رغم وجود محتوى ووصف عربي في الصفحة ووجود واجهات auth ومحتوى يستهدف العربية. قيمة lang ثابتة لا تعكس لغة المحتوى المعروض في كل حالة.

## 36 — Hardcoded User-Facing Strings Prevent a Consistent Internationalization Strategy

هناك نصوص user-facing مكتوبة مباشرة داخل components مثل `LOGIN`, `Forgot password?`, `Create account`, ورسائل chat والأخطاء. هذا يجعل إدارة اللغات والاتساق النصي عبر التطبيق معتمدة على تعديل source files بدل وجود message catalog أو locale abstraction واضح.

## 37 — Client Environment Configuration Contains Development Mode in the Tracked .env

الـ`.env` المتعقب يحتوي على `VITE_ENV=development`. هذا يخلط configuration environment داخل ملف tracked ويجعل القيمة جزءًا من المستودع بدل أن تكون مرتبطة ببيئة التشغيل الفعلية، كما أن بعض السلوكيات تعتمد عليها مثل إعداد `secure` للكوكيز.

## 38 — .gitignore Does Not Exclude Environment Files

`.gitignore` يغطي logs وnode_modules وdist وبعض ملفات IDE، لكنه لا يحتوي على `.env` أو ملفات environment variants. وبما أن `.env` موجود بالفعل في Git، لا توجد حماية على مستوى ignore تمنع إعادة تعقب هذه الملفات في تغييرات لاحقة.

## 39 — Git Repository Hygiene and Commit Conventions Need Improvement

تاريخ المستودع يحتوي على commits عامة جدًا مثل `Elmulim` بدل رسائل تصف نطاق التغيير بوضوح. كما أن المستودع يجمع source code وconfiguration وtesting changes بدون convention واضح ظاهر للمساهمين أو release-oriented documentation.
