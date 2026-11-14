# Native mobile API

The Android application uses the same Supabase project as the web application. Privileged Auth Admin operations are kept on the Vercel server and are never performed with a service-role key in the APK.

## Registration

`POST /api/mobile/register`

JSON body:
- `church_name` (required)
- `church_address`, `church_city`, `church_phone`, `church_email` (optional)
- `admin_name`, `username`, `admin_email`, `password` (required; password minimum 6 characters)

The endpoint creates the church tenant, its default church profile, finance settings, public-site theme/navigation/hero, and the first Superadmin account. The Android app then signs in through Supabase Auth.

## User management

All routes require `Authorization: Bearer <Supabase access token>`. The server validates the token with Supabase Auth and checks that the caller is a Superadmin with a church profile.

- `GET /api/mobile/users`: list users in the caller's church.
- `POST /api/mobile/users`: create a user.
- `PATCH /api/mobile/users`: update a user.
- `DELETE /api/mobile/users`: delete a user by `id`; deleting the current account is rejected.

The server-role key is read only from Vercel environment variables. It must never be added to Android BuildConfig, source code, or client requests.


The native registration and user-management routes are deployed with the web application and use the same Supabase tenant data model.
