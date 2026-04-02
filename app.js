import {drawArtwork} from "./art.js";

const PALETTES = ["rainbow", "neon", "synthwave", "monochrome", "pastel", "candy", "fire", "sunset", "ocean", "spring", "summer", "autumn", "winter", "forest", "earth", "void"];
const SHAPES = ["lines", "circles", "polygons", "curves", "blobs", "arcs", "spirals"];
const BLEND_MODES = ["source-over", "screen", "overlay", "multiply", "difference", "color-dodge", "hard-light", "exclusion", "soft-light", "xor", "luminosity"];
const BLEND_LABELS = ["Normal", "Screen", "Overlay", "Multiply", "Difference", "Color Dodge", "Hard Light", "Exclusion", "Soft Light", "XOR", "Luminosity"];

const toTitleCase = s => s[0].toUpperCase() + s.slice(1);
const formatDate = ts => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};
const rand = n => Math.floor(Math.random() * n);

// === LocalStorage ===

function getArtworks() {
    return JSON.parse(localStorage.getItem("artworks") || "[]");
}

function setArtworks(list) {
    localStorage.setItem("artworks", JSON.stringify(list));
}

// === Editor state ===

let editingId = null;
let editingCreated = null;
let params = defaultParams();

const locks = {
    seed: false, palette: false, shape: false,
    complexity: false, symmetry: false, blend: false,
    scale: false, rotation: false,
};

function defaultParams() {
    return {
        title: "",
        palette: 0,
        shape: 0,
        complexity: 5,
        symmetry: 0,
        blend: 0,
        scale: 10,
        rotation: 0,
        seed: rand(99999)
    };
}

// === DOM ===

const galleryView = document.getElementById("gallery-view");
const editorView = document.getElementById("editor-view");
const galleryList = document.getElementById("gallery-list");
const previewCanvas = document.getElementById("preview-canvas");
const titleInput = document.getElementById("title-input");
const seedInput = document.getElementById("seed-input");

const sliders = {
    palette: document.getElementById("palette-slider"),
    shape: document.getElementById("shape-slider"),
    complexity: document.getElementById("complexity-slider"),
    symmetry: document.getElementById("symmetry-slider"),
    blend: document.getElementById("blend-slider"),
    scale: document.getElementById("scale-slider"),
    rotation: document.getElementById("rotation-slider"),
};

const labels = {
    palette: document.getElementById("palette-label"),
    shape: document.getElementById("shape-label"),
    complexity: document.getElementById("complexity-label"),
    symmetry: document.getElementById("symmetry-label"),
    blend: document.getElementById("blend-label"),
    scale: document.getElementById("scale-label"),
    rotation: document.getElementById("rotation-label"),
};

function fillSlider(slider) {
    const min = Number(slider.min), max = Number(slider.max), val = Number(slider.value);
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary) ${percent}%, var(--surface-3) ${percent}%)`;
}

// === Gallery ===

function showGallery() {
    editorView.classList.add("hidden");
    galleryView.classList.remove("hidden");
    renderGallery();
}

function renderGallery() {
    const artworks = getArtworks();
    galleryList.innerHTML = "";

    if (artworks.length === 0) {
        galleryList.innerHTML =
            `<div class="empty-state">
                <span class="empty-title">No artworks yet</span>
                <span class="empty-sub">Click New to create your first piece</span>
             </div>`;
        return;
    }

    const grid = document.createElement("div");
    grid.className = "gallery-grid";
    artworks.forEach(a => grid.appendChild(createCard(a)));
    galleryList.appendChild(grid);
}

function createCard(artwork) {
    const card = document.createElement("div");
    card.className = "card";

    const canvas = document.createElement("canvas");
    canvas.className = "card-canvas";
    drawArtwork(canvas, artworkToParams(artwork));

    const overlay = document.createElement("div");
    overlay.className = "card-overlay";

    const title = document.createElement("span");
    title.className = "card-title";
    title.textContent = artwork.title;

    const date = document.createElement("span");
    date.className = "card-date";
    date.textContent = formatDate(artwork.created);

    overlay.append(title, date);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "card-delete";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", e => {
        e.stopPropagation();
        if (confirm("Delete this artwork?")) {
            setArtworks(getArtworks().filter(a => a.id !== artwork.id));
            renderGallery();
        }
    });

    card.append(canvas, overlay, deleteBtn);
    card.addEventListener("click", () => showEditor(artwork.id));
    return card;
}

function artworkToParams(artwork) {
    return {
        palette: PALETTES[artwork.palette],
        shape: SHAPES[artwork.shape],
        complexity: artwork.complexity,
        symmetry: artwork.symmetry,
        seed: artwork.seed,
        blendMode: BLEND_MODES[artwork.blend],
        scale: artwork.scale / 10,
        rotation: artwork.rotation * 15 * Math.PI / 180,
    };
}

// === Editor ===

function showEditor(id = null) {
    editingId = id;

    if (id !== null) {
        const artwork = getArtworks().find(a => a.id === id);
        if (!artwork) return;
        editingCreated = artwork.created;
        params = {
            title: artwork.title,
            palette: artwork.palette,
            shape: artwork.shape,
            complexity: artwork.complexity,
            symmetry: artwork.symmetry,
            blend: artwork.blend ?? 0,
            scale: artwork.scale ?? 10,
            rotation: artwork.rotation ?? 0,
            seed: artwork.seed,
        };
    } else {
        editingCreated = null;
        params = defaultParams();
    }

    syncControls();
    galleryView.classList.add("hidden");
    editorView.classList.remove("hidden");
    redraw();
}

function syncControls() {
    titleInput.value = params.title;
    seedInput.value = String(params.seed);
    sliders.palette.value = params.palette;
    sliders.shape.value = params.shape;
    sliders.complexity.value = params.complexity;
    sliders.symmetry.value = params.symmetry;
    sliders.blend.value = params.blend;
    sliders.scale.value = params.scale;
    sliders.rotation.value = params.rotation;
    Object.values(sliders).forEach(fillSlider);
    updateLabels();
}

function updateLabels() {
    labels.palette.textContent = toTitleCase(PALETTES[params.palette]);
    labels.shape.textContent = toTitleCase(SHAPES[params.shape]);
    labels.complexity.textContent = params.complexity;
    labels.symmetry.textContent = params.symmetry;
    labels.blend.textContent = BLEND_LABELS[params.blend];
    labels.scale.textContent = (params.scale / 10).toFixed(1) + "×";
    labels.rotation.textContent = params.rotation * 15 + "°";
}

function redraw() {
    drawArtwork(previewCanvas, {
        palette: PALETTES[params.palette],
        shape: SHAPES[params.shape],
        complexity: params.complexity,
        symmetry: params.symmetry,
        seed: params.seed,
        blendMode: BLEND_MODES[params.blend],
        scale: params.scale / 10,
        rotation: params.rotation * 15 * Math.PI / 180,
    });
}

// === Slider events ===

Object.entries(sliders).forEach(([name, slider]) => {
    slider.addEventListener("input", () => {
        params[name] = Number(slider.value);
        fillSlider(slider);
        updateLabels();
        redraw();
    });
});

// === Other input events ===

titleInput.addEventListener("input", () => {
    params.title = titleInput.value;
});

seedInput.addEventListener("input", () => {
    const clean = seedInput.value.replace(/[^0-9]/g, "").slice(0, 5);
    seedInput.value = clean;
    params.seed = clean === "" ? 0 : parseInt(clean, 10);
    redraw();
});

document.getElementById("random-seed-btn").addEventListener("click", () => {
    if (locks.seed) return;
    params.seed = rand(99999);
    seedInput.value = String(params.seed);
    redraw();
});

// === Lock buttons ===

document.querySelectorAll(".lock-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const param = btn.dataset.param;
        locks[param] = !locks[param];
        btn.textContent = locks[param] ? "🔒" : "🔓";
        btn.classList.toggle("locked", locks[param]);
        btn.closest(".slider-field, .control-field").classList.toggle("locked", locks[param]);
    });
});

// === Randomize ===

document.getElementById("randomize-btn").addEventListener("click", () => {
    if (!locks.palette) params.palette = rand(PALETTES.length);
    if (!locks.shape) params.shape = rand(SHAPES.length);
    if (!locks.complexity) params.complexity = 1 + rand(10);
    if (!locks.symmetry) params.symmetry = rand(7);
    if (!locks.blend) params.blend = rand(BLEND_MODES.length);
    if (!locks.scale) params.scale = 10 + rand(21);
    if (!locks.rotation) params.rotation = rand(24);
    if (!locks.seed) params.seed = rand(99999);
    syncControls();
    redraw();
});

// === Footer buttons ===

document.getElementById("save-btn").addEventListener("click", () => {
    if (!params.title.trim()) {
        params.title = "Untitled";
    }

    const artworks = getArtworks();

    if (editingId !== null) {
        const idx = artworks.findIndex(a => a.id === editingId);
        if (idx !== -1) artworks[idx] = {id: editingId, created: editingCreated, ...params};
    } else {
        const now = Date.now();
        artworks.push({id: now, created: now, ...params});
    }

    setArtworks(artworks);
    showGallery();
});

document.getElementById("download-btn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${params.title || "artwork"}.png`;
    link.href = previewCanvas.toDataURL("image/png");
    link.click();
});

document.getElementById("cancel-btn").addEventListener("click", showGallery);
document.getElementById("new-btn").addEventListener("click", () => showEditor(null));

document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Delete all artworks?")) {
        setArtworks([]);
        renderGallery();
    }
});

// === Init ===
showGallery();
