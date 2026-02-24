# ITCertPrep

Frontend app for certification prep with Supabase backend.

## Environment

Create `.env` from `.env.example` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_AI_PROXY_URL`
- Server secret: `GEMINI_API_KEY` (for Vercel functions)

Security note:

- Do not place provider API keys (Gemini/OpenAI/etc.) in Vite `VITE_*` vars.
- AI requests must go through a trusted server endpoint behind `VITE_AI_PROXY_URL`.
- This repo now includes Vercel AI routes:
  - `POST /api/ai/generate-questions`
  - `POST /api/ai/explain-answer`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run test:e2e`

## Security Migration

`supabase/migrations/20260224000000_security_hardening.sql` re-enables RLS and tightens notification/storage policies.

## Immediate Next Steps

1. Rotate credentials
- Regenerate Supabase publishable key and Gemini/provider key.
- Update local `.env` and deployment secrets.

2. Apply and verify DB hardening
- Apply `supabase/migrations/20260224000000_security_hardening.sql`.
- Confirm RLS is enabled for `classes`, `class_enrollments`, and `pathways`.
- Confirm notification insert policy requires `auth.uid() = user_id`.
- Confirm avatar storage policies enforce user-owned folder paths.

3. Deploy AI proxy endpoints
- Implement `/api/ai/generate-questions` and `/api/ai/explain-answer`.
- Keep provider key server-side only.
- Add auth and rate limiting.

4. Validate authorization behavior
- Test student/teacher/admin paths for classes, enrollments, notifications, and avatar updates.
- Test cross-user abuse attempts and confirm failure.

5. Process controls
- Keep one-off admin SQL scripts outside migration chain.
- Add PR checklist items: no RLS disable, no hardcoded credentials, no privilege escalation scripts.

6. Test coverage and CI
- Add E2E coverage for RLS-sensitive workflows.
- Enforce `npm run lint` and tests in CI.
