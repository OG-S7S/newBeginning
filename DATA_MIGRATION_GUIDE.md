# Data Migration Guide: Static to Dynamic

This guide will help you migrate all static frontend data to the Supabase database, making it manageable through the admin panel.

## Overview

We're migrating the following static data to the database:
- ✅ **Programs** - Program details, highlights, outcomes, projects
- ✅ **Curriculum** - Modules and topics for each program
- ✅ **Students** - Student profiles and enrollments
- ✅ **Instructors** - Instructor profiles and assignments
- ✅ **Gallery** - Gallery items with categories
- ✅ **Courses** - Course listings
- ✅ **Applications** - Student applications

## Step 1: Run Database Migrations

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Run the migrations in this order:

### a) Fix RLS Policy (if not done already)
Run the SQL from `fix-rls-policy.sql` to fix the circular dependency issue.

### b) Create Data Tables
Run `supabase-data-migration.sql` - This creates all the tables for dynamic data.

### c) Seed Initial Data
Run `scripts/seed-data.sql` - This migrates your existing static programs data to the database.

## Step 2: Verify Data Migration

After running the migrations:

1. Go to **Table Editor** in Supabase
2. Check that these tables exist:
   - `programs`
   - `program_highlights`
   - `program_outcomes`
   - `program_projects`
   - `curriculum_modules`
   - `curriculum_topics`
   - `gallery_items`
   - `instructors`
   - `courses`
   - `applications`
   - `student_enrollments`

3. Check the `programs` table - you should see 4 programs:
   - Little Explorers
   - Young Engineers
   - Tech Pioneers
   - Innovation Lab

## Step 3: Test the Frontend

1. Visit `http://localhost:3001/programs`
2. The page should now load programs from the database
3. If you see "No programs available", check:
   - That the seed script ran successfully
   - That `is_active = true` for programs
   - Browser console for any errors

## Step 4: Admin Panel Management (Coming Next)

The admin panel pages for managing this data will be created next. For now, you can:

1. **Manage Programs** - Edit directly in Supabase Table Editor
2. **Add New Programs** - Insert into `programs` table
3. **Update Content** - Edit highlights, outcomes, projects in their respective tables

## Database Schema Overview

### Programs Structure
```
programs (main table)
├── program_highlights (one-to-many)
├── program_outcomes (one-to-many)
└── program_projects (one-to-many)
```

### Curriculum Structure
```
programs
└── curriculum_modules (one-to-many)
    └── curriculum_topics (one-to-many)
```

### Student Structure
```
profiles (extends existing)
└── student_enrollments (many-to-many with programs)
```

### Instructor Structure
```
profiles (extends existing)
└── instructors (one-to-one with profile)
    └── instructor_assignments (many-to-many with programs)
```

## Next Steps

1. ✅ Database schema created
2. ✅ Programs page updated to use database
3. ⏳ Create admin management pages for:
   - Programs management
   - Curriculum management
   - Students management
   - Instructors management
   - Gallery management
   - Applications management

## Troubleshooting

### "No programs available" on frontend
- Check that programs exist in database: `SELECT * FROM programs WHERE is_active = true;`
- Verify RLS policies allow public read access
- Check browser console for errors

### RLS Policy Errors
- Make sure you ran `fix-rls-policy.sql` first
- Verify the `is_admin()` function exists: `SELECT * FROM pg_proc WHERE proname = 'is_admin';`

### Seed Data Not Appearing
- Check for conflicts: The seed script uses `ON CONFLICT DO NOTHING`
- If programs already exist, delete them first: `DELETE FROM programs;`
- Then re-run the seed script

## Manual Data Entry

Until admin panels are created, you can manage data directly in Supabase:

### Add a New Program
```sql
INSERT INTO programs (id, title, ages, duration, class_size, description, color, display_order)
VALUES ('new-program', 'New Program', 'Ages 10-12', '2 hours', '6-10 students', 'Description here', 'bg-[#color]', 5);

-- Add highlights
INSERT INTO program_highlights (program_id, highlight, display_order)
VALUES ('new-program', 'Highlight 1', 0), ('new-program', 'Highlight 2', 1);
```

### Update a Program
```sql
UPDATE programs 
SET title = 'Updated Title', description = 'New description'
WHERE id = 'little-explorers';
```

## Security Notes

- All tables have RLS enabled
- Public can READ programs, curriculum, gallery, courses
- Only ADMINS can CREATE, UPDATE, DELETE
- Students can only view their own enrollments
- Applications are admin-only
