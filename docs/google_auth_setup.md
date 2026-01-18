# Google OAuth Setup Guide

To enable Google Login in Supabase, you need to create a project in the Google Cloud Console and obtain a **Client ID** and **Client Secret**.

## Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the specific project dropdown in the top bar and select **"New Project"**.
3. Name it (e.g., "CTE Study App") and click **Create**.
4. Select the newly created project.

## Step 2: Configure OAuth Consent Screen
1. In the left sidebar, go to **APIs & Services > OAuth consent screen**.
2. Select **External** (unless you are a Google Workspace user and only want internal users) and click **Create**.
3. Fill in the **App Information**:
   - **App name**: CTE Prep
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue** through the "Scopes" and "Test Users" sections (defaults are fine for now).
5. On the Summary page, click **Back to Dashboard**.

## Step 3: Create Credentials
1. In the left sidebar, go to **APIs & Services > Credentials**.
2. Click **+ CREATE CREDENTIALS** at the top and select **OAuth client ID**.
3. For **Application type**, select **Web application**.
4. Name it (e.g., "Supabase Auth").
5. **Authorized JavaScript origins**:
   - Add your Supabase project URL: `https://qvaqoxgocqmxntrbqcsm.supabase.co`
6. **Authorized redirect URIs**:
   - Add your Supabase callback URL: `https://qvaqoxgocqmxntrbqcsm.supabase.co/auth/v1/callback`
7. Click **Create**.

## Step 4: Add to Supabase
1. Copy the **Client ID** and **Client Secret** that appear.
2. Go back to your [Supabase Dashboard](https://supabase.com/dashboard).
3. Go to **Authentication > Providers > Google**.
4. Paste the **Client ID** and **Client Secret**.
5. Ensure **Enable Sign in with Google** is toggled ON.
6. Click **Save**.

Now your app should be able to sign in with Google!
