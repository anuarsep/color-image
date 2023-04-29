import { DataImage } from "./data.image.ts";
import { canvas as mod } from "./deep.ts";

interface ColorsQuantity {
  [color: string]: number;
}

export class Colors {
  public readonly colorsHex: ColorsQuantity;
  public readonly colorsRgb: ColorsQuantity;
  private readonly dataImageService: DataImage;
  private image: Uint8ClampedArray | undefined;
  public rgbPredominant: string | undefined;
  public hexPredominant: string | undefined;

  constructor(buffer: ArrayBuffer) {
    this.colorsHex = {};
    this.colorsRgb = {};
    this.dataImageService = new DataImage(buffer);
  }

  public async init(): Promise<void> {
    await this.load();
    this.setColors();
    this.setPredominant();
  }

  private getPredominant(colors: ColorsQuantity): string {
    return Object.keys(colors).reduce((a, b) =>
      colors[a] > colors[b] ? a : b
    );
  }

  private async load(): Promise<void> {
    try {
      const img = await mod.loadImage(this.dataImageService.dataUrl);
      const canvas = mod.createCanvas(img.width(), img.height());
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      this.image = ctx.getImageData(0, 0, img.width(), img.height()).data;
    } catch (error) {
      console.log(error);
      throw new Error("Error loading image");
    }
  }

  private setColors() {
    for (let i = 0; i < this.image!.length; i += 4) {
      const r = this.image![i];
      const g = this.image![i + 1];
      const b = this.image![i + 2];
      const hex =
        "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
      this.colorsHex[hex] = (this.colorsHex[hex] || 0) + 1;

      const rgb = `rgb(${r}, ${g}, ${b})`;
      this.colorsRgb[rgb] = (this.colorsRgb[rgb] || 0) + 1;
    }
  }
  private setPredominant(): void {
    this.hexPredominant = this.getPredominant(this.colorsHex);
    this.rgbPredominant = this.getPredominant(this.colorsRgb);
  }
}
