# EugeniaBravoDemo Snapshot

This repository is a sanitized snapshot of the EugeniaBravoDemo Next.js + Supabase build, shared to showcase implementation details without exposing production credentials.

## Live References
- Real website live site: **https://www.eugeniabravodemo.com**
- Feature walkthrough blog: **[Insert blog post URL here]**

## Branches
- `main`: demo-ready branch intended for hosting and sharing the sanitized build.
- `auth-progress`: working branch that keeps the full implementation progress, including authentication and admin flows.

## What to Know
- Secrets removed: all Supabase keys, TinyMCE key, and any built artifacts containing them have been stripped out.
- The code is runnable, but you must provide your own environment values and Supabase project.
- Reference only until configured: browse the code to understand structure, auth/MFA setup, content models, and UI patterns.

## Demo UI-Only Modifications
This demo branch is configured to showcase the UI without exposing real data or allowing writes:
- Demo mode is enabled in `app/lib/demo-mode.ts`. It forces Supabase to appear unconfigured and routes the app to in-memory demo data.
- Auth is bypassed for the admin UI so you can navigate `/admin` immediately, but all mutating actions (create/edit/delete, uploads) are disabled with a demo notice.
- Public and admin blog content is populated from demo fixtures in `app/services/supabasePostService.ts`.
- Image uploads and storage helpers fall back to local placeholder assets when demo mode is active.
- Branding, contact details, and media assets were replaced with neutral demo placeholders, and the admin route was renamed to `/admin`.

The intent is to let reviewers explore screens and flows while preventing changes to data and avoiding real credentials.

## Cookies & Analytics in the Demo
- CookieScript and Google Analytics are gated behind env flags and are disabled by default.
- To enable them, provide `NEXT_PUBLIC_ENABLE_COOKIE_SCRIPT` / `NEXT_PUBLIC_COOKIE_SCRIPT_ID` and `NEXT_PUBLIC_ENABLE_GA` / `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Recommended for the demo: keep them off, or use demo-specific IDs so the site does not connect to production analytics or consent tooling.

## Feature Overview
- Public marketing site: hero + practice areas, testimonials, FAQ, “about” section, and a contact page with embedded form, office locations, click-to-call/email, and Google Maps embeds. Dedicated services and legal policy pages (cookies, privacy, terms, aviso legal).
- Blog: category-filtered article listing, default/fallback images via Supabase Storage, rich article detail pages with related posts, SEO-friendly slugs, and recommended/featured cards.
- Content admin: authenticated `/admin` dashboard to create/edit/preview posts with TinyMCE editor, manage categories, and manage authors.
- Auth & MFA: Supabase auth (email/password) with TOTP MFA enforcement and challenge flows plus middleware session refresh to protect admin routes.
- Media & storage: Supabase Storage-backed images with remote optimization configuration in Next.js and per-component fallbacks.
- SEO & analytics: sitemaps (`app/sitemap.ts`), robots (`app/robots.ts`), canonical metadata, and Google Analytics tracking via `app/analytics/ClientAnalytics.tsx`.

## How to Make It Work Locally
1) **Provision services**
   - Create a Supabase project with tables/buckets matching the code (posts, categories, post_categories and an `images` public bucket).
   - Create or reuse a TinyMCE API key (or swap out the editor in admin pages).
2) **Configure environment**
   - Copy `.env.example` to `.env`.
   - Fill in:
     - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase API settings.
     - `SUPABASE_SERVICE_ROLE_KEY` if you need server-side operations that require elevated permissions.
     - `NEXT_PUBLIC_SUPABASE_STORAGE_URL` pointing to your bucket public URL, e.g. `https://<project>.supabase.co/storage/v1/object/public/images/`.
     - `NEXT_PUBLIC_SUPABASE_HOSTNAME` to the same Supabase domain (e.g. `<project>.supabase.co`) so Next.js can optimize remote images.
    - `NEXT_PUBLIC_TINYMCE_API_KEY` with your TinyMCE key (or remove TinyMCE usage).
    - `NEXT_PUBLIC_SITE_URL` set to the canonical domain you want for sitemaps/meta.
    - Optional demo toggles (disabled by default):
      - `NEXT_PUBLIC_ENABLE_COOKIE_SCRIPT=true` and `NEXT_PUBLIC_COOKIE_SCRIPT_ID=...`
      - `NEXT_PUBLIC_ENABLE_GA=true` and `NEXT_PUBLIC_GA_MEASUREMENT_ID=...`
3) **Adjust domain/canonical settings** (optional but recommended)
   - Update any hardcoded domains in `app/page.tsx`, `app/sitemap.ts`, and `next.config.js` redirects to match your deployment domain.
4) **Install and run**
   - `npm install`
   - `npm run dev` (or `npm run build && npm run start` for production)
5) **Seed content (optional)**
   - Insert sample posts/categories via Supabase SQL editor or the admin UI once auth is configured.

## Implementation Pointers
- Supabase client setup lives in `app/lib/supabase.ts` (browser) and `app/lib/supabase-server.ts` (server), with middleware session handling in `proxy.ts`.
- Content services are consolidated in `app/services/supabasePostService.ts` and consumed by blog/home/admin components.
- Admin dashboard routes and CRUD flows live under `app/(admin)/admin/*` with TinyMCE-powered editing.
- Public marketing and blog pages live under `app/(public)/*`, while shared UI blocks are in `components/*`.
- SEO surfaces are defined in `app/sitemap.ts`, `app/robots.ts`, and per-page metadata exports.
- Google Analytics client-side pageview tracking sits in `app/analytics/ClientAnalytics.tsx` (controlled by env flags).

## Housekeeping
- `.env` and build outputs have been removed to keep secrets out of the repo.
- `.env.example` lists the variables you need to supply for a private deployment.
