import "https://deno.land/std@0.185.0/dotenv/load.ts";
export default {
  PORT: Number(Deno.env.get("PORT")) || 3000,
};
