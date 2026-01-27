# Students & Instructors Management Setup

## Important: Service Role Key Required

To create students and instructors directly from the admin panel, you need to set up the **Service Role Key** in your environment variables.

### Step 1: Get Your Service Role Key

1. Go to your **Supabase Dashboard** → **Settings** → **API**
2. Find the **service_role** key (NOT the anon key)
3. Copy it (it starts with `eyJ...` and is much longer than the anon key)

### Step 2: Add to Environment Variables

Add this to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ CRITICAL SECURITY WARNING:**
- **NEVER** commit this key to version control
- **NEVER** use this key in client-side code
- This key bypasses all Row Level Security policies
- Only use it in server-side code (which we're doing)

### Step 3: Restart Dev Server

After adding the service role key, restart your dev server:

```bash
npm run dev
```

## Alternative: Manual Creation

If you don't want to use the service role key, you can create students/instructors manually:

### Create Student Manually

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Go to **Table Editor** → **profiles**
5. Find the user and update:
   - `role` = `student`
   - Add other fields (phone, age, etc.)
6. Go to **Table Editor** → **student_enrollments**
7. Add enrollments linking student to programs

### Create Instructor Manually

1. Create auth user (same as above)
2. Update profile: `role` = `instructor`
3. Go to **Table Editor** → **instructors**
4. Insert new record with `profile_id` = user's UUID
5. Add instructor assignments in **instructor_assignments** table

## Features Available

### Students Management (`/admin/students`)

✅ **View all students** - Real data from database
✅ **Real-time stats** - Total, Active, Inactive, Graduated counts
✅ **Add new students** - Create student accounts with programs
✅ **Edit students** - Update information and program enrollments
✅ **Delete students** - Remove student accounts
✅ **Program selection** - Choose from your 4 programs
✅ **View student portal** - Link to student's portal view
✅ **Search functionality** - Search by name or email

### Instructors Management (`/admin/instructors`)

✅ **View all instructors** - Real data from database
✅ **Real-time stats** - Total, Active, Inactive, Total Assignments
✅ **Add new instructors** - Create instructor accounts
✅ **Edit instructors** - Update information and program assignments
✅ **Delete instructors** - Remove instructor accounts
✅ **Program assignments** - Assign instructors to programs
✅ **Specializations** - Add/remove specializations
✅ **Search functionality** - Search by name or email

## Database Structure

### Students
- Main table: `profiles` (with `role = 'student'`)
- Extended fields: phone, age, parent_email, parent_phone, status, join_date
- Enrollments: `student_enrollments` (many-to-many with programs)

### Instructors
- Main table: `instructors`
- Linked to: `profiles` (with `role = 'instructor'`)
- Assignments: `instructor_assignments` (many-to-many with programs)

## Troubleshooting

### "Service role key not configured" error
- Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- Restart dev server
- Or create users manually through Supabase Dashboard

### Can't see students/instructors
- Check that profiles have `role = 'student'` or `role = 'instructor'`
- Verify RLS policies allow admin access
- Check browser console for errors

### Programs not showing in dropdown
- Make sure you've run the seed script
- Check that programs exist in database
- Verify `is_active = true` for programs
