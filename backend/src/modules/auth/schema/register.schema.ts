import z, { email } from "zod";

export const registerSchema = z.object({
  name: z.string("nome precisa ter 2 ou mais caracteres").min(2).max(30),
  email: z.email("email inválido"),
  password: z.string("Senha precisa ter mais de 6 caracteres").min(6),
});
