# Testing Checklist - Claude Showcase

## Prerequisites
- Run `npm run dev` and open `http://localhost:3000`
- Have browser DevTools console open (F12 → Console tab)
- Test in both desktop (1920x1080) and mobile (375x667) viewports

---

## 1. Submission Form - Valid Data

### Test Steps:
1. Navigate to `/submit` or click "Submit Build" in header
2. Fill out form with valid data:
   ```
   Project Name: Test Automation Tool
   Builder Name: Marcus Chen (pre-filled)
   School: UC Berkeley
   GitHub URL: https://github.com/test/repo
   Video URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   Description: This is a comprehensive test automation tool built with Claude Code. It helps developers write better tests faster by providing intelligent suggestions and auto-generating test cases based on code analysis.
   Tags: Select "productivity" and "automation"
   ```
3. Click "Submit Build"

### Expected Results:
- [ ] Form validates successfully (all fields green/no errors)
- [ ] Submit button shows "Submitting..." with spinner for 1.5s
- [ ] Success modal appears with green checkmark
- [ ] Console shows formatted JSON:
  ```json
  {
    "projectName": "Test Automation Tool",
    "builderName": "Marcus Chen",
    "school": "UC Berkeley",
    ...
  }
  ```
- [ ] Form clears after submission
- [ ] Modal can be closed via X button, "View Gallery" button, or Escape key

---

## 2. Invalid GitHub URL Validation

### Test Steps:
1. Navigate to `/submit`
2. Fill form but use invalid GitHub URL:
   ```
   GitHub URL: https://google.com/search
   ```
3. Click out of the GitHub URL field (trigger blur)

### Expected Results:
- [ ] Red error icon appears
- [ ] Error message shows: "Please enter a valid GitHub URL starting with https://github.com/"
- [ ] Helper text disappears when error is shown
- [ ] Field border turns red
- [ ] Submit button remains disabled
- [ ] Hovering submit button shows tooltip listing missing/invalid fields

### Additional Invalid URLs to Test:
- [ ] `http://github.com/test/repo` (http not https)
- [ ] `github.com/test/repo` (missing protocol)
- [ ] `https://gitlab.com/test/repo` (wrong domain)

---

## 3. No Tags Selected Validation

### Test Steps:
1. Navigate to `/submit`
2. Fill all fields EXCEPT tags
3. Try to submit

### Expected Results:
- [ ] Submit button is disabled (grayed out)
- [ ] Hovering submit button shows tooltip: "Missing required fields: • At least one tag"
- [ ] No tags have checkmarks
- [ ] After clicking a tag:
  - [ ] Tag turns coral background
  - [ ] Checkmark icon appears before tag name
  - [ ] Submit button becomes enabled

---

## 4. Video URL Format Validation

### Test A: YouTube URL Formats
Try each format separately and verify all work:

1. **Standard YouTube:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
   - [ ] No error shown
   - [ ] Helper text: "Paste your YouTube or Loom link"

2. **Short YouTube:**
   ```
   https://youtu.be/dQw4w9WgXcQ
   ```
   - [ ] No error shown

3. **YouTube Embed:**
   ```
   https://youtube.com/embed/dQw4w9WgXcQ
   ```
   - [ ] No error shown

### Test B: Loom URL Format
```
https://www.loom.com/share/abc123def456
```
- [ ] No error shown
- [ ] Accepts Loom URLs

### Test C: Invalid Video URL
```
https://vimeo.com/123456789
```
- [ ] Error shown: "Please enter a valid YouTube or Loom URL"
- [ ] Field border turns red

---

## 5. Description Character Counter

### Test Steps:
1. Type in description field and watch counter

### Expected Results:
- [ ] Counter shows `0/250` initially (gray)
- [ ] While typing under 50 chars: counter is amber, helper text shows "X more characters needed"
- [ ] At exactly 50 chars: counter turns green, helper text shows "Looking good!"
- [ ] Between 50-220 chars: counter is green
- [ ] Between 221-250 chars: counter turns amber (warning approaching limit)
- [ ] At 250+ chars: counter turns red, error shows "Description must be 250 characters or less"
- [ ] Counter updates in real-time as you type

---

## 6. Gallery Video Modal - YouTube

### Test Steps:
1. Navigate to `/` (gallery page)
2. Find a build with YouTube URL
3. Click "View Demo" button

### Expected Results:
- [ ] Modal opens with dark overlay (black/80% opacity with blur)
- [ ] Video container is centered on screen
- [ ] Video has 16:9 aspect ratio
- [ ] Video autoplays
- [ ] Project name shown below video in white text
- [ ] Close button (X) visible in top-right (white on dark background)
- [ ] Focus is on close button (visible focus ring)
- [ ] Body scroll is disabled while modal is open

### Close Modal Tests:
- [ ] **X button**: Click X → modal closes
- [ ] **Outside click**: Click dark overlay → modal closes
- [ ] **Escape key**: Press Escape → modal closes
- [ ] After closing: focus returns to "View Demo" button
- [ ] After closing: body scroll is restored

---

## 7. Gallery Video Modal - Loom

### Test Steps:
1. Add a test build to `data/builds.json` with Loom URL:
   ```json
   {
     "id": "test-loom",
     "projectName": "Loom Test",
     "builderName": "Test User",
     "school": "Test School",
     "githubUrl": "https://github.com/test/loom",
     "videoUrl": "https://www.loom.com/share/abc123",
     "description": "Testing Loom video integration with the video modal component",
     "tags": ["tool"],
     "difficulty": "beginner",
     "submittedAt": "2025-01-18",
     "featured": false
   }
   ```
2. Reload page
3. Click "View Demo" on the Loom test build

### Expected Results:
- [ ] Loom video loads in modal
- [ ] Embed URL format: `https://www.loom.com/embed/abc123?autoplay=1`
- [ ] Video autoplays
- [ ] All modal features work (close, escape, outside click)

---

## 8. Mobile Viewport Testing

### Setup:
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select "iPhone SE" (375x667) or "iPhone 12 Pro" (390x844)

### Test A: Submission Form Mobile
- [ ] Form stacks in single column
- [ ] All inputs are min 44px height (good touch targets)
- [ ] Input font size is 16px (prevents iOS zoom on focus)
- [ ] Tags wrap properly and remain tappable
- [ ] Submit button is full width and easy to tap
- [ ] Modal fills mobile screen properly
- [ ] No horizontal scroll on any page

### Test B: Gallery Mobile
- [ ] Cards display in 1 column
- [ ] Filter bar stacks vertically
- [ ] Search input is full width
- [ ] Tag filter buttons are tappable (48px height)
- [ ] "View Demo" and "View Code" buttons stack vertically
- [ ] Buttons are 48px height on mobile (good touch targets)

### Test C: Video Modal Mobile
- [ ] Modal takes ~90% of screen width (p-4 padding)
- [ ] Video maintains 16:9 aspect ratio
- [ ] Close button is large enough to tap
- [ ] No content cut off
- [ ] Scrolling disabled on modal open

---

## 9. Navigation Flow

### Test Steps:
1. Start at `/` (gallery)
2. Click "Submit Build" in header → goes to `/submit`
3. Click logo → returns to `/`
4. Go to `/submit`
5. Click "Gallery" link → returns to `/`

### Expected Results:
- [ ] Header navigation is consistent on all pages
- [ ] "Gallery" link is subtle on gallery page
- [ ] "Submit Build" is highlighted (coral) on gallery page
- [ ] On submit page: "Gallery" is highlighted, "Submit Build" is muted/disabled
- [ ] Logo always links to home

---

## 10. Filter & Search Functionality

### Test A: Tag Filtering
1. Select "productivity" tag
   - [ ] Only productivity builds shown
   - [ ] Tag button is coral (active state)
2. Add "automation" tag
   - [ ] Builds with EITHER tag shown (OR logic)
   - [ ] Both tags are coral
3. Click "Clear all filters"
   - [ ] All builds shown again
   - [ ] Tags reset to white

### Test B: Search
1. Type "Claude" in search
   - [ ] Only matching builds shown
   - [ ] Clear (X) button appears in search input
2. Click clear X
   - [ ] Search clears
   - [ ] All builds shown again

### Test C: Combined Filters
1. Select "tool" tag AND search "automation"
   - [ ] Shows builds matching BOTH criteria
   - [ ] "Clear all filters" button appears

### Test D: Empty State
1. Search for "zzzznonexistent"
   - [ ] "No projects match your filters" message shown
   - [ ] "Clear filters" button shown
   - [ ] Clicking clear filters shows all builds again

---

## 11. Accessibility Testing

### Keyboard Navigation:
- [ ] Tab through form fields in logical order
- [ ] All buttons are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Modal traps focus (can't tab outside modal)
- [ ] Escape closes modal

### Screen Reader (Optional):
- [ ] Form labels are read correctly
- [ ] Error messages are announced
- [ ] Modal has proper ARIA labels
- [ ] "View Demo" announces as button

---

## 12. Edge Cases & Error Handling

### Test A: Very Long Project Name
- [ ] Name truncates at 100 chars
- [ ] Cannot type beyond 100 chars

### Test B: Very Long Description
- [ ] Description truncates at 250 chars
- [ ] Counter shows 250/250 in red
- [ ] Cannot type beyond 250 chars

### Test C: Invalid Video URL in Data
Add build with invalid video URL to `builds.json`:
```json
"videoUrl": "https://invalid-url.com/video"
```
- [ ] Card still renders
- [ ] "View Demo" button is clickable
- [ ] Modal shows error: "Unable to load video"
- [ ] Error message is clear and actionable

### Test D: Network Simulation (Optional)
1. Open DevTools → Network tab
2. Throttle to "Slow 3G"
3. Submit form
   - [ ] Loading spinner shows
   - [ ] Form doesn't allow double-submit
   - [ ] Success modal waits for "submission" to complete

---

## 13. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

## Known Issues to Check

### Potential Issues to Watch For:
1. **Modal z-index conflicts** - Does modal appear above everything?
2. **Focus trap breaking** - Can you tab outside modal?
3. **Video autoplay** - Does video play on modal open? (Some browsers block autoplay)
4. **Form state persistence** - Does form clear properly after success?
5. **Multiple modals** - What happens if you open modal, close, open another?
6. **Rapid clicks** - Can you double-submit form by clicking fast?

---

## Bug Reporting Template

If you find a bug, document it like this:

```
### Bug: [Short description]

**Steps to Reproduce:**
1.
2.
3.

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happens]

**Screenshots:**
[If applicable]

**Browser/Device:**
[Chrome 120, iPhone 12, etc.]

**Severity:**
[Critical / High / Medium / Low]
```

---

## Testing Completion Checklist

- [ ] All form validation scenarios tested
- [ ] Video modal works with YouTube and Loom
- [ ] Mobile responsiveness verified
- [ ] Keyboard navigation works
- [ ] No console errors
- [ ] All user flows complete successfully
- [ ] Accessibility basics pass
- [ ] Cross-browser compatibility confirmed

---

## Quick Test Script (5 min smoke test)

For rapid testing after changes:

1. ✅ Submit valid form → see success modal
2. ✅ Submit with invalid URL → see error
3. ✅ Open video modal → plays video
4. ✅ Close modal with Escape → closes properly
5. ✅ Filter by tag → shows filtered results
6. ✅ Search → finds matching builds
7. ✅ Test on mobile viewport → everything fits
8. ✅ Navigate between pages → works smoothly

---

**Last Updated:** 2025-01-18
**Test Coverage:** Form validation, video modal, filtering, mobile, accessibility
