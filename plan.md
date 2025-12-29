# Modernization Plan

This plan outlines the steps to upgrade the website's look and feel using Tailwind CSS and DaisyUI, while maintaining the existing 'retro'/'aqua' themes.

## Goals

- **Modern UI**: Clean lines, better spacing, responsive layouts.
- **Accessibility**: Semantic HTML, good contrast, focus states.
- **Visual Appeal**: Enhanced cards, transitions, and professional component structures.

## Phase 1: Global Layout & Navigation

### `components/Layout.ts`

- Convert to a flex-col full-height structure to ensure the footer stays at the bottom.
- Improve container constraints (`max-w-7xl`, `mx-auto`, responsive padding).
- Add a subtle background color/texture consistent with the theme.

### `components/Header.ts`

- Replace the simple `div` structure with the DaisyUI [Navbar](https://daisyui.com/components/navbar/) component.
- Add a proper logo/brand area.
- Style navigation links (ghost buttons or active states).

### `components/Footer.ts`

- Implement the DaisyUI [Footer](https://daisyui.com/components/footer/) component.
- Center the content and add social links placeholder or better copyright styling.

## Phase 2: Home Page Redesign

### `routes/index.server.ts`

- Replace the basic list with a **Hero Section**.
- Add a "Call to Action" (CTA) button directing users to the Gallery.
- Use a feature card or snippet to preview what's in the gallery.

## Phase 3: Gallery Overhaul (Script Updates)

The gallery logic lives in `scripts/build-gallery.ts`. We will modify the string templates it generates.

### Gallery Index (`generateGalleryIndex`)

- **Grid Layout**: Use a responsive grid (`grid-cols-1 md:grid-cols-3 gap-6`) instead of a simple list.
- **Category Cards**: Style folder links as distinct cards with icons or placeholders.

### Gallery Listing (`generateRouteContent`)

- **Masonry/Grid**: Improve the image grid layout.
- **Card Styling**:
  - Update `card` classes to use `card-compact` on mobile.
  - Add `hover:shadow-xl` and `transition-all duration-300` for interactivity.
  - Ensure images have `object-cover` and consistent aspect ratios where possible (or handle variable heights gracefully).
- **Navigation**: Improve the "Back" button and sub-gallery links styling.

### Image Detail (`generateImageDetailPage`)

- **Layout**: Center the image with a maximum height (`max-h-[80vh]`).
- **Controls**: Place navigation/close buttons in a clear toolbar above or overlaying the image.
- **Metadata**: Style the description and title elegantly below the image.

## Phase 4: Refinement

- **Typography**: Check heading sizes and readability.
- **Spacing**: Ensure consistent margins/padding (using Tailwind's `my-4`, `p-6`, etc.).
- **Mobile Check**: Verify all views work well on small screens.
