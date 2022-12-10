# Boulder Dash Color Palette Randomizer

This project aims to quickly create a dimmed color palette for Boulder Dash caves.

The palette values have been somewhat fine-tuned to generate colors easier for the player's eyes, avoiding very high contrast or bright colors in general. All color channels have been clamped to the following values:

- `Background`: 0 - 36
- `Highlights`: 180 - 221
- `Primary`: 85 - 166
- `Secondary`: 50 - 106

Refer to the [IColorTable](https://github.com/DarkStoorM/Boulder-Dash-Palette-Randomizer/blob/main/src/interfaces/IColorTable.ts) interface for the explanation on the colors.

This project was a bit rushed, some TODOs were left behind.

---

## Running from source

```bash
git clone https://github.com/DarkStoorM/Boulder-Dash-Palette-Randomizer
```

Install dependencies (this will also build the source):

```bash
npm i
```

Run from CLI (not tested for UNIX) or from `/app/index.html`

```bash
npm start
```

or grab a [release](https://github.com/DarkStoorM/Boulder-Dash-Palette-Randomizer/releases).
