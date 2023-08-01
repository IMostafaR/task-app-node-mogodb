import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
};

export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
