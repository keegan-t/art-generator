# <img src="/assets/preview.png" width="40" align="center"> Abstract Art Generator

A browser-based generative art tool. Experiment with palettes, shapes, and other parameters to create and save unique abstract artworks.

**[Try it on GitHub Pages →](https://keegan-t.github.io/art-generator)**

## Features

- **Gallery view** - Browse saved artworks as a scrollable art gallery
- **Editor view** - Tune parameters while the canvas updates in real time
- **Randomize** - Shuffle all parameters to discover new combinations
- **Locking** - Lock any parameter before randomizing to preserve it
- **Save & export** - Save to your local gallery or download as a PNG
- **Persistent storage** - Artworks are saved to `localStorage`, no backend required

## Parameters

- **Palette** - Background and color theme (16 options)
- **Shape** - Type of shape used for the composition (7 options)
- **Complexity** - Density of shapes in the composition (1–10)
- **Symmetry** - Number of rotational and mirror symmetry axes (0–6)
- **Blend** - Canvas composite blend mode (11 options)
- **Scale** - Zoom level of the composition (1.0 - 3.0x)
- **Rotation** - Global rotation in 15° steps (0 - 345°)
- **Seed** - Deterministic RNG, same seed always produces the same result (0–99999)
