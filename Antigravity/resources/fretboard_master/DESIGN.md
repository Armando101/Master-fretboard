# Design System Document: The Virtuoso’s Atelier

## 1. Overview & Creative North Star
**Creative North Star: The Technical Artisan**
This design system rejects the "gamified" aesthetic common in music education. Instead, it adopts the persona of a high-end luthier’s workshop—precise, dark, and sophisticated. We are creating a "Digital Atelier" where the user feels they are handling a premium instrument, not just clicking buttons.

To move beyond the "template" look, we utilize **Intentional Asymmetry**. Information is not always centered; we use heavy-weighted typography on the left balanced by breathable negative space on the right. Overlapping elements—such as a fretboard diagram bleeding off the edge of a container—create a sense of scale and depth that feels editorial rather than restricted by a grid.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a deep, nocturnal wood-grain aesthetic, punctuated by high-chroma functional accents.

### The Color Tokens
*   **The Foundation:** `background` (#131313) and `surface` (#131313) form the "Deep Charcoal" core of the app.
*   **Root Notes:** `primary` (#9ecaff) / `primary_container` (#2196f3). Use this for the tonal anchor of any exercise.
*   **Selection:** `secondary` (#ffe2ab) / `secondary_container` (#ffbf00). This "Amber" glow mimics the look of vintage lacquer.
*   **Success/Correct:** `tertiary` (#4edea3). A vibrant "Emerald" that cuts through the dark background.
*   **Error/Incorrect:** `error` (#ffb4ab). A "Crimson" that signals attention without being jarring.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. 
Boundaries must be created through **Background Color Shifts**. 
*   An inner exercise area should use `surface_container_low` (#1c1b1b).
*   A sidebar or "drawer" should use `surface_container_high` (#2a2a2a).
*   Visual separation is achieved through the Spacing Scale (e.g., a `12` or `16` unit gap) rather than a line.

### The Glass & Gradient Rule
To ensure a bespoke feel, use the **"Signature Polish"** technique:
*   **Floating Elements:** Use `surface_variant` (#353535) at 60% opacity with a `20px` backdrop-blur for tooltips and overlays.
*   **CTA Soul:** Main action buttons should not be flat. Apply a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle. This adds a "lithic" weight to the UI.

---

## 3. Typography
We use a high-contrast pairing to balance technical precision with modern editorial flair.

*   **Display & Headlines (Space Grotesk):** This typeface is our "Technical" voice. It feels like a blueprint. Use `display-lg` and `headline-md` with tight letter-spacing (-2%) for headers.
*   **Body & Titles (Manrope):** This is our "Humanist" voice. It is clear, professional, and approachable.
*   **The Hierarchy:** Use extreme scale differences. A `display-lg` headline should sit near a `label-md` caption to create a "Big/Small" dynamic that feels intentional and premium.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are largely forbidden. We build depth through the "Atmospheric Stack."

*   **The Layering Principle:** 
    *   Base: `surface`
    *   Secondary Content: `surface_container`
    *   Interactive Cards: `surface_container_highest`
*   **Ambient Shadows:** If an element must "float" (like a chord-selector fab), use a shadow color tinted with our primary blue: `rgba(0, 97, 164, 0.08)` with a blur of `32px`.
*   **The Ghost Border:** If accessibility requires a border, use `outline_variant` (#404752) at 15% opacity. It should be felt, not seen.

---

## 5. Components

### The Fretboard (Custom Component)
The fretboard is the heart of the experience.
*   **Fret Wires:** Do not use lines. Use a `1px` shift in `surface_bright` (#393939) with a 50% opacity.
*   **Note Markers:** Use the `secondary_container` (#ffbf00) for selected states with a "Bloom" effect (a soft outer glow of the same color at 20% opacity).

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Roundedness: `md` (0.375rem). No border.
*   **Tertiary/Ghost:** Use `on_surface` text. On hover, shift the background to `surface_container_highest`. No border.

### Cards & Progress Modules
*   **Structure:** Never use dividers. Use `spacing-6` (1.5rem) to separate internal content blocks.
*   **Feedback:** When an answer is "Correct," the entire card background should transition via a subtle fade to `tertiary_container` (#00a673) at 10% opacity, rather than just changing a small icon.

### Input Fields
*   **State:** Use `surface_container_lowest` for the field background to create a "recessed" look.
*   **Focus:** Instead of a thick border, use a `primary` glow (Ghost Border) at 40% opacity.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `spaceGrotesk` for numbers and musical notation; its geometric nature excels here.
*   **Do** leverage the "surface_container" tiers to create a sense of nesting.
*   **Do** allow images of guitars or wood textures to bleed behind the UI with a `surface_dim` overlay.

### Don't
*   **Don't** use a pure black (#000000). Always use `surface` (#131313) to keep the "Deep Wood" depth.
*   **Don't** use standard "Material Design" shadows. They are too heavy for this editorial style.
*   **Don't** use center-alignment for everything. Experiment with "Left-Heavy" layouts where the fretboard sits on the bottom 2/3 and the typography anchors the top-left.

### Accessibility Note
Ensure that `on_tertiary_container` and `on_error_container` text always meets a 4.5:1 contrast ratio against their respective containers. While we lean into a dark aesthetic, the "Educational" aspect of the app demands impeccable legibility.