# Elmullim — API Reference

> الـprefix الأساسي للـAPI هو `/api`.

## 1. Public / General

```text
GET /main/countries
GET /main/{country_id}/education-systems
GET /main/{education_system_id}/education-levels
GET /main/{education_level_id}/subjects
GET /main/teachers/{teacher_id}/details
GET /main/students/{student_id}/details
GET /main/parents/{parent_id}/details
GET /main/{teacher_id}/lessons
GET /main/search                 # authenticated

GET /general/categories
GET /general/{category_id}/sub-categories
GET /general/{sub_category_id}/courses

GET /courses/all
GET /courses/{course_id}/details
GET /courses/{course_id}/contents
GET /courses/{course_id}/{content_id}/lectures   # authenticated

GET /lessons/all
GET /lessons/{lesson_id}/details
GET /lessons/{lesson_id}/contents
GET /lessons/{lesson_id}/{content_id}/lectures   # authenticated
```

## 2. Student

```text
POST /student/register
POST /student/login
POST /student/forget-password
POST /student/reset-password
POST /student/payment/callback                 # Paymob webhook

POST /student/verification-email/verify         # auth
POST /student/logout                             # auth
POST /student/update-password                    # verified
GET  /student/me                                 # verified
POST /student/me                                 # verified

POST /student/rating/{teacher_id}/rate
GET  /student/rating/given-all
GET  /student/rating/received-all

POST /student/payment/intiate
GET  /student/payment/callback

GET  /student/enrolling/lessons
GET  /student/enrolling/courses
POST /student/enrolling/lessons/{lesson_id}/enroll
POST /student/enrolling/courses/{course_id}/enroll
```

## 3. Parent / Family

```text
POST /parent/register
POST /parent/login
POST /parent/forget-password
POST /parent/reset-password
POST /parent/logout                         # auth
POST /parent/verification-email/verify      # auth
POST /parent/update-password                # verified
GET  /parent/me                              # verified
POST /parent/me                              # verified
GET  /parent/ratings/all
POST /parent/ratings/{teacher_id}/rate
GET  /parent/ratings/my-students/ratings
```

## 4. Teacher

```text
POST /teacher/register
POST /teacher/login
POST /teacher/forget-password
POST /teacher/reset-password
POST /teacher/logout                          # auth
POST /teacher/verification-email/verify       # auth
POST /teacher/update-password                 # verified
GET  /teacher/me                               # verified
POST /teacher/me                               # verified

GET  /teacher/ratings/...                      # ratings
GET  /teacher/wallet
GET  /teacher/wallet/payouts
POST /teacher/wallet/payout

# Lessons
API Resource: /teacher/lessons
API Resource: /teacher/lessons/{lesson_id}/contents
API Resource: /teacher/lessons/{lesson_id}/contents/{content_id}/lectures
POST /teacher/lessons/{lesson_id}/contents/{content_id}/lectures/{id}/video-upload

# Courses
API Resource: /teacher/courses
API Resource: /teacher/courses/{course_id}/contents
API Resource: /teacher/courses/{course_id}/contents/{content_id}/lectures
POST /teacher/courses/{course_id}/contents/{content_id}/lectures/{id}/video-upload

# Quizzes
API Resource: /teacher/quizzes
API Resource: /teacher/quizzes/{quiz_id}/questions
```

## 5. Verification

```text
POST /verification-email/send
POST /check-auth
```

## 6. Broadcasting / Chat

Broadcasting routes are protected by Sanctum. Chat routes are loaded through the dedicated `routes/chat.php` file.

## 7. Response handling

الـFrontend يتعامل مع JSON responses من Laravel عبر Axios. تفاصيل الحقول المطلوبة لكل endpoint يجب أخذها من Controller/Resource المسؤول عنها في `Elmullim-b`.
