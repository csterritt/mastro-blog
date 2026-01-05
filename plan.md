# Plan: Add Markdown Processing for Image Descriptions

## Objective

Enable markdown rendering for image descriptions in the gallery generation script.

## Steps

1.  **Install Dependencies**
    - [ ] Add `marked` to the project dependencies.

2.  **Update Gallery Build Script (`scripts/build-gallery.ts`)**
    - [ ] Import `marked`.
    - [ ] Update `generateImageDetailPage`:
      - Convert `description` from plain text to Markdown HTML using `marked.parse()`.
      - Update the template to render HTML content (using a `div` instead of `p` to contain block elements).
    - [ ] Update `generateRouteContent` (Gallery Index/Subdir pages):
      - For the image cards, consider if we want markdown rendering or just plain text.
      - The `line-clamp` works best on text.
      - For now, I will render markdown for the detail page. For the card, I might keep it simple or strip HTML.

## Implementation Details

- **Library**: `marked`
- **Files**: `scripts/build-gallery.ts`
