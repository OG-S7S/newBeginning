# Admin Panel Management Guide

This guide explains how to use the admin panel to manage all dynamic content on your website.

## Available Admin Pages

### 1. Programs Management (`/admin/programs`)

**Features:**
- View all programs
- Create new programs
- Edit existing programs
- Delete programs
- Manage program details:
  - Basic info (title, ages, duration, class size)
  - Description
  - Highlights (multiple)
  - Learning outcomes (multiple)
  - Sample projects (multiple)
  - Display order
  - Active/inactive status

**How to Use:**
1. Go to **Admin Panel → Programs**
2. Click **"Add Program"** to create a new program
3. Fill in all required fields
4. Add highlights, outcomes, and projects using the "+" buttons
5. Set display order (lower numbers appear first)
6. Toggle "Active" to show/hide on website
7. Click **"Create Program"** or **"Update Program"**

**Tips:**
- Program ID is auto-generated from title (lowercase, hyphens)
- Use Tailwind color classes for the color field (e.g., `bg-[#ffb800]`)
- Icon name should match Lucide icon names (Rocket, Cog, Cpu, Code)

### 2. Gallery Management (`/admin/gallery`)

**Features:**
- View all gallery items
- Create new items
- Edit existing items
- Delete items
- Filter by category (Projects, Competitions, Classes, Events)
- Mark items as featured

**How to Use:**
1. Go to **Admin Panel → Gallery**
2. Click **"Add Item"**
3. Select category and type (Image/Video)
4. Enter title and description
5. Add image/video URLs
6. Set display order
7. Mark as featured if needed
8. Save

**Tips:**
- Use image hosting services (Cloudinary, Imgur, etc.) for images
- For videos, use YouTube/Vimeo embed URLs
- Featured items appear first in the gallery

### 3. Curriculum Management (Coming Soon)

**Features:**
- Manage curriculum modules for each program
- Add topics to modules
- Organize by weeks
- Set learning outcomes

### 4. Students Management

**Features:**
- View all students
- Edit student profiles
- Manage enrollments
- Track student status

**Note:** Students are created through the signup process. You can edit their profiles and enrollments in the admin panel.

### 5. Instructors Management

**Features:**
- View all instructors
- Add new instructors
- Assign instructors to programs
- Manage specializations

## Database Structure

### Programs
- Main table: `programs`
- Related tables:
  - `program_highlights` - Program highlights
  - `program_outcomes` - Learning outcomes
  - `program_projects` - Sample projects

### Gallery
- Main table: `gallery_items`
- Categories: projects, competitions, classes, events
- Types: image, video

### Curriculum
- Main table: `curriculum_modules`
- Related table: `curriculum_topics`

## Best Practices

1. **Always test changes** - After updating content, check the public-facing pages
2. **Use descriptive titles** - Make titles clear and engaging
3. **Keep content updated** - Regularly update programs and gallery
4. **Organize with display_order** - Use display order to control what appears first
5. **Use active/inactive** - Hide content instead of deleting when possible

## Troubleshooting

### Programs not showing on website
- Check that `is_active = true` in the database
- Verify the program exists in the `programs` table
- Check browser console for errors

### Gallery items not loading
- Verify image/video URLs are accessible
- Check that URLs are complete (include https://)
- Ensure category matches one of: projects, competitions, classes, events

### Can't edit/delete items
- Verify you're logged in as admin
- Check that RLS policies are set correctly
- Refresh the page and try again

## Next Steps

Additional admin pages will be added for:
- Curriculum management
- Enhanced student management
- Instructor management
- Application review
- Course management
