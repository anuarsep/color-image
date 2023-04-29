import { encode } from "https://deno.land/std@0.106.0/encoding/base64.ts";

export class DataImage {
  private readonly imgBase64: string;
  public readonly dataUrl: string;

  constructor(buffer: ArrayBuffer) {
    this.imgBase64 = encode(new Uint8Array(buffer));
    this.dataUrl = `data:image/jpeg;base64,${this.imgBase64}`;
  }
}
