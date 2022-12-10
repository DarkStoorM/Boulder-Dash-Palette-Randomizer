# Boulder Dash Color Palette Randomizer

This project aims to quickly create a dimmed color palette for Boulder Dash caves.

The palette values have been somewhat fine-tuned to generate colors easier for the player's eyes, avoiding very high contrast or bright colors in general. This tool generates colors of lower purity, resulting in a dimmed pastel palette (mostly). A small trade-off, vibrant and pure colors will not appear as `Primary` and `Secondary`. All color channels have been clamped to the following values (RGB: 0-255, random exclusive):

- `Background`: 0 - 36
- `Highlights`: 180 - 221
- `Primary`: 85 - 166
- `Secondary`: 50 - 106

Refer to the [IColorTable](https://github.com/DarkStoorM/Boulder-Dash-Palette-Randomizer/blob/main/src/interfaces/IColorTable.ts) interface for the explanation on the colors. These are not the official color names. The color order is preferential from other Construction Kits. Values can be tweaked manually, when running from source (requires rebuilding `npm run src:build`).

This project was a bit rushed, some TODOs were left behind.

A separate, complementary color test is available in this [codepen](https://codepen.io/DarkStoorM/pen/jOKXZor). Not fine-tuned.

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

---

## Results

Iconic BD1 Cave A recolored with this tool:

![bd](https://user-images.githubusercontent.com/7021295/206847202-92b9d205-574e-41f9-8934-ae322c340697.png)

![bd](https://user-images.githubusercontent.com/7021295/206847468-29eaeb23-52b3-462d-a653-638267bb36dd.png)

![bd](https://user-images.githubusercontent.com/7021295/206847708-2dd130bd-3d3a-4196-9f46-bdfe00b6dd22.png)

![bd](https://user-images.githubusercontent.com/7021295/206848018-70c1007e-9ab1-44ba-a785-c217001748de.png)

Example cave:

![bd](https://user-images.githubusercontent.com/7021295/206848621-817bab7d-d242-4ac0-99e5-13e1c84267e9.png)
