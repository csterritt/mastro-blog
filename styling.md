# Styling Guide

This document provides a comprehensive overview of the site's styling, enabling recreation of its look and feel for new projects.

---

## Part 1: Design Intent

### Visual Philosophy

- **Theme**: Warm, retro aesthetic with modern responsiveness
- **Feel**: Clean, readable, approachable with subtle playfulness
- **Color Mode**: Light mode default (retro), dark mode support (aqua)
- **Typography**: Prose-focused with paragraph indentation for readability
- **Interactions**: Subtle hover effects (lift, shadow enhancement, scale on images)

### Color Palette

Uses DaisyUI's **retro** theme (light) and **aqua** theme (dark). Key semantic colors:

| Token             | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `base-100`        | Primary background (cards, navbar)         |
| `base-200`        | Secondary background (page, hero sections) |
| `base-300`        | Tertiary background (footer)               |
| `base-content`    | Primary text color                         |
| `primary`         | Call-to-action buttons, links              |
| `secondary`       | Secondary action buttons                   |
| `neutral`         | Fallback backgrounds                       |
| `neutral-content` | Text on neutral backgrounds                |

### Spacing Philosophy

- **Container**: Max width `7xl` (80rem), centered with horizontal padding `px-4`
- **Vertical rhythm**: `py-8` for main content, `p-10` for footer, `mb-6` to `mb-8` for section gaps
- **Card padding**: `p-4` for compact cards, default card-body for content cards
- **Grid gaps**: `gap-4` to `gap-6` depending on content density

### Typography Scale

- **Hero headings**: `text-5xl font-bold`
- **Page titles**: `text-3xl` or `text-4xl font-bold`
- **Section headings**: `text-xl font-bold`
- **Card titles**: `card-title` (DaisyUI) or `text-2xl`/`text-3xl`
- **Body text**: Default size, `text-lg` for emphasis, `text-sm` for captions
- **Muted text**: `text-base-content/70`

### Shadow & Depth

- **Cards**: `shadow-xl` default, `hover:shadow-2xl` on interaction
- **Navbar**: `shadow-sm` (subtle)
- **Images**: `shadow-lg` for hero images

---

## Part 2: Implementation Details

### Framework Stack

| Technology              | Version | Purpose                        |
| ----------------------- | ------- | ------------------------------ |
| Tailwind CSS            | 4.1.18  | Utility-first CSS framework    |
| DaisyUI                 | 5.5.14  | Component library for Tailwind |
| @tailwindcss/typography | 0.5.19  | Prose styling for content      |

### CSS Configuration

**File**: `routes/in-styles.css`

```css
@import 'tailwindcss';
@plugin "@tailwindcss/typography";
@plugin "daisyui" {
  themes:
    retro --default,
    aqua --prefersdark;
}

/* Custom: Brighten image cards (override DaisyUI default) */
.card.image-full > figure img {
  filter: brightness(47%);
}

/* Custom: Indent prose paragraphs */
.prose > p {
  @apply indent-4;
}
```

---

## Part 3: Use Cases

### 1. Global Layout

**Purpose**: Page shell with header, main content area, and footer.

**Files**:

- `components/Layout.ts`
- `components/Header.ts`
- `components/Footer.ts`

**Structure**:

```html
<html class="h-full bg-base-200">
  <body class="min-h-full flex flex-col">
    <header>...</header>
    <main class="flex-1 container mx-auto px-4 py-8 max-w-7xl">...</main>
    <footer>...</footer>
  </body>
</html>
```

**Key Classes**:
| Element | Classes | Purpose |
|---------|---------|---------|
| `<html>` | `h-full bg-base-200` | Full height, secondary bg |
| `<body>` | `min-h-full flex flex-col` | Flexbox column, footer at bottom |
| `<main>` | `flex-1 container mx-auto px-4 py-8 max-w-7xl` | Grow to fill, centered container |

---

### 2. Navigation (Header)

**Purpose**: Top navigation bar with brand and menu links.

**Files**:

- `components/Header.ts`

**Structure**:

```html
<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost text-xl">Brand</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/">Home</a></li>
      <li><a href="/about/">About</a></li>
    </ul>
  </div>
</div>
```

**DaisyUI Components**:

- `navbar` - Navigation container
- `btn btn-ghost` - Ghost-style brand button
- `menu menu-horizontal` - Horizontal menu list

---

### 3. Footer

**Purpose**: Centered footer with copyright.

**Files**:

- `components/Footer.ts`

**Structure**:

```html
<footer class="footer footer-center p-10 bg-base-300 text-base-content rounded">
  <aside>
    <p>Copyright © 2025 - All rights reserved</p>
  </aside>
</footer>
```

**DaisyUI Components**:

- `footer footer-center` - Centered footer layout
- `bg-base-300` - Tertiary background color

---

### 4. Hero Section

**Purpose**: Prominent welcome/landing section.

**Files**:

- `routes/index.server.ts`

**Structure**:

```html
<div class="hero min-h-[50vh] bg-base-200 rounded-box mb-8">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Welcome</h1>
      <p class="py-6">Description text</p>
      <a href="/gallery/" class="btn btn-primary">Browse Gallery</a>
    </div>
  </div>
</div>
```

**Key Classes**:
| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `hero min-h-[50vh] bg-base-200 rounded-box mb-8` | Half-viewport height hero |
| Content wrapper | `hero-content text-center` | Centered content |
| Text container | `max-w-md` | Constrained width |
| Heading | `text-5xl font-bold` | Large bold title |
| CTA button | `btn btn-primary` | Primary action button |

---

### 5. Content Cards

**Purpose**: Information cards for navigation or content display.

**Files**:

- `routes/index.server.ts`
- `routes/about/(about).server.ts`

**Structure (Standard Card)**:

```html
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Title</h2>
    <p>Description</p>
    <div class="card-actions justify-end">
      <a href="/path/" class="btn btn-secondary">Action</a>
    </div>
  </div>
</div>
```

**Grid Layout**:

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- cards -->
</div>
```

**DaisyUI Components**:

- `card`, `card-body`, `card-title`, `card-actions`
- `btn btn-secondary` - Secondary action buttons

---

### 6. Gallery Grid (Image Cards)

**Purpose**: Grid of clickable image thumbnails with descriptions.

**Files**:

- `scripts/build-gallery.ts` (generates routes)

**Structure**:

```html
<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
  <a
    href="/gallery/path/big/image/"
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
  >
    <figure class="aspect-square overflow-hidden">
      <img
        src="/gallery/path/images/file.jpeg"
        alt="..."
        class="w-full h-full object-cover"
      />
    </figure>
    <div class="card-body p-4">
      <p class="text-sm line-clamp-3">Description</p>
    </div>
  </a>
</div>
```

**Key Classes**:
| Element | Classes | Purpose |
|---------|---------|---------|
| Grid | `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6` | Responsive 1→3→4 column grid |
| Card link | `card ... hover:shadow-2xl transition-all duration-300 hover:-translate-y-1` | Lift effect on hover |
| Figure | `aspect-square overflow-hidden` | Square aspect ratio |
| Image | `w-full h-full object-cover` | Cover entire figure |
| Description | `text-sm line-clamp-3` | Small text, truncate at 3 lines |

---

### 7. Collection Cards (Image-Full Cards)

**Purpose**: Featured collection links with background images.

**Files**:

- `scripts/build-gallery.ts`

**Structure**:

```html
<a
  href="/gallery/path/"
  class="card col-span-1 md:col-span-2 image-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-64 md:h-80 group overflow-hidden"
>
  <figure>
    <img
      src="/gallery/path/images/thumb.jpeg"
      alt="..."
      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </figure>
  <div class="card-body justify-end">
    <h2 class="card-title text-2xl md:text-3xl text-white drop-shadow-md">
      Title
    </h2>
    <div class="card-actions justify-end">
      <span class="btn btn-primary btn-sm">Explore Collection</span>
    </div>
  </div>
</a>
```

**Key Classes**:
| Element | Classes | Purpose |
|---------|---------|---------|
| Card | `card image-full col-span-1 md:col-span-2 h-64 md:h-80 group overflow-hidden` | Full-image card spanning 2 cols |
| Image | `transition-transform duration-700 group-hover:scale-105` | Subtle zoom on hover |
| Title | `text-2xl md:text-3xl text-white drop-shadow-md` | White text with shadow for readability |
| Button | `btn btn-primary btn-sm` | Small primary button |

**Custom CSS** (in `in-styles.css`):

```css
.card.image-full > figure img {
  filter: brightness(47%);
}
```

---

### 8. Image Detail View

**Purpose**: Full-size image display with navigation.

**Files**:

- `scripts/build-gallery.ts` (`generateImageDetailPage`)

**Structure**:

```html
<div class="max-w-6xl mx-auto">
  <div
    class="flex flex-col md:flex-row-reverse justify-between items-center mb-4"
  >
    <a href="/gallery/path/" class="btn btn-primary">Back to Gallery</a>
    <div class="mr-2 prose max-w-none">Description HTML</div>
  </div>
  <div class="relative group flex justify-center">
    <img
      src="..."
      alt="..."
      class="max-h-[85vh] w-auto max-w-full object-contain shadow-lg"
    />

    <!-- Navigation arrows -->
    <a
      href="prev"
      class="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md btn-ghost bg-base-100/30 hover:bg-base-100/80 text-base-content border-none backdrop-blur-sm transition-all"
    >
      <!-- Left arrow SVG -->
    </a>
    <a
      href="next"
      class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md btn-ghost bg-base-100/30 hover:bg-base-100/80 text-base-content border-none backdrop-blur-sm transition-all"
    >
      <!-- Right arrow SVG -->
    </a>
  </div>
</div>
```

**Key Classes**:
| Element | Classes | Purpose |
|---------|---------|---------|
| Container | `max-w-6xl mx-auto` | Wide but constrained |
| Header | `flex flex-col md:flex-row-reverse justify-between items-center mb-4` | Responsive header layout |
| Image | `max-h-[85vh] w-auto max-w-full object-contain shadow-lg` | Large image, constrained to viewport |
| Nav buttons | `btn btn-circle btn-ghost bg-base-100/30 hover:bg-base-100/80 backdrop-blur-sm` | Semi-transparent circular buttons |

---

### 9. Prose/Content Typography

**Purpose**: Rich text content (descriptions, blog posts).

**Files**:

- `routes/in-styles.css` (custom)
- Various templates using `prose`

**Usage**:

```html
<div class="prose max-w-2xl">
  <!-- Markdown-rendered HTML -->
</div>

<div class="prose max-w-none">
  <!-- Full-width prose -->
</div>
```

**Custom CSS**:

```css
.prose > p {
  @apply indent-4;
}
```

**Key Classes**:
| Class | Purpose |
|-------|---------|
| `prose` | Enable typography plugin styling |
| `prose-sm` | Smaller prose variant |
| `max-w-2xl` | Constrain prose width for readability |
| `max-w-none` | Allow full width |

---

### 10. Links

**Purpose**: Styled anchor elements.

**Files**:

- `routes/about/(about).server.ts`

**Variants**:

```html
<!-- Standard link in prose -->
<a href="..." class="link link-hover font-bold">Link text</a>

<!-- Ghost button link -->
<a href="..." class="btn btn-ghost gap-2">
  <!-- Optional icon -->
  Back to...
</a>
```

---

## Part 4: DaisyUI Component Reference

### Components Used

| Component  | Classes                                                                              | Usage              |
| ---------- | ------------------------------------------------------------------------------------ | ------------------ |
| **Navbar** | `navbar`, `flex-1`, `flex-none`                                                      | Header navigation  |
| **Menu**   | `menu`, `menu-horizontal`                                                            | Navigation links   |
| **Button** | `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-circle`, `btn-sm`, `btn-md` | Actions            |
| **Card**   | `card`, `card-body`, `card-title`, `card-actions`, `image-full`                      | Content containers |
| **Hero**   | `hero`, `hero-content`, `rounded-box`                                                | Landing sections   |
| **Footer** | `footer`, `footer-center`                                                            | Page footer        |
| **Link**   | `link`, `link-hover`                                                                 | Styled anchors     |

### Theme Configuration

```css
@plugin "daisyui" {
  themes:
    retro --default,
    aqua --prefersdark;
}
```

---

## Part 5: Responsive Breakpoints

Uses Tailwind's default breakpoints:

| Prefix | Min Width | Usage                      |
| ------ | --------- | -------------------------- |
| (none) | 0px       | Mobile-first default       |
| `md:`  | 768px     | Tablet, 2-3 column layouts |
| `lg:`  | 1024px    | Desktop, 4 column layouts  |

**Common Patterns**:

- `grid-cols-1 md:grid-cols-2` - 1→2 columns
- `grid-cols-1 md:grid-cols-3 lg:grid-cols-4` - 1→3→4 columns
- `col-span-1 md:col-span-2` - Span 2 columns on tablet+
- `h-64 md:h-80` - Taller on tablet+
- `btn-sm md:btn-md` - Larger buttons on tablet+
- `text-2xl md:text-3xl` - Larger text on tablet+
- `flex-col md:flex-row-reverse` - Stack on mobile, row on tablet+

---

## Quick Start for New Project

1. Install dependencies:

   ```bash
   npm install tailwindcss@4 daisyui@5 @tailwindcss/typography
   ```

2. Create CSS file with configuration from `routes/in-styles.css`

3. Copy component structure:
   - Layout wrapper with `h-full bg-base-200` on html
   - Flexbox body with `min-h-full flex flex-col`
   - Container main with `flex-1 container mx-auto px-4 py-8 max-w-7xl`

4. Use DaisyUI components for UI elements (navbar, cards, buttons)

5. Apply hover effects: `hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`

6. Use `prose` class for rich text content with `indent-4` on paragraphs
