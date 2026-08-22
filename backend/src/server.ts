import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
  console.log(`servidor rodando na porta ${env.PORT}`);
});
