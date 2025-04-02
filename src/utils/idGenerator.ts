import { customAlphabet, nanoid } from "nanoid";

export const generateIdpId = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const datePrefix = `${year}${month}${day}`;
  const generateRandomId = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    10
  );

  const randomId = generateRandomId(6);

  return `${datePrefix}${randomId}`;
};

export const generateImageId = (): string => {
  return nanoid();
};
