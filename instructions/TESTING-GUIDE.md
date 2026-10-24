# Testing Guide - Quick Start

## What I've Done

I've created comprehensive testing documentation and fixed critical issues:

### ✅ Documents Created:
1. **`testing-checklist.md`** - Complete testing scenarios (13 sections, ~100 test cases)
2. **`code-review-findings.md`** - Code analysis with potential issues identified
3. **`TESTING-GUIDE.md`** - This file (quick start guide)

### ✅ Issues Fixed:
1. **Replaced placeholder data** in `builds.json` with 6 sample projects
   - Mix of YouTube and Loom URLs
   - Variety of tags and difficulty levels
   - Valid GitHub URLs and descriptions

### 📋 What I Cannot Do:
I cannot actually run the application in a browser or interact with it. I can only:
- Analyze code
- Create documentation
- Suggest tests
- Identify potential issues

**You'll need to run the manual tests yourself.**

---

## Quick Start Testing (10 minutes)

### 1. Start the Development Server
```bash
npm run dev
```
Then open: `http://localhost:3000`

### 2. Visual Check (2 min)
- ✅ Gallery page shows 6 sample builds
- ✅ Cards have pastel backgrounds (pink, green, blue, coral, lavender)
- ✅ Header has "Submit Build" button
- ✅ Filter bar appears below title

### 3. Video Modal Test (2 min)
1. Click any "View Demo" button
2. **Expected:** Full-screen modal with video
3. Test closing:
   - Click X button
   - Click dark overlay
   - Press Escape key
4. **Expected:** All three methods close the modal

### 4. Form Submission Test (3 min)
1. Click "Submit Build" in header
2. Fill out form with this data:
   ```
   Project Name: Test Project
   Builder Name: [Type your name]
   School: UC Berkeley
   GitHub: https://github.com/test/repo
   Video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   Description: This is a test project built with Claude Code. It demonstrates the submission form validation and success flow. Testing character count here.
   Tags: Click "productivity" and "automation"
   ```
3. Click Submit
4. **Expected:**
   - ✅ Button shows "Submitting..." with spinner
   - ✅ Success modal appears after 1.5s
   - ✅ Console shows JSON data (open DevTools)
   - ✅ Form clears

### 5. Validation Test (2 min)
1. Try submitting with invalid GitHub URL:
   ```
   GitHub: https://google.com
   ```
2. **Expected:** Error message appears
3. Try submitting with no tags selected
4. **Expected:** Submit button is disabled, tooltip shows "Missing: At least one tag"

### 6. Mobile Test (1 min)
1. Open DevTools (F12)
2. Toggle device mode (Ctrl+Shift+M)
3. Select iPhone SE or similar
4. **Expected:**
   - Gallery: Cards stack in 1 column
   - Form: Single column layout
   - Buttons: Large enough to tap (48px)

---

## If Everything Works ✅

You should see:
- ✅ Gallery displays 6 sample projects
- ✅ Video modal opens and plays
- ✅ Form validates and submits successfully
- ✅ Mobile layout is responsive
- ✅ No console errors

**Congratulations! Core functionality is working.**

---

## If You Find Issues ❌

### Common Issues & Fixes:

**Issue:** "Cannot find module VideoModal"
- **Fix:** Make sure you saved `components/VideoModal.tsx`
- Run: `npm run dev` again

**Issue:** Videos don't play
- **Check:** Browser console for errors
- **Note:** Loom URL `abc123def456` is fake, won't actually load
- **Fix:** Use a real Loom share link for testing

**Issue:** Form won't submit
- **Check:** All validation passes
- **Check:** Browser console for errors
- **Try:** Refresh page and try again

**Issue:** Styling looks wrong
- **Check:** Tailwind is compiling (restart dev server)
- **Check:** No CSS cache issues (hard refresh: Ctrl+Shift+R)

**Issue:** TypeScript errors
- **Fix:** Run `npm install` to ensure dependencies are installed
- **Check:** No syntax errors in the files

---

## Deep Testing (Full Checklist)

For comprehensive testing, follow:
**`testing-checklist.md`** - 13 sections with all edge cases

Key sections to prioritize:
1. Form validation (Section 2-5)
2. Video modal (Section 6-7)
3. Mobile responsiveness (Section 8)
4. Filter & search (Section 10)

---

## Code Review Items

For code quality checks, see:
**`code-review-findings.md`** - Identified issues and recommendations

### Must Address:
1. ⚠️ **Multiple modal scenario** - Test if clicking another "View Demo" while modal is open causes issues

### Should Test:
2. ⚠️ **Loom URLs with trailing slashes** - Try: `https://www.loom.com/share/abc123/`
3. ⚠️ **Video autoplay** - May not work in all browsers (expected)

---

## Testing Workflow

### For Each Feature Change:
1. Run quick smoke test (5 min)
2. Test specific changed functionality
3. Check console for errors
4. Test on mobile viewport
5. Verify no regressions

### Before Deployment:
1. Complete full testing checklist
2. Test in Chrome, Firefox, Safari
3. Test on real mobile device
4. Fix all critical issues
5. Document any known limitations

---

## Sample Test Data

### Valid YouTube URLs to Test:
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://youtube.com/embed/dQw4w9WgXcQ
```

### Valid Loom URL to Test:
```
https://www.loom.com/share/[GET_REAL_LOOM_ID_FROM_LOOM.COM]
```

### Invalid URLs to Test:
```
https://vimeo.com/123456
https://google.com
http://github.com/test/repo (http not https)
```

### Good Description (148 chars):
```
This is a comprehensive test of the form validation system. It demonstrates how Claude Code can help developers build better applications faster.
```

### Too Short Description (30 chars):
```
This is too short to submit.
```

---

## Performance Checks

### Page Load:
- ✅ Gallery loads in < 2 seconds
- ✅ Images load progressively
- ✅ No layout shift

### Interactions:
- ✅ Modal opens instantly
- ✅ Form validation feels responsive
- ✅ Filters update immediately

### Mobile:
- ✅ Touch targets are tappable
- ✅ No accidental zooms
- ✅ Smooth scrolling

---

## Accessibility Quick Check

### Keyboard:
- ✅ Tab through all form fields
- ✅ Enter submits form
- ✅ Escape closes modal
- ✅ Focus indicators visible

### Screen Reader (Optional):
- ✅ Form labels read correctly
- ✅ Error messages announced
- ✅ Buttons have clear labels

---

## Bug Reporting

If you find bugs, document in this format:

```markdown
## Bug: [Title]

**Steps:**
1. Go to...
2. Click...
3. See error...

**Expected:** [What should happen]
**Actual:** [What happens]
**Browser:** Chrome 120
**Device:** Desktop
**Severity:** High/Medium/Low
```

Save bugs to: `instructions/bugs.md`

---

## Next Steps

1. ✅ Run quick start test (10 min)
2. ⏭️ If all works → Deploy or add more features
3. ⏭️ If issues → Check `code-review-findings.md` for hints
4. ⏭️ For comprehensive testing → Use `testing-checklist.md`

---

## Questions?

Common questions:

**Q: Can I modify the sample data?**
A: Yes! Edit `data/builds.json` with your own projects.

**Q: Why isn't the Loom video loading?**
A: The sample Loom URL is fake (`abc123def456`). Use a real Loom share link.

**Q: How do I add real YouTube videos?**
A: Replace the sample URL with any YouTube video ID in `builds.json`.

**Q: Where do submitted forms go?**
A: They're logged to console only (no backend). Check browser DevTools → Console.

**Q: Can I test with real submissions?**
A: Yes! Submit form and manually add the data to `builds.json` to see it in gallery.

---

**Last Updated:** 2025-01-18
**Ready to Test:** ✅ Yes
**Estimated Testing Time:** 10 min (quick) | 60 min (comprehensive)
