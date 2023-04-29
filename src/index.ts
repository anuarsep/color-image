import config from "./config.ts";
import { Application, oakCors } from "./deep.ts";
import routes from "./routes.ts";

const app = new Application();

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(
  oakCors({
    credentials: true,
    origin: "*",
  })
);

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Routes
app.use(routes.routes());
app.use(routes.allowedMethods());

const port = config.PORT;
console.log(`Server on port: ${port}`);
await app.listen({ port });
