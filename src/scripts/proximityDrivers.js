/**
 * Mouse-driven "size factor" drivers shared between the hero sketch variants
 * (gridSketch.js / gridSketchMark.js), so each trigger strategy is written once.
 */

/**
 * Grows toward `max` the closer the mouse gets to any of a set of CTA elements, decaying
 * back to `min` past `radius` away from all of them. Used by gridSketch.js (the "Squares"
 * variant) — see Hero.astro's `getInfluenceRects`.
 *
 * @param {import('p5')} p
 * @param {() => DOMRect[]} [getInfluenceRects] - Returns the CTA elements' bounding boxes,
 *   in viewport coordinates. Re-invoked every frame. Falls back to no effect (value stays
 *   at `min`) when omitted or empty.
 * @param {{min: number, max: number, ease: number, radius: number}} options
 * @returns {() => number} Call once per frame (e.g. from p.draw) to get the current value.
 */
export function createCtaProximityDriver(p, getInfluenceRects, { min, max, ease, radius }) {
    let value = min;

    // Closest distance from (x, y) to any of `rects`' edges — 0 if inside one — or Infinity
    // if `rects` is empty. Clamping to each rect first (rather than just measuring to its
    // center) means a large CTA "pulls" starting right at its border, not from deep inside it.
    function distanceToNearestRect(x, y, rects) {
        let nearest = Infinity;
        for (const r of rects) {
            const nx = p.constrain(x, r.left, r.right);
            const ny = p.constrain(y, r.top, r.bottom);
            nearest = p.min(nearest, p.dist(x, y, nx, ny));
        }
        return nearest;
    }

    return function next() {
        const rects = (getInfluenceRects && getInfluenceRects()) || [];
        // Uses winMouseX/Y (viewport coordinates) since the CTA rects come straight from
        // getBoundingClientRect(), not canvas-local mouseX/Y.
        const distance = distanceToNearestRect(p.winMouseX, p.winMouseY, rects);
        const target = p.map(p.constrain(distance, 0, radius), 0, radius, max, min);
        value = p.lerp(value, target, ease);
        return value;
    };
}

/**
 * Grows toward `max` as the mouse approaches the vertical center of a caller-supplied axis,
 * and decays back to `min` toward either end of it — a symmetric tent/triangle over mouseY,
 * peaking at the axis's center and hitting `min` at (or past) `halfHeight` away from it in
 * either direction. Horizontal mouse position plays no part. Used by gridSketchMark.js (the
 * "Mark" variant) for pages with too few/no CTAs for createCtaProximityDriver to read well —
 * see Hero.astro's `getAxis`.
 *
 * @param {import('p5')} p
 * @param {() => {centerY: number, halfHeight: number} | null} [getAxis] - Returns the axis,
 *   in viewport Y coordinates, that the mouse's vertical position is measured against.
 *   Re-invoked every frame. Falls back to no effect (value stays at `min`) when omitted, or
 *   when it returns null/a non-positive halfHeight.
 * @param {{min: number, max: number, ease: number}} options
 * @returns {() => number} Call once per frame (e.g. from p.draw) to get the current value.
 */
export function createVerticalAxisDriver(p, getAxis, { min, max, ease }) {
    let value = min;

    return function next() {
        const axis = getAxis && getAxis();
        let target = min;
        if (axis && axis.halfHeight > 0) {
            const distanceFromCenter = p.abs(p.winMouseY - axis.centerY);
            const closeness = p.constrain(1 - distanceFromCenter / axis.halfHeight, 0, 1); // 1 at center, 0 at/past either end
            target = p.lerp(min, max, closeness);
        }
        value = p.lerp(value, target, ease);
        return value;
    };
}
