import { nanoid } from "nanoid";

export const generateIdpId = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const datePrefix = `${year}${month}${day}`;
  const randomId = nanoid(10);

  return `${datePrefix}${randomId}`;
};

export const generateImageId = (): string => {
  return nanoid();
};
