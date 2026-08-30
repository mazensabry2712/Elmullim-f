# Project Issues — Detailed Audit

هذا الملف يوثق المشاكل المؤكدة من فحص الكود الحالي والـconfiguration. الوصف يشرح المشكلة وأثرها فقط، بدون اقتراح حلول.

## 01 — Dependency Conflict: React 19.1.0 vs react-loader-spinner 6.1.6

المشروع كان يطلب React 19.1.0 بينما الإصدار القديم من react-loader-spinner كان يعلن peer dependency لا تتوافق مع React 19، مما أدى إلى فشل npm install قبل تحديث الحزمة المتعارضة.

## 02 — Exposed .env File in Public Repository

ملف `.env` متعقب داخل المستودع ويحتوي على إعدادات تشغيل ومفاتيح. وجوده في Git يجعل القيم متاحة لمن يستطيع قراءة المستودع وقد يبقيها ضمن التاريخ حتى بعد حذف الملف من النسخة الحالية.

## 03 — Client-Side Encryption Secret Exposed via VITE_ Environment Variable

التطبيق يقرأ `VITE_ENCRYPT_SECRET_KEY` من كود المتصفح ويستخدمه في CryptoJS. متغيرات VITE_* مخصصة للقيم التي يمكن تضمينها في bundle، وبالتالي المفتاح ليس سرًا حقيقيًا أمام المستخدم أو أي كود يعمل في نفس الصفحة.

## 04 — Authentication Token Stored in JavaScript-Accessible Cookie

Access token يُحفظ عن طريق JavaScript cookie API بدون HttpOnly، ولذلك يمكن لكود JavaScript الموجود على نفس origin قراءته إذا تم تنفيذ XSS أو كود غير موثوق.

## 05 — Client-Side Role Cookie Used for Authorization Decisions

الدور يُحفظ في cookie باسم `r_l` ويتم استخدامه داخل ProtectedRoute وProfile. هذه القيمة قابلة للتعديل من المتصفح، وبالتالي لا تصلح كمصدر سلطات موثوق.

## 06 — Password-Reset Authorization State Trusted from Client-Side Cookie

تدفق reset password يخزن role مشفرًا في cookie `_cr_p` ثم يقرأه العميل لتحديد role المسموح له بإكمال العملية. بذلك توجد حالة مرتبطة بتدفق أمني حساس في متصفح العميل.

## 07 — Malformed Encrypted Reset Cookie Can Break Password-Reset Flow

`getCanResetPass()` يفك قيمة `_cr_p` ثم يفسر الناتج كـJSON بدون حماية محلية من بيانات تالفة أو صيغة غير صالحة، وبالتالي قيمة cookie غير متوقعة يمكن أن تنتج exception.

## 08 — RootLayout Owns Authentication Validation for Public and Protected Areas

RootLayout يغلف المسارات العامة والمحمية معًا ويحتوي على session validation، ما يخلط مسؤولية layout العامة مع مسؤولية authentication lifecycle.

## 09 — Authentication Validation Request Is Not Aborted When the Layout Unmounts

الكود يمنع تطبيق النتيجة بعد unmount باستخدام cancellation flag، لكنه لا يلغي الطلب الشبكي نفسه. الطلب قد يستمر حتى بعد زوال المكوّن الذي بدأه.

## 10 — Missing /unauthorized Route

ProtectedRoute كان يستخدم `/unauthorized` عند رفض الدور بينما المسار لم يكن مسجلًا، ما كان يجعل منع الوصول يظهر كصفحة غير موجودة. تم تسجيل المسار لاحقًا لكن المشكلة كانت موجودة في النسخة التي تمت مراجعتها.

## 11 — Inconsistent Route Naming Between /course and /courses

بعض مسارات الـcourse تستخدم plural مثل `/courses/:courseId`، بينما مسار enroll يستخدم singular `/course/:courseId/enroll`. هذا يكسر الاتساق في routing contract ويرفع احتمال استخدام مسار غير متوقع.

## 12 — Duplicate Role-to-Route Mapping Logic

أكثر من auth service يحتوي على nested ternary مستقلة لتحويل role إلى `teacher` أو `parent` أو `student` endpoint. نفس القاعدة مكررة بدل أن تكون معرفة في نقطة واحدة.

## 13 — Authentication State Has Multiple Sources of Truth

الجلسة ممثلة عبر Redux `isAuthenticated`، وtoken cookie، وrole cookie، ونتيجة `checkAuth`. نفس الحالة موزعة بين أكثر من مصدر، ما يسمح بعدم التزامن بينها.

## 14 — Weak Authentication State Model

`authSlice` يحتفظ بـ`isAuthenticated` فقط، ولا يميز بصورة صريحة بين checking وauthenticated وunauthenticated والحالات المقيدة، ولا يحمل هوية المستخدم أو role كحالة مركزية.

## 15 — Client-Side Role Determines Profile Rendering

صفحة Profile تقرأ role من cookie وتقرر أي profile component يتم تحميله. هذا يجعل اختيار الواجهة يعتمد على قيمة client-side mutable بدل session identity الموثوقة.

## 16 — ProtectedRoute Performs Client-Side Authorization Based on Mutable Cookie Role

ProtectedRoute يعتمد على `r_l` لتحديد ما إذا كان الوصول إلى المسار مسموحًا في الواجهة. القرار هنا client-side ويمكن تغييره بتغيير cookie، ولذلك هو guard للواجهة وليس authorization موثوقًا.

## 17 — Axios Authentication Headers Are Duplicated Across Services

خدمات متعددة تستقبل token وتبني Authorization header يدويًا. هذا يكرر infrastructure concern داخل service functions ويجعل طريقة إرسال session credentials غير موحدة.

## 18 — Axios 500 Error Detection Uses the Wrong Error Property

الـ401 يتم فحصه من `error.response.status`، بينما الـ500 يتم فحصه عبر `error.status`. هذا الاختلاف لا يتوافق مع شكل Axios error المعتاد ويؤثر على تنفيذ منطق الخطأ الخاص بـ500.

## 19 — Global Axios 401 Interceptor Forces Logout for Every Matching API Request

أي request عبر client المشترك يرجع 401 يؤدي إلى logout عالمي وإظهار warning. السلوك غير مرتبط بنوع العملية أو سبب 401 ويمكن أن ينهي الجلسة بسبب request واحد.

## 20 — React Query Online-State Configuration Uses a Non-Reactive Snapshot

`navigator.onLine` يتم قراءته وقت إنشاء QueryClient فقط داخل `enabled`. تغيّر حالة الشبكة بعد ذلك لا يعيد بناء القيمة نفسها تلقائيًا.

## 21 — API Query Parameters Are Manually Concatenated Without Encoding

`getAllCourses` يضع قيمة البحث مباشرة داخل URL باستخدام string interpolation. الرموز الخاصة قد تغير معنى query string أو تنتج طلبًا مختلفًا عن القيمة المقصودة.

## 22 — API Response Contracts Are Trusted Only at Compile Time

TypeScript interfaces تحدد الشكل المتوقع للresponse لكنها لا تتحقق من البيانات القادمة من الشبكة وقت التشغيل. response غير مطابق للنوع يمكن أن يمر إلى بقية التطبيق بدون runtime validation.

## 23 — Pusher/Echo Authentication Token Is Captured Once at Module Initialization

Echo يقرأ token أثناء تحميل module ويضعه في headers عند إنشاء instance. تغيّر session بعد ذلك لا يغيّر القيمة الملتقطة داخل instance الحالية.

## 24 — ChatWindow Calls leaveAllChannels and Can Disrupt Other Realtime Channels

فتح ChatWindow يستدعي `leaveAllChannels()` قبل الاشتراك في قناة المحادثة. هذا الإجراء يعالج كل قنوات Echo الحالية وليس قناة المحادثة وحدها، وبالتالي يمكن أن يؤثر على subscriptions أخرى.

## 25 — Chat Code Contains Production Console Logging and Browser Alerts

Chat يستخدم `console.log/error` و`alert()` و`window.confirm()` مباشرة داخل feature code. هذا يوزع logging وnotification behavior خارج طبقة موحدة، وقد يعرض معلومات تشغيلية في console المستخدم.

## 26 — ChatWindow Contains a Large Embedded Base64 Image

ChatWindow يحتوي على صورة كبيرة كاملة كـbase64 داخل JSX، ما يزيد حجم source module والـJavaScript المرتبط بالchat ويصعّب إدارة الـasset بشكل مستقل.

## 27 — Chat Sidebar Is Excessively Large and Creates a Heavy Bundle Boundary

SideBar ملف ضخم يجمع state والبحث وإدارة conversations والعرض في نفس المكوّن. هذا يرفع تعقيد الصيانة ويجعل boundary الخاصة بالfeature أقل وضوحًا.

## 28 — Large Production JavaScript and CSS Bundles

الـproduction build ينتج bundle CSS كبير وملفات JavaScript كبيرة، ومنها chunk للـchat بحجم ملحوظ. هذا يرفع تكلفة التحميل والتنفيذ خصوصًا للمستخدمين على شبكات أبطأ.

## 29 — Missing Route-Level Error Boundaries

الـrouting يحتوي على تعليقات مثل `errorElement` غير المفعلة، ولا توجد حدود أخطاء واضحة على مستوى المسارات في التصميم الحالي. فشل route component لا يملك fallback مستقلًا ومحددًا بشكل كافٍ.

## 30 — Playwright Script Exists Without a Playwright Configuration File

`package.json` يحتوي على script `test:e2e` ويحتوي المشروع على Playwright dependency، لكن لا يظهر ملف `playwright.config.*` في البنية الحالية التي تمت مراجعتها، ما يجعل إعداد browser projects وbaseURL والتقارير والتشغيل الموحد غير معرف في المصدر.

## 31 — Test Suite Coverage Is Extremely Limited

قبل توسيع الاختبارات، كان المشروع لا يملك إلا قدرًا محدودًا جدًا من test coverage مقارنة بعدد pages وservices والauth flows والchat والcourse features الموجودة.

## 32 — No CI Workflow Is Present for Automated Build and Test Validation

لا يظهر workflow داخل `.github/workflows` لفرض lint وbuild وunit/integration tests وE2E على Pull Requests أو قبل الدمج.

## 33 — README Is Still the Default Vite Template

README الحالي يصف قالب React + Vite ويوجه إلى تعليمات Vite العامة، ولا يقدم توثيقًا كافيًا لـElmullim أو بنية المشروع أو testing أو التشغيل أو deployment.

## 34 — Incomplete Page-Level SEO Metadata Strategy

index.html يحتوي على title وdescription وkeywords عامة، لكن لا توجد آلية موحدة لتوليد metadata خاصة بكل public route/page، لذلك كثير من الصفحات تشترك في metadata العامة.

## 35 — HTML Language Configuration Is Hardcoded to English

`index.html` يستخدم `lang="en"` بشكل ثابت رغم وجود محتوى عربي ضمن metadata وواجهة المشروع، ما يجعل document language لا يعكس كل حالات الاستخدام المتوقعة.

## 36 — Hardcoded User-Facing Strings Prevent a Consistent Internationalization Strategy

النصوص الظاهرة للمستخدم موزعة داخل components وpages مباشرة، مثل رسائل الخطأ والأزرار والتنبيهات. لا توجد طبقة localization مركزية تربط هذه النصوص بالlocale.

## 37 — Client Environment Configuration Contains Development Mode in the Tracked .env

الـ`.env` المتعقب يحتوي `VITE_ENV=development`، وبالتالي configuration خاصة ببيئة تطوير محددة موجودة في source control بدل كونها جزءًا من runtime environment فقط.

## 38 — .gitignore Does Not Exclude Environment Files

`.gitignore` الحالي يستبعد ملفات مثل `*.local` لكنه لا يستبعد `.env` بصيغته العامة، ما يسمح بتتبع ملفات environment مستقبلًا بسهولة.

## 39 — Git Repository Hygiene and Commit Conventions Need Improvement

المستودع يحتاج إلى سياسة ثابتة للـcommit scope والـcommit messages والـgenerated artifacts وconfiguration files. عدم وجود هذه القواعد كحاجز آلي يجعل التاريخ أقل قابلية للمراجعة ويزيد احتمالات خلط تغييرات غير مرتبطة.
