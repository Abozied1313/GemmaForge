# GemmaForge

<div align="center">

منصة متكاملة لإدارة وهندسة الأوامر (Prompt Engineering) واختبارها مع نماذج الذكاء الاصطناعي Gemma.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev/)

</div>

---

## ✨ الميزات

- 🎯 **محرر أوامر متقدم** — واجهة سهلة لكتابة وتعديل الأوامر مع استخراج المتغيرات تلقائياً
- 🧪 **A/B Testing** — تشغيل نموذجَين من Gemma بالتوازي ومقارنة النتائج
- 📊 **إدارة المشاريع** — تنظيم الأوامر في مشاريع متعددة مع إحصائيات حية
- 🔐 **مصادقة آمنة** — تسجيل دخول وإنشاء حسابات عبر Supabase Auth مع تأكيد البريد
- 🌍 **ثنائي اللغة** — واجهة كاملة بالعربية والإنجليزية مع دعم RTL
- 🎨 **واجهة عصرية** — تصميم Dark Mode احترافي بأسلوب Vercel/Supabase

---

## 🛠 التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| **React 18 + TypeScript** | إطار عمل الواجهة الأمامية |
| **Vite 5** | أداة البناء والتطوير |
| **Tailwind CSS 3** | تصميم الواجهة مع دعم RTL |
| **Supabase** | Auth + PostgreSQL Database |
| **Supabase Edge Functions** | تشغيل نماذج Gemma AI |
| **React Router 6** | التنقل بين الصفحات |
| **shadcn/ui** | مكونات واجهة المستخدم |

---

## 📦 التثبيت المحلي

### 1. استنساخ المستودع

```bash
git clone https://github.com/Abozied1313/GemmaForge.git
cd GemmaForge
```

### 2. تثبيت الاعتماديات

```bash
npm install
```

### 3. إعداد متغيرات البيئة

```bash
cp .env.example .env
```

### 4. تحديث المتغيرات في ملف `.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. تشغيل التطبيق محلياً

```bash
npm run dev
```

سيكون التطبيق متاحاً على: `http://localhost:5173`

---

## 🗄️ إعداد قاعدة البيانات

قم بتشغيل الـ SQL التالي في Supabase SQL Editor:

```sql
-- Projects table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  color text default '#6c3aff',
  icon text default 'folder',
  prompt_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prompts table
create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  content text default '',
  description text default '',
  tags text[] default '{}',
  variables text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Test Runs table
create table public.test_runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete set null,
  prompt_text text not null,
  model_a text not null,
  model_b text,
  output_a text default '',
  output_b text,
  tokens_a integer default 0,
  tokens_b integer,
  time_a integer default 0,
  time_b integer,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.prompts enable row level security;
alter table public.test_runs enable row level security;
```

---

## 🚀 النشر

### النشر على OnSpace (مباشر)
يمكنك النشر مباشرةً من منصة OnSpace بالضغط على زر **Publish** في شريط الأدوات.

### بناء للإنتاج

```bash
npm run build
```

سيتم إنشاء مجلد `dist/` يحتوي على ملفات الإنتاج الجاهزة للنشر على أي خادم ويب (Netlify, Vercel, Cloudflare Pages, إلخ).

---

## 📁 هيكل المشروع

```
src/
├── components/
│   ├── features/        # مكونات الميزات (ProjectCard, ModelSelector, ...)
│   └── layout/          # مكونات التخطيط (Sidebar, TopBar, ...)
├── contexts/            # React Context (Auth, Language)
├── hooks/               # Custom Hooks (useData, useGemma)
├── pages/               # صفحات التطبيق
├── constants/           # النماذج والترجمات
├── types/               # TypeScript types
└── lib/                 # Supabase client وأدوات مساعدة

supabase/
└── functions/
    └── gemma-runner/    # Edge Function لتشغيل نماذج Gemma
```

---

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المستودع
2. إنشاء branch جديد: `git checkout -b feature/your-feature`
3. Commit التغييرات: `git commit -m 'Add: your feature'`
4. Push: `git push origin feature/your-feature`
5. فتح Pull Request

---

## 📄 الرخصة

هذا المشروع مرخص تحت [MIT License](LICENSE).

---

<div align="center">
  صُنع بـ ❤️ باستخدام <strong>Gemma AI</strong> و <strong>OnSpace</strong>
</div>
