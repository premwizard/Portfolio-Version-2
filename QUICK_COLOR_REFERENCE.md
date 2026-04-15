# Quick Reference: Color Update Examples

## Pattern 1: Text Colors

### Tailwind approach (easiest):
```jsx
// ❌ BEFORE
<p className="text-platinum/80">Description</p>

// ✅ AFTER
<p className="transition-colors duration-300" style={{ color: 'var(--color-text-secondary)' }}>Description</p>
```

---

## Pattern 2: Background Colors

### Dark backgrounds:
```jsx
// ❌ BEFORE
<div className="bg-[#080507]/90 rounded-lg p-6">

// ✅ AFTER
<div 
  className="rounded-lg p-6 transition-colors duration-300"
  style={{ backgroundColor: `color-mix(in srgb, var(--color-background) 90%, transparent)` }}
>
```

### Surface backgrounds:
```jsx
// ❌ BEFORE
<div className="bg-[#0c080b]/90 border border-platinum/10">

// ✅ AFTER
<div 
  className="border transition-colors duration-300"
  style={{
    backgroundColor: `color-mix(in srgb, var(--color-surface) 90%, transparent)`,
    borderColor: 'var(--color-border)',
  }}
>
```

---

## Pattern 3: Border Colors

```jsx
// ❌ BEFORE
<div className="border border-platinum/10">

// ✅ AFTER
<div style={{ borderColor: 'var(--color-border)', border: '1px solid var(--color-border)' }}>
```

---

## Pattern 4: Text + Border Combination

```jsx
// ❌ BEFORE
<button className="text-primary border border-primary/30 hover:bg-primary/10">

// ✅ AFTER
<button 
  className="border transition-colors duration-300"
  style={{
    color: 'var(--color-primary)',
    borderColor: 'var(--color-border)',
    backgroundColor: 'transparent',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--color-primary) 10%, transparent)`;
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  }}
>
  Button Text
</button>
```

---

## Pattern 5: Gradients

```jsx
// ❌ BEFORE
<span className="text-transparent bg-gradient-to-r from-primary via-warm to-platinum bg-clip-text">

// ✅ AFTER
<span 
  className="text-transparent bg-clip-text transition-colors duration-300"
  style={{
    backgroundImage: `linear-gradient(to right, var(--color-primary), var(--color-warm), var(--color-secondary))`
  }}
>
```

---

## Pattern 6: Multiple Background Layers

```jsx
// ❌ BEFORE
<div className="bg-[#090509]/80 border border-platinum/10 rounded-[28px]">
  <div className="bg-[#080507]/80 font-mono text-platinum/80 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)]">

// ✅ AFTER
<div 
  className="rounded-[28px] border transition-colors duration-300"
  style={{
    backgroundColor: `color-mix(in srgb, var(--color-surface) 80%, transparent)`,
    borderColor: 'var(--color-border)',
  }}
>
  <div 
    className="font-mono transition-colors duration-300"
    style={{
      backgroundColor: `color-mix(in srgb, var(--color-background) 80%, transparent)`,
      color: 'var(--color-text-secondary)',
    }}
  >
```

---

## Pattern 7: Form Inputs

```jsx
// ❌ BEFORE
<input 
  className="bg-transparent border border-platinum/10 text-platinum outline-none transition focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
/>

// ✅ AFTER
<input 
  className="transition-colors duration-300 outline-none"
  style={{
    backgroundColor: 'transparent',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderColor = 'var(--color-primary)';
    e.currentTarget.style.boxShadow = `0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent)`;
  }}
  onBlur={(e) => {
    e.currentTarget.style.borderColor = 'var(--color-border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
/>
```

---

## Pattern 8: Decorative Elements

```jsx
// ❌ BEFORE
<div className="absolute -z-10 h-96 w-96 bg-primary/[0.04] blur-[120px] rounded-full" />
<div className="absolute -z-10 h-80 w-80 bg-warm/[0.04] blur-[100px] rounded-full" />

// ✅ AFTER
<div 
  className="absolute -z-10 h-96 w-96 blur-[120px] rounded-full transition-colors duration-300"
  style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 4%, transparent)` }}
/>
<div 
  className="absolute -z-10 h-80 w-80 blur-[100px] rounded-full transition-colors duration-300"
  style={{ backgroundColor: `color-mix(in srgb, var(--color-warm) 4%, transparent)` }}
/>
```

---

## Pattern 9: Icon Colors

```jsx
// ❌ BEFORE
<Terminal className="h-4 w-4 text-primary" />

// ✅ AFTER
<Terminal 
  className="h-4 w-4 transition-colors duration-300" 
  style={{ color: 'var(--color-primary)' }}
/>
```

---

## Pattern 10: Animated Elements

```jsx
// ❌ BEFORE
<motion.span
  className="h-[2px] bg-[#d4967a]"
  animate={{ width: `${scrollProgress * 100}%` }}
/>

// ✅ AFTER
<motion.span
  className="h-[2px] transition-colors duration-300"
  style={{ 
    width: `${scrollProgress * 100}%`,
    backgroundColor: 'var(--color-primary)'
  }}
  animate={{ width: `${scrollProgress * 100}%` }}
/>
```

---

## Common Color Mappings

| Use Case | CSS Variable | Notes |
|----------|--------------|-------|
| Main background | `var(--color-background)` | Page/section background |
| Card/Surface | `var(--color-surface)` | Cards, modals, surfaces |
| Text (primary) | `var(--color-text-primary)` | Main readable text |
| Text (secondary) | `var(--color-text-secondary)` | Descriptions, secondary info |
| Text (muted) | `var(--color-text-muted)` | Subtle, least important text |
| Borders | `var(--color-border)` | All borders, dividers |
| Accent (rose gold) | `var(--color-primary)` | Buttons, highlights, links |
| Accent (platinum) | `var(--color-secondary)` | Alternative accent |
| Accent (warm) | `var(--color-warm)` | Hover, active states |

---

## Opacity/Alpha Blending

Instead of `/10`, `/20`, etc. classes, use `color-mix`:

```jsx
// ❌ OLD WAY
className="bg-primary/10"

// ✅ NEW WAY - More flexible
style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)` }}
```

**Benefits:** Works seamlessly in both light and dark modes without needing opacity adjustments.

---

## Testing During Updates

After each component update, test:

1. **Toggle theme** - Does it switch smoothly?
2. **Check colors** - Do they match both palettes?
3. **Check transitions** - Is there a 0.3s transition?
4. **Check contrast** - Is text readable in both modes?
5. **Check hover states** - Do interactive elements work?

---

## Quick Copy-Paste Templates

### Simple text:
```jsx
<p style={{ color: 'var(--color-text-secondary)', transition: 'color 0.3s ease' }}>
```

### Simple card:
```jsx
<div style={{
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-border)',
  border: '1px solid var(--color-border)',
  transition: 'background-color 0.3s ease, border-color 0.3s ease',
}}>
```

### Interactive button:
```jsx
<button
  style={{
    color: 'var(--color-primary)',
    borderColor: 'var(--color-border)',
    backgroundColor: 'transparent',
    border: '1px solid var(--color-border)',
    transition: 'all 0.3s ease',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = `color-mix(in srgb, var(--color-primary) 10%, transparent)`;
    e.currentTarget.style.borderColor = 'var(--color-primary)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.borderColor = 'var(--color-border)';
  }}
>
```

---

Now you have the exact patterns to apply! 🎨
