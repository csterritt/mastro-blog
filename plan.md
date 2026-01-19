# Plan: Styling Documentation for Site Recreation

## Goal

Create `styling.md` at the project root that documents all styling patterns in a way that enables recreating the site's look and feel.

## Project Structure (Actual)

- Code lives in:
  - `components/` - Layout components (Header, Footer, Layout)
  - `routes/` - Page routes and stylesheets (styles.css, in-styles.css, index.server.ts, about/, gallery/)
  - `scripts/` - Build scripts (including build-gallery.ts)

## Approach

### Step 1: Inventory Styling Sources

- [ ] Analyze `routes/styles.css` (main stylesheet, ~77KB)
- [ ] Analyze `routes/in-styles.css` (inline/supplementary styles)
- [ ] Review component files for inline styles or class usage

### Step 2: Identify Use Cases

Group styling by purpose:

- [ ] **Global Layout** - Header, Footer, page container
- [ ] **Typography** - Headings, body text, links
- [ ] **Blog/Content Pages** - Article styling, prose formatting
- [ ] **Gallery/Image Display** - Grid, cards, lightbox/detail views
- [ ] **Navigation** - Menus, breadcrumbs
- [ ] **Responsive Design** - Breakpoints, mobile adaptations
- [ ] **Utility Classes** - Spacing, colors, common patterns

### Step 3: Document in styling.md

For each use case:

1. High-level description of the use case
2. List of files involved
3. Key classes/styles with descriptions
4. Example usage patterns

---

## Improvements & Alternative Ideas

### 1. **Extract Design Tokens**

Instead of just documenting classes, extract core design tokens:

- Color palette (with CSS custom properties)
- Spacing scale
- Font stack and sizes
- Border radii, shadows

This makes recreation more systematic.

### 2. **Create a Visual Style Guide**

Consider generating a simple HTML page (`style-guide.html`) that renders examples of each component. More useful than static docs for visual verification.

### 3. **Tailwind/DaisyUI Mapping**

Since the project uses Tailwind/DaisyUI (based on class patterns), document which DaisyUI components are used and any customizations. This provides a higher-level abstraction.

### 4. **Separate "What" from "How"**

Structure the doc in two sections:

- **Design Intent** - What the site should look like (colors, feel, spacing philosophy)
- **Implementation** - Specific classes and files that achieve it

### 5. **Include Screenshots**

Reference screenshots of key views (homepage, gallery grid, image detail) to show the target result alongside the code.

### 6. **Machine-Readable Format**

Consider outputting a JSON/YAML companion file with structured tokens for programmatic use in new projects.

---

## Execution Order

1. Read and categorize `styles.css` (largest source)
2. Read `in-styles.css` for supplementary patterns
3. Review components for class usage and structure
4. Review routes for page-specific styling
5. Synthesize into `styling.md` organized by use case
