# Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the New Beginning Academy website.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project

## Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details:
   - Name: `new-beginning-academy` (or your preferred name)
   - Database Password: Choose a strong password (save it securely)
   - Region: Choose the closest region to your users
4. Click "Create new project" and wait for it to be set up

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
# Supabase Configuration
# Get these values from your Supabase project dashboard: https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here # usually starts with eyJ...

# IMPORTANT
# - Do NOT paste/share your keys in chat
# - If you accidentally shared a key, rotate it immediately in Supabase dashboard
# - This project does NOT require a service role key for authentication
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from Step 2.

**Important:** 
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Restart your development server after creating or modifying `.env.local`

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase-migrations.sql`
4. Click "Run" to execute the SQL

This will create:
- A `profiles` table to store user information
- Row Level Security (RLS) policies for data access
- Triggers to automatically create profiles when users sign up
- Indexes for better query performance

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following:

### Email Auth Settings
- Enable "Enable email confirmations" if you want users to verify their email
- Set "Site URL" to your application URL (e.g., `http://localhost:3000` for development)
- Add redirect URLs for email confirmations and password resets

### Email Templates (Optional)
- Customize email templates for:
  - Confirm signup
  - Reset password
  - Magic link

## Step 6: Create Your First Admin User

After setting up the database, you can create an admin user:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click "Add user" → "Create new user"
3. Enter email and password
4. After the user is created, go to **Table Editor** → **profiles**
5. Find the user's profile and change the `role` field from `student` to `admin`

Alternatively, you can use the SQL Editor:

```sql
-- Replace 'user@example.com' with the admin email
UPDATE profiles
SET role = 'admin'
WHERE email = 'user@example.com';
```

## Step 7: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/signup` and create a test account
3. Check your Supabase dashboard to see the new user and profile
4. Try logging in at `/login`

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env.local` file has the correct values
- Restart your development server after changing environment variables

### "relation 'profiles' does not exist"
- Make sure you've run the SQL migration from `supabase-migrations.sql`

### Users can't sign up
- Check that email confirmations are configured correctly
- Verify the Site URL in Authentication settings matches your app URL

### Users can't access admin pages
- Verify the user's role in the `profiles` table is set to `admin`
- Check that RLS policies are correctly set up

## Next Steps

- Set up email templates for a better user experience
- Configure additional authentication providers (Google, GitHub, etc.) if needed
- Add more fields to the profiles table as needed
- Set up database backups

## Security Notes

- Never commit `.env.local` to version control
- The `anon` key is safe to use in client-side code
- Never expose the `service_role` key in client-side code
- Row Level Security (RLS) ensures users can only access their own data
