import { Colors } from "./color.ts";
import { Router } from "./deep.ts";

const router = new Router();

router.post("/image", async ({ request, response }) => {
  const { image }: { image: string } = await request.body({ type: "json" })
    .value;

  const imageUrl = !image.includes("http") ? `https://${image}` : image;

  const buffer = await fetch(imageUrl).then((res) => res.arrayBuffer());

  const colors = new Colors(buffer);
  await colors.init();

  response.body = {
    hex: colors.hexPredominant,
    rgb: colors.rgbPredominant,
  };
});

export default router;
