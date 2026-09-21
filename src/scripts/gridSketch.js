import { createCtaProximityDriver } from '@scripts/proximityDrivers';

/**
 * "Oscillating Grid — Overlapping Squares" — instance-mode port of gif.html (project root)
 * for embedding in Hero.astro's homepage sketch panel.
 *
 * Differences from the standalone gif.html:
 *  - Fills its container element (resized via ResizeObserver) instead of the browser window.
 *  - Transparent background (`p.clear()` instead of `p.background(0)`), so it can sit behind
 *    the hero text as a full-bleed backdrop rather than an opaque panel.
 *  - The container-square pair is anchored toward the right side of the canvas (ANCHOR_X_FRAC)
 *    instead of centered, to clear the text column on the left.
 *  - The slider's visuals (track, handle, label) and its click-to-drag handling are gone —
 *    there's no dedicated interactive area once this is a passive backdrop.
 *  - Square size is no longer driven by the mouse's horizontal position. Instead it grows
 *    the closer the mouse gets to any of a caller-supplied set of CTA elements (the hero's
 *    own buttons plus the nav bar's), and eases back down as the mouse moves away from all
 *    of them — see `getInfluenceRects` below, driven by the shared proximityDrivers.js (also
 *    used by gridSketchMark.js for its own, different trigger, so this driver strategy isn't
 *    duplicated). p5 tracks mouseX/mouseY via a window-level listener (not scoped
 *    to the canvas element), so this keeps responding to the mouse anywhere on the page, not
 *    just while it's over the canvas.
 *
 * @param {import('p5')} p
 * @param {HTMLElement} container
 * @param {() => DOMRect[]} [getInfluenceRects] - Returns the CTA elements' bounding boxes,
 *   in viewport coordinates (i.e. straight from `getBoundingClientRect()`), that the grid's
 *   square size reacts to. Re-invoked every frame, so it's cheap to have this just read live
 *   rects rather than caching them. Falls back to no proximity effect (size stays at its
 *   resting/minimum value) when omitted or empty.
 */
export function gridSketch(p, container, getInfluenceRects) {
    // ---------- tunable parameters ----------
    const MIN_COLS = 4,
        MAX_COLS = 16; // horizontal square count range
    const MIN_ROWS = 4,
        MAX_ROWS = 16; // vertical square count range
    const COL_FREQ = 0.17; // cycles/sec of the horizontal-count oscillator
    const ROW_FREQ = 0.24; // cycles/sec of the vertical-count oscillator (independent)

    const MIN_SIZE_FACTOR = 0.18; // squares much smaller than their cell -> visible gaps
    const MAX_SIZE_FACTOR = 2.6; // squares much larger than their cell -> guaranteed full overlap

    const PROXIMITY_EASE = 0.06; // how eagerly the (invisible) slider value chases the mouse-to-CTA proximity
    const INFLUENCE_RADIUS = 350; // px from a CTA's edge at which its pull on the slider fades to nothing

    const CONTAINER_SIZE_FRAC = 0.506; // each container square's side, as a fraction of min(width,height) — 0.46 base, +10%
    const CONTAINER_HOLE_FRAC = 0.6; // each container square is a hollow frame; hole side, as a fraction of the outer side
    const ANCHOR_X_FRAC = 0.78; // horizontal position of the container-square pair's midpoint, as a fraction of canvas width (0.5 = centered, higher = further right)

    // ---------- state ----------
    let t0;
    const nextSizeFactor = createCtaProximityDriver(p, getInfluenceRects, {
        min: MIN_SIZE_FACTOR,
        max: MAX_SIZE_FACTOR,
        ease: PROXIMITY_EASE,
        radius: INFLUENCE_RADIUS
    });

    // Is point (px, py) inside an axis-aligned square centered at (cx, cy) with
    // side length `size`?
    function pointInSquare(px, py, cx, cy, size) {
        const half = size / 2;
        return p.abs(px - cx) <= half && p.abs(py - cy) <= half;
    }

    // Is point (px, py) inside a hollow square "frame" (an outer square with a
    // smaller concentric square hole cut out of its middle)?
    function pointInFrame(px, py, cx, cy, outerSize, holeSize) {
        return pointInSquare(px, py, cx, cy, outerSize) && !pointInSquare(px, py, cx, cy, holeSize);
    }

    // 4 corners of an axis-aligned square, used only to size the bounding box
    // the oscillating grid is generated over.
    function squareCorners(cx, cy, size) {
        return [
            [cx - size / 2, cy - size / 2],
            [cx + size / 2, cy - size / 2],
            [cx + size / 2, cy + size / 2],
            [cx - size / 2, cy + size / 2]
        ];
    }

    p.setup = () => {
        const rect = container.getBoundingClientRect();
        p.createCanvas(rect.width, rect.height).parent(container);
        p.rectMode(p.CENTER);
        p.noStroke();
        t0 = p.millis();
    };

    p.updateSize = () => {
        const rect = container.getBoundingClientRect();
        if (Math.round(rect.width) === p.width && Math.round(rect.height) === p.height) return;
        p.resizeCanvas(rect.width, rect.height);
    };

    p.draw = () => {
        p.clear(); // transparent backdrop — lets the section behind it show through

        const t = (p.millis() - t0) / 1000;

        // Square size eases toward how close the mouse is to any CTA — nearer a button
        // (or inside it) pushes it toward MAX_SIZE_FACTOR, decaying back to MIN_SIZE_FACTOR
        // past INFLUENCE_RADIUS away from all of them (see proximityDrivers.js).
        const sizeFactor = nextSizeFactor();

        // ---- independent sine oscillators driving the grid's square counts ----
        const numCols = p.floor(p.map(p.sin(t * COL_FREQ * p.TWO_PI), -1, 1, MIN_COLS, MAX_COLS + 0.999));
        const numRows = p.floor(p.map(p.sin(t * ROW_FREQ * p.TWO_PI + 1.7), -1, 1, MIN_ROWS, MAX_ROWS + 0.999));

        // ---- the two overlapping container squares ----
        // Square A sits bottom-left, axis aligned. Square B is the same size and
        // also axis aligned, positioned so its bottom-left corner lands exactly
        // on square A's center. Each is a hollow frame (an outer square with a
        // smaller concentric hole), not a solid square. The grid only draws where
        // a cell falls inside either frame (their union), so the pattern reads as
        // living "inside" this two-square outline shape. The pair is anchored
        // toward the right of the canvas (ANCHOR_X_FRAC) rather than centered.
        const containerSize = p.min(p.width, p.height) * CONTAINER_SIZE_FRAC;
        const holeSize = containerSize * CONTAINER_HOLE_FRAC;
        const half = containerSize / 2;
        const anchorX = p.width * ANCHOR_X_FRAC;
        const centerAx = anchorX - half / 2;
        const centerAy = p.height / 2 + half / 2;
        const centerBx = centerAx + half; // B's bottom-left corner = A's center
        const centerBy = centerAy - half;

        // Bounding box of the union, used only to lay the oscillating grid out.
        const corners = squareCorners(centerAx, centerAy, containerSize).concat(squareCorners(centerBx, centerBy, containerSize));
        const bboxLeft = Math.min(...corners.map((pt) => pt[0]));
        const bboxRight = Math.max(...corners.map((pt) => pt[0]));
        const bboxTop = Math.min(...corners.map((pt) => pt[1]));
        const bboxBottom = Math.max(...corners.map((pt) => pt[1]));
        const bboxWidth = bboxRight - bboxLeft;
        const bboxHeight = bboxBottom - bboxTop;

        const colSpacing = bboxWidth / numCols;
        const rowSpacing = bboxHeight / numRows;

        // Size scales off the local cell spacing, so at MAX_SIZE_FACTOR every
        // square is guaranteed larger than its own cell -> full overlap with
        // neighbors regardless of how sparse/dense the oscillators make the grid.
        const squareSize = p.min(colSpacing, rowSpacing) * sizeFactor;

        // faint outline so the containing frame shape reads even where no squares land
        p.stroke(255, 22);
        p.strokeWeight(1);
        p.noFill();
        p.rectMode(p.CENTER);
        p.rect(centerAx, centerAy, containerSize, containerSize);
        p.rect(centerAx, centerAy, holeSize, holeSize);
        p.rect(centerBx, centerBy, containerSize, containerSize);
        p.rect(centerBx, centerBy, holeSize, holeSize);
        p.noStroke();

        p.blendMode(p.DIFFERENCE);
        p.fill(255);

        for (let i = 0; i < numRows; i++) {
            const cy = bboxTop + rowSpacing * (i + 0.5);
            for (let j = 0; j < numCols; j++) {
                const cx = bboxLeft + colSpacing * (j + 0.5);
                const inside = pointInFrame(cx, cy, centerAx, centerAy, containerSize, holeSize) || pointInFrame(cx, cy, centerBx, centerBy, containerSize, holeSize);
                if (inside) {
                    p.square(cx, cy, squareSize);
                }
            }
        }

        p.blendMode(p.BLEND);
    };
}
