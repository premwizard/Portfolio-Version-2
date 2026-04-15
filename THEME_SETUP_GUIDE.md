# Light/Dark Mode Theme Implementation Guide

## ✅ Completed Setup

Your theme infrastructure is now fully configured:

1. **ThemeContext** (src/context/ThemeContext.jsx) - Manages theme state with localStorage persistence
2. **ThemeToggle** (src/components/ThemeToggle.jsx) - Beautiful sun/moon toggle with Framer Motion
3. **CSS Variables** (src/index.css) - Dark and light mode color definitions with 0.3s transitions
4. **Tailwind Config** - Updated to use CSS custom properties
5. **Navbar** - Integrated ThemeToggle button with theme-aware styling
6. **App.jsx** - Theme-aware footer and transitions
7. **main.jsx** - Wrapped with ThemeProvider

## 🎨 CSS Custom Properties Available

Use these in your components:

```css
/* Colors */
--color-background      /* Main background */
--color-surface         /* Secondary surface */
--color-border          /* Border colors */
--color-primary         /* Rose gold accent */
--color-secondary       /* Platinum accent */
--color-warm            /* Warm accent */
--color-text-primary    /* Main text */
--color-text-secondary  /* Secondary text */
--color-text-muted      /* Muted text */
```

## 📝 How to Update Components

### Option 1: Using Tailwind Classes (Recommended - Easiest)

The easiest approach is to use the Tailwind color aliases we've set up. They automatically pull from CSS variables:

```jsx
// These automatically use the correct theme colors:
<div className="bg-background text-text-primary border border-border">
  <h2 className="text-primary">Heading</h2>
  <p className="text-text-secondary">Description</p>
</div>
```

### Option 2: Using CSS Variables Directly (For Complex Styles)

When you need more control, use inline styles with CSS variables:

```jsx
<div style={{
  backgroundColor: 'var(--color-background)',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text-primary)',
}}>
  Content
</div>
```

## 🔄 Quick Migration Pattern for Each Component

### 1. Hero.jsx

**Replace:**
```jsx
className="text-primary"  → className="text-primary" ✓ (already uses Tailwind)
className="bg-platinum/10"  → className="bg-secondary/10"
className="text-platinum"  → className="text-secondary"
```

**Color hardcodes to replace:**
- `text-platinum` → `text-secondary` (or `text-text-primary` depending on context)
- `bg-platinum/10` → `bg-secondary/10`
- `border-platinum/20` → `border-secondary/20`

### 2. About.jsx

Current issues:
- `text-platinum/80` → Should be `text-text-secondary`
- `text-platinum/60` → Should be `text-text-muted`
- Inline gradients and decorative colors

Migration:
```jsx
// Instead of hardcoded colors:
className="text-platinum/80"
// Use:
className="text-text-secondary"
```

### 3. Journey.jsx

Has many color references. Key replacements:
```jsx
// Current
text-platinum/70 → text-text-secondary
bg-primary/10 → bg-primary/10 ✓ (already theme-aware)
border-primary/20 → border-primary/20 ✓
```

### 4. SkillsCarousel.jsx

```jsx
// Replace hardcoded text colors:
text-platinum → text-text-primary
text-platinum/85 → text-text-secondary
bg-platinum/5 → Use CSS vars for adaptive background
```

### 5. Projects.jsx

Multiple inline background colors. Pattern:
```jsx
// Replace inline colors:
bg-[#090509]/70 → style={{ backgroundColor: 'var(--color-surface)', opacity: 0.7 }}
bg-[#0c080b]/90 → style={{ backgroundColor: 'var(--color-surface)', opacity: 0.9 }}
```

### 6. Certificates.jsx

Watch for:
- `text-platinum` references
- Inline background colors
- SVG and Canvas color usage

### 7. Contact.jsx

Most needs updating:
- Form inputs background
- Border colors
- Text colors
- Focus states

Form example:
```jsx
// Before
<input className="bg-transparent border border-platinum/10 text-platinum" />

// After
<input style={{
  backgroundColor: 'transparent',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text-primary)',
}} />
```

### 8. LoadingScreen.jsx

Check if it uses hardcoded colors. Update similarly.

### 9. ParticleBackground.jsx

Canvas/SVG elements need special handling:
```jsx
// Get colors from CSS variables
const primaryColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-primary')
  .trim();
```

### 10. CustomCursor.jsx

Similarly, if it uses colors, apply the same pattern.

## 🎯 Systematic Update Instructions

For each component, follow this pattern:

1. **Identify all color classes and inline styles**
2. **Map them to CSS variables:**
   - `text-platinum*` → `text-text-primary`, `text-text-secondary`, or `text-text-muted`
   - `bg-primary*` → Already works with CSS vars!
   - `border-platinum*` → `border-border` or `border-primary`
   - Inline `#080507` (bg) → `var(--color-background)`
   - Inline `#f0ece8` (text) → `var(--color-text-primary)`

3. **Test the component in both themes**

## 📱 Key Color Mappings

### Dark Mode → Light Mode
| Concept | Dark | Light |
|---------|------|-------|
| Background | #080507 | #faf6f0 |
| Surface | #0d0a08 | #f0e8dc |
| Primary | #d4967a | #b5622a |
| Secondary | #b8ccd8 | #4a7a8a |
| Warm | #c8845e | #9a5235 |
| Text Primary | #f0ece8 | #1a0e0a |
| Text Secondary | #888 | #5a4035 |
| Text Muted | #444 | #9a8070 |

## 🛠️ Bulk Find & Replace Suggestions

Use VSCode Find & Replace:

1. Find: `text-platinum([^-]|\b)` (regex)
   Replace: `text-text-primary$1`

2. Find: `text-platinum/` (regex)
   Replace in context - some should be `text-text-secondary`, others `text-text-muted`

3. Find: `bg-\[#090509\]`
   Replace: `style={{ backgroundColor: 'var(--color-surface)' }}`

## ✨ Testing Your Theme

1. Click the theme toggle in the navbar
2. Verify all sections update smoothly
3. Check localStorage: `localStorage.getItem('theme')`
4. Refresh page - theme should persist
5. Verify 0.3s transitions work smoothly

## 🎬 Example: Complete Component Update

### Before:
```jsx
<section className="py-24 px-6">
  <h2 className="text-3xl text-platinum font-bold">
    About <span className="text-primary">Me</span>
  </h2>
  <p className="text-platinum/70">Description...</p>
  <div className="bg-[#090509]/80 border border-platinum/10 rounded-lg p-6">
    Content
  </div>
</section>
```

### After:
```jsx
<section className="py-24 px-6 transition-colors duration-300">
  <h2 className="text-3xl text-text-primary font-bold">
    About <span className="text-primary">Me</span>
  </h2>
  <p className="text-text-secondary">Description...</p>
  <div 
    className="rounded-lg p-6 transition-colors duration-300"
    style={{
      backgroundColor: `color-mix(in srgb, var(--color-surface) 80%, transparent)`,
      borderColor: 'var(--color-border)',
      border: '1px solid var(--color-border)',
    }}
  >
    Content
  </div>
</section>
```

## 🚀 Next Steps

1. Update **Hero.jsx** first (simpler)
2. Then **About.jsx** (has image, more layout)
3. Then others in order of complexity
4. Test each one as you go

## 💡 Pro Tips

- Use `transition-colors duration-300` class on elements with color changes
- For gradients, consider using CSS variables in gradient definitions
- Test with system theme preference (macOS/Windows theme settings)
- The theme persists automatically via localStorage

---

**Your theme infrastructure is production-ready!** 
Just update components to use the CSS variables and you're done. 🎉
