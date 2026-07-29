# Reusable prompt — scroll motion system

Paste everything below the line into any AI coding assistant, in any React project.

---

Add a scroll-motion system to this project using **Motion** (`npm i motion`) and **Lenis**
(`npm i lenis`). Build it as reusable components, not one-off animations scattered in the markup.

## Easing — use these exact curves

- General reveals: `[0.22, 1, 0.36, 1]` (easeOutQuint)
- Text mask wipes: `[0.19, 1, 0.22, 1]` (easeOutExpo)

Fast start, long soft landing. Do not substitute `easeInOut` — it kills the feel.

## 1. `Reveal` — directional scroll reveal

A wrapper that animates its children in when they scroll into view.

- Props: `from` (`up` | `down` | `left` | `right` | `fade` | `scale`), `delay`, `duration`
  (default `0.9`), `amount` (default `0.25`), `as` (renders `div`/`h2`/`figure`/`li` so markup
  stays semantic), `className`.
- Offsets — big enough to read as arriving from outside the layout, not nudging into place:
  `up: y 90`, `down: y -90`, `left: x -120`, `right: x 120`, `scale: 0.92`. All start `opacity: 0`.
- Use `whileInView` with `viewport={{ once: true, amount }}` so it fires once and stays.

**Apply direction so it follows the layout** — a left-hand column enters from the left, a
right-hand column from the right, images scale up. Do not use the same direction everywhere; that
is what makes it look generic.

**Stagger siblings** with `delay={i * 0.1}`.

## 2. `MaskReveal` — text wiping up from behind a clipping edge

The headline effect. For each line: a `overflow-hidden` wrapper containing a child that animates
`translateY(110%) → 0`. Take a `lines` array and stagger each line by `0.09s`.

Add `padding-bottom: 0.04em` on the clipping wrapper so descenders and apostrophes are not
sheared off.

## 3. Parallax band

For hero images and section-break labels: `useScroll({ target: ref, offset: ['start end', 'end start'] })`
then `useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])`. The image needs `scale(1.16)` and an
`overflow-hidden` parent, otherwise the drift exposes empty edges.

## 4. Scroll progress bar

Fixed 2px bar at the top: `useScroll()` → `useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 })`
→ bind to `scaleX` with `transform-origin: left`. Mark it `aria-hidden`.

## 5. Lenis inertial scrolling

`new Lenis({ duration: 1.05, wheelMultiplier: 0.9 })` driven by a `requestAnimationFrame` loop in
a `useEffect`. Route `a[href^="#"]` clicks through `lenis.scrollTo(target, { offset: -8 })` so
in-page nav still lands correctly. Clean up the listener, the rAF, and `lenis.destroy()` on unmount.

## Three things that will bite you

1. **Horizontal scrollbar.** Elements with `from="left"` / `from="right"` sit 120px outside the
   viewport until they reveal, which creates real horizontal overflow. Fix with `overflow-x: clip`
   on `html, body` — use `clip`, **not** `hidden`, because `hidden` creates a scroll container and
   silently breaks any `position: sticky` on the page.

2. **Reduced motion.** A CSS `@media (prefers-reduced-motion: reduce)` block only reaches CSS
   transitions — it cannot touch Motion's inline transforms. Wrap the app in
   `<MotionConfig reducedMotion="user">` as well.

3. **Lenis breaks every overlay and every scroll listener.** It drives the scroll position itself,
   so the browser's normal contracts stop holding. Three separate symptoms, three separate fixes —
   expose all of them from the same module that owns the Lenis instance:

   - **Dropdowns and popovers float away.** A UI library positions a menu once, against its anchor,
     and locks the body to keep it there. Lenis ignores `overflow: hidden` and scrolls anyway, so
     the menu hangs in mid-air over a moving page. Set `disableScrollLock: true` and dismiss the
     menu when the page scrolls instead — a locked page just makes it feel broken.
   - **Anything with its own scrollbar stops scrolling.** Lenis swallows wheel events page-wide, so
     a long menu, modal body or code block goes dead. Put `data-lenis-prevent` on that element and
     Lenis leaves its wheel events alone.
   - **`window.addEventListener('scroll', …)` never fires.** Lenis-driven scrolling emits no native
     scroll event, so sticky-header state, scroll spies and the like silently never update. Publish
     an `onPageScroll(cb)` helper that registers on `lenis.on('scroll', …)` *and* on `window` — the
     window half is what keeps it working for reduced-motion visitors, who have no Lenis at all.

   For a genuinely full-screen overlay (a mobile nav panel), pausing is right: keep the body lock
   *and* call `lenis.stop()` / `lenis.start()`, since the body lock alone does nothing.

## Verifying

Scroll reveals need a visible, rendering tab. If the page is backgrounded or the preview pane is
hidden, `requestAnimationFrame` stops and IntersectionObserver never delivers, so elements stay
frozen at their start offset. That is not a bug in the code — check `document.hidden` before
concluding anything is broken.

