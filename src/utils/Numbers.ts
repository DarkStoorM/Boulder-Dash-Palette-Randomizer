export class Numbers {
  public static int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
}
