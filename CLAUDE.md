# CLAUDE.md

## Common Commands

```bash
# Development
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production (test before deploy)
npm start                # Start production server after build

# Version Control
git status               # Check current changes
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to GitHub (auto-deploys via Vercel)

# Deployment
vercel --prod            # Manual deployment (if needed)
                         # Usually automatic via GitHub push
```

## Core Files & Their Purpose

### app/page.tsx
**Purpose:** Gallery view with filtering and build display

**Key Features:**
- Fetches builds from `data/builds.json`
- Sorts by `submittedAt` date (newest first)
- Multi-tag OR filtering (show builds matching ANY selected tag)
- Text search across projectName, description, builderName
- Responsive grid layout (1/2/3 columns based on screen size)
- Color rotation for BuildCards (5 colors cycling)

### app/submit/page.tsx
**Purpose:** Submission form for ambassadors

**Current State:** Logs JSON to console (development mode only)

**Form Fields:**
- Project Name (max 100 chars, required)
- Builder Name (max 50 chars, required)
- School (dropdown of 84 universities + "Other" with custom input, required)
- GitHub URL (validates https://github.com/username/repo format, optional)
- Website URL (validates HTTP/HTTPS protocol, optional)
- Claude Artifact URL (validates claude.ai/artifacts/* format, optional)
- Video Demo URL (YouTube or Loom only, validates hostname + protocol, required)
- Description (50-250 chars with live counter, required)
- Tags (multi-select from 6 options, at least 1 required)

**Note:** At least one project link (GitHub, Website, or Artifact) must be provided.

**Security Features:**
- Proper URL validation using `new URL()` parser
- Blocks javascript:, data:, file: protocol injection
- Validates GitHub hostname and repo path structure
- Input sanitization (trim whitespace before submission)
- Tag whitelist validation
- Development-only console logging

**Validation:**
- Real-time validation on blur
- Dynamic character counters with color feedback
- Inline error messages with icons
- Submit button disabled with tooltip when invalid
- Loading state during submission

### components/BuildCard.tsx
**Purpose:** Reusable card component for displaying builds

**Props:**
- `projectName: string` - Project title
- `builderName: string` - Creator's name
- `school: string` - School/university
- `description: string` - Project description
- `tags: string[]` - Category tags (productivity, automation, creative, tool, data analysis, game)
- `githubUrl?: string` - Link to source code (optional)
- `websiteUrl?: string` - Link to deployed website (optional)
- `artifactUrl?: string` - Link to Claude artifact (optional)
- `videoUrl: string` - YouTube or Loom demo URL
- `colorClass: string` - Background color (bg-warm-pink, bg-warm-green, bg-warm-blue, bg-warm-coral, bg-warm-lavender)

**Note:** At least one project link (githubUrl, websiteUrl, or artifactUrl) should be provided.

**Features:**
- Integrated VideoModal for in-page video playback
- Flexbox layout ensures buttons at same position (regardless of description length)
- Tag colors adapt when they clash with card background
- Hover effects: scale + shadow
- Opens links in new tab with `rel="noopener noreferrer"`

### components/FilterBar.tsx
**Purpose:** Tag and search filtering controls

**Props:**
- `selectedTags: string[]` - Currently active tag filters
- `onTagToggle: (tag: string) => void` - Toggle tag selection
- `searchQuery: string` - Current search text
- `onSearchChange: (query: string) => void` - Update search
- `onClearFilters: () => void` - Reset all filters

**Features:**
- Multi-select tag filtering (OR logic)
- Real-time search (matches name, description, builder)
- Shows "Clear all filters" when filters are active
- Responsive layout (stacks on mobile, horizontal on desktop)

### components/VideoModal.tsx
**Purpose:** Full-screen video player overlay

**Props:**
- `videoUrl: string` - YouTube or Loom URL to parse and embed
- `projectName: string` - Used in modal title (screen reader only)
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback to close modal

**Features:**
- Parses multiple YouTube URL formats (watch, youtu.be, embed)
- Parses Loom share URLs
- Full-screen overlay with backdrop blur
- Autoplay on open (where browser allows)
- Focus trap and keyboard navigation
- Escape key closes modal
- Click outside closes modal
- Iframe sandboxing for security (`allow-scripts allow-same-origin allow-presentation`)
- Smooth fade-in and zoom animations

### data/builds.json
**Purpose:** Build data store (manual updates for now)

**Schema:**
```json
{
  "builds": [
    {
      "id": "string",                           // Sequential: "001", "002", etc.
      "projectName": "string",                  // Max 100 chars
      "builderName": "string",                  // Max 50 chars
      "school": "string",                       // University name
      "githubUrl": "string",                    // OPTIONAL - https://github.com/username/repo
      "websiteUrl": "string",                   // OPTIONAL - Deployed website URL
      "artifactUrl": "string",                  // OPTIONAL - Claude artifact URL
      "videoUrl": "string",                     // YouTube or Loom URL
      "description": "string",                  // 50-250 chars
      "tags": ["string"],                       // Array of tags
      "submittedAt": "YYYY-MM-DD",             // ISO date format
      "featured": boolean                       // true/false
    }
  ]
}
```

**Important:** At least one project link (githubUrl, websiteUrl, or artifactUrl) must be provided.

**Available Tags:**
- productivity
- automation
- creative
- tool
- data analysis
- game

**Important:** Must maintain valid JSON (no trailing commas, proper escaping)

## Code Patterns

### Color Palette

**Background & Text:**
- `#F7F5F2` - Main background (bg-warm-bg)
- `#2C2416` - Primary text (text-warm-text)
- `#EBE8E1` - Secondary background (FilterBar, form inputs)

**Accent Colors:**
- `#D4896C` - Coral (Primary CTA, buttons, links)
- `#c47a5f` - Coral hover state
- `#b86f55` - Coral active state

**Card Background Colors:**
- `#E8B4BC` - Pink (bg-warm-pink)
- `#9CAF88` - Green (bg-warm-green)
- `#7BA3BC` - Blue (bg-warm-blue)
- `#D4896C` - Coral (bg-warm-coral)
- `#C4B5D4` - Lavender (bg-warm-lavender)

**Tag Colors:**
- Productivity: Blue (`#7BA3BC`)
- Automation: Coral (`#D4896C`)
- Creative: Lavender (`#C4B5D4`)
- Tool: Pink (`#E8B4BC`)
- Data Analysis: Blue (`#7BA3BC`)
- Game: Pink (`#E8B4BC`)

**Typography:**
- Headings: Freight Text Pro (serif)
- Body: Inter (sans-serif)

### Filtering Logic

Located in `app/page.tsx`:

```typescript
// Multi-tag OR filtering
const filteredBuilds = sortedBuilds.filter((build) => {
  // Tag filter: build must have at least one selected tag
  if (selectedTags.length > 0 && !build.tags.some((tag) => selectedTags.includes(tag))) {
    return false;
  }

  // Search filter: matches name, description, or builder
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const matchesName = build.projectName.toLowerCase().includes(query);
    const matchesDescription = build.description.toLowerCase().includes(query);
    const matchesBuilder = build.builderName.toLowerCase().includes(query);
    if (!matchesName && !matchesDescription && !matchesBuilder) {
      return false;
    }
  }

  return true;
});
```

**Logic:**
- Tags: OR logic (show builds with ANY selected tag)
- Search: AND logic with tags (both must match)
- Case-insensitive search
- Real-time filtering (no submit button)

### Video URL Parsing

Located in `components/VideoModal.tsx`:

```typescript
// Supported YouTube formats:
// https://www.youtube.com/watch?v=VIDEO_ID
// https://youtu.be/VIDEO_ID
// https://youtube.com/embed/VIDEO_ID

// Supported Loom format:
// https://www.loom.com/share/VIDEO_ID

// Regex patterns:
const youtubePatterns = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
];

const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);

// Converts to embed format with autoplay:
// https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0
// https://www.loom.com/embed/VIDEO_ID?autoplay=1
```

### Form Validation Pattern

Located in `app/submit/page.tsx`:

```typescript
// Real-time validation on blur
const handleBlur = (e) => {
  const { name, value } = e.target;
  setTouched((prev) => ({ ...prev, [name]: true }));
  const error = validateField(name, value);
  setErrors((prev) => ({ ...prev, [name]: error }));
};

// Show errors only after field is touched
{errors.fieldName && touched.fieldName && (
  <p className="mt-2 text-sm text-red-500">{errors.fieldName}</p>
)}

// Helper text shown when no error
{!errors.fieldName && (
  <p className="mt-2 text-sm text-warm-text/50">Helper text here</p>
)}

// URL validation using proper parsing
try {
  const url = new URL(value.trim());
  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
    return "Please enter a valid GitHub URL";
  }
  if (url.protocol !== 'https:') {
    return "GitHub URL must use HTTPS";
  }
} catch {
  return "Please enter a valid URL";
}
```

### Modal Component Pattern

Located in `components/VideoModal.tsx`:

```typescript
// Focus trap on open
useEffect(() => {
  if (isOpen) {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }
}, [isOpen]);

// Click outside to close
const handleBackdropClick = (e) => {
  if (e.target === modalRef.current) {
    onClose();
  }
};

// Escape key to close
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape" && isOpen) onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isOpen, onClose]);
```

### BuildCard Button Alignment

Located in `components/BuildCard.tsx`:

```typescript
// Outer card container uses flexbox
<div className="flex flex-col">
  {/* Inner content container also flexbox */}
  <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
    {/* Header section */}
    <div>...</div>

    {/* Description with flex-1 to fill space */}
    <div className="flex-1">
      <p>{description}</p>
    </div>

    {/* Tags section */}
    <div>...</div>

    {/* Buttons always at bottom */}
    <div className="flex gap-2">
      <button>View Demo</button>
      <a>View Code</a>
    </div>
  </div>
</div>
```

This ensures buttons appear at the same position regardless of description length.

## How to Add a New Build (Current Workflow)

**Manual Process (until automated):**

1. **Ambassador submits via /submit form**
   - Fill out all required fields
   - Click "Submit Build"
   - Success modal appears

2. **Review console output** (development mode)
   - Open browser DevTools → Console tab
   - Copy the formatted JSON object
   - Verify all fields are correct

3. **Manually edit data/builds.json**
   - Open `data/builds.json` in code editor
   - Add new entry to `builds` array
   - Assign next sequential ID (e.g., if last is "006", use "007")
   - Set `submittedAt` to current date (YYYY-MM-DD format)
   - Set `featured: false` (or true for spotlight builds)
   - **Important:** Ensure valid JSON (no trailing commas!)

4. **Example entry:**
```json
{
  "id": "007",
  "projectName": "My Awesome Project",
  "builderName": "Jane Doe",
  "school": "Stanford University",
  "githubUrl": "https://github.com/janedoe/awesome-project",
  "videoUrl": "https://www.loom.com/share/abc123def456",
  "description": "A web app that does something amazing with AI and helps users solve real problems.",
  "tags": ["productivity", "tool"],
  "submittedAt": "2026-01-18",
  "featured": false
}
```

5. **Commit changes**
```bash
git add data/builds.json
git commit -m "Add build: My Awesome Project"
git push
```

6. **Auto-deploy**
   - Vercel automatically deploys on push to main
   - New build appears in gallery within ~2 minutes
   - Verify on production site

## Known Issues / Future Enhancements

### Current Limitations
- [ ] **Manual build approval process** - Requires editing JSON manually
- [ ] **No automated PR workflow** - Submissions don't create PRs
- [ ] **No video thumbnails** - Cards show text only, no preview images
- [ ] **No build edit/delete** - Must manually edit JSON to update/remove
- [ ] **No email notifications** - Admins not notified of new submissions
- [ ] **No form persistence** - Navigating away loses form data
- [ ] **No submission analytics** - Can't track submission trends
- [ ] **FilterBar state not persisted** - Resets on page reload

### Known Bugs
- [ ] **Loom URLs with trailing slash** - Regex may not parse `https://www.loom.com/share/abc123/`
- [ ] **Very long school names** - Custom school input could overflow in card display

### Future Enhancements (v2)
- [ ] **Automated submission workflow**
  - Form submission creates PR with JSON changes
  - Review and approve via GitHub PR interface
  - Merge PR auto-deploys to production

- [ ] **Video thumbnail preview**
  - Extract thumbnail from YouTube/Loom API
  - Display on BuildCard before clicking
  - Lazy load thumbnails for performance

- [ ] **Build management dashboard**
  - Admin panel for approve/reject/edit
  - Search and filter submissions
  - Bulk actions (approve multiple, delete spam)

- [ ] **Email notifications**
  - Send email to admins on new submission
  - Send confirmation email to builder
  - Notify builder when build is approved

- [ ] **Enhanced filtering**
  - Filter by school
  - Filter by date range
  - Sort by: newest, oldest, featured
  - Difficulty level filter (if re-added)

- [ ] **Improved UX**
  - Save draft in localStorage
  - "Are you sure?" before navigating away
  - Show submission count on homepage
  - Featured builds carousel

- [ ] **Analytics & Insights**
  - Track views per build
  - Popular tags/schools
  - Submission trends over time
  - Ambassador leaderboard

## Development Notes

### Important Quirks

**Video Embed URLs:**
- YouTube embeds must use `/embed/` format, not `/watch?v=`
- VideoModal component handles this conversion automatically
- Loom URLs must be share URLs, not embed URLs (we convert them)

**builds.json Validation:**
- **CRITICAL:** Must maintain valid JSON at all times
- Trailing commas will break the entire site
- Use a JSON validator before committing
- Missing required fields will cause runtime errors

**FilterBar State:**
- Filter selections are NOT persisted in localStorage
- State resets on page reload or navigation
- This is intentional - fresh state on each visit
- Could add URL query params for shareable filtered views

**Form Security:**
- Frontend validation is NOT security - it's UX
- All validation must be re-implemented on backend
- Never trust client-side data
- Current implementation logs to console (dev only)

**Custom School Field:**
- Only appears when "Other" is selected from dropdown
- Has 100-character limit (enforced via maxLength + validation)
- Must be filled if "Other" is selected
- Replaces "Other" in submission data with actual school name

**Tag Colors vs Card Colors:**
- Tags automatically adjust when they match card background
- Example: "automation" (coral) on coral card uses darker shade
- See `cardTagColorMap` in BuildCard.tsx for clash detection

**Mobile Touch Targets:**
- All buttons: 44px minimum on desktop, 48px on mobile
- Form inputs: 16px font size to prevent iOS zoom
- Ensures accessible touch targets per WCAG guidelines

**Console Logging:**
- `console.log` only runs in `NODE_ENV === 'development'`
- Production builds do NOT log form submissions
- Prevents PII leakage in production
- Check `process.env.NODE_ENV` before logging

### Common Mistakes

**ESLint Issues:**
- Escape apostrophes in JSX: use `&apos;` not `'`
- Example: `We&apos;ll` instead of `We'll`

**Video URLs:**
- Always use https:// for GitHub URLs
- Test Loom URLs with real share links (sample data uses fake IDs)
- YouTube video IDs support letters, numbers, hyphens, underscores
- Don't include query params when adding to builds.json

**Form Validation:**
- Description must be 50-250 chars (not 0-250)
- At least 1 tag must be selected (not optional)
- Builder name is required (defaults to empty, not pre-filled)
- GitHub URL must be complete repo URL (username + repo name)

**Color Consistency:**
- All CTAs use: `bg-warm-coral hover:bg-[#c47a5f] active:bg-[#b86f55]`
- Keep hover/active states consistent across components
- Don't introduce new accent colors without updating palette

**JSON Formatting:**
```json
// ❌ WRONG - Trailing comma breaks JSON
{
  "builds": [
    { "id": "001", ... },
    { "id": "002", ... },  // ← This comma breaks everything
  ]
}

// ✅ CORRECT - No trailing comma
{
  "builds": [
    { "id": "001", ... },
    { "id": "002", ... }  // ← No comma on last item
  ]
}
```

## Accessibility Features

### Keyboard Navigation
- All form fields tab in logical order
- Modal traps focus when open
- Escape key closes modal
- Enter key submits form
- Clear buttons accessible via keyboard

### Screen Readers
- Form labels properly associated with inputs via `htmlFor`
- Error messages use ARIA patterns
- Modal has `aria-modal="true"` and `role="dialog"`
- Hidden h2 in modal for screen reader title (`sr-only` class)
- Button aria-labels for icon-only buttons

### Touch Targets
- All buttons: 44px minimum on desktop
- Mobile: 48px minimum for better tapping
- Form inputs: proper sizing with padding
- Links have sufficient spacing

### Color Contrast
- All text meets WCAG AA standards
- Error messages red with icon (not color-only)
- Links and buttons have hover/active states
- Focus indicators visible on all interactive elements

## Testing

See detailed testing documentation:
- **`instructions/testing-log.md`** - Comprehensive E2E testing results
- **`instructions/security-review.md`** - Security audit findings
- **`instructions/security-fixes-applied.md`** - All security patches applied

### Quick Smoke Test (5 minutes)

1. **Gallery Page**
   - ✅ Builds load and display
   - ✅ Filter by tag works
   - ✅ Search works
   - ✅ Video modal opens and plays

2. **Submit Form**
   - ✅ All validation works
   - ✅ Error messages show
   - ✅ Success modal appears
   - ✅ Form clears after submit

3. **Mobile View**
   - ✅ Responsive layout works
   - ✅ Touch targets adequate
   - ✅ No horizontal scroll

## Deployment

**Current Setup:**
- Hosted on Vercel
- Auto-deploys on push to `main` branch
- Build command: `npm run build`
- Output directory: `.next`

**Environment:**
- Node.js version: 18.x or higher
- Framework: Next.js 14.2.35
- No environment variables required

**Manual Deploy:**
```bash
vercel --prod
```

**Deployment Checklist:**
1. Run `npm run build` locally to verify
2. Check for TypeScript errors
3. Check for ESLint errors
4. Test production build with `npm start`
5. Push to GitHub
6. Verify deployment on Vercel dashboard
7. Test production site thoroughly

## Project Structure

```
claude-showcase/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Gallery page (home)
│   └── submit/
│       └── page.tsx        # Submission form
├── components/
│   ├── BuildCard.tsx       # Build display card
│   ├── FilterBar.tsx       # Tag/search filtering
│   └── VideoModal.tsx      # Video player overlay
├── data/
│   └── builds.json         # Build data store
├── instructions/
│   ├── security-review.md          # Security audit
│   ├── security-fixes-applied.md   # Security patches
│   └── testing-log.md              # E2E test results
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── CLAUDE.md              # This file
```

## Support & Resources

**For Questions:**
- Check this CLAUDE.md first
- Review testing documentation in `instructions/`
- Check git commit history for context

**Common Resources:**
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vercel Deployment: https://vercel.com/docs

**Repository:**
- GitHub: https://github.com/manhinwong/claude-showcase
- Production: [Vercel URL]
