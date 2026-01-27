# New Beginning Academy Website

A modern, responsive website for New Beginning Academy - a programming and robotics education academy for kids. Built with Next.js 16 and React 19, featuring a beautiful UI with dark mode support, student portals, and admin dashboards.

## 🚀 Technologies Used

### Core Framework
- **Next.js 16.0.10** - React framework with App Router for server-side rendering and static site generation
- **React 19.2.0** - Modern React with latest features
- **TypeScript 5** - Type-safe JavaScript

### UI & Styling
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives (Accordion, Dialog, Dropdown, Tabs, etc.)
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **Lucide React** - Modern icon library
- **next-themes** - Dark mode support

### Forms & Validation
- **React Hook Form 7.60.0** - Performant forms with easy validation
- **Zod 3.25.76** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Data Visualization
- **Recharts 2.15.4** - Composable charting library built on React and D3

### Additional Libraries
- **date-fns 4.1.0** - Modern JavaScript date utility library
- **react-day-picker 9.8.0** - Flexible date picker component
- **embla-carousel-react 8.5.1** - Carousel/slider component
- **sonner 1.7.4** - Toast notifications
- **cmdk 1.0.4** - Command menu component
- **vaul 1.1.2** - Drawer component
- **react-resizable-panels 2.1.7** - Resizable panel layouts

### Analytics
- **@vercel/analytics 1.3.1** - Web analytics integration

### Development Tools
- **PostCSS 8.5** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing
- **ESLint** - Code linting

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── admin/             # Admin dashboard pages
│   │   ├── applications/  # Application management
│   │   ├── courses/       # Course management
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── instructors/   # Instructor management
│   │   ├── payments/      # Payment management
│   │   ├── reports/       # Reports and analytics
│   │   ├── schedule/       # Schedule management
│   │   ├── settings/      # Settings
│   │   └── students/      # Student management
│   ├── apply/             # Application form
│   ├── contact/           # Contact page
│   ├── curriculum/        # Curriculum page
│   ├── gallery/           # Gallery page
│   ├── login/             # Login page
│   ├── portal/            # Student portal
│   │   ├── assignments/   # Student assignments
│   │   ├── certificates/  # Certificates
│   │   ├── courses/       # Student courses
│   │   ├── dashboard/     # Student dashboard
│   │   └── schedule/      # Student schedule
│   ├── programs/          # Programs page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── home/              # Home page sections
│   ├── ui/                # shadcn/ui components
│   ├── footer.tsx         # Footer component
│   ├── navbar.tsx         # Navigation bar
│   └── theme-provider.tsx # Theme provider
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/                # Static assets

```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ (or use a Node version manager like nvm)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new-beginning-academy-website
```

2. Install dependencies:
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. Run the development server:
```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- **Netlify** - Configure build command: `next build` and publish directory: `.next`
- **AWS Amplify** - Auto-detects Next.js
- **Railway** - Supports Next.js out of the box
- **Docker** - Build a Docker image and deploy anywhere

### Environment Variables

If you need to add environment variables, create a `.env.local` file:

```env
# Example environment variables
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 🎨 Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Student portal with assignments, courses, and certificates
- ✅ Admin dashboard with comprehensive management tools
- ✅ Application system
- ✅ Payment management
- ✅ Course and curriculum pages
- ✅ Gallery with filtering
- ✅ Contact forms
- ✅ Modern UI with smooth animations

## 📝 Notes

- The project uses Next.js App Router (not Pages Router)
- All components are built with TypeScript for type safety
- UI components use Radix UI primitives for accessibility
- The site is optimized for SEO with proper metadata
- Images are configured to be unoptimized (can be changed in `next.config.mjs`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For support, email support@newbeginningacademy.com or contact through the website.

---

Built with ❤️ for New Beginning Academy
