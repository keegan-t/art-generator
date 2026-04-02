const SIZE = 1024;

export const BACKGROUNDS = {
    rainbow: "#0a0a2a",
    neon: "#141414",
    synthwave: "#0d0014",
    monochrome: "#222222",
    pastel: "#1a1a2e",
    candy: "#1a001a",
    fire: "#1a0500",
    sunset: "#1a0a1a",
    ocean: "#00101a",
    spring: "#1a2d1a",
    summer: "#382200",
    autumn: "#2d1000",
    winter: "#00192d",
    forest: "#061008",
    earth: "#181210",
    void: "#050508",
};

export const PALETTES = {
    rainbow: [[255, 0, 0], [255, 120, 0], [255, 220, 0], [0, 210, 80], [0, 200, 200], [0, 100, 255], [160, 0, 255]],
    neon: [[255, 0, 255], [0, 255, 255], [255, 255, 0], [255, 0, 128], [128, 255, 0], [0, 128, 255]],
    synthwave: [[255, 0, 180], [160, 0, 255], [0, 200, 255], [255, 80, 200], [80, 0, 200]],
    monochrome: [[255, 255, 255], [180, 180, 180], [110, 110, 110], [60, 60, 60], [20, 20, 20]],
    pastel: [[255, 180, 210], [180, 220, 255], [200, 255, 210], [255, 230, 180], [220, 190, 255]],
    candy: [[255, 100, 180], [100, 230, 200], [255, 220, 80], [180, 100, 255], [255, 160, 100]],
    fire: [[255, 40, 0], [255, 120, 0], [255, 200, 0], [200, 20, 0], [255, 80, 20]],
    sunset: [[255, 69, 0], [255, 107, 53], [255, 140, 66], [255, 200, 40], [196, 69, 105], [155, 89, 182]],
    ocean: [[0, 180, 200], [0, 120, 180], [0, 220, 200], [20, 80, 160], [100, 240, 220]],
    spring: [[180, 230, 140], [100, 200, 120], [255, 180, 200], [200, 240, 160], [140, 210, 255]],
    summer: [[255, 240, 0], [255, 200, 0], [255, 120, 180], [255, 255, 120], [150, 255, 60]],
    autumn: [[200, 60, 0], [230, 120, 0], [180, 40, 0], [220, 160, 20], [140, 80, 20]],
    winter: [[140, 200, 255], [80, 140, 220], [200, 220, 255], [40, 80, 180], [220, 240, 255]],
    forest: [[20, 50, 10], [45, 100, 40], [80, 140, 70], [140, 180, 90], [190, 160, 80]],
    earth: [[160, 100, 60], [120, 90, 60], [180, 140, 80], [100, 120, 70], [200, 160, 100]],
    void: [[60, 0, 120], [0, 40, 100], [100, 0, 80], [20, 20, 60], [80, 20, 140]],
};

// Seeded PRNG (Mulberry32)
// Source: https://www.4rknova.com/blog/2026/03/01/mulberry32-rng
function RNG(seed) {
    let t = seed >>> 0;
    return function next() {
        t = (t + 0x6D2B79F5) >>> 0;
        let x = Math.imul(t ^ (t >>> 15), t | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}

function pickColor(paletteColor, colors, alpha = 1) {
    const [r, g, b] = colors[Math.round(paletteColor * (colors.length - 1))];
    return `rgba(${r},${g},${b},${alpha})`;
}

// Shape generators - all sizes proportional to SIZE

function generateLines(rng, count) {
    return Array.from({length: count}, () => ({
        x1: (rng() - 0.5) * SIZE, y1: (rng() - 0.5) * SIZE,
        x2: (rng() - 0.5) * SIZE, y2: (rng() - 0.5) * SIZE,
        width: 1 + rng() * 6,
        alpha: 0.3 + rng() * 0.65,
        paletteColor: rng(),
    }));
}

function generateCircles(rng, count) {
    return Array.from({length: count}, () => ({
        x: (rng() - 0.5) * SIZE, y: (rng() - 0.5) * SIZE,
        r: 8 + rng() * 140,
        alpha: 0.25 + rng() * 0.55,
        paletteColor: rng(),
    }));
}

function generatePolygons(rng, count) {
    return Array.from({length: count}, () => {
        const sides = 3 + Math.floor(rng() * 5);
        const baseR = 16 + rng() * 130;
        return {
            cx: (rng() - 0.5) * SIZE, cy: (rng() - 0.5) * SIZE,
            sides,
            radii: Array.from({length: sides}, () => baseR * (0.7 + rng() * 0.6)),
            rotation: rng() * Math.PI * 2,
            fill: rng() > 0.4,
            alpha: 0.2 + rng() * 0.6,
            paletteColor: rng(),
        };
    });
}

function generateCurves(rng, count) {
    return Array.from({length: count}, () => ({
        x0: (rng() - 0.5) * SIZE, y0: (rng() - 0.5) * SIZE,
        cx1: (rng() - 0.5) * SIZE * 1.2, cy1: (rng() - 0.5) * SIZE * 1.2,
        cx2: (rng() - 0.5) * SIZE * 1.2, cy2: (rng() - 0.5) * SIZE * 1.2,
        x1: (rng() - 0.5) * SIZE, y1: (rng() - 0.5) * SIZE,
        width: 1 + rng() * 8,
        alpha: 0.25 + rng() * 0.65,
        paletteColor: rng(),
    }));
}

function generateBlobs(rng, count) {
    return Array.from({length: count}, () => {
        const points = 4 + Math.floor(rng() * 10);
        const baseR = 20 + rng() * 120;
        return {
            cx: (rng() - 0.5) * SIZE, cy: (rng() - 0.5) * SIZE,
            points,
            radii: Array.from({length: points}, () => baseR * (0.1 + rng() * 2.5)),
            rotation: rng() * Math.PI * 2,
            fill: rng() > 0.3,
            alpha: 0.2 + rng() * 0.6,
            paletteColor: rng(),
        };
    });
}

function generateArcs(rng, count) {
    return Array.from({length: count}, () => {
        const startAngle = rng() * Math.PI * 2;
        const span = (0.3 + rng() * 1.2) * Math.PI;
        return {
            x: (rng() - 0.5) * SIZE, y: (rng() - 0.5) * SIZE,
            r: 20 + rng() * 160,
            startAngle,
            endAngle: startAngle + span,
            width: 2 + rng() * 10,
            alpha: 0.3 + rng() * 0.6,
            paletteColor: rng(),
        };
    });
}

function generateSpirals(rng, count) {
    return Array.from({length: count}, () => ({
        cx: (rng() - 0.5) * SIZE, cy: (rng() - 0.5) * SIZE,
        turns: 1.5 + rng() * 3.5,
        maxR: 30 + rng() * 180,
        startAngle: rng() * Math.PI * 2,
        width: 1 + rng() * 6,
        alpha: 0.3 + rng() * 0.6,
        paletteColor: rng(),
    }));
}

const generators = {
    lines: generateLines,
    circles: generateCircles,
    polygons: generatePolygons,
    curves: generateCurves,
    blobs: generateBlobs,
    arcs: generateArcs,
    spirals: generateSpirals
};

// Canvas drawing

function drawShapes(ctx, shape, shapes, colors) {
    if (shape === "lines") {
        shapes.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = pickColor(s.paletteColor, colors);
            ctx.lineWidth = s.width;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(s.x1, s.y1);
            ctx.lineTo(s.x2, s.y2);
            ctx.stroke();
        });
    } else if (shape === "circles") {
        shapes.forEach(s => {
            const color = pickColor(s.paletteColor, colors);
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = pickColor(s.paletteColor, colors, s.alpha * 0.6);
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    } else if (shape === "polygons") {
        shapes.forEach(s => {
            const color = pickColor(s.paletteColor, colors);
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let j = 0; j < s.sides; j++) {
                const angle = s.rotation + (j / s.sides) * Math.PI * 2;
                const x = s.cx + Math.cos(angle) * s.radii[j];
                const y = s.cy + Math.sin(angle) * s.radii[j];
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            if (s.fill) ctx.fill();
            ctx.stroke();
        });
    } else if (shape === "curves") {
        shapes.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = pickColor(s.paletteColor, colors);
            ctx.lineWidth = s.width;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(s.x0, s.y0);
            ctx.bezierCurveTo(s.cx1, s.cy1, s.cx2, s.cy2, s.x1, s.y1);
            ctx.stroke();
        });
    } else if (shape === "blobs") {
        shapes.forEach(s => {
            const color = pickColor(s.paletteColor, colors);
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            const pts = s.points;
            const verts = Array.from({length: pts}, (_, j) => {
                const angle = s.rotation + (j / pts) * Math.PI * 2;
                return [s.cx + Math.cos(angle) * s.radii[j], s.cy + Math.sin(angle) * s.radii[j]];
            });
            const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
            ctx.moveTo(...mid(verts[pts - 1], verts[0]));
            for (let j = 0; j < pts; j++) {
                const curr = verts[j];
                const next = verts[(j + 1) % pts];
                ctx.quadraticCurveTo(curr[0], curr[1], ...mid(curr, next));
            }
            ctx.closePath();
            if (s.fill) ctx.fill();
            ctx.stroke();
        });
    } else if (shape === "arcs") {
        shapes.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = pickColor(s.paletteColor, colors);
            ctx.lineWidth = s.width;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, s.startAngle, s.endAngle);
            ctx.stroke();
        });
    } else if (shape === "spirals") {
        shapes.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = pickColor(s.paletteColor, colors);
            ctx.lineWidth = s.width;
            ctx.lineCap = "round";
            ctx.beginPath();
            const steps = 120;
            const totalAngle = s.turns * Math.PI * 2;
            for (let j = 0; j <= steps; j++) {
                const t = j / steps;
                const angle = s.startAngle + t * totalAngle;
                const r = t * s.maxR;
                const x = s.cx + Math.cos(angle) * r;
                const y = s.cy + Math.sin(angle) * r;
                if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
    }
}

export function drawArtwork(canvas, {
    palette,
    symmetry,
    shape,
    complexity,
    seed,
    blendMode,
    scale,
    rotation
}) {
    const ctx = canvas.getContext("2d");
    canvas.width = SIZE;
    canvas.height = SIZE;

    const rng = RNG(seed);
    const colors = PALETTES[palette];
    const shapes = generators[shape](rng, complexity * 8);

    // Draw to an offscreen canvas first to handle transparent pixels
    const offscreen = document.createElement("canvas");
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const off = offscreen.getContext("2d");

    off.fillStyle = BACKGROUNDS[palette];
    off.fillRect(0, 0, SIZE, SIZE);

    off.save();
    off.translate(SIZE / 2, SIZE / 2);
    off.rotate(rotation);
    off.scale(scale, scale);
    off.globalCompositeOperation = blendMode;

    if (symmetry === 0) {
        drawShapes(off, shape, shapes, colors);
    } else {
        for (let i = 0; i < symmetry; i++) {
            const angle = (Math.PI * 2 / symmetry) * i;
            off.save();
            off.rotate(angle);
            drawShapes(off, shape, shapes, colors);
            off.restore();

            off.save();
            off.rotate(angle);
            off.scale(-1, 1);
            drawShapes(off, shape, shapes, colors);
            off.restore();
        }
    }

    off.restore();

    ctx.fillStyle = "#090909";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.drawImage(offscreen, 0, 0);
}
