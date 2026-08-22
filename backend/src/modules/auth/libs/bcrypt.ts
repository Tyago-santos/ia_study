import bcrypt from "bcrypt";

const SALT_BCRYPT = 10;

export class Bcrypt {
  async encryptPassword(password: string) {
    try {
      return await bcrypt.hash(password, SALT_BCRYPT);
    } catch (error) {
      console.error(`errro ao encrypt senha ${error}`);
      throw error;
    }
  }
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    const passwordEcrypt = await bcrypt.compare(plainPassword, hashedPassword);

    if (!passwordEcrypt) throw new Error("Senha ao comparar senhar");

    return passwordEcrypt;
  }
}
