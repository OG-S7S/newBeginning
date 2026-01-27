# Features Migration Guide

This guide covers the migration of Courses, Sessions, Applications, Payments, Reports, and Settings to the database.

## Database Migration

Run the SQL migration file in your Supabase SQL Editor:

```sql
-- Run this file:
supabase-features-migration.sql
```

This creates tables for:
- `courses` - Course instances
- `course_enrollments` - Student enrollments in courses
- `sessions` - Schedule sessions
- `session_attendance` - Attendance tracking
- `applications` - Student applications from frontend
- `payments` - Payment records
- `reports` - Generated reports metadata
- `scheduled_reports` - Scheduled report configurations
- `settings` - Academy settings

## Features Implemented

### ✅ Courses Management
- **Location**: `/admin/courses`
- **Features**:
  - View all courses with real-time stats
  - Create new courses
  - Edit existing courses
  - Delete courses
  - Link courses to programs and instructors
  - Track student enrollments

### ✅ Applications Management
- **Location**: `/admin/applications`
- **Features**:
  - View applications from frontend
  - Filter by status (pending, approved, rejected)
  - Approve/reject applications
  - View application details

### ✅ Frontend Application Form
- **Location**: `/apply`
- **Features**:
  - Submit applications to database
  - Dynamic program selection from database
  - Form validation
  - Success confirmation

## Features To Complete

### ⏳ Sessions/Schedule
- **Location**: `/admin/schedule`
- **Status**: Server actions created, page needs update
- **To Do**: Update page to use real data, add session creation dialog

### ⏳ Payments
- **Location**: `/admin/payments`
- **Status**: Server actions created, page needs update
- **To Do**: Update page to use real data, implement export functionality

### ⏳ Reports
- **Location**: `/admin/reports`
- **Status**: Server actions created, page needs update
- **To Do**: Implement report generation, download functionality

### ⏳ Settings
- **Location**: `/admin/settings`
- **Status**: Server actions created, page needs update
- **To Do**: Update page to load/save settings from database

## Server Actions Available

All server actions are in `/lib/supabase/actions/`:

- `courses.ts` - Course CRUD operations
- `sessions.ts` - Session CRUD operations
- `applications.ts` - Application create, read, update status
- `payments.ts` - Payment CRUD, export
- `reports.ts` - Report generation, data fetching
- `settings.ts` - Settings read/update

## Next Steps

1. Run `supabase-features-migration.sql` in Supabase SQL Editor
2. Test the courses page - create a course
3. Test the application form - submit an application
4. View the application in `/admin/applications`
5. Complete remaining admin pages (sessions, payments, reports, settings)

## Notes

- All tables have Row Level Security (RLS) enabled
- Admins can manage all data
- Students can view their own data
- Public can create applications
- Settings are viewable by everyone, editable by admins only
