# Admin User Creation Guide

## Important: Admin users must be created manually

For security reasons, **admin users cannot be created through the public signup page**. All users who sign up through `/signup` are automatically assigned the `student` role.

## How to Create an Admin User

### Method 1: Through Supabase Dashboard (Recommended)

1. **Create the user account:**
   - Go to your Supabase Dashboard → **Authentication** → **Users**
   - Click **"Add user"** → **"Create new user"**
   - Enter the admin's email and password
   - Click **"Create user"**

2. **Update the user's role:**
   - Go to **Table Editor** → **profiles**
   - Find the user you just created (search by email)
   - Click on the row to edit
   - Change the `role` field from `student` to `admin`
   - Click **"Save"**

### Method 2: Using SQL Editor

1. **Create the user account** (same as Method 1, step 1)

2. **Update role using SQL:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Run this query (replace `admin@example.com` with the actual email):

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@example.com';
```

### Method 3: Direct Database Insert (Advanced)

If you need to create an admin user directly:

1. First create the auth user in Supabase Dashboard
2. Then insert/update the profile:

```sql
-- Get the user ID from auth.users table first
-- Then update or insert the profile
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth-users',
  'admin@example.com',
  'Admin Name',
  'admin'
)
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';
```

## Security Notes

- ✅ **Never** allow public signup to create admin accounts
- ✅ Always verify admin users manually
- ✅ Use strong passwords for admin accounts
- ✅ Consider enabling 2FA for admin accounts in Supabase
- ✅ Regularly audit admin user list

## Verifying Admin Access

After creating an admin user:

1. The user should be able to log in at `/login` using the **Admin** tab
2. They will be redirected to `/admin/dashboard` upon successful login
3. If they try to access `/portal/dashboard`, they'll be redirected to admin panel

## Troubleshooting

**User can't access admin panel:**
- Verify the `role` field in the `profiles` table is set to `admin` (not `student`)
- Check that the user exists in both `auth.users` and `profiles` tables
- Ensure RLS policies are correctly set up (run `supabase-migrations.sql`)

**User created but profile missing:**
- The trigger should auto-create profiles, but if it fails:
- Manually insert a profile record with the user's auth ID
