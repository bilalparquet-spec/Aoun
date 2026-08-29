# 🇩🇿 عون الجزائر — AOUN ALGERIA

منصة جزائرية للتضامن والمساعدات — موقع ويب (وليس تطبيق هاتف) يربط بين من يحتاج المساعدة ومن يستطيع تقديمها، عبر خريطة تفاعلية لكل ولايات الجزائر الـ58.

**التقنيات:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Prisma 7 · NextAuth 5 (Credentials) · Leaflet + OpenStreetMap + Marker Clustering

---

## 1. هيكل المشروع

```
aoun-algeria/
├── prisma/
│   ├── schema.prisma          # كل النماذج: User, Wilaya, HelpRequest, Campaign...
│   ├── seed.ts                 # بيانات تجريبية: 58 ولاية + DEMO data
│   └── data/wilayas.ts         # أسماء وإحداثيات الولايات الـ58
├── src/
│   ├── app/
│   │   ├── page.tsx             # الصفحة الرئيسية
│   │   ├── help/                # 🆘 أحتاج مساعدة
│   │   ├── help-others/         # 🤝 أنا أساعد
│   │   ├── map/                 # 🗺️ الخريطة التفاعلية
│   │   ├── collection-points/   # نقاط الاستقبال
│   │   ├── storage-points/      # نقاط التخزين
│   │   ├── distribution-points/ # نقاط التوزيع
│   │   ├── campaigns/           # الحملات الإغاثية
│   │   ├── volunteers/          # المتطوعون
│   │   ├── organizations/       # الجمعيات
│   │   ├── login/ register/     # المصادقة
│   │   ├── dashboard/           # لوحة المستخدم (محمية)
│   │   ├── admin/               # لوحة الإدارة (محمية بالأدوار)
│   │   └── api/                 # كل الـ API routes (REST عبر Next.js Route Handlers)
│   ├── components/              # مكونات مشتركة (خريطة، هيدر، فورمات...)
│   ├── lib/                     # prisma.ts, auth.ts, constants.ts
│   └── middleware.ts            # حماية /admin و /dashboard
├── .env.example
└── package.json
```

## 2. طريقة التشغيل محلياً

> **ملاحظة مهمة:** تم بناء هذا المشروع داخل بيئة عمل ذات وصول شبكي مقيّد، لذا لم يتمكن `prisma generate` و `next build` من التنفيذ الكامل هناك (تحميل محركات Prisma الثنائية كان محجوباً). هذا لن يحدث على جهازك أو على Vercel، لأن كليهما يملك وصولاً كاملاً للإنترنت. اتبع الخطوات التالية بشكل طبيعي:

```bash
# 1) تثبيت الحزم
npm install

# 2) نسخ متغيرات البيئة وتعديلها
cp .env.example .env
# عدّل DATABASE_URL و AUTH_SECRET

# 3) توليد Prisma Client
npx prisma generate

# 4) تطبيق المخطط على قاعدة البيانات (ينشئ الجداول)
npx prisma migrate dev --name init

# 5) زرع البيانات التجريبية (58 ولاية + DEMO data + حساب Admin)
npm run db:seed

# 6) تشغيل خادم التطوير
npm run dev
# افتح http://localhost:3000
```

## 3. Environment Variables المطلوبة

انسخ `.env.example` إلى `.env` واملأ:

| المتغير | الوصف |
|---|---|
| `DATABASE_URL` | رابط اتصال PostgreSQL، مثال: `postgresql://user:pass@host:5432/dbname?schema=public` |
| `AUTH_SECRET` | مفتاح سري لـ NextAuth — ولّده بـ `openssl rand -base64 32` |
| `NEXTAUTH_URL` | رابط الموقع (محلياً: `http://localhost:3000`، وفي الإنتاج: رابط Vercel) |

## 4. طريقة إعداد قاعدة البيانات

اختر أحد مزودي PostgreSQL (كلها تعمل مع Prisma بدون تعديل):

- **Vercel Postgres** (الأسهل مع Vercel: من لوحة تحكم المشروع → Storage → Create Database)
- **Neon** (neon.tech) — مجاني للمشاريع الصغيرة
- **Supabase** (supabase.com)
- أي خادم PostgreSQL خاص بك

بعد الحصول على رابط الاتصال، ضعه في `DATABASE_URL` ثم شغّل:

```bash
npx prisma migrate deploy   # في الإنتاج
# أو
npx prisma migrate dev      # في التطوير المحلي (ينشئ ملفات migration جديدة)

npm run db:seed             # زرع البيانات التجريبية (اختياري لكن مستحسن للاختبار)
```

يمكنك أيضاً تصفح قاعدة البيانات بصرياً عبر: `npm run db:studio`

## 5. طريقة النشر على Vercel

⚠️ **ملاحظة مهمة:** Vercel لا "يرفع" ملف ZIP كمشروع عادي من لوحة التحكم الرئيسية (New Project يتطلب مستودع Git). يوجد استثناء واحد هو **vercel.com/drop** الذي يقبل السحب والإفلات لملف ZIP، لكنه غير مناسب لهذا المشروع لأنه لا يقرأ متغيرات البيئة (`.env`) ولا يعيد النشر تلقائياً عند التعديل. الطريقتان الموصى بهما لمشروع فيه قاعدة بيانات مثل هذا:

**الطريقة الأولى — عبر GitHub (الأفضل والأكثر استقراراً):**
```bash
# 1) فك ضغط الملف ثم من داخل المجلد:
git init
git add .
git commit -m "أول نسخة من عون الجزائر"

# 2) أنشئ مستودعاً فارغاً على github.com وارفع إليه:
git remote add origin https://github.com/USERNAME/aoun-algeria.git
git branch -M main
git push -u origin main

# 3) من vercel.com → Add New → Project → استورد هذا المستودع
# 4) أضف Environment Variables قبل الضغط على Deploy:
#    DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL
#    (يمكن أيضاً إضافتها لاحقاً من Project Settings → Environment Variables
#     ثم الضغط على Redeploy)
```

**الطريقة الثانية — عبر Vercel CLI مباشرة من المجلد (بدون Git):**
```bash
npm install -g vercel
cd aoun-algeria   # ادخل إلى المجلد المستخرَج من ZIP — لا ترفع ملف ZIP نفسه
vercel login
vercel            # يسألك بعض الأسئلة ثم ينشر المشروع
vercel --prod     # للنشر النهائي على رابط الإنتاج
# بعدها أضف Environment Variables من لوحة تحكم المشروع في vercel.com
# ثم: vercel --prod  مرة أخرى لإعادة البناء بها
```

**سبب شائع آخر لفشل النشر:** خطأ "Query Engine not found" عند تشغيل الموقع فعلياً بعد النجاح الظاهري للبناء. هذا يحدث لأن بيئة Vercel السحابية (Linux) تختلف عن جهازك، وقد تم إصلاح هذا مسبقاً في `prisma/schema.prisma` بإضافة:
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```
هذا يجعل Prisma يبني محركين: واحد لجهازك المحلي وواحد لبيئة Vercel.

إن استمرت المشكلة، أرسل نص الخطأ الظاهر في Vercel (من تبويب **Deployments → اضغط على النشر الفاشل → Build Logs**) لتشخيصه بدقة.

بعد أول نشر ناجح، شغّل الهجرة والزرع على قاعدة بيانات الإنتاج (من جهازك، موجهاً DATABASE_URL لقاعدة بيانات الإنتاج):

```bash
npx prisma migrate deploy
npm run db:seed
```

## 6. حساب Admin تجريبي للاختبار

بعد تشغيل `npm run db:seed`:

```
البريد الإلكتروني: admin@aoun-algeria.dz
كلمة المرور:      Admin@2026
الدور:            SUPER_ADMIN
```

حسابات تجريبية إضافية يتم إنشاؤها بالزرع:
- `demo.user@aoun-algeria.dz` / `Demo@2026` (مستخدم عادي)
- `org.hilal@aoun-algeria.dz` / `Org@2026` (جمعية موثقة)
- `volunteer.16@aoun-algeria.dz` وما شابه لكل ولاية بها بيانات تجريبية / `Volunteer@2026`

## 7. ملاحظات حول الخصوصية والأمان (مطبّقة في الكود)

- 🔒 حقل `contactMethod` في طلبات المساعدة **لا يُعرض أبداً** في الـ API العام (`/api/help-requests`) — يظهر فقط في `/api/admin/help-requests` للمشرفين.
- 🔒 الموقع الجغرافي لطلبات المساعدة تقريبي فقط (`approxLat` / `approxLng`)، ولا يوجد حقل عنوان دقيق لطلبات المساعدة.
- 🛡️ كل طلب مساعدة جديد يبدأ بحالة `PENDING_REVIEW` ولا يظهر للعامة حتى تتم الموافقة عليه من `/admin/help-requests`.
- 🛡️ `/admin` و `/dashboard` محميان عبر `middleware.ts` بناءً على الجلسة والدور (Role).
- 🚩 يمكن للمستخدمين المسجلين التبليغ عن طلب مشبوه عبر `/api/reports`، ومراجعته من `/admin/reports`.

## 8. الخطوات التالية المقترحة (لم تُنفَّذ في هذه النسخة الأولى)

- رفع الصور (حالياً `imageUrl` نصي فقط — يمكن ربطه بـ Vercel Blob أو Cloudinary)
- صفحة تعريفية لإنشاء/تعديل ملف الجمعية من طرف صاحبها
- بحث نصي شامل (`/search`) عبر كل الكيانات
- إشعارات فورية (حالياً تُخزَّن في قاعدة البيانات فقط، تُعرض في `/dashboard`)

---

صُنع بـ ❤️ من أجل التضامن الجزائري.
