# Elmullim Backend — Detailed Audit

هذا الملف يشرح المشاكل التي ظهرت أثناء فحص مستودع `mazensabry2712/Elmullim-b`. الوصف يوضح السبب والأثر، ولا يضع خطوات أو حلول تنفيذية.

## 01 — Backend exposes payment-provider credentials in application source

`PaymobService` يحتوي على API key وintegration ID وiframe ID وHMAC secret داخل الكود نفسه. هذه قيم تشغيلية حساسة وليست مجرد إعدادات عامة، وبالتالي وجودها في source يجعل تسريبها مرتبطًا مباشرة بتاريخ المستودع.

## 02 — Password/email verification codes are generated with predictable `rand()` values

`VerficationService` يستخدم `rand(111111, 999999)` لتوليد رموز التحقق. `rand()` ليس مولدًا مخصصًا للأسرار الأمنية، وبالتالي لا يقدم نفس خصائص العشوائية المشفرة المطلوبة لتدفقات التحقق الحساسة.

## 03 — Verification codes are not bound to the authenticated/target user during verification

`verifyCode` في Controllers يبحث عن مستخدم من خلال وجود verification مطابق للكود والنوع والصلاحية فقط. لا يوجد قيد مباشر في الاستعلام يربط الكود بالحساب الذي يجري التحقق منه، ما يجعل الكود مساحة تحقق عامة بدل أن يكون artifact مرتبطًا بمستخدم محدد.

## 04 — Password-reset codes are not bound to the target account during password reset

`resetPassword` يبحث عن أي account لديه verification من نوع Password بنفس الكود وما زال صالحًا. التدفق لا يرسل هوية account مؤكدة ضمن نفس العملية، ولذلك لا يكون الربط بين الكود والحساب المستهدف صريحًا.

## 05 — Email verification code lookup is globally scoped by code/type

الـverification lookup يستخدم `whereHas` على `verifications` مع `code`, `type`, `uses` و`expired_at` دون تحديد verifiable id/type الخاص بالحساب الذي بدأ التدفق.

## 06 — Password-reset verification lookup is globally scoped by code/type

نفس النمط موجود في password reset. وجود كود صالح من النوع نفسه يمكن أن يحدد أول account يطابق الاستعلام بدل أن يكون الحساب جزءًا من الـcredential نفسه.

## 07 — Email-change verification is sent before persisting the new email address

في تحديث profile، عند تغيير البريد يتم استدعاء `sendEmailVerificationCode($user)` قبل تنفيذ `$user->update($data)`. الخدمة تستخدم عنوان البريد الموجود على الكائن في تلك اللحظة، وبالتالي طلب التحقق يمكن أن يُرسل إلى العنوان القديم بدل الجديد.

## 08 — Password update writes a new password without explicitly hashing at the controller boundary

Controllers الخاصة بالأدوار الثلاثة تسند كلمة المرور الجديدة مباشرة إلى model. المشروع يعتمد على `hashed` cast في بعض models، لذلك السلوك الحالي قد يعمل، لكن أمنية الـpassword أصبحت مرتبطة ضمنيًا بتعريفات model بدل contract واضح عند حدود use case، ما يزيد هشاشة التغيير مستقبلًا.

## 09 — Login invalidates all existing personal access tokens

كل Login يبدأ بحذف جميع tokens للمستخدم قبل إنشاء token جديد. هذا يلغي الجلسات الحالية على الأجهزة الأخرى ويمنع نموذج multi-session حتى لو لم يكن ذلك مقصودًا كقاعدة business.

## 10 — `check-auth` mixes multiple guards and a generic Sanctum user lookup

`checkAuth` يبدأ من `user('sanctum')` ثم يفحص `student`, `teacher`, و`family` بشكل منفصل ويكتب role. هذا يجعل الهوية تعتمد على مزيج من generic guard وثلاثة guards متوازية بدل identity resolution واحدة واضحة.

## 11 — `hasVerified` middleware relies on the generic `sanctum` guard while routes use separate role guards

الـroute groups تستخدم `auth:student`, `auth:teacher` و`auth:family`، بينما `HasVerified` ينادي `user('sanctum')`. وجود آليتين للوصول إلى نفس authenticated principal يزيد احتمال اختلاف السلوك عند تعديل auth configuration.

## 12 — Global stateful API middleware is enabled for a token-based API without a documented boundary

`bootstrap/app.php` يفعل `statefulApi()` على مستوى التطبيق، بينما المسارات الرئيسية تعتمد Sanctum tokens وحراسًا مخصصين. هذا المزج يحتاج contract واضح وإلا تصبح طريقة المصادقة الفعلية مرتبطة بسياق الطلب بدل قواعد موحدة.

## 13 — Role-specific guards and providers duplicate the same user abstraction across separate models

هناك models وproviders منفصلة للـStudent وTeacher وFamily مع controllers auth متشابهة جدًا. هذا يكرر قواعد identity والsession في ثلاثة مسارات بدل نموذج موحد سهل التطوير.

## 14 — Repeated authentication logic exists in three role-specific AuthControllers

login/register/logout/verify/reset/update password متكررة بدرجة كبيرة بين Student وTeacher وFamily controllers. هذا يجعل إصلاح security bug في تدفق auth يحتاج مراجعة أكثر من implementation.

## 15 — Repeated verification and password-reset logic exists across role-specific controllers

نفس query patterns للـverification codes وإنهاء الصلاحية وتحديث password مكررة في أكثر من controller، ما يزيد احتمال divergence بين roles.

## 16 — Public profile endpoints expose phone, address and email through resources

`StudentResource` يعيد `phone`, `address` و`email`، وsimilar resources تستخدم في public details routes. هذا يجعل بيانات اتصال شخصية متاحة ضمن resources يتم استخدامها عبر endpoints عامة.

## 17 — Public user-detail endpoints have no visible authorization boundary

`teacherDetails`, `studentDetails` و`familyDetails` موصولة بمسارات عامة بدون `auth:sanctum`. ومع وجود resources تعيد بيانات شخصية، يصبح مستوى التعرض أعلى من مجرد public profile metadata.

## 18 — Student search loads all students, teachers and families into application memory

`MainController::search` يستخدم `Student::all()`, `Teacher::all()` و`Family::all()` ثم يدمج المجموعات داخل PHP. مع نمو المنصة، زمن الاستجابة والذاكرة سيزدادان مع إجمالي المستخدمين بدل حجم النتائج.

## 19 — Search performs filtering with PHP regex instead of database-backed search

الفلترة تتم باستخدام `preg_match` على objects محملة بالفعل في الذاكرة. هذا يتجاوز فهارس قاعدة البيانات ويحول البحث إلى عمل CPU داخل application worker.

## 20 — Search input is converted into a custom regex that expands `%` and `_`

الكود يبني regex خاصًا من قيمة المستخدم بعد تحويل `%` و`_`. هذا abstraction غير مألوف لنظام بحث بسيط ويضيف تعقيدًا في semantics البحث مقارنة بفلترة قاعدة البيانات.

## 21 — Search endpoint has no explicit upper bound on the requested `limit`

`limit` يأتي مباشرة من query string ويستخدم في `take($limit)`. لا يوجد حد أعلى ظاهر يمنع قيم كبيرة، لذلك حجم النتيجة المقصود من العميل غير مضبوط بشكل واضح.

## 22 — Several controller queries use relationship collections instead of constrained database queries

هناك نمط متكرر من جلب collection كاملة ثم `filter`, `map`, `except` داخل PHP. هذا ينقل العمل من DB إلى application layer ويصعب توقع تكلفة الاستعلامات مع نمو البيانات.

## 23 — MainController contains multiple unrelated domains and is becoming a god controller

`MainController` يجمع countries, education systems, subjects, check-auth, verification, categories, courses, users وsearch. هذا يضع مجالات مختلفة تحت نقطة تغيير واحدة.

## 24 — Teacher course update/delete operations are not scoped to the authenticated teacher

`CoursesController::update` و`destroy` يستخدمان `Course::find($id)` مباشرة بعد authentication للـteacher. لا يظهر في الاستعلام شرط يربط course بالـteacher الحالي.

## 25 — Teacher lesson update/delete operations are not scoped to the authenticated teacher

`LessonController::update` و`destroy` يستخدمان `Lesson::find($id)` بدل query من خلال علاقة teacher الحالية. هذا يفصل resource ownership عن endpoint authorization.

## 26 — Teacher course show endpoint can resolve arbitrary course IDs

`show` يستخدم `Course::find($id)` في controller مخصص للـteacher بدون owner constraint ظاهر. بالتالي endpoint يستطيع الوصول إلى course لا يملكه المدرس.

## 27 — Teacher lesson show endpoint can resolve arbitrary lesson IDs

`LessonController::show` لديه نفس نمط `Lesson::find($id)` بدون scope إلى teacher الحالي.

## 28 — Payment amount is accepted from the client and used for Paymob/order creation

`PaymentInitiateRequest` يقبل `amount` من العميل، و`StudentMainController::intiatePayment` يضع القيمة في بيانات الطلب ويرسلها إلى Paymob. السعر الفعلي للـLesson/Course لا يتم اشتقاقه داخل نفس العملية من المصدر canonical.

## 29 — Payment ownership and payable amount are not derived from the selected orderable

الطلب يتحقق أن `orderable_id` موجود وأن النوع lessons/courses، لكنه لا يجعل مبلغ الدفع مساويًا لسعر الـresource ولا يثبت ownership/business eligibility بجانب تلك القيمة.

## 30 — Payment callback does not validate Paymob HMAC signature

الـcallback يتحقق فقط من وجود `hmac` في الطلب، لكنه لا يحسب أو يقارن signature بالقيمة السرية الموجودة في الخدمة. وجود حقل HMAC دون validation cryptographic لا يثبت أن الطلب صادر من Paymob.

## 31 — Payment callback trusts request `success` without cryptographic authenticity validation

بعد فحص وجود `success`، يستمر التدفق في تغيير order إلى SUCCESS وإضافة enrollment. هذا القرار يعتمد على request fields قبل إثبات أصالة الرسالة.

## 32 — Payment callback uses request order/id values before verifying gateway authenticity

`order` و`id` القادمان من callback يدخلان مباشرة في lookup والتحديث. عدم وجود خطوة authenticity موثوقة قبل هذا الاستخدام يجعل callback boundary أضعف من المطلوب للتدفقات المالية.

## 33 — Payment flow can create application orders before the final payment result is known

يتم إنشاء `Order` بحالة PENDING قبل إكمال الدفع الخارجي. وجود pending orders بحد ذاته طبيعي، لكن lifecycle/reconciliation rules ليست معزولة في workflow واضح، خاصة مع غياب webhook authenticity/idempotency model.

## 34 — Payment callback enrollment is not guarded by a uniqueness invariant at the application layer

callback يضيف enrollment في transaction، لكن لا يظهر قبل الإضافة فحص uniqueness على pivot نفسه داخل هذا المسار ولا يظهر handling واضح لإعادة نفس callback بعد نجاح payment.

## 35 — Payment callback creates teacher transactions with a hardcoded commission rate

العمولة `0.10` مكتوبة داخل controller. هذا يجعل rule ماليًا أساسيًا مرتبطًا بكود HTTP بدل policy/configuration/domain rule قابلة للتدقيق.

## 36 — Payment callback success message is lesson/course specific even when the orderable differs

النص النهائي يقول إن المستخدم enrolled in this course حتى لو كان orderable Lesson. هذه حالة consistency في API messaging.

## 37 — Paymob service hardcodes merchant integration configuration in source code

API key وintegration/iframe/HMAC values كلها literals داخل constructor. نفس المشكلة الأمنية موجودة بغض النظر عن تشغيلها على production أو staging.

## 38 — Paymob service contains commented production/test credentials in source history

هناك مجموعة أخرى من credentials معلقة داخل التعليقات. حتى التعليقات تقع ضمن history الخاص بالـrepository، ما يجعل إدارة الأسرار أضعف.

## 39 — Paymob API integration has no visible timeout/retry/error translation policy

`new Client()` يستخدم بدون policy واضحة للـtimeout أو handling منظم لفشل HTTP response. الاستدعاءات الخارجية أصبحت جزءًا مباشرًا من request lifecycle.

## 40 — Paymob uses `uniqid()` for merchant order identifiers before relying on provider IDs

`uniqid()` ليس معرفًا عشوائيًا عالي الأمان ولا يمثل contract idempotency ماليًا. هو مناسب كمعرف تقني في بعض الحالات لكنه ليس substitute عن domain order identity أو idempotency key.

## 41 — Wallet payment flow is hardcoded to Vodafone wallet issuer

`payWithPaymob` يحدد `wallet_issuer` بقيمة Vodafone دائمًا. هذا يجعل provider integration مرتبطًا بمسار دفع واحد حتى لو توسعت طرق الدفع.

## 42 — Verification service performs repeated collection queries before invalidating old codes

الخدمة تستدعي علاقة `verifications` وتتحقق من `count()` ثم تجري query أخرى وتستخدم `get()->map()` لتحديث السجلات واحدة تلو الأخرى.

## 43 — Verification invalidation and new-code creation are not wrapped in one transaction

تعطيل الأكواد السابقة ثم إنشاء code جديد يحدثان في خطوات منفصلة. الفشل بينهما يمكن أن يترك الحالة الوسيطة مختلفة عن الحالة المتوقعة.

## 44 — Email delivery is synchronous inside authentication requests

`Mail::to(...)->send(...)` يتم مباشرة داخل register/verification/reset flows. إرسال البريد الخارجي يصبح جزءًا من زمن HTTP request واحتمال فشل الطلب نفسه.

## 45 — Image storage operations and database updates are not consistently transactional

عند تحديث صورة profile أو course أو lesson، قد يتم حذف ملف ورفع ملف جديد ثم update للقاعدة في خطوات منفصلة. لا توجد consistency mechanism واحدة لضمان التطابق بين DB وstorage في كل failure case.

## 46 — Course deletion lacks complete aggregate cleanup guarantees

حذف الـcourse يمنع الحذف عند وجود enrollments، ثم يحذف contents مباشرة ويزيل الـcourse. لا توجد هنا سياسة aggregate معلنة تتعامل مع lectures/media/other linked records والـfilesystem ككل.

## 47 — Lesson deletion follows the same incomplete aggregate-deletion pattern

نفس النمط موجود في lessons: فحص enrollments، حذف contents، حذف lesson، مع اعتماد على side effects خارج DB غير مربوطة بخطة cleanup متكاملة.

## 48 — Resource classes execute database queries and business/realtime logic during serialization

`StudentResource` مثلًا لا يكتفي بتحويل model إلى array؛ بل ينفذ queries للsubjects ويستعلم عن chat conversations ويبني conversation ID.

## 49 — `StudentResource` performs conversation lookups while serializing a student

الـresource ينفذ عدة calls إلى Chat facade داخل `toArray`. وهذا يعني أن مجرد serializing قائمة students يمكن أن يطلق استعلامات business/relationship إضافية.

## 50 — Realtime conversation existence checks can create N+1-style query amplification

البحث عن conversation للمستخدم يتم داخل resource لكل عنصر، ما يجعل عدد الاستعلامات مرتبطًا بعدد العناصر التي يتم serializingها.

## 51 — API resources embed base64 image data into responses

`StudentResource` يحول profile image إلى base64 عبر `ImageService`. هذا يرفع payload size ويزيد CPU/memory في كل serialization مقارنة بإرسال URL أو media contract منفصل.

## 52 — Chat controller constructor resolves the authenticated user eagerly

`ChatController::__construct()` ينادي `auth()->user()` قبل method execution. هذا يربط بناء controller بحالة auth العامة بدل حقن principal واضح داخل use case boundary.

## 53 — Chat conversations sorting reads message collections in memory

`conversations()` ترتب العناصر باستخدام آخر message من collection كل conversation. هذا يعني أن جزءًا من work الذي يمكن أن يكون query-level يتم في application memory.

## 54 — Chat conversations filtering performs multiple in-memory relationship traversals

الطريقة تحتوي على chain طويلة من `participants`, `except`, `filter`, `messageable` وhidden conversations. تكلفة القراءة تزداد مع عدد conversations والمشاركين.

## 55 — Chat conversation creation trusts a client-supplied `role` header for target-user model selection

الـclient يرسل `role` header، والـcontroller يستخدم القيمة لتحديد Student/Teacher/Family model الذي سيتم الوصول إليه. هذا ليس authorization وحده لكنه مدخل business-critical يجب ألا يمثل permission boundary.

## 56 — Chat conversation creation exposes cross-role identity selection through a user-controlled model selector

`user_id` + `role` يحددان target principal في request. لا توجد policy منفصلة توضح من يجوز له بدء conversation مع كل نوع من المستخدمين.

## 57 — Chat mutations lack explicit policy classes

deleteMessage, toggleFlag, clearConversation وhideConversation تعتمد على Musonza participant resolution داخل controller بدل وجود policies domain-level يسهل اختبارها وإعادة استخدامها.

## 58 — Chat message deletion uses `MessageNotification` as an indirect message lookup

بعد العثور على message يتم استدعاء `MessageNotification::where('id', $message->id)`. الاعتماد على equivalence غير موثق بين IDs الخاصة بكيانين مختلفين يجعل الكود شديد الحساسية لتفاصيل package schema.

## 59 — Full-message deletion has multiple side effects without one explicit domain transaction

في type `1` يتم حذف صور ثم حذف message notifications متعددة وبث event. هذه العملية تجمع storage + database + realtime side effects بدون orchestration موحد.

## 60 — Chat message image deletion can be decoupled from database mutation

حذف صورة attachment يحدث قبل اكتمال كل mutation المرتبطة بالرسالة. لو حدث failure لاحق قد تصبح DB state وstorage state غير متطابقتين.

## 61 — Chat file upload validation allows SVG files

validation تسمح `svg`. SVG يمكن أن يحمل content أكثر تعقيدًا من raster images، وبالتالي يحتاج contract أمان صريح بدل معاملته مثل JPEG/PNG فقط.

## 62 — Chat upload policy is embedded directly inside controller code

قواعد الحجم والامتدادات لأنواع attachments مكتوبة داخل `createMessage`. هذا يصعب توحيد policy نفسها مع features أخرى ترفع ملفات.

## 63 — Chat endpoints do not use explicit policies for sensitive mutations

وجود `auth:sanctum` وparticipant lookup لا يعطي model policy واضحة يمكن مراجعتها كطبقة authorization مستقلة لكل action.

## 64 — API routes contain inconsistent naming and endpoint conventions

هناك plural وsingular mixes، و`intiate` بدل `initiate`، واستخدام `/chat/a`، و`/main/...` بجانب role-specific prefixes. عدم الاتساق يزيد تكلفة الـclient contract.

## 65 — Typo-level API contract inconsistencies exist

أمثلة واضحة: `familes`, `intiate`, `VerficationService`, `LessonReource`. هذه ليست مجرد style؛ بعضها يظهر في API/database naming وبالتالي قد يصبح breaking contract إذا تم تصحيحه لاحقًا.

## 66 — Route definitions mix generic and role-specific Sanctum guards

بعض endpoints تستخدم `auth:sanctum`، وبعضها `auth:student`, `auth:teacher`, `auth:family`. هذا يزيد complexity في فهم أي principal متاح داخل كل controller/middleware.

## 67 — Generic `check-auth` endpoint acts as a universal session probe

الـendpoint غير محمي ويكشف إن كان هناك authenticated principal عبر Sanctum، ثم يحاول معرفة الدور من ثلاثة guards. هذا يخلق contract مركزيًا خاصًا بالهوية دون أن يكون جزءًا من auth boundary الخاصة بالدور.

## 68 — Error responses use global helpers without a documented API error contract

`failResponse()` و`successResponse()` مستخدمان في أنحاء واسعة من التطبيق، لكن لا يوجد في الملفات التي تمت مراجعتها contract واضح موثق لحقول الخطأ والـstatus semantics.

## 69 — Validation rules are duplicated manually

قواعد code/password/verification موجودة داخل controllers لأكثر من role. هذا يكرر format rules ويزيد divergence risk.

## 70 — Several controller methods use inline validators instead of dedicated Form Requests

في verifyCode, updatePassword, resetPassword وchat actions يتم إنشاء validators داخل controller. هذا ينقل request contract إلى business controller بدل طبقة request مستقلة.

## 71 — Response status codes are not consistently modeled as REST semantics

الكود يعتمد بكثرة على helper responses والرسائل النصية بدل توضيح حالات success/conflict/unauthorized/not-found عبر HTTP semantics موحدة.

## 72 — Controllers directly instantiate infrastructure services with `new`

مثل `new ImageService()`, `new VerficationService()`, و`new PaymobService()`. هذا يجعل dependency graph أقل وضوحًا ويصعب استبدال الخدمات أو mockingها.

## 73 — Controllers directly orchestrate external payment, mail, image, chat and transaction concerns

بعض controllers تنفذ business validation ثم external API calls ثم database mutations ثم side effects. حدود application use case غير واضحة.

## 74 — Domain logic is concentrated in controllers

Commission calculation، enrollment rules، verification lifecycle، resource ownership وchat behavior كلها تظهر داخل controller methods. كلما اتسعت المنصة سيصعب إعادة استخدام أو اختبار هذه القواعد بمعزل عن HTTP.

## 75 — Database queries frequently use unbounded `get()` operations

عدة list operations تستخدم `get()` بلا pagination. هذا مناسب للبيانات الصغيرة فقط، لكنه لا يضع حدًا طبيعيًا للنمو.

## 76 — Pagination is largely absent from list/search endpoints

countries/categories/courses/search/conversations وratings تستخدم get/all في عدة مواضع. لا يوجد contract pagination شامل للموارد المتوقعة للنمو.

## 77 — No visible API versioning convention is applied

الـroutes الحالية تعمل مباشرة تحت `/api/...` بدون version prefix واضح مثل `/api/v1`. تغيير response contract لاحقًا سيكون أصعب بدون version boundary.

## 78 — API contracts are not covered comprehensively by automated request/response tests

وجود Pest tests في auth/profile لا يثبت أن كل endpoint له success/error/authorization/response-shape contract محمي.

## 79 — Automated test coverage is concentrated in a small set of feature tests

المستودع يحتوي على مجموعة Auth tests وProfileTest وExampleTest، بينما عدد المجالات في التطبيق أكبر بكثير: payments, chat, courses, lessons, ratings, wallet, quizzes, search وغيرها.

## 80 — Critical payment and chat security flows require broader regression coverage

أخطر مسارات التطبيق لا يظهر لها في القائمة الحالية test suite مكافئة لحساسية العملية، خصوصًا callback authenticity وownership وidempotency.

## 81 — Critical authorization boundaries lack dedicated negative tests across role combinations

المسارات role-specific تحتاج اختبارات ممنوع/مسموح بين Student/Teacher/Family، لكن لا يوجد evidence كافٍ أن كل boundary محمي اختباريًا.

## 82 — No visible CI workflow enforces backend quality gates

المراجعة لم تُظهر workflow في `.github/workflows` ضمن الملفات التي تم الوصول إليها. بالتالي نجاح local test لا يصبح تلقائيًا شرطًا على push/PR.

## 83 — Static analysis and architecture enforcement are not visible in repository workflow

Composer يوفر Pint وPest، لكن لا يوجد static analysis tool مثل Larastan/PHPStan ضمن baseline الحالي، ولا gate معماري ظاهر.

## 84 — README is mostly framework-level information rather than project documentation

README الحالي يشرح Laravel skeleton والمكونات الأساسية، لكنه لا يمثل contract كاملًا للـElmullim API، auth model، roles، payment flow، realtime أو deployment.

## 85 — Environment and secret-management expectations are not documented as deployment contracts

وجود مفاتيح داخل `PaymobService` مع غياب contract واضح للبيئة يوضح أن إدارة الـsecrets ليست جزءًا معلنًا من deployment architecture.

## 86 — Application configuration and external service credentials are not consistently externalized

Paymob مثال مباشر. الكود نفسه يحتوي credentials بدل القراءة من config/env.

## 87 — Realtime broadcasting authorization is centralized at route level without explicit channel policy evidence

`Broadcast::routes(["middleware" => ["auth:sanctum"]])` يحمي endpoint العام، لكن هذا وحده لا يثبت أن كل private channel لديه authorization rule مناسب للمشارك.

## 88 — Exception handling customization is effectively empty in `bootstrap/app.php`

`withExceptions` موجودة بدون configuration. هذا لا يعني أن Laravel بدون exception handling، لكنه يعني أن API-specific exception contract والتسجيل والسياق غير موضحين في bootstrap layer.

## 89 — Infrastructure concerns are directly embedded in controllers/resources

Mail, storage, external payment, Pusher, Musonza Chat وDB orchestration تتداخل مع HTTP layer في نفس الملفات.

## 90 — Current structure will become difficult to scale as roles, features and integrations increase

مع وجود ثلاثة identity models، عشرات controllers، عدة integrations وfeatures متشابكة، استمرار النمو على نفس module-by-technical-type structure سيزيد coupling ويصعب ownership والاختبار والتغيير المستقل.
