# GreenKiddo LMS - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TS)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │   Services   │     │
│  │              │  │              │  │              │     │
│  │ - Dashboard  │  │ - CourseCard │  │ - CourseService│   │
│  │ - Catalog    │  │ - LessonPlayer│  │ - ProgressService│ │
│  │ - CourseDetail│  │ - Quiz       │  │ - UserService │   │
│  │ - LessonView │  │ - ProgressBar│  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Types     │  │    Store     │  │   Utils      │     │
│  │              │  │              │  │              │     │
│  │ - Course     │  │ - CourseStore│  │ - Formatters │     │
│  │ - Lesson     │  │ - UserStore  │  │ - Validators │     │
│  │ - Quiz       │  │ - ProgressStore│ │ - Helpers   │     │
│  │ - User       │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Future)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (To be implemented)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Database   │  │     API      │  │   Storage    │     │
│  │              │  │              │  │              │     │
│  │ - PostgreSQL │  │ - REST/GraphQL│  │ - S3/Cloudinary│  │
│  │ - Supabase   │  │ - Auth (Clerk)│  │ - Video Host │     │
│  │              │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow

### New User Journey
```
Landing Page (Hero)
    │
    ▼
Sign Up (Clerk)
    │
    ▼
Welcome/Dashboard
    │
    ▼
Browse Courses (Catalog)
    │
    ▼
View Course Details
    │
    ▼
Enroll in Course
    │
    ▼
Start Learning (Lesson Player)
    │
    ▼
Complete Lessons
    │
    ▼
Take Quiz
    │
    ▼
Earn Certificate
```

### Returning User Journey
```
Sign In
    │
    ▼
Dashboard
    │
    ├─► Continue Learning (Last accessed course)
    ├─► My Courses (All enrolled)
    └─► Recommended Courses
```

## 📊 Data Flow

### Course Enrollment Flow
```
User clicks "Enroll"
    │
    ▼
Check Authentication (Clerk)
    │
    ▼
Call CourseService.enrollInCourse()
    │
    ▼
Update User Profile (enrolledCourses)
    │
    ▼
Redirect to Course Detail / Dashboard
```

### Progress Tracking Flow
```
User completes lesson
    │
    ▼
Mark lesson as complete
    │
    ▼
Update UserProgress (local state)
    │
    ▼
Call CourseService.updateLessonProgress()
    │
    ▼
Update progress percentage
    │
    ▼
Check if course completed
    │
    ▼
Issue certificate (if all lessons done)
```

## 🗂️ Component Hierarchy

```
App
├── Router
│   ├── Navbar
│   ├── Routes
│   │   ├── / (Hero)
│   │   ├── /about (AboutUs)
│   │   ├── /services (Services)
│   │   ├── /blog (Blog)
│   │   ├── /contact (Contact)
│   │   ├── /courses (CourseCatalog) ⏳
│   │   ├── /courses/:id (CourseDetail) ⏳
│   │   ├── /courses/:id/lessons/:lessonId (LessonView) ⏳
│   │   ├── /dashboard (Dashboard) ⏳
│   │   └── /comingsoon (ComingSoon)
│   └── Footer
```

## 🎨 Design System

### Colors
- **Primary**: `green-ecco` (#34f63a)
- **Background**: Black (#000000)
- **Text**: White (#FFFFFF) / Gray (#CCCCCC)
- **Borders**: Gray (#333333)

### Typography
- **Font**: Inter (400, 700)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

### Components
- **Cards**: Rounded corners, border, hover effects
- **Buttons**: Rounded-full, green-ecco background
- **Progress Bars**: Animated, green-ecco fill
- **Badges**: Small, colored, rounded

## 🔐 Authentication Flow

```
┌─────────────┐
│  Public     │
│  Pages      │
└──────┬──────┘
       │
       │ Sign In Required
       ▼
┌─────────────┐
│  Clerk Auth │
└──────┬──────┘
       │
       │ Authenticated
       ▼
┌─────────────┐
│  Protected  │
│  Routes     │
└─────────────┘
```

## 📱 Responsive Design

- **Mobile**: < 768px
  - Hamburger menu
  - Single column layouts
  - Stacked cards

- **Tablet**: 768px - 1024px
  - 2-column grids
  - Expanded navigation

- **Desktop**: > 1024px
  - Full navigation
  - 3-4 column grids
  - Sidebar layouts

## 🚀 Performance Considerations

1. **Lazy Loading**
   - Code splitting for routes
   - Lazy load images (already using react-lazy-load-image-component)
   - Lazy load video players

2. **Caching**
   - Cache course data
   - Cache user progress
   - Use React Query for data fetching

3. **Optimization**
   - Optimize images (WebP format)
   - Compress videos
   - Minimize bundle size

## 🔄 State Management Strategy

### Current (Simple)
- React Context for global state
- Local state for component-specific data

### Future (Scalable)
- Zustand for global state
- React Query for server state
- Local Storage for persistence

## 📦 Key Dependencies

### Core
- `react` + `react-dom` - UI framework
- `react-router-dom` - Routing
- `typescript` - Type safety

### UI/UX
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `lucide-react` - Icons
- `daisyui` - UI components

### Auth
- `@clerk/clerk-react` - Authentication

### Forms
- `react-hook-form` - Form handling
- `zod` - Validation
- `@hookform/resolvers` - Form validation

### Future Additions
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `react-player` - Video playback
- `react-markdown` - Markdown rendering

## 🧪 Testing Strategy (Future)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Component interactions
- **E2E Tests**: Playwright or Cypress
- **Accessibility**: axe-core

## 📈 Analytics (Future)

- Track course enrollments
- Monitor lesson completion rates
- User engagement metrics
- Quiz performance analytics

---

*This architecture will evolve as features are added and the system scales.*

