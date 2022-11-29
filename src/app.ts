import { spriteManager } from "./SpriteManager";

const button = document.getElementById("reroll") as HTMLButtonElement;

if (!button) {
  throw new Error("Reroll button did not exist");
}

button.addEventListener("click", spriteManager.recolorSpritesheet);
