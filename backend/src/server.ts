import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log("servido rodando na porta https:localhost:3000");
});
