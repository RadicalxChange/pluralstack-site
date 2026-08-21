import { createVerticalAxisDriver } from '@scripts/proximityDrivers';

/**
 * "Oscillating Grid — Mark Shape" — instance-mode port of gif-2.html (project root), ported
 * the same way gridSketch.js ports gif.html, for embedding in Hero.astro's sketch panel.
 *
 * Differences from the standalone gif-2.html:
 *  - Fills its container element (resized via ResizeObserver) instead of the browser window.
 *  - Transparent background (`p.clear()` instead of `p.background(0)`), so it can sit behind
 *    the hero text as a full-bleed backdrop rather than an opaque panel.
 *  - The mark is anchored toward the right side of the canvas (ANCHOR_X_FRAC) instead of
 *    centered, to clear the text column on the left.
 *  - The slider's visuals (track, handle, label) and its click-to-drag handling are gone —
 *    there's no dedicated interactive area once this is a passive backdrop. Square size is
 *    instead driven by how close the mouse is to the vertical center of a caller-supplied
 *    axis (via the shared proximityDrivers.js) — see `getAxis` below. Unlike gridSketch.js's
 *    CTA-proximity trigger, this doesn't depend on there being CTAs nearby to react to,
 *    which matters here since a page using this variant may only have one (or none).
 *
 * @param {import('p5')} p
 * @param {HTMLElement} container
 * @param {() => {centerY: number, halfHeight: number} | null} [getAxis] - Returns the axis,
 *   in viewport Y coordinates, that the mouse's vertical position drives square size
 *   against — peaking at `centerY`, back down to resting by `halfHeight` away from it in
 *   either direction. Re-invoked every frame. Falls back to no effect (size stays at its
 *   resting/minimum value) when omitted or null.
 */
export function gridSketchMark(p, container, getAxis) {
    // ---------- tunable parameters ----------
    const MIN_COLS = 4,
        MAX_COLS = 16; // horizontal square count range
    const MIN_ROWS = 4,
        MAX_ROWS = 16; // vertical square count range
    const COL_FREQ = 0.17; // cycles/sec of the horizontal-count oscillator
    const ROW_FREQ = 0.24; // cycles/sec of the vertical-count oscillator (independent)

    const MIN_SIZE_FACTOR = 0.18; // squares much smaller than their cell -> visible gaps
    const MAX_SIZE_FACTOR = 2.6; // squares much larger than their cell -> guaranteed full overlap

    const PROXIMITY_EASE = 0.06; // how eagerly the (invisible) slider value chases the vertical-axis trigger

    // ---------- the container "mark" ----------
    // Two overlapping check/V strokes (rounded thick lines), approximating the reference
    // mark. Coordinates are normalized to a 0..1 box; x1,y1 -> x2,y2 is one thick rounded
    // segment, t is its thickness as a fraction of the mark's overall size. Left stroke pair
    // = a fairly symmetric "V"; right stroke pair = a checkmark whose long arm swoops further
    // out and lower. Tweak these points (or thickness) to nudge the shape closer to a
    // reference — everything downstream just reads this list. Unchanged from gif-2.html.
    const MARK_STROKES_NORM = [
        { x1: 0.16, y1: 0.2, x2: 0.42, y2: 0.74, t: 0.15 }, // left V — left arm
        { x1: 0.42, y1: 0.74, x2: 0.64, y2: 0.2, t: 0.15 }, // left V — right arm
        { x1: 0.36, y1: 0.24, x2: 0.58, y2: 0.74, t: 0.15 }, // right check — left arm
        { x1: 0.58, y1: 0.74, x2: 0.86, y2: 0.42, t: 0.15 } // right check — long swooping arm
    ];
    const MARK_SIZE_FRAC = 0.960498; // the mark's overall box, as a fraction of min(width,height) — 0.72 base, +10%, +5%, +5%, +10%
    const ANCHOR_X_FRAC = 0.78; // horizontal position of the mark's own center, as a fraction of canvas width (0.5 = centered, higher = further right)
    const SHOW_GUIDE_OUTLINE = false; // faint outline of the mark strokes, drawn under the grid — turn on to see the target shape, off to judge the grid alone

    // ---------- state ----------
    let t0;
    const nextSizeFactor = createVerticalAxisDriver(p, getAxis, {
        min: MIN_SIZE_FACTOR,
        max: MAX_SIZE_FACTOR,
        ease: PROXIMITY_EASE
    });

    // Shortest distance from point (px,py) to the segment (x1,y1)-(x2,y2).
    function distToSegment(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
        t = p.constrain(t, 0, 1);
        const projX = x1 + t * dx;
        const projY = y1 + t * dy;
        return p.dist(px, py, projX, projY);
    }

    // Is point (px,py) within any of the mark's thick rounded strokes (a "capsule":
    // everything within thickness/2 of the segment)?
    function pointInStrokes(px, py, strokes) {
        for (let i = 0; i < strokes.length; i++) {
            const s = strokes[i];
            if (distToSegment(px, py, s.x1, s.y1, s.x2, s.y2) <= s.thickness / 2) return true;
        }
        return false;
    }

    p.setup = () => {
        const rect = container.getBoundingClientRect();
        p.createCanvas(rect.width, rect.height).parent(container);
        p.rectMode(p.CENTER);
        p.noStroke();
        p.strokeCap(p.ROUND);
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

        // Square size eases toward how close the mouse is to the axis's vertical center —
        // peaking at MAX_SIZE_FACTOR there, decaying back to MIN_SIZE_FACTOR toward either
        // end of it (see proximityDrivers.js).
        const sizeFactor = nextSizeFactor();

        // ---- independent sine oscillators driving the grid's square counts ----
        const numCols = p.floor(p.map(p.sin(t * COL_FREQ * p.TWO_PI), -1, 1, MIN_COLS, MAX_COLS + 0.999));
        const numRows = p.floor(p.map(p.sin(t * ROW_FREQ * p.TWO_PI + 1.7), -1, 1, MIN_ROWS, MAX_ROWS + 0.999));

        // ---- the container mark, in pixel space ----
        // Anchored toward the right of the canvas (ANCHOR_X_FRAC) rather than centered.
        const markSize = p.min(p.width, p.height) * MARK_SIZE_FRAC;
        const markLeft = p.width * ANCHOR_X_FRAC - markSize / 2;
        const markTop = p.height / 2 - markSize / 2;
        const toPx = (nx, ny) => [markLeft + nx * markSize, markTop + ny * markSize];

        const strokes = MARK_STROKES_NORM.map((s) => {
            const [x1, y1] = toPx(s.x1, s.y1);
            const [x2, y2] = toPx(s.x2, s.y2);
            return { x1, y1, x2, y2, thickness: s.t * markSize };
        });

        // Bounding box of the mark (strokes + their thickness), used only to lay the
        // oscillating grid out.
        let bboxLeft = Infinity,
            bboxRight = -Infinity,
            bboxTop = Infinity,
            bboxBottom = -Infinity;
        strokes.forEach((s) => {
            const pad = s.thickness / 2;
            bboxLeft = p.min(bboxLeft, s.x1 - pad, s.x2 - pad);
            bboxRight = p.max(bboxRight, s.x1 + pad, s.x2 + pad);
            bboxTop = p.min(bboxTop, s.y1 - pad, s.y2 - pad);
            bboxBottom = p.max(bboxBottom, s.y1 + pad, s.y2 + pad);
        });
        const bboxWidth = bboxRight - bboxLeft;
        const bboxHeight = bboxBottom - bboxTop;

        const colSpacing = bboxWidth / numCols;
        const rowSpacing = bboxHeight / numRows;

        // Size scales off the local cell spacing, so at MAX_SIZE_FACTOR every
        // square is guaranteed larger than its own cell -> full overlap with
        // neighbors regardless of how sparse/dense the oscillators make the grid.
        const squareSize = p.min(colSpacing, rowSpacing) * sizeFactor;

        // faint outline so the containing mark reads even where no squares land
        if (SHOW_GUIDE_OUTLINE) {
            p.stroke(255, 22);
            p.noFill();
            strokes.forEach((s) => {
                p.strokeWeight(s.thickness);
                p.line(s.x1, s.y1, s.x2, s.y2);
            });
            p.noStroke();
        }

        p.blendMode(p.DIFFERENCE);
        p.fill(255);

        for (let i = 0; i < numRows; i++) {
            const cy = bboxTop + rowSpacing * (i + 0.5);
            for (let j = 0; j < numCols; j++) {
                const cx = bboxLeft + colSpacing * (j + 0.5);
                if (pointInStrokes(cx, cy, strokes)) {
                    p.square(cx, cy, squareSize);
                }
            }
        }

        p.blendMode(p.BLEND);
    };
}
